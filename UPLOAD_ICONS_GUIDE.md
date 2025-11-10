# 📤 دليل رفع الأيقونات على Appwrite

## 🎯 الهدف
رفع جميع أيقونات الموقع (favicon, og-image, manifest.json) على **Appwrite Storage** للوصول إليها من أي مكان.

---

## ⚙️ الإعداد الأولي

### 1. إنشاء ملف `.env`

انسخ محتوى `.env.template` إلى `.env`:

```bash
cp .env.template .env
```

### 2. الحصول على Appwrite API Key

1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اختر مشروعك (Project)
3. اذهب إلى **Settings** → **API Keys**
4. اضغط **Create API Key**
5. اسم الـ Key: `Upload Scripts`
6. **Scopes المطلوبة:**
   - ✅ `files.read`
   - ✅ `files.write`
   - ✅ `buckets.read`
   - ✅ `buckets.write`
7. انسخ الـ API Key وضعه في `.env`:

```env
APPWRITE_API_KEY=your_api_key_here
```

### 3. تحديث `.env` بمعلومات المشروع

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
APPWRITE_API_KEY=your_actual_api_key_here
```

---

## 🚀 رفع الأيقونات

### الطريقة 1: تشغيل السكريبت التلقائي

```bash
# تأكد من تثبيت node-appwrite
npm install

# شغل سكريبت الرفع
npm run upload-icons
# أو
npx tsx scripts/upload-icons-to-appwrite.ts
```

### الطريقة 2: رفع يدوي من Appwrite Console

1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اذهب إلى **Storage**
3. أنشئ Bucket جديد:
   - **Bucket ID:** `public-assets`
   - **Name:** `Public Assets`
   - **Permissions:** `Read: Any`
   - **Maximum File Size:** `5MB`
   - **Allowed File Extensions:** `png, jpg, jpeg, json`
4. ارفع الملفات التالية من `client/public/`:
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `favicon-48x48.png`
   - `apple-touch-icon.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`
   - `og-image.jpg`
   - `logo.jpg`
   - `manifest.json`

---

## 📝 تحديث الكود

بعد رفع الملفات، سيتم إنشاء ملف `client/lib/appwrite-assets.ts` تلقائياً يحتوي على:

```typescript
export const appwriteAssets = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'your_project_id',
  bucketId: 'public-assets',
  
  icons: {
    'favicon-32x32.png': 'https://cloud.appwrite.io/v1/storage/...',
    'og-image.jpg': 'https://cloud.appwrite.io/v1/storage/...',
    // ... باقي الأيقونات
  }
};
```

### تحديث `index.html`

استبدل الروابط المحلية بروابط Appwrite:

**قبل:**
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<meta property="og:image" content="/og-image.jpg" />
```

**بعد:**
```html
<link rel="icon" type="image/png" sizes="32x32" href="https://cloud.appwrite.io/v1/storage/buckets/public-assets/files/favicon-32x32.png/view?project=YOUR_PROJECT_ID" />
<meta property="og:image" content="https://cloud.appwrite.io/v1/storage/buckets/public-assets/files/og-image.jpg/view?project=YOUR_PROJECT_ID" />
```

**أو استخدم:**
```html
<script type="module">
  import { appwriteAssets } from '/lib/appwrite-assets.js';
  document.querySelector('link[rel="icon"]').href = appwriteAssets.icons['favicon-32x32.png'];
</script>
```

---

## 🔍 التحقق من النجاح

### 1. تحقق من Storage في Appwrite Console
- اذهب إلى **Storage** → **public-assets**
- يجب أن ترى جميع الملفات (9 ملفات)

### 2. تحقق من الروابط
افتح المتصفح وجرب:
```
https://cloud.appwrite.io/v1/storage/buckets/public-assets/files/favicon-32x32.png/view?project=YOUR_PROJECT_ID
```

### 3. تحقق من الموقع
```bash
# أعد تشغيل السيرفر
npm run dev

# افتح المتصفح وافحص:
- favicon في التبويب
- Console (F12) → لا توجد أخطاء 404
- Network → جميع الأيقونات تحمل بنجاح
```

---

## 🛠️ استكشاف الأخطاء

### خطأ: "Invalid API Key"
- تأكد من نسخ API Key بشكل صحيح في `.env`
- تأكد من أن API Key لديه الصلاحيات المطلوبة

### خطأ: "Bucket not found"
- قم بإنشاء bucket يدوياً من Console أو دع السكريبت ينشئه

### خطأ: "File not found"
- تأكد من وجود جميع الملفات في `client/public/`
- شغل `npm run generate-icons` أولاً

### الأيقونات لا تظهر
- امسح كاش المتصفح: Ctrl+Shift+R
- تأكد من أن Bucket له صلاحية `Read: Any`
- افتح الرابط المباشر في متصفح جديد للتحقق

---

## 📋 ملاحظات مهمة

1. **الأمان:** لا ترفع `.env` على Git أبداً
2. **الصلاحيات:** تأكد أن Bucket له `Read: Any` للوصول العام
3. **الحجم:** كل الأيقونات صغيرة (<1MB) ومناسبة
4. **CDN:** Appwrite يوفر CDN تلقائي للملفات
5. **التكلفة:** خطة Appwrite المجانية تسمح بـ 2GB storage

---

## 🎉 بعد الانتهاء

بعد رفع الأيقونات ونشر الموقع، ستظهر الأيقونات على:
- ✅ egygo.me (السيرفر المباشر)
- ✅ جميع الأجهزة والمتصفحات
- ✅ عند المشاركة على السوشيال ميديا
- ✅ في تطبيقات PWA

**الأيقونات الآن مستضافة بشكل دائم على Appwrite! 🚀**
