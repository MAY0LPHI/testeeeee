import { downloadMediaMessage } from 'whaileys';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { 
  imageToWebp, 
  videoToWebpAnimated, 
  applyWebpMetadata,
  checkFfmpegInstalled,
  validateFileSize 
} from '../utils/media.js';
import { logError, logInfo } from '../utils/colorLogger.js';

/**
 * Sticker command handler
 * Converts images and videos to WhatsApp stickers
 * Supports: direct image, replied image, video/GIF (≤10s, ≤5MB)
 */

/**
 * Main sticker handler
 * @param {Object} ctx - Command context
 */
export async function handleSticker(ctx) {
  const { sock, m, reply, from, quotedMsg } = ctx;

  try {
    // Check if there's media attached or quoted
    const messageType = Object.keys(m.message || {})[0];
    let mediaMessage = null;
    let isVideo = false;
    let isImage = false;

    // Check direct message media
    if (messageType === 'imageMessage') {
      mediaMessage = m.message.imageMessage;
      isImage = true;
    } else if (messageType === 'videoMessage') {
      mediaMessage = m.message.videoMessage;
      isVideo = true;
    }

    // Check quoted/replied media
    if (!mediaMessage && quotedMsg) {
      const quotedType = Object.keys(quotedMsg.message || {})[0];
      
      if (quotedType === 'imageMessage') {
        mediaMessage = quotedMsg.message.imageMessage;
        isImage = true;
      } else if (quotedType === 'videoMessage') {
        mediaMessage = quotedMsg.message.videoMessage;
        isVideo = true;
      }
    }

    // No media found
    if (!mediaMessage) {
      await reply('❌ *Erro!* Envie uma imagem ou vídeo, ou marque uma mensagem com mídia usando o comando.\n\n📝 *Uso:*\n• Envie imagem com legenda: `!sticker`\n• Marque uma imagem/vídeo e digite: `!sticker`');
      return;
    }

    // Notify user that processing has started
    await reply('⏳ Processando seu sticker... Aguarde! 🎨');

    // Create temp directory for processing
    const tempDir = path.join(os.tmpdir(), 'stickers');
    await fs.ensureDir(tempDir);

    const timestamp = Date.now();
    const inputFile = path.join(tempDir, `input_${timestamp}`);
    const outputFile = path.join(tempDir, `sticker_${timestamp}.webp`);

    try {
      // Download media
      logInfo('STICKER', 'Baixando mídia...');
      const buffer = await downloadMediaMessage(
        quotedMsg || m,
        'buffer',
        {},
        { 
          logger: console,
          reuploadRequest: sock.updateMediaMessage
        }
      );

      if (!buffer || buffer.length === 0) {
        throw new Error('Não foi possível baixar a mídia');
      }

      // Save buffer to temp file
      await fs.writeFile(inputFile, buffer);

      // Process based on media type
      if (isImage) {
        logInfo('STICKER', 'Convertendo imagem para sticker...');
        
        // Convert image to WebP
        await imageToWebp(inputFile, outputFile);
        
        // Apply metadata
        await applyWebpMetadata(outputFile, {
          pack: 'YURI BOT',
          author: 'MAY0LPHI'
        });

        // Send sticker
        await sock.sendMessage(from, {
          sticker: { url: outputFile }
        }, { quoted: m });

        logInfo('STICKER', 'Sticker de imagem criado com sucesso!');

      } else if (isVideo) {
        // Check if FFmpeg is installed
        const ffmpegInstalled = await checkFfmpegInstalled();
        if (!ffmpegInstalled) {
          await reply('❌ *FFmpeg não encontrado!*\n\nPara criar stickers animados, é necessário instalar o FFmpeg.\n\n📦 *Instalação:*\n• Ubuntu/Debian: `sudo apt install ffmpeg`\n• Windows: Baixe em https://ffmpeg.org\n• macOS: `brew install ffmpeg`');
          return;
        }

        logInfo('STICKER', 'Convertendo vídeo para sticker animado...');

        // Validate file size before processing
        const isValidSize = await validateFileSize(inputFile, 5);
        if (!isValidSize) {
          const stats = await fs.stat(inputFile);
          const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          await reply(`❌ *Arquivo muito grande!*\n\nTamanho máximo: *5MB*\nSeu arquivo: *${sizeMB}MB*\n\n💡 Envie um vídeo menor ou mais curto.`);
          return;
        }

        try {
          // Convert video to animated WebP
          await videoToWebpAnimated(inputFile, outputFile);
          
          // Apply metadata
          await applyWebpMetadata(outputFile, {
            pack: 'YURI BOT',
            author: 'MAY0LPHI'
          });

          // Send sticker
          await sock.sendMessage(from, {
            sticker: { url: outputFile }
          }, { quoted: m });

          logInfo('STICKER', 'Sticker animado criado com sucesso!');

        } catch (videoError) {
          // Handle specific video conversion errors
          if (videoError.message.includes('muito longo')) {
            await reply(`❌ ${videoError.message}\n\n💡 Envie um vídeo de até 10 segundos.`);
          } else if (videoError.message.includes('muito grande')) {
            await reply(`❌ ${videoError.message}\n\n💡 Envie um arquivo menor.`);
          } else {
            await reply(`❌ *Erro ao converter vídeo!*\n\n${videoError.message}\n\n💡 Certifique-se de que o vídeo está em um formato válido (MP4, GIF, etc.).`);
          }
          logError('STICKER', videoError);
          return;
        }
      }

      // Success message with tips
      await reply('✅ *Sticker criado com sucesso!* 🎨\n\n💡 *Dica:* Você pode usar stickers em conversas para se expressar melhor!');

    } finally {
      // Cleanup temp files
      try {
        if (await fs.pathExists(inputFile)) {
          await fs.remove(inputFile);
        }
        if (await fs.pathExists(outputFile)) {
          await fs.remove(outputFile);
        }
      } catch (cleanupError) {
        logError('STICKER-CLEANUP', cleanupError);
      }
    }

  } catch (error) {
    logError('STICKER', error);
    
    // Send friendly error message
    await reply(`❌ *Erro ao criar sticker!*\n\n${error.message}\n\n💡 *Tente:*\n• Enviar uma imagem ou vídeo válido\n• Vídeos: máximo 10 segundos e 5MB\n• Formatos suportados: JPG, PNG, MP4, GIF`);
  }
}

/**
 * Alias handlers for different sticker commands
 */
export async function handleFsticker(ctx) {
  return handleSticker(ctx);
}

export default {
  handleSticker,
  handleFsticker
};
