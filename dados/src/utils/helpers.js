import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { paths } from './paths.js';

/**
 * Utilitários e helpers para o Hinokami Bot 🗡️🔥
 */

/**
 * Normaliza número de telefone para formato JID
 * @param {string} number - Número de telefone
 * @returns {string} JID normalizado
 */
export function normalizeJid(number) {
  if (!number) return '';
  
  // Remove caracteres não numéricos
  const cleaned = number.replace(/\D/g, '');
  
  // Se já tiver @s.whatsapp.net ou @g.us, retorna
  if (number.includes('@')) return number;
  
  // Retorna com sufixo padrão
  return `${cleaned}@s.whatsapp.net`;
}

/**
 * Verifica se é um JID de grupo
 * @param {string} jid - JID para verificar
 * @returns {boolean}
 */
export function isGroup(jid) {
  return jid && jid.endsWith('@g.us');
}

/**
 * Verifica se é um JID privado
 * @param {string} jid - JID para verificar
 * @returns {boolean}
 */
export function isPrivate(jid) {
  return jid && jid.endsWith('@s.whatsapp.net');
}

/**
 * Extrai número do JID
 * @param {string} jid - JID completo
 * @returns {string} Número extraído
 */
export function getNumber(jid) {
  if (!jid) return '';
  return jid.split('@')[0];
}

/**
 * Formata tempo em segundos para string legível
 * @param {number} seconds - Segundos
 * @returns {string} Tempo formatado
 */
export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0) parts.push(`${secs}s`);
  
  return parts.join(' ') || '0s';
}

/**
 * Formata bytes para tamanho legível
 * @param {number} bytes - Bytes
 * @returns {string} Tamanho formatado
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Sleep/delay assíncrono
 * @param {number} ms - Milissegundos para esperar
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gera número aleatório entre min e max
 * @param {number} min - Mínimo
 * @param {number} max - Máximo
 * @returns {number}
 */
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Escolhe item aleatório de array
 * @param {Array} array - Array de itens
 * @returns {*} Item aleatório
 */
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Download de arquivo via URL
 * @param {string} url - URL do arquivo
 * @param {string} outputPath - Caminho de saída (opcional)
 * @returns {Promise<Buffer|string>} Buffer ou caminho do arquivo
 */
export async function downloadFile(url, outputPath = null) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const buffer = Buffer.from(response.data);
    
    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, buffer);
      return outputPath;
    }
    
    return buffer;
  } catch (error) {
    throw new Error(`Erro ao baixar arquivo: ${error.message}`);
  }
}

/**
 * Valida URL
 * @param {string} url - URL para validar
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extrai URLs de texto
 * @param {string} text - Texto para extrair URLs
 * @returns {Array<string>} Array de URLs
 */
export function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  return text.match(urlRegex) || [];
}

/**
 * Limpa e sanitiza texto
 * @param {string} text - Texto para limpar
 * @returns {string} Texto limpo
 */
export function sanitizeText(text) {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Valida número de telefone
 * @param {string} number - Número para validar
 * @returns {boolean}
 * Note: Basic validation - for production use, consider libphonenumber-js
 */
export function isValidPhoneNumber(number) {
  const cleaned = number.replace(/\D/g, '');
  // Most international numbers are 10-15 digits
  // For stricter validation, integrate libphonenumber-js library
  return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Sistema de cooldown/rate limiting
 */
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  check(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    // Remove requisições antigas
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  reset(key) {
    this.requests.delete(key);
  }

  getRemainingTime(key) {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    
    if (userRequests.length === 0) return 0;
    
    const oldestRequest = Math.min(...userRequests);
    const remainingTime = this.windowMs - (now - oldestRequest);
    
    return Math.max(0, remainingTime);
  }
}

/**
 * Cache simples com expiração
 */
export class SimpleCache {
  constructor(ttl = 300000) { // 5 minutos padrão
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value, customTtl = null) {
    const expiresAt = Date.now() + (customTtl || this.ttl);
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Fila de mensagens com processamento sequencial
 */
export class MessageQueue {
  constructor(maxSize = 100) {
    this.queue = [];
    this.maxSize = maxSize;
    this.processing = false;
  }

  add(message) {
    if (this.queue.length >= this.maxSize) {
      this.queue.shift(); // Remove a mais antiga
    }
    this.queue.push(message);
  }

  async process(handler) {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const message = this.queue.shift();
      try {
        await handler(message);
      } catch (error) {
        console.error('Erro ao processar mensagem da fila:', error);
      }
      await sleep(100); // Pequeno delay entre mensagens
    }

    this.processing = false;
  }

  size() {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
  }
}

/**
 * Gerenciador de anti-delete (cache de mensagens deletadas)
 */
export class AntiDeleteCache extends SimpleCache {
  constructor() {
    super(86400000); // 24 horas
  }

  saveMessage(messageId, messageData) {
    this.set(messageId, messageData);
  }

  getMessage(messageId) {
    return this.get(messageId);
  }
}

export default {
  normalizeJid,
  isGroup,
  isPrivate,
  getNumber,
  formatTime,
  formatBytes,
  sleep,
  random,
  randomChoice,
  downloadFile,
  isValidUrl,
  extractUrls,
  sanitizeText,
  isValidPhoneNumber,
  RateLimiter,
  SimpleCache,
  MessageQueue,
  AntiDeleteCache
};
