# 🗡️ Hinokami Bot - Tanjiro WhatsApp Bot 🔥

![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

Bot do WhatsApp temático do **Tanjiro Kamado** de *Demon Slayer (Kimetsu no Yaiba)*, implementado com a biblioteca `whaileys` e recursos avançados de moderação, entretenimento e automação.

## ⚔️ Características

### 🔥 Respiração do Sol - Funcionalidades Principais

- **📥 Downloads Automáticos**: YouTube (play, playvid, ytshorts), TikTok, Instagram, Spotify, SoundCloud, Kwai, Threads, MediaFire, Google Drive
- **👑 Administração de Grupo**: Ban/kick, add, promote/demote, antilink, antispam, welcome messages, totag, link generator
- **🎮 Entretenimento**: Jogos (jogo da velha, forca, quiz), medidores aleatórios (gay, gado, ship)
- **🎨 Figurinhas**: Criação avançada (ttp, attp, sticker, toimg, qc, brat, rename)
- **🔍 Pesquisas**: 25+ comandos (pensador, nasa, clima, movie, imdb, lyrics, wikipedia, pinterest, etc.)
- **🎲 Aleatórios**: 25+ utilidades (gtts, traduzir, emoji, calcular, obesidade, tabela, destrava, encurtadores)
- **📊 Informativos**: Ping, atividade, rankings, níveis, status, infos do bot
- **💰 Economia Virtual**: Sistema de moedas (carteira, daily, transferir, apostar, minerar)
- **🪄 Logos**: Geração de logos personalizadas (fire, neon, shadow, thunder)
- **💎 Sistema Premium**: Usuários VIP com comandos exclusivos
- **🤖 IA & Automação**: SimSimi chat, identificação de músicas (Shazam)
- **💾 Sistema de Banco de Dados**: Persistência JSON com backups automáticos
- **🛡️ Anti-Delete**: Cache de mensagens deletadas
- **🔄 Reconexão Automática**: Com backoff exponencial
- **⏱️ Rate Limiting**: Anti-spam e cooldowns configuráveis
- **🎨 Console Melhorado**: Logs coloridos e organizados com separadores visuais

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
- **FFmpeg**: Necessário para criação de figurinhas/stickers (veja instruções abaixo)

### Instalando FFmpeg

O FFmpeg é necessário para converter imagens e vídeos em figurinhas.

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS (com Homebrew):**
```bash
brew install ffmpeg
```

**Windows:**
1. Baixe o FFmpeg em https://ffmpeg.org/download.html
2. Extraia e adicione ao PATH do sistema

**Verificar instalação:**
```bash
ffmpeg -version
```

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

### 🗡️ Comandos do Bot (Prefixo padrão: `!`)

O bot possui **mais de 100 comandos** organizados em categorias. Use `!menu` para ver todas as opções.

#### 📋 Menus Principais

- `!menu` - Menu principal com todas as categorias
- `!menudono` - Comandos exclusivos do dono
- `!menuadm` - Comandos de administração
- `!menupremium` - Comandos para usuários premium
- `!menudownloads` - Downloads de múltiplas plataformas
- `!figurinhas` - Criação de stickers personalizados
- `!pesquisas` - Pesquisas e buscas
- `!aleatorios` - Comandos utilitários diversos
- `!informativos` - Informações do bot e grupo
- `!brincadeiras` - Jogos e diversão
- `!menulogos` - Geração de logos
- `!menucoins` - Sistema de economia virtual

---

#### 👑 Comandos do Dono (Menudono)

Comandos exclusivos para o proprietário do bot:

- `!broadcast <texto>` - Enviar mensagem para todos os grupos
- `!block @user` - Bloquear usuário
- `!unblock @user` - Desbloquear usuário
- `!blacklist add/del @user` - Gerenciar blacklist global
- `!reiniciar` - Reiniciar o bot
- `!status` - Ver status do sistema
- `!listargrupos` - Listar todos os grupos
- `!entrargrupo <link>` - Entrar em grupo via link
- `!sairgrupo` - Sair do grupo atual
- `!premium add/del @user` - Gerenciar usuários premium
- `!rgtm` - Registrar grupo para transmissões
- `!tirardatm` - Remover grupo de transmissões

---

#### ⚜️ Comandos de Administração (Menuadm)

Para administradores de grupos:

**Moderação:**
- `!add <número>` - Adicionar membro ao grupo
- `!ban @user` / `!kick @user` - Remover membro
- `!promover @user` - Promover a administrador
- `!rebaixar @user` - Rebaixar de administrador
- `!mute @user` - Silenciar usuário
- `!desmute @user` - Dessilenciar usuário

**Configurações do Grupo:**
- `!nomegp <nome>` - Alterar nome do grupo
- `!descgp <texto>` - Alterar descrição
- `!fotogp` - Alterar foto (marque uma imagem)
- `!linkgp` - Obter link do grupo
- `!grupo` - Abrir/fechar grupo

**Proteção:**
- `!antilink <1/0>` - Ativar/desativar antilink
- `!antispam <1/0>` - Ativar/desativar antispam
- `!bemvindo <1/0>` - Ativar/desativar boas-vindas

**Outros:**
- `!totag` - Marcar todos (responda uma mensagem)

---

#### 📥 Downloads (Menudownloads)

Downloads automáticos de múltiplas plataformas:

**YouTube:**
- `!play <música>` - Download de áudio do YouTube
- `!playaudio <música>` - Alternativa de áudio
- `!playaudio2 <música>` - Outra opção de áudio
- `!playvid <vídeo>` - Download de vídeo
- `!playvideo2 <vídeo>` - Alternativa de vídeo
- `!playdoc <música>` - Download como documento
- `!playdoc2 <música>` - Alternativa documento
- `!ytshorts <link>` - Download de YouTube Shorts

**Redes Sociais:**
- `!tiktok <link>` - Download do TikTok sem marca d'água
- `!tiktokaudio <link>` - Apenas áudio do TikTok
- `!instagram <link>` - Posts/Reels/Stories do Instagram
- `!instaudio <link>` - Apenas áudio do Instagram
- `!instagram2 <link>` - Método alternativo Instagram
- `!instaudio2 <link>` - Método alternativo áudio
- `!threads <link>` - Download do Threads
- `!kwai <link>` - Download do Kwai
- `!spotify <link>` - Download do Spotify
- `!soundcloud <link>` - Download do SoundCloud

**Arquivos:**
- `!mediafire <link>` - Download do MediaFire
- `!googledrive <link>` - Download do Google Drive
- `!gerarlink` - Gerar link de mídia (marque arquivo)

**Outros:**
- `!shazam` - Identificar música (marque áudio)
- `!audiomeme` - Criar meme de áudio (marque áudio)
- `!multidl <link>` - Downloader universal

---

#### 🎨 Figurinhas (Stickers)

Criação e manipulação de stickers:

**✅ Totalmente Implementado:**
- `!sticker` - Imagem/vídeo para sticker (marque mídia ou envie com legenda)
- `!s` - Alias para sticker
- `!fsticker` - Alias para sticker
- `!figurinha` - Alias para sticker
- `!toimg` - Sticker para imagem (marque sticker)

**⚙️ Configurações e Limites:**
- **Imagens**: Máximo 5MB
- **Vídeos**: Máximo 10MB e 10 segundos
- **Formato de saída**: WebP (estático para imagens, animado para vídeos)
- **Tamanho**: Redimensionado automaticamente para 512x512px
- **Metadata**: Nome do pacote e autor configuráveis em `config.json`
- **Suporte**: Imagens (JPG, PNG), Vídeos (MP4, MOV), GIFs

**📋 Como usar:**
```
# Converter imagem para sticker
!sticker (envie com uma imagem)
!sticker (marque uma imagem com reply)

# Converter vídeo para sticker animado
!sticker (envie com um vídeo curto)
!sticker (marque um vídeo com reply)

# Converter sticker para imagem
!toimg (marque um sticker)
```

**🚧 Em Desenvolvimento:**
- `!ttp <texto>` - Texto para sticker estático
- `!attp <texto>` - Texto para sticker animado
- `!rename <nome/autor>` - Renomear sticker
- `!qc` - Quote para sticker (marque mensagem)
- `!brat <texto>` - Sticker estilo "brat"
- `!bratvideo <texto>` - Vídeo estilo "brat"

---

#### 🔍 Pesquisas

Busca em diversas plataformas e serviços:

**✅ Implementado:**
- `!googlesrc <termo>` - Busca no Google (via google-it)
- `!wikipedia <termo>` - Busca na Wikipedia PT-BR
- `!scep <cep>` - Consultar CEP (via ViaCEP)
- `!ddd <código>` - Consultar DDD (database brasileiro)

**🚧 Em Desenvolvimento:**

**Entretenimento:**
- `!pensador <termo>` - Frases e pensamentos
- `!movie <filme>` - Informações sobre filmes
- `!imdb <filme>` - Busca no IMDB
- `!imdbinfo <id>` - Detalhes do IMDB
- `!serie <nome>` - Informações sobre séries
- `!lyrics <música>` - Letras de músicas
- `!cinema` - Filmes em cartaz

**Informações:**
- `!nasa <data>` - Foto do dia da NASA
- `!clima <cidade>` - Previsão do tempo
- `!dicionario <palavra>` - Dicionário português
- `!receita <nome>` - Receitas culinárias
- `!signo <signo>` - Horóscopo do dia

**Compras & Apps:**
- `!playstore <app>` - Buscar app na Play Store
- `!aptoide <app>` - Buscar app no Aptoide
- `!amazon <produto>` - Buscar produto na Amazon
- `!mercadolivre <produto>` - Buscar no Mercado Livre
- `!celular <modelo>` - Informações de smartphone
- `!tekmods <nome>` - Buscar mods de jogos

**Buscadores:**
- `!pinterest <termo>` - Buscar imagens
- `!wallpaper <termo>` - Papéis de parede
- `!ytsearch <música>` - Buscar no YouTube
- `!scsearch <música>` - Buscar no SoundCloud
- `!applesearch <música>` - Buscar no Apple Music

**Consultas:**
- `!igsh <usuário>` - Info de usuário Instagram
- `!seemoji <emoji>` - Informações sobre emoji

---

#### 🎲 Aleatórios

Comandos utilitários diversos:

**✅ Implementado:**
- `!traduzir <texto>` - Traduzir texto (Google Translate para PT)
- `!calcular <expressão>` - Calculadora matemática
- `!obesidade <peso/altura>` - Calcular IMC com classificação
- `!geracpf` - Gerar CPF fictício válido
- `!tinyurl <link>` - Encurtar URL com TinyURL
- `!tabela` - Tabela de símbolos especiais
- `!destrava` - Mensagem anti-travamento
- `!destrava2` - Alias para destrava
- `!conselhos` - Conselho motivacional aleatório
- `!cantadas` - Cantada/pickup line aleatória

**🚧 Em Desenvolvimento:**

**Conversão & Formatação:**
- `!gtts <idioma+texto>` - Texto para voz (Google TTS)
- `!emoji <emoji/tipo>` - Obter emoji
- `!emojimix <emoji+emoji>` - Misturar emojis
- `!fazernick <texto>` - Gerar nick estilizado

**Entretenimento:**
- `!tagme` - Marcar a si mesmo
- `!conselhobiblico` - Conselho bíblico aleatório
- `!simi <texto>` - Conversar com SimSimi

**Utilitários:**
- `!perfil` - Ver seu perfil
- `!morechat <msg1/msg2>` - Comparar mensagens
- `!contardias` - Contar dias entre datas

**Encurtadores de Link:**
- `!cuttly <link>` - Encurtar com Cutt.ly
- `!bitly <link>` - Encurtar com Bitly

**Outros:**
- `!sip <ip>` - Consultar informações de IP

---

#### 📊 Informativos

Informações sobre o bot e o grupo:

**✅ Implementado:**
- `!ping` - Verificar latência do bot com cálculo em tempo real
- `!dados` - Estatísticas completas do bot (uptime, memória, CPU, sistema)
- `!atividade` - Ver tempo online do bot
- `!idiomas` - Lista de idiomas disponíveis para GTTS
- `!infodono` - Informações do dono do bot
- `!infobemvindo` - Informações sobre sistema de boas-vindas
- `!infoaluguel` - Informações sobre aluguel do bot
- `!infopremium` - Informações sobre sistema premium
- `!consultar_premium` - Consultar seu status premium
- `!infocmdprem` - Info sobre gerenciamento de comandos premium

**🚧 Em Desenvolvimento:**
- `!rankativo` - Ranking de atividade
- `!checkativo` - Verificar sua atividade
- `!ranklevel` - Ranking de níveis

---

#### ⛱️ Brincadeiras

Jogos e diversão:

**Medidores Aleatórios:**
- `!gay @user` - Medidor gay
- `!gado @user` - Medidor de gado
- `!ship @user1 @user2` - Compatibilidade de casal

**Jogos:**
- `!jogovelha @user` - Jogo da velha
- `!forca` - Jogo de forca
- `!quiz` - Quiz de perguntas

---

#### 🪄 Logos

Geração de logos personalizadas:

- `!logofire <texto>` - Logo com efeito de fogo
- `!logoneon <texto>` - Logo neon
- `!logoshadow <texto>` - Logo com sombra
- `!logothunder <texto>` - Logo com raios

---

#### 💰 Sistema de Coins

Economia virtual do bot:

- `!carteira` - Ver sua carteira
- `!daily` - Receber coins diários
- `!transferir @user <valor>` - Transferir coins
- `!apostar <valor>` - Apostar coins
- `!minerar` - Minerar coins

---

#### 💎 Comandos Premium

Para usuários com acesso premium (consulte `!infopremium`):

- Comandos exclusivos definidos pelo dono
- Acesso a recursos avançados
- Prioridade no processamento

---

### 🔑 Atalhos e Aliases

Muitos comandos possuem aliases (nomes alternativos):

- `!menu` = `!menuprincipal`
- `!ban` = `!kick`
- `!promover` = `!promote`
- `!rebaixar` = `!demote`
- `!figurinhas` = `!menufigurinhas`
- E muitos outros...

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

Alguns recursos requerem chaves de API externas. Configure as variáveis de ambiente conforme necessário:

#### Criar arquivo `.env` (opcional)

```bash
# APIs de Downloads
YOUTUBE_API_KEY=sua_chave_aqui
SPOTIFY_CLIENT_ID=sua_chave_aqui
SPOTIFY_CLIENT_SECRET=sua_chave_aqui

# APIs de Pesquisa
NASA_API_KEY=sua_chave_aqui
WEATHER_API_KEY=sua_chave_aqui
OMDB_API_KEY=sua_chave_aqui

# APIs de IA
OPENAI_API_KEY=sua_chave_aqui
SIMI_API_KEY=sua_chave_aqui

# Encurtadores de URL
BITLY_ACCESS_TOKEN=seu_token_aqui
CUTTLY_API_KEY=sua_chave_aqui
```

#### Downloads
- **YouTube**: Considere usar `ytdl-core` ou APIs como `y2mate`
- **TikTok**: APIs de scraping como `tiktok-scraper`
- **Instagram**: `instagram-scraper` ou APIs similares
- **Spotify**: [Spotify for Developers](https://developer.spotify.com/)

#### Pesquisas
- **NASA**: [NASA API](https://api.nasa.gov/)
- **Weather**: [OpenWeatherMap](https://openweathermap.org/api)
- **OMDB**: [OMDB API](http://www.omdbapi.com/)

#### IA
- **OpenAI GPT**: Registre-se em [OpenAI](https://openai.com) e obtenha uma API key
- **SimSimi**: [SimSimi API](https://workshop.simsimi.com/)
- **Geração de Imagens**: DALL-E, Midjourney, Stable Diffusion

#### Encurtadores
- **Bitly**: [Bitly Developers](https://dev.bitly.com/)
- **Cuttly**: [Cutt.ly API](https://cutt.ly/cuttly-api)
- **TinyURL**: Funciona sem API key (implementado)

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