import axios from 'axios';
import cheerio from 'cheerio';
import googleIt from 'google-it';
import { logError, logInfo, logSuccess } from '../../utils/colorLogger.js';

/**
 * Handlers de comandos de pesquisa
 * Integração com várias APIs e web scraping
 */

/**
 * Busca no Google
 */
export async function handleGoogleSearch(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Digite algo para pesquisar no Google.\nExemplo: `!googlesrc Node.js tutorial`'
      }, { quoted: m });
      return;
    }
    
    const query = args.join(' ');
    logInfo('SearchHandler', `Buscando no Google: ${query}`);
    
    const results = await googleIt({ query, limit: 5 });
    
    if (!results || results.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Nenhum resultado encontrado.'
      }, { quoted: m });
      return;
    }
    
    let response = `🔍 *Resultados do Google para:* ${query}\n\n`;
    
    results.forEach((result, index) => {
      response += `*${index + 1}.* ${result.title}\n`;
      response += `🔗 ${result.link}\n`;
      if (result.snippet) {
        response += `📝 ${result.snippet}\n`;
      }
      response += `\n`;
    });
    
    await sock.sendMessage(m.key.remoteJid, {
      text: response
    }, { quoted: m });
    
    logSuccess('SearchHandler', 'Busca no Google concluída');
    
  } catch (error) {
    logError('SearchHandler', `Erro na busca Google: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao buscar: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Busca na Wikipedia
 */
export async function handleWikipedia(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Digite algo para pesquisar na Wikipedia.\nExemplo: `!wikipedia Brasil`'
      }, { quoted: m });
      return;
    }
    
    const query = args.join(' ');
    logInfo('SearchHandler', `Buscando na Wikipedia: ${query}`);
    
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    
    if (!response.data || response.data.type === 'disambiguation') {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Termo ambíguo ou não encontrado. Seja mais específico.'
      }, { quoted: m });
      return;
    }
    
    const { title, extract, thumbnail, content_urls } = response.data;
    
    let message = `📚 *Wikipedia: ${title}*\n\n`;
    message += `${extract}\n\n`;
    message += `🔗 Leia mais: ${content_urls.desktop.page}`;
    
    if (thumbnail && thumbnail.source) {
      await sock.sendMessage(m.key.remoteJid, {
        image: { url: thumbnail.source },
        caption: message
      }, { quoted: m });
    } else {
      await sock.sendMessage(m.key.remoteJid, {
        text: message
      }, { quoted: m });
    }
    
    logSuccess('SearchHandler', 'Busca na Wikipedia concluída');
    
  } catch (error) {
    logError('SearchHandler', `Erro na busca Wikipedia: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao buscar na Wikipedia: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Consulta CEP
 */
export async function handleCEP(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Digite um CEP para consultar.\nExemplo: `!scep 01310-100`'
      }, { quoted: m });
      return;
    }
    
    const cep = args[0].replace(/\D/g, '');
    
    if (cep.length !== 8) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ CEP inválido. Digite um CEP com 8 dígitos.'
      }, { quoted: m });
      return;
    }
    
    logInfo('SearchHandler', `Consultando CEP: ${cep}`);
    
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (response.data.erro) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ CEP não encontrado.'
      }, { quoted: m });
      return;
    }
    
    const { logradouro, complemento, bairro, localidade, uf, ddd } = response.data;
    
    let message = `📮 *Consulta de CEP*\n\n`;
    message += `📍 *CEP:* ${cep.replace(/(\d{5})(\d{3})/, '$1-$2')}\n`;
    message += `🛣️ *Logradouro:* ${logradouro || 'N/A'}\n`;
    if (complemento) message += `➕ *Complemento:* ${complemento}\n`;
    message += `🏘️ *Bairro:* ${bairro || 'N/A'}\n`;
    message += `🏙️ *Cidade:* ${localidade || 'N/A'}\n`;
    message += `🗺️ *Estado:* ${uf || 'N/A'}\n`;
    message += `📞 *DDD:* ${ddd || 'N/A'}`;
    
    await sock.sendMessage(m.key.remoteJid, {
      text: message
    }, { quoted: m });
    
    logSuccess('SearchHandler', 'Consulta CEP concluída');
    
  } catch (error) {
    logError('SearchHandler', `Erro na consulta CEP: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao consultar CEP: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Consulta DDD
 */
export async function handleDDD(ctx) {
  const { sock, m, args } = ctx;
  
  try {
    if (args.length === 0) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Digite um DDD para consultar.\nExemplo: `!ddd 11`'
      }, { quoted: m });
      return;
    }
    
    const ddd = args[0].replace(/\D/g, '');
    
    // Base de dados simples de DDDs brasileiros
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
    
    const location = dddMap[ddd];
    
    if (!location) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ DDD não encontrado ou inválido.'
      }, { quoted: m });
      return;
    }
    
    await sock.sendMessage(m.key.remoteJid, {
      text: `📞 *Consulta de DDD*\n\n*DDD ${ddd}:* ${location}`
    }, { quoted: m });
    
    logSuccess('SearchHandler', 'Consulta DDD concluída');
    
  } catch (error) {
    logError('SearchHandler', `Erro na consulta DDD: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao consultar DDD: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Stub handlers - a serem implementados
 */
export async function handlePensador(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento. Em breve!'
  }, { quoted: ctx.m });
}

export async function handleNasa(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento. Configure NASA_API_KEY no ambiente.'
  }, { quoted: ctx.m });
}

export async function handleClima(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento. Configure WEATHER_API_KEY no ambiente.'
  }, { quoted: ctx.m });
}

export async function handleMovie(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento. Configure OMDB_API_KEY no ambiente.'
  }, { quoted: ctx.m });
}

export async function handlePlayStore(ctx) {
  await ctx.sock.sendMessage(ctx.m.key.remoteJid, {
    text: '🚧 Comando em desenvolvimento.'
  }, { quoted: ctx.m });
}

export default {
  handleGoogleSearch,
  handleWikipedia,
  handleCEP,
  handleDDD,
  handlePensador,
  handleNasa,
  handleClima,
  handleMovie,
  handlePlayStore
};
