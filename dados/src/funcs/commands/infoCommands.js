/**
 * Info command handlers for Hinokami Bot
 * Implements informative commands
 */

import config from '../../config.json' with { type: 'json' };

export async function handleAtividade(ctx) {
  const { sock, from, m } = ctx;
  
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  await sock.sendMessage(from, {
    text: `📊 *ATIVIDADE DO BOT*\n\n` +
          `⏱️ *Tempo Online:* ${hours}h ${minutes}m\n` +
          `🔥 *Status:* Ativo\n` +
          `⚡ *Comandos Processados:* N/A\n\n` +
          `🗡️ Hinokami Bot em plena atividade!`
  }, { quoted: m });
}

export async function handleRankativo(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isGroup) {
    return await sock.sendMessage(from, {
      text: '❌ Este comando só funciona em grupos!'
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: `🏆 *RANKING DE ATIVIDADE*\n\n` +
          `📊 Sistema de ranking em desenvolvimento.\n` +
          `Continue usando o bot para subir no ranking!`
  }, { quoted: m });
}

export async function handleCheckativo(ctx) {
  const { sock, from, m, sender } = ctx;
  
  await sock.sendMessage(from, {
    text: `📊 *SUA ATIVIDADE*\n\n` +
          `👤 @${sender.split('@')[0]}\n` +
          `📈 *Mensagens:* 0\n` +
          `⭐ *Nível de Atividade:* Iniciante\n\n` +
          `💡 Continue participando!`,
    mentions: [sender]
  }, { quoted: m });
}

export async function handleRanklevel(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isGroup) {
    return await sock.sendMessage(from, {
      text: '❌ Este comando só funciona em grupos!'
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: `🏆 *RANKING DE NÍVEIS*\n\n` +
          `📊 Sistema de níveis em desenvolvimento.\n` +
          `Use comandos para ganhar XP e subir de nível!`
  }, { quoted: m });
}

export async function handleConsultar_premium(ctx) {
  const { sock, from, m, sender } = ctx;
  
  await sock.sendMessage(from, {
    text: `💎 *STATUS PREMIUM*\n\n` +
          `👤 @${sender.split('@')[0]}\n` +
          `💎 *Premium:* Não\n\n` +
          `💡 Entre em contato com o dono para se tornar premium!`,
    mentions: [sender]
  }, { quoted: m });
}

export async function handleDados(ctx) {
  const { sock, from, m } = ctx;
  
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  await sock.sendMessage(from, {
    text: `📊 *DADOS DO BOT*\n\n` +
          `⏱️ *Uptime:* ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m\n` +
          `💾 *RAM:* ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
          `📈 *Total:* ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB\n` +
          `🤖 *Plataforma:* ${process.platform}\n` +
          `📦 *Node:* ${process.version}\n\n` +
          `🔥 Hinokami Bot funcionando perfeitamente!`
  }, { quoted: m });
}

export async function handleInfobemvindo(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `👋 *INFORMAÇÕES DE BOAS-VINDAS*\n\n` +
          `📝 *Como ativar:*\n` +
          `Use !bemvindo 1 para ativar\n` +
          `Use !bemvindo 0 para desativar\n\n` +
          `💡 Apenas admins podem configurar!`
  }, { quoted: m });
}

export async function handleIdiomas(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `🌐 *IDIOMAS DISPONÍVEIS (GTTS)*\n\n` +
          `• pt - Português\n` +
          `• en - Inglês\n` +
          `• es - Espanhol\n` +
          `• fr - Francês\n` +
          `• de - Alemão\n` +
          `• it - Italiano\n` +
          `• ja - Japonês\n` +
          `• ko - Coreano\n` +
          `• zh - Chinês\n\n` +
          `💡 Uso: !gtts pt Olá mundo`
  }, { quoted: m });
}

export async function handleInfodono(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `👑 *INFORMAÇÕES DO DONO*\n\n` +
          `📱 *Número:* ${config.ownerNumber}\n` +
          `👤 *Nome:* ${config.ownerName}\n` +
          `🤖 *Bot:* ${config.botName}\n\n` +
          `💬 Entre em contato para dúvidas!`
  }, { quoted: m });
}

export async function handleInfoaluguel(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `💰 *INFORMAÇÕES DE ALUGUEL*\n\n` +
          `📋 Serviço de aluguel do bot disponível!\n\n` +
          `💡 Entre em contato com o dono para mais informações.`
  }, { quoted: m });
}

export async function handleInfocmdprem(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `💎 *COMANDOS PREMIUM*\n\n` +
          `📋 Comandos exclusivos para usuários premium\n\n` +
          `💡 Use !consultar_premium para verificar seu status`
  }, { quoted: m });
}

export async function handleInfopremium(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `💎 *INFORMAÇÕES PREMIUM*\n\n` +
          `✨ *Vantagens:*\n` +
          `• Comandos exclusivos\n` +
          `• Prioridade no processamento\n` +
          `• Recursos avançados\n\n` +
          `💰 Entre em contato com o dono para se tornar premium!`
  }, { quoted: m });
}

export default {
  handleAtividade,
  handleRankativo,
  handleCheckativo,
  handleRanklevel,
  handleConsultar_premium,
  handleDados,
  handleInfobemvindo,
  handleIdiomas,
  handleInfodono,
  handleInfoaluguel,
  handleInfocmdprem,
  handleInfopremium
};
