/**
 * Formatting utilities
 * Ported from bot2teste for Hinokami Bot
 */

import moment from 'moment-timezone';
import crypto from 'crypto';

/**
 * Generate random message ID
 * @returns {string} Random ID
 */
export function generateMessageID() {
  return crypto.randomBytes(10).toString('hex').toUpperCase();
}

/**
 * Generate random filename
 * @param {string} ext - File extension
 * @returns {string} Random filename
 */
export function getRandom(ext) {
  return `${Math.floor(Math.random() * 10000)}${ext}`;
}

/**
 * Convert bytes to human readable format
 * @param {number} bytes - Bytes to convert
 * @returns {string} Formatted string
 */
export function convertBytes(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Bytes";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  if (i === 0) {
    return bytes + " " + sizes[i];
  }
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumberDecimal(num) {
  return (num).toLocaleString('pt-BR');
}

/**
 * Convert seconds to time string
 * @param {number} seconds - Seconds to convert
 * @returns {string} Formatted time string
 */
export function TimeCount(seconds) {
  function pad(s) {
    return (s < 10 ? "0" : "") + s;
  }
  
  const dias = Math.floor(seconds / (60 * 60) / (24));
  const horas = Math.floor(seconds / (60 * 60) % (24));
  const minutos = Math.floor(seconds % (60 * 60) / 60);
  const segundos = Math.floor(seconds % 60);
  
  return `${pad(dias)} dia(s), ${pad(horas)} hora(s), ${pad(minutos)} minuto(s) e ${pad(segundos)} segundo(s).`;
}

/**
 * Get formatted date and time
 * @param {string} tempo - Format string
 * @param {number|Date} now - Timestamp or date
 * @param {boolean} x - Whether to multiply by 1000
 * @returns {string} Formatted date/time
 */
export function timeDate(tempo, now, x = true) {
  if (Number(now) && x) {
    return moment(now * 1000).tz('America/Sao_Paulo').format(tempo);
  }
  if (Number(now)) {
    return moment(now).tz('America/Sao_Paulo').format(tempo);
  }
  return moment.tz('America/Sao_Paulo').format(tempo);
}

/**
 * Format date to extended format
 * @param {number} number - Timestamp
 * @param {string} locale - Locale string
 * @returns {Promise<string>} Formatted date
 */
export async function formatDateOriginal(number, locale = 'pt') {
  const dateInformation = new Date(number);
  const getDateOrig = await dateInformation.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return getDateOrig;
}

/**
 * Count days between two dates
 * @param {Array} date1 - First date [day, month, year]
 * @param {Array} date2 - Second date [day, month, year]
 * @returns {number} Number of days
 */
export function countDays(date1, date2) {
  if (!(date1 || date2)) return 0;
  
  date1 = new Date(date1[1] + "/" + date1[0] + "/" + date1[2]);
  date2 = new Date(date2[1] + "/" + date2[0] + "/" + date2[2]);
  
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return diffDays || 0;
}

/**
 * Capitalize first letter of string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

/**
 * Calculate BMI (obesity check)
 * @param {number} peso - Weight in kg
 * @param {number} altura - Height in meters
 * @returns {number} BMI value
 */
export function obeso(peso, altura) {
  return Number(parseFloat(peso) / (parseFloat(altura) ** 2)).toFixed(2);
}
