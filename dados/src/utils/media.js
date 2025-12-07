import Jimp from 'jimp';
import ffmpeg from 'fluent-ffmpeg';
import { writeFile, unlink, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { Sticker } from 'node-webpmux';

/**
 * Media utilities for sticker creation and manipulation
 * Handles image/video conversion to WebP format with metadata
 */

/**
 * Generate temporary file path
 */
function getTempPath(extension = 'tmp') {
  const randomName = randomBytes(16).toString('hex');
  return join(tmpdir(), `hinokami_${randomName}.${extension}`);
}

/**
 * Check if ffmpeg is available
 */
export function checkFFmpegAvailable() {
  return new Promise((resolve) => {
    ffmpeg.getAvailableFormats((err) => {
      resolve(!err);
    });
  });
}

/**
 * Convert image buffer to WebP sticker (static)
 * Resizes to 512x512 maintaining aspect ratio, centered with transparent background
 * 
 * @param {Buffer} imageBuffer - Input image buffer
 * @returns {Promise<Buffer>} - WebP sticker buffer
 */
export async function imageToWebp(imageBuffer) {
  try {
    const image = await Jimp.read(imageBuffer);
    
    // Get dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    
    // Calculate scaling to fit within 512x512 while maintaining aspect ratio
    const maxSize = 512;
    let newWidth, newHeight;
    
    if (width > height) {
      newWidth = maxSize;
      newHeight = Math.round((height / width) * maxSize);
    } else {
      newHeight = maxSize;
      newWidth = Math.round((width / height) * maxSize);
    }
    
    // Resize image
    image.resize(newWidth, newHeight, Jimp.RESIZE_BILINEAR);
    
    // Create a 512x512 transparent canvas
    const canvas = new Jimp(maxSize, maxSize, 0x00000000);
    
    // Center the resized image on the canvas
    const offsetX = Math.round((maxSize - newWidth) / 2);
    const offsetY = Math.round((maxSize - newHeight) / 2);
    canvas.composite(image, offsetX, offsetY);
    
    // Convert to WebP
    const webpBuffer = await canvas.getBufferAsync('image/png');
    
    return webpBuffer;
  } catch (error) {
    throw new Error(`Erro ao converter imagem para WebP: ${error.message}`);
  }
}

/**
 * Convert video/GIF buffer to animated WebP sticker
 * Limits: max 10 seconds duration, max 5MB size
 * 
 * @param {Buffer} videoBuffer - Input video/GIF buffer
 * @param {number} maxDuration - Maximum duration in seconds (default: 10)
 * @returns {Promise<Buffer>} - Animated WebP sticker buffer
 */
export async function videoToWebpAnimated(videoBuffer, maxDuration = 10) {
  const inputPath = getTempPath('mp4');
  const outputPath = getTempPath('webp');
  
  try {
    // Check if ffmpeg is available
    const ffmpegAvailable = await checkFFmpegAvailable();
    if (!ffmpegAvailable) {
      throw new Error('FFmpeg não está instalado. Instale com: sudo apt-get install ffmpeg');
    }
    
    // Write video buffer to temporary file
    await writeFile(inputPath, videoBuffer);
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (videoBuffer.length > maxSize) {
      throw new Error('Vídeo muito grande! Tamanho máximo: 5MB');
    }
    
    // Convert video to animated WebP
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-vcodec libwebp',
          '-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=0x00000000',
          '-loop 0',
          '-preset default',
          '-an',
          '-vsync 0',
          `-t ${maxDuration}` // Limit duration
        ])
        .toFormat('webp')
        .on('error', (err) => {
          reject(new Error(`Erro ao converter vídeo: ${err.message}`));
        })
        .on('end', () => {
          resolve();
        })
        .save(outputPath);
    });
    
    // Read the output file
    const webpBuffer = await readFile(outputPath);
    
    // Cleanup temporary files
    await Promise.all([
      unlink(inputPath).catch(() => {}),
      unlink(outputPath).catch(() => {})
    ]);
    
    return webpBuffer;
  } catch (error) {
    // Cleanup on error
    await Promise.all([
      unlink(inputPath).catch(() => {}),
      unlink(outputPath).catch(() => {})
    ]);
    
    throw error;
  }
}

/**
 * Apply metadata to WebP sticker
 * Sets pack name and author using node-webpmux
 * 
 * @param {Buffer} webpBuffer - WebP sticker buffer
 * @param {string} packName - Pack name (default: "YURI BOT")
 * @param {string} authorName - Author name (default: "MAY0LPHI")
 * @returns {Promise<Buffer>} - WebP with metadata
 */
export async function applyWebpMetadata(webpBuffer, packName = 'YURI BOT', authorName = 'MAY0LPHI') {
  try {
    const sticker = new Sticker(webpBuffer, { pack: packName, author: authorName });
    return await sticker.build();
  } catch (error) {
    // If metadata fails, return original buffer
    console.warn('Aviso: Não foi possível adicionar metadata ao sticker:', error.message);
    return webpBuffer;
  }
}

/**
 * Get video duration in seconds
 * 
 * @param {Buffer} videoBuffer - Video buffer
 * @returns {Promise<number>} - Duration in seconds
 */
export async function getVideoDuration(videoBuffer) {
  const inputPath = getTempPath('mp4');
  
  try {
    await writeFile(inputPath, videoBuffer);
    
    const duration = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration || 0);
        }
      });
    });
    
    await unlink(inputPath).catch(() => {});
    
    return duration;
  } catch (error) {
    await unlink(inputPath).catch(() => {});
    throw new Error(`Erro ao obter duração do vídeo: ${error.message}`);
  }
}

/**
 * Convert sticker (WebP) back to PNG image
 * 
 * @param {Buffer} stickerBuffer - WebP sticker buffer
 * @returns {Promise<Buffer>} - PNG image buffer
 */
export async function webpToPng(stickerBuffer) {
  try {
    const image = await Jimp.read(stickerBuffer);
    return await image.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
    throw new Error(`Erro ao converter sticker para imagem: ${error.message}`);
  }
}

/**
 * Validate if buffer is a valid image
 * 
 * @param {Buffer} buffer - Image buffer
 * @returns {Promise<boolean>} - True if valid image
 */
export async function isValidImage(buffer) {
  try {
    await Jimp.read(buffer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create text-to-image for TTP (Text To Picture) stickers
 * Simple implementation that creates an image with text
 * 
 * @param {string} text - Text to convert
 * @param {boolean} animated - Whether to create animated version (ATTP)
 * @returns {Promise<Buffer>} - Image/WebP buffer
 */
export async function textToImage(text, animated = false) {
  try {
    // Create a simple image with text
    const width = 512;
    const height = 512;
    const image = new Jimp(width, height, 0xFFFFFFFF);
    
    // Load font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
    
    // Print text centered
    image.print(
      font,
      0,
      0,
      {
        text: text.substring(0, 100), // Limit text length
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
      },
      width,
      height
    );
    
    // For animated, we'd need to create multiple frames
    // For now, return static version
    // TODO: Implement actual animated text sticker
    
    return await image.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
    throw new Error(`Erro ao criar sticker de texto: ${error.message}`);
  }
}

export default {
  imageToWebp,
  videoToWebpAnimated,
  applyWebpMetadata,
  getVideoDuration,
  webpToPng,
  isValidImage,
  textToImage,
  checkFFmpegAvailable,
  getTempPath
};
