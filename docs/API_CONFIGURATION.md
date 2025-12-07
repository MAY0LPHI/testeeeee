# ⚙️ Guia de Configuração - Variáveis de Ambiente e Chaves de API

Este documento explica como configurar variáveis de ambiente e chaves de API para habilitar funcionalidades avançadas do Hinokami Bot.

## 📋 Configuração Básica

### Arquivo `.env` (Opcional)

Crie um arquivo `.env` na raiz do projeto para armazenar suas variáveis de ambiente:

```env
# Configuração do Bot
BOT_NAME="Hinokami Bot"
OWNER_NUMBER="55XXXXXXXXXXX"
OWNER_NAME="MAY0LPHI"
PREFIX="!"

# Sticker Configuration
STICKER_PACK="YURI BOT"
STICKER_AUTHOR="MAY0LPHI"
STICKER_MAX_VIDEO_SECONDS=10
STICKER_MAX_FILE_SIZE_MB=5

# Modo Debug
DEBUG=false
```

### Arquivo `config.json`

A configuração principal está em `dados/src/config.json`. **Não commite este arquivo com dados sensíveis!**

```json
{
  "botName": "Hinokami Bot 🗡️🔥",
  "ownerNumber": "55XXXXXXXXXXX",
  "ownerName": "MAY0LPHI",
  "prefix": "!",
  "debug": false,
  "sticker": {
    "defaultPack": "YURI BOT",
    "defaultAuthor": "MAY0LPHI",
    "maxVideoSeconds": 10,
    "maxFileSizeMB": 5
  }
}
```

## 🔑 Chaves de API Opcionais

Os seguintes comandos requerem chaves de API externas. Configure-as conforme necessário.

### 🎵 YouTube Downloads (play, playvid, ytshorts)

**Opções:**

1. **YT-DLP** (Recomendado - Gratuito)
   ```bash
   # Instalar yt-dlp
   pip install yt-dlp
   ```
   
2. **YouTube API v3**
   - Obter em: https://console.cloud.google.com/
   - Variável: `YOUTUBE_API_KEY`

### 📱 TikTok Downloads

**Opções:**

1. **TikTok Scraper API** (Gratuito com limites)
   - URL: https://rapidapi.com/yi005/api/tiktok-scraper7
   - Variável: `TIKTOK_API_KEY`

2. **Downloader direto** (sem API)
   - Usar biblioteca como `tiktok-scraper`

### 📸 Instagram Downloads

**Opções:**

1. **Instagram Private API**
   - Biblioteca: `instagram-private-api`
   - Variáveis:
     ```env
     INSTAGRAM_USERNAME="seu_usuario"
     INSTAGRAM_PASSWORD="sua_senha"
     ```

2. **Instagram Scraper API**
   - URL: https://rapidapi.com/
   - Variável: `INSTAGRAM_API_KEY`

### 🎵 Spotify Downloads

**Spotify Web API:**
- Registre em: https://developer.spotify.com/dashboard/
- Variáveis:
  ```env
  SPOTIFY_CLIENT_ID="seu_client_id"
  SPOTIFY_CLIENT_SECRET="seu_client_secret"
  ```

### 🔍 Shazam (Identificação de Música)

**Opções:**

1. **ShazamAPI** (Gratuito)
   - Biblioteca: `shazam-api`
   - Sem necessidade de chave

2. **RapidAPI Shazam**
   - URL: https://rapidapi.com/apidojo/api/shazam
   - Variável: `SHAZAM_API_KEY`

### 🌐 Google Text-to-Speech (GTTS)

**Google Cloud TTS:**
- Registre em: https://cloud.google.com/text-to-speech
- Variável: `GOOGLE_APPLICATION_CREDENTIALS` (caminho para JSON de credenciais)

**Alternativa Gratuita:**
- Biblioteca: `google-tts-api` (já incluída, sem necessidade de chave)

### 🤖 SimSimi Chat

**SimSimi API:**
- Registre em: https://workshop.simsimi.com/
- Variável: `SIMSIMI_API_KEY`

### 🔗 Encurtadores de URL

**TinyURL** (Gratuito - sem chave necessária)
- Usar biblioteca `tinyurl`

**Bitly:**
- Registre em: https://bitly.com/
- Variável: `BITLY_ACCESS_TOKEN`

**Cuttly:**
- Registre em: https://cutt.ly/
- Variável: `CUTTLY_API_KEY`

### 🎬 IMDB / Movie API

**OMDB API:**
- Registre em: http://www.omdbapi.com/apikey.aspx
- Variável: `OMDB_API_KEY`

### 🌤️ Clima (Weather API)

**OpenWeatherMap:**
- Registre em: https://openweathermap.org/api
- Variável: `OPENWEATHER_API_KEY`

### 📰 NASA API

**NASA Open APIs:**
- Registre em: https://api.nasa.gov/
- Variável: `NASA_API_KEY`

### 📌 Pinterest Search

**Pinterest API:**
- Registre em: https://developers.pinterest.com/
- Variáveis:
  ```env
  PINTEREST_APP_ID="seu_app_id"
  PINTEREST_APP_SECRET="seu_app_secret"
  ```

### 🛒 Amazon/Mercado Livre

**Amazon Product Advertising API:**
- Registre em: https://affiliate-program.amazon.com/
- Variáveis:
  ```env
  AMAZON_ACCESS_KEY="sua_chave"
  AMAZON_SECRET_KEY="seu_segredo"
  AMAZON_ASSOCIATE_TAG="seu_tag"
  ```

**Mercado Livre API:**
- Registre em: https://developers.mercadolivre.com.br/
- Variável: `MERCADOLIVRE_API_KEY`

## 📁 Exemplo de `.env` Completo

```env
# ===== CONFIGURAÇÃO BÁSICA =====
BOT_NAME="Hinokami Bot"
OWNER_NUMBER="5511999999999"
OWNER_NAME="MAY0LPHI"
PREFIX="!"
DEBUG=false

# ===== STICKER =====
STICKER_PACK="YURI BOT"
STICKER_AUTHOR="MAY0LPHI"
STICKER_MAX_VIDEO_SECONDS=10
STICKER_MAX_FILE_SIZE_MB=5

# ===== DOWNLOADS =====
YOUTUBE_API_KEY="sua_chave_youtube"
TIKTOK_API_KEY="sua_chave_tiktok"
INSTAGRAM_USERNAME="seu_usuario_instagram"
INSTAGRAM_PASSWORD="sua_senha_instagram"
SPOTIFY_CLIENT_ID="seu_spotify_client_id"
SPOTIFY_CLIENT_SECRET="seu_spotify_client_secret"
SHAZAM_API_KEY="sua_chave_shazam"

# ===== TEXT & TRANSLATION =====
GOOGLE_APPLICATION_CREDENTIALS="./credentials/google-tts.json"
SIMSIMI_API_KEY="sua_chave_simsimi"

# ===== URL SHORTENERS =====
BITLY_ACCESS_TOKEN="seu_token_bitly"
CUTTLY_API_KEY="sua_chave_cuttly"

# ===== SEARCH & INFO =====
OMDB_API_KEY="sua_chave_omdb"
OPENWEATHER_API_KEY="sua_chave_openweather"
NASA_API_KEY="sua_chave_nasa"
PINTEREST_APP_ID="seu_pinterest_app_id"
PINTEREST_APP_SECRET="seu_pinterest_app_secret"

# ===== E-COMMERCE =====
AMAZON_ACCESS_KEY="sua_amazon_access_key"
AMAZON_SECRET_KEY="sua_amazon_secret_key"
AMAZON_ASSOCIATE_TAG="seu_amazon_tag"
MERCADOLIVRE_API_KEY="sua_chave_mercadolivre"
```

## 🔐 Segurança

### ⚠️ IMPORTANTE - Proteção de Credenciais

1. **NUNCA commite o arquivo `.env` no Git**
   ```bash
   # Adicione ao .gitignore
   echo ".env" >> .gitignore
   ```

2. **Use variáveis de ambiente em produção**
   - Em servidores (Heroku, Railway, etc.), configure as variáveis no painel
   - Não salve credenciais em arquivos de código

3. **Rotacione chaves periodicamente**
   - Mude suas chaves de API regularmente
   - Revogue chaves comprometidas imediatamente

4. **Limite permissões de API**
   - Configure permissões mínimas necessárias
   - Use chaves diferentes para desenvolvimento e produção

### 📝 Arquivo `.gitignore`

Certifique-se de que seu `.gitignore` inclui:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Credentials
credentials/
*.pem
*.key

# Session data
dados/session/

# Database (se contiver dados sensíveis)
dados/database/*.json
```

## 🚀 Carregando Variáveis de Ambiente

### Opção 1: Usando `dotenv`

```bash
npm install dotenv
```

```javascript
// No início de start.js ou index.js
import dotenv from 'dotenv';
dotenv.config();

// Acesse as variáveis
const apiKey = process.env.YOUTUBE_API_KEY;
```

### Opção 2: Sistema Operacional

**Linux/macOS:**
```bash
export YOUTUBE_API_KEY="sua_chave"
```

**Windows (CMD):**
```cmd
set YOUTUBE_API_KEY=sua_chave
```

**Windows (PowerShell):**
```powershell
$env:YOUTUBE_API_KEY="sua_chave"
```

## 📊 Status de Comandos

### ✅ Funcionam Sem API
- Menu principal e submenus
- Stickers (imagem/vídeo) - requer FFmpeg
- Calculadora
- Tabela de símbolos
- DDD
- Perfil
- Gay/Gado/Ship
- Sistema de coins
- Comandos administrativos

### ⚠️ Requerem APIs Externas
- Downloads (YouTube, TikTok, Instagram, etc.)
- Shazam
- SimSimi
- GTTS (voz)
- Encurtadores (Bitly, Cuttly)
- Pesquisas (IMDB, clima, NASA, etc.)
- Pinterest, Amazon, Mercado Livre

### 🔧 Em Desenvolvimento
- Jogos (jogo da velha, forca, quiz)
- Logos personalizadas
- QC (quote para sticker)
- Brat stickers

## 💡 Dicas

1. **Comece sem APIs**: O bot funciona parcialmente sem chaves de API
2. **Adicione gradualmente**: Configure APIs conforme necessário
3. **Use alternativas gratuitas**: Muitos serviços têm versões gratuitas
4. **Monitore limites**: APIs gratuitas geralmente têm limites de requisições
5. **Documente suas chaves**: Mantenha registro de onde obteve cada chave

## 📞 Suporte

Para dúvidas sobre configuração:
- Consulte a documentação oficial de cada API
- Verifique os exemplos em `dados/src/funcs/commands/`
- Entre em contato com o desenvolvedor

---

**Desenvolvido com ⚔️ por MAY0LPHI**
**Hinokami Bot - Respiração do Sol Ativada 🔥**
