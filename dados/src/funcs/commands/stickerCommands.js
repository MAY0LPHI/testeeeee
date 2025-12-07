import { downloadMediaMessage } from 'whaileys';
import axios from 'axios';
import {
  createImageSticker,
  createVideoSticker,
  stickerToImage,
  isVideoOrGif,
  STICKER_CONFIG
} from '../../utils/stickerUtil.js';

/**
 * Sticker command handlers for Hinokami Bot
 * Implements all figurinha-related commands
 */

/**
 * Create sticker from image or video
 */
export async function handleSticker(ctx) {
  const { sock, from, m, args } = ctx;
  
  try {
    // Get quoted message or current message
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const messageToProcess = quotedMsg || m.message;
    
    // Check if there's media in the message
    const imageMsg = messageToProcess?.imageMessage;
    const videoMsg = messageToProcess?.videoMessage;
    const stickerMsg = messageToProcess?.stickerMessage;
    
    if (!imageMsg && !videoMsg && !stickerMsg) {
      return await sock.sendMessage(from, {
        text: '❌ *Erro!*\n\n' +
              'Envie ou marque uma imagem/vídeo para criar a figurinha.\n\n' +
              `💡 *Uso:* Envie uma imagem e digite !sticker\n` +
              `💡 *Ou:* Marque uma imagem/vídeo e digite !sticker`
      }, { quoted: m });
    }
    
    // Parse metadata from args
    let pack = STICKER_CONFIG.defaultPack;
    let author = STICKER_CONFIG.defaultAuthor;
    
    if (args.length >= 2) {
      pack = args[0];
      author = args[1];
    }
    
    // Send processing message
    await sock.sendMessage(from, {
      text: '⏳ Criando figurinha...\n\n🗡️ Aguarde um momento!'
    }, { quoted: m });
    
    // Download media
    const mediaBuffer = await downloadMediaMessage(
      quotedMsg ? { message: quotedMsg } : m,
      'buffer',
      {}
    );
    
    // Create sticker based on media type
    let stickerBuffer;
    
    if (videoMsg) {
      // Check if video is too long
      const tempFile = `/tmp/check_${Date.now()}.mp4`;
      await import('fs/promises').then(fs => fs.writeFile(tempFile, mediaBuffer));
      
      const { getVideoDuration } = await import('../../utils/stickerUtil.js');
      const duration = await getVideoDuration(tempFile).catch(() => 0);
      
      await import('fs/promises').then(fs => fs.unlink(tempFile).catch(() => {}));
      
      if (duration > STICKER_CONFIG.maxVideoSeconds) {
        return await sock.sendMessage(from, {
          text: `❌ *Vídeo muito longo!*\n\n` +
                `🕐 Duração: ${Math.round(duration)}s\n` +
                `📊 Máximo permitido: ${STICKER_CONFIG.maxVideoSeconds}s\n\n` +
                `💡 Corte o vídeo e tente novamente.`
        }, { quoted: m });
      }
      
      stickerBuffer = await createVideoSticker(mediaBuffer, { pack, author });
    } else {
      stickerBuffer = await createImageSticker(mediaBuffer, { pack, author });
    }
    
    // Send sticker
    await sock.sendMessage(from, {
      sticker: stickerBuffer
    }, { quoted: m });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Erro ao criar figurinha!*\n\n` +
            `Detalhes: ${error.message}\n\n` +
            `💡 Tente novamente com outra imagem/vídeo.`
    }, { quoted: m });
  }
}

/**
 * Alias for handleSticker - fsticker command
 */
export async function handleFsticker(ctx) {
  return await handleSticker(ctx);
}

/**
 * Convert sticker to image
 */
export async function handleToImg(ctx) {
  const { sock, from, m } = ctx;
  
  try {
    // Get quoted message
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quotedMsg?.stickerMessage) {
      return await sock.sendMessage(from, {
        text: '❌ *Erro!*\n\n' +
              'Marque uma figurinha para converter em imagem.\n\n' +
              `💡 *Uso:* Marque uma figurinha e digite !toimg`
      }, { quoted: m });
    }
    
    await sock.sendMessage(from, {
      text: '⏳ Convertendo figurinha...'
    }, { quoted: m });
    
    // Download sticker
    const stickerBuffer = await downloadMediaMessage(
      { message: quotedMsg },
      'buffer',
      {}
    );
    
    // Convert to image
    const imageBuffer = await stickerToImage(stickerBuffer);
    
    // Send image
    await sock.sendMessage(from, {
      image: imageBuffer,
      caption: '✅ Figurinha convertida em imagem!'
    }, { quoted: m });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Erro ao converter figurinha!*\n\n` +
            `Detalhes: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Text to sticker (ttp)
 */
export async function handleTtp(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um texto para criar a figurinha.\n\n' +
            `💡 *Uso:* !ttp seu texto aqui`
    }, { quoted: m });
  }
  
  try {
    const text = args.join(' ');
    
    await sock.sendMessage(from, {
      text: '⏳ Criando figurinha de texto...'
    }, { quoted: m });
    
    // Use external API for text-to-image
    const apiUrl = `https://api.lolhuman.xyz/api/ttp?apikey=GataDios&text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    
    // Convert to sticker
    const stickerBuffer = await createImageSticker(imageBuffer);
    
    await sock.sendMessage(from, {
      sticker: stickerBuffer
    }, { quoted: m });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Erro ao criar figurinha de texto!*\n\n` +
            `⚠️ Serviço temporariamente indisponível.\n` +
            `Tente novamente mais tarde.`
    }, { quoted: m });
  }
}

/**
 * Animated text to sticker (attp)
 */
export async function handleAttp(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um texto para criar a figurinha animada.\n\n' +
            `💡 *Uso:* !attp seu texto aqui`
    }, { quoted: m });
  }
  
  try {
    const text = args.join(' ');
    
    await sock.sendMessage(from, {
      text: '⏳ Criando figurinha animada...'
    }, { quoted: m });
    
    // Use external API for animated text
    const apiUrl = `https://api.lolhuman.xyz/api/attp?apikey=GataDios&text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const webpBuffer = Buffer.from(response.data);
    
    await sock.sendMessage(from, {
      sticker: webpBuffer
    }, { quoted: m });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Erro ao criar figurinha animada!*\n\n` +
            `⚠️ Serviço temporariamente indisponível.\n` +
            `Tente novamente mais tarde.`
    }, { quoted: m });
  }
}

/**
 * Rename sticker metadata
 */
export async function handleRename(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length < 2) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça o nome do pack e autor.\n\n' +
            `💡 *Uso:* Marque uma figurinha e digite:\n` +
            `!rename NomeDoPack NomeDoAutor`
    }, { quoted: m });
  }
  
  try {
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quotedMsg?.stickerMessage && !quotedMsg?.imageMessage) {
      return await sock.sendMessage(from, {
        text: '❌ Marque uma figurinha ou imagem para renomear!'
      }, { quoted: m });
    }
    
    const pack = args[0];
    const author = args[1];
    
    await sock.sendMessage(from, {
      text: '⏳ Renomeando figurinha...'
    }, { quoted: m });
    
    // Download media
    const mediaBuffer = await downloadMediaMessage(
      { message: quotedMsg },
      'buffer',
      {}
    );
    
    // Recreate sticker with new metadata
    const stickerBuffer = await createImageSticker(mediaBuffer, { pack, author });
    
    await sock.sendMessage(from, {
      sticker: stickerBuffer
    }, { quoted: m });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ *Erro ao renomear figurinha!*\n\n` +
            `Detalhes: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Quote to sticker (qc)
 */
export async function handleQc(ctx) {
  const { sock, from, m } = ctx;
  
  try {
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quotedMsg) {
      return await sock.sendMessage(from, {
        text: '❌ *Erro!*\n\n' +
              'Marque uma mensagem para criar figurinha de quote.\n\n' +
              `💡 *Uso:* Marque uma mensagem e digite !qc`
      }, { quoted: m });
    }
    
    await sock.sendMessage(from, {
      text: '❌ *Comando em desenvolvimento!*\n\n' +
            `⚠️ A funcionalidade de quote para sticker será implementada em breve.`
    }, { quoted: m });
    
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Brat style sticker
 */
export async function handleBrat(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um texto para criar sticker estilo brat.\n\n' +
            `💡 *Uso:* !brat seu texto`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de sticker brat será implementada em breve.`
  }, { quoted: m });
}

/**
 * Brat video style sticker
 */
export async function handleBratvideo(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ *Erro!*\n\n' +
            'Forneça um texto para criar vídeo estilo brat.\n\n' +
            `💡 *Uso:* !bratvideo seu texto`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ *Comando em desenvolvimento!*\n\n' +
          `⚠️ A funcionalidade de vídeo brat será implementada em breve.`
  }, { quoted: m });
}

export default {
  handleSticker,
  handleFsticker,
  handleToImg,
  handleTtp,
  handleAttp,
  handleRename,
  handleQc,
  handleBrat,
  handleBratvideo
};
