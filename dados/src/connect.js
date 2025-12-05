import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore
} from 'whaileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { paths } from './utils/paths.js';
import config from './config.json' assert { type: 'json' };

/**
 * Conexão do Hinokami Bot com WhatsApp 🗡️🔥
 * Implementa QR Code, pair code, reconexão automática e gerenciamento de sessão
 */

const logger = pino({
  level: config.debug ? 'debug' : 'info'
});

// Diretório de sessão
const sessionDir = paths.session || path.join(paths.dados, 'session');
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

// Store para mensagens (cache)
const store = makeInMemoryStore({ logger });
store?.readFromFile(path.join(sessionDir, 'store.json'));

// Salvar store periodicamente
setInterval(() => {
  store?.writeToFile(path.join(sessionDir, 'store.json'));
}, 30000); // A cada 30 segundos

/**
 * Conecta ao WhatsApp com reconexão automática
 * @param {Function} messageHandler - Handler para processar mensagens recebidas
 * @returns {Promise<WASocket>}
 */
export async function connectToWhatsApp(messageHandler) {
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version } = await fetchLatestBaileysVersion();

  // Configuração de reconexão com backoff exponencial
  let retryCount = 0;
  const maxRetries = 10;
  const baseDelay = 1000;

  async function startConnection() {
    try {
      const sock = makeWASocket({
        version,
        logger,
        printQRInTerminal: false, // Desabilitado para controle manual
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        browser: ['Hinokami Bot', 'Chrome', '20.0.0'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
          if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id);
            return msg?.message || undefined;
          }
          return undefined;
        },
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: false
      });

      // Bind store ao socket
      if (store) {
        store.bind(sock.ev);
      }

      // Handler de conexão
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Mostrar QR Code se disponível
        if (qr) {
          console.log('\n🗡️ HINOKAMI BOT - Escaneie o QR Code abaixo 🔥\n');
          qrcode.generate(qr, { small: true });
          console.log('\nOu use o método de pareamento (pair code) se preferir.\n');
        }

        // Conexão estabelecida
        if (connection === 'open') {
          retryCount = 0;
          logger.info('🔥 Hinokami Bot conectado com sucesso!');
          console.log('\n✨ Respiração do Sol ativada! O bot está online! ⚔️\n');
        }

        // Desconectado
        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error instanceof Boom)
            ? lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
            : true;

          const reason = lastDisconnect?.error?.output?.statusCode;
          logger.warn(`Conexão fechada. Razão: ${reason}. Reconectar: ${shouldReconnect}`);

          if (shouldReconnect && retryCount < maxRetries) {
            retryCount++;
            const delay = Math.min(baseDelay * Math.pow(2, retryCount - 1), 60000);
            
            logger.info(`Tentativa de reconexão ${retryCount}/${maxRetries} em ${delay}ms...`);
            
            setTimeout(() => {
              startConnection().catch(err => {
                logger.error('Erro na reconexão:', err);
              });
            }, delay);
          } else if (retryCount >= maxRetries) {
            logger.error('❌ Número máximo de tentativas de reconexão atingido.');
            process.exit(1);
          } else {
            logger.info('🚪 Bot desconectado (logout). Finalizando...');
            process.exit(0);
          }
        }
      });

      // Salvar credenciais quando atualizadas
      sock.ev.on('creds.update', saveCreds);

      // Processar mensagens recebidas
      if (messageHandler) {
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
          try {
            for (const message of messages) {
              // Ignorar mensagens de notificação do próprio bot
              if (!message.message || message.key.fromMe) continue;
              
              await messageHandler(sock, message);
            }
          } catch (error) {
            logger.error('Erro ao processar mensagem:', error);
          }
        });

        // Handler para mensagens deletadas (anti-delete)
        if (config.features?.antiDelete) {
          sock.ev.on('messages.delete', async (deletion) => {
            try {
              logger.debug('Mensagem deletada detectada:', deletion);
              // TODO: Implementar lógica de anti-delete
              // Pode reenviar a mensagem salva em cache
            } catch (error) {
              logger.error('Erro no anti-delete:', error);
            }
          });
        }

        // Handler para atualizações de grupo
        sock.ev.on('group-participants.update', async (update) => {
          try {
            logger.debug('Atualização de participantes do grupo:', update);
            // TODO: Implementar mensagens de boas-vindas/saída
          } catch (error) {
            logger.error('Erro ao processar atualização de grupo:', error);
          }
        });
      }

      return sock;
    } catch (error) {
      logger.error('Erro ao iniciar conexão:', error);
      throw error;
    }
  }

  return startConnection();
}

/**
 * Método alternativo: Pareamento via código
 * @param {string} phoneNumber - Número de telefone (com código do país)
 * @returns {Promise<string>} Código de pareamento
 */
export async function getPairCode(phoneNumber) {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      browser: ['Hinokami Bot', 'Chrome', '20.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    // Solicitar código de pareamento
    const code = await sock.requestPairingCode(phoneNumber);
    logger.info(`🔥 Código de pareamento gerado: ${code}`);
    
    return code;
  } catch (error) {
    logger.error('Erro ao gerar código de pareamento:', error);
    throw error;
  }
}

/**
 * Verifica se existe sessão salva
 * @returns {boolean}
 */
export function hasSession() {
  const credsPath = path.join(sessionDir, 'creds.json');
  return fs.existsSync(credsPath);
}

/**
 * Remove sessão atual (logout)
 */
export function clearSession() {
  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      logger.info('✅ Sessão removida com sucesso');
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Erro ao remover sessão:', error);
    return false;
  }
}

export default {
  connectToWhatsApp,
  getPairCode,
  hasSession,
  clearSession,
  logger,
  store
};
