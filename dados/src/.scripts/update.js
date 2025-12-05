import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Script de atualização do Hinokami Bot 🗡️🔥
 * Atualiza dependências e verifica por atualizações
 */

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║    🔄 ATUALIZAÇÃO - HINOKAMI BOT 🔥   ║
║                                        ║
╚════════════════════════════════════════╝
`);

async function update() {
  try {
    console.log('🔍 Verificando atualizações...\n');

    // Atualizar npm
    console.log('📦 Atualizando dependências...');
    const { stdout: npmOutput } = await execAsync('npm update');
    if (npmOutput) console.log(npmOutput);

    console.log('\n✅ Dependências atualizadas!');

    // Verificar versões desatualizadas
    console.log('\n🔎 Verificando pacotes desatualizados...');
    try {
      const { stdout: outdatedOutput } = await execAsync('npm outdated');
      if (outdatedOutput) {
        console.log('\n⚠️  Pacotes desatualizados encontrados:');
        console.log(outdatedOutput);
        console.log('\n💡 Execute "npm update" ou atualize manualmente se desejar.');
      } else {
        console.log('✅ Todos os pacotes estão atualizados!');
      }
    } catch (error) {
      // npm outdated retorna erro se nada está desatualizado (exit code 1)
      if (error.stdout) {
        console.log('\n⚠️  Pacotes desatualizados:');
        console.log(error.stdout);
      } else {
        console.log('✅ Todos os pacotes estão atualizados!');
      }
    }

    console.log('\n🗡️  Atualização concluída! 🔥');
    console.log('   Reinicie o bot para aplicar mudanças.\n');

  } catch (error) {
    console.error('\n❌ Erro durante atualização:', error.message);
    process.exit(1);
  }
}

update();
