# 🚀 خطوات رفع المشروع على Appwrite

## ⚠️ المشكلة الحالية:
الصفحات الجديدة تعمل على localhost لكن تظهر 404 على:
```
https://egygo-ecommerce.appwrite.network/#/affiliate/links
https://egygo-ecommerce.appwrite.network/#/affiliate/analytics
https://egygo-ecommerce.appwrite.network/#/affiliate/creatives
```

**السبب:** النسخة القديمة لا تحتوي على الملفات الجديدة!

---

## ✅ الحل: رفع مجلد `dist` الجديد

### الخطوة 1: تأكد من بناء المشروع (تم بالفعل ✅)
```bash
pnpm build
```
**النتيجة:** مجلد `dist` يحتوي على أحدث نسخة

---

### الخطوة 2: رفع على Appwrite

#### الطريقة 1: Appwrite CLI (الأفضل)

```bash
# 1. تثبيت Appwrite CLI (مرة واحدة)
npm install -g appwrite-cli

# 2. تسجيل الدخول
appwrite login

# 3. رفع المشروع
appwrite deploy static
```

---

#### الطريقة 2: Appwrite Console (يدوي)

1. **اذهب إلى Appwrite Console:**
   ```
   https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8
   ```

2. **اذهب إلى "Storage" → "Buckets"**

3. **أو اذهب إلى قسم "Functions" → "Static Sites"**

4. **ابحث عن deployment الخاص بالموقع**

5. **اضغط "New Deployment"**

6. **ارفع محتويات مجلد `dist`:**
   - افتح مجلد `dist` في Windows Explorer
   - حدد **جميع الملفات** داخل `dist` (Ctrl+A)
   - اسحبها إلى نافذة Appwrite
   - انتظر الرفع (قد يستغرق دقائق)

7. **تأكد من رفع:**
   - `index.html` ✅
   - مجلد `assets/` ✅
   - أي ملفات أخرى

8. **اضغط "Deploy"**

---

#### الطريقة 3: GitHub Integration (الأسهل للمستقبل)

إذا كان Appwrite مربوط بـ GitHub:
1. رفع التغييرات على GitHub (تم بالفعل ✅)
2. Appwrite سيبني وينشر تلقائياً
3. انتظر 2-5 دقائق

**تحقق من:**
```
Appwrite Console → Deployments → Check latest build status
```

---

## 🔍 التحقق من النجاح:

بعد الرفع، جرب هذه الروابط:

### 1. الصفحة الرئيسية
```
✅ https://egygo-ecommerce.appwrite.network/#/
```

### 2. صفحات المسوق
```
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/dashboard
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/links
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/analytics
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/creatives
```

### 3. صفحة تفعيل المسوق
```
✅ https://egygo-ecommerce.appwrite.network/#/update-affiliate-prefs
```

### 4. صفحة Landing للمنتجات
```
✅ https://egygo-ecommerce.appwrite.network/#/l/TEST123
```

---

## 🐛 إذا استمرت المشكلة:

### 1. امسح الـ Cache
```bash
# في المتصفح:
Ctrl + Shift + Delete
→ احذف Cached images and files
→ أعد تحميل الصفحة (Ctrl + F5)
```

### 2. تحقق من ملف index.html
في مجلد `dist/index.html` يجب أن يحتوي على:
```html
<script type="module" crossorigin src="/assets/index-BcNR40HO.js"></script>
<link rel="stylesheet" crossorigin href="/assets/index-tUgVopeE.css">
```

### 3. تحقق من Appwrite Deployment Logs
```
Appwrite Console → Deployments → Latest → View Logs
```
ابحث عن أخطاء في البناء أو الرفع

---

## 📦 محتويات مجلد dist الحالية:

يجب أن تجد:
```
dist/
├── index.html              (2.12 KB)
├── assets/
│   ├── index-tUgVopeE.css  (84.53 KB)
│   └── index-BcNR40HO.js   (814.77 KB)
└── (أي ملفات static أخرى من public/)
```

---

## 🎯 البديل الأفضل: النشر على Netlify

إذا استمرت المشاكل مع Appwrite، جرب Netlify:

```bash
# 1. تثبيت Netlify CLI
npm install -g netlify-cli

# 2. تسجيل الدخول
netlify login

# 3. نشر
netlify deploy --prod --dir=dist
```

**المميزات:**
- ✅ روابط نظيفة بدون `#` (يدعم BrowserRouter)
- ✅ نشر أسرع
- ✅ SSL تلقائي
- ✅ CI/CD من GitHub
- ✅ لا مشاكل في الـ routing

---

## 🔄 الخطوات التالية:

### إذا نشرت على Appwrite:
1. ✅ ارفع `dist` كما هو موضح أعلاه
2. ✅ امسح Cache المتصفح
3. ✅ جرب الروابط مع `#` (HashRouter)
4. ✅ سجل دخول كمسوق وجرب الصفحات

### إذا أردت النشر على Netlify:
1. ✅ غير من HashRouter إلى BrowserRouter في `App.tsx`
2. ✅ بناء المشروع مرة أخرى
3. ✅ انشر على Netlify
4. ✅ جرب الروابط بدون `#`

---

## 💡 ملاحظات مهمة:

### الفرق بين localhost و Appwrite:
- **localhost**: يعمل مع BrowserRouter و HashRouter ✅
- **Appwrite**: يعمل بشكل موثوق مع HashRouter فقط ⚠️
- **Netlify/Vercel**: يعمل مع BrowserRouter و HashRouter ✅

### الحالة الحالية:
- المشروع يستخدم **HashRouter** ✅
- مبني بنجاح في مجلد `dist` ✅
- جاهز للرفع على Appwrite ✅
- يحتاج فقط رفع `dist` على Appwrite 📤

---

**اختر طريقة الرفع وابدأ! بعد الرفع ستعمل جميع الصفحات بشكل مثالي 🎉**

---

## 🆘 دعم إضافي:

إذا احتجت مساعدة في:
- رفع الملفات على Appwrite
- إعداد Netlify
- حل أي مشاكل أخرى

فقط أخبرني! 😊
