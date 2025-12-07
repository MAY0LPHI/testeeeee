import { randomUUID } from 'crypto';
import { downloadMediaMessage } from 'whaileys';
import ffmpeg from 'fluent-ffmpeg';
import Jimp from 'jimp';
import { writeFile, unlink, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Sticker, StickerTypes } from 'node-webpmux';
import { logError, logSuccess, logInfo } from '../../utils/colorLogger.js';
import config from '../../config.json' with { type: 'json' };

/**
 * Handler de criação de stickers/figurinhas
 * Suporta imagens, vídeos e GIFs
 */

// Configurações padrão
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_DURATION = 10; // segundos
const STICKER_SIZE = 512; // pixels
const FFMPEG_TIMEOUT = 30000; // 30 segundos

/**
 * Gera nome de arquivo temporário único
 */
function getTempFileName(ext) {
  const uniqueId = randomUUID();
  return join(tmpdir(), `sticker_${uniqueId}.${ext}`);
}

/**
 * Remove arquivo temporário com segurança
 */
async function removeTempFile(filePath) {
  try {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    logError('StickerHandler', `Erro ao remover arquivo temporário: ${error.message}`);
  }
}

/**
 * Redimensiona imagem para o tamanho de sticker
 */
async function resizeImage(inputBuffer) {
  try {
    const image = await Jimp.read(inputBuffer);
    const size = Math.min(image.getWidth(), image.getHeight());
    
    // Corta a imagem para quadrado
    if (image.getWidth() > image.getHeight()) {
      const x = (image.getWidth() - size) / 2;
      image.crop(x, 0, size, size);
    } else {
      const y = (image.getHeight() - size) / 2;
      image.crop(0, y, size, size);
    }
    
    // Redimensiona para tamanho padrão de sticker
    image.resize(STICKER_SIZE, STICKER_SIZE);
    
    return await image.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
    throw new Error(`Erro ao processar imagem: ${error.message}`);
  }
}

/**
 * Converte vídeo para WebP animado usando ffmpeg
 */
async function convertVideoToWebP(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout: processamento de vídeo excedeu 30 segundos'));
    }, FFMPEG_TIMEOUT);
    
    ffmpeg(inputPath)
      .outputOptions([
        '-vcodec', 'libwebp',
        '-vf', `scale=${STICKER_SIZE}:${STICKER_SIZE}:force_original_aspect_ratio=increase,crop=${STICKER_SIZE}:${STICKER_SIZE},setsar=1`,
        '-loop', '0',
        '-preset', 'default',
        '-an',
        '-vsync', '0',
        '-s', `${STICKER_SIZE}:${STICKER_SIZE}`
      ])
      .toFormat('webp')
      .on('end', () => {
        clearTimeout(timeoutId);
        resolve(outputPath);
      })
      .on('error', (err) => {
        clearTimeout(timeoutId);
        reject(new Error(`Erro no ffmpeg: ${err.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Converte imagem para WebP
 */
async function convertImageToWebP(inputBuffer, outputPath) {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout: processamento de imagem excedeu 30 segundos'));
    }, FFMPEG_TIMEOUT);
    
    try {
      const resizedBuffer = await resizeImage(inputBuffer);
      const tempPngPath = getTempFileName('png');
      
      await writeFile(tempPngPath, resizedBuffer);
      
      ffmpeg(tempPngPath)
        .outputOptions([
          '-vcodec', 'libwebp',
          '-vf', `scale=${STICKER_SIZE}:${STICKER_SIZE}:force_original_aspect_ratio=increase,crop=${STICKER_SIZE}:${STICKER_SIZE}`,
          '-preset', 'default',
          '-loop', '0'
        ])
        .toFormat('webp')
        .on('end', async () => {
          clearTimeout(timeoutId);
          await removeTempFile(tempPngPath);
          resolve(outputPath);
        })
        .on('error', async (err) => {
          clearTimeout(timeoutId);
          await removeTempFile(tempPngPath);
          reject(new Error(`Erro ao converter imagem: ${err.message}`));
        })
        .save(outputPath);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(new Error(`Erro ao processar imagem: ${error.message}`));
    }
  });
}

/**
 * Adiciona metadata ao sticker (nome do pacote e autor)
 */
async function addStickerMetadata(stickerPath, packName, authorName) {
  try {
    const sticker = new Sticker(await readFile(stickerPath), { type: StickerTypes.DEFAULT });
    
    // Define metadata
    const exif = {
      'sticker-pack-id': 'hinokami-bot',
      'sticker-pack-name': packName || config.botName || 'Hinokami Bot',
      'sticker-pack-publisher': authorName || 'Hinokami Bot',
    };
    
    sticker.setMetadata(exif);
    await writeFile(stickerPath, await sticker.toBuffer());
    
    return stickerPath;
  } catch (error) {
    // Se falhar ao adicionar metadata, retorna o sticker sem metadata
    logError('StickerHandler', `Erro ao adicionar metadata (continuando): ${error.message}`);
    return stickerPath;
  }
}

/**
 * Cria sticker a partir de imagem
 */
export async function createImageSticker(sock, m, quoted = false) {
  let tempFiles = [];
  
  try {
    // Determina a mensagem a ser processada
    const targetMessage = quoted && m.message?.extendedTextMessage?.contextInfo?.quotedMessage 
      ? { message: m.message.extendedTextMessage.contextInfo.quotedMessage, key: m.message.extendedTextMessage.contextInfo }
      : m;
    
    // Verifica se é uma imagem
    const imageMessage = targetMessage.message?.imageMessage 
      || targetMessage.message?.viewOnceMessageV2?.message?.imageMessage
      || targetMessage.message?.viewOnceMessage?.message?.imageMessage;
    
    if (!imageMessage) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Envie ou marque uma imagem com o comando para criar uma figurinha.'
      }, { quoted: m });
      return;
    }
    
    logInfo('StickerHandler', 'Processando imagem para sticker...');
    
    // Download da imagem
    const buffer = await downloadMediaMessage(
      { message: { imageMessage } },
      'buffer',
      {}
    );
    
    // Verifica tamanho
    if (buffer.length > MAX_IMAGE_SIZE) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `❌ Imagem muito grande! Tamanho máximo: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
      }, { quoted: m });
      return;
    }
    
    // Cria sticker
    const outputPath = getTempFileName('webp');
    tempFiles.push(outputPath);
    
    await convertImageToWebP(buffer, outputPath);
    
    // Adiciona metadata
    await addStickerMetadata(outputPath, config.stickerPack, config.stickerAuthor);
    
    // Envia sticker
    const stickerBuffer = await readFile(outputPath);
    await sock.sendMessage(m.key.remoteJid, {
      sticker: stickerBuffer
    }, { quoted: m });
    
    logSuccess('StickerHandler', 'Sticker de imagem criado com sucesso');
    
  } catch (error) {
    logError('StickerHandler', `Erro ao criar sticker de imagem: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao criar figurinha: ${error.message}\n\nCertifique-se de que o ffmpeg está instalado.`
    }, { quoted: m });
  } finally {
    // Limpa arquivos temporários
    for (const file of tempFiles) {
      await removeTempFile(file);
    }
  }
}

/**
 * Cria sticker animado a partir de vídeo ou GIF
 */
export async function createVideoSticker(sock, m, quoted = false) {
  let tempFiles = [];
  
  try {
    // Determina a mensagem a ser processada
    const targetMessage = quoted && m.message?.extendedTextMessage?.contextInfo?.quotedMessage 
      ? { message: m.message.extendedTextMessage.contextInfo.quotedMessage, key: m.message.extendedTextMessage.contextInfo }
      : m;
    
    // Verifica se é um vídeo
    const videoMessage = targetMessage.message?.videoMessage
      || targetMessage.message?.viewOnceMessageV2?.message?.videoMessage
      || targetMessage.message?.viewOnceMessage?.message?.videoMessage;
    
    if (!videoMessage) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Envie ou marque um vídeo/GIF com o comando para criar uma figurinha animada.'
      }, { quoted: m });
      return;
    }
    
    // Verifica duração
    const duration = videoMessage.seconds || 0;
    if (duration > MAX_VIDEO_DURATION) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `❌ Vídeo muito longo! Duração máxima: ${MAX_VIDEO_DURATION}s (seu vídeo: ${duration}s)`
      }, { quoted: m });
      return;
    }
    
    logInfo('StickerHandler', `Processando vídeo (${duration}s) para sticker animado...`);
    
    // Download do vídeo
    const buffer = await downloadMediaMessage(
      { message: { videoMessage } },
      'buffer',
      {}
    );
    
    // Verifica tamanho
    if (buffer.length > MAX_VIDEO_SIZE) {
      await sock.sendMessage(m.key.remoteJid, {
        text: `❌ Vídeo muito grande! Tamanho máximo: ${MAX_VIDEO_SIZE / 1024 / 1024}MB`
      }, { quoted: m });
      return;
    }
    
    // Salva vídeo temporário
    const inputPath = getTempFileName('mp4');
    const outputPath = getTempFileName('webp');
    tempFiles.push(inputPath, outputPath);
    
    await writeFile(inputPath, buffer);
    
    // Converte para WebP animado
    await convertVideoToWebP(inputPath, outputPath);
    
    // Adiciona metadata
    await addStickerMetadata(outputPath, config.stickerPack, config.stickerAuthor);
    
    // Envia sticker
    const stickerBuffer = await readFile(outputPath);
    await sock.sendMessage(m.key.remoteJid, {
      sticker: stickerBuffer
    }, { quoted: m });
    
    logSuccess('StickerHandler', 'Sticker animado criado com sucesso');
    
  } catch (error) {
    logError('StickerHandler', `Erro ao criar sticker animado: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao criar figurinha animada: ${error.message}\n\nCertifique-se de que o ffmpeg está instalado.`
    }, { quoted: m });
  } finally {
    // Limpa arquivos temporários
    for (const file of tempFiles) {
      await removeTempFile(file);
    }
  }
}

/**
 * Handler principal de sticker - detecta tipo automaticamente
 */
export async function handleSticker(ctx) {
  const { sock, m } = ctx;
  
  try {
    // Verifica se é quoted message (reply)
    const isQuoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    const quotedMsg = isQuoted ? m.message.extendedTextMessage.contextInfo.quotedMessage : null;
    
    // Detecta tipo de mídia
    const hasImage = m.message?.imageMessage 
      || (quotedMsg?.imageMessage)
      || (quotedMsg?.viewOnceMessageV2?.message?.imageMessage)
      || (quotedMsg?.viewOnceMessage?.message?.imageMessage);
      
    const hasVideo = m.message?.videoMessage
      || (quotedMsg?.videoMessage)
      || (quotedMsg?.viewOnceMessageV2?.message?.videoMessage)
      || (quotedMsg?.viewOnceMessage?.message?.videoMessage);
    
    if (hasImage) {
      await createImageSticker(sock, m, isQuoted);
    } else if (hasVideo) {
      await createVideoSticker(sock, m, isQuoted);
    } else {
      await sock.sendMessage(m.key.remoteJid, {
        text: `🗡️ *Criador de Figurinhas - Hinokami Bot* 🔥

📝 *Como usar:*

*Para imagens:*
• Envie uma imagem com legenda: \`${config.prefix || '!'}sticker\`
• Ou marque uma imagem e envie: \`${config.prefix || '!'}sticker\`

*Para vídeos/GIFs:*
• Envie um vídeo (max ${MAX_VIDEO_DURATION}s) com legenda: \`${config.prefix || '!'}sticker\`
• Ou marque um vídeo e envie: \`${config.prefix || '!'}sticker\`

*Aliases disponíveis:*
\`!sticker\`, \`!s\`, \`!fsticker\`, \`!figurinha\`

⚠️ *Limites:*
• Imagens: max ${MAX_IMAGE_SIZE / 1024 / 1024}MB
• Vídeos: max ${MAX_VIDEO_SIZE / 1024 / 1024}MB e ${MAX_VIDEO_DURATION}s de duração`
      }, { quoted: m });
    }
    
  } catch (error) {
    logError('StickerHandler', `Erro geral: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao processar: ${error.message}`
    }, { quoted: m });
  }
}

/**
 * Converte sticker para imagem
 */
export async function handleToImg(ctx) {
  const { sock, m } = ctx;
  let tempFiles = [];
  
  try {
    // Verifica se é um sticker
    const stickerMessage = m.message?.stickerMessage
      || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    
    if (!stickerMessage) {
      await sock.sendMessage(m.key.remoteJid, {
        text: '❌ Marque um sticker para converter em imagem.'
      }, { quoted: m });
      return;
    }
    
    logInfo('StickerHandler', 'Convertendo sticker para imagem...');
    
    // Download do sticker
    const isQuoted = !!m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;
    const buffer = await downloadMediaMessage(
      isQuoted 
        ? { message: { stickerMessage: m.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage } }
        : m,
      'buffer',
      {}
    );
    
    // Converte WebP para PNG usando Jimp
    const image = await Jimp.read(buffer);
    const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
    // Envia como imagem
    await sock.sendMessage(m.key.remoteJid, {
      image: pngBuffer,
      caption: '🖼️ Sticker convertido para imagem'
    }, { quoted: m });
    
    logSuccess('StickerHandler', 'Sticker convertido para imagem com sucesso');
    
  } catch (error) {
    logError('StickerHandler', `Erro ao converter sticker: ${error.message}`);
    await sock.sendMessage(m.key.remoteJid, {
      text: `❌ Erro ao converter: ${error.message}`
    }, { quoted: m });
  } finally {
    for (const file of tempFiles) {
      await removeTempFile(file);
    }
  }
}

export default {
  handleSticker,
  handleToImg,
  createImageSticker,
  createVideoSticker
};
