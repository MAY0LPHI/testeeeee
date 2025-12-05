/**
 * Sistema de Menus do Hinokami Bot 🗡️🔥
 * Exporta funções construtoras de menus temáticos do Tanjiro
 */

import config from '../config.json' assert { type: 'json' };

/**
 * Formata tempo em segundos para string legível
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
}

/**
 * Cabeçalho ASCII temático do Tanjiro
 */
export const HEADER = `
╔═══════════════════════════════════╗
║   🗡️  HINOKAMI BOT - TANJIRO  🔥  ║
║     Respiração do Sol Ativada     ║
╚═══════════════════════════════════╝
`;

/**
 * Rodapé padrão
 */
export const FOOTER = `
─────────────────────────────
🌸 Criado com determinação 🌸
⛩️  Protegendo o grupo  ⛩️
`;

/**
 * Constrói menu principal
 * @param {Object} context - Contexto da mensagem (sender, groupName, etc.)
 * @returns {string} Menu formatado
 */
export function buildMainMenu(context = {}) {
  const { senderName = 'Guerreiro', groupName = '', prefix = config.prefix } = context;
  
  return `${HEADER}

🌸 *Olá, ${senderName}!*
${groupName ? `📍 Grupo: *${groupName}*` : ''}

*╭─「 🗡️ CATEGORIAS 」*
│
├ 📥 *Downloads* - ${prefix}menudownloads
├ 🎮 *Diversão* - ${prefix}menudiversao
├ 🛠️ *Ferramentas* - ${prefix}menuferramentas
├ 🤖 *IA & Automação* - ${prefix}menuia
├ 👑 *Administração* - ${prefix}menuadm
├ 🔧 *Dono* - ${prefix}menudono
│
╰─────────────────

💡 *Dica:* Use ${prefix}ajuda <comando> para mais detalhes!

${FOOTER}`;
}

/**
 * Menu de downloads
 */
export function buildDownloadsMenu(prefix = config.prefix) {
  return `${HEADER}

*╭─「 📥 DOWNLOADS 」*
│
├ 🎵 ${prefix}play <nome/url>
│   └ Baixar música do YouTube
│
├ 🎬 ${prefix}video <url>
│   └ Baixar vídeo do YouTube
│
├ 📷 ${prefix}tiktok <url>
│   └ Download sem marca d'água
│
├ 📸 ${prefix}instagram <url>
│   └ Foto/vídeo/reels do Instagram
│
├ 📌 ${prefix}pinterest <termo>
│   └ Buscar imagens no Pinterest
│
├ 🔊 ${prefix}audio <url>
│   └ Extrair áudio de vídeo
│
├ 🔗 ${prefix}autodetect
│   └ Auto-detect de links (on/off)
│
╰─────────────────

🔥 *Respiração da Velocidade!*

${FOOTER}`;
}

/**
 * Menu de administração
 */
export function buildAdminMenu(prefix = config.prefix) {
  return `${HEADER}

*╭─「 👑 ADMINISTRAÇÃO 」*
│
├ *Moderação:*
│ • ${prefix}ban @user
│ • ${prefix}kick @user  
│ • ${prefix}add <número>
│ • ${prefix}promover @user
│ • ${prefix}rebaixar @user
│
├ *Proteção:*
│ • ${prefix}antilink <on/off>
│ • ${prefix}antispam <on/off>
│ • ${prefix}antiporn <on/off>
│ • ${prefix}mute <on/off>
│
├ *Interação:*
│ • ${prefix}welcome <on/off>
│ • ${prefix}setwelcome <msg>
│ • ${prefix}setexit <msg>
│
├ *Moderadores Virtuais:*
│ • ${prefix}addmod @user
│ • ${prefix}delmod @user
│ • ${prefix}listmods
│
├ *Avisos:*
│ • ${prefix}warn @user
│ • ${prefix}unwarn @user
│ • ${prefix}warnings @user
│
╰─────────────────

⛩️ *Protegendo o grupo com a Respiração do Sol!*

${FOOTER}`;
}

/**
 * Menu de diversão
 */
export function buildFunMenu(prefix = config.prefix) {
  return `${HEADER}

*╭─「 🎮 DIVERSÃO 」*
│
├ *Jogos:*
│ • ${prefix}jogovelha @user
│ • ${prefix}forca
│ • ${prefix}quiz
│ • ${prefix}roleta
│
├ *Rankings Aleatórios:*
│ • ${prefix}gay @user
│ • ${prefix}gado @user
│ • ${prefix}casal
│ • ${prefix}ship @user1 @user2
│
├ *Interação:*
│ • ${prefix}abraco @user
│ • ${prefix}tapa @user
│ • ${prefix}beijo @user
│
├ *Modo Brincalhão:*
│ • ${prefix}modoplay <on/off>
│
╰─────────────────

🌸 *Descontraia com o poder da amizade!*

${FOOTER}`;
}

/**
 * Menu de ferramentas
 */
export function buildToolsMenu(prefix = config.prefix) {
  return `${HEADER}

*╭─「 🛠️ FERRAMENTAS 」*
│
├ *Stickers:*
│ • ${prefix}sticker (responda img/vídeo)
│ • ${prefix}toimg (responda sticker)
│ • ${prefix}togif (responda sticker animado)
│
├ *Busca:*
│ • ${prefix}google <termo>
│ • ${prefix}imagem <termo>
│ • ${prefix}gif <termo>
│
├ *Utilidades:*
│ • ${prefix}traduzir <lang> <texto>
│ • ${prefix}encurtar <url>
│ • ${prefix}upload (responda arquivo)
│ • ${prefix}clima <cidade>
│
├ *Info:*
│ • ${prefix}ping
│ • ${prefix}uptime
│ • ${prefix}velocidade
│
╰─────────────────

🪵 *Ferramentas úteis do Hinokami!*

${FOOTER}`;
}

/**
 * Menu de IA
 */
export function buildAIMenu(prefix = config.prefix) {
  return `${HEADER}

*╭─「 🤖 IA & AUTOMAÇÃO 」*
│
├ *Chat IA:*
│ • ${prefix}gpt <pergunta>
│ • ${prefix}chat <mensagem>
│ • ${prefix}imagine <descrição>
│
├ *Geração de Imagem:*
│ • ${prefix}dalle <prompt>
│ • ${prefix}midjourney <prompt>
│
├ *Utilidades IA:*
│ • ${prefix}resumir (responda msg/link)
│ • ${prefix}transcrever (responda áudio)
│ • ${prefix}detectar (responda img)
│
╰─────────────────

💧 *Poder da tecnologia e respiração!*

${FOOTER}`;
}

/**
 * Menu do dono
 */
export function buildOwnerMenu(prefix = config.prefix) {
  return `${HEADER}

*╭─「 🔧 COMANDOS DO DONO 」*
│
├ *Configuração:*
│ • ${prefix}setprefix <novo>
│ • ${prefix}setname <nome>
│ • ${prefix}setbio <bio>
│ • ${prefix}setphoto (responda img)
│
├ *Gerenciamento:*
│ • ${prefix}entrargrupo <link>
│ • ${prefix}sairgrupo
│ • ${prefix}listargrupos
│ • ${prefix}broadcast <msg>
│
├ *Usuários:*
│ • ${prefix}block @user
│ • ${prefix}unblock @user
│ • ${prefix}blacklist add/del @user
│ • ${prefix}premium add/del @user
│
├ *Sistema:*
│ • ${prefix}reiniciar
│ • ${prefix}desligar
│ • ${prefix}status
│ • ${prefix}logs
│ • ${prefix}backup
│
├ *Desenvolvimento:*
│ • ${prefix}eval <código>
│ • ${prefix}exec <comando>
│ • ${prefix}debug <on/off>
│
╰─────────────────

⚔️ *Controle total do Hinokami Bot!*

${FOOTER}`;
}

/**
 * Menu de ajuda para comando específico
 */
export function buildCommandHelp(commandName, commandInfo) {
  const { description, usage, examples, category, aliases } = commandInfo;
  
  return `${HEADER}

*📖 Ajuda: ${commandName}*

${description || 'Sem descrição disponível.'}

*Uso:* ${usage || 'Não especificado'}

${aliases?.length ? `*Aliases:* ${aliases.join(', ')}` : ''}

${category ? `*Categoria:* ${category}` : ''}

${examples?.length ? `*Exemplos:*\n${examples.map(ex => `• ${ex}`).join('\n')}` : ''}

${FOOTER}`;
}

/**
 * Mensagem de erro padrão
 */
export function buildErrorMessage(error, context = {}) {
  return `❌ *Erro*

${error}

💡 Use *${context.prefix || config.prefix}menu* para ver comandos disponíveis.`;
}

/**
 * Mensagem de sucesso padrão
 */
export function buildSuccessMessage(message) {
  return `✅ *Sucesso!*

${message}

🔥 Hinokami Bot em ação!`;
}

/**
 * Mensagem de carregamento
 */
export function buildLoadingMessage(action = 'Processando') {
  return `⏳ ${action}...

🗡️ Aguarde, a Respiração do Sol está em ação!`;
}

export default {
  HEADER,
  FOOTER,
  buildMainMenu,
  buildDownloadsMenu,
  buildAdminMenu,
  buildFunMenu,
  buildToolsMenu,
  buildAIMenu,
  buildOwnerMenu,
  buildCommandHelp,
  buildErrorMessage,
  buildSuccessMessage,
  buildLoadingMessage
};
