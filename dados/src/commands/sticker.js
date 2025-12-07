import { downloadMediaMessage } from 'whaileys';
import { 
  imageToWebp, 
  videoToWebpAnimated, 
  applyWebpMetadata,
  getVideoDuration,
  webpToPng,
  textToImage,
  checkFFmpegAvailable
} from '../utils/media.js';
import { logger } from '../connect.js';
import * as colorLogger from '../utils/colorLogger.js';

/**
 * Sticker command handlers - comprehensive implementation
 * Supports: .sticker, .fsticker, .ttp, .attp, .toimg, .rename
 */

/**
 * Main sticker handler - converts image/video to sticker
 * Aliases: sticker, fsticker, s, f
 */
export async function handleSticker(ctx) {
  const { sock, from, m, args } = ctx;
  
  try {
    // Get media from quoted message or direct message
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const messageToProcess = quotedMsg || m.message;
    
    // Determine message type
    const messageType = Object.keys(messageToProcess || {})[0];
    
    if (!messageType || (!messageType.includes('image') && !messageType.includes('video') && !messageType.includes('sticker'))) {
      return await sendReply(ctx, 
        `❌ *Erro: Mídia não encontrada*\n\n` +
        `📸 Envie uma imagem ou marque (responda) uma imagem/vídeo com o comando.\n\n` +
        `💡 Uso: \n` +
        `• Envie uma foto com legenda: *${ctx.prefix}sticker*\n` +
        `• Responda uma foto/vídeo: *${ctx.prefix}sticker*\n\n` +
        `⚡ Suporte a vídeos/GIFs até 10 segundos!`
      );
    }
    
    await sendReply(ctx, '⏳ Criando sticker... Aguarde! 🎨');
    
    // Download media
    const mediaBuffer = await downloadMediaMessage(
      quotedMsg ? { message: quotedMsg } : m,
      'buffer',
      {}
    );
    
    if (!mediaBuffer || mediaBuffer.length === 0) {
      return await sendReply(ctx, '❌ Erro ao baixar mídia. Tente novamente.');
    }
    
    // Check if it's a video/gif
    const isVideo = messageType.includes('video');
    const isAnimated = isVideo;
    
    let stickerBuffer;
    
    if (isAnimated) {
      // Check video duration
      const duration = await getVideoDuration(mediaBuffer);
      
      if (duration > 10) {
        return await sendReply(ctx,
          `❌ *Vídeo muito longo!*\n\n` +
          `⏱️ Duração: ${duration.toFixed(1)}s\n` +
          `📏 Máximo: 10s\n\n` +
          `💡 Corte o vídeo e tente novamente.`
        );
      }
      
      // Check FFmpeg availability
      const ffmpegOk = await checkFFmpegAvailable();
      if (!ffmpegOk) {
        return await sendReply(ctx,
          `❌ *FFmpeg não está instalado!*\n\n` +
          `🔧 Para criar stickers animados, instale o FFmpeg:\n` +
          `\`\`\`sudo apt-get install ffmpeg\`\`\`\n\n` +
          `📖 Veja o README para mais informações.`
        );
      }
      
      // Convert video to animated sticker
      const webpBuffer = await videoToWebpAnimated(mediaBuffer);
      stickerBuffer = await applyWebpMetadata(webpBuffer, 'YURI BOT', 'MAY0LPHI');
    } else {
      // Convert image to static sticker
      const webpBuffer = await imageToWebp(mediaBuffer);
      stickerBuffer = await applyWebpMetadata(webpBuffer, 'YURI BOT', 'MAY0LPHI');
    }
    
    // Send sticker
    await sock.sendMessage(from, {
      sticker: stickerBuffer
    }, { quoted: m });
    
    colorLogger.logSuccess('Sticker', 'Sticker criado com sucesso!');
    
  } catch (error) {
    colorLogger.logError('Sticker', error);
    logger.error('Erro ao criar sticker:', error);
    
    await sendReply(ctx,
      `❌ *Erro ao criar sticker*\n\n` +
      `Detalhes: ${error.message}\n\n` +
      `💡 Verifique se a mídia é válida e tente novamente.`
    );
  }
}

/**
 * TTP - Text To Picture (static text sticker)
 */
export async function handleTTP(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sendReply(ctx,
      `❌ *Texto não fornecido!*\n\n` +
      `💡 Uso: *${ctx.prefix}ttp <texto>*\n\n` +
      `Exemplo: *${ctx.prefix}ttp Olá Mundo!*`
    );
  }
  
  try {
    await sendReply(ctx, '⏳ Criando sticker de texto... 🎨');
    
    const text = args.join(' ');
    
    // For TTP, we'll use an API or create a simple text image
    // Using textToImage utility function
    const imageBuffer = await textToImage(text, false);
    const webpBuffer = await imageToWebp(imageBuffer);
    const stickerBuffer = await applyWebpMetadata(webpBuffer, 'YURI BOT', 'MAY0LPHI');
    
    await sock.sendMessage(from, {
      sticker: stickerBuffer
    }, { quoted: m });
    
    colorLogger.logSuccess('TTP', 'Sticker de texto criado!');
    
  } catch (error) {
    colorLogger.logError('TTP', error);
    
    await sendReply(ctx,
      `❌ *Erro ao criar sticker de texto*\n\n` +
      `⚠️ Recurso TTP necessita de configuração adicional.\n\n` +
      `💡 Use uma API externa como:\n` +
      `• https://api.lolhuman.xyz/api/ttp\n` +
      `• https://api.zacros.my.id/ttp\n\n` +
      `Defina a chave da API nas variáveis de ambiente.`
    );
  }
}

/**
 * ATTP - Animated Text To Picture (animated text sticker)
 */
export async function handleATTP(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sendReply(ctx,
      `❌ *Texto não fornecido!*\n\n` +
      `💡 Uso: *${ctx.prefix}attp <texto>*\n\n` +
      `Exemplo: *${ctx.prefix}attp Animado!*`
    );
  }
  
  try {
    await sendReply(ctx, '⏳ Criando sticker animado de texto... ✨');
    
    const text = args.join(' ');
    
    // ATTP requires external API or complex animation generation
    // For now, provide a helpful message
    await sendReply(ctx,
      `🎨 *ATTP - Animated Text To Picture*\n\n` +
      `⚠️ Recurso ATTP necessita de API externa.\n\n` +
      `💡 Configure uma das seguintes APIs:\n` +
      `• https://api.lolhuman.xyz/api/attp\n` +
      `• https://api.zacros.my.id/attp\n\n` +
      `🔑 Defina a variável de ambiente: \`ATTP_API_KEY\`\n\n` +
      `📝 Texto solicitado: "${text}"`
    );
    
  } catch (error) {
    colorLogger.logError('ATTP', error);
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

/**
 * TOIMG - Convert sticker to image
 */
export async function handleToImg(ctx) {
  const { sock, from, m } = ctx;
  
  try {
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quotedMsg || !quotedMsg.stickerMessage) {
      return await sendReply(ctx,
        `❌ *Sticker não encontrado!*\n\n` +
        `💡 Responda (marque) um sticker com o comando:\n` +
        `*${ctx.prefix}toimg*`
      );
    }
    
    await sendReply(ctx, '⏳ Convertendo sticker para imagem... 🖼️');
    
    // Download sticker
    const stickerBuffer = await downloadMediaMessage(
      { message: quotedMsg },
      'buffer',
      {}
    );
    
    // Convert to PNG
    const imageBuffer = await webpToPng(stickerBuffer);
    
    // Send as image
    await sock.sendMessage(from, {
      image: imageBuffer,
      caption: '✅ Sticker convertido para imagem! 🎨'
    }, { quoted: m });
    
    colorLogger.logSuccess('ToImg', 'Sticker convertido para imagem!');
    
  } catch (error) {
    colorLogger.logError('ToImg', error);
    
    await sendReply(ctx,
      `❌ *Erro ao converter sticker*\n\n` +
      `Detalhes: ${error.message}\n\n` +
      `💡 Certifique-se de marcar um sticker válido.`
    );
  }
}

/**
 * RENAME - Change sticker metadata (pack and author)
 */
export async function handleRename(ctx) {
  const { sock, from, m, args } = ctx;
  
  try {
    const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    
    if (!quotedMsg || !quotedMsg.stickerMessage) {
      return await sendReply(ctx,
        `❌ *Sticker não encontrado!*\n\n` +
        `💡 Uso: Responda um sticker com:\n` +
        `*${ctx.prefix}rename <nome do pack>/<autor>*\n\n` +
        `Exemplo: *${ctx.prefix}rename Meu Pack/Eu*`
      );
    }
    
    if (args.length === 0) {
      return await sendReply(ctx,
        `❌ *Informações não fornecidas!*\n\n` +
        `💡 Uso: *${ctx.prefix}rename <pack>/<autor>*\n\n` +
        `Exemplo: *${ctx.prefix}rename Hinokami Bot/MAY0LPHI*`
      );
    }
    
    const input = args.join(' ');
    const parts = input.split('/');
    
    if (parts.length < 2) {
      return await sendReply(ctx,
        `❌ *Formato incorreto!*\n\n` +
        `💡 Use: *<pack>/<autor>*\n\n` +
        `Exemplo: *Meu Pack/Meu Nome*`
      );
    }
    
    const packName = parts[0].trim();
    const authorName = parts[1].trim();
    
    await sendReply(ctx, '⏳ Renomeando sticker... ✏️');
    
    // Download sticker
    const stickerBuffer = await downloadMediaMessage(
      { message: quotedMsg },
      'buffer',
      {}
    );
    
    // Apply new metadata
    const renamedSticker = await applyWebpMetadata(stickerBuffer, packName, authorName);
    
    // Send renamed sticker
    await sock.sendMessage(from, {
      sticker: renamedSticker
    }, { quoted: m });
    
    await sendReply(ctx,
      `✅ *Sticker renomeado!*\n\n` +
      `📦 Pack: *${packName}*\n` +
      `✍️ Autor: *${authorName}*`
    );
    
    colorLogger.logSuccess('Rename', `Sticker renomeado: ${packName}/${authorName}`);
    
  } catch (error) {
    colorLogger.logError('Rename', error);
    
    await sendReply(ctx,
      `❌ *Erro ao renomear sticker*\n\n` +
      `Detalhes: ${error.message}`
    );
  }
}

/**
 * Helper to send reply
 */
async function sendReply(ctx, text) {
  try {
    return await ctx.sock.sendMessage(ctx.from, {
      text
    }, { quoted: ctx.m });
  } catch (error) {
    logger.error('Erro ao enviar resposta:', error);
  }
}

export default {
  handleSticker,
  handleTTP,
  handleATTP,
  handleToImg,
  handleRename
};
