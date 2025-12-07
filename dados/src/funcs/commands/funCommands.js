/**
 * Fun/game command handlers for Hinokami Bot
 */

export async function handleJogovelha(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `🎮 *JOGO DA VELHA*\n\n` +
          `⚠️ Sistema de jogo em desenvolvimento.\n` +
          `Em breve você poderá jogar!`
  }, { quoted: m });
}

export async function handleForca(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `🎮 *JOGO DA FORCA*\n\n` +
          `⚠️ Sistema de jogo em desenvolvimento.\n` +
          `Em breve você poderá jogar!`
  }, { quoted: m });
}

export async function handleQuiz(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `🎮 *QUIZ*\n\n` +
          `⚠️ Sistema de quiz em desenvolvimento.\n` +
          `Em breve você poderá jogar!`
  }, { quoted: m });
}

export default {
  handleJogovelha,
  handleForca,
  handleQuiz
};
