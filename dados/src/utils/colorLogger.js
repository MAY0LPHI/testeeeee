import chalk from 'chalk';

/**
 * Utilitário de logging colorido para o terminal do Hinokami Bot 🗡️🔥
 * Organiza e diferencia mensagens por cor para melhor visibilidade
 */

/**
 * Formata timestamp para exibição
 */
function getTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Logger colorido para comandos
 */
export function logCommand(commandName, senderNumber, isGroup, prefix = '!') {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgCyan.black(' COMANDO ');
  const command = chalk.cyan.bold(`${prefix}${commandName}`);
  const from = chalk.yellow(`${senderNumber}`);
  const location = isGroup ? chalk.magenta('(Grupo)') : chalk.blue('(Privado)');
  
  console.log(`${timestamp} ${type} ${command} ${chalk.gray('de')} ${from} ${location}`);
}

/**
 * Logger colorido para mensagens normais
 */
export function logMessage(senderNumber, isGroup, messagePreview) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgWhite.black(' MENSAGEM ');
  const from = chalk.yellow(`${senderNumber}`);
  const location = isGroup ? chalk.magenta('(Grupo)') : chalk.blue('(Privado)');
  const preview = chalk.white(`"${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}"`);
  
  console.log(`${timestamp} ${type} ${chalk.gray('de')} ${from} ${location} ${chalk.gray(':')} ${preview}`);
}

/**
 * Logger colorido para eventos de conexão
 */
export function logConnection(status, message) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  let type;
  let coloredMessage;
  
  switch (status) {
    case 'success':
      type = chalk.bgGreen.black(' CONECTADO ');
      coloredMessage = chalk.green(message);
      break;
    case 'connecting':
      type = chalk.bgYellow.black(' CONECTANDO ');
      coloredMessage = chalk.yellow(message);
      break;
    case 'disconnected':
      type = chalk.bgRed.white(' DESCONECTADO ');
      coloredMessage = chalk.red(message);
      break;
    case 'qr':
      type = chalk.bgMagenta.white(' QR CODE ');
      coloredMessage = chalk.magenta(message);
      break;
    default:
      type = chalk.bgWhite.black(' INFO ');
      coloredMessage = chalk.white(message);
  }
  
  console.log(`${timestamp} ${type} ${coloredMessage}`);
}

/**
 * Logger colorido para erros
 */
export function logError(context, error) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgRed.white(' ERRO ');
  const errorContext = chalk.red.bold(`[${context}]`);
  const errorMessage = chalk.red(error.message || error);
  
  console.log(`${timestamp} ${type} ${errorContext} ${errorMessage}`);
  
  // Se houver stack trace, exibir de forma mais discreta
  if (error.stack && process.env.DEBUG) {
    console.log(chalk.gray(error.stack));
  }
}

/**
 * Logger colorido para avisos
 */
export function logWarning(context, message) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgYellow.black(' AVISO ');
  const warnContext = chalk.yellow.bold(`[${context}]`);
  const warnMessage = chalk.yellow(message);
  
  console.log(`${timestamp} ${type} ${warnContext} ${warnMessage}`);
}

/**
 * Logger colorido para informações
 */
export function logInfo(context, message) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgBlue.white(' INFO ');
  const infoContext = chalk.blue.bold(`[${context}]`);
  const infoMessage = chalk.white(message);
  
  console.log(`${timestamp} ${type} ${infoContext} ${infoMessage}`);
}

/**
 * Logger colorido para sucesso
 */
export function logSuccess(context, message) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgGreen.black(' SUCESSO ');
  const successContext = chalk.green.bold(`[${context}]`);
  const successMessage = chalk.green(message);
  
  console.log(`${timestamp} ${type} ${successContext} ${successMessage}`);
}

/**
 * Logger colorido para debug
 */
export function logDebug(context, message) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgGray.white(' DEBUG ');
  const debugContext = chalk.gray.bold(`[${context}]`);
  const debugMessage = chalk.gray(message);
  
  console.log(`${timestamp} ${type} ${debugContext} ${debugMessage}`);
}

/**
 * Logger colorido para rate limiting
 */
export function logRateLimit(senderNumber, remainingTime) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgRed.white(' RATE LIMIT ');
  const from = chalk.yellow(`${senderNumber}`);
  const time = chalk.red(`${remainingTime}s restantes`);
  
  console.log(`${timestamp} ${type} ${chalk.gray('Usuário')} ${from} ${chalk.gray('-')} ${time}`);
}

/**
 * Logger colorido para cooldown
 */
export function logCooldown(senderNumber, commandName, cooldownTime, prefix = '!') {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgYellow.black(' COOLDOWN ');
  const from = chalk.yellow(`${senderNumber}`);
  const command = chalk.cyan(`${prefix}${commandName}`);
  const time = chalk.yellow(`${cooldownTime}s restantes`);
  
  console.log(`${timestamp} ${type} ${from} ${chalk.gray('tentou')} ${command} ${chalk.gray('-')} ${time}`);
}

/**
 * Logger colorido para usuário na blacklist
 */
export function logBlacklist(senderNumber, commandName, prefix = '!') {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgRed.white(' BLACKLIST ');
  const from = chalk.red.bold(`${senderNumber}`);
  const command = chalk.cyan(`${prefix}${commandName}`);
  
  console.log(`${timestamp} ${type} ${chalk.gray('Usuário bloqueado')} ${from} ${chalk.gray('tentou')} ${command}`);
}

/**
 * Separador visual para melhor organização
 */
export function logSeparator() {
  console.log(chalk.gray('─'.repeat(80)));
}

/**
 * Banner inicial do bot - ENHANCED
 */
export function logBanner() {
  console.clear();
  console.log('\n');
  console.log(chalk.bold.cyan('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
  console.log(chalk.bold.cyan('┃') + '                                                      ' + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + chalk.bold.red('        🗡️  HINOKAMI BOT - TANJIRO  🔥            ') + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + '                                                      ' + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + chalk.bold.yellow('         Respiração do Sol Ativada ⚔️               ') + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + '                                                      ' + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + chalk.gray('    Bot WhatsApp com +100 comandos integrados      ') + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + chalk.gray('    Desenvolvido com determinação e força          ') + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┃') + '                                                      ' + chalk.bold.cyan('┃'));
  console.log(chalk.bold.cyan('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
  console.log('\n');
}

/**
 * Display loading status
 */
export function logLoading(message, progress = null) {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgCyan.black(' CARREGANDO ');
  const loadingMsg = chalk.cyan(message);
  const progressBar = progress !== null ? chalk.yellow(` [${progress}%]`) : '';
  
  process.stdout.write(`\r${timestamp} ${type} ${loadingMsg}${progressBar}   `);
}

/**
 * Display config info during startup
 */
export function logConfigInfo(key, value, status = 'info') {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const type = chalk.bgBlue.white(' CONFIG ');
  const configKey = chalk.blue.bold(`${key}:`);
  
  let coloredValue;
  switch (status) {
    case 'success':
      coloredValue = chalk.green(value);
      break;
    case 'warning':
      coloredValue = chalk.yellow(value);
      break;
    case 'error':
      coloredValue = chalk.red(value);
      break;
    default:
      coloredValue = chalk.white(value);
  }
  
  console.log(`${timestamp} ${type} ${configKey} ${coloredValue}`);
}

/**
 * Display startup section header
 */
export function logSection(title) {
  console.log('\n' + chalk.bold.cyan(`┌─── ${title} ───┐`));
}

/**
 * Display startup section footer
 */
export function logSectionEnd() {
  console.log(chalk.bold.cyan(`└${'─'.repeat(50)}┘`) + '\n');
}

/**
 * Display startup statistics
 */
export function logStats(stats) {
  logSection('📊 ESTATÍSTICAS DO BOT');
  
  Object.entries(stats).forEach(([key, value]) => {
    const label = chalk.gray(`  ${key}:`);
    const val = chalk.cyan.bold(value);
    console.log(`${label} ${val}`);
  });
  
  logSectionEnd();
}

/**
 * Display ready message
 */
export function logReady(botName, ownerNumber, prefix) {
  console.log('\n');
  logSeparator();
  console.log(chalk.bold.green('🔥 ') + chalk.bold.white('BOT PRONTO E OPERACIONAL!') + chalk.bold.green(' 🔥'));
  logSeparator();
  console.log(chalk.cyan('  Bot:') + chalk.white(` ${botName}`));
  console.log(chalk.cyan('  Dono:') + chalk.white(` ${ownerNumber}`));
  console.log(chalk.cyan('  Prefixo:') + chalk.white(` ${prefix}`));
  logSeparator();
  console.log(chalk.gray('  Aguardando mensagens...'));
  console.log('\n');
}

export default {
  logCommand,
  logMessage,
  logConnection,
  logError,
  logWarning,
  logInfo,
  logSuccess,
  logDebug,
  logRateLimit,
  logCooldown,
  logBlacklist,
  logSeparator,
  logBanner,
  logLoading,
  logConfigInfo,
  logSection,
  logSectionEnd,
  logStats,
  logReady
};
