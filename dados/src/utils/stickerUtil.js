import Jimp from 'jimp';
import ffmpeg from 'fluent-ffmpeg';
import { Sticker } from 'node-webpmux';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Sticker creation utilities for Hinokami Bot
 * Handles image and video/GIF conversion to WebP stickers
 */

// Configuration
const STICKER_CONFIG = {
  size: 512,
  quality: 100,
  maxVideoSeconds: 10,
  maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
  defaultPack: 'YURI BOT',
  defaultAuthor: 'MAY0LPHI'
};

/**
 * Create a static sticker from an image buffer
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {Object} options - Options for sticker creation
 * @returns {Promise<Buffer>} WebP sticker buffer
 */
export async function createImageSticker(imageBuffer, options = {}) {
  try {
    const {
      pack = STICKER_CONFIG.defaultPack,
      author = STICKER_CONFIG.defaultAuthor
    } = options;

    // Load image with Jimp
    const image = await Jimp.read(imageBuffer);
    
    // Get dimensions
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Calculate new dimensions maintaining aspect ratio
    let newWidth, newHeight;
    if (width > height) {
      newWidth = STICKER_CONFIG.size;
      newHeight = Math.round((height / width) * STICKER_CONFIG.size);
    } else {
      newHeight = STICKER_CONFIG.size;
      newWidth = Math.round((width / height) * STICKER_CONFIG.size);
    }
    
    // Resize image
    image.resize(newWidth, newHeight);
    
    // Create a 512x512 transparent background
    const canvas = new Jimp(STICKER_CONFIG.size, STICKER_CONFIG.size, 0x00000000);
    
    // Center the image
    const x = Math.round((STICKER_CONFIG.size - newWidth) / 2);
    const y = Math.round((STICKER_CONFIG.size - newHeight) / 2);
    canvas.composite(image, x, y);
    
    // Convert to WebP
    const webpBuffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
    
    // Add metadata using node-webpmux
    const sticker = new Sticker(webpBuffer, { pack, author });
    const finalBuffer = await sticker.build();
    
    return finalBuffer;
  } catch (error) {
    throw new Error(`Erro ao criar sticker de imagem: ${error.message}`);
  }
}

/**
 * Create an animated sticker from a video/GIF buffer
 * @param {Buffer} videoBuffer - Input video/GIF buffer
 * @param {Object} options - Options for sticker creation
 * @returns {Promise<Buffer>} WebP animated sticker buffer
 */
export async function createVideoSticker(videoBuffer, options = {}) {
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `input_${Date.now()}.mp4`);
  const outputPath = path.join(tempDir, `output_${Date.now()}.webp`);

  try {
    const {
      pack = STICKER_CONFIG.defaultPack,
      author = STICKER_CONFIG.defaultAuthor,
      maxSeconds = STICKER_CONFIG.maxVideoSeconds
    } = options;

    // Write video buffer to temp file
    await fs.writeFile(inputPath, videoBuffer);

    // Check video duration and convert to WebP using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-vcodec libwebp',
          '-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=0x00000000',
          '-loop 0',
          '-preset default',
          '-an',
          '-vsync 0',
          '-s 512:512'
        ])
        .duration(maxSeconds)
        .toFormat('webp')
        .on('error', (err) => {
          reject(new Error(`Erro ao converter vídeo: ${err.message}`));
        })
        .on('end', () => {
          resolve();
        })
        .save(outputPath);
    });

    // Read the generated WebP
    const webpBuffer = await fs.readFile(outputPath);

    // Check file size
    if (webpBuffer.length > STICKER_CONFIG.maxFileSizeBytes) {
      throw new Error(`Arquivo muito grande (${Math.round(webpBuffer.length / 1024 / 1024)}MB). Máximo: 5MB`);
    }

    // Add metadata
    const sticker = new Sticker(webpBuffer, { pack, author });
    const finalBuffer = await sticker.build();

    // Clean up temp files
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {})
    ]);

    return finalBuffer;
  } catch (error) {
    // Clean up on error
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {})
    ]);
    
    throw new Error(`Erro ao criar sticker animado: ${error.message}`);
  }
}

/**
 * Convert sticker to image
 * @param {Buffer} stickerBuffer - Input sticker buffer
 * @returns {Promise<Buffer>} PNG image buffer
 */
export async function stickerToImage(stickerBuffer) {
  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `sticker_${Date.now()}.webp`);
  const outputPath = path.join(tempDir, `image_${Date.now()}.png`);

  try {
    // Write sticker to temp file
    await fs.writeFile(inputPath, stickerBuffer);

    // Convert WebP to PNG using ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat('png')
        .on('error', (err) => {
          reject(new Error(`Erro ao converter sticker: ${err.message}`));
        })
        .on('end', () => {
          resolve();
        })
        .save(outputPath);
    });

    // Read the generated PNG
    const pngBuffer = await fs.readFile(outputPath);

    // Clean up
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {})
    ]);

    return pngBuffer;
  } catch (error) {
    // Clean up on error
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {})
    ]);
    
    throw new Error(`Erro ao converter sticker para imagem: ${error.message}`);
  }
}

/**
 * Get video duration in seconds
 * @param {string} filePath - Path to video file
 * @returns {Promise<number>} Duration in seconds
 */
export async function getVideoDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration || 0);
      }
    });
  });
}

/**
 * Check if buffer is a video/GIF
 * @param {Buffer} buffer - Input buffer
 * @returns {boolean} True if video/GIF
 */
export function isVideoOrGif(buffer) {
  // Magic number constants for video format detection
  const VIDEO_SIGNATURES = {
    GIF: [0x47, 0x49, 0x46, 0x38], // 'GIF8'
    MP4_FTYP: '667479' // hex for 'ftyp' in MP4/MOV/M4V containers
  };

  // Check GIF signature (47 49 46 = 'GIF')
  if (buffer[0] === VIDEO_SIGNATURES.GIF[0] && 
      buffer[1] === VIDEO_SIGNATURES.GIF[1] && 
      buffer[2] === VIDEO_SIGNATURES.GIF[2]) {
    return true;
  }

  // Check MP4/MOV/M4V (looks for 'ftyp' box identifier)
  if (buffer.slice(4, 12).toString('hex').includes(VIDEO_SIGNATURES.MP4_FTYP)) {
    return true;
  }

  // Check WebM signature (1A 45 DF A3)
  if (buffer[0] === 0x1A && buffer[1] === 0x45) {
    return true;
  }

  return false;
}

export default {
  createImageSticker,
  createVideoSticker,
  stickerToImage,
  getVideoDuration,
  isVideoOrGif,
  STICKER_CONFIG
};
