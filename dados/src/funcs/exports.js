import { logger } from '../connect.js';
import { groupDB, configDB } from '../utils/database.js';
import { normalizeJid, isValidUrl, downloadFile } from '../utils/helpers.js';
import * as menuHandlers from './menuHandlers.js';
import * as stickerCommands from './commands/stickerCommands.js';
import * as randomCommands from './commands/randomCommands.js';
import * as downloadCommands from './commands/downloadCommands.js';
import * as searchCommands from './commands/searchCommands.js';
import * as infoCommands from './commands/infoCommands.js';
import * as funCommands from './commands/funCommands.js';
import * as logoCommands from './commands/logoCommands.js';
import * as coinsCommands from './commands/coinsCommands.js';
import * as ownerCommands from './commands/ownerCommands.js';
import * as adminCommands from './commands/adminCommands.js';

/**
 * Exporta todos os handlers de comandos do Hinokami Bot
 * Organiza comandos por categoria e delega execução
 */

/**
 * Handler principal que roteia comandos para categorias
 */
export async function commandHandler(ctx) {
  const { commandName, permissions } = ctx;

  // Mapa de comandos por categoria
  const commandMap = {
    // Menu commands
    menu: { handler: menuHandlers.handleMenuPrincipal },
    menuprincipal: { handler: menuHandlers.handleMenuPrincipal },
    menudono: { handler: menuHandlers.handleMenuDono },
    donomenu: { handler: menuHandlers.handleMenuDono },
    menuadm: { handler: menuHandlers.handleMenuAdm },
    menuadms: { handler: menuHandlers.handleMenuAdm },
    adm: { handler: menuHandlers.handleMenuAdm },
    menupremium: { handler: menuHandlers.handleMenuPremium },
    menuprem: { handler: menuHandlers.handleMenuPremium },
    menudownloads: { handler: menuHandlers.handleMenuDownloads },
    menudown: { handler: menuHandlers.handleMenuDownloads },
    download: { handler: menuHandlers.handleMenuDownloads },
    figurinhas: { handler: menuHandlers.handleMenuFigurinhas },
    menufigurinhas: { handler: menuHandlers.handleMenuFigurinhas },
    pesquisas: { handler: menuHandlers.handleMenuPesquisas },
    menupesquisas: { handler: menuHandlers.handleMenuPesquisas },
    aleatorios: { handler: menuHandlers.handleMenuAleatorios },
    menualeatorios: { handler: menuHandlers.handleMenuAleatorios },
    informativos: { handler: menuHandlers.handleMenuInformativos },
    menuinformativos: { handler: menuHandlers.handleMenuInformativos },
    brincadeiras: { handler: menuHandlers.handleMenuBrincadeiras },
    brincadeira: { handler: menuHandlers.handleMenuBrincadeiras },
    logos: { handler: menuHandlers.handleMenuLogos },
    menulogos: { handler: menuHandlers.handleMenuLogos },
    menulogo: { handler: menuHandlers.handleMenuLogos },
    menucoins: { handler: menuHandlers.handleMenuCoins },
    modocoins: { handler: menuHandlers.handleMenuCoins },
    efeitosimg: { handler: menuHandlers.handleMenuFigurinhas },
    
    // Admin commands
    ban: { handler: handleBan, requireAdmin: true, requireGroup: true },
    kick: { handler: handleKick, requireAdmin: true, requireGroup: true },
    add: { handler: handleAdd, requireAdmin: true, requireGroup: true },
    promover: { handler: handlePromote, requireAdmin: true, requireGroup: true },
    promote: { handler: handlePromote, requireAdmin: true, requireGroup: true },
    rebaixar: { handler: handleDemote, requireAdmin: true, requireGroup: true },
    demote: { handler: handleDemote, requireAdmin: true, requireGroup: true },
    antilink: { handler: handleAntilink, requireAdmin: true, requireGroup: true },
    antispam: { handler: handleAntispam, requireAdmin: true, requireGroup: true },
    antiporn: { handler: handleAntiporn, requireAdmin: true, requireGroup: true },
    mute: { handler: handleMute, requireAdmin: true, requireGroup: true },
    welcome: { handler: handleWelcome, requireAdmin: true, requireGroup: true },
    addmod: { handler: handleAddMod, requireAdmin: true, requireGroup: true },
    delmod: { handler: handleDelMod, requireAdmin: true, requireGroup: true },
    listmods: { handler: handleListMods, requireGroup: true },
    warn: { handler: handleWarn, requireAdmin: true, requireGroup: true },
    unwarn: { handler: handleUnwarn, requireAdmin: true, requireGroup: true },
    nomegp: { handler: adminCommands.handleNomegp, requireAdmin: true, requireGroup: true },
    descgp: { handler: adminCommands.handleDescgp, requireAdmin: true, requireGroup: true },
    linkgp: { handler: adminCommands.handleLinkgp, requireAdmin: true, requireGroup: true },
    grupo: { handler: adminCommands.handleGrupo, requireAdmin: true, requireGroup: true },
    totag: { handler: adminCommands.handleTotag, requireAdmin: true, requireGroup: true },
    desmute: { handler: adminCommands.handleDesmute, requireAdmin: true, requireGroup: true },
    fotogp: { handler: adminCommands.handleFotogp, requireAdmin: true, requireGroup: true },
    bemvindo: { handler: adminCommands.handleBemvindo, requireAdmin: true, requireGroup: true },

    // Sticker commands
    sticker: { handler: stickerCommands.handleSticker },
    fsticker: { handler: stickerCommands.handleFsticker },
    toimg: { handler: stickerCommands.handleToImg },
    ttp: { handler: stickerCommands.handleTtp, requireArgs: true },
    attp: { handler: stickerCommands.handleAttp, requireArgs: true },
    rename: { handler: stickerCommands.handleRename, requireArgs: true },
    qc: { handler: stickerCommands.handleQc },
    brat: { handler: stickerCommands.handleBrat, requireArgs: true },
    bratvideo: { handler: stickerCommands.handleBratvideo, requireArgs: true },

    // Download commands
    play: { handler: downloadCommands.handlePlay, requireArgs: true },
    playaudio: { handler: downloadCommands.handlePlayaudio, requireArgs: true },
    playaudio2: { handler: downloadCommands.handlePlayaudio2, requireArgs: true },
    playvid: { handler: downloadCommands.handlePlayvid, requireArgs: true },
    playvideo2: { handler: downloadCommands.handlePlayvideo2, requireArgs: true },
    playdoc: { handler: downloadCommands.handlePlaydoc, requireArgs: true },
    playdoc2: { handler: downloadCommands.handlePlaydoc2, requireArgs: true },
    ytshorts: { handler: downloadCommands.handleYtshorts, requireArgs: true },
    shazam: { handler: downloadCommands.handleShazam },
    audiomeme: { handler: downloadCommands.handleAudiomeme },
    spotify: { handler: downloadCommands.handleSpotify, requireArgs: true },
    tiktok: { handler: downloadCommands.handleTiktok, requireArgs: true },
    tiktokaudio: { handler: downloadCommands.handleTiktokaudio, requireArgs: true },
    instagram: { handler: downloadCommands.handleInstagram, requireArgs: true },
    instaudio: { handler: downloadCommands.handleInstaudio, requireArgs: true },
    instagram2: { handler: downloadCommands.handleInstagram2, requireArgs: true },
    instaudio2: { handler: downloadCommands.handleInstaudio2, requireArgs: true },
    threads: { handler: downloadCommands.handleThreads, requireArgs: true },
    kwai: { handler: downloadCommands.handleKwai, requireArgs: true },
    multidl: { handler: downloadCommands.handleMultidl, requireArgs: true },
    soundcloud: { handler: downloadCommands.handleSoundcloud, requireArgs: true },
    mediafire: { handler: downloadCommands.handleMediafire, requireArgs: true },
    googledrive: { handler: downloadCommands.handleGoogledrive, requireArgs: true },
    gerarlink: { handler: downloadCommands.handleGerarlink },

    // Search commands
    pensador: { handler: searchCommands.handlePensador, requireArgs: true },
    nasa: { handler: searchCommands.handleNasa },
    clima: { handler: searchCommands.handleClima, requireArgs: true },
    movie: { handler: searchCommands.handleMovie, requireArgs: true },
    imdb: { handler: searchCommands.handleImdb, requireArgs: true },
    imdbinfo: { handler: searchCommands.handleImdbinfo, requireArgs: true },
    serie: { handler: searchCommands.handleSerie, requireArgs: true },
    lyrics: { handler: searchCommands.handleLyrics, requireArgs: true },
    dicionario: { handler: searchCommands.handleDicionario, requireArgs: true },
    playstore: { handler: searchCommands.handlePlaystore, requireArgs: true },
    aptoide: { handler: searchCommands.handleAptoide, requireArgs: true },
    receita: { handler: searchCommands.handleReceita, requireArgs: true },
    signo: { handler: searchCommands.handleSigno, requireArgs: true },
    amazon: { handler: searchCommands.handleAmazon, requireArgs: true },
    googlesrc: { handler: searchCommands.handleGooglesrc, requireArgs: true },
    wikipedia: { handler: searchCommands.handleWikipedia, requireArgs: true },
    pinterest: { handler: searchCommands.handlePinterest, requireArgs: true },
    wallpaper: { handler: searchCommands.handleWallpaper, requireArgs: true },
    ytsearch: { handler: searchCommands.handleYtsearch, requireArgs: true },
    scsearch: { handler: searchCommands.handleScsearch, requireArgs: true },
    applesearch: { handler: searchCommands.handleApplesearch, requireArgs: true },
    celular: { handler: searchCommands.handleCelular, requireArgs: true },
    seemoji: { handler: searchCommands.handleSeemoji, requireArgs: true },
    scep: { handler: searchCommands.handleScep, requireArgs: true },
    igsh: { handler: searchCommands.handleIgsh, requireArgs: true },
    tekmods: { handler: searchCommands.handleTekmods, requireArgs: true },
    mercadolivre: { handler: searchCommands.handleMercadolivre, requireArgs: true },
    cinema: { handler: searchCommands.handleCinema },

    // Random/utility commands
    gtts: { handler: randomCommands.handleGtts, requireArgs: true },
    tagme: { handler: randomCommands.handleTagme },
    emoji: { handler: randomCommands.handleEmoji, requireArgs: true },
    emojimix: { handler: randomCommands.handleEmojimix, requireArgs: true },
    tabela: { handler: randomCommands.handleTabela },
    conselhobiblico: { handler: randomCommands.handleConselhobiblico },
    cantadas: { handler: randomCommands.handleCantadas },
    conselhos: { handler: randomCommands.handleConselhos },
    simi: { handler: randomCommands.handleSimi, requireArgs: true },
    perfil: { handler: randomCommands.handlePerfil },
    calcular: { handler: randomCommands.handleCalcular, requireArgs: true },
    obesidade: { handler: randomCommands.handleObesidade, requireArgs: true },
    traduzir: { handler: randomCommands.handleTraduzir, requireArgs: true },
    ddd: { handler: randomCommands.handleDDD, requireArgs: true },
    destrava: { handler: randomCommands.handleDestrava },
    destrava2: { handler: randomCommands.handleDestrava2 },
    gerarcpf: { handler: randomCommands.handleGeracpf },
    tinyurl: { handler: randomCommands.handleTinyurl, requireArgs: true },
    cuttly: { handler: randomCommands.handleCuttly, requireArgs: true },
    bitly: { handler: randomCommands.handleBitly, requireArgs: true },
    sip: { handler: randomCommands.handleSip, requireArgs: true },
    morechat: { handler: randomCommands.handleMorechat, requireArgs: true },
    contardias: { handler: randomCommands.handleContardias },
    fazernick: { handler: randomCommands.handleFazernick, requireArgs: true },

    // Info commands
    atividade: { handler: infoCommands.handleAtividade },
    rankativo: { handler: infoCommands.handleRankativo },
    checkativo: { handler: infoCommands.handleCheckativo },
    ranklevel: { handler: infoCommands.handleRanklevel },
    consultar_premium: { handler: infoCommands.handleConsultar_premium },
    dados: { handler: infoCommands.handleDados },
    infobemvindo: { handler: infoCommands.handleInfobemvindo },
    idiomas: { handler: infoCommands.handleIdiomas },
    infodono: { handler: infoCommands.handleInfodono },
    infoaluguel: { handler: infoCommands.handleInfoaluguel },
    infocmdprem: { handler: infoCommands.handleInfocmdprem },
    infopremium: { handler: infoCommands.handleInfopremium },

    // Fun/game commands
    gay: { handler: handleGay },
    gado: { handler: handleGado },
    ship: { handler: handleShip },
    jogovelha: { handler: funCommands.handleJogovelha },
    forca: { handler: funCommands.handleForca },
    quiz: { handler: funCommands.handleQuiz },

    // Logo commands
    logofire: { handler: logoCommands.handleLogofire, requireArgs: true },
    logoneon: { handler: logoCommands.handleLogoneon, requireArgs: true },
    logoshadow: { handler: logoCommands.handleLogoshadow, requireArgs: true },
    logothunder: { handler: logoCommands.handleLogothunder, requireArgs: true },

    // Economy/coins commands
    carteira: { handler: coinsCommands.handleCarteira },
    daily: { handler: coinsCommands.handleDaily },
    transferir: { handler: coinsCommands.handleTransferir, requireArgs: true },
    apostar: { handler: coinsCommands.handleApostar, requireArgs: true },
    minerar: { handler: coinsCommands.handleMinerar },

    // Owner commands
    broadcast: { handler: handleBroadcast, requireOwner: true, requireArgs: true },
    block: { handler: handleBlock, requireOwner: true },
    unblock: { handler: handleUnblock, requireOwner: true },
    blacklist: { handler: handleBlacklist, requireOwner: true },
    reiniciar: { handler: handleRestart, requireOwner: true },
    restart: { handler: handleRestart, requireOwner: true },
    status: { handler: handleStatus, requireOwner: true },
    listargrupos: { handler: ownerCommands.handleListargrupos, requireOwner: true },
    entrargrupo: { handler: ownerCommands.handleEntrargrupo, requireOwner: true },
    sairgrupo: { handler: ownerCommands.handleSairgrupo, requireOwner: true },
    rgtm: { handler: ownerCommands.handleRgtm, requireOwner: true },
    tirardatm: { handler: ownerCommands.handleTirardatm, requireOwner: true },
    premium: { handler: handleBlacklist, requireOwner: true }
  };

  const command = commandMap[commandName];

  if (!command) {
    return false; // Comando não encontrado
  }

  // Verificar permissões
  if (command.requireOwner && !permissions.isOwner) {
    await sendReply(ctx, '❌ Este comando é exclusivo do dono do bot!');
    return true;
  }

  if (command.requireAdmin && !permissions.isGroupAdmin && !permissions.isOwner && !permissions.isMod) {
    await sendReply(ctx, '❌ Você precisa ser admin do grupo para usar este comando!');
    return true;
  }

  if (command.requireGroup && !permissions.isGroup) {
    await sendReply(ctx, '❌ Este comando só funciona em grupos!');
    return true;
  }

  if (command.requireArgs && ctx.args.length === 0) {
    await sendReply(ctx, `❌ Uso incorreto!\n\nUse: ${ctx.prefix}${commandName} <argumentos>`);
    return true;
  }

  // Executar handler
  try {
    await command.handler(ctx);
    return true;
  } catch (error) {
    logger.error(`Erro ao executar comando ${commandName}:`, error);
    await sendReply(ctx, `❌ Erro ao executar comando: ${error.message}`);
    return true;
  }
}

// ========== ADMIN COMMANDS ==========

async function handleBan(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin para banir membros!');
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário que deseja banir!\n\nEx: !ban @usuario');
  }

  try {
    await sock.groupParticipantsUpdate(from, [mentioned], 'remove');
    await sendReply(ctx, `✅ Usuário banido com sucesso!\n\n🗡️ A justiça da Respiração do Sol foi aplicada!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro ao banir usuário: ${error.message}`);
  }
}

async function handleKick(ctx) {
  // Alias para ban
  return await handleBan(ctx);
}

async function handleAdd(ctx) {
  const { sock, from, args, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin para adicionar membros!');
  }

  const number = args[0]?.replace(/\D/g, '');
  
  if (!number) {
    return await sendReply(ctx, '❌ Forneça um número válido!\n\nEx: !add 5511999999999');
  }

  try {
    const jid = normalizeJid(number);
    await sock.groupParticipantsUpdate(from, [jid], 'add');
    await sendReply(ctx, `✅ Membro adicionado com sucesso!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro ao adicionar membro: ${error.message}`);
  }
}

async function handlePromote(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin!');
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !promover @usuario');
  }

  try {
    await sock.groupParticipantsUpdate(from, [mentioned], 'promote');
    await sendReply(ctx, `✅ Usuário promovido a admin!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleDemote(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sendReply(ctx, '❌ O bot precisa ser admin!');
  }

  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !rebaixar @usuario');
  }

  try {
    await sock.groupParticipantsUpdate(from, [mentioned], 'demote');
    await sendReply(ctx, `✅ Admin rebaixado a membro!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleAntilink(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !antilink on/off');
  }

  groupDB.updateSettings(from, { antilink: status === 'on' });
  await sendReply(ctx, `✅ Antilink ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleAntispam(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !antispam on/off');
  }

  groupDB.updateSettings(from, { antispam: status === 'on' });
  await sendReply(ctx, `✅ Antispam ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleAntiporn(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !antiporn on/off');
  }

  groupDB.updateSettings(from, { antiporn: status === 'on' });
  await sendReply(ctx, `✅ Antiporn ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleMute(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !mute on/off');
  }

  groupDB.updateSettings(from, { mute: status === 'on' });
  await sendReply(ctx, `✅ Modo mute ${status === 'on' ? 'ativado' : 'desativado'}!`);
}

async function handleWelcome(ctx) {
  const { from, args } = ctx;
  const status = args[0]?.toLowerCase();
  
  if (!['on', 'off'].includes(status)) {
    return await sendReply(ctx, '❌ Use: !welcome on/off');
  }

  groupDB.updateSettings(from, { welcome: status === 'on' });
  await sendReply(ctx, `✅ Mensagem de boas-vindas ${status === 'on' ? 'ativada' : 'desativada'}!`);
}

async function handleAddMod(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !addmod @usuario');
  }

  groupDB.addMod(from, mentioned);
  await sendReply(ctx, `✅ Moderador virtual adicionado!`);
}

async function handleDelMod(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !delmod @usuario');
  }

  groupDB.removeMod(from, mentioned);
  await sendReply(ctx, `✅ Moderador virtual removido!`);
}

async function handleListMods(ctx) {
  const { from } = ctx;
  const group = groupDB.getGroup(from);
  
  if (group.mods.length === 0) {
    return await sendReply(ctx, '📋 Não há moderadores virtuais neste grupo.');
  }

  const modList = group.mods.map((mod, i) => `${i + 1}. @${mod.split('@')[0]}`).join('\n');
  await sendReply(ctx, `👑 *Moderadores Virtuais*\n\n${modList}`, { mentions: group.mods });
}

async function handleWarn(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !warn @usuario');
  }

  const warnings = groupDB.addWarning(from, mentioned);
  await sendReply(ctx, `⚠️ Aviso aplicado!\n\nTotal de avisos: ${warnings}`);
}

async function handleUnwarn(ctx) {
  const { from, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !unwarn @usuario');
  }

  groupDB.clearWarnings(from, mentioned);
  await sendReply(ctx, `✅ Avisos limpos!`);
}

// ========== FUN COMMANDS ==========

async function handleGay(ctx) {
  const { m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned ? `@${mentioned.split('@')[0]}` : 'Você';
  const percentage = Math.floor(Math.random() * 101);
  
  await sendReply(ctx, 
    `🏳️‍🌈 *Medidor Gay*\n\n${target} é ${percentage}% gay! 🌈`,
    mentioned ? { mentions: [mentioned] } : {}
  );
}

async function handleGado(ctx) {
  const { m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const target = mentioned ? `@${mentioned.split('@')[0]}` : 'Você';
  const percentage = Math.floor(Math.random() * 101);
  
  await sendReply(ctx,
    `🐄 *Medidor de Gado*\n\n${target} é ${percentage}% gado! 🐄`,
    mentioned ? { mentions: [mentioned] } : {}
  );
}

async function handleShip(ctx) {
  const { m } = ctx;
  const mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  
  if (mentions.length < 2) {
    return await sendReply(ctx, '❌ Marque 2 pessoas!\n\nEx: !ship @pessoa1 @pessoa2');
  }

  const percentage = Math.floor(Math.random() * 101);
  const hearts = '❤️'.repeat(Math.floor(percentage / 20));
  
  await sendReply(ctx,
    `💕 *Shipômetro*\n\n` +
    `@${mentions[0].split('@')[0]} + @${mentions[1].split('@')[0]}\n\n` +
    `${hearts}\n${percentage}%`,
    { mentions }
  );
}

// ========== OWNER COMMANDS ==========

async function handleBroadcast(ctx) {
  const { sock, args } = ctx;
  const message = args.join(' ');
  
  await sendReply(ctx,
    `📢 *Broadcast*\n\n` +
    `⚠️ TODO: Implementar envio para todos os grupos\n\n` +
    `Mensagem: ${message}`
  );
}

async function handleBlock(ctx) {
  const { sock, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !block @usuario');
  }

  try {
    await sock.updateBlockStatus(mentioned, 'block');
    await sendReply(ctx, `✅ Usuário bloqueado!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleUnblock(ctx) {
  const { sock, m } = ctx;
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!mentioned) {
    return await sendReply(ctx, '❌ Marque o usuário!\n\nEx: !unblock @usuario');
  }

  try {
    await sock.updateBlockStatus(mentioned, 'unblock');
    await sendReply(ctx, `✅ Usuário desbloqueado!`);
  } catch (error) {
    await sendReply(ctx, `❌ Erro: ${error.message}`);
  }
}

async function handleBlacklist(ctx) {
  const { args, m } = ctx;
  const action = args[0]?.toLowerCase();
  const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  
  if (!['add', 'del'].includes(action) || !mentioned) {
    return await sendReply(ctx, '❌ Use: !blacklist add/del @usuario');
  }

  if (action === 'add') {
    configDB.addToBlacklist(mentioned);
    await sendReply(ctx, `✅ Usuário adicionado à blacklist global!`);
  } else {
    configDB.removeFromBlacklist(mentioned);
    await sendReply(ctx, `✅ Usuário removido da blacklist global!`);
  }
}

async function handleRestart(ctx) {
  await sendReply(ctx, `🔄 Reiniciando o Hinokami Bot...\n\n🗡️ Aguarde alguns instantes!`);
  
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}

async function handleStatus(ctx) {
  const uptime = process.uptime();
  const memUsage = process.memoryUsage();
  
  const status = `📊 *Status do Bot*\n\n` +
    `⏱️ Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m\n` +
    `💾 RAM: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
    `📈 Total: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB\n\n` +
    `🔥 Hinokami Bot em plena atividade!`;
  
  await sendReply(ctx, status);
}

// ========== HELPER ==========

async function sendReply(ctx, text, options = {}) {
  try {
    return await ctx.sock.sendMessage(ctx.from, {
      text,
      ...options
    }, { quoted: ctx.m });
  } catch (error) {
    logger.error('Erro ao enviar resposta:', error);
    throw error;
  }
}

export default commandHandler;
