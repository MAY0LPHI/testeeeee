/**
 * Sticker Command Handler for Hinokami Bot
 * Supports static images and animated videos/GIFs
 */

import {
  imageToWebp,
  videoToWebpAnimated,
  applyWebpMetadata,
  validateMediaType,
  isSupportedImage,
  isSupportedVideo,
  getFileSizeMB
} from '../utils/media.js';

/**
 * Create sticker from image or video
 * Supports:
 * - Direct image attachment (static)
 * - Replied/quoted image (static)
 * - Direct video/GIF (animated, max 10s, 5MB)
 * - Replied/quoted video/GIF (animated)
 * 
 * @param {Object} ctx - Command context
 */
export async function handleSticker(ctx) {
  const { sock, from, m, quoted, quotedMsg } = ctx;
  
  try {
    // Determine if we're working with a direct message or quoted message
    let targetMessage = m;
    let hasQuoted = false;
    
    // Check if there's a quoted message
    if (quoted) {
      // Create a pseudo message object from quoted content
      targetMessage = {
        message: quoted
      };
      hasQuoted = true;
    }
    
    // Check if message has media
    const messageType = Object.keys(targetMessage.message || {})[0];
    
    if (!messageType || (!targetMessage.message.imageMessage && !targetMessage.message.videoMessage && !targetMessage.message.stickerMessage)) {
      return await sendReply(ctx, 
        `🎨 *Como criar figurinhas* 🗡️\n\n` +
        `📌 *Figurinha estática (imagem):*\n` +
        `   • Envie uma imagem com ${ctx.prefix}sticker\n` +
        `   • Ou responda uma imagem com ${ctx.prefix}sticker\n\n` +
        `📌 *Figurinha animada (vídeo/GIF):*\n` +
        `   • Envie um vídeo/GIF com ${ctx.prefix}sticker\n` +
        `   • Ou responda um vídeo/GIF com ${ctx.prefix}sticker\n\n` +
        `⚠️ *Limites:*\n` +
        `   • Vídeos: máximo 10 segundos\n` +
        `   • Tamanho: máximo 5MB\n\n` +
        `🔥 _Respiração do Sol - Criação de Figurinhas!_`
      );
    }
    
    // Send processing message
    await sendReply(ctx, '⏳ Criando figurinha... Por favor aguarde! 🔥');
    
    // Handle image (static sticker)
    if (targetMessage.message.imageMessage) {
      await createStaticSticker(ctx, targetMessage, hasQuoted);
    }
    // Handle video/GIF (animated sticker)
    else if (targetMessage.message.videoMessage) {
      await createAnimatedSticker(ctx, targetMessage, hasQuoted);
    }
    // Handle sticker to image conversion
    else if (targetMessage.message.stickerMessage) {
      return await sendReply(ctx,
        `ℹ️ Para converter figurinha em imagem, use:\n${ctx.prefix}toimg`
      );
    }
    
  } catch (error) {
    console.error('Erro no handler de sticker:', error);
    
    // User-friendly error messages in PT-BR
    let errorMessage = '❌ Erro ao criar figurinha!';
    
    if (error.message.includes('muito longo')) {
      errorMessage = `❌ ${error.message}\n\n💡 Tente um vídeo mais curto!`;
    } else if (error.message.includes('muito grande')) {
      errorMessage = `❌ ${error.message}\n\n💡 Tente comprimir o arquivo primeiro!`;
    } else if (error.message.includes('formato não suportado')) {
      errorMessage = `❌ ${error.message}\n\n💡 Formatos aceitos:\n• Imagens: JPG, PNG, WebP\n• Vídeos: MP4, GIF`;
    } else {
      errorMessage = `❌ Erro ao criar figurinha: ${error.message}`;
    }
    
    await sendReply(ctx, errorMessage);
  }
}

/**
 * Create static sticker from image
 * @param {Object} ctx - Command context
 * @param {Object} message - Message containing image
 * @param {boolean} hasQuoted - Whether this is a quoted message
 */
async function createStaticSticker(ctx, message, hasQuoted = false) {
  const { sock, from } = ctx;
  
  try {
    // For WhatsApp libraries, we need to download the media differently
    // The message object structure depends on whether it's quoted or direct
    let buffer;
    
    if (hasQuoted) {
      // For quoted messages, download using the sock's downloadMediaMessage
      buffer = await sock.downloadMediaMessage(message);
    } else {
      // For direct messages, also use downloadMediaMessage
      buffer = await sock.downloadMediaMessage(message);
    }
    
    // Validate file type
    const fileType = await validateMediaType(buffer);
    if (!isSupportedImage(fileType?.mime)) {
      throw new Error(`Formato não suportado: ${fileType?.mime || 'desconhecido'}. Use JPG, PNG ou WebP.`);
    }
    
    // Check file size
    const sizeMB = getFileSizeMB(buffer);
    if (sizeMB > 5) {
      throw new Error(`Arquivo muito grande! Máximo: 5MB. Tamanho atual: ${sizeMB.toFixed(2)}MB`);
    }
    
    // Convert to WebP
    let webpBuffer = await imageToWebp(buffer);
    
    // Apply metadata
    webpBuffer = await applyWebpMetadata(webpBuffer);
    
    // Send sticker
    await sock.sendMessage(from, {
      sticker: webpBuffer
    });
    
  } catch (error) {
    throw error;
  }
}

/**
 * Create animated sticker from video/GIF
 * @param {Object} ctx - Command context
 * @param {Object} message - Message containing video
 * @param {boolean} hasQuoted - Whether this is a quoted message
 */
async function createAnimatedSticker(ctx, message, hasQuoted = false) {
  const { sock, from } = ctx;
  
  try {
    // Download video
    let buffer;
    
    if (hasQuoted) {
      buffer = await sock.downloadMediaMessage(message);
    } else {
      buffer = await sock.downloadMediaMessage(message);
    }
    
    // Validate file type
    const fileType = await validateMediaType(buffer);
    if (!isSupportedVideo(fileType?.mime)) {
      throw new Error(`Formato não suportado: ${fileType?.mime || 'desconhecido'}. Use MP4 ou GIF.`);
    }
    
    // Check file size before processing
    const sizeMB = getFileSizeMB(buffer);
    if (sizeMB > 5) {
      throw new Error(`Arquivo muito grande! Máximo: 5MB. Tamanho atual: ${sizeMB.toFixed(2)}MB`);
    }
    
    // Convert to animated WebP
    let webpBuffer = await videoToWebpAnimated(buffer);
    
    // Apply metadata
    webpBuffer = await applyWebpMetadata(webpBuffer);
    
    // Send sticker
    await sock.sendMessage(from, {
      sticker: webpBuffer
    });
    
  } catch (error) {
    throw error;
  }
}

/**
 * Helper function to send reply
 * @param {Object} ctx - Command context
 * @param {string} text - Reply text
 * @param {Object} options - Additional options
 */
async function sendReply(ctx, text, options = {}) {
  const { sock, from } = ctx;
  return await sock.sendMessage(from, { text, ...options });
}

/**
 * Convert sticker to image
 * @param {Object} ctx - Command context
 */
export async function handleToImg(ctx) {
  const { sock, from, m, quoted } = ctx;
  
  try {
    let targetMessage = m;
    
    if (quoted && quoted.stickerMessage) {
      targetMessage = { message: quoted };
    }
    
    if (!targetMessage.message?.stickerMessage) {
      return await sendReply(ctx,
        `🖼️ *Converter Figurinha para Imagem*\n\n` +
        `📌 Responda uma figurinha com ${ctx.prefix}toimg\n\n` +
        `🔥 _Respiração do Sol - Conversão de Mídia!_`
      );
    }
    
    await sendReply(ctx, '⏳ Convertendo figurinha para imagem...');
    
    // Download sticker
    const buffer = await sock.downloadMediaMessage(targetMessage);
    
    // Send as image (WebP is already an image format, WhatsApp will handle it)
    await sock.sendMessage(from, {
      image: buffer,
      caption: '✅ Figurinha convertida para imagem! 🗡️🔥'
    });
    
  } catch (error) {
    console.error('Erro ao converter sticker para imagem:', error);
    await sendReply(ctx, `❌ Erro ao converter figurinha: ${error.message}`);
  }
}

/**
 * Convert sticker to GIF
 * @param {Object} ctx - Command context
 */
export async function handleToGif(ctx) {
  const { sock, from, m, quoted } = ctx;
  
  try {
    let targetMessage = m;
    
    if (quoted && quoted.stickerMessage) {
      targetMessage = { message: quoted };
    }
    
    if (!targetMessage.message?.stickerMessage) {
      return await sendReply(ctx,
        `🎞️ *Converter Figurinha para GIF*\n\n` +
        `📌 Responda uma figurinha animada com ${ctx.prefix}togif\n\n` +
        `🔥 _Respiração do Sol - Conversão de Mídia!_`
      );
    }
    
    await sendReply(ctx, '⏳ Convertendo figurinha para GIF...');
    
    // Download sticker
    const buffer = await sock.downloadMediaMessage(targetMessage);
    
    // For now, send as video (GIF conversion requires additional ffmpeg processing)
    // This can be enhanced later with actual GIF conversion
    await sock.sendMessage(from, {
      video: buffer,
      gifPlayback: true,
      caption: '✅ Figurinha convertida! 🗡️🔥'
    });
    
  } catch (error) {
    console.error('Erro ao converter sticker para GIF:', error);
    await sendReply(ctx, `❌ Erro ao converter figurinha: ${error.message}`);
  }
}

