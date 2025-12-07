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
- **FFmpeg**: Necessário para criar stickers animados (opcional para stickers estáticos)

### Instalando FFmpeg

O FFmpeg é necessário para converter vídeos em stickers animados.

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
1. Baixe o FFmpeg de https://ffmpeg.org/download.html
2. Extraia o arquivo ZIP
3. Adicione a pasta `bin` ao PATH do sistema
4. Reinicie o terminal

**macOS:**
```bash
brew install ffmpeg
```

**Verificar instalação:**
```bash
ffmpeg -version
```

Se o FFmpeg não estiver instalado, o bot funcionará normalmente para stickers estáticos (imagens), mas exibirá uma mensagem de erro ao tentar criar stickers animados (vídeos/GIFs).

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

Criação e manipulação de stickers com suporte completo a imagens estáticas e vídeos animados:

**Criação de Stickers:**
- `!sticker` - Converte imagem ou vídeo em sticker (marque mídia ou envie com legenda)
- `!fsticker` - Alternativa para criar sticker (marque foto)
- `!ttp <texto>` - Texto para sticker estático
- `!attp <texto>` - Texto para sticker animado

**Conversão e Manipulação:**
- `!toimg` - Sticker para imagem (marque sticker)
- `!rename <nome/autor>` - Renomear sticker
- `!qc` - Quote para sticker (marque mensagem)
- `!brat <texto>` - Sticker estilo "brat"
- `!bratvideo <texto>` - Vídeo estilo "brat"

**Recursos do Comando Sticker:**
- ✅ Suporta imagens (JPG, PNG, WebP) - Convertidas para 512x512
- ✅ Suporta vídeos curtos (MP4, GIF) - Máximo 10 segundos
- ✅ Limite de tamanho: 5MB para vídeos
- ✅ Mantém proporção da imagem original
- ✅ Adiciona metadata automática (pack: "YURI BOT", author: "MAY0LPHI")
- ✅ Mensagens de erro amigáveis em português

**Como usar:**
1. Envie uma imagem com a legenda `!sticker`
2. Ou marque uma imagem/vídeo e digite `!sticker`
3. Aguarde o processamento (vídeos podem levar alguns segundos)
4. Receba seu sticker personalizado! 🎨

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


## 🧪 Testando o Bot

### Testando Comandos de Sticker

Após iniciar o bot, você pode testar a funcionalidade de stickers:

**Teste 1: Imagem para Sticker Estático**
1. Envie uma imagem para o bot em uma conversa privada ou grupo
2. Adicione a legenda `!sticker` à imagem
3. Aguarde alguns segundos
4. O bot deve responder com um sticker da imagem

**Teste 2: Reply/Marcar Imagem**
1. Em uma conversa, alguém envia uma imagem
2. Responda/marque essa imagem e digite `!sticker`
3. O bot deve converter a imagem marcada em sticker

**Teste 3: Vídeo/GIF para Sticker Animado**
1. Envie um vídeo curto (menos de 10 segundos) ou GIF
2. Adicione a legenda `!sticker` ou marque o vídeo e digite `!sticker`
3. O bot deve converter em um sticker animado
4. **Nota:** Certifique-se de que o FFmpeg está instalado

**Teste 4: Validações**
- Tente enviar `!sticker` sem mídia → Deve retornar mensagem de erro amigável
- Tente com vídeo maior que 10 segundos → Deve avisar sobre duração máxima
- Tente com arquivo maior que 5MB → Deve avisar sobre tamanho máximo

**Teste 5: Menus**
1. Digite `!menu` → Deve exibir menu principal com todas as categorias
2. Digite `!figurinhas` → Deve exibir menu de comandos de stickers
3. Digite `!efeitosimg` → Deve exibir menu de efeitos de imagem
4. Digite `!outros` → Deve exibir menu de outros comandos

### Logs Coloridos

Ao executar o bot, você deve ver logs coloridos no console:
- 🔵 **[INFO]** - Informações gerais
- 🟢 **[SUCESSO]** - Operações bem-sucedidas
- 🟡 **[AVISO]** - Avisos importantes
- 🔴 **[ERRO]** - Erros que ocorreram
- 🟣 **[COMANDO]** - Comandos executados pelos usuários
- ⚪ **[DEBUG]** - Informações de depuração (quando debug=true)

---

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

### Stickers não funcionam

**Imagens não convertem:**
1. Verifique se a imagem está em formato válido (JPG, PNG, WebP)
2. Verifique os logs para mensagens de erro específicas
3. Certifique-se de que Jimp está instalado: `npm install jimp`

**Vídeos não convertem (stickers animados):**
1. Verifique se FFmpeg está instalado: `ffmpeg -version`
2. Se não estiver, instale conforme instruções na seção Requisitos
3. Verifique se o vídeo tem menos de 10 segundos
4. Verifique se o arquivo tem menos de 5MB
5. Formatos suportados: MP4, GIF, MOV

**Mensagem "FFmpeg não encontrado":**
- Instale o FFmpeg conforme instruções na seção de Requisitos
- No Windows, certifique-se de adicionar FFmpeg ao PATH
- Reinicie o terminal/prompt após instalar

**Sticker fica pixelado:**
- Use imagens de alta qualidade (mínimo 512x512 recomendado)
- Evite imagens muito pequenas que serão ampliadas

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add: nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 TODO / Roadmap

- [x] ✅ Geração de stickers com manipulação avançada (imagens e vídeos)
- [x] ✅ Sistema de menus completo com todas as categorias
- [x] ✅ Logs coloridos e organizados no console
- [ ] Implementar integrações de download (YouTube, TikTok, Instagram)
- [ ] Adicionar suporte a OpenAI GPT
- [ ] Sistema de economia completo (loja virtual, transações)
- [ ] Jogos interativos funcionais (jogo da velha, forca, quiz)
- [ ] Implementar comandos de efeitos de imagem (efeitosimg menu)
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