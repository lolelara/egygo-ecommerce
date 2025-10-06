# 🔧 دليل تثبيت وتشغيل Workers على جهازك

## الخطوة 1: تثبيت المكتبات

```powershell
cd workers
pnpm install
```

## الخطوة 2: اختبار Worker محلياً (اختياري)

```powershell
pnpm run dev
```

سيعمل على: http://localhost:8787

**اختبر الـ endpoints:**

```powershell
# Health check
curl http://localhost:8787/health

# جلب صفحة واحدة
curl http://localhost:8787/scrape-page?page=1

# جلب جميع المنتجات (سيأخذ 3-5 دقائق)
curl http://localhost:8787/scrape-all
```

## الخطوة 3: نشر Worker إلى Cloudflare

### أ. تسجيل الدخول

```powershell
wrangler login
```

سيفتح متصفح - اضغط **Allow**.

### ب. نشر Worker

```powershell
pnpm run deploy
```

**ستحصل على output مثل:**

```
✨  Built successfully, built project size is 156 KiB.
✨  Uploading...
✨  Uploaded vendoor-scraper (2.34 sec)
✨  Published vendoor-scraper (0.45 sec)
   https://vendoor-scraper.YOUR_USERNAME.workers.dev
✨  Success! Your worker is live at https://vendoor-scraper.YOUR_USERNAME.workers.dev
```

**احفظ هذا الـ URL!** ستحتاجه في الخطوة التالية.

### ج. إضافة Password كـ Secret

```powershell
wrangler secret put VENDOOR_PASSWORD
```

أدخل: `hema2004`

## الخطوة 4: تحديث ملف .env

أضف الـ Worker URL في ملف `.env` في جذر المشروع:

```env
# Vendoor Scraper - Cloudflare Worker URL
VITE_VENDOOR_WORKER_URL=https://vendoor-scraper.YOUR_USERNAME.workers.dev
```

**⚠️ مهم:** استبدل `YOUR_USERNAME` باسم المستخدم الخاص بك!

## الخطوة 5: إعادة تشغيل التطبيق

```powershell
# أوقف السيرفر الحالي (Ctrl+C)
# ثم أعد التشغيل
pnpm dev
```

## الخطوة 6: اختبار من التطبيق

1. افتح التطبيق: http://localhost:8080
2. اذهب إلى `/intermediary/import`
3. اضغط **"جلب جميع المنتجات"**
4. انتظر 3-5 دقائق
5. ستظهر جميع المنتجات!

---

## 📊 مراقبة Worker

### عرض Logs مباشرة

```powershell
cd workers
wrangler tail
```

اترك هذا Terminal مفتوحاً، وفي terminal آخر اختبر Worker:

```powershell
curl https://vendoor-scraper.YOUR_USERNAME.workers.dev/scrape-all
```

ستشاهد الـ logs تظهر مباشرة!

### مشاهدة من Dashboard

1. اذهب إلى [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages
3. اضغط على `vendoor-scraper`
4. شاهد الإحصائيات والـ logs

---

## 🔄 تحديث Worker

إذا قمت بتعديل الكود في `workers/vendoor-scraper.js`:

```powershell
cd workers
pnpm run deploy
```

التحديث **فوري** - لا يحتاج إعادة تشغيل!

---

## ⚠️ استكشاف الأخطاء

### خطأ: "wrangler: command not found"

**الحل:**

```powershell
npm install -g wrangler
```

### خطأ: "You must be authenticated"

**الحل:**

```powershell
wrangler logout
wrangler login
```

### خطأ: "Browser Rendering API not enabled"

**الحل:**

1. اذهب إلى [dash.cloudflare.com](https://dash.cloudflare.com)
2. Workers & Pages → Plans
3. اشترك في **Workers Paid Plan** ($5/شهر)
4. Workers & Pages → Browser Rendering
5. اضغط **Enable**

### خطأ: "VENDOOR_WORKER_URL is not defined"

**الحل:**

تأكد من إضافة المتغير في `.env`:

```env
VITE_VENDOOR_WORKER_URL=https://vendoor-scraper.YOUR_USERNAME.workers.dev
```

ثم أعد تشغيل التطبيق: `pnpm dev`

---

## 🎯 الخطوات التالية

✅ Worker يعمل الآن في Production!
✅ يمكن جلب المنتجات من أي مكان
✅ لا حاجة لـ localhost

**الآن يمكنك:**

1. ✅ نشر التطبيق على Netlify/Cloudflare Pages
2. ✅ استخدام ميزة استيراد المنتجات من Production
3. ✅ مشاركة الرابط مع الوسطاء

---

## 💰 التكلفة

- **$5/شهر** Workers Paid Plan
- **100,000 request/شهر** مجاناً
- **$0.50** لكل 1M request إضافي

**للطلاب:** استخدم DigitalOcean بدلاً منه ($200 مجاناً)
راجع: `GITHUB_STUDENT_SOLUTIONS.md`

---

## 📞 الدعم

إذا واجهت أي مشكلة:

1. تحقق من الـ logs: `wrangler tail`
2. راجع [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
3. راجع `CLOUDFLARE_WORKER_SETUP.md` للدليل الكامل

**🚀 بالتوفيق!**
