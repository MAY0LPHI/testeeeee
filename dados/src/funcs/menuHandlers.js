/**
 * Menu command handlers
 * Integrates all menus from allMenus.js
 */

import config from '../config.json' with { type: 'json' };
import * as allMenus from '../menus/allMenus.js';
import * as originalMenus from '../menus/menu.js';

/**
 * Send menu reply
 */
async function sendMenuReply(ctx, menuText, imageUrl = null) {
  const { sock, from, m } = ctx;
  
  try {
    if (imageUrl) {
      await sock.sendMessage(from, {
        image: { url: imageUrl },
        caption: menuText,
        mentions: [m.key.participant || m.key.remoteJid]
      }, { quoted: m });
    } else {
      await sock.sendMessage(from, {
        text: menuText,
        mentions: [m.key.participant || m.key.remoteJid]
      }, { quoted: m });
    }
  } catch (error) {
    // Fallback to text only
    await sock.sendMessage(from, {
      text: menuText,
      mentions: [m.key.participant || m.key.remoteJid]
    }, { quoted: m });
  }
}

/**
 * Get sender name from context
 */
function getSenderName(ctx) {
  const { m } = ctx;
  return m.pushName || 'Guerreiro';
}

/**
 * Get group name from context
 */
async function getGroupName(ctx) {
  const { sock, from, permissions } = ctx;
  
  if (!permissions.isGroup) return '';
  
  try {
    const metadata = await sock.groupMetadata(from);
    return metadata.subject || '';
  } catch {
    return '';
  }
}

/**
 * Handler for main menu
 */
export async function handleMenuPrincipal(ctx) {
  const { prefix } = ctx;
  const senderName = getSenderName(ctx);
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuPrincipal(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for owner menu
 */
export async function handleMenuDono(ctx) {
  const { prefix, permissions } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuDono(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for admin menu
 */
export async function handleMenuAdm(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuAdm(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for premium menu
 */
export async function handleMenuPremium(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuPremium(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for downloads menu
 */
export async function handleMenuDownloads(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuDownloads(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for figurinhas (stickers) menu
 */
export async function handleMenuFigurinhas(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuFigurinhas(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for pesquisas (searches) menu
 */
export async function handleMenuPesquisas(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuPesquisas(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for aleatórios menu
 */
export async function handleMenuAleatorios(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuAleatorios(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for informativos menu
 */
export async function handleMenuInformativos(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuInformativos(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for brincadeiras menu
 */
export async function handleMenuBrincadeiras(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuBrincadeiras(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for logos menu
 */
export async function handleMenuLogos(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuLogos(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

/**
 * Handler for coins menu
 */
export async function handleMenuCoins(ctx) {
  const { prefix } = ctx;
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  
  const menuText = allMenus.buildMenuCoins(
    sender,
    prefix,
    config.botName || 'Hinokami Bot',
    config.ownerName || 'Owner'
  );
  
  await sendMenuReply(ctx, menuText);
}

export default {
  handleMenuPrincipal,
  handleMenuDono,
  handleMenuAdm,
  handleMenuPremium,
  handleMenuDownloads,
  handleMenuFigurinhas,
  handleMenuPesquisas,
  handleMenuAleatorios,
  handleMenuInformativos,
  handleMenuBrincadeiras,
  handleMenuLogos,
  handleMenuCoins
};
