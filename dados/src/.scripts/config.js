import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { paths } from '../utils/paths.js';
import { normalizeJid } from '../utils/helpers.js';

/**
 * Script de configuração interativa do Hinokami Bot 🗡️🔥
 * Permite configurar o bot via linha de comando
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🗡️ CONFIGURAÇÃO - HINOKAMI BOT 🔥   ║
║                                        ║
╚════════════════════════════════════════╝
`);

async function configure() {
  const isInstall = process.argv.includes('--install');
  
  // Carregar configuração existente ou usar padrão
  let config = {
    botName: "Hinokami Bot 🗡️🔥",
    ownerNumber: "55XXXXXXXXXXX",
    prefix: "!",
    debug: false,
    autoRead: true,
    autoTyping: false,
    liteMode: false,
    sessionName: "hinokami_session",
    features: {
      antiDelete: true,
      antiSpam: true,
      cooldown: 3,
      welcomeMessage: true,
      autoSticker: false,
      levelSystem: true,
      economy: true
    },
    limits: {
      maxWarnings: 3,
      maxCommandsPerMinute: 10,
      messageQueueSize: 100
    },
    theme: {
      primaryColor: "🔥",
      secondaryColor: "🗡️",
      emojis: ["🗡️", "🔥", "🌸", "⛩️", "🪵", "💧", "🌙", "⚔️"]
    }
  };

  const configPath = paths.config;
  
  if (fs.existsSync(configPath) && !isInstall) {
    const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    config = { ...config, ...existingConfig };
    console.log('✅ Configuração existente carregada.\n');
  } else {
    console.log('📝 Primeira configuração - vamos começar!\n');
  }

  try {
    // Nome do bot
    const botName = await question(`🤖 Nome do bot [${config.botName}]: `);
    if (botName.trim()) config.botName = botName.trim();

    // Número do dono
    console.log('\n📱 Configure o número do dono (com código do país, sem +)');
    console.log('   Exemplo: 5511999999999');
    const ownerNumber = await question(`   Número [${config.ownerNumber}]: `);
    if (ownerNumber.trim() && !ownerNumber.includes('X')) {
      config.ownerNumber = ownerNumber.trim().replace(/\D/g, '');
    }

    // Prefixo
    const prefix = await question(`\n⚡ Prefixo de comandos [${config.prefix}]: `);
    if (prefix.trim()) config.prefix = prefix.trim();

    // Debug mode
    const debug = await question(`\n🐛 Modo debug? (s/n) [${config.debug ? 's' : 'n'}]: `);
    if (debug.trim().toLowerCase() === 's') config.debug = true;
    else if (debug.trim().toLowerCase() === 'n') config.debug = false;

    // Auto-read
    const autoRead = await question(`\n👁️  Auto-ler mensagens? (s/n) [${config.autoRead ? 's' : 'n'}]: `);
    if (autoRead.trim().toLowerCase() === 's') config.autoRead = true;
    else if (autoRead.trim().toLowerCase() === 'n') config.autoRead = false;

    // Cooldown
    const cooldown = await question(`\n⏱️  Cooldown entre comandos (segundos) [${config.features.cooldown}]: `);
    if (cooldown.trim() && !isNaN(cooldown)) {
      config.features.cooldown = parseInt(cooldown);
    }

    // Salvar configuração
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('\n✅ Configuração salva com sucesso!');
    console.log(`📁 Arquivo: ${configPath}`);
    
    // Se for instalação, também criar banco de dados inicial
    if (isInstall) {
      console.log('\n🔧 Criando estrutura de banco de dados...');
      
      // Criar diretórios
      const dirs = [paths.database, paths.grupos, paths.dono, paths.midias, paths.session];
      for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`   ✅ ${path.basename(dir)}/`);
        }
      }

      // Criar arquivos de banco de dados vazios
      const dbFiles = ['grupos.json', 'usuarios.json', 'config_db.json'];
      for (const file of dbFiles) {
        const filePath = path.join(paths.database, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
          console.log(`   ✅ ${file}`);
        }
      }

      // Adicionar dono ao config_db
      if (config.ownerNumber && !config.ownerNumber.includes('X')) {
        const configDbPath = path.join(paths.database, 'config_db.json');
        const ownerJid = normalizeJid(config.ownerNumber);
        const configDb = { owners: [ownerJid], blacklist: [] };
        fs.writeFileSync(configDbPath, JSON.stringify(configDb, null, 2));
        console.log(`   ✅ Dono configurado no banco de dados`);
      }

      console.log('\n🎉 Instalação concluída!');
      console.log('\n📚 Próximos passos:');
      console.log('   1. npm install (se ainda não executou)');
      console.log('   2. npm start');
      console.log('\n🗡️  Hinokami Bot pronto para proteger! 🔥');
    } else {
      console.log('\n🔄 Configuração atualizada!');
      console.log('   Reinicie o bot para aplicar mudanças.');
    }

  } catch (error) {
    console.error('\n❌ Erro durante configuração:', error.message);
  } finally {
    rl.close();
  }
}

configure();
