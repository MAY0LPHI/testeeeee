import { connectToWhatsApp, hasSession, logger } from '../connect.js';
import handleMessage from '../index.js';
import fs from 'fs';
import path from 'path';
import { paths } from '../utils/paths.js';
import * as colorLogger from '../utils/colorLogger.js';

/**
 * Script de inicialização do Hinokami Bot 🗡️🔥
 * Inicia conexão e processamento de mensagens
 */

colorLogger.logBanner();

// Verificar se Node.js >= 20
const nodeVersion = process.versions.node.split('.')[0];
if (parseInt(nodeVersion) < 20) {
  console.error('❌ Node.js 20 ou superior é necessário!');
  console.error(`   Versão atual: ${process.version}`);
  process.exit(1);
}

// Criar diretórios necessários
const requiredDirs = [
  paths.database,
  paths.grupos,
  paths.dono,
  paths.midias,
  paths.session
];

for (const dir of requiredDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    colorLogger.logSuccess('Sistema', `Diretório criado: ${path.basename(dir)}`);
    logger.info(`✅ Diretório criado: ${dir}`);
  }
}

// Verificar arquivo de configuração
const configPath = paths.config;
if (!fs.existsSync(configPath)) {
  colorLogger.logError('Sistema', new Error('Arquivo config.json não encontrado!'));
  console.error('   Execute: npm run config:install');
  process.exit(1);
}

// Carregar configuração
let config;
try {
  const configData = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configData);
  colorLogger.logSuccess('Sistema', 'Configuração carregada');
  logger.info('✅ Configuração carregada');
} catch (error) {
  colorLogger.logError('Sistema', error);
  console.error('❌ Erro ao carregar config.json:', error.message);
  process.exit(1);
}

// Verificar se número do dono está configurado
if (!config.ownerNumber || config.ownerNumber.includes('XXX')) {
  colorLogger.logWarning('Configuração', 'Configure o número do dono do bot!');
  console.warn('   Edite: dados/src/config.json');
  console.warn('   Campo: ownerNumber\n');
}

// Verificar sessão
if (!hasSession()) {
  colorLogger.logInfo('Primeira Execução', 'Prepare-se para escanear o QR Code...');
}

// Handlers de processo
process.on('uncaughtException', (err) => {
  colorLogger.logError('Exceção Não Capturada', err);
  logger.error('Exceção não capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  colorLogger.logError('Promise Rejeitada', new Error(String(reason)));
  logger.error('Promise rejeitada não tratada:', reason);
});

process.on('SIGINT', () => {
  colorLogger.logWarning('Sistema', 'Encerrando Hinokami Bot...');
  console.log('   Até breve, guerreiro! 🗡️\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  colorLogger.logWarning('Sistema', 'Encerrando Hinokami Bot (SIGTERM)...');
  process.exit(0);
});

// Iniciar bot
async function start() {
  try {
    colorLogger.logSection('🚀 INICIALIZAÇÃO');
    colorLogger.logConfigInfo('Node.js', process.version, 'success');
    colorLogger.logConfigInfo('Bot Name', config.botName || 'Hinokami Bot', 'info');
    colorLogger.logConfigInfo('Owner', config.ownerNumber || 'Não configurado', 
      config.ownerNumber?.includes('XXX') ? 'warning' : 'success');
    colorLogger.logConfigInfo('Prefix', config.prefix || '!', 'info');
    colorLogger.logConfigInfo('Sticker Pack', config.stickerPack || 'Hinokami Bot', 'info');
    colorLogger.logConfigInfo('Sticker Author', config.stickerAuthor || 'Tanjiro', 'info');
    colorLogger.logSectionEnd();
    
    // Display available features
    colorLogger.logSection('✨ RECURSOS DISPONÍVEIS');
    const features = [
      '🎨 Figurinhas (sticker, toimg, fsticker)',
      '🔍 Pesquisas (googlesrc, wikipedia, scep, ddd)',
      '🎲 Aleatórios (traduzir, calcular, geracpf, obesidade, tinyurl)',
      '📊 Informativos (ping, dados, atividade, idiomas)',
      '👑 Admin (ban, add, promover, antilink)',
      '⛱️ Brincadeiras (gay, gado, ship)',
      '📥 Downloads (stubs - em desenvolvimento)',
      '🪄 Logos (stubs - em desenvolvimento)',
      '💰 Economia (stubs - em desenvolvimento)'
    ];
    features.forEach(feature => {
      colorLogger.logInfo('Categoria', feature);
    });
    colorLogger.logSectionEnd();
    
    colorLogger.logInfo('Sistema', 'Iniciando Hinokami Bot...');
    logger.info('🔥 Iniciando Hinokami Bot...');
    
    const sock = await connectToWhatsApp(handleMessage);
    
    colorLogger.logSuccess('Sistema', 'Bot inicializado com sucesso!');
    logger.info('✅ Bot inicializado com sucesso!');
    
    // Display ready message with stats
    const stats = {
      'Node.js': process.version,
      'Memória': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      'Plataforma': `${process.platform} ${process.arch}`,
      'PID': process.pid
    };
    colorLogger.logStats(stats);
    
    colorLogger.logReady(
      config.botName || 'Hinokami Bot',
      config.ownerNumber || 'Não configurado',
      config.prefix || '!'
    );
    
    // Keep process alive - the bot will run continuously
    // Heartbeat could be added here for monitoring if needed
    
  } catch (error) {
    colorLogger.logError('Inicialização', error);
    logger.error('❌ Erro fatal ao iniciar bot:', error);
    console.error('\n💥 Falha ao iniciar o bot!');
    console.error('   Erro:', error.message);
    console.error('   Stack:', error.stack);
    console.error('\n   Verifique os logs acima para detalhes.\n');
    process.exit(1);
  }
}

// Executar
start().catch((error) => {
  logger.error('Erro na função start:', error);
  process.exit(1);
});
