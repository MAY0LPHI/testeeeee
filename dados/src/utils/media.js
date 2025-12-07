import Jimp from 'jimp';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import { promisify } from 'util';
import { exec } from 'child_process';
import { Image } from 'node-webpmux';

const execPromise = promisify(exec);

/**
 * Media utilities for sticker creation
 * Handles image and video conversion to WebP format
 */

/**
 * Convert image to WebP format (512x512) maintaining aspect ratio
 * @param {string} inputPath - Path to input image
 * @param {string} outputPath - Path to output WebP file
 * @returns {Promise<string>} - Path to output file
 */
export async function imageToWebp(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    
    // Get original dimensions
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
    image.resize(newWidth, newHeight);
    
    // Create a 512x512 canvas with transparent background
    const canvas = new Jimp(maxSize, maxSize, 0x00000000);
    
    // Calculate position to center the image
    const x = Math.round((maxSize - newWidth) / 2);
    const y = Math.round((maxSize - newHeight) / 2);
    
    // Composite the resized image onto the canvas
    canvas.composite(image, x, y);
    
    // Write as WebP
    await canvas.quality(90).writeAsync(outputPath);
    
    return outputPath;
  } catch (error) {
    throw new Error(`Erro ao converter imagem para WebP: ${error.message}`);
  }
}

/**
 * Convert video/GIF to animated WebP sticker
 * Limits: ≤10 seconds duration, ≤5MB file size
 * @param {string} inputPath - Path to input video/GIF
 * @param {string} outputPath - Path to output WebP file
 * @returns {Promise<string>} - Path to output file
 */
export async function videoToWebpAnimated(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // First check if ffmpeg is available
    ffmpeg.getAvailableFormats((err) => {
      if (err) {
        return reject(new Error('FFmpeg não está instalado ou não foi encontrado no PATH. Instale o FFmpeg para criar stickers animados.'));
      }

      // Get video metadata
      ffmpeg.ffprobe(inputPath, (probeErr, metadata) => {
        if (probeErr) {
          return reject(new Error(`Erro ao analisar vídeo: ${probeErr.message}`));
        }

        const duration = metadata.format.duration;
        const fileSize = metadata.format.size;

        // Validate duration (max 10 seconds)
        if (duration > 10) {
          return reject(new Error(`Vídeo muito longo! Duração máxima: 10 segundos. Seu vídeo tem ${duration.toFixed(1)} segundos.`));
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (fileSize > maxSize) {
          return reject(new Error(`Arquivo muito grande! Tamanho máximo: 5MB. Seu arquivo tem ${(fileSize / (1024 * 1024)).toFixed(2)}MB.`));
        }

        // Convert to animated WebP
        ffmpeg(inputPath)
          .outputOptions([
            '-vcodec libwebp',
            '-vf scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000',
            '-loop 0',
            '-preset default',
            '-an',
            '-vsync 0',
            '-s 512:512'
          ])
          .toFormat('webp')
          .on('error', (convertErr) => {
            reject(new Error(`Erro ao converter vídeo para WebP animado: ${convertErr.message}`));
          })
          .on('end', () => {
            resolve(outputPath);
          })
          .save(outputPath);
      });
    });
  });
}

/**
 * Apply metadata to WebP sticker
 * @param {string} webpPath - Path to WebP file
 * @param {Object} metadata - Metadata object
 * @param {string} metadata.pack - Sticker pack name (default: "YURI BOT")
 * @param {string} metadata.author - Sticker author (default: "MAY0LPHI")
 * @returns {Promise<void>}
 */
export async function applyWebpMetadata(webpPath, metadata = {}) {
  try {
    const pack = metadata.pack || 'YURI BOT';
    const author = metadata.author || 'MAY0LPHI';

    // Read the WebP file
    const img = new Image();
    await img.load(webpPath);

    // Create EXIF metadata
    const exif = {
      'sticker-pack-id': 'com.snowcorp.stickerly.android.stickercontentprovider',
      'sticker-pack-name': pack,
      'sticker-pack-publisher': author,
      'android-app-store-link': 'https://play.google.com/store/apps/details?id=com.marsvard.stickermakerforwhatsapp',
      'ios-app-store-link': 'https://itunes.apple.com/app/sticker-maker-studio/id1443326857'
    };

    // Convert metadata to JSON string
    const exifStr = JSON.stringify(exif);
    
    // Set EXIF data
    img.exif = exifStr;

    // Save the image with metadata
    await img.save(webpPath);
  } catch (error) {
    // Metadata application is not critical, log but don't throw
    console.warn(`Aviso: Não foi possível adicionar metadata ao sticker: ${error.message}`);
  }
}

/**
 * Check if FFmpeg is installed
 * @returns {Promise<boolean>}
 */
export async function checkFfmpegInstalled() {
  try {
    await execPromise('ffmpeg -version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate file size
 * @param {string} filePath - Path to file
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {Promise<boolean>}
 */
export async function validateFileSize(filePath, maxSizeMB = 5) {
  try {
    const stats = await fs.stat(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    return fileSizeMB <= maxSizeMB;
  } catch (error) {
    throw new Error(`Erro ao verificar tamanho do arquivo: ${error.message}`);
  }
}

export default {
  imageToWebp,
  videoToWebpAnimated,
  applyWebpMetadata,
  checkFfmpegInstalled,
  validateFileSize
};
