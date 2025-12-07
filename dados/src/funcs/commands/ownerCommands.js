/**
 * Owner-only command handlers
 */

export async function handleListargrupos(ctx) {
  const { sock, from, m } = ctx;
  
  try {
    const groups = await sock.groupFetchAllParticipating();
    const groupList = Object.values(groups).map((g, i) => 
      `${i + 1}. ${g.subject} (${g.participants.length} membros)`
    ).join('\n');
    
    await sock.sendMessage(from, {
      text: `👥 *GRUPOS DO BOT*\n\n${groupList || 'Nenhum grupo'}`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro: ${error.message}`
    }, { quoted: m });
  }
}

export async function handleEntrargrupo(ctx) {
  const { sock, from, m, args } = ctx;
  
  if (args.length === 0) {
    return await sock.sendMessage(from, {
      text: `❌ Forneça o link do grupo!\n\n💡 Uso: !entrargrupo https://chat.whatsapp.com/...`
    }, { quoted: m });
  }
  
  try {
    const link = args[0];
    const code = link.split('/').pop();
    await sock.groupAcceptInvite(code);
    await sock.sendMessage(from, {
      text: `✅ Entrei no grupo com sucesso!`
    }, { quoted: m });
  } catch (error) {
    await sock.sendMessage(from, {
      text: `❌ Erro ao entrar no grupo: ${error.message}`
    }, { quoted: m });
  }
}

export async function handleSairgrupo(ctx) {
  const { sock, from, m, permissions } = ctx;
  
  if (!permissions.isGroup) {
    return await sock.sendMessage(from, {
      text: `❌ Use este comando em um grupo!`
    }, { quoted: m });
  }
  
  await sock.sendMessage(from, {
    text: `👋 Saindo do grupo... Até mais!`
  }, { quoted: m });
  
  setTimeout(async () => {
    await sock.groupLeave(from);
  }, 2000);
}

export async function handleRgtm(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `✅ Grupo registrado para transmissões!`
  }, { quoted: m });
}

export async function handleTirardatm(ctx) {
  const { sock, from, m } = ctx;
  
  await sock.sendMessage(from, {
    text: `✅ Grupo removido das transmissões!`
  }, { quoted: m });
}

export default {
  handleListargrupos,
  handleEntrargrupo,
  handleSairgrupo,
  handleRgtm,
  handleTirardatm
};
