import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import { logError, logInfo, logSuccess } from '../../utils/colorLogger.js';

/**
 * Handlers de comandos aleatórios/utilitários
 */

/**
 * Traduz texto usando Google Translate
 */
export async function handleTraduzir(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `❌ Digite o texto para traduzir.\n\n*Uso:* !traduzir <texto>\n*Exemplo:* !traduzir Hello world`
      }, { quoted: m });
      return;
    }
    
    const text = args.join(' ');
    logInfo('AleatoriosHandler', `Traduzindo: ${text}`);
    
    const result = await translate(text, { to: 'pt' });
    
    let response = `🌐 *Tradutor*\n\n`;
    response += `📝 *Original (${result.from.language.iso}):*\n${text}\n\n`;
    response += `✅ *Tradução (PT):*\n${result.text}`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('AleatoriosHandler', 'Tradução concluída');
    
  } catch (error) {
    logError('AleatoriosHandler', `Erro ao traduzir: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao traduzir: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Calculadora
 */
export async function handleCalcular(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `❌ Digite uma expressão matemática.\n\n*Exemplo:* !calcular 2 + 2\n*Exemplo:* !calcular 10 * 5 + 3`
      }, { quoted: m });
      return;
    }
    
    // Sanitiza expressão removendo caracteres perigosos
    const expression = args.join(' ').replace(/[^0-9+\-*/().\s]/g, '');
    
    if (!expression) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Expressão inválida. Use apenas números e operadores (+, -, *, /, ())'
      }, { quoted: m });
      return;
    }
    
    logInfo('AleatoriosHandler', `Calculando: ${expression}`);
    
    // NOTE: Using Function() for eval is a security risk, but the input is heavily sanitized
    // Only numeric characters and basic math operators are allowed
    // TODO: Consider migrating to mathjs library for safer expression evaluation
    let result;
    try {
      result = Function(`'use strict'; return (${expression})`)();
    } catch {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Expressão matemática inválida.'
      }, { quoted: m });
      return;
    }
    
    let response = `🧮 *Calculadora*\n\n`;
    response += `📝 *Expressão:* ${expression}\n`;
    response += `✅ *Resultado:* ${result}`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('AleatoriosHandler', 'Cálculo concluído');
    
  } catch (error) {
    logError('AleatoriosHandler', `Erro ao calcular: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao calcular: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Gerar CPF fictício
 */
export async function handleGerarCPF(ctx) {
  const { sock, m } = ctx;
  
  try {
    logInfo('AleatoriosHandler', 'Gerando CPF fictício');
    
    // Gera CPF válido (algoritmo de validação)
    function gerarCPF() {
      const n = () => Math.floor(Math.random() * 9);
      const cpf = [n(), n(), n(), n(), n(), n(), n(), n(), n()];
      
      // Calcula primeiro dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += cpf[i] * (10 - i);
      }
      let dig1 = 11 - (sum % 11);
      dig1 = dig1 >= 10 ? 0 : dig1;
      cpf.push(dig1);
      
      // Calcula segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += cpf[i] * (11 - i);
      }
      let dig2 = 11 - (sum % 11);
      dig2 = dig2 >= 10 ? 0 : dig2;
      cpf.push(dig2);
      
      return cpf.join('');
    }
    
    const cpf = gerarCPF();
    const formatted = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    
    let response = `🆔 *Gerador de CPF*\n\n`;
    response += `📋 *CPF Gerado:* ${formatted}\n`;
    response += `🔢 *Sem formatação:* ${cpf}\n\n`;
    response += `⚠️ *ATENÇÃO:* Este é um CPF fictício gerado aleatoriamente para fins de teste. Não use para fraudes!`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('AleatoriosHandler', 'CPF gerado');
    
  } catch (error) {
    logError('AleatoriosHandler', `Erro ao gerar CPF: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao gerar CPF: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Calcular IMC (obesidade)
 */
export async function handleObesidade(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length < 2) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `❌ Use: !obesidade <peso> <altura>\n\n*Exemplo:* !obesidade 70 1.75`
      }, { quoted: m });
      return;
    }
    
    const peso = parseFloat(args[0].replace(',', '.'));
    const altura = parseFloat(args[1].replace(',', '.'));
    
    if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Valores inválidos. Digite peso e altura válidos.'
      }, { quoted: m });
      return;
    }
    
    const imc = peso / (altura * altura);
    
    let classificacao = '';
    let emoji = '';
    
    if (imc < 18.5) {
      classificacao = 'Abaixo do peso';
      emoji = '⚠️';
    } else if (imc < 25) {
      classificacao = 'Peso normal';
      emoji = '✅';
    } else if (imc < 30) {
      classificacao = 'Sobrepeso';
      emoji = '⚠️';
    } else if (imc < 35) {
      classificacao = 'Obesidade Grau I';
      emoji = '🔴';
    } else if (imc < 40) {
      classificacao = 'Obesidade Grau II';
      emoji = '🔴🔴';
    } else {
      classificacao = 'Obesidade Grau III (Mórbida)';
      emoji = '🔴🔴🔴';
    }
    
    let response = `⚖️ *Calculadora de IMC*\n\n`;
    response += `👤 *Peso:* ${peso.toFixed(1)} kg\n`;
    response += `📏 *Altura:* ${altura.toFixed(2)} m\n`;
    response += `📊 *IMC:* ${imc.toFixed(2)}\n`;
    response += `${emoji} *Classificação:* ${classificacao}\n\n`;
    response += `📋 *Tabela de referência:*\n`;
    response += `• Abaixo de 18.5: Abaixo do peso\n`;
    response += `• 18.5 - 24.9: Peso normal\n`;
    response += `• 25.0 - 29.9: Sobrepeso\n`;
    response += `• 30.0 - 34.9: Obesidade Grau I\n`;
    response += `• 35.0 - 39.9: Obesidade Grau II\n`;
    response += `• Acima de 40: Obesidade Grau III`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('AleatoriosHandler', 'IMC calculado');
    
  } catch (error) {
    logError('AleatoriosHandler', `Erro ao calcular IMC: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao calcular: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Encurtar URL com TinyURL
 */
export async function handleTinyURL(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Digite uma URL para encurtar.\n\n*Exemplo:* !tinyurl https://www.exemplo.com.br/pagina/muito/longa'
      }, { quoted: m });
      return;
    }
    
    const url = args[0];
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ URL inválida. Certifique-se de incluir http:// ou https://'
      }, { quoted: m });
      return;
    }
    
    logInfo('AleatoriosHandler', `Encurtando URL: ${url}`);
    
    // Timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: serviço não respondeu em 10 segundos')), 10000);
    });
    
    // Request promise
    const requestPromise = axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    
    // Race between timeout and request
    const response = await Promise.race([requestPromise, timeoutPromise]);
    const shortUrl = response.data;
    
    let message = `🔗 *Encurtador de URL - TinyURL*\n\n`;
    message += `📎 *URL Original:*\n${url}\n\n`;
    message += `✅ *URL Encurtada:*\n${shortUrl}`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: message
    }, { quoted: m });
    
    logSuccess('AleatoriosHandler', 'URL encurtada');
    
  } catch (error) {
    logError('AleatoriosHandler', `Erro ao encurtar URL: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao encurtar URL: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Mensagem destrava
 */
export async function handleDestrava(ctx) {
  const { sock, m } = ctx;
  
  try {
    const destravaText = '🔓'.repeat(1000);
    
    await sock.sendMessage(m.key.remoteJid, {
      text: destravaText
    }, { quoted: m });
    
    logSuccess('AleatoriosHandler', 'Destrava enviado');
    
  } catch (error) {
    logError('AleatoriosHandler', `Erro ao enviar destrava: ${error.message}`);
  }
}

/**
 * Stub handlers - a serem implementados
 */
export async function handleGTTS(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando GTTS em desenvolvimento. Configure GOOGLE_TTS_API.'
  }, { quoted: ctx.m });
}

export async function handleEmoji(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento.'
  }, { quoted: ctx.m });
}

export async function handleEmojiMix(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento.'
  }, { quoted: ctx.m });
}

export async function handleTabela(ctx) {
  const tabela = `📋 *Tabela de Símbolos*

╔═══════════════════╗
║ Setas e Direções  ║
╚═══════════════════╝
→ ← ↑ ↓ ↔ ↕ ⇒ ⇐ ⇑ ⇓

╔═══════════════════╗
║ Símbolos Comuns   ║
╚═══════════════════╝
★ ☆ ✓ ✔ ✗ ✘ ♀ ♂ ♥ ♦ ♣ ♠

╔═══════════════════╗
║ Matemática        ║
╚═══════════════════╝
± × ÷ = ≠ ≈ ∞ √ ∑ ∏ π

╔═══════════════════╗
║ Moedas            ║
╚═══════════════════╝
$ € £ ¥ ₹ ₽ ₿

╔═══════════════════╗
║ Zodíaco           ║
╚═══════════════════╝
♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓`;

  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: tabela
  }, { quoted: ctx.m });
}

export async function handleSimi(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 SimSimi em desenvolvimento. Configure SIMI_API_KEY.'
  }, { quoted: ctx.m });
}

export async function handleConselhos(ctx) {
  const conselhos = [
    'Seja gentil com você mesmo.',
    'O fracasso é apenas uma oportunidade para recomeçar com mais inteligência.',
    'Acredite em si mesmo e todo o resto se encaixará.',
    'A persistência é o caminho do êxito.',
    'Grandes coisas nunca vêm de zonas de conforto.',
    'Você é mais forte do que pensa.',
    'Cada dia é uma nova chance de melhorar.',
    'Não desista, os milagres acontecem todos os dias.',
    'A disciplina é a ponte entre metas e realizações.',
    'Seja a mudança que você quer ver no mundo.'
  ];
  
  const conselho = conselhos[Math.floor(Math.random() * conselhos.length)];
  
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: `💡 *Conselho do dia:*\n\n"${conselho}"`
  }, { quoted: ctx.m });
}

export async function handleCantadas(ctx) {
  const cantadas = [
    'Você tem um mapa? Porque eu me perdi nos seus olhos.',
    'Se beleza fosse crime, você estaria condenada à prisão perpétua.',
    'Você é Wi-Fi? Porque estou sentindo uma conexão.',
    'Seus pais são terroristas? Porque você é a bomba!',
    'Você acredita em amor à primeira vista, ou devo passar por aqui novamente?',
    'Você tem Band-Aid? Porque eu me machuquei ao cair por você.',
    'Se você fosse uma fruta, seria uma "fine-apple".',
    'Você é astronauta? Porque seu sorriso ilumina meu universo.',
    'Seu nome é Google? Porque você tem tudo o que eu procuro.',
    'Você é feita de cobre e telúrio? Porque você é CuTe!'
  ];
  
  const cantada = cantadas[Math.floor(Math.random() * cantadas.length)];
  
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: `😏 *Cantada:*\n\n"${cantada}"`
  }, { quoted: ctx.m });
}

export default {
  handleTraduzir,
  handleCalcular,
  handleGerarCPF,
  handleObesidade,
  handleTinyURL,
  handleDestrava,
  handleGTTS,
  handleEmoji,
  handleEmojiMix,
  handleTabela,
  handleSimi,
  handleConselhos,
  handleCantadas
};
