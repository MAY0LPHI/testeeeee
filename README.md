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
- **FFmpeg**: Necessário para stickers animados (opcional)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/MAY0LPHI/testeeeee.git
cd testeeeee
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Instale o FFmpeg (Opcional - para stickers animados)

O FFmpeg é necessário para criar stickers animados a partir de vídeos/GIFs.

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
1. Baixe em: https://ffmpeg.org/download.html
2. Extraia e adicione ao PATH do sistema

**MacOS:**
```bash
brew install ffmpeg
```

**Verificar instalação:**
```bash
ffmpeg -version
```

### 4. Configure o bot

```bash
npm run config:install
```

Você será guiado por um assistente interativo que irá:
- Definir o nome do bot
- Configurar o número do dono (obrigatório)
- Escolher o prefixo de comandos (padrão: `!`)
- Ajustar configurações de comportamento
- Criar estrutura de banco de dados

### 5. Inicie o bot

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

#### 🎨 Figurinhas (Stickers) - TOTALMENTE FUNCIONAL! ✅

Criação e manipulação de stickers - implementação completa:

**Criar Stickers:**
- `!sticker` - Converter imagem/vídeo para sticker (marque uma mídia)
- `!fsticker` - Alias para sticker
- `!s` - Alias curto para sticker
- `!f` - Alias curto para fsticker

**Características:**
- ✅ **Imagens estáticas**: Converte para WebP 512x512
- ✅ **Vídeos/GIFs**: Converte para sticker animado (até 10s)
- ✅ **Aspect ratio**: Mantém proporção original
- ✅ **Metadata**: Pack="YURI BOT", Author="MAY0LPHI"
- ✅ **Limites**: Vídeos até 10s e 5MB

**Como usar:**
```
1. Envie uma foto com legenda: !sticker
2. Responda uma foto: !sticker
3. Responda um vídeo/GIF: !sticker
4. Envie vídeo com legenda: !sticker
```

**Texto para Sticker:**
- `!ttp <texto>` - Texto para sticker estático
- `!attp <texto>` - Texto para sticker animado (requer API)

**Converter Sticker:**
- `!toimg` - Converter sticker para imagem (marque um sticker)

**Renomear Sticker:**
- `!rename <pack>/<autor>` - Alterar metadata do sticker
  - Exemplo: `!rename Meu Pack/Meu Nome`

**Observações:**
- 📦 Stickers estáticos funcionam sem dependências extras
- 🎬 Stickers animados requerem FFmpeg instalado
- ⚡ Conversão rápida e eficiente
- 🎨 Metadata personalizada automática

---

#### 🔍 Pesquisas

Busca em diversas plataformas e serviços:

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
- `!googlesrc <termo>` - Busca no Google
- `!wikipedia <termo>` - Busca na Wikipedia
- `!pinterest <termo>` - Buscar imagens
- `!wallpaper <termo>` - Papéis de parede
- `!ytsearch <música>` - Buscar no YouTube
- `!scsearch <música>` - Buscar no SoundCloud
- `!applesearch <música>` - Buscar no Apple Music

**Consultas:**
- `!scep <cep>` - Consultar CEP
- `!ddd <código>` - Consultar DDD
- `!igsh <usuário>` - Info de usuário Instagram
- `!seemoji <emoji>` - Informações sobre emoji

---

#### 🎲 Aleatórios

Comandos utilitários diversos:

**Conversão & Formatação:**
- `!gtts <idioma+texto>` - Texto para voz (Google TTS)
- `!traduzir <texto>` - Traduzir texto
- `!emoji <emoji/tipo>` - Obter emoji
- `!emojimix <emoji+emoji>` - Misturar emojis
- `!fazernick <texto>` - Gerar nick estilizado

**Entretenimento:**
- `!tagme` - Marcar a si mesmo
- `!conselhobiblico` - Conselho bíblico aleatório
- `!cantadas` - Cantada aleatória
- `!conselhos` - Conselho aleatório
- `!simi <texto>` - Conversar com SimSimi

**Utilitários:**
- `!perfil` - Ver seu perfil
- `!calcular <expressão>` - Calculadora
- `!morechat <msg1/msg2>` - Comparar mensagens
- `!obesidade <peso/altura>` - Calcular IMC
- `!contardias` - Contar dias entre datas
- `!tabela` - Tabela de símbolos
- `!destrava` - Mensagem destrava 1
- `!destrava2` - Mensagem destrava 2
- `!gerarcpf` - Gerar CPF fictício

**Encurtadores de Link:**
- `!tinyurl <link>` - Encurtar com TinyURL
- `!cuttly <link>` - Encurtar com Cutt.ly
- `!bitly <link>` - Encurtar com Bitly

**Outros:**
- `!sip <ip>` - Consultar informações de IP

---

#### 📊 Informativos

Informações sobre o bot e o grupo:

**Status do Bot:**
- `!ping` - Verificar latência do bot
- `!atividade` - Ver atividade do bot
- `!dados` - Estatísticas do bot
- `!idiomas` - Idiomas disponíveis para GTTS

**Ranking & Níveis:**
- `!rankativo` - Ranking de atividade
- `!checkativo` - Verificar sua atividade
- `!ranklevel` - Ranking de níveis

**Informações:**
- `!infobemvindo` - Info sobre boas-vindas
- `!infodono` - Informações do dono
- `!infoaluguel` - Info sobre aluguel do bot
- `!infopremium` - Info sobre usuários premium
- `!infocmdprem` - Comandos premium
- `!consultar_premium` - Consultar status premium

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

Muitos comandos avançados requerem integração com APIs externas. O bot funciona sem elas, mas com funcionalidades limitadas.

#### 🔧 Como Configurar APIs

**Método 1: Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# YouTube Download APIs
YTDL_API_KEY=sua_chave_aqui
YTDL_API_URL=https://api.exemplo.com

# OpenAI GPT
OPENAI_API_KEY=sk-...

# Stickers de Texto
TTP_API_KEY=sua_chave
ATTP_API_URL=https://api.exemplo.com/attp

# Outros serviços
NASA_API_KEY=sua_chave_nasa
WEATHER_API_KEY=sua_chave_clima
SIMSIMI_API_KEY=sua_chave_simsimi
```

**Método 2: Arquivo de Credenciais**

Crie `dados/settings/creds.json`:

```json
{
  "apis": {
    "youtube": {
      "key": "sua_chave",
      "url": "https://api.exemplo.com"
    },
    "openai": {
      "key": "sk-...",
      "model": "gpt-3.5-turbo"
    },
    "tiktok": {
      "key": "sua_chave"
    }
  }
}
```

#### 📋 APIs Recomendadas

**Downloads:**
- **YouTube**: `ytdl-core` (biblioteca) ou APIs como y2mate, savefrom
- **TikTok**: APIs de scraping como `tiktok-scraper`
- **Instagram**: `instagram-scraper` ou APIs similares
- **Spotify**: `spotify-downloader` ou APIs de terceiros

**Inteligência Artificial:**
- **OpenAI GPT**: https://platform.openai.com/api-keys
- **SimSimi**: https://workshop.simsimi.com/

**Informações:**
- **NASA**: https://api.nasa.gov/ (gratuito)
- **OpenWeather**: https://openweathermap.org/api (gratuito)
- **OMDb (filmes)**: https://www.omdbapi.com/ (gratuito)

**Stickers:**
- **TTP/ATTP**: APIs como lolhuman.xyz, zacros.my.id

#### ⚠️ Comandos sem API

Se uma API não estiver configurada, o comando retornará uma mensagem informativa:

```
⚠️ Recurso X necessita de configuração.
Defina a variável de ambiente Y ou verifique ./settings/creds.json.
```

Isso permite que você configure apenas as APIs que realmente precisa!

## 🗂️ Estrutura do Projeto

```
testeeeee/
├── package.json                 # Dependências e scripts
├── README.md                    # Este arquivo
├── dados/
│   ├── database/                # Banco de dados JSON (criado automaticamente)
│   │   ├── grupos.json          # BD de grupos
│   │   ├── usuarios.json        # BD de usuários
│   │   └── config_db.json       # Configuração do BD
│   ├── midias/                  # Arquivos de mídia
│   ├── session/                 # Sessão do WhatsApp (auto-gerada)
│   └── src/                     # Código-fonte
│       ├── .scripts/            # Scripts de execução
│       │   ├── config.js        # Configuração interativa
│       │   ├── start.js         # Inicialização
│       │   └── update.js        # Atualização
│       ├── commands/            # ✨ Handlers de comandos específicos
│       │   └── sticker.js       # 🎨 Sistema de stickers completo
│       ├── funcs/               # Funções de comandos
│       │   ├── exports.js       # Handler principal de comandos
│       │   └── menuHandlers.js  # Handlers de menus
│       ├── menus/               # Sistema de menus
│       │   ├── index.js         # Exportador de menus
│       │   ├── menu.js          # Construtores de menus
│       │   └── allMenus.js      # Todos os menus disponíveis
│       ├── utils/               # Utilitários gerais
│       │   ├── colorLogger.js   # 🎨 Logs coloridos
│       │   ├── database.js      # Sistema de BD
│       │   ├── helpers.js       # Funções auxiliares
│       │   ├── media.js         # 🎬 Conversão de mídia (stickers)
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

## 🧪 Testando o Bot

### Testes Básicos

**1. Teste de Conexão:**
```bash
npm start
```
Verifique se o bot conecta e exibe o banner colorido.

**2. Teste de Comandos Básicos:**

No WhatsApp, envie:
- `!menu` - Ver menu principal
- `!ping` - Testar latência
- `!status` - Ver status do bot

### Testando Stickers (Funcionalidade Completa)

**Sticker de Imagem:**
1. Envie uma foto no grupo/privado
2. Com legenda: `!sticker`
3. Ou responda a foto com: `!sticker`
4. ✅ Deve retornar um sticker estático

**Sticker de Vídeo/GIF:**
1. Envie um vídeo curto (até 10s)
2. Com legenda: `!sticker`
3. ✅ Deve retornar um sticker animado
4. ⚠️ Requer FFmpeg instalado

**Converter Sticker para Imagem:**
1. Envie um sticker
2. Responda com: `!toimg`
3. ✅ Deve retornar a imagem PNG

**Renomear Sticker:**
1. Envie um sticker
2. Responda com: `!rename Meu Pack/Meu Nome`
3. ✅ Deve retornar sticker com nova metadata

**Texto para Sticker:**
1. Digite: `!ttp Olá Mundo`
2. ✅ Deve criar sticker com texto
3. (Para ATTP, configure API externa)

### Testando Outros Comandos

**Comandos de Admin (em grupos):**
- `!ban @usuario` - Banir membro (precisa ser admin)
- `!antilink on` - Ativar antilink

**Comandos de Diversão:**
- `!gay @usuario` - Medidor gay
- `!ship @user1 @user2` - Compatibilidade

**Comandos Informativos:**
- `!atividade` - Ver atividade do bot
- `!dados` - Estatísticas

### Logs e Debugging

O bot exibe logs coloridos no console:
- 🟦 **INFO**: Informações gerais
- 🟩 **SUCESSO**: Operações bem-sucedidas
- 🟨 **AVISO**: Alertas
- 🟥 **ERRO**: Erros encontrados
- 🟦 **COMANDO**: Comandos executados
- ⚪ **MENSAGEM**: Mensagens recebidas

**Ativar modo debug:**

Edite `dados/src/config.json`:
```json
{
  "debug": true
}
```

### Troubleshooting de Stickers

**Erro: "FFmpeg não está instalado"**
- Instale FFmpeg: `sudo apt-get install ffmpeg`
- Verifique: `ffmpeg -version`

**Erro: "Vídeo muito longo"**
- Limite: 10 segundos
- Corte o vídeo antes de enviar

**Erro: "Arquivo muito grande"**
- Limite: 5 MB para vídeos
- Comprima o arquivo antes

**Sticker sai distorcido:**
- ✅ Não deveria - o sistema mantém aspect ratio
- Se ocorrer, reporte como bug

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add: nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 TODO / Roadmap

### ✅ Concluído
- [x] ~~Geração de stickers com manipulação avançada~~ (Implementado!)
  - [x] Stickers estáticos (imagem para WebP)
  - [x] Stickers animados (vídeo/GIF para WebP)
  - [x] Conversão sticker para imagem
  - [x] Rename de metadata
  - [x] Suporte a aspect ratio
- [x] Sistema de menus completo
- [x] Logs coloridos e organizados
- [x] Sistema de comandos modular
- [x] Rate limiting e cooldowns
- [x] Sistema de permissões (Owner/Admin/Mod)
- [x] Anti-spam e anti-delete

### 🚧 Em Desenvolvimento
- [ ] Implementar integrações de download (YouTube, TikTok, Instagram)
- [ ] Adicionar suporte a OpenAI GPT
- [ ] Sistema de economia completo (loja virtual, transações)
- [ ] Jogos interativos funcionais (jogo da velha, forca, quiz)
- [ ] Sistema de traduções multi-idioma
- [ ] TTP/ATTP com APIs externas

### 🔮 Planejado
- [ ] Dashboard web para gerenciamento
- [ ] Suporte a comandos por áudio
- [ ] Sistema de backup automático na nuvem
- [ ] Métricas e analytics de uso
- [ ] Sistema de plugins
- [ ] API REST para integração externa

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