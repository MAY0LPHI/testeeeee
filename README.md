# 🗡️ Hinokami Bot - Tanjiro WhatsApp Bot 🔥

![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

Bot do WhatsApp temático do **Tanjiro Kamado** de *Demon Slayer (Kimetsu no Yaiba)*, implementado com a biblioteca `whaileys` e recursos avançados de moderação, entretenimento e automação.

## ⚔️ Características

### 🔥 Respiração do Sol - Funcionalidades Principais

- **📥 Downloads Automáticos**: TikTok, Instagram, YouTube, Pinterest
- **👑 Administração de Grupo**: Ban/kick, promote/demote, antilink, antispam, antiporn
- **🎮 Entretenimento**: Jogos (jogo da velha, forca, quiz), rankings aleatórios, ship
- **🛠️ Ferramentas**: Stickers, tradução, busca de imagens, encurtador de links
- **🤖 IA & Automação**: ChatGPT, geração de imagens, resumos automáticos
- **💾 Sistema de Banco de Dados**: Persistência JSON com backups automáticos
- **📊 Sistema de Níveis**: XP e ranking de membros
- **💰 Economia Virtual**: Sistema de moedas e transações
- **🛡️ Anti-Delete**: Cache de mensagens deletadas
- **🔄 Reconexão Automática**: Com backoff exponencial
- **⏱️ Rate Limiting**: Anti-spam e cooldowns configuráveis

### 🌸 Tema Tanjiro

Todas as mensagens, menus e interações são temáticas do Tanjiro, incluindo:
- Emojis característicos: 🗡️🔥🌸⛩️🪵💧🌙⚔️
- Mensagens inspiradas na Respiração do Sol (Hinokami Kagura)
- Design ASCII personalizado nos menus
- Linguagem imersiva do universo de Demon Slayer

## 📋 Requisitos

- **Node.js**: 20.0.0 ou superior
- **NPM**: Instalado com Node.js
- **WhatsApp**: Conta válida para autenticação

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MAY0LPHI/TETEEEE.git
cd TETEEEE
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o bot

```bash
npm run config:install
```

Você será guiado por um assistente interativo que irá:
- Definir o nome do bot
- Configurar o número do dono (obrigatório)
- Escolher o prefixo de comandos (padrão: `!`)
- Ajustar configurações de comportamento
- Criar estrutura de banco de dados

### 4. Inicie o bot

```bash
npm start
```

Na primeira execução, um **QR Code** será exibido. Escaneie-o com seu WhatsApp para conectar o bot.

**Método alternativo**: Use pareamento por código (pair code) editando o script de conexão.

## 📚 Comandos Disponíveis

### NPM Scripts

```bash
npm start          # Inicia o bot
npm run dev        # Inicia em modo desenvolvimento (com nodemon)
npm run config     # Abre configuração interativa
npm run config:install  # Instalação inicial completa
npm update         # Atualiza dependências
```

### Bot Commands (Prefixo padrão: `!`)

#### 🌸 Menu Principal
- `!menu` - Exibe menu principal
- `!ajuda <comando>` - Ajuda sobre comando específico

#### 📥 Downloads
- `!play <nome/url>` - Download de música do YouTube
- `!video <url>` - Download de vídeo do YouTube
- `!tiktok <url>` - Download sem marca d'água
- `!instagram <url>` - Posts/reels/stories do Instagram
- `!pinterest <termo>` - Buscar imagens

#### 👑 Administração (Requer admin)
- `!ban @user` - Banir membro
- `!kick @user` - Remover membro
- `!add <número>` - Adicionar membro
- `!promover @user` - Promover a admin
- `!rebaixar @user` - Rebaixar de admin
- `!antilink <on/off>` - Ativar/desativar antilink
- `!antispam <on/off>` - Ativar/desativar antispam
- `!welcome <on/off>` - Mensagens de boas-vindas
- `!addmod @user` - Adicionar moderador virtual
- `!warn @user` - Aplicar aviso

#### 🎮 Diversão
- `!gay @user` - Medidor gay (aleatório)
- `!gado @user` - Medidor de gado
- `!ship @user1 @user2` - Compatibilidade de casal
- `!jogovelha @user` - Jogo da velha
- `!forca` - Jogo de forca
- `!quiz` - Quiz aleatório

#### 🛠️ Ferramentas
- `!sticker` - Criar sticker (responda imagem/vídeo)
- `!toimg` - Converter sticker em imagem
- `!traduzir <lang> <texto>` - Traduzir texto
- `!encurtar <url>` - Encurtar link
- `!ping` - Verificar latência
- `!uptime` - Tempo online do bot

#### 🤖 IA (Requer API keys)
- `!gpt <pergunta>` - Chat com GPT
- `!chat <mensagem>` - Conversar com IA
- `!imagine <descrição>` - Gerar imagem com IA

#### 🔧 Dono (Apenas owner)
- `!broadcast <msg>` - Enviar mensagem para todos os grupos
- `!block @user` - Bloquear usuário
- `!blacklist add/del @user` - Gerenciar blacklist global
- `!reiniciar` - Reiniciar o bot
- `!status` - Ver status do sistema

## ⚙️ Configuração

### Arquivo: `dados/src/config.json`

```json
{
  "botName": "Hinokami Bot 🗡️🔥",
  "ownerNumber": "55XXXXXXXXXXX",  // CONFIGURE AQUI
  "prefix": "!",
  "debug": false,
  "features": {
    "antiDelete": true,
    "antiSpam": true,
    "cooldown": 3,
    "welcomeMessage": true,
    "levelSystem": true,
    "economy": true
  },
  "limits": {
    "maxWarnings": 3,
    "maxCommandsPerMinute": 10,
    "messageQueueSize": 100
  }
}
```

**Importante**: Configure o `ownerNumber` com seu número de WhatsApp (com código do país, sem +).

### APIs Externas (Opcional)

Alguns recursos requerem chaves de API externas:

#### Downloads
- **YouTube**: Considere usar `ytdl-core` ou APIs como `y2mate`
- **TikTok**: APIs de scraping como `tiktok-scraper`
- **Instagram**: `instagram-scraper` ou APIs similares

#### IA
- **OpenAI GPT**: Registre-se em [OpenAI](https://openai.com) e obtenha uma API key
- **Geração de Imagens**: DALL-E, Midjourney, Stable Diffusion

Configure as chaves em variáveis de ambiente ou no código dos handlers correspondentes (marcados com `TODO`).

## 🗂️ Estrutura do Projeto

```
TETEEEE/
├── package.json                 # Dependências e scripts
├── README.md                    # Este arquivo
├── dados/
│   ├── database/                # Banco de dados JSON
│   │   ├── grupos/              # Dados de grupos
│   │   ├── dono/                # Dados do dono
│   │   ├── grupos.json          # BD de grupos
│   │   ├── usuarios.json        # BD de usuários
│   │   └── config_db.json       # Configuração do BD
│   ├── midias/                  # Arquivos de mídia
│   │   └── menu.jpg             # Imagem do menu
│   ├── session/                 # Sessão do WhatsApp
│   └── src/                     # Código-fonte
│       ├── .scripts/            # Scripts de execução
│       │   ├── config.js        # Configuração interativa
│       │   ├── start.js         # Inicialização
│       │   └── update.js        # Atualização
│       ├── funcs/               # Funções de comandos
│       │   ├── downloads/       # Handlers de download
│       │   ├── private/         # Funções privadas
│       │   ├── utils/           # Utilitários
│       │   └── exports.js       # Handler principal de comandos
│       ├── menus/               # Sistema de menus
│       │   ├── index.js         # Exportador de menus
│       │   └── menu.js          # Construtores de menus
│       ├── utils/               # Utilitários gerais
│       │   ├── database.js      # Sistema de BD
│       │   ├── helpers.js       # Funções auxiliares
│       │   └── paths.js         # Caminhos do projeto
│       ├── config.json          # Configuração principal
│       ├── connect.js           # Lógica de conexão WA
│       └── index.js             # Processador de mensagens
```

## 🔐 Segurança

- **Rate Limiting**: Previne spam com limite de comandos por minuto
- **Cooldowns**: Tempo de espera entre comandos do mesmo usuário
- **Blacklist Global**: Bloqueio de usuários problemáticos
- **Permissões**: Sistema de verificação de owner/admin/mod
- **Validação de Inputs**: Sanitização de dados de entrada
- **Error Handling**: Tratamento defensivo de erros

## 🐛 Troubleshooting

### Bot não conecta

1. Verifique se o Node.js é versão 20+: `node --version`
2. Limpe a sessão: `rm -rf dados/session/`
3. Execute novamente: `npm start`

### Comandos não funcionam

1. Verifique o prefixo em `config.json`
2. Certifique-se de que você é admin (para comandos de admin)
3. Verifique os logs em modo debug: `"debug": true` no config.json

### Erro "Maximum call stack"

- Problema com reconexão infinita. Verifique sua conexão de internet.
- Limpe a sessão e reconecte.

### APIs não funcionam (downloads, IA)

- Os comandos estão marcados com `TODO` para integração com APIs externas
- Configure as chaves de API nos handlers correspondentes
- Consulte a documentação de cada serviço

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add: nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 TODO / Roadmap

- [ ] Implementar integrações de download (YouTube, TikTok, Instagram)
- [ ] Adicionar suporte a OpenAI GPT
- [ ] Sistema de economia completo (loja virtual, transações)
- [ ] Jogos interativos funcionais (jogo da velha, forca, quiz)
- [ ] Geração de stickers com manipulação avançada
- [ ] Sistema de traduções multi-idioma
- [ ] Dashboard web para gerenciamento
- [ ] Suporte a comandos por áudio
- [ ] Sistema de backup automático na nuvem
- [ ] Métricas e analytics de uso

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**MAY0LPHI**

- GitHub: [@MAY0LPHI](https://github.com/MAY0LPHI)

## 🙏 Agradecimentos

- **Koyeb/Whaileys**: Biblioteca WhatsApp Web
- **Demon Slayer**: Inspiração temática
- **Comunidade open-source**: Pelas bibliotecas utilizadas

---

<div align="center">

### 🗡️ Proteção da Respiração do Sol Ativada! 🔥

**Hinokami Bot** - _Desenvolvido com determinação e força de vontade_

🌸 _"Não importa o quão fraco você seja, sempre há algo que você pode fazer"_ 🌸

</div>