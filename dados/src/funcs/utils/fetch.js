/**
 * Fetch utilities for API calls and downloads
 * Ported from bot2teste for Hinokami Bot
 */

import axios from 'axios';
import fetch from 'node-fetch';

/**
 * Fetch JSON from URL
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} JSON response
 */
export async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'DNT': '1',
        'Upgrade-Insecure-Request': '1',
        ...options.headers
      },
      ...options
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('fetchJson error:', error);
    throw error;
  }
}

/**
 * Fetch text from URL
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<string>} Text response
 */
export async function fetchText(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'DNT': '1',
        'Upgrade-Insecure-Request': '1'
      },
      method: 'GET',
      ...options
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const text = await res.text();
    return text;
  } catch (error) {
    console.error('fetchText error:', error);
    throw error;
  }
}

/**
 * Fetch buffer from URL
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Buffer>} Buffer response
 */
export async function fetchBuffer(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'DNT': '1',
        'Upgrade-Insecure-Request': '1'
      },
      method: 'GET',
      ...options
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const buffer = await res.buffer();
    const mimetype = res.headers.get('content-type');
    
    return {
      mimetype,
      result: buffer
    };
  } catch (error) {
    console.error('fetchBuffer error:', error);
    throw error;
  }
}

/**
 * Get buffer from URL (simple version)
 * @param {string} url - URL to fetch
 * @returns {Promise<Buffer>} Buffer response
 */
export async function getBuffer(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'DNT': '1',
        'Upgrade-Insecure-Request': '1'
      },
      method: 'GET'
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const buffer = await res.buffer();
    return buffer;
  } catch (error) {
    console.error('getBuffer error:', error);
    throw error;
  }
}

/**
 * Axios get with default headers
 * @param {string} url - URL to fetch
 * @param {Object} options - Axios options
 * @returns {Promise<Object>} Axios response
 */
export async function axiosGet(url, options = {}) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...options.headers
      },
      ...options
    });
    return response.data;
  } catch (error) {
    console.error('axiosGet error:', error);
    throw error;
  }
}
