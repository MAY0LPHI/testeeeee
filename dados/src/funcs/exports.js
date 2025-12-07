import { logger } from '../connect.js';
import { groupDB, configDB } from '../utils/database.js';
import { normalizeJid, isValidUrl, downloadFile } from '../utils/helpers.js';
import * as menuHandlers from './menuHandlers.js';
import { handleSticker as stickerHandler, handleFsticker as fstickerHandler } from '../commands/sticker.js';

/**
 * Exporta todos os handlers de comandos do Hinokami Bot
 * Organiza comandos por categoria e delega execução
 */

/**
 * Handler principal que roteia comandos para categorias
 */
export async function commandHandler(ctx) {
  const { commandName, permissions } = ctx;

  // Mapa de comandos por categoria
  const commandMap = {
    // Menu commands
    menu: { handler: menuHandlers.handleMenuPrincipal },
    menuprincipal: { handler: menuHandlers.handleMenuPrincipal },
    menudono: { handler: menuHandlers.handleMenuDono },
    donomenu: { handler: menuHandlers.handleMenuDono },
    menuadm: { handler: menuHandlers.handleMenuAdm },
    menuadms: { handler: menuHandlers.handleMenuAdm },
    adm: { handler: menuHandlers.handleMenuAdm },
    menupremium: { handler: menuHandlers.handleMenuPremium },
    menuprem: { handler: menuHandlers.handleMenuPremium },
    menudownloads: { handler: menuHandlers.handleMenuDownloads },
    menudown: { handler: menuHandlers.handleMenuDownloads },
    download: { handler: menuHandlers.handleMenuDownloads },
    figurinhas: { handler: menuHandlers.handleMenuFigurinhas },
    menufigurinhas: { handler: menuHandlers.handleMenuFigurinhas },
    pesquisas: { handler: menuHandlers.handleMenuPesquisas },
    menupesquisas: { handler: menuHandlers.handleMenuPesquisas },
    aleatorios: { handler: menuHandlers.handleMenuAleatorios },
    menualeatorios: { handler: menuHandlers.handleMenuAleatorios },
    informativos: { handler: menuHandlers.handleMenuInformativos },
    menuinformativos: { handler: menuHandlers.handleMenuInformativos },
    brincadeiras: { handler: menuHandlers.handleMenuBrincadeiras },
    brincadeira: { handler: menuHandlers.handleMenuBrincadeiras },
    logos: { handler: menuHandlers.handleMenuLogos },
    menulogos: { handler: menuHandlers.handleMenuLogos },
    menulogo: { handler: menuHandlers.handleMenuLogos },
    menucoins: { handler: menuHandlers.handleMenuCoins },
    modocoins: { handler: menuHandlers.handleMenuCoins },
    efeitosimg: { handler: menuHandlers.handleMenuEfeitosImg },
    menuefeitosimg: { handler: menuHandlers.handleMenuEfeitosImg },
    outros: { handler: menuHandlers.handleMenuOutros },
    menuoutros: { handler: menuHandlers.handleMenuOutros },
    
    // Admin commands
    ban: { handler: handleBan, requireAdmin: true, requireGroup: true },
    kick: { handler: handleKick, requireAdmin: true, requireGroup: true },
    add: { handler: handleAdd, requireAdmin: true, requireGroup: true },
    promover: { handler: handlePromote, requireAdmin: true, requireGroup: true },
    promote: { handler: handlePromote, requireAdmin: true, requireGroup: true },
    rebaixar: { handler: handleDemote, requireAdmin: true, requireGroup: true },
    demote: { handler: handleDemote, requireAdmin: true, requireGroup: true },
    antilink: { handler: handleAntilink, requireAdmin: true, requireGroup: true },
    antispam: { handler: handleAntispam, requireAdmin: true, requireGroup: true },
    antiporn: { handler: handleAntiporn, requireAdmin: true, requireGroup: true },
    mute: { handler: handleMute, requireAdmin: true, requireGroup: true },
    welcome: { handler: handleWelcome, requireAdmin: true, requireGroup: true },
    addmod: { handler: handleAddMod, requireAdmin: true, requireGroup: true },
    delmod: { handler: handleDelMod, requireAdmin: true, requireGroup: true },
    listmods: { handler: handleListMods, requireGroup: true },
    warn: { handler: handleWarn, requireAdmin: true, requireGroup: true },
    unwarn: { handler: handleUnwarn, requireAdmin: true, requireGroup: true },

    // Downloads (stubs)
    play: { handler: handlePlay, requireArgs: true },
    video: { handler: handleVideo, requireArgs: true },
    tiktok: { handler: handleTikTok, requireArgs: true },
    instagram: { handler: handleInstagram, requireArgs: true },
    pinterest: { handler: handlePinterest, requireArgs: true },
    audio: { handler: handleAudio, requireArgs: true },

    // Fun commands (stubs)
    gay: { handler: handleGay },
    gado: { handler: handleGado },
    ship: { handler: handleShip },

    // Tools (stubs)
    sticker: { handler: stickerHandler },
    fsticker: { handler: fstickerHandler },
    toimg: { handler: handleToImg },
    togif: { handler: handleToGif },
    traduzir: { handler: handleTranslate, requireArgs: true },

    // AI (stubs)
    gpt: { handler: handleGPT, requireArgs: true },
    chat: { handler: handleChat, requireArgs: true },

    // Owner commands
    broadcast: { handler: handleBroadcast, requireOwner: true, requireArgs: true },
    block: { handler: handleBlock, requireOwner: true },
    unblock: { handler: handleUnblock, requireOwner: true },
    blacklist: { handler: handleBlacklist, requireOwner: true },
    reiniciar: { handler: handleRestart, requireOwner: true },
    restart: { handler: handleRestart, requireOwner: true },
    status: { handler: handleStatus, requireOwner: true }
  };

  const command = commandMap[commandName];

  if (!command) {
    return false; // Comando não encontrado
  }

  // Verificar permissões
  if (command.requireOwner && !permissions.isOwner) {
    await sendReply(ctx, '❌ Este comando é exclusivo do dono do bot!');
    return true;
  }

  if (command.requireAdmin && !permissions.isGroupAdmin && !permissions.isOwner && !permissions.isMod) {
    await sendReply(ctx, '❌ Você precisa ser admin do grupo para usar este comando!');
    return true;
  }

  if (command.requireGroup && !permissions.isGroup) {
    await sendReply(ctx, '❌ Este comando só funciona em grupos!');
    return true;
  }

  if (command.requireArgs && ctx.args.length === 0) {
    await sendReply(ctx, `❌ Uso incorreto!\n\nUse: ${ctx.prefix}${commandName} <argumentos>`);
    return true;
  }

  // Executar handler
  try {
    await command.handler(ctx);
    return true;
  } catch (error) {
    logger.error(`Erro ao executar comando ${commandName}:`, error);
    await sendReply(ctx, `❌ Erro ao executar comando: ${error.message}`);
    return true;
  }
}

// ========== ADMIN COMMANDS ==========

async function handleBan(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin para banir membros!');
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário que deseja banir!\n\nEx: !ban @usuario');
  }

  try {
    await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
    await sendReply(ctx, `✅ Usuário banido com sucesso!\n\n🗡️ A justiça da Respiração do Sol foi aplicada!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro ao banir usuário: ${error.message}`);
  }
}

async function handleKick(ctx) {
  // Alias para ban
  return await handleBan(ctx);
}

async function handleAdd(ctx) {
  const { sock, from, args, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin para adicionar membros!');
  }

  const number = args[0]?.replace(/\D/g, '');
  
  if (!number) {
    return await sendReply(ctx, '❌ Forneça um número válido!\n\nEx: !add 5511999999999');
  }

  try {
    const jid = normalizeJid(number);
    await sock.groupParticipantsUpdate(from, [jid], 'add');
    await sendReply(ctx, `✅ Membro adicionado com sucesso!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro ao adicionar membro: ${error.message}`);
  }
}

async function handlePromote(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin!');
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !promover @usuario');
  }

  try {
    await sock.groupParticipantsUpdate(from, [mentioned], 'promote');
    await sendReply(ctx, `✅ Usuário promovido a admin!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleDemote(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin!');
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !rebaixar @usuario');
  }

  try {
    await sock.groupParticipantsUpdate(from, [mentioned], 'demote');
    await sendReply(ctx, `✅ Admin rebaixado a membro!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleAntilink(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !antilink on/off');
  }

  groupDB.updateSettings(from, { antilink: status === 'on' });
  await sendReply(ctx, `✅ Antilink ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleAntispam(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !antispam on/off');
  }

  groupDB.updateSettings(from, { antispam: status === 'on' });
  await sendReply(ctx, `✅ Antispam ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleAntiporn(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !antiporn on/off');
  }

  groupDB.updateSettings(from, { antiporn: status === 'on' });
  await sendReply(ctx, `✅ Antiporn ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleMute(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !mute on/off');
  }

  groupDB.updateSettings(from, { mute: status === 'on' });
  await sendReply(ctx, `✅ Modo mute ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleWelcome(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !welcome on/off');
  }

  groupDB.updateSettings(from, { welcome: status === 'on' });
  await sendReply(ctx, `✅ Mensagem de boas-vindas ${status === 'on' ? 'ativada' : 'desativada'}!`);
}

async function handleAddMod(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !addmod @usuario');
  }

  groupDB.addMod(from, mentioned);
  await sendReply(ctx, `✅ Moderador virtual adicionado!`);
}

async function handleDelMod(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !delmod @usuario');
  }

  groupDB.removeMod(from, mentioned);
  await sendReply(ctx, `✅ Moderador virtual removido!`);
}

async function handleListMods(ctx) {
  const { from } = ctx;
  const group = groupDB.getGroup(from);
  
  if (group.mods.length === 0) {
    return await sendReply(ctx, '📋 Não há moderadores virtuais neste grupo.');
  }

  const modList = group.mods.map((mod, i) => `${i + 1}. @${mod.split('@')[0]}`).join('\n');
  await sendReply(ctx, `👑 *Moderadores Virtuais*\n\n${modList}`, { mentions: group.mods });
}

async function handleWarn(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !warn @usuario');
  }

  const warnings = groupDB.addWarning(from, mentioned);
  await sendReply(ctx, `⚠️ Aviso aplicado!\n\nTotal de avisos: ${warnings}`);
}

async function handleUnwarn(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !unwarn @usuario');
  }

  groupDB.clearWarnings(from, mentioned);
  await sendReply(ctx, `✅ Avisos limpos!`);
}

// ========== DOWNLOAD COMMANDS (STUBS) ==========

async function handlePlay(ctx) {
  await sendReply(ctx, 
    `🎵 *Download de Música*\n\n` +
    `⚠️ TODO: Implementar integração com API de download do YouTube\n\n` +
    `Busca: ${ctx.args.join(' ')}`
  );
}

async function handleVideo(ctx) {
  await sendReply(ctx,
    `🎬 *Download de Vídeo*\n\n` +
    `⚠️ TODO: Implementar download de vídeo do YouTube\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

async function handleTikTok(ctx) {
  await sendReply(ctx,
    `📷 *Download TikTok*\n\n` +
    `⚠️ TODO: Implementar API de download sem marca d'água\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

async function handleInstagram(ctx) {
  await sendReply(ctx,
    `📸 *Download Instagram*\n\n` +
    `⚠️ TODO: Implementar download de posts/reels/stories\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

async function handlePinterest(ctx) {
  await sendReply(ctx,
    `📌 *Busca Pinterest*\n\n` +
    `⚠️ TODO: Implementar busca de imagens no Pinterest\n\n` +
    `Termo: ${ctx.args.join(' ')}`
  );
}

async function handleAudio(ctx) {
  await sendReply(ctx,
    `🔊 *Extração de Áudio*\n\n` +
    `⚠️ TODO: Implementar extração de áudio com ffmpeg\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

// ========== FUN COMMANDS (STUBS) ==========

async function handleGay(ctx) {
  const { m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned ? `@${mentioned.split('@')[0]}` : 'Você';
  const percentage = Math.floor(Math.random() * 101);
  
  await sendReply(ctx, 
    `🏳️‍🌈 *Medidor Gay*\n\n${target} é ${percentage}% gay! 🌈`,
    mentioned ? { mentions: [mentioned] } : {}
  );
}

async function handleGado(ctx) {
  const { m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned ? `@${mentioned.split('@')[0]}` : 'Você';
  const percentage = Math.floor(Math.random() * 101);
  
  await sendReply(ctx,
    `🐄 *Medidor de Gado*\n\n${target} é ${percentage}% gado! 🐄`,
    mentioned ? { mentions: [mentioned] } : {}
  );
}

async function handleShip(ctx) {
  const { m } = ctx;
  const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  
  if (mentions.length < 2) {
    return await sendReply(ctx, '❌ Marque 2 pessoas!\n\nEx: !ship @pessoa1 @pessoa2');
  }

  const percentage = Math.floor(Math.random() * 101);
  const hearts = '❤️'.repeat(Math.floor(percentage / 20));
  
  await sendReply(ctx,
    `💕 *Shipômetro*\n\n` +
    `@${mentions[0].split('@')[0]} + @${mentions[1].split('@')[0]}\n\n` +
    `${hearts}\n${percentage}%`,
    { mentions }
  );
}

// ========== TOOLS COMMANDS (STUBS) ==========
// Note: handleSticker and handleFsticker are now imported from ../commands/sticker.js

async function handleToImg(ctx) {
  await sendReply(ctx,
    `🖼️ *Sticker para Imagem*\n\n` +
    `⚠️ TODO: Implementar conversão de sticker para imagem\n\n` +
    `Responda um sticker com este comando.`
  );
}

async function handleToGif(ctx) {
  await sendReply(ctx,
    `🎞️ *Sticker para GIF*\n\n` +
    `⚠️ TODO: Implementar conversão de sticker animado para GIF\n\n` +
    `Responda um sticker animado com este comando.`
  );
}

async function handleTranslate(ctx) {
  await sendReply(ctx,
    `🌐 *Tradução*\n\n` +
    `⚠️ TODO: Implementar API de tradução\n\n` +
    `Uso: !traduzir pt <texto>`
  );
}

// ========== AI COMMANDS (STUBS) ==========

async function handleGPT(ctx) {
  await sendReply(ctx,
    `🤖 *ChatGPT*\n\n` +
    `⚠️ TODO: Implementar integração com OpenAI API\n\n` +
    `Pergunta: ${ctx.args.join(' ')}`
  );
}

async function handleChat(ctx) {
  await sendReply(ctx,
    `💬 *Chat IA*\n\n` +
    `⚠️ TODO: Implementar chat bot com IA\n\n` +
    `Mensagem: ${ctx.args.join(' ')}`
  );
}

// ========== OWNER COMMANDS ==========

async function handleBroadcast(ctx) {
  const { sock, args } = ctx;
  const message = args.join(' ');
  
  await sendReply(ctx,
    `📢 *Broadcast*\n\n` +
    `⚠️ TODO: Implementar envio para todos os grupos\n\n` +
    `Mensagem: ${message}`
  );
}

async function handleBlock(ctx) {
  const { sock, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !block @usuario');
  }

  try {
    await sock.updateBlockStatus(mentioned, 'block');
    await sendReply(ctx, `✅ Usuário bloqueado!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleUnblock(ctx) {
  const { sock, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !unblock @usuario');
  }

  try {
    await sock.updateBlockStatus(mentioned, 'unblock');
    await sendReply(ctx, `✅ Usuário desbloqueado!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleBlacklist(ctx) {
  const { args, m } = ctx;
  const action = args[0]?.toLowerCase();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!['add', 'del'].includes(action) || !mentioned) {
    return await sendReply(ctx, '❌ Use: !blacklist add/del @usuario');
  }

  if (action === 'add') {
    configDB.addToBlacklist(mentioned);
    await sendReply(ctx, `✅ Usuário adicionado à blacklist global!`);
  } else {
    configDB.removeFromBlacklist(mentioned);
    await sendReply(ctx, `✅ Usuário removido da blacklist global!`);
  }
}

async function handleRestart(ctx) {
  await sendReply(ctx, `🔄 Reiniciando o Hinokami Bot...\n\n🗡️ Aguarde alguns instantes!`);
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}

async function handleStatus(ctx) {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  const status = `📊 *Status do Bot*\n\n` +
    `⏱️ Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m\n` +
    `💾 RAM: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
    `📈 Total: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB\n\n` +
    `🔥 Hinokami Bot em plena atividade!`;
  
  await sendReply(ctx, status);
}

// ========== HELPER ==========

async function sendReply(ctx, text, options = {}) {
  try {
    return await ctx.sock.sendMessage(ctx.from, {
      text,
      ...options
    }, { quoted: ctx.m });
  } catch (error) {
    logger.error('Erro ao enviar resposta:', error);
    throw error;
  }
}

export default commandHandler;
