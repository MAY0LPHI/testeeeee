import { downloadMediaMessage } from 'whaileys';
import { logger } from './connect.js';
import { 
  normalizeJid, 
  isGroup, 
  getNumber,
  RateLimiter,
  AntiDeleteCache,
  MessageQueue,
  sanitizeText
} from './utils/helpers.js';
import { groupDB, userDB, configDB } from './utils/database.js';
import config from './config.json' with { type: 'json' };
import * as menus from './menus/index.js';
import { commandHandler } from './funcs/exports.js';
import * as colorLogger from './utils/colorLogger.js';

/**
 * Processador principal de mensagens do Hinokami Bot 🗡️🔥
 * Detecta comandos, verifica permissões, gerencia cooldowns e executa handlers
 */

// Instâncias de controle
const rateLimiter = new RateLimiter(
  config.limits?.maxCommandsPerMinute || 10,
  60000
);
const antiDeleteCache = new AntiDeleteCache();
const messageQueue = new MessageQueue(config.limits?.messageQueueSize || 100);

/**
 * Handler principal de mensagens
 */
export async function handleMessage(sock, m) {
  try {
    // Extração de dados da mensagem
    const messageType = Object.keys(m.message || {})[0];
    const messageContent = m.message?.[messageType];
    
    // Informações básicas
    const from = m.key.remoteJid;
    const isGroupMsg = isGroup(from);
    const sender = m.key.participant || m.key.remoteJid;
    const senderNumber = getNumber(sender);
    
    // Texto da mensagem
    let body = '';
    if (messageType === 'conversation') {
      body = m.message.conversation;
    } else if (messageType === 'extendedTextMessage') {
      body = m.message.extendedTextMessage.text;
    } else if (messageType === 'imageMessage' && m.message.imageMessage.caption) {
      body = m.message.imageMessage.caption;
    } else if (messageType === 'videoMessage' && m.message.videoMessage.caption) {
      body = m.message.videoMessage.caption;
    }

    body = sanitizeText(body);
    
    // Log mensagem normal (não comando)
    if (body && !body.startsWith(config.prefix || '!')) {
      colorLogger.logMessage(senderNumber, isGroupMsg, body);
    }
    
    // Salvar mensagem no cache anti-delete
    if (config.features?.antiDelete && m.key.id) {
      antiDeleteCache.saveMessage(m.key.id, {
        messageId: m.key.id,
        sender,
        from,
        body,
        timestamp: Date.now(),
        messageType,
        message: m.message
      });
    }

    // Verificar se é comando
    const prefix = config.prefix || '!';
    if (!body.startsWith(prefix)) return;

    // Extrair comando e argumentos
    const args = body.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName) return;

    // Auto-read se configurado
    if (config.autoRead) {
      await sock.readMessages([m.key]);
    }

    // Auto-typing se configurado
    if (config.autoTyping) {
      await sock.sendPresenceUpdate('composing', from);
    }

    // Verificar blacklist global
    if (configDB.isBlacklisted(sender)) {
      colorLogger.logBlacklist(senderNumber, commandName, prefix);
      logger.warn(`Usuário na blacklist tentou usar comando: ${senderNumber}`);
      return;
    }

    // Rate limiting
    if (!rateLimiter.check(sender)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(sender) / 1000);
      colorLogger.logRateLimit(senderNumber, remainingTime);
      await sendMessage(sock, from, 
        `⚠️ Você está enviando comandos muito rápido!\n\n` +
        `🕐 Aguarde ${remainingTime}s e tente novamente.\n\n` +
        `💡 A Respiração do Sol precisa de descanso!`
      );
      return;
    }

    // Verificar cooldown por usuário/comando
    if (userDB.checkCooldown(sender, commandName)) {
      const cooldownTime = Math.ceil(userDB.getCooldownTime(sender, commandName) / 1000);
      colorLogger.logCooldown(senderNumber, commandName, cooldownTime, prefix);
      await sendMessage(sock, from,
        `⏳ Cooldown ativo para este comando!\n\n` +
        `🕐 Aguarde ${cooldownTime}s.`
      );
      return;
    }

    // Obter informações do grupo (se aplicável)
    let groupMetadata = null;
    let groupAdmins = [];
    let isBotAdmin = false;
    
    if (isGroupMsg) {
      try {
        groupMetadata = await sock.groupMetadata(from);
        groupAdmins = groupMetadata.participants
          .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
          .map(p => p.id);
        
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        isBotAdmin = groupAdmins.includes(botNumber);
      } catch (error) {
        logger.error('Erro ao obter metadados do grupo:', error);
      }
    }

    // Verificar permissões
    const permissions = {
      isOwner: configDB.isOwner(sender),
      isGroupAdmin: groupAdmins.includes(sender),
      isBotAdmin,
      isMod: isGroupMsg ? groupDB.isMod(from, sender) : false,
      isGroup: isGroupMsg
    };

    // Contexto da mensagem
    const context = {
      sock,
      m,
      from,
      sender,
      senderNumber,
      body,
      args,
      commandName,
      prefix,
      isGroupMsg,
      groupMetadata,
      permissions,
      messageType,
      quoted: m.message?.extendedTextMessage?.contextInfo?.quotedMessage || null,
      quotedMsg: m.message?.extendedTextMessage?.contextInfo || null
    };

    // Log do comando
    colorLogger.logCommand(commandName, senderNumber, isGroupMsg, prefix);
    logger.info(`Comando: ${commandName} | De: ${senderNumber} | Grupo: ${isGroupMsg}`);

    // Processar comando
    await processCommand(context);

    // Definir cooldown
    const cooldownDuration = config.features?.cooldown || 3;
    userDB.setCooldown(sender, commandName, cooldownDuration * 1000);

    // Atualizar estatísticas de usuário
    const userData = userDB.getUser(sender);
    userData.commandCount++;
    userData.lastCommand = Date.now();
    userDB.set(sender, userData);

    // Atualizar XP se em grupo e sistema de level ativo
    if (isGroupMsg && config.features?.levelSystem) {
      const group = groupDB.getGroup(from);
      if (group.settings.levelSystem) {
        const xpGain = Math.floor(Math.random() * 15) + 10;
        const result = groupDB.addXP(from, sender, xpGain);
        
        if (result.leveledUp) {
          await sendMessage(sock, from,
            `🎉 *Parabéns!* 🎉\n\n` +
            `@${senderNumber} subiu para o nível *${result.level}*!\n\n` +
            `🗡️ Continue treinando a Respiração do Sol!`,
            { mentions: [sender] }
          );
        }
      }
    }

  } catch (error) {
    colorLogger.logError('Handler de Mensagem', error);
    logger.error('Erro no handler de mensagem:', error);
    
    // Enviar mensagem de erro se possível
    try {
      await sendMessage(sock, from,
        `❌ *Erro ao processar comando*\n\n` +
        `Detalhes: ${error.message}\n\n` +
        `💡 Tente novamente ou contate o dono do bot.`
      );
    } catch (sendError) {
      logger.error('Erro ao enviar mensagem de erro:', sendError);
    }
  }
}

/**
 * Processa comando específico
 */
async function processCommand(ctx) {
  const { commandName, sock, from, permissions, args } = ctx;

  // Aliases de comandos
  const aliases = {
    'help': 'menu',
    'ajuda': 'menu',
    'comandos': 'menu',
    'menuadm': 'menuadmin',
    'menudono': 'menuowner',
    'menudiversao': 'menufun',
    'menuferramentas': 'menutools',
    'menudownloads': 'menudown'
  };

  const cmd = aliases[commandName] || commandName;

  // Comandos de menu
  const menuCommands = {
    menu: async () => {
      const senderName = ctx.m.pushName || 'Guerreiro';
      const groupName = ctx.groupMetadata?.subject || '';
      const menuText = menus.buildMainMenu({ senderName, groupName, prefix: ctx.prefix });
      await sendMessage(sock, from, menuText);
    },
    menudown: async () => {
      await sendMessage(sock, from, menus.buildDownloadsMenu(ctx.prefix));
    },
    menuadmin: async () => {
      if (!permissions.isGroup) {
        return await sendMessage(sock, from, '❌ Este comando só funciona em grupos!');
      }
      await sendMessage(sock, from, menus.buildAdminMenu(ctx.prefix));
    },
    menufun: async () => {
      await sendMessage(sock, from, menus.buildFunMenu(ctx.prefix));
    },
    menutools: async () => {
      await sendMessage(sock, from, menus.buildToolsMenu(ctx.prefix));
    },
    menuia: async () => {
      await sendMessage(sock, from, menus.buildAIMenu(ctx.prefix));
    },
    menuowner: async () => {
      if (!permissions.isOwner) {
        return await sendMessage(sock, from, '❌ Apenas o dono pode usar este comando!');
      }
      await sendMessage(sock, from, menus.buildOwnerMenu(ctx.prefix));
    },
    ping: async () => {
      const start = Date.now();
      const sent = await sendMessage(sock, from, '🏓 Calculando ping...');
      const latency = Date.now() - start;
      await sock.sendMessage(from, {
        text: `🏓 *Pong!*\n\n⚡ Latência: ${latency}ms\n🔥 Velocidade da Respiração do Sol!`,
        edit: sent.key
      });
    },
    uptime: async () => {
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);
      const formatted = `${hours}h ${minutes}m ${seconds}s`;
      await sendMessage(sock, from,
        `⏱️ *Tempo Online*\n\n` +
        `🕐 ${formatted}\n\n` +
        `🗡️ Protegendo incansavelmente!`
      );
    }
  };

  // Executar comando de menu
  if (menuCommands[cmd]) {
    await menuCommands[cmd]();
    return;
  }

  // Delegar para handler de comandos específicos
  const handled = await commandHandler(ctx);
  
  if (!handled) {
    await sendMessage(sock, from,
      `❓ *Comando não encontrado*\n\n` +
      `Comando: *${ctx.prefix}${commandName}*\n\n` +
      `💡 Use *${ctx.prefix}menu* para ver comandos disponíveis.`
    );
  }
}

/**
 * Helper para enviar mensagens
 */
async function sendMessage(sock, to, text, options = {}) {
  try {
    return await sock.sendMessage(to, {
      text,
      ...options
    });
  } catch (error) {
    logger.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

/**
 * Helper para baixar mídia de mensagem
 */
export async function downloadMedia(message) {
  try {
    const buffer = await downloadMediaMessage(message, 'buffer', {});
    return buffer;
  } catch (error) {
    logger.error('Erro ao baixar mídia:', error);
    throw error;
  }
}

export default handleMessage;
