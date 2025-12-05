import { connectToWhatsApp, hasSession, logger } from '../connect.js';
import handleMessage from '../index.js';
import fs from 'fs';
import path from 'path';
import { paths } from '../utils/paths.js';

/**
 * Script de inicialização do Hinokami Bot 🗡️🔥
 * Inicia conexão e processamento de mensagens
 */

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║     🗡️  HINOKAMI BOT - TANJIRO  🔥     ║
║                                        ║
║   Respiração do Sol - Forma Inicial    ║
║                                        ║
╚════════════════════════════════════════╝
`);

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
    logger.info(`✅ Diretório criado: ${dir}`);
  }
}

// Verificar arquivo de configuração
const configPath = paths.config;
if (!fs.existsSync(configPath)) {
  console.error('❌ Arquivo config.json não encontrado!');
  console.error('   Execute: npm run config:install');
  process.exit(1);
}

// Carregar configuração
let config;
try {
  const configData = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configData);
  logger.info('✅ Configuração carregada');
} catch (error) {
  console.error('❌ Erro ao carregar config.json:', error.message);
  process.exit(1);
}

// Verificar se número do dono está configurado
if (!config.ownerNumber || config.ownerNumber.includes('XXX')) {
  console.warn('\n⚠️  ATENÇÃO: Configure o número do dono do bot!');
  console.warn('   Edite: dados/src/config.json');
  console.warn('   Campo: ownerNumber\n');
}

// Verificar sessão
if (!hasSession()) {
  console.log('\n📱 Primeira execução detectada!');
  console.log('   Prepare-se para escanear o QR Code...\n');
}

// Handlers de processo
process.on('uncaughtException', (err) => {
  logger.error('Exceção não capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', reason);
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 Encerrando Hinokami Bot...');
  console.log('   Até breve, guerreiro! 🗡️\n');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Encerrando Hinokami Bot (SIGTERM)...');
  process.exit(0);
});

// Iniciar bot
async function start() {
  try {
    logger.info('🔥 Iniciando Hinokami Bot...');
    
    const sock = await connectToWhatsApp(handleMessage);
    
    logger.info('✅ Bot inicializado com sucesso!');
    
    // Keep process alive - the bot will run continuously
    // Heartbeat could be added here for monitoring if needed
    
  } catch (error) {
    logger.error('❌ Erro fatal ao iniciar bot:', error);
    console.error('\n💥 Falha ao iniciar o bot!');
    console.error('   Verifique os logs acima para detalhes.\n');
    process.exit(1);
  }
}

// Executar
start().catch((error) => {
  logger.error('Erro na função start:', error);
  process.exit(1);
});
