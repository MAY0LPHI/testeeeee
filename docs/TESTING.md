# 🧪 Guia de Testes - Hinokami Bot

Este guia fornece instruções detalhadas para testar todas as funcionalidades implementadas no bot.

## 📋 Pré-requisitos

Antes de iniciar os testes, certifique-se de que:

1. ✅ Node.js 20+ está instalado
2. ✅ FFmpeg está instalado no sistema
3. ✅ Dependências foram instaladas (`npm install`)
4. ✅ Bot está conectado ao WhatsApp
5. ✅ Número do dono está configurado em `config.json`

## 🎨 Testes de Stickers (Figurinhas)

### Teste 1: Sticker de Imagem Estática

**Passos:**
1. Envie uma imagem para o bot (qualquer formato: JPG, PNG, etc.)
2. Digite: `!sticker`
3. **Resultado Esperado:** Bot cria e envia um sticker 512x512

**Teste alternativo:**
1. Envie qualquer mensagem
2. Marque (reply) uma imagem anterior
3. Digite: `!sticker`
4. **Resultado Esperado:** Bot converte a imagem marcada em sticker

### Teste 2: Sticker de Vídeo Animado

**Passos:**
1. Envie um vídeo curto (< 10 segundos)
2. Digite: `!sticker`
3. **Resultado Esperado:** Bot cria sticker animado em WebP

**Teste de limite:**
1. Envie um vídeo longo (> 10 segundos)
2. Digite: `!sticker`
3. **Resultado Esperado:** Bot retorna erro informando que o vídeo é muito longo

### Teste 3: Sticker com Metadata Customizada

**Passos:**
1. Envie uma imagem
2. Digite: `!sticker MeuPack MeuAutor`
3. **Resultado Esperado:** Sticker com pack="MeuPack" e author="MeuAutor"

### Teste 4: Texto para Sticker (TTP)

**Passos:**
1. Digite: `!ttp Olá Mundo`
2. **Resultado Esperado:** Sticker com o texto "Olá Mundo"

### Teste 5: Texto Animado para Sticker (ATTP)

**Passos:**
1. Digite: `!attp Teste Animado`
2. **Resultado Esperado:** Sticker animado com o texto

### Teste 6: Converter Sticker em Imagem

**Passos:**
1. Marque um sticker anterior
2. Digite: `!toimg`
3. **Resultado Esperado:** Imagem PNG do sticker

### Teste 7: Renomear Sticker

**Passos:**
1. Marque um sticker
2. Digite: `!rename NovoNome NovoAutor`
3. **Resultado Esperado:** Novo sticker com metadata atualizada

## 📋 Testes de Menus

### Teste 8: Menu Principal

**Passos:**
1. Digite: `!menu`
2. **Resultado Esperado:** Lista completa de menus disponíveis

### Teste 9: Menus Específicos

**Teste cada menu:**
```
!menudono
!menuadm
!menupremium
!menudownloads
!figurinhas
!menupesquisas
!aleatorios
!informativos
!brincadeiras
!menulogos
!menucoins
```

**Resultado Esperado:** Cada menu mostra seus comandos específicos formatados

## ⚙️ Testes de Comandos Administrativos

### Teste 10: Alterar Nome do Grupo (apenas em grupos)

**Passos:**
1. Em um grupo onde o bot é admin
2. Digite: `!nomegp Novo Nome do Grupo`
3. **Resultado Esperado:** Nome do grupo alterado

### Teste 11: Obter Link do Grupo

**Passos:**
1. Em um grupo onde o bot é admin
2. Digite: `!linkgp`
3. **Resultado Esperado:** Link de convite do grupo

### Teste 12: Abrir/Fechar Grupo

**Passos:**
1. Digite: `!grupo fechar`
2. **Resultado Esperado:** Apenas admins podem enviar mensagens
3. Digite: `!grupo abrir`
4. **Resultado Esperado:** Todos podem enviar mensagens

### Teste 13: Totag (Marcar Todos)

**Passos:**
1. Marque uma mensagem
2. Digite: `!totag`
3. **Resultado Esperado:** Mensagem marcada com todos os membros mencionados

## 🎲 Testes de Comandos Aleatórios

### Teste 14: Calculadora

**Passos:**
1. Digite: `!calcular 2+2`
2. **Resultado Esperado:** Resultado: 4
3. Digite: `!calcular (10*5)+20`
4. **Resultado Esperado:** Resultado: 70

### Teste 15: Tradução

**Passos:**
1. Digite: `!traduzir Hello World`
2. **Resultado Esperado:** Tradução para português

### Teste 16: IMC (Obesidade)

**Passos:**
1. Digite: `!obesidade 70 1.75`
2. **Resultado Esperado:** Cálculo de IMC com categoria

### Teste 17: DDD

**Passos:**
1. Digite: `!ddd 11`
2. **Resultado Esperado:** São Paulo - SP

### Teste 18: Tabela de Símbolos

**Passos:**
1. Digite: `!tabela`
2. **Resultado Esperado:** Lista de símbolos úteis

### Teste 19: Fazer Nick Estilizado

**Passos:**
1. Digite: `!fazernick Meu Nome`
2. **Resultado Esperado:** Várias versões estilizadas do nome

### Teste 20: Perfil do Usuário

**Passos:**
1. Digite: `!perfil`
2. **Resultado Esperado:** Informações do usuário (nome, número, nível, XP, coins)

## 📊 Testes de Comandos Informativos

### Teste 21: Ping

**Passos:**
1. Digite: `!ping`
2. **Resultado Esperado:** Latência do bot em ms

### Teste 22: Dados do Bot

**Passos:**
1. Digite: `!dados`
2. **Resultado Esperado:** Uptime, uso de RAM, plataforma, versão Node

### Teste 23: Idiomas Disponíveis

**Passos:**
1. Digite: `!idiomas`
2. **Resultado Esperado:** Lista de idiomas para GTTS

### Teste 24: Info do Dono

**Passos:**
1. Digite: `!infodono`
2. **Resultado Esperado:** Número e nome do dono configurado

## 🎮 Testes de Comandos de Diversão

### Teste 25: Medidor Gay

**Passos:**
1. Digite: `!gay`
2. **Resultado Esperado:** Porcentagem aleatória
3. Marque um usuário e digite: `!gay`
4. **Resultado Esperado:** Porcentagem para o usuário marcado

### Teste 26: Medidor de Gado

**Passos:**
1. Digite: `!gado`
2. **Resultado Esperado:** Porcentagem aleatória

### Teste 27: Shipômetro

**Passos:**
1. Marque 2 usuários e digite: `!ship`
2. **Resultado Esperado:** Compatibilidade entre os usuários com corações

## 💰 Testes de Sistema de Coins

### Teste 28: Carteira

**Passos:**
1. Digite: `!carteira`
2. **Resultado Esperado:** Saldo de coins e gems

### Teste 29: Daily

**Passos:**
1. Digite: `!daily`
2. **Resultado Esperado:** Coins diários coletados

### Teste 30: Apostar

**Passos:**
1. Digite: `!apostar 100`
2. **Resultado Esperado:** Resultado da aposta (ganhou/perdeu)

### Teste 31: Minerar

**Passos:**
1. Digite: `!minerar`
2. **Resultado Esperado:** Coins minerados

## 👑 Testes de Comandos do Dono

**⚠️ Estes comandos só funcionam se você for o dono configurado!**

### Teste 32: Listar Grupos

**Passos:**
1. Digite: `!listargrupos`
2. **Resultado Esperado:** Lista de todos os grupos do bot

### Teste 33: Status do Sistema

**Passos:**
1. Digite: `!status`
2. **Resultado Esperado:** Uptime, RAM, status do bot

### Teste 34: Entrar em Grupo

**Passos:**
1. Digite: `!entrargrupo https://chat.whatsapp.com/CODIGO`
2. **Resultado Esperado:** Bot entra no grupo

## 🔍 Testes de Comandos de Pesquisa

**Nota:** A maioria dos comandos de pesquisa são stubs e retornam mensagens informando que requerem integração com APIs externas.

### Teste 35: Busca Genérica

**Teste alguns comandos:**
```
!pensador amor
!clima São Paulo
!movie Inception
!dicionario palavra
!signo áries
```

**Resultado Esperado:** Mensagem indicando que o comando requer integração com API

## 📥 Testes de Comandos de Download

**Nota:** Comandos de download são stubs e retornam mensagens informando que requerem integração com APIs.

### Teste 36: Download Genérico

**Teste alguns comandos:**
```
!play música teste
!tiktok https://tiktok.com/...
!instagram https://instagram.com/...
```

**Resultado Esperado:** Mensagem indicando que o comando requer integração com API

## 🐛 Testes de Erros

### Teste 37: Comando Inexistente

**Passos:**
1. Digite: `!comandoinexistente`
2. **Resultado Esperado:** Mensagem de comando não encontrado

### Teste 38: Comando sem Argumentos Obrigatórios

**Passos:**
1. Digite: `!traduzir` (sem texto)
2. **Resultado Esperado:** Mensagem de erro informando uso correto

### Teste 39: Comando de Admin sem Permissão

**Passos:**
1. Como usuário comum, digite: `!nomegp Teste`
2. **Resultado Esperado:** Mensagem informando que precisa ser admin

### Teste 40: Comando do Dono sem Permissão

**Passos:**
1. Como usuário comum, digite: `!listargrupos`
2. **Resultado Esperado:** Mensagem informando que é exclusivo do dono

## ✅ Checklist de Validação

Após executar todos os testes, verifique:

- [ ] Todos os menus são exibidos corretamente
- [ ] Stickers de imagem são criados com sucesso
- [ ] Stickers de vídeo são criados (se FFmpeg está instalado)
- [ ] Limites de vídeo são respeitados (máx. 10s)
- [ ] Comandos administrativos funcionam em grupos
- [ ] Comandos de cálculo retornam resultados corretos
- [ ] Comandos de diversão retornam porcentagens aleatórias
- [ ] Sistema de coins funciona (carteira, daily, etc.)
- [ ] Comandos do dono verificam permissões corretamente
- [ ] Mensagens de erro são claras e em PT-BR
- [ ] Console mostra logs coloridos com timestamps
- [ ] Rate limiting funciona (teste enviando muitos comandos)
- [ ] Cooldown funciona (teste repetindo o mesmo comando)

## 📝 Notas Importantes

1. **FFmpeg**: Comandos de sticker animado requerem FFmpeg instalado
2. **APIs Externas**: Downloads e pesquisas avançadas requerem chaves de API
3. **Permissões**: Teste comandos de admin em grupos onde o bot é admin
4. **Dono**: Configure seu número em `config.json` para testar comandos de dono

## 🚨 Problemas Comuns

### Sticker não funciona
- Verifique se FFmpeg está instalado: `ffmpeg -version`
- Verifique se as dependências estão instaladas: `npm install`

### Comandos não respondem
- Verifique se o prefixo está correto (padrão: `!`)
- Verifique se o bot está conectado
- Verifique os logs do console

### Erro "command not found"
- Verifique se o comando está escrito corretamente
- Use `!menu` para ver comandos disponíveis

### Bot não é admin
- Promova o bot a admin no grupo
- Comandos administrativos requerem que o bot seja admin

## 📊 Relatório de Testes

Após completar os testes, documente:

1. **Comandos testados:** X/40
2. **Comandos funcionando:** X/40
3. **Problemas encontrados:** [listar]
4. **Sugestões de melhoria:** [listar]

---

**Desenvolvido com ⚔️ por MAY0LPHI**
**Hinokami Bot - Respiração do Sol Ativada 🔥**
