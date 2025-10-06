# Vendoor Scraper Worker

Cloudflare Worker لجلب منتجات Ven-door باستخدام Puppeteer + Browser Rendering API.

## 🚀 البدء السريع

### 1. التثبيت

```bash
pnpm install
```

### 2. التطوير المحلي

```bash
pnpm run dev
# يعمل على: http://localhost:8787
```

### 3. النشر

```bash
# تسجيل الدخول (مرة واحدة فقط)
wrangler login

# نشر Worker
pnpm run deploy
```

## 📡 API Endpoints

### جلب جميع المنتجات
```
GET /scrape-all
```

### جلب صفحة واحدة
```
GET /scrape-page?page=1
```

### Health Check
```
GET /health
```

## 🔐 الأمان

أضف password كـ secret:

```bash
wrangler secret put VENDOOR_PASSWORD
# أدخل: hema2004
```

## 📊 المراقبة

```bash
# مشاهدة logs مباشرة
pnpm run tail
```

## 📖 الدليل الكامل

راجع `CLOUDFLARE_WORKER_SETUP.md` للتفاصيل الكاملة.
