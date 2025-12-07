/**
 * Media Utilities for Hinokami Bot
 * Handles media conversion for stickers (static and animated)
 */

import Jimp from 'jimp';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { fileTypeFromBuffer } from 'file-type';
import webp from 'node-webpmux';

const execAsync = promisify(exec);

// Constants
const STICKER_SIZE = 512;
const MAX_VIDEO_DURATION = 10; // seconds
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const STICKER_METADATA = {
  pack: 'YURI BOT',
  author: 'MAY0LPHI'
};

/**
 * Convert static image to WebP format (512x512)
 * @param {Buffer} inputBuffer - Input image buffer
 * @returns {Promise<Buffer>} WebP image buffer
 */
export async function imageToWebp(inputBuffer) {
  try {
    // Read image with Jimp
    const image = await Jimp.read(inputBuffer);
    
    // Get dimensions
    const width = image.getWidth();
    const height = image.getHeight();
    
    // Calculate resize dimensions maintaining aspect ratio
    let newWidth, newHeight;
    if (width > height) {
      newWidth = STICKER_SIZE;
      newHeight = Math.round((height / width) * STICKER_SIZE);
    } else {
      newHeight = STICKER_SIZE;
      newWidth = Math.round((width / height) * STICKER_SIZE);
    }
    
    // Resize image
    image.resize(newWidth, newHeight, Jimp.RESIZE_BILINEAR);
    
    // Create canvas with transparent background
    const canvas = new Jimp(STICKER_SIZE, STICKER_SIZE, 0x00000000);
    
    // Center the image
    const x = Math.round((STICKER_SIZE - newWidth) / 2);
    const y = Math.round((STICKER_SIZE - newHeight) / 2);
    canvas.composite(image, x, y);
    
    // Convert to PNG first (Jimp doesn't directly support WebP)
    // Then use ffmpeg for high-quality WebP conversion
    const pngBuffer = await canvas.getBufferAsync('image/png');
    
    // Use temporary files for ffmpeg conversion
    const tempDir = os.tmpdir();
    const tempInput = path.join(tempDir, `input_${Date.now()}.png`);
    const tempOutput = path.join(tempDir, `output_${Date.now()}.webp`);
    
    try {
      await fs.writeFile(tempInput, pngBuffer);
      
      // Convert to WebP using ffmpeg for better quality
      await execAsync(`ffmpeg -i "${tempInput}" -vcodec libwebp -q:v 80 -preset default -loop 0 -an -vsync 0 "${tempOutput}"`);
      
      const outputBuffer = await fs.readFile(tempOutput);
      
      // Cleanup
      await fs.unlink(tempInput);
      await fs.unlink(tempOutput);
      
      return outputBuffer;
    } catch (error) {
      // Cleanup on error
      await fs.unlink(tempInput).catch(() => {});
      await fs.unlink(tempOutput).catch(() => {});
      throw error;
    }
  } catch (error) {
    throw new Error(`Erro ao converter imagem para WebP: ${error.message}`);
  }
}

/**
 * Convert video/GIF to animated WebP sticker
 * @param {Buffer} inputBuffer - Input video/GIF buffer
 * @returns {Promise<Buffer>} Animated WebP buffer
 */
export async function videoToWebpAnimated(inputBuffer) {
  const tempDir = os.tmpdir();
  const tempInput = path.join(tempDir, `video_input_${Date.now()}.mp4`);
  const tempOutput = path.join(tempDir, `video_output_${Date.now()}.webp`);
  
  try {
    // Write input buffer to temp file
    await fs.writeFile(tempInput, inputBuffer);
    
    // Check video duration
    const { stdout: durationStr } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempInput}"`
    );
    const duration = parseFloat(durationStr.trim());
    
    if (duration > MAX_VIDEO_DURATION) {
      throw new Error(`Vídeo muito longo! Máximo permitido: ${MAX_VIDEO_DURATION} segundos. Duração atual: ${duration.toFixed(1)}s`);
    }
    
    // Check file size
    const stats = await fs.stat(tempInput);
    if (stats.size > MAX_FILE_SIZE) {
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      const maxMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
      throw new Error(`Arquivo muito grande! Máximo permitido: ${maxMB}MB. Tamanho atual: ${sizeMB}MB`);
    }
    
    // Convert to animated WebP sticker
    // -vf scale: resize to 512x512 maintaining aspect ratio
    // -vcodec libwebp: use WebP codec
    // -lossless 0: lossy compression for smaller file size
    // -q:v 90: quality (0-100, higher is better)
    // -preset default: encoding preset
    // -loop 0: infinite loop
    // -an: no audio
    // -vsync 0: passthrough timestamp
    // -t: limit duration to MAX_VIDEO_DURATION
    await execAsync(
      `ffmpeg -i "${tempInput}" -vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000" ` +
      `-vcodec libwebp -lossless 0 -q:v 90 -preset default -loop 0 -an -vsync 0 -t ${MAX_VIDEO_DURATION} "${tempOutput}"`
    );
    
    // Read output
    const outputBuffer = await fs.readFile(tempOutput);
    
    // Cleanup
    await fs.unlink(tempInput);
    await fs.unlink(tempOutput);
    
    return outputBuffer;
  } catch (error) {
    // Cleanup on error
    await fs.unlink(tempInput).catch(() => {});
    await fs.unlink(tempOutput).catch(() => {});
    
    if (error.message.includes('Vídeo muito longo') || error.message.includes('Arquivo muito grande')) {
      throw error;
    }
    throw new Error(`Erro ao converter vídeo para WebP animado: ${error.message}`);
  }
}

/**
 * Apply metadata to WebP sticker
 * @param {Buffer} webpBuffer - WebP sticker buffer
 * @param {Object} metadata - Metadata object (pack, author)
 * @returns {Promise<Buffer>} WebP buffer with metadata
 */
export async function applyWebpMetadata(webpBuffer, metadata = STICKER_METADATA) {
  try {
    // Create WebP image
    const img = new webp.Image();
    await img.load(webpBuffer);
    
    // Set EXIF metadata
    const exif = {
      'sticker-pack-id': 'com.yuri.bot.sticker',
      'sticker-pack-name': metadata.pack || STICKER_METADATA.pack,
      'sticker-pack-publisher': metadata.author || STICKER_METADATA.author,
    };
    
    // Convert EXIF to JSON string
    const exifStr = JSON.stringify(exif);
    img.exif = Buffer.from(exifStr, 'utf-8');
    
    // Save image with metadata
    const outputBuffer = await img.save(null);
    
    return outputBuffer;
  } catch (error) {
    // If metadata application fails, return original buffer
    // This is not critical, sticker will still work
    console.warn('Aviso: Não foi possível aplicar metadata ao sticker:', error.message);
    return webpBuffer;
  }
}

/**
 * Validate media buffer type
 * @param {Buffer} buffer - Media buffer
 * @returns {Promise<Object>} File type info
 */
export async function validateMediaType(buffer) {
  try {
    const type = await fileTypeFromBuffer(buffer);
    return type;
  } catch (error) {
    throw new Error('Não foi possível identificar o tipo de arquivo');
  }
}

/**
 * Check if media type is supported for static stickers
 * @param {string} mimeType - MIME type
 * @returns {boolean}
 */
export function isSupportedImage(mimeType) {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  return supportedTypes.includes(mimeType);
}

/**
 * Check if media type is supported for animated stickers
 * @param {string} mimeType - MIME type
 * @returns {boolean}
 */
export function isSupportedVideo(mimeType) {
  const supportedTypes = ['video/mp4', 'video/mpeg', 'video/webm', 'image/gif'];
  return supportedTypes.includes(mimeType);
}

/**
 * Get file size in MB
 * @param {Buffer} buffer - File buffer
 * @returns {number} Size in MB
 */
export function getFileSizeMB(buffer) {
  return buffer.length / (1024 * 1024);
}
