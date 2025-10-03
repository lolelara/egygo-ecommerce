# 🌐 إضافة دومين مخصص مع شهادة SSL مجانية

## الطريقة 1: Appwrite Custom Domain (موصى بها)

### الخطوات:

1. **شراء دومين** (أو استخدام دومين موجود)
   - من Namecheap, GoDaddy, Cloudflare, أو أي مزود آخر
   - مثال: `egygo.com` أو `shop.egygo.com`

2. **إضافة الدومين في Appwrite Console**
   ```
   1. افتح: https://fra.cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/settings
   2. انتقل إلى: Settings → Domains
   3. اضغط: "Add Domain"
   4. أدخل الدومين: مثلاً `egygo.com`
   ```

3. **تحديث DNS Records**
   بعد إضافة الدومين، سيعطيك Appwrite سجلات DNS:
   
   ```
   Type: CNAME
   Name: @ (أو www)
   Value: <appwrite-value>.appwrite.network
   ```

4. **انتظر التفعيل**
   - عادة يستغرق 5-15 دقيقة
   - Appwrite سيُصدر شهادة SSL مجانية تلقائياً من Let's Encrypt

---

## الطريقة 2: Cloudflare (مجاني بالكامل + SSL)

### المميزات:
- ✅ دومين فرعي مجاني من Cloudflare Pages
- ✅ شهادة SSL مجانية تلقائياً
- ✅ CDN عالمي سريع
- ✅ حماية DDoS مجانية

### الخطوات:

#### الخطوة 1: Deploy على Cloudflare Pages

1. **افتح Cloudflare Dashboard**
   - اذهب إلى: https://dash.cloudflare.com/
   - سجّل دخول (أو أنشئ حساب مجاني)

2. **أنشئ مشروع جديد**
   ```
   1. Pages → Create a project
   2. Connect to Git → اختر GitHub
   3. اختر repository: lolelara/egygo-ecommerce
   4. اختر branch: main
   ```

3. **إعدادات البناء**
   ```
   Framework preset: Vite
   Build command: pnpm build
   Build output directory: dist
   Root directory: /
   ```

4. **Environment Variables**
   أضف نفس المتغيرات من ملف `.env`:
   ```
   VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
   VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
   VITE_APPWRITE_STORAGE_ID=product-images
   ```

5. **Deploy**
   - اضغط "Save and Deploy"
   - ستحصل على دومين مثل: `egygo.pages.dev`
   - شهادة SSL تلقائية ✅

#### الخطوة 2: دومين مخصص (اختياري)

إذا كان لديك دومين خاص:
```
1. في Cloudflare Pages → Custom domains
2. اضغط "Set up a custom domain"
3. أدخل الدومين: egygo.com
4. Cloudflare ستضيف DNS records تلقائياً
5. SSL مجاني تلقائياً ✅
```

---

## الطريقة 3: Netlify (بديل سهل)

### الخطوات:

1. **افتح Netlify**
   - https://app.netlify.com/

2. **Deploy من GitHub**
   ```
   1. Add new site → Import an existing project
   2. Connect to Git provider → GitHub
   3. اختر: lolelara/egygo-ecommerce
   ```

3. **إعدادات البناء**
   ```
   Build command: pnpm build
   Publish directory: dist
   ```

4. **Environment Variables**
   أضف نفس المتغيرات من `.env`

5. **دومين مجاني**
   - ستحصل على: `egygo.netlify.app`
   - أو دومين مخصص: Site settings → Domain management

---

## الطريقة 4: Vercel

### الخطوات:

1. **افتح Vercel**
   - https://vercel.com/new

2. **Import Repository**
   ```
   1. Import Git Repository
   2. اختر: lolelara/egygo-ecommerce
   ```

3. **إعدادات**
   ```
   Framework Preset: Vite
   Build Command: pnpm build
   Output Directory: dist
   ```

4. **Environment Variables**
   أضف المتغيرات

5. **Deploy**
   - دومين مجاني: `egygo.vercel.app`
   - SSL تلقائي ✅

---

## 🔧 تحديث Appwrite Platforms

**مهم جداً**: بعد إضافة الدومين الجديد، يجب تحديث Appwrite:

```bash
# في Appwrite Console
1. اذهب إلى: Settings → Platforms
2. اضغط "Add Platform" → Web
3. أدخل:
   - Name: Production Site
   - Hostname: egygo.com (أو الدومين الجديد)
```

أو عبر PowerShell:
```powershell
$headers = @{
    'Content-Type'='application/json'
    'X-Appwrite-Project'='68d8b9db00134c41e7c8'
    'X-Appwrite-Key'='standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5'
}

$body = @{
    name = "Production Site"
    type = "web"
    hostname = "egygo.com"  # دومينك الجديد
} | ConvertTo-Json

Invoke-RestMethod -Uri 'https://fra.cloud.appwrite.io/v1/projects/68d8b9db00134c41e7c8/platforms' -Method Post -Headers $headers -Body $body
```

---

## 📝 ملاحظات مهمة:

### لـ Cloudflare/Netlify/Vercel:
- ✅ SSL مجاني تلقائياً
- ✅ CDN عالمي
- ✅ دومين فرعي مجاني (.pages.dev, .netlify.app, .vercel.app)
- ✅ تحديثات تلقائية عند Push للـ GitHub

### لـ Appwrite Custom Domain:
- ✅ SSL مجاني من Let's Encrypt
- ✅ تحكم كامل
- ⚠️ يحتاج دومين خاص مسبقاً

---

## 🎯 التوصية:

**للبدء السريع**: استخدم **Cloudflare Pages**
- مجاني 100%
- SSL تلقائي
- سريع جداً
- دومين فرعي مجاني: `egygo.pages.dev`

**لدومين مخصص**: اشتري دومين + استخدم Cloudflare
- دومين من Namecheap (~$10/سنة)
- Cloudflare تدير DNS مجاناً
- SSL مجاني
