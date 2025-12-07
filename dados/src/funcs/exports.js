import { logger } from '../connect.js';
import { groupDB, configDB } from '../utils/database.js';
import { normalizeJid, isValidUrl, downloadFile } from '../utils/helpers.js';
import * as menuHandlers from './menuHandlers.js';
import * as stickerCommands from '../commands/sticker.js';

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

    // Sticker commands - FULLY FUNCTIONAL
    sticker: { handler: stickerCommands.handleSticker },
    fsticker: { handler: stickerCommands.handleSticker },
    s: { handler: stickerCommands.handleSticker },
    f: { handler: stickerCommands.handleSticker },
    ttp: { handler: stickerCommands.handleTTP, requireArgs: true },
    attp: { handler: stickerCommands.handleATTP, requireArgs: true },
    toimg: { handler: stickerCommands.handleToImg },
    rename: { handler: stickerCommands.handleRename },
    
    // Downloads (stubs - require API integration)
    play: { handler: handlePlay, requireArgs: true },
    playaudio: { handler: handlePlay, requireArgs: true },
    playaudio2: { handler: handlePlay, requireArgs: true },
    playvid: { handler: handleVideo, requireArgs: true },
    playvideo2: { handler: handleVideo, requireArgs: true },
    playdoc: { handler: handlePlayDoc, requireArgs: true },
    playdoc2: { handler: handlePlayDoc, requireArgs: true },
    ytshorts: { handler: handleYTShorts, requireArgs: true },
    video: { handler: handleVideo, requireArgs: true },
    tiktok: { handler: handleTikTok, requireArgs: true },
    tiktokaudio: { handler: handleTikTokAudio, requireArgs: true },
    instagram: { handler: handleInstagram, requireArgs: true },
    instaudio: { handler: handleInstaudio, requireArgs: true },
    instagram2: { handler: handleInstagram, requireArgs: true },
    instaudio2: { handler: handleInstaudio, requireArgs: true },
    threads: { handler: handleThreads, requireArgs: true },
    kwai: { handler: handleKwai, requireArgs: true },
    spotify: { handler: handleSpotify, requireArgs: true },
    soundcloud: { handler: handleSoundcloud, requireArgs: true },
    mediafire: { handler: handleMediafire, requireArgs: true },
    googledrive: { handler: handleGoogleDrive, requireArgs: true },
    gerarlink: { handler: handleGerarLink },
    shazam: { handler: handleShazam },
    audiomeme: { handler: handleAudioMeme },
    multidl: { handler: handleMultiDL, requireArgs: true },
    pinterest: { handler: handlePinterest, requireArgs: true },
    audio: { handler: handleAudio, requireArgs: true },

    // Fun commands / Brincadeiras
    gay: { handler: handleGay },
    gado: { handler: handleGado },
    ship: { handler: handleShip },
    jogovelha: { handler: handleJogoDaVelha },
    forca: { handler: handleForca },
    quiz: { handler: handleQuiz },

    // Pesquisas (Search commands - stubs)
    pensador: { handler: handlePensador, requireArgs: true },
    nasa: { handler: handleNasa },
    clima: { handler: handleClima, requireArgs: true },
    movie: { handler: handleMovie, requireArgs: true },
    imdb: { handler: handleIMDB, requireArgs: true },
    imdbinfo: { handler: handleIMDBInfo, requireArgs: true },
    serie: { handler: handleSerie, requireArgs: true },
    lyrics: { handler: handleLyrics, requireArgs: true },
    dicionario: { handler: handleDicionario, requireArgs: true },
    playstore: { handler: handlePlayStore, requireArgs: true },
    aptoide: { handler: handleAptoide, requireArgs: true },
    receita: { handler: handleReceita, requireArgs: true },
    signo: { handler: handleSigno, requireArgs: true },
    amazon: { handler: handleAmazon, requireArgs: true },
    googlesrc: { handler: handleGoogleSearch, requireArgs: true },
    wikipedia: { handler: handleWikipedia, requireArgs: true },
    wallpaper: { handler: handleWallpaper, requireArgs: true },
    ytsearch: { handler: handleYTSearch, requireArgs: true },
    scsearch: { handler: handleSCSearch, requireArgs: true },
    applesearch: { handler: handleAppleSearch, requireArgs: true },
    celular: { handler: handleCelular, requireArgs: true },
    seemoji: { handler: handleSeeEmoji, requireArgs: true },
    scep: { handler: handleCEP, requireArgs: true },
    igsh: { handler: handleIGSH, requireArgs: true },
    tekmods: { handler: handleTekMods, requireArgs: true },
    mercadolivre: { handler: handleMercadoLivre, requireArgs: true },
    cinema: { handler: handleCinema },
    
    // Aleatorios (Random/Utility commands - stubs)
    gtts: { handler: handleGTTS, requireArgs: true },
    tagme: { handler: handleTagMe },
    emoji: { handler: handleEmoji, requireArgs: true },
    emojimix: { handler: handleEmojiMix, requireArgs: true },
    tabela: { handler: handleTabela },
    conselhobiblico: { handler: handleConselhoBiblico },
    cantadas: { handler: handleCantadas },
    conselhos: { handler: handleConselhos },
    simi: { handler: handleSimi, requireArgs: true },
    perfil: { handler: handlePerfil },
    calcular: { handler: handleCalcular, requireArgs: true },
    morechat: { handler: handleMoreChat, requireArgs: true },
    obesidade: { handler: handleObesidade, requireArgs: true },
    contardias: { handler: handleContarDias },
    fazernick: { handler: handleFazerNick, requireArgs: true },
    traduzir: { handler: handleTranslate, requireArgs: true },
    ddd: { handler: handleDDD, requireArgs: true },
    destrava: { handler: handleDestrava },
    destrava2: { handler: handleDestrava2 },
    gerarcpf: { handler: handleGerarCPF },
    tinyurl: { handler: handleTinyURL, requireArgs: true },
    cuttly: { handler: handleCuttly, requireArgs: true },
    bitly: { handler: handleBitly, requireArgs: true },
    sip: { handler: handleSIP, requireArgs: true },
    
    // Informativos
    atividade: { handler: handleAtividade },
    rankativo: { handler: handleRankAtivo, requireGroup: true },
    checkativo: { handler: handleCheckAtivo, requireGroup: true },
    ranklevel: { handler: handleRankLevel, requireGroup: true },
    consultar_premium: { handler: handleConsultarPremium },
    dados: { handler: handleDados },
    infobemvindo: { handler: handleInfoBemvindo },
    idiomas: { handler: handleIdiomas },
    infodono: { handler: handleInfoDono },
    infoaluguel: { handler: handleInfoAluguel },
    infocmdprem: { handler: handleInfoCmdPrem },
    infopremium: { handler: handleInfoPremium },
    
    // Logos (Logo generation - stubs)
    logofire: { handler: handleLogoFire, requireArgs: true },
    logoneon: { handler: handleLogoNeon, requireArgs: true },
    logoshadow: { handler: handleLogoShadow, requireArgs: true },
    logothunder: { handler: handleLogoThunder, requireArgs: true },
    
    // Coins/Economy
    carteira: { handler: handleCarteira },
    daily: { handler: handleDaily },
    transferir: { handler: handleTransferir, requireArgs: true },
    apostar: { handler: handleApostar, requireArgs: true },
    minerar: { handler: handleMinerar },

    // AI (stubs)
    gpt: { handler: handleGPT, requireArgs: true },
    chat: { handler: handleChat, requireArgs: true },

    // Efeitos IMG (stub menu for now)
    efeitosimg: { handler: handleEfeitosImg },

    // AI (stubs)
    gpt: { handler: handleGPT, requireArgs: true },
    chat: { handler: handleChat, requireArgs: true },

    // Owner commands
    broadcast: { handler: handleBroadcast, requireOwner: true, requireArgs: true },
    block: { handler: handleBlock, requireOwner: true },
    unblock: { handler: handleUnblock, requireOwner: true },
    blacklist: { handler: handleBlacklist, requireOwner: true },
    reiniciar: { handler: handleRestart, requireOwner: true },
    restart: { handler: handleRestart, requireOwner: true },
    status: { handler: handleStatus, requireOwner: true }
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

// ========== DOWNLOAD COMMANDS (STUBS) ==========

async function handlePlay(ctx) {
  await sendReply(ctx, 
    `🎵 *Download de Música*\n\n` +
    `⚠️ TODO: Implementar integração com API de download do YouTube\n\n` +
    `Busca: ${ctx.args.join(' ')}`
  );
}

async function handleVideo(ctx) {
  await sendReply(ctx,
    `🎬 *Download de Vídeo*\n\n` +
    `⚠️ TODO: Implementar download de vídeo do YouTube\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

async function handleTikTok(ctx) {
  await sendReply(ctx,
    `📷 *Download TikTok*\n\n` +
    `⚠️ TODO: Implementar API de download sem marca d'água\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

async function handleInstagram(ctx) {
  await sendReply(ctx,
    `📸 *Download Instagram*\n\n` +
    `⚠️ TODO: Implementar download de posts/reels/stories\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

async function handlePinterest(ctx) {
  await sendReply(ctx,
    `📌 *Busca Pinterest*\n\n` +
    `⚠️ TODO: Implementar busca de imagens no Pinterest\n\n` +
    `Termo: ${ctx.args.join(' ')}`
  );
}

async function handleAudio(ctx) {
  await sendReply(ctx,
    `🔊 *Extração de Áudio*\n\n` +
    `⚠️ TODO: Implementar extração de áudio com ffmpeg\n\n` +
    `URL: ${ctx.args[0]}`
  );
}

// ========== FUN COMMANDS (STUBS) ==========

async function handleGPT(ctx) {
  await sendReply(ctx,
    `🤖 *ChatGPT*\n\n` +
    `⚠️ TODO: Implementar integração com OpenAI API\n\n` +
    `Pergunta: ${ctx.args.join(' ')}`
  );
}

async function handleChat(ctx) {
  await sendReply(ctx,
    `💬 *Chat IA*\n\n` +
    `⚠️ TODO: Implementar chat bot com IA\n\n` +
    `Mensagem: ${ctx.args.join(' ')}`
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

// ========== ADDITIONAL DOWNLOAD STUBS ==========

async function handlePlayDoc(ctx) {
  await sendReply(ctx, `📄 *Download como Documento*\n\n⚠️ Recurso necessita de integração com API de YouTube.\n\nBusca: ${ctx.args.join(' ')}`);
}

async function handleYTShorts(ctx) {
  await sendReply(ctx, `📹 *YouTube Shorts Download*\n\n⚠️ Recurso necessita de integração com API.\n\nURL: ${ctx.args[0]}`);
}

async function handleTikTokAudio(ctx) {
  await sendReply(ctx, `🎵 *TikTok Áudio*\n\n⚠️ Recurso necessita de integração com API TikTok.\n\nURL: ${ctx.args[0]}`);
}

async function handleInstaudio(ctx) {
  await sendReply(ctx, `🎵 *Instagram Áudio*\n\n⚠️ Recurso necessita de integração com API Instagram.\n\nURL: ${ctx.args[0]}`);
}

async function handleThreads(ctx) {
  await sendReply(ctx, `🧵 *Threads Download*\n\n⚠️ Recurso necessita de integração com API Threads.\n\nURL: ${ctx.args[0]}`);
}

async function handleKwai(ctx) {
  await sendReply(ctx, `📱 *Kwai Download*\n\n⚠️ Recurso necessita de integração com API Kwai.\n\nURL: ${ctx.args[0]}`);
}

async function handleSpotify(ctx) {
  await sendReply(ctx, `🎧 *Spotify Download*\n\n⚠️ Recurso necessita de integração com API Spotify.\n\nURL: ${ctx.args[0]}`);
}

async function handleSoundcloud(ctx) {
  await sendReply(ctx, `🎶 *SoundCloud Download*\n\n⚠️ Recurso necessita de integração com API SoundCloud.\n\nURL: ${ctx.args[0]}`);
}

async function handleMediafire(ctx) {
  await sendReply(ctx, `📦 *MediaFire Download*\n\n⚠️ Recurso necessita de integração com scraper MediaFire.\n\nURL: ${ctx.args[0]}`);
}

async function handleGoogleDrive(ctx) {
  await sendReply(ctx, `☁️ *Google Drive Download*\n\n⚠️ Recurso necessita de integração com API Google Drive.\n\nURL: ${ctx.args[0]}`);
}

async function handleGerarLink(ctx) {
  await sendReply(ctx, `🔗 *Gerar Link de Mídia*\n\n⚠️ Recurso necessita de serviço de upload (ex: catbox, pomf).\n\nMarque uma mídia com este comando.`);
}

async function handleShazam(ctx) {
  await sendReply(ctx, `🎵 *Shazam - Identificar Música*\n\n⚠️ Recurso necessita de integração com API Shazam ou AudD.\n\nMarque um áudio com este comando.`);
}

async function handleAudioMeme(ctx) {
  await sendReply(ctx, `🎙️ *Audio Meme*\n\n⚠️ Recurso necessita de processamento de áudio.\n\nMarque um áudio com este comando.`);
}

async function handleMultiDL(ctx) {
  await sendReply(ctx, `📥 *Downloader Universal*\n\n⚠️ Recurso necessita de integração com múltiplas APIs.\n\nURL: ${ctx.args[0]}`);
}

// ========== BRINCADEIRAS STUBS ==========

async function handleJogoDaVelha(ctx) {
  await sendReply(ctx, `⭕ *Jogo da Velha*\n\n⚠️ TODO: Implementar lógica de jogo da velha.\n\n💡 Em breve você poderá jogar com seus amigos!`);
}

async function handleForca(ctx) {
  await sendReply(ctx, `🔤 *Jogo da Forca*\n\n⚠️ TODO: Implementar jogo da forca.\n\n💡 Sistema de palavras aleatórias em desenvolvimento!`);
}

async function handleQuiz(ctx) {
  await sendReply(ctx, `❓ *Quiz de Perguntas*\n\n⚠️ TODO: Implementar sistema de quiz.\n\n💡 Banco de perguntas em construção!`);
}

// ========== PESQUISAS STUBS ==========

async function handlePensador(ctx) {
  await sendReply(ctx, `💭 *Pensador - Frases*\n\n⚠️ Recurso necessita de integração com API Pensador.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleNasa(ctx) {
  await sendReply(ctx, `🌌 *NASA - Foto do Dia*\n\n⚠️ Recurso necessita de integração com NASA API.\n\nDefina a variável: NASA_API_KEY`);
}

async function handleClima(ctx) {
  await sendReply(ctx, `🌤️ *Previsão do Tempo*\n\n⚠️ Recurso necessita de integração com OpenWeather API.\n\nCidade: ${ctx.args.join(' ')}`);
}

async function handleMovie(ctx) {
  await sendReply(ctx, `🎬 *Informações de Filme*\n\n⚠️ Recurso necessita de integração com OMDb/TMDB API.\n\nFilme: ${ctx.args.join(' ')}`);
}

async function handleIMDB(ctx) {
  await sendReply(ctx, `🎥 *IMDB Search*\n\n⚠️ Recurso necessita de integração com OMDb API.\n\nFilme: ${ctx.args.join(' ')}`);
}

async function handleIMDBInfo(ctx) {
  await sendReply(ctx, `🎥 *IMDB Info*\n\n⚠️ Recurso necessita de integração com OMDb API.\n\nID: ${ctx.args[0]}`);
}

async function handleSerie(ctx) {
  await sendReply(ctx, `📺 *Informações de Série*\n\n⚠️ Recurso necessita de integração com TMDB API.\n\nSérie: ${ctx.args.join(' ')}`);
}

async function handleLyrics(ctx) {
  await sendReply(ctx, `🎵 *Letras de Músicas*\n\n⚠️ Recurso necessita de integração com Genius/Lyrics API.\n\nMúsica: ${ctx.args.join(' ')}`);
}

async function handleDicionario(ctx) {
  await sendReply(ctx, `📖 *Dicionário*\n\n⚠️ Recurso necessita de integração com API de dicionário.\n\nPalavra: ${ctx.args.join(' ')}`);
}

async function handlePlayStore(ctx) {
  await sendReply(ctx, `📱 *Play Store Search*\n\n⚠️ Recurso necessita de scraping/API Google Play.\n\nApp: ${ctx.args.join(' ')}`);
}

async function handleAptoide(ctx) {
  await sendReply(ctx, `📲 *Aptoide Search*\n\n⚠️ Recurso necessita de integração com Aptoide API.\n\nApp: ${ctx.args.join(' ')}`);
}

async function handleReceita(ctx) {
  await sendReply(ctx, `🍳 *Busca de Receitas*\n\n⚠️ Recurso necessita de integração com API de receitas.\n\nReceita: ${ctx.args.join(' ')}`);
}

async function handleSigno(ctx) {
  await sendReply(ctx, `♈ *Horóscopo*\n\n⚠️ Recurso necessita de integração com API de horóscopo.\n\nSigno: ${ctx.args.join(' ')}`);
}

async function handleAmazon(ctx) {
  await sendReply(ctx, `🛒 *Amazon Search*\n\n⚠️ Recurso necessita de integração com Amazon API.\n\nProduto: ${ctx.args.join(' ')}`);
}

async function handleGoogleSearch(ctx) {
  await sendReply(ctx, `🔍 *Google Search*\n\n⚠️ Recurso necessita de integração com Google Custom Search API.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleWikipedia(ctx) {
  await sendReply(ctx, `📚 *Wikipedia*\n\n⚠️ Recurso necessita de integração com Wikipedia API.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleWallpaper(ctx) {
  await sendReply(ctx, `🖼️ *Wallpaper Search*\n\n⚠️ Recurso necessita de integração com API de wallpapers.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleYTSearch(ctx) {
  await sendReply(ctx, `🔍 *YouTube Search*\n\n⚠️ Recurso necessita de integração com YouTube Data API.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleSCSearch(ctx) {
  await sendReply(ctx, `🔍 *SoundCloud Search*\n\n⚠️ Recurso necessita de integração com SoundCloud API.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleAppleSearch(ctx) {
  await sendReply(ctx, `🔍 *Apple Music Search*\n\n⚠️ Recurso necessita de integração com Apple Music API.\n\nTermo: ${ctx.args.join(' ')}`);
}

async function handleCelular(ctx) {
  await sendReply(ctx, `📱 *Info de Smartphone*\n\n⚠️ Recurso necessita de integração com GSMArena ou similar.\n\nModelo: ${ctx.args.join(' ')}`);
}

async function handleSeeEmoji(ctx) {
  await sendReply(ctx, `😀 *Informações de Emoji*\n\n⚠️ Recurso necessita de API de emojis.\n\nEmoji: ${ctx.args[0]}`);
}

async function handleCEP(ctx) {
  await sendReply(ctx, `📮 *Consulta CEP*\n\n⚠️ Recurso necessita de integração com ViaCEP API.\n\nCEP: ${ctx.args[0]}`);
}

async function handleIGSH(ctx) {
  await sendReply(ctx, `📸 *Instagram User Info*\n\n⚠️ Recurso necessita de integração com Instagram scraper.\n\nUser: ${ctx.args[0]}`);
}

async function handleTekMods(ctx) {
  await sendReply(ctx, `🎮 *TekMods Search*\n\n⚠️ Recurso necessita de scraping TekMods.\n\nNome: ${ctx.args.join(' ')}`);
}

async function handleMercadoLivre(ctx) {
  await sendReply(ctx, `🛍️ *Mercado Livre Search*\n\n⚠️ Recurso necessita de integração com ML API.\n\nProduto: ${ctx.args.join(' ')}`);
}

async function handleCinema(ctx) {
  await sendReply(ctx, `🎬 *Filmes em Cartaz*\n\n⚠️ Recurso necessita de integração com API de cinemas.\n\n💡 Em breve!`);
}

// ========== ALEATORIOS STUBS ==========

async function handleGTTS(ctx) {
  await sendReply(ctx, `🗣️ *Google TTS - Texto para Voz*\n\n⚠️ Recurso necessita de integração com Google TTS.\n\nUso: ${ctx.prefix}gtts pt Olá mundo`);
}

async function handleTagMe(ctx) {
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  await sendReply(ctx, `📣 Você foi marcado!\n\n@${sender.split('@')[0]}`, { mentions: [sender] });
}

async function handleEmoji(ctx) {
  await sendReply(ctx, `😀 *Emoji*\n\n⚠️ Recurso necessita de API de emojis.\n\nTipo: ${ctx.args.join(' ')}`);
}

async function handleEmojiMix(ctx) {
  await sendReply(ctx, `🎨 *Emoji Mix*\n\n⚠️ Recurso necessita de integração com Google Emoji Kitchen.\n\nUso: ${ctx.prefix}emojimix 😀+🔥`);
}

async function handleTabela(ctx) {
  const tabela = `📊 *Tabela de Símbolos*\n\n` +
    `• ─ ━ │ ┃ ┄ ┅ ┆ ┇\n` +
    `• ┈ ┉ ┊ ┋ ┌ ┍ ┎ ┏\n` +
    `• ┐ ┑ ┒ ┓ └ ┕ ┖ ┗\n` +
    `• ┘ ┙ ┚ ┛ ├ ┝ ┞ ┟\n` +
    `• ┠ ┡ ┢ ┣ ┤ ┥ ┦ ┧\n` +
    `• ┨ ┩ ┪ ┫ ┬ ┭ ┮ ┯\n` +
    `• ┰ ┱ ┲ ┳ ┴ ┵ ┶ ┷\n` +
    `• ┸ ┹ ┺ ┻ ┼ ┽ ┾ ┿\n` +
    `• ╀ ╁ ╂ ╃ ╄ ╅ ╆ ╇\n` +
    `• ╈ ╉ ╊ ╋ ╌ ╍ ╎ ╏\n` +
    `• ═ ║ ╒ ╓ ╔ ╕ ╖ ╗\n` +
    `• ╘ ╙ ╚ ╛ ╜ ╝ ╞ ╟\n` +
    `• ╠ ╡ ╢ ╣ ╤ ╥ ╦ ╧\n` +
    `• ╨ ╩ ╪ ╫ ╬ ○ ● ◎\n` +
    `• ◯ ◐ ◑ ◒ ◓ ◔ ◕ ◖\n` +
    `• ◗ ◘ ◙ ◚ ◛ ◜ ◝ ◞`;
  await sendReply(ctx, tabela);
}

async function handleConselhoBiblico(ctx) {
  await sendReply(ctx, `📖 *Conselho Bíblico*\n\n⚠️ Recurso necessita de banco de versículos.\n\n💡 Em desenvolvimento!`);
}

async function handleCantadas(ctx) {
  const cantadas = [
    'Você tem um mapa? Porque eu me perdi no seus olhos! 😍',
    'Você acredita em amor à primeira vista ou preciso passar por aqui de novo? 💕',
    'Se beleza fosse crime, você estaria presa! 🚔',
    'Você é Wi-Fi? Porque estou sentindo uma conexão! 📶',
    'Seu nome é Google? Porque você tem tudo que eu procuro! 🔍'
  ];
  const random = cantadas[Math.floor(Math.random() * cantadas.length)];
  await sendReply(ctx, `💘 *Cantada Aleatória*\n\n${random}`);
}

async function handleConselhos(ctx) {
  const conselhos = [
    'Seja gentil, pois cada pessoa que você encontra está lutando uma batalha.',
    'A paciência é amarga, mas seus frutos são doces.',
    'Não deixe para amanhã o que você pode fazer hoje.',
    'Acredite em si mesmo e tudo será possível.',
    'O sucesso é a soma de pequenos esforços repetidos dia após dia.'
  ];
  const random = conselhos[Math.floor(Math.random() * conselhos.length)];
  await sendReply(ctx, `💡 *Conselho Aleatório*\n\n${random}`);
}

async function handleSimi(ctx) {
  await sendReply(ctx, `🤖 *SimSimi Chat*\n\n⚠️ Recurso necessita de integração com SimSimi API.\n\nDefina SIMSIMI_API_KEY nas variáveis de ambiente.\n\nMensagem: ${ctx.args.join(' ')}`);
}

async function handlePerfil(ctx) {
  const sender = ctx.m.key.participant || ctx.m.key.remoteJid;
  await sendReply(ctx, 
    `👤 *Seu Perfil*\n\n` +
    `📞 Número: @${sender.split('@')[0]}\n` +
    `📊 Comandos usados: Em breve\n` +
    `⭐ Nível: Em breve\n` +
    `💰 Coins: Em breve`,
    { mentions: [sender] }
  );
}

async function handleCalcular(ctx) {
  try {
    const expr = ctx.args.join(' ');
    // Simple eval (UNSAFE in production - use math.js or similar)
    const result = eval(expr);
    await sendReply(ctx, `🔢 *Calculadora*\n\n${expr} = ${result}`);
  } catch {
    await sendReply(ctx, `❌ Expressão inválida!\n\nUso: ${ctx.prefix}calcular 2+2`);
  }
}

async function handleMoreChat(ctx) {
  await sendReply(ctx, `💬 *Comparar Mensagens*\n\n⚠️ Recurso em desenvolvimento.\n\nUso: ${ctx.prefix}morechat msg1/msg2`);
}

async function handleObesidade(ctx) {
  await sendReply(ctx, `⚖️ *Calculadora de IMC*\n\n⚠️ Recurso em desenvolvimento.\n\nUso: ${ctx.prefix}obesidade 70/1.75`);
}

async function handleContarDias(ctx) {
  await sendReply(ctx, `📅 *Contador de Dias*\n\n⚠️ Recurso em desenvolvimento.\n\nCalcule dias entre datas!`);
}

async function handleFazerNick(ctx) {
  const text = ctx.args.join(' ');
  // Simple stylized text
  const styled = text.split('').join(' ').toUpperCase();
  await sendReply(ctx, `✨ *Nick Estilizado*\n\n${styled}`);
}

async function handleTranslate(ctx) {
  await sendReply(ctx, `🌐 *Tradução*\n\n⚠️ Recurso necessita de integração com Google Translate API.\n\nTexto: ${ctx.args.join(' ')}`);
}

async function handleDDD(ctx) {
  await sendReply(ctx, `📞 *Consulta DDD*\n\n⚠️ Recurso necessita de banco de dados de DDDs.\n\nDDD: ${ctx.args[0]}`);
}

async function handleDestrava(ctx) {
  await sendReply(ctx, `🔓 *Mensagem Destrava 1*\n\n⚠️ Este é um comando para destravar o WhatsApp em casos de travamento.\n\n💡 Use com cuidado!`);
}

async function handleDestrava2(ctx) {
  await sendReply(ctx, `🔓 *Mensagem Destrava 2*\n\n⚠️ Versão alternativa do destrava.\n\n💡 Use com cuidado!`);
}

async function handleGerarCPF(ctx) {
  // Generate random CPF (for testing only - not valid)
  const cpf = Array.from({length: 11}, () => Math.floor(Math.random() * 10)).join('');
  const formatted = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  await sendReply(ctx, `🆔 *CPF Gerado (Fictício)*\n\n${formatted}\n\n⚠️ Apenas para fins de teste!`);
}

async function handleTinyURL(ctx) {
  await sendReply(ctx, `🔗 *TinyURL*\n\n⚠️ Recurso necessita de integração com TinyURL API.\n\nURL: ${ctx.args[0]}`);
}

async function handleCuttly(ctx) {
  await sendReply(ctx, `🔗 *Cutt.ly*\n\n⚠️ Recurso necessita de integração com Cutt.ly API.\n\nURL: ${ctx.args[0]}`);
}

async function handleBitly(ctx) {
  await sendReply(ctx, `🔗 *Bit.ly*\n\n⚠️ Recurso necessita de integração com Bitly API.\n\nURL: ${ctx.args[0]}`);
}

async function handleSIP(ctx) {
  await sendReply(ctx, `🌐 *Consulta IP*\n\n⚠️ Recurso necessita de integração com IP info API.\n\nIP: ${ctx.args[0]}`);
}

// ========== INFORMATIVOS STUBS ==========

async function handleAtividade(ctx) {
  await sendReply(ctx, `📊 *Atividade do Bot*\n\n⏱️ Online há: ${Math.floor(process.uptime() / 60)} minutos\n💬 Mensagens processadas: Em breve\n👥 Grupos ativos: Em breve`);
}

async function handleRankAtivo(ctx) {
  await sendReply(ctx, `🏆 *Ranking de Atividade*\n\n⚠️ Sistema de ranking em desenvolvimento.\n\n💡 Em breve você verá os membros mais ativos!`);
}

async function handleCheckAtivo(ctx) {
  await sendReply(ctx, `📊 *Sua Atividade*\n\n⚠️ Sistema de atividade em desenvolvimento.\n\n💡 Em breve!`);
}

async function handleRankLevel(ctx) {
  await sendReply(ctx, `⭐ *Ranking de Níveis*\n\n⚠️ Sistema de níveis em desenvolvimento.\n\n💡 Em breve!`);
}

async function handleConsultarPremium(ctx) {
  await sendReply(ctx, `💎 *Consulta Premium*\n\n⚠️ Sistema premium em desenvolvimento.\n\n💡 Contate o dono para mais informações.`);
}

async function handleDados(ctx) {
  const uptime = process.uptime();
  const mem = process.memoryUsage();
  await sendReply(ctx, 
    `📊 *Dados do Bot*\n\n` +
    `⏱️ Uptime: ${Math.floor(uptime/3600)}h ${Math.floor((uptime%3600)/60)}m\n` +
    `💾 RAM: ${(mem.heapUsed/1024/1024).toFixed(2)} MB\n` +
    `📈 Total: ${(mem.rss/1024/1024).toFixed(2)} MB\n` +
    `🔥 Status: Operacional!`
  );
}

async function handleInfoBemvindo(ctx) {
  await sendReply(ctx, `👋 *Info Boas-Vindas*\n\n⚠️ Sistema de boas-vindas em desenvolvimento.\n\n💡 Configure com: ${ctx.prefix}welcome on/off`);
}

async function handleIdiomas(ctx) {
  await sendReply(ctx, 
    `🌐 *Idiomas GTTS*\n\n` +
    `pt - Português\n` +
    `en - Inglês\n` +
    `es - Espanhol\n` +
    `fr - Francês\n` +
    `de - Alemão\n` +
    `it - Italiano\n` +
    `ja - Japonês\n` +
    `ko - Coreano\n\n` +
    `Uso: ${ctx.prefix}gtts pt Olá mundo`
  );
}

async function handleInfoDono(ctx) {
  const config = await import('../config.json', { with: { type: 'json' } });
  await sendReply(ctx, 
    `👑 *Informações do Dono*\n\n` +
    `Nome: ${config.default.ownerName}\n` +
    `Número: ${config.default.ownerNumber}\n\n` +
    `🗡️ Criador do ${config.default.botName}`
  );
}

async function handleInfoAluguel(ctx) {
  await sendReply(ctx, `💼 *Info Aluguel*\n\n⚠️ Sistema de aluguel em desenvolvimento.\n\n💡 Contate o dono para informações.`);
}

async function handleInfoCmdPrem(ctx) {
  await sendReply(ctx, `💎 *Comandos Premium*\n\n⚠️ Lista de comandos premium em desenvolvimento.\n\n💡 Em breve!`);
}

async function handleInfoPremium(ctx) {
  await sendReply(ctx, `💎 *Informações Premium*\n\n⚠️ Sistema premium em desenvolvimento.\n\n💡 Benefícios exclusivos em breve!`);
}

// ========== LOGOS STUBS ==========

async function handleLogoFire(ctx) {
  await sendReply(ctx, `🔥 *Logo Fire*\n\n⚠️ Recurso necessita de integração com API de logos.\n\nTexto: ${ctx.args.join(' ')}`);
}

async function handleLogoNeon(ctx) {
  await sendReply(ctx, `💡 *Logo Neon*\n\n⚠️ Recurso necessita de integração com API de logos.\n\nTexto: ${ctx.args.join(' ')}`);
}

async function handleLogoShadow(ctx) {
  await sendReply(ctx, `🌑 *Logo Shadow*\n\n⚠️ Recurso necessita de integração com API de logos.\n\nTexto: ${ctx.args.join(' ')}`);
}

async function handleLogoThunder(ctx) {
  await sendReply(ctx, `⚡ *Logo Thunder*\n\n⚠️ Recurso necessita de integração com API de logos.\n\nTexto: ${ctx.args.join(' ')}`);
}

// ========== COINS STUBS ==========

async function handleCarteira(ctx) {
  await sendReply(ctx, `💰 *Sua Carteira*\n\n⚠️ Sistema de economia em desenvolvimento.\n\n💎 Saldo: 0 coins\n⭐ Em breve!`);
}

async function handleDaily(ctx) {
  await sendReply(ctx, `🎁 *Daily Coins*\n\n⚠️ Sistema de recompensas diárias em desenvolvimento.\n\n💡 Em breve você poderá receber coins diariamente!`);
}

async function handleTransferir(ctx) {
  await sendReply(ctx, `💸 *Transferir Coins*\n\n⚠️ Sistema de transferências em desenvolvimento.\n\nUso: ${ctx.prefix}transferir @user 100`);
}

async function handleApostar(ctx) {
  await sendReply(ctx, `🎲 *Apostar Coins*\n\n⚠️ Sistema de apostas em desenvolvimento.\n\nUso: ${ctx.prefix}apostar 50`);
}

async function handleMinerar(ctx) {
  await sendReply(ctx, `⛏️ *Minerar Coins*\n\n⚠️ Sistema de mineração em desenvolvimento.\n\n💡 Mine coins e fique rico!`);
}

// ========== EFEITOS IMG STUB ==========

async function handleEfeitosImg(ctx) {
  await sendReply(ctx, 
    `🎨 *Menu Efeitos de Imagem*\n\n` +
    `⚠️ Efeitos de imagem em desenvolvimento.\n\n` +
    `💡 Em breve:\n` +
    `• Filtros (blur, sharpen, etc)\n` +
    `• Efeitos (vintage, sepia, etc)\n` +
    `• Manipulação (resize, crop, etc)\n` +
    `• Stickers personalizados`
  );
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
