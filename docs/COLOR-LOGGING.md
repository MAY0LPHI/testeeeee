# 🎨 Sistema de Logging Colorido - Hinokami Bot

## 📋 Visão Geral

O sistema de logging colorido foi implementado para melhorar significativamente a visibilidade das mensagens que o bot recebe no terminal. Agora você pode facilmente distinguir entre diferentes tipos de eventos através de cores e formatação organizadas.

## 🌈 Tipos de Logs e Cores

### 📨 Mensagens e Comandos

| Tipo | Cor de Fundo | Formato | Exemplo |
|------|--------------|---------|---------|
| **COMANDO** | Ciano | `[HH:MM:SS] COMANDO !comando de 5511999887766 (Grupo/Privado)` | Comandos executados pelos usuários |
| **MENSAGEM** | Branco | `[HH:MM:SS] MENSAGEM de 5511999887766 (Grupo/Privado) : "texto..."` | Mensagens normais recebidas |

### 🔌 Conexão

| Status | Cor de Fundo | Descrição |
|--------|--------------|-----------|
| **CONECTADO** | Verde | Bot conectado com sucesso |
| **CONECTANDO** | Amarelo | Tentando conectar/reconectar |
| **DESCONECTADO** | Vermelho | Conexão perdida |
| **QR CODE** | Magenta | QR Code gerado para autenticação |

### ⚠️ Eventos de Segurança

| Tipo | Cor de Fundo | Descrição |
|------|--------------|-----------|
| **RATE LIMIT** | Vermelho | Usuário excedeu limite de comandos por minuto |
| **COOLDOWN** | Amarelo | Usuário tentou comando em cooldown |
| **BLACKLIST** | Vermelho | Usuário bloqueado tentou executar comando |

### 📊 Logs do Sistema

| Tipo | Cor de Fundo | Uso |
|------|--------------|-----|
| **INFO** | Azul | Informações gerais do sistema |
| **SUCESSO** | Verde | Operações completadas com sucesso |
| **AVISO** | Amarelo | Avisos que não impedem operação |
| **ERRO** | Vermelho | Erros que precisam atenção |
| **DEBUG** | Cinza | Logs de depuração (apenas em modo debug) |

## 🎯 Benefícios

1. **Visibilidade Aprimorada**: Identifique rapidamente o tipo de evento no terminal
2. **Organização Clara**: Todas as mensagens seguem um formato consistente com timestamp
3. **Depuração Facilitada**: Erros e avisos se destacam visualmente
4. **Monitoramento Eficiente**: Acompanhe comandos, mensagens e eventos de conexão em tempo real
5. **Separadores Visuais**: Linhas de separação para melhor organização

## 🔧 Como Usar

O sistema de logging colorido é automático. Quando você iniciar o bot com `npm start`, verá automaticamente:

1. **Banner colorido** na inicialização
2. **Logs de conexão** durante o processo de autenticação
3. **Mensagens coloridas** para cada evento que ocorre
4. **Separadores visuais** entre seções importantes

## 📝 Exemplo de Output

```
╔════════════════════════════════════════╗
║     🗡️  HINOKAMI BOT - TANJIRO  🔥     ║
║                                        ║
║   Respiração do Sol - Forma Inicial    ║
║                                        ║
╚════════════════════════════════════════╝

────────────────────────────────────────────────────────────────────────────────
[04:46:09]  CONECTANDO  Tentando conectar ao WhatsApp...
[04:46:10]  QR CODE  Escaneie o QR Code abaixo para conectar
[04:46:12]  CONECTADO  Bot conectado com sucesso! Respiração do Sol ativada!
────────────────────────────────────────────────────────────────────────────────
[04:46:15]  MENSAGEM  de 5511999887766 (Grupo) : "Olá pessoal! Como estão?"
[04:46:17]  COMANDO  !menu de 5511999887766 (Grupo)
[04:46:18]  COMANDO  !play de 5511988776655 (Privado)
────────────────────────────────────────────────────────────────────────────────
[04:46:20]  RATE LIMIT  Usuário 5511999887766 - 25s restantes
[04:46:22]  COOLDOWN  5511988776655 tentou !play - 3s restantes
────────────────────────────────────────────────────────────────────────────────
```

## 🛠️ Implementação Técnica

- **Biblioteca**: Chalk 5.x (ESM)
- **Arquivo**: `dados/src/utils/colorLogger.js`
- **Integração**: Automática em `index.js`, `connect.js` e `start.js`

## 🎨 Personalização

Para personalizar as cores, edite o arquivo `dados/src/utils/colorLogger.js` e modifique as funções de log conforme necessário.

### Cores Disponíveis no Chalk

- Texto: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
- Fundo: `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
- Modificadores: `bold`, `dim`, `italic`, `underline`

## 🧪 Teste

Para testar o sistema de cores sem executar o bot, use:

```bash
node test-colors.js
```

Este script demonstra todos os tipos de logs disponíveis com suas respectivas cores.

## 📚 Documentação da API

### Funções Principais

```javascript
import * as colorLogger from './dados/src/utils/colorLogger.js';

// Logs de comandos e mensagens
colorLogger.logCommand(commandName, senderNumber, isGroup);
colorLogger.logMessage(senderNumber, isGroup, messagePreview);

// Logs de conexão
colorLogger.logConnection(status, message); // status: 'success', 'connecting', 'disconnected', 'qr'

// Logs do sistema
colorLogger.logInfo(context, message);
colorLogger.logSuccess(context, message);
colorLogger.logWarning(context, message);
colorLogger.logError(context, error);
colorLogger.logDebug(context, message);

// Logs de segurança
colorLogger.logRateLimit(senderNumber, remainingTime);
colorLogger.logCooldown(senderNumber, commandName, cooldownTime);
colorLogger.logBlacklist(senderNumber, commandName);

// Utilitários
colorLogger.logSeparator(); // Linha separadora
colorLogger.logBanner();    // Banner do bot
```

---

**Desenvolvido para o Hinokami Bot** 🗡️🔥
