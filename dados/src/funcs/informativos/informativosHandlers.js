import { performance } from 'perf_hooks';
import os from 'os';
import { logInfo, logSuccess } from '../../utils/colorLogger.js';
import config from '../../config.json' with { type: 'json' };

/**
 * Handlers de comandos informativos
 */

/**
 * Ping - verifica latência do bot
 */
export async function handlePing(ctx) {
  const { sock, m } = ctx;
  
  try {
    const start = performance.now();
    
    const sent = await sock.sendMessage(m.key.remoteJid, {
      text: '🏓 Calculando ping...'
    }, { quoted: m });
    
    const end = performance.now();
    const ping = (end - start).toFixed(2);
    
    await sock.sendMessage(m.key.remoteJid, {
      text: `🏓 *Pong!*\n\n⚡ *Latência:* ${ping}ms\n🤖 *Status:* Online\n✅ *Velocidade:* ${ping < 100 ? 'Excelente' : ping < 300 ? 'Boa' : 'Regular'}`,
      edit: sent.key
    });
    
    logSuccess('InformativosHandler', `Ping: ${ping}ms`);
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao calcular ping: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Dados - estatísticas do bot
 */
export async function handleDados(ctx) {
  const { sock, m } = ctx;
  
  try {
    logInfo('InformativosHandler', 'Exibindo dados do bot');
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
    
    const cpuUsage = process.cpuUsage();
    const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);
    
    let response = `📊 *Dados do Bot*\n\n`;
    response += `🤖 *Nome:* ${config.botName || 'Hinokami Bot'}\n`;
    response += `⏱️ *Tempo Ativo:* ${hours}h ${minutes}m ${seconds}s\n`;
    response += `💾 *Memória:* ${memUsedMB}MB / ${memTotalMB}MB\n`;
    response += `⚙️ *CPU:* ${cpuPercent}s\n`;
    response += `🖥️ *Plataforma:* ${os.platform()} ${os.arch()}\n`;
    response += `📡 *Node.js:* ${process.version}\n`;
    response += `👤 *Dono:* ${config.ownerNumber || 'Não configurado'}\n`;
    response += `⚡ *Prefixo:* ${config.prefix || '!'}\n\n`;
    response += `🗡️ *Hinokami Bot* - Desenvolvido com ⚔️ e 🔥`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Dados exibidos');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao exibir dados: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Atividade - estatísticas de atividade do bot
 */
export async function handleAtividade(ctx) {
  const { sock, m } = ctx;
  
  try {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    let response = `📈 *Atividade do Bot*\n\n`;
    response += `⏰ *Tempo Online:* ${days}d ${hours}h ${minutes}m\n`;
    response += `🔄 *Status:* Operacional\n`;
    response += `✅ *Conexão:* Estável\n`;
    response += `📊 *Performance:* Normal\n\n`;
    response += `💡 Use \`${config.prefix}dados\` para mais informações`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Atividade exibida');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao exibir atividade: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Idiomas disponíveis para GTTS
 */
export async function handleIdiomas(ctx) {
  const { sock, m } = ctx;
  
  try {
    let response = `🌐 *Idiomas Disponíveis para GTTS*\n\n`;
    response += `🇧🇷 *pt* - Português\n`;
    response += `🇺🇸 *en* - English\n`;
    response += `🇪🇸 *es* - Español\n`;
    response += `🇫🇷 *fr* - Français\n`;
    response += `🇩🇪 *de* - Deutsch\n`;
    response += `🇮🇹 *it* - Italiano\n`;
    response += `🇯🇵 *ja* - 日本語\n`;
    response += `🇰🇷 *ko* - 한국어\n`;
    response += `🇨🇳 *zh* - 中文\n`;
    response += `🇷🇺 *ru* - Русский\n`;
    response += `🇦🇪 *ar* - العربية\n`;
    response += `🇮🇳 *hi* - हिन्दी\n\n`;
    response += `💡 *Uso:* \`${config.prefix}gtts <idioma> <texto>\`\n`;
    response += `📝 *Exemplo:* \`${config.prefix}gtts en Hello World\``;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Idiomas listados');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao listar idiomas: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Info do dono
 */
export async function handleInfoDono(ctx) {
  const { sock, m } = ctx;
  
  try {
    let response = `👑 *Informações do Dono*\n\n`;
    response += `📱 *Número:* ${config.ownerNumber || 'Não configurado'}\n`;
    response += `🤖 *Bot:* ${config.botName || 'Hinokami Bot'}\n`;
    response += `⚡ *Prefixo:* ${config.prefix || '!'}\n\n`;
    response += `🗡️ *Hinokami Bot* - Respiração do Sol Ativada 🔥\n`;
    response += `🌸 Desenvolvido com determinação e força de vontade`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Info do dono exibida');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao exibir info: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Info sobre boas-vindas
 */
export async function handleInfoBemvindo(ctx) {
  const { sock, m } = ctx;
  
  try {
    let response = `🌸 *Sistema de Boas-Vindas*\n\n`;
    response += `📋 *Descrição:*\n`;
    response += `O sistema de boas-vindas envia mensagens automáticas quando novos membros entram no grupo.\n\n`;
    response += `⚙️ *Como ativar:*\n`;
    response += `Use o comando \`${config.prefix}welcome 1\` (apenas admin)\n\n`;
    response += `❌ *Como desativar:*\n`;
    response += `Use o comando \`${config.prefix}welcome 0\` (apenas admin)\n\n`;
    response += `📝 *Recursos:*\n`;
    response += `• Mensagem personalizada\n`;
    response += `• Marca o novo membro\n`;
    response += `• Exibe regras do grupo\n`;
    response += `• Imagem de boas-vindas (opcional)`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Info boas-vindas exibida');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao exibir info: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Info sobre aluguel do bot
 */
export async function handleInfoAluguel(ctx) {
  const { sock, m } = ctx;
  
  try {
    let response = `💎 *Informações sobre Aluguel do Bot*\n\n`;
    response += `🤖 *Bot:* ${config.botName || 'Hinokami Bot'}\n`;
    response += `⚔️ *Características:*\n`;
    response += `• +100 comandos integrados\n`;
    response += `• Sistema de moderação completo\n`;
    response += `• Downloads automáticos\n`;
    response += `• Jogos e entretenimento\n`;
    response += `• Sistema de economia virtual\n`;
    response += `• Figurinhas personalizadas\n`;
    response += `• Anti-spam e proteções\n\n`;
    response += `📞 *Contato:*\n`;
    response += `Para informações sobre aluguel, entre em contato com:\n`;
    response += `📱 ${config.ownerNumber || 'Entre em contato com o dono'}\n\n`;
    response += `🗡️ *Hinokami Bot* - Respiração do Sol Ativada 🔥`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Info aluguel exibida');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao exibir info: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Info sobre premium
 */
export async function handleInfoPremium(ctx) {
  const { sock, m } = ctx;
  
  try {
    let response = `💎 *Sistema Premium*\n\n`;
    response += `🌟 *Benefícios:*\n`;
    response += `• Acesso a comandos exclusivos\n`;
    response += `• Prioridade no processamento\n`;
    response += `• Sem cooldowns\n`;
    response += `• Comandos especiais de IA\n`;
    response += `• Downloads sem limite\n`;
    response += `• Suporte prioritário\n\n`;
    response += `⚙️ *Como obter:*\n`;
    response += `Entre em contato com o dono do bot:\n`;
    response += `📱 ${config.ownerNumber || 'Não configurado'}\n\n`;
    response += `💡 *Verificar status:*\n`;
    response += `Use \`${config.prefix}consultar_premium\``;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Info premium exibida');
    
  } catch (error) {
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao exibir info: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Consultar premium
 */
export async function handleConsultarPremium(ctx) {
  const { sock, m, userDB } = ctx;
  const sender = m.key.participant || m.key.remoteJid;
  
  try {
    // Check if userDB exists and has isPremium method
    const isPremium = userDB && typeof userDB.isPremium === 'function' 
      ? userDB.isPremium(sender) 
      : false;
    
    let response = `💎 *Status Premium*\n\n`;
    response += `👤 *Usuário:* @${sender.split('@')[0]}\n`;
    response += `🌟 *Premium:* ${isPremium ? '✅ Ativo' : '❌ Não ativo'}\n\n`;
    
    if (!isPremium) {
      response += `💡 Para se tornar premium, use \`${config.prefix}infopremium\``;
    } else {
      response += `🎉 Você tem acesso a todos os recursos premium!`;
    }
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response,
      mentions: [sender]
    }, { quoted: m });
    
    logSuccess('InformativosHandler', 'Status premium consultado');
    
  } catch (error) {
    logError('InformativosHandler', `Erro ao consultar: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao consultar: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Stub handlers - a serem implementados
 */
export async function handleRankAtivo(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Sistema de ranking em desenvolvimento.'
  }, { quoted: ctx.m });
}

export async function handleCheckAtivo(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Sistema de atividade em desenvolvimento.'
  }, { quoted: ctx.m });
}

export async function handleRankLevel(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Sistema de níveis em desenvolvimento.'
  }, { quoted: ctx.m });
}

export async function handleInfoCmdPrem(ctx) {
  let response = `💎 *Comandos Premium - Info*\n\n`;
  response += `📋 *Descrição:*\n`;
  response += `O sistema permite que o dono configure comandos exclusivos para usuários premium.\n\n`;
  response += `⚙️ *Gerenciamento:*\n`;
  response += `• Adicionar usuário premium: \`!premium add @user\`\n`;
  response += `• Remover usuário premium: \`!premium del @user\`\n`;
  response += `• Listar premium: \`!listpremium\`\n\n`;
  response += `💡 *Nota:* Apenas o dono pode gerenciar usuários premium.`;
  
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: response
  }, { quoted: ctx.m });
}

export default {
  handlePing,
  handleDados,
  handleAtividade,
  handleIdiomas,
  handleInfoDono,
  handleInfoBemvindo,
  handleInfoAluguel,
  handleInfoPremium,
  handleConsultarPremium,
  handleRankAtivo,
  handleCheckAtivo,
  handleRankLevel,
  handleInfoCmdPrem
};
