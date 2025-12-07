# 🧪 Manual Testing Guide - Sticker Feature

This document provides detailed manual testing procedures for the newly implemented sticker functionality.

## Prerequisites

Before testing, ensure:

1. ✅ Node.js 20+ installed: `node --version`
2. ✅ Dependencies installed: `npm install`
3. ✅ FFmpeg installed (for animated stickers): `ffmpeg -version`
4. ✅ Bot configured: `npm run config:install`
5. ✅ Bot running: `npm start`
6. ✅ WhatsApp connected (QR code scanned)

## Test Suite

### Test 1: Static Image to Sticker (Direct Send)

**Objective:** Verify that sending an image with the sticker command creates a static sticker.

**Steps:**
1. Open WhatsApp and send a message to the bot (private chat or group)
2. Attach an image (JPG, PNG, or WebP format)
3. Add caption: `!sticker`
4. Send the message

**Expected Results:**
- ✅ Bot responds with: "⏳ Processando seu sticker... Aguarde! 🎨"
- ✅ Within a few seconds, bot sends a sticker version of the image
- ✅ Sticker is 512x512 pixels with proper aspect ratio maintained
- ✅ Bot sends success message: "✅ Sticker criado com sucesso! 🎨"
- ✅ Console shows colored logs: `[INFO] STICKER Convertendo imagem para sticker...`

**Test Data:**
- Use various image formats: JPG, PNG, WebP
- Try different aspect ratios: square, portrait, landscape
- Try different sizes: small (100x100), large (2000x2000)

---

### Test 2: Static Image to Sticker (Reply/Quote)

**Objective:** Verify that replying to an image with the sticker command works.

**Steps:**
1. Someone sends an image in the chat (or send one yourself)
2. Reply/quote that image message
3. Type: `!sticker`
4. Send

**Expected Results:**
- ✅ Bot processes the quoted image, not the reply text
- ✅ Bot creates and sends sticker from the quoted image
- ✅ Same quality and format as Test 1

---

### Test 3: Animated Video to Sticker

**Objective:** Verify that short videos convert to animated stickers.

**Steps:**
1. Prepare a short video (< 10 seconds, < 5MB)
   - Recommended: 3-5 second MP4 or GIF
2. Send video with caption: `!sticker`
3. Wait for processing (may take longer than images)

**Expected Results:**
- ✅ Bot checks FFmpeg availability
- ✅ Bot validates video duration and file size
- ✅ Bot creates animated WebP sticker
- ✅ Sticker animates when sent
- ✅ Console shows: `[INFO] STICKER Convertendo vídeo para sticker animado...`

**Test Data:**
- MP4 video (3 seconds)
- GIF animation (5 seconds)
- MOV file (if available)

---

### Test 4: Error Handling - No Media

**Objective:** Verify graceful error when no media is provided.

**Steps:**
1. Send message: `!sticker` (without any image or video)
2. Or reply to a text message with `!sticker`

**Expected Results:**
- ✅ Bot responds with error message in PT-BR:
  ```
  ❌ Erro! Envie uma imagem ou vídeo, ou marque uma mensagem com mídia usando o comando.
  
  📝 Uso:
  • Envie imagem com legenda: `!sticker`
  • Marque uma imagem/vídeo e digite: `!sticker`
  ```
- ✅ No sticker created
- ✅ No errors in console

---

### Test 5: Error Handling - Video Too Long

**Objective:** Verify validation for video duration limit.

**Steps:**
1. Prepare a video longer than 10 seconds (e.g., 15 seconds)
2. Send with caption: `!sticker`

**Expected Results:**
- ✅ Bot responds with error:
  ```
  ❌ Vídeo muito longo! Duração máxima: 10 segundos. Seu vídeo tem 15.0 segundos.
  
  💡 Envie um vídeo de até 10 segundos.
  ```
- ✅ No sticker created
- ✅ Error logged in console

---

### Test 6: Error Handling - File Too Large

**Objective:** Verify validation for file size limit.

**Steps:**
1. Prepare a video larger than 5MB
2. Send with caption: `!sticker`

**Expected Results:**
- ✅ Bot responds with error:
  ```
  ❌ Arquivo muito grande!
  
  Tamanho máximo: 5MB
  Seu arquivo: X.XXmb
  
  💡 Envie um vídeo menor ou mais curto.
  ```
- ✅ No sticker created

---

### Test 7: FFmpeg Not Installed

**Objective:** Verify helpful error when FFmpeg is missing (animated stickers only).

**Steps:**
1. Temporarily rename or remove FFmpeg from PATH
2. Send a video with caption: `!sticker`

**Expected Results:**
- ✅ Bot responds with installation instructions:
  ```
  ❌ FFmpeg não encontrado!
  
  Para criar stickers animados, é necessário instalar o FFmpeg.
  
  📦 Instalação:
  • Ubuntu/Debian: `sudo apt install ffmpeg`
  • Windows: Baixe em https://ffmpeg.org
  • macOS: `brew install ffmpeg`
  ```
- ✅ Image stickers still work without FFmpeg

---

### Test 8: Menu Navigation

**Objective:** Verify all new menus are accessible.

**Steps:**
1. Send: `!menu`
2. Verify "🎨 !efeitosimg" and "🔧 !outros" appear in list
3. Send: `!figurinhas`
4. Verify sticker command is listed
5. Send: `!efeitosimg`
6. Verify image effects menu displays
7. Send: `!outros`
8. Verify outros commands menu displays

**Expected Results:**
- ✅ Main menu shows 13 categories including new ones
- ✅ Figurinhas menu lists sticker commands
- ✅ Efeitosimg menu displays 8 image effect commands
- ✅ Outros menu displays 8 utility commands
- ✅ All menus use consistent PT-BR formatting

---

### Test 9: Console Logging

**Objective:** Verify colored console logs are working.

**Steps:**
1. While bot is running, execute various commands
2. Observe console output

**Expected Results:**
- ✅ Startup shows:
  - Banner in cyan
  - `[INIT]` section with config info
  - `[CARREGANDO]` section with command stats
  - `BOT PRONTO E OPERACIONAL!` message
- ✅ Commands show:
  - `[COMANDO]` in cyan background
  - Timestamp in gray
  - User number in yellow
  - Location (Grupo/Privado) in magenta/blue
- ✅ Sticker processing shows:
  - `[INFO] STICKER` messages
  - Green success messages
  - Red error messages (if errors occur)

---

### Test 10: Concurrent Requests

**Objective:** Verify bot handles multiple sticker requests simultaneously.

**Steps:**
1. In a group, have 2-3 users send sticker commands at the same time
2. Or send multiple sticker commands quickly in succession

**Expected Results:**
- ✅ Bot processes each request independently
- ✅ Temp files don't conflict (different timestamps)
- ✅ Each user receives their correct sticker
- ✅ No crashes or errors

---

## Edge Cases

### Edge Case 1: Very Small Image
- Send a 10x10 pixel image
- **Expected:** Sticker created, upscaled to 512x512 (may be pixelated)

### Edge Case 2: Very Large Image
- Send a 4000x4000 pixel image
- **Expected:** Sticker created, downscaled to 512x512

### Edge Case 3: Extreme Aspect Ratio
- Send a 100x1000 (1:10 ratio) image
- **Expected:** Sticker created, centered with transparent padding

### Edge Case 4: Corrupted File
- Send a corrupted or invalid image file
- **Expected:** Error message about invalid file

---

## Performance Benchmarks

Track these metrics during testing:

| Operation | Expected Time |
|-----------|--------------|
| Small image (< 100KB) | 1-2 seconds |
| Large image (> 1MB) | 2-4 seconds |
| Short video (3s) | 5-10 seconds |
| Long video (10s) | 10-20 seconds |

---

## Regression Testing

After any code changes, re-run:
- Test 1 (Basic static sticker)
- Test 3 (Basic animated sticker)
- Test 4 (Error handling)
- Test 8 (Menu navigation)

---

## Troubleshooting Test Failures

### Sticker Not Created
1. Check console for error messages
2. Verify media is valid format
3. Check temp directory permissions: `/tmp/stickers/`
4. Verify Jimp is installed: `npm list jimp`

### Animated Stickers Fail
1. Verify FFmpeg installed: `ffmpeg -version`
2. Check FFmpeg is in PATH
3. Verify fluent-ffmpeg installed: `npm list fluent-ffmpeg`

### Console Logs Not Colored
1. Terminal may not support colors
2. Verify chalk installed: `npm list chalk`
3. Try different terminal emulator

---

## Test Report Template

```
Test Date: ______________
Tester: _________________
Bot Version: ____________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Static Image (Direct) | ☐ Pass ☐ Fail | |
| 2 | Static Image (Reply) | ☐ Pass ☐ Fail | |
| 3 | Animated Video | ☐ Pass ☐ Fail | |
| 4 | No Media Error | ☐ Pass ☐ Fail | |
| 5 | Video Too Long | ☐ Pass ☐ Fail | |
| 6 | File Too Large | ☐ Pass ☐ Fail | |
| 7 | FFmpeg Missing | ☐ Pass ☐ Fail | |
| 8 | Menu Navigation | ☐ Pass ☐ Fail | |
| 9 | Console Logging | ☐ Pass ☐ Fail | |
| 10 | Concurrent Requests | ☐ Pass ☐ Fail | |

Overall Status: ☐ All Pass ☐ Some Fail

Issues Found:
_________________________________________________
_________________________________________________
```

---

## Success Criteria

All tests should pass with:
- ✅ No crashes or uncaught exceptions
- ✅ User-friendly error messages in PT-BR
- ✅ Proper temp file cleanup
- ✅ Colored console logs
- ✅ Stickers meet WhatsApp specifications (512x512 WebP)
- ✅ Response times within acceptable ranges

---

## Additional Notes

- FFmpeg installation is optional but highly recommended
- Tests should be run on fresh bot instance
- Clear temp directory between test runs if needed: `rm -rf /tmp/stickers/*`
- Monitor system resources during video processing
