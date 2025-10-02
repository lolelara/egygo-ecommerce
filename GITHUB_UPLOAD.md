# دليل رفع المشروع إلى GitHub

دليل خطوة بخطوة لرفع مشروع شوب كو إلى مستودع GitHub الخاص بك.

## 📋 المتطلبات

- حساب GitHub
- Git مثبت على جهازك
- Terminal/Command Line access

## 🚀 خطوات الرفع

### 1. تحضير المستودع على GitHub

1. **اذهب إلى**: https://github.com/lolelara/egygo
2. **تأكد من أن المستودع فارغ** أو قم بإنشاء مستودع جديد
3. **انسخ رابط المستودع**: `https://github.com/lolelara/egygo.git`

### 2. تحضير المشروع محلياً

افتح Terminal في مجلد المشروع وقم بتشغيل الأوامر التالية:

```bash
# تهيئة Git repository
git init

# إضافة remote origin
git remote add origin https://github.com/lolelara/egygo.git

# إضافة جميع الملفات
git add .

# إنشاء أول commit
git commit -m "feat: إضافة المشروع الكامل لمتجر شوب كو

- متجر إلكتروني شامل باللغة العربية
- برنامج شراكة متقدم مع تتبع العمولات
- لوحة تحكم إدارية كاملة
- نظام مصادقة آمن مع الأدوار
- واجهة مستخدم responsive مع دعم RTL
- قاعدة بيانات Prisma مع PostgreSQL
- Netlify Functions للـ API
- تقنيات حديثة: React 18, TypeScript, Tailwind CSS"

# رفع الكود إلى GitHub
git branch -M main
git push -u origin main
```

### 3. التحقق من الرفع

1. **اذهب إلى**: https://github.com/lolelara/egygo
2. **تأكد من ظهور جميع الملفات**
3. **تحقق من ظهور README.md بشكل صحيح**

## 📁 الملفات المُضافة

تم إعداد المشرو�� مع الملفات التالية:

### 📚 التوثيق:

- ✅ `README.md` - دليل المشروع الرئيسي
- ✅ `INSTALLATION.md` - دليل التثبيت المفصل
- ✅ `CONTRIBUTING.md` - دليل المساهمة
- ✅ `CHANGELOG.md` - سجل التغييرات
- ✅ `LICENSE` - رخصة MIT

### ⚙️ الإعدادات:

- ✅ `.gitignore` - ملفات Git المتجاهلة
- ✅ `package.json` - محدث بمعلومات المشروع
- ✅ `.env.example` - قالب متغيرات البيئة

### 🎯 المشروع الكامل:

- ✅ جميع ملفات الكود المصدري
- ✅ المكونات والصفحات
- ✅ قاعدة البيانات Prisma
- ✅ Netlify Functions
- ✅ إعدادات البناء والنشر

## 🌐 النشر التلقائي

بعد رفع المشروع، يمكنك ربطه بخدمات النشر:

### Netlify (موصى به):

1. **اذهب إلى**: https://netlify.com
2. **اضغط**: "New site from Git"
3. **اختر**: "GitHub"
4. **حدد**: مستودع `egygo`
5. **إعدادات البناء**:
   - Build command: `npm run build`
   - Publish directory: `dist/spa`
6. **إضافة Environment Variables**:
   - `DATABASE_URL`: رابط قاعدة البيانات
   - `NODE_ENV`: `production`
7. **اضغط**: "Deploy site"

### Vercel:

1. **اذهب إلى**: https://vercel.com
2. **اضغط**: "New Project"
3. **استورد**: من GitHub
4. **حدد**: مستودع `egygo`
5. **Framework**: React
6. **إعدادات**:
   - Build Command: `npm run build`
   - Output Directory: `dist/spa`
7. **إضافة Environment Variables**: نفس المتغيرات أعلاه

## 🔧 نصائح مهمة

### 🔒 الأمان:

- **لا تضع** معلومات قاعدة البيانات في الكود
- **استخدم** Environment Variables للمعلومات الحساسة
- **غيّر** كلمات مرور المديرين في الإنتاج

### 📦 قاعدة البيانات:

- **احصل على** قاعدة بيانات PostgreSQL (Supabase, Neon, etc.)
- **قم بتشغيل**: `npx prisma migrate deploy` في الإنتاج
- **أضف البيانات**: `npx prisma db seed` للبيانات التجريبية

### 🚀 الأداء:

- **تأكد من** تفعيل CDN
- **راقب** استخدام قاعدة البيانات
- **استخدم** caching عند الحاجة

## 🆘 حل المشاكل

### مشكلة: خطأ في Git authentication

```bash
# استخدم Personal Access Token
git remote set-url origin https://TOKEN@github.com/lolelara/egygo.git
```

### م��كلة: رفض الـ push

```bash
# إذا كان المستودع يحتوي على ملفات
git pull origin main --allow-unrelated-histories
git push origin main
```

### مشكلة: ملفات كبيرة

```bash
# تحقق من حجم الملفات
du -sh * | sort -hr

# إزالة ملفات كبيرة غير ضرورية
git rm --cached file-name
echo "file-name" >> .gitignore
```

## 📞 الدعم

إذا واجهت مشاكل في الرفع:

1. **تأكد من** صحة رابط المستودع
2. **تحقق من** اتصال الإنترنت
3. **راجع** رسائل الخطأ بعناية
4. **اطلب المساعدة** في Issues المشروع

---

## 🎉 تهانينا!

بعد اكتمال الرفع، ستحصل على:

- ✅ **مستودع GitHub كامل** مع جميع الملفات
- ✅ **توثيق شامل** للمشروع
- ✅ **إعدادات جاهزة** للنشر
- ✅ **مشروع احترافي** قابل للمشاركة

**رابط المشروع**: https://github.com/lolelara/egygo

**نتمنى لك التوفيق مع مشروع شوب كو! 🚀**
