# Manual Testing Guide - Sticker Handler

This guide provides step-by-step instructions for manually testing the sticker handler functionality.

## Prerequisites

Before testing, ensure:
- ✅ FFmpeg is installed (`ffmpeg -version`)
- ✅ Bot is running and connected to WhatsApp
- ✅ You have test media files ready

## Test Files Needed

Prepare the following test files:

### Static Images:
1. **JPEG Image** (< 5MB)
   - Example: Photo from camera, screenshot
   - File: `test-image.jpg`

2. **PNG Image with transparency** (< 5MB)
   - Example: Logo, icon with transparent background
   - File: `test-transparent.png`

### Animated Media:
3. **Short Video** (≤ 10 seconds, < 5MB)
   - Example: Short clip from phone
   - File: `test-video.mp4`

4. **GIF Animation** (≤ 10 seconds, < 5MB)
   - Example: Animated reaction GIF
   - File: `test-animation.gif`

### Edge Cases:
5. **Large Image** (> 5MB)
   - To test file size limit
   - File: `test-large.jpg`

6. **Long Video** (> 10 seconds)
   - To test duration limit
   - File: `test-long.mp4`

## Test Cases

### Test 1: Static Sticker from Direct Image (JPEG)
**Command:** `!sticker`

**Steps:**
1. In WhatsApp, send test-image.jpg to the bot
2. In the same message, include the text: `!sticker`
3. Observe the bot's response

**Expected Result:**
- ✅ Bot responds with "⏳ Criando figurinha... Por favor aguarde! 🔥"
- ✅ Bot sends back a sticker (WebP format, 512x512)
- ✅ Sticker has correct proportions
- ✅ Image is centered with transparent padding if needed

**Pass Criteria:**
- [ ] Processing message appears
- [ ] Sticker is created successfully
- [ ] Sticker displays correctly in WhatsApp
- [ ] No errors in console

---

### Test 2: Static Sticker from Quoted/Replied Image
**Command:** `!sticker`

**Steps:**
1. Send test-transparent.png to the bot (without command)
2. Reply/quote that image with the text: `!sticker`
3. Observe the bot's response

**Expected Result:**
- ✅ Bot processes the quoted image
- ✅ Creates sticker with transparency preserved
- ✅ Sticker is 512x512 with proper scaling

**Pass Criteria:**
- [ ] Quoted message is recognized
- [ ] Transparency is preserved
- [ ] Sticker created successfully
- [ ] No errors in console

---

### Test 3: Animated Sticker from Video
**Command:** `!sticker`

**Steps:**
1. Send test-video.mp4 to the bot with `!sticker`
2. Wait for processing (this may take longer)
3. Observe the bot's response

**Expected Result:**
- ✅ Bot processes the video
- ✅ Creates animated WebP sticker
- ✅ Animation loops properly
- ✅ Duration is limited to max 10 seconds

**Pass Criteria:**
- [ ] Processing message appears
- [ ] Animated sticker is created
- [ ] Animation plays smoothly in WhatsApp
- [ ] Sticker loops infinitely
- [ ] No audio is included
- [ ] No errors in console

---

### Test 4: Animated Sticker from GIF
**Command:** `!sticker`

**Steps:**
1. Send test-animation.gif to the bot with `!sticker`
2. Observe the bot's response

**Expected Result:**
- ✅ Bot converts GIF to animated WebP sticker
- ✅ Frame rate is preserved
- ✅ Animation quality is good

**Pass Criteria:**
- [ ] GIF is recognized as video type
- [ ] Animated sticker created
- [ ] Animation is smooth
- [ ] No errors in console

---

### Test 5: Sticker to Image Conversion
**Command:** `!toimg`

**Steps:**
1. Send a sticker to the bot (can use one created in previous tests)
2. Reply to that sticker with: `!toimg`
3. Observe the bot's response

**Expected Result:**
- ✅ Bot converts sticker to image
- ✅ Sends back as regular image (not sticker)
- ✅ Caption: "✅ Figurinha convertida para imagem! 🗡️🔥"

**Pass Criteria:**
- [ ] Conversion message appears
- [ ] Image is sent back
- [ ] Image displays correctly
- [ ] No errors in console

---

### Test 6: Sticker to GIF Conversion
**Command:** `!togif`

**Steps:**
1. Send an animated sticker to the bot
2. Reply to that sticker with: `!togif`
3. Observe the bot's response

**Expected Result:**
- ✅ Bot converts animated sticker to video/GIF
- ✅ Sends back with gifPlayback enabled
- ✅ Animation plays in WhatsApp

**Pass Criteria:**
- [ ] Conversion message appears
- [ ] Video/GIF is sent back
- [ ] Animation plays correctly
- [ ] No errors in console

---

### Test 7: Command Without Media
**Command:** `!sticker`

**Steps:**
1. Send just the text `!sticker` (no image or video)
2. Observe the bot's response

**Expected Result:**
- ✅ Bot sends helpful usage instructions:
  ```
  🎨 *Como criar figurinhas* 🗡️
  
  📌 *Figurinha estática (imagem):*
     • Envie uma imagem com !sticker
     • Ou responda uma imagem com !sticker
  
  📌 *Figurinha animada (vídeo/GIF):*
     • Envie um vídeo/GIF com !sticker
     • Ou responda um vídeo/GIF com !sticker
  
  ⚠️ *Limites:*
     • Vídeos: máximo 10 segundos
     • Tamanho: máximo 5MB
  
  🔥 _Respiração do Sol - Criação de Figurinhas!_
  ```

**Pass Criteria:**
- [ ] Usage instructions appear
- [ ] Message is clear and helpful
- [ ] No errors in console

---

### Test 8: File Size Limit - Image
**Command:** `!sticker`

**Steps:**
1. Send test-large.jpg (> 5MB) with `!sticker`
2. Observe the bot's response

**Expected Result:**
- ✅ Bot rejects the file
- ✅ Error message in Portuguese:
  ```
  ❌ Arquivo muito grande! Máximo: 5MB. Tamanho atual: X.XXmB
  
  💡 Tente comprimir o arquivo primeiro!
  ```

**Pass Criteria:**
- [ ] File is rejected (no sticker created)
- [ ] Clear error message shown
- [ ] File size is displayed
- [ ] Helpful suggestion provided
- [ ] No errors in console

---

### Test 9: Video Duration Limit
**Command:** `!sticker`

**Steps:**
1. Send test-long.mp4 (> 10 seconds) with `!sticker`
2. Observe the bot's response

**Expected Result:**
- ✅ Bot rejects the video
- ✅ Error message in Portuguese:
  ```
  ❌ Vídeo muito longo! Máximo permitido: 10 segundos. Duração atual: X.Xs
  
  💡 Tente um vídeo mais curto!
  ```

**Pass Criteria:**
- [ ] Video is rejected (no sticker created)
- [ ] Clear error message shown
- [ ] Duration is displayed
- [ ] Helpful suggestion provided
- [ ] No errors in console

---

### Test 10: Unsupported File Type
**Command:** `!sticker`

**Steps:**
1. Send an unsupported file (e.g., .pdf, .txt, .webm) with `!sticker`
2. Observe the bot's response

**Expected Result:**
- ✅ Bot rejects the file
- ✅ Error message:
  ```
  ❌ Formato não suportado: [mime-type]
  
  💡 Formatos aceitos:
  • Imagens: JPG, PNG, WebP
  • Vídeos: MP4, GIF
  ```

**Pass Criteria:**
- [ ] File is rejected
- [ ] Error message shows detected format
- [ ] Supported formats are listed
- [ ] No errors in console

---

## Console Output Verification

While testing, monitor the console for:

### Expected Console Output:
```
[HH:MM:SS]  COMANDO  !sticker de 5511999887766 (Grupo)
```

### No Error Output Should Appear Like:
- ❌ `Erro no handler de sticker:`
- ❌ `Erro ao converter imagem para WebP:`
- ❌ `Erro ao converter vídeo para WebP animado:`
- ❌ Unhandled promise rejections

### Good Debug Output:
- ℹ️ `Aviso: Não foi possível aplicar metadata ao sticker:` (non-critical warning is OK)

---

## Performance Benchmarks

Record approximate processing times:

| Media Type | File Size | Processing Time | Notes |
|------------|-----------|-----------------|-------|
| JPEG Image | 2MB | ~X seconds | |
| PNG Image | 1MB | ~X seconds | |
| MP4 Video (5s) | 3MB | ~X seconds | |
| GIF (3s) | 2MB | ~X seconds | |

Expected times:
- Static images: 2-5 seconds
- Animated videos: 5-15 seconds (depends on duration and quality)

---

## Sticker Quality Checklist

For each created sticker, verify:
- [ ] Resolution is 512x512 pixels
- [ ] Image quality is acceptable (no excessive compression artifacts)
- [ ] Colors are accurate
- [ ] Transparency is preserved (for PNGs)
- [ ] Animation is smooth (for videos/GIFs)
- [ ] No audio is present
- [ ] Sticker displays correctly as thumbnail
- [ ] Sticker can be sent to other users
- [ ] Metadata is visible in WhatsApp (pack name, author)

---

## Troubleshooting

### Common Issues:

**Issue:** Bot doesn't respond to `!sticker`
- Check if bot is running
- Verify command prefix in config (default: `!`)
- Check console for errors

**Issue:** "FFmpeg not found" error
- Install FFmpeg: `sudo apt-get install ffmpeg`
- Verify: `ffmpeg -version`

**Issue:** Processing takes too long
- Large files take longer
- Check server resources (CPU, memory)
- Consider reducing video quality before sending

**Issue:** Sticker quality is poor
- Check original media quality
- Compression settings in media.js can be adjusted
- For videos, consider pre-processing with lower bitrate

**Issue:** Metadata not showing in WhatsApp
- This is a non-critical feature
- Check console for metadata warnings
- May be a WhatsApp client version issue

---

## Test Summary Template

After completing all tests, fill out:

```
Test Date: _______________
Tester: _______________
Bot Version: _______________
FFmpeg Version: _______________

Test Results:
[ ] Test 1: Static Sticker (JPEG) - PASS / FAIL
[ ] Test 2: Static Sticker (Quoted) - PASS / FAIL
[ ] Test 3: Animated Sticker (Video) - PASS / FAIL
[ ] Test 4: Animated Sticker (GIF) - PASS / FAIL
[ ] Test 5: Sticker to Image - PASS / FAIL
[ ] Test 6: Sticker to GIF - PASS / FAIL
[ ] Test 7: No Media Error - PASS / FAIL
[ ] Test 8: File Size Limit - PASS / FAIL
[ ] Test 9: Duration Limit - PASS / FAIL
[ ] Test 10: Unsupported Type - PASS / FAIL

Overall Result: PASS / FAIL

Notes:
_______________________________________
_______________________________________
_______________________________________
```

---

## Success Criteria

The sticker handler is considered fully functional if:
- ✅ All 10 tests pass
- ✅ No console errors during testing
- ✅ Processing times are acceptable
- ✅ Sticker quality meets standards
- ✅ Error messages are clear and helpful
- ✅ Edge cases are handled gracefully

---

**Good luck with testing! 🗡️🔥**
*Respiração do Sol - Testes Ativados!*
