# 🚀 دليل سريع: نشر Vendoor Scraper على Cloudflare Workers

## ⚡ الإعداد السريع (10 دقائق)

### الخطوة 1: تثبيت Wrangler CLI

```powershell
# على PowerShell
npm install -g wrangler

# التحقق من التثبيت
wrangler --version
```

### الخطوة 2: تسجيل الدخول

```powershell
wrangler login
# سيفتح متصفح للمصادقة - اضغط Allow
```

### الخطوة 3: الاشتراك في Workers Paid Plan

1. اذهب إلى [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Plans
3. اشترك في **Workers Paid** ($5/شهر)
4. فعّل **Browser Rendering API** (مضمن في الخطة)

### الخطوة 4: تثبيت المكتبات ونشر Worker

```powershell
# الانتقال لمجلد workers
cd workers

# تثبيت المكتبات
pnpm install

# نشر Worker
pnpm run deploy
```

**ستحصل على URL مثل:**
```
https://vendoor-scraper.YOUR_USERNAME.workers.dev
```

### الخطوة 5: إضافة Password كـ Secret

```powershell
wrangler secret put VENDOOR_PASSWORD
# أدخل: hema2004
```

### الخطوة 6: تحديث VendoorImport.tsx

افتح `client/pages/VendoorImport.tsx` وغير الـ API URL:

```typescript
// استبدل هذا السطر
const WORKER_URL = 'https://vendoor-scraper.YOUR_USERNAME.workers.dev';
```

### الخطوة 7: اختبار Worker

```powershell
# اختبار Health Check
curl https://vendoor-scraper.YOUR_USERNAME.workers.dev/health

# جلب صفحة واحدة
curl https://vendoor-scraper.YOUR_USERNAME.workers.dev/scrape-page?page=1
```

---

## 🎯 الاستخدام

### من التطبيق
1. افتح الموقع على Production
2. اذهب إلى `/intermediary/import`
3. اضغط **"جلب جميع المنتجات"**
4. انتظر 3-5 دقائق
5. ستظهر جميع المنتجات (615 منتج تقريباً)

### من API مباشرة

```javascript
// جلب جميع المنتجات
const response = await fetch('https://vendoor-scraper.YOUR_USERNAME.workers.dev/scrape-all');
const data = await response.json();
console.log(`تم جلب ${data.totalProducts} منتج`);

// جلب صفحة واحدة
const response = await fetch('https://vendoor-scraper.YOUR_USERNAME.workers.dev/scrape-page?page=5');
const data = await response.json();
console.log(`الصفحة 5: ${data.totalProducts} منتج`);
```

---

## 📊 مراقبة Worker

### عرض Logs مباشرة

```powershell
cd workers
wrangler tail
```

### مشاهدة الإحصائيات

1. اذهب إلى [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Overview
3. اضغط على `vendoor-scraper`
4. شاهد:
   - عدد الـ Requests
   - وقت التنفيذ
   - الأخطاء
   - استهلاك CPU

---

## 💰 التكلفة

### Workers Paid Plan
- **$5/شهر** للخطة
- **100,000 request/شهر** مجاناً
- **$0.50** لكل 1M request إضافي

### Browser Rendering API
- **2M browser requests/شهر** مجاناً
- **$1** لكل 1M request إضافي

### مثال على الاستخدام:
- 10 وسطاء × 1 مرة يومياً = 300 request/شهر
- **التكلفة: $5 فقط** (ضمن الحد المجاني)

---

## ⚡ تحديث Worker

```powershell
cd workers

# تعديل الكود في vendoor-scraper.js
# ثم نشر التحديث
pnpm run deploy
```

التحديث **فوري** - لا يحتاج إعادة تشغيل!

---

## 🔧 أوامر مفيدة

```powershell
# تطوير محلي
pnpm run dev
# يعمل على http://localhost:8787

# نشر
pnpm run deploy

# مشاهدة logs
pnpm run tail

# حذف worker
wrangler delete vendoor-scraper

# عرض معلومات worker
wrangler whoami
```

---

## ❌ حل المشاكل الشائعة

### مشكلة: "Browser Rendering API not enabled"

**الحل:**
1. تأكد من الاشتراك في Workers Paid Plan
2. اذهب إلى Workers & Pages → Browser Rendering
3. اضغط "Enable"

### مشكلة: "Authentication failed"

**الحل:**
```powershell
wrangler logout
wrangler login
```

### مشكلة: "Deploy failed"

**الحل:**
```powershell
# تحديث wrangler
npm update -g wrangler

# إعادة النشر
cd workers
pnpm run deploy --force
```

### مشكلة: "Timeout"

الـ scraping يأخذ وقت (3-5 دقائق للـ 41 صفحة).
Workers لديها حد أقصى **30 ثانية** للـ HTTP request.

**الحل:** استخدم **Durable Objects** أو **Queues** لـ Long-running tasks.

---

## 🎓 البديل المجاني للطلاب

إذا كنت طالب، استخدم **DigitalOcean** بدلاً من Cloudflare:
- $200 رصيد مجاني من GitHub Student Pack
- 33 شهر مجاناً ($6/شهر droplet)
- راجع `GITHUB_STUDENT_SOLUTIONS.md`

---

## 📚 روابط مفيدة

- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [Workers Docs](https://developers.cloudflare.com/workers/)
- [Browser Rendering Docs](https://developers.cloudflare.com/browser-rendering/)
- [Pricing Calculator](https://workers.cloudflare.com/pricing)

---

## ✅ الخلاصة

✅ سريع جداً (Edge Computing)
✅ موثوق (99.99% uptime)
✅ سهل النشر (أمر واحد)
✅ يدعم Puppeteer (Browser Rendering API)
⚠️ يحتاج اشتراك ($5/شهر)

**للطلاب:** استخدم DigitalOcean ($0 لمدة سنة كاملة)
**للشركات:** Cloudflare أفضل خيار

---

**🚀 ابدأ الآن!**
