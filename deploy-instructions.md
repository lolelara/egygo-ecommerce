# تعليمات النشر على egygo.me

## الطريقة 1: نشر يدوي عبر SSH

```bash
# اتصل بالسيرفر
ssh user@egygo.me

# انتقل لمجلد المشروع
cd /path/to/egygo

# اسحب آخر تحديثات
git pull origin main

# ثبت التبعيات
npm install

# ابني المشروع
npm run build

# أعد تشغيل السيرفر
pm2 restart egygo
# أو
systemctl restart nginx
```

## الطريقة 2: استخدام FTP/SFTP

1. قم ببناء المشروع محلياً:
```bash
npm run build
```

2. ارفع محتويات مجلد `dist/` إلى السيرفر في المسار:
```
/var/www/egygo.me/public_html/
```

3. تأكد من رفع مجلد `client/public/` كاملاً مع الأيقونات الجديدة

## الطريقة 3: استخدام GitHub Actions (موصى به)

قم بإنشاء ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to egygo.me

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          ARGS: "-rltgoDzvO --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET }}
```

## الطريقة 4: استخدام Netlify/Vercel (الأسهل)

### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Vercel:
```bash
npm install -g vercel
vercel --prod
```

## تحقق بعد النشر:

1. امسح كاش CDN (إن وجد):
```bash
curl -X PURGE https://egygo.me/favicon-48x48.png
```

2. امسح كاش المتصفح:
   - Ctrl + Shift + R

3. تحقق من الملفات:
   - https://egygo.me/favicon-48x48.png
   - https://egygo.me/og-image.jpg
   - https://egygo.me/manifest.json
   - https://egygo.me/logo.jpg

## الملفات الجديدة المطلوب رفعها:

```
client/public/
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon-48x48.png
├── favicon-generated.png
├── og-image.jpg
└── manifest.json
```

## إذا كنت تستخدم CDN (Cloudflare/CloudFront):

```bash
# Cloudflare - Purge Cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'

# أو
# من لوحة التحكم: Caching → Purge Everything
```
