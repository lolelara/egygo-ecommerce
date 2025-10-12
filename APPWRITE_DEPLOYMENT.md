# 🚀 دليل النشر على Appwrite

## 📋 نظرة عامة

المشروع مصمم للعمل بالكامل على **Appwrite Cloud** بدون الحاجة لخوادم إضافية.

---

## ✅ الإعدادات الحالية

### **1. Frontend (React SPA)**
```bash
✅ يعمل بالكامل في المتصفح
✅ متصل بـ Appwrite مباشرة
✅ لا يحتاج خادم
✅ يمكن نشره على أي CDN
```

### **2. Appwrite Collections**
```bash
✅ products
✅ categories
✅ orders
✅ userPreferences
✅ affiliateStats
✅ affiliateActivities
✅ affiliateClicks
✅ notifications
✅ withdrawalRequests
✅ productViews
```

### **3. Appwrite Storage**
```bash
✅ product-images
✅ user-avatars
✅ documents
```

---

## 🔧 خيارات النشر

### **الخيار 1: Appwrite Cloud فقط** ⭐ (موصى به)

#### **المميزات:**
```
✅ مجاني حتى 75,000 مستخدم
✅ لا حاجة لخوادم إضافية
✅ سريع وآمن
✅ SSL مجاني
✅ Backups تلقائية
```

#### **الخطوات:**

**1. نشر Frontend:**
```bash
# اختر أحد الخيارات:

# أ) Appwrite Static Hosting (قريباً)
pnpm build
# رفع dist/ للـ Appwrite

# ب) Netlify (مجاني)
pnpm build
netlify deploy --prod

# ج) Vercel (مجاني)
pnpm build
vercel --prod

# د) GitHub Pages (مجاني)
pnpm build
# رفع dist/ للـ gh-pages

# هـ) Cloudflare Pages (مجاني)
pnpm build
# ربط مع GitHub
```

**2. إعداد Environment Variables:**
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
```

**3. تشغيل Scripts:**
```bash
# إنشاء Collections
pnpm run setup-collections

# تحديث Permissions
pnpm run update-permissions

# اختبار
pnpm run test-registration
```

---

### **الخيار 2: Appwrite + Functions** (للميزات المتقدمة)

#### **متى تحتاجه:**
```
✅ Web Scraping (Puppeteer)
✅ AI Enhancement (OpenAI)
✅ Image Optimization (Sharp)
✅ Translation (Google Translate)
✅ معالجة خلفية ثقيلة
```

#### **إنشاء Appwrite Functions:**

**1. Function للـ Scraping:**
```bash
# في Appwrite Console
Functions → Create Function

Name: scrape-product
Runtime: Node.js 18
Entrypoint: src/main.js
```

**كود Function:**
```javascript
// functions/scrape-product/src/main.js
import { Client, Databases } from 'node-appwrite';
import * as cheerio from 'cheerio';

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    const { url, markup = 20 } = JSON.parse(req.body);

    // Fetch page
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract data
    const product = {
      name: $('h1').first().text().trim(),
      description: $('.description').first().text().trim(),
      price: parseFloat($('.price').first().text().replace(/[^0-9.]/g, '')),
      images: [],
      // ... more extraction
    };

    // Apply markup
    product.price = product.price * (1 + markup / 100);

    return res.json({ success: true, product });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
```

**2. Function للـ AI Enhancement:**
```javascript
// functions/enhance-description/src/main.js
import OpenAI from 'openai';

export default async ({ req, res, log, error }) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const { description } = JSON.parse(req.body);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "أنت خبير في كتابة أوصاف منتجات احترافية بالعربية"
        },
        {
          role: "user",
          content: `حسّن هذا الوصف: ${description}`
        }
      ]
    });

    const enhanced = completion.choices[0].message.content;

    return res.json({ success: true, enhanced });
  } catch (err) {
    error(err.message);
    return res.json({ success: false, error: err.message }, 500);
  }
};
```

**3. استدعاء Functions من Frontend:**
```typescript
// في المكون
const handleScrape = async (url: string) => {
  const response = await fetch(
    'https://cloud.appwrite.io/v1/functions/[FUNCTION_ID]/executions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': PROJECT_ID
      },
      body: JSON.stringify({ url, markup: 20 })
    }
  );

  const result = await response.json();
  return result.response;
};
```

---

## 🔒 Environment Variables

### **للـ Frontend:**
```env
# .env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=67890abcdef
VITE_APPWRITE_DATABASE_ID=main_db
```

### **للـ Appwrite Functions:**
```env
# في Appwrite Console → Functions → Settings → Variables
OPENAI_API_KEY=sk-...
GOOGLE_TRANSLATE_KEY=...
APPWRITE_API_KEY=...
```

---

## 📦 خطوات النشر الكاملة

### **1. إعداد Appwrite:**
```bash
# تسجيل الدخول
https://cloud.appwrite.io

# إنشاء Project
Create Project → EgyGo

# إنشاء Database
Databases → Create Database → main_db

# تشغيل Scripts
pnpm run setup-collections
pnpm run update-permissions
```

### **2. بناء Frontend:**
```bash
# تثبيت Dependencies
pnpm install

# بناء للإنتاج
pnpm build

# النتيجة في dist/
```

### **3. نشر Frontend:**

**أ) Netlify:**
```bash
# تثبيت CLI
npm install -g netlify-cli

# تسجيل الدخول
netlify login

# نشر
netlify deploy --prod --dir=dist
```

**ب) Vercel:**
```bash
# تثبيت CLI
npm install -g vercel

# نشر
vercel --prod
```

**ج) Cloudflare Pages:**
```bash
# ربط GitHub repo
# Cloudflare Pages → Create Project
# Build command: pnpm build
# Build output: dist
```

### **4. إعداد Domain:**
```bash
# في Appwrite Console
Settings → Platforms → Add Platform
Type: Web
Name: EgyGo
Hostname: yourdomain.com
```

---

## 🎯 التوصيات

### **للبداية (MVP):**
```
✅ Appwrite Cloud (مجاني)
✅ Netlify/Vercel للـ Frontend (مجاني)
✅ بدون Functions (استخدم APIs خارجية مباشرة)
```

### **للتوسع:**
```
✅ Appwrite Pro ($15/شهر)
✅ Appwrite Functions للمعالجة الثقيلة
✅ CDN مخصص
✅ Custom Domain
```

---

## 🔍 اختبار قبل النشر

```bash
# 1. بناء محلي
pnpm build

# 2. معاينة
pnpm preview

# 3. اختبار APIs
pnpm run test-registration

# 4. فحص TypeScript
pnpm typecheck

# 5. اختبار الوحدات
pnpm test
```

---

## 📊 المراقبة

### **Appwrite Console:**
```
✅ Database → مراقبة الـ Collections
✅ Storage → مراقبة الملفات
✅ Functions → مراقبة التنفيذ
✅ Users → إدارة المستخدمين
```

### **Frontend Monitoring:**
```
✅ Netlify Analytics
✅ Vercel Analytics
✅ Google Analytics
✅ Sentry للأخطاء
```

---

## 🆘 استكشاف الأخطاء

### **مشكلة: CORS Error**
```javascript
// في Appwrite Console
Settings → Platforms → Add Platform
Hostname: localhost:5173 (للتطوير)
Hostname: yourdomain.com (للإنتاج)
```

### **مشكلة: Authentication Failed**
```javascript
// تحقق من
1. Project ID صحيح
2. API Key صحيح (للـ Functions)
3. Permissions صحيحة
```

### **مشكلة: Database Error**
```bash
# أعد تشغيل
pnpm run setup-collections
pnpm run update-permissions
```

---

## 📞 الدعم

```
📧 Appwrite: https://appwrite.io/discord
📚 Docs: https://appwrite.io/docs
💬 Community: https://github.com/appwrite/appwrite/discussions
```

---

## ✅ Checklist النشر

```
☐ إنشاء Appwrite Project
☐ إنشاء Database
☐ تشغيل setup-collections
☐ تحديث Permissions
☐ إعداد .env
☐ بناء Frontend (pnpm build)
☐ نشر على Netlify/Vercel
☐ إضافة Domain في Appwrite
☐ اختبار التسجيل
☐ اختبار الشراء
☐ اختبار الأدوار
☐ مراقبة الأخطاء
```

---

**🎉 جاهز للنشر!**
