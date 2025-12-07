/**
 * Additional admin command handlers
 */

export async function handleNomegp(ctx) {
  const { sock, from, m, args, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sock.sendMessage(from, {
      text: '❌ O bot precisa ser admin!'
    }, { quoted: m });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ Forneça o novo nome do grupo!\n\n💡 Uso: !nomegp Novo Nome'
    }, { quoted: m });
  }
  
  try {
    const newName = args.join(' ');
    await sock.groupUpdateSubject(from, newName);
    await sock.sendMessage(from, {
      text: `✅ Nome do grupo alterado para:\n${newName}`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro: ${error.message}`
    }, { quoted: m });
  }
}

export async function handleDescgp(ctx) {
  const { sock, from, m, args, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sock.sendMessage(from, {
      text: '❌ O bot precisa ser admin!'
    }, { quoted: m });
  }
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: '❌ Forneça a nova descrição!\n\n💡 Uso: !descgp Nova descrição'
    }, { quoted: m });
  }
  
  try {
    const newDesc = args.join(' ');
    await sock.groupUpdateDescription(from, newDesc);
    await sock.sendMessage(from, {
      text: `✅ Descrição do grupo atualizada!`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro: ${error.message}`
    }, { quoted: m });
  }
}

export async function handleLinkgp(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sock.sendMessage(from, {
      text: '❌ O bot precisa ser admin!'
    }, { quoted: m });
  }
  
  try {
    const code = await sock.groupInviteCode(from);
    await sock.sendMessage(from, {
      text: `🔗 *LINK DO GRUPO*\n\nhttps://chat.whatsapp.com/${code}`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro: ${error.message}`
    }, { quoted: m });
  }
}

export async function handleGrupo(ctx) {
  const { sock, from, m, args, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sock.sendMessage(from, {
      text: '❌ O bot precisa ser admin!'
    }, { quoted: m });
  }
  
  const action = args[0]?.toLowerCase();
  
  if (action === 'abrir' || action === 'open') {
    await sock.groupSettingUpdate(from, 'not_announcement');
    await sock.sendMessage(from, {
      text: '✅ Grupo aberto! Todos podem enviar mensagens.'
    }, { quoted: m });
  } else if (action === 'fechar' || action === 'close') {
    await sock.groupSettingUpdate(from, 'announcement');
    await sock.sendMessage(from, {
      text: '✅ Grupo fechado! Apenas admins podem enviar mensagens.'
    }, { quoted: m });
  } else {
    await sock.sendMessage(from, {
      text: '❌ Use: !grupo abrir ou !grupo fechar'
    }, { quoted: m });
  }
}

export async function handleTotag(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  const quotedMsg = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
  
  if (!quotedMsg) {
    return await sock.sendMessage(from, {
      text: '❌ Marque uma mensagem para fazer totag!'
    }, { quoted: m });
  }
  
  try {
    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants.map(p => p.id);
    
    await sock.sendMessage(from, {
      text: quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '',
      mentions: participants
    });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro: ${error.message}`
    }, { quoted: m });
  }
}

export async function handleDesmute(ctx) {
  const { sock, from, m, args } = ctx;
  
  await sock.sendMessage(from, {
    text: '✅ Função de desmute em desenvolvimento.'
  }, { quoted: m });
}

export async function handleFotogp(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isBotAdmin) {
    return await sock.sendMessage(from, {
      text: '❌ O bot precisa ser admin!'
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: '❌ Marque uma imagem para alterar a foto do grupo.'
  }, { quoted: m });
}

export async function handleBemvindo(ctx) {
  const { from, args } = ctx;
  const { groupDB } = await import('../../utils/database.js');
  
  const status = args[0];
  
  if (status === '1' || status === 'on') {
    groupDB.updateSettings(from, { welcome: true });
    await ctx.sock.sendMessage(from, {
      text: '✅ Mensagem de boas-vindas ativada!'
    }, { quoted: ctx.m });
  } else if (status === '0' || status === 'off') {
    groupDB.updateSettings(from, { welcome: false });
    await ctx.sock.sendMessage(from, {
      text: '✅ Mensagem de boas-vindas desativada!'
    }, { quoted: ctx.m });
  } else {
    await ctx.sock.sendMessage(from, {
      text: '❌ Use: !bemvindo 1 (ativar) ou !bemvindo 0 (desativar)'
    }, { quoted: ctx.m });
  }
}

export default {
  handleNomegp,
  handleDescgp,
  handleLinkgp,
  handleGrupo,
  handleTotag,
  handleDesmute,
  handleFotogp,
  handleBemvindo
};
