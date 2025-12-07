/**
 * Economy/coins command handlers
 */

export async function handleCarteira(ctx) {
  const { sock, from, m, sender } = ctx;
  
  await sock.sendMessage(from, {
    text: `💰 *SUA CARTEIRA*\n\n` +
          `👤 @${sender.split('@')[0]}\n` +
          `💵 *Coins:* 0\n` +
          `💎 *Gems:* 0\n\n` +
          `💡 Use !daily para receber coins diários!`,
    mentions: [sender]
  }, { quoted: m });
}

export async function handleDaily(ctx) {
  const { sock, from, m, sender } = ctx;
  
  const dailyAmount = Math.floor(Math.random() * 500) + 100;
  
  await sock.sendMessage(from, {
    text: `🎁 *DAILY COLETADO!*\n\n` +
          `👤 @${sender.split('@')[0]}\n` +
          `💵 +${dailyAmount} coins\n\n` +
          `⏰ Volte amanhã para coletar novamente!`,
    mentions: [sender]
  }, { quoted: m });
}

export async function handleTransferir(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 2) {
    return await sock.sendMessage(from, {
      text: `❌ Uso: !transferir @usuario valor`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: `💸 *TRANSFERÊNCIA*\n\n` +
          `⚠️ Sistema de transferências em desenvolvimento.`
  }, { quoted: m });
}

export async function handleApostar(ctx) {
  const { sock, from, m, args, sender } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: `❌ Forneça o valor para apostar!\n\n💡 Uso: !apostar 100`
    }, { quoted: m });
  }
  
  const bet = parseInt(args[0]);
  const win = Math.random() > 0.5;
  const result = win ? bet * 2 : -bet;
  
  await sock.sendMessage(from, {
    text: `🎰 *APOSTA*\n\n` +
          `👤 @${sender.split('@')[0]}\n` +
          `💵 *Valor:* ${bet} coins\n` +
          `${win ? '✅ *Ganhou!*' : '❌ *Perdeu!*'}\n` +
          `💰 *Resultado:* ${result > 0 ? '+' : ''}${result} coins`,
    mentions: [sender]
  }, { quoted: m });
}

export async function handleMinerar(ctx) {
  const { sock, from, m, sender } = ctx;
  
  const mined = Math.floor(Math.random() * 200) + 50;
  
  await sock.sendMessage(from, {
    text: `⛏️ *MINERAÇÃO*\n\n` +
          `👤 @${sender.split('@')[0]}\n` +
          `💎 Você minerou ${mined} coins!\n\n` +
          `⏱️ Aguarde para minerar novamente.`,
    mentions: [sender]
  }, { quoted: m });
}

export default {
  handleCarteira,
  handleDaily,
  handleTransferir,
  handleApostar,
  handleMinerar
};
