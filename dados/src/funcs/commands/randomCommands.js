import axios from 'axios';
import translate from '@vitalets/google-translate-api';
import { evaluate } from 'mathjs';

/**
 * Random/utility command handlers for Hinokami Bot
 * Implements aleatorios menu commands
 */

/**
 * Google Text-to-Speech
 */
export async function handleGtts(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 2) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça o idioma e o texto.\n\n' +
            `💡 *Uso:* !gtts pt Olá mundo\n` +
            `💡 *Idiomas:* pt (português), en (inglês), es (espanhol), etc.`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de texto para voz será implementada em breve.`
  }, { quoted: m });
}

/**
 * Tag yourself
 */
export async function handleTagme(ctx) {
  const { sock, from, m, sender } = ctx;
  
  await sock.sendMessage(from, {
    text: `📢 *Auto-marcação*\n\n@${sender.split('@')[0]} marcou a si mesmo!`,
    mentions: [sender]
  }, { quoted: m });
}

/**
 * Get emoji
 */
export async function handleEmoji(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um emoji ou tipo.\n\n' +
            `💡 *Uso:* !emoji 😀`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: `✅ Emoji: ${args[0]}`
  }, { quoted: m });
}

/**
 * Mix emojis
 */
export async function handleEmojimix(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 1) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça dois emojis para misturar.\n\n' +
            `💡 *Uso:* !emojimix 😀+😎`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de mistura de emojis será implementada em breve.`
  }, { quoted: m });
}

/**
 * Symbol table
 */
export async function handleTabela(ctx) {
  const { sock, from, m } = ctx;
  
  const table = `📊 *TABELA DE SÍMBOLOS*\n\n` +
    `╔══════════════════╗\n` +
    `║  Símbolos Úteis  ║\n` +
    `╚══════════════════╝\n\n` +
    `• ➤ ➥ ➦ ➧ ➨ ➩ ➪ ➫\n` +
    `• ✓ ✔ ✕ ✖ ✗ ✘\n` +
    `• ☑ ☒ ☐\n` +
    `• ❤ ❥ ❦ ❧\n` +
    `• ★ ☆ ⭐ ✪ ✫ ✬ ✭ ✮ ✯\n` +
    `• ♠ ♣ ♥ ♦\n` +
    `• ① ② ③ ④ ⑤ ⑥ ⑦ ⑧ ⑨ ⑩\n` +
    `• ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓\n` +
    `• ⚠ ⚡ ⚙ ⚔ ⚖ ⚗ ⚛\n` +
    `• ☠ ☢ ☣ ☮ ☯ ☸\n\n` +
    `🗡️ Use para decorar suas mensagens!`;
  
  await sock.sendMessage(from, {
    text: table
  }, { quoted: m });
}

/**
 * Biblical advice
 */
export async function handleConselhobiblico(ctx) {
  const { sock, from, m } = ctx;
  
  const verses = [
    '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito..." - João 3:16',
    '"O Senhor é o meu pastor, nada me faltará." - Salmos 23:1',
    '"Tudo posso naquele que me fortalece." - Filipenses 4:13',
    '"Confia no Senhor de todo o teu coração..." - Provérbios 3:5-6',
    '"Entrega o teu caminho ao Senhor..." - Salmos 37:5'
  ];
  
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  
  await sock.sendMessage(from, {
    text: `📖 *CONSELHO BÍBLICO*\n\n${randomVerse}\n\n✝️ Que Deus te abençoe!`
  }, { quoted: m });
}

/**
 * Pick-up lines
 */
export async function handleCantadas(ctx) {
  const { sock, from, m } = ctx;
  
  const lines = [
    'Se você fosse um triângulo, seria AGUDO!',
    'Você acredita em amor à primeira vista ou devo passar por aqui de novo?',
    'Seu nome é Google? Porque você tem tudo que eu procuro.',
    'Você tem um mapa? Porque me perdi nos seus olhos.',
    'Você é WiFi? Porque estou sentindo uma conexão forte!'
  ];
  
  const randomLine = lines[Math.floor(Math.random() * lines.length)];
  
  await sock.sendMessage(from, {
    text: `💘 *CANTADA ALEATÓRIA*\n\n"${randomLine}"\n\n😏 Use com responsabilidade!`
  }, { quoted: m });
}

/**
 * Random advice
 */
export async function handleConselhos(ctx) {
  const { sock, from, m } = ctx;
  
  const advice = [
    'A persistência é o caminho do êxito.',
    'Acredite em você e tudo será possível.',
    'Cada dia é uma nova oportunidade.',
    'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
    'Não espere por oportunidades, crie-as!'
  ];
  
  const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
  
  await sock.sendMessage(from, {
    text: `💡 *CONSELHO DO DIA*\n\n"${randomAdvice}"\n\n🌟 Seja sempre o seu melhor!`
  }, { quoted: m });
}

/**
 * SimSimi chat
 */
export async function handleSimi(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça uma mensagem para conversar.\n\n' +
            `💡 *Uso:* !simi Olá, como vai?`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de chat SimSimi será implementada em breve.`
  }, { quoted: m });
}

/**
 * User profile
 */
export async function handlePerfil(ctx) {
  const { sock, from, m, sender, senderNumber } = ctx;
  
  const profile = `👤 *SEU PERFIL*\n\n` +
    `📱 *Número:* @${senderNumber}\n` +
    `👑 *Nome:* ${m.pushName || 'Desconhecido'}\n` +
    `📊 *Nível:* 1\n` +
    `⭐ *XP:* 0\n` +
    `💰 *Coins:* 0\n\n` +
    `🗡️ Continue usando o bot para subir de nível!`;
  
  await sock.sendMessage(from, {
    text: profile,
    mentions: [sender]
  }, { quoted: m });
}

/**
 * Calculator
 */
export async function handleCalcular(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça uma expressão matemática.\n\n' +
            `💡 *Uso:* !calcular 2+2\n` +
            `💡 *Exemplo:* !calcular (10*5)+20`
    }, { quoted: m });
  }
  
  try {
    const expression = args.join(' ');
    const result = evaluate(expression);
    
    await sock.sendMessage(from, {
      text: `🔢 *CALCULADORA*\n\n` +
            `📊 *Expressão:* ${expression}\n` +
            `✅ *Resultado:* ${result}`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: '❌ *Expressão inválida!*\n\n' +
            `Verifique a sintaxe e tente novamente.`
    }, { quoted: m });
  }
}

/**
 * BMI calculator (obesidade)
 */
export async function handleObesidade(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 2) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça peso e altura.\n\n' +
            `💡 *Uso:* !obesidade 70 1.75\n` +
            `(peso em kg, altura em metros)`
    }, { quoted: m });
  }
  
  const weight = parseFloat(args[0]);
  const height = parseFloat(args[1]);
  
  if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
    return await sock.sendMessage(from, {
      text: '❌ Valores inválidos! Use números positivos.'
    }, { quoted: m });
  }
  
  const bmi = weight / (height * height);
  let category = '';
  
  if (bmi < 18.5) category = 'Abaixo do peso';
  else if (bmi < 25) category = 'Peso normal';
  else if (bmi < 30) category = 'Sobrepeso';
  else if (bmi < 35) category = 'Obesidade Grau I';
  else if (bmi < 40) category = 'Obesidade Grau II';
  else category = 'Obesidade Grau III';
  
  await sock.sendMessage(from, {
    text: `⚖️ *CÁLCULO DE IMC*\n\n` +
          `📊 *Peso:* ${weight} kg\n` +
          `📏 *Altura:* ${height} m\n` +
          `🔢 *IMC:* ${bmi.toFixed(2)}\n` +
          `📋 *Categoria:* ${category}\n\n` +
          `💡 Mantenha uma vida saudável!`
  }, { quoted: m });
}

/**
 * Translate text
 */
export async function handleTraduzir(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 1) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça o texto para traduzir.\n\n' +
            `💡 *Uso:* !traduzir Hello world\n` +
            `(Traduz automaticamente para português)`
    }, { quoted: m });
  }
  
  try {
    const text = args.join(' ');
    const result = await translate(text, { to: 'pt' });
    
    await sock.sendMessage(from, {
      text: `🌐 *TRADUÇÃO*\n\n` +
            `📝 *Original:* ${text}\n` +
            `🔤 *Idioma:* ${result.from.language.iso}\n` +
            `✅ *Tradução:* ${result.text}`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Erro ao traduzir!*\n\n` +
            `Detalhes: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * DDD lookup
 */
export async function handleDDD(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça o código DDD.\n\n' +
            `💡 *Uso:* !ddd 11`
    }, { quoted: m });
  }
  
  const dddMap = {
    '11': 'São Paulo - SP',
    '12': 'São José dos Campos - SP',
    '13': 'Santos - SP',
    '14': 'Bauru - SP',
    '15': 'Sorocaba - SP',
    '16': 'Ribeirão Preto - SP',
    '17': 'São José do Rio Preto - SP',
    '18': 'Presidente Prudente - SP',
    '19': 'Campinas - SP',
    '21': 'Rio de Janeiro - RJ',
    '22': 'Campos dos Goytacazes - RJ',
    '24': 'Volta Redonda - RJ',
    '27': 'Vitória - ES',
    '28': 'Cachoeiro de Itapemirim - ES',
    '31': 'Belo Horizonte - MG',
    '32': 'Juiz de Fora - MG',
    '33': 'Governador Valadares - MG',
    '34': 'Uberlândia - MG',
    '35': 'Poços de Caldas - MG',
    '37': 'Divinópolis - MG',
    '38': 'Montes Claros - MG',
    '41': 'Curitiba - PR',
    '42': 'Ponta Grossa - PR',
    '43': 'Londrina - PR',
    '44': 'Maringá - PR',
    '45': 'Foz do Iguaçu - PR',
    '46': 'Francisco Beltrão - PR',
    '47': 'Joinville - SC',
    '48': 'Florianópolis - SC',
    '49': 'Chapecó - SC',
    '51': 'Porto Alegre - RS',
    '53': 'Pelotas - RS',
    '54': 'Caxias do Sul - RS',
    '55': 'Santa Maria - RS',
    '61': 'Brasília - DF',
    '62': 'Goiânia - GO',
    '63': 'Palmas - TO',
    '64': 'Rio Verde - GO',
    '65': 'Cuiabá - MT',
    '66': 'Rondonópolis - MT',
    '67': 'Campo Grande - MS',
    '68': 'Rio Branco - AC',
    '69': 'Porto Velho - RO',
    '71': 'Salvador - BA',
    '73': 'Ilhéus - BA',
    '74': 'Juazeiro - BA',
    '75': 'Feira de Santana - BA',
    '77': 'Barreiras - BA',
    '79': 'Aracaju - SE',
    '81': 'Recife - PE',
    '82': 'Maceió - AL',
    '83': 'João Pessoa - PB',
    '84': 'Natal - RN',
    '85': 'Fortaleza - CE',
    '86': 'Teresina - PI',
    '87': 'Petrolina - PE',
    '88': 'Juazeiro do Norte - CE',
    '89': 'Picos - PI',
    '91': 'Belém - PA',
    '92': 'Manaus - AM',
    '93': 'Santarém - PA',
    '94': 'Marabá - PA',
    '95': 'Boa Vista - RR',
    '96': 'Macapá - AP',
    '97': 'Coari - AM',
    '98': 'São Luís - MA',
    '99': 'Imperatriz - MA'
  };
  
  const ddd = args[0].replace(/\D/g, '');
  const location = dddMap[ddd];
  
  if (location) {
    await sock.sendMessage(from, {
      text: `📞 *CONSULTA DDD*\n\n` +
            `🔢 *DDD:* ${ddd}\n` +
            `📍 *Localidade:* ${location}`
    }, { quoted: m });
  } else {
    await sock.sendMessage(from, {
      text: `❌ *DDD não encontrado!*\n\n` +
            `🔢 DDD informado: ${ddd}`
    }, { quoted: m });
  }
}

/**
 * Destrava messages
 */
export async function handleDestrava(ctx) {
  const { sock, from, m } = ctx;
  
  const destravaText = '🔓'.repeat(1000);
  
  await sock.sendMessage(from, {
    text: `🔓 *MENSAGEM DESTRAVA 1*\n\n${destravaText}`
  }, { quoted: m });
}

export async function handleDestrava2(ctx) {
  const { sock, from, m } = ctx;
  
  const destravaText = '🚀'.repeat(1000);
  
  await sock.sendMessage(from, {
    text: `🚀 *MENSAGEM DESTRAVA 2*\n\n${destravaText}`
  }, { quoted: m });
}

/**
 * Generate CPF
 */
export async function handleGeracpf(ctx) {
  const { sock, from, m } = ctx;
  
  // Generate random CPF (for demonstration only)
  const randomCPF = () => {
    const n = () => Math.floor(Math.random() * 10);
    return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
  };
  
  await sock.sendMessage(from, {
    text: `🆔 *CPF GERADO (FICTÍCIO)*\n\n` +
          `📄 ${randomCPF()}\n\n` +
          `⚠️ *ATENÇÃO:* Este é um CPF fictício apenas para demonstração.\n` +
          `Não use para fins ilegais!`
  }, { quoted: m });
}

/**
 * URL shorteners
 */
export async function handleTinyurl(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um link para encurtar.\n\n' +
            `💡 *Uso:* !tinyurl https://exemplo.com`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de encurtamento será implementada em breve.`
  }, { quoted: m });
}

export async function handleCuttly(ctx) {
  return await handleTinyurl(ctx);
}

export async function handleBitly(ctx) {
  return await handleTinyurl(ctx);
}

/**
 * IP lookup
 */
export async function handleSip(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um endereço IP.\n\n' +
            `💡 *Uso:* !sip 8.8.8.8`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de consulta de IP será implementada em breve.`
  }, { quoted: m });
}

/**
 * More chat comparison
 */
export async function handleMorechat(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 1) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça duas mensagens separadas por /\n\n' +
            `💡 *Uso:* !morechat mensagem1/mensagem2`
    }, { quoted: m });
  }
  
  const messages = args.join(' ').split('/');
  if (messages.length < 2) {
    return await sock.sendMessage(from, {
      text: '❌ Forneça duas mensagens separadas por /'
    }, { quoted: m });
  }
  
  const similarity = Math.floor(Math.random() * 101);
  
  await sock.sendMessage(from, {
    text: `📊 *COMPARAÇÃO DE MENSAGENS*\n\n` +
          `📝 *Mensagem 1:* ${messages[0]}\n` +
          `📝 *Mensagem 2:* ${messages[1]}\n\n` +
          `🔍 *Similaridade:* ${similarity}%`
  }, { quoted: m });
}

/**
 * Count days
 */
export async function handleContardias(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de contagem de dias será implementada em breve.`
  }, { quoted: m });
}

/**
 * Make fancy nick
 */
export async function handleFazernick(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um texto para estilizar.\n\n' +
            `💡 *Uso:* !fazernick Seu Nome`
    }, { quoted: m });
  }
  
  const text = args.join(' ');
  const styles = [
    `🌟 ${text} 🌟`,
    `『 ${text} 』`,
    `【 ${text} 】`,
    `༺ ${text} ༻`,
    `⫷ ${text} ⫸`
  ];
  
  const styledText = styles.join('\n');
  
  await sock.sendMessage(from, {
    text: `✨ *NICKS ESTILIZADOS*\n\n${styledText}\n\n🎨 Escolha o seu favorito!`
  }, { quoted: m });
}

export default {
  handleGtts,
  handleTagme,
  handleEmoji,
  handleEmojimix,
  handleTabela,
  handleConselhobiblico,
  handleCantadas,
  handleConselhos,
  handleSimi,
  handlePerfil,
  handleCalcular,
  handleObesidade,
  handleTraduzir,
  handleDDD,
  handleDestrava,
  handleDestrava2,
  handleGeracpf,
  handleTinyurl,
  handleCuttly,
  handleBitly,
  handleSip,
  handleMorechat,
  handleContardias,
  handleFazernick
};
