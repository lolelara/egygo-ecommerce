# دليل إعداد الإنتاج

## 1. متغيرات البيئة المطلوبة

قم بإنشاء ملف `.env` في جذر المشروع واملأه بالقيم المناسبة:

```bash
cp .env.example .env
```

### المتغيرات الأساسية:

- `DATABASE_URL`: رابط قاعدة البيانات Postgres
- `JWT_SECRET`: مفتاح سري للـ JWT (يجب أن يكون معقد)
- `NODE_ENV=production`

## 2. إعداد قاعدة البيانات

```bash
# تشغيل المايجريشن
npx prisma migrate deploy

# إضافة البيانات الأولية
npx prisma db seed
```

## 3. بناء المشروع

```bash
# تثبيت التبعيات
npm install

# بناء العميل والخادم
npm run build
```

## 4. تشغيل الإنتاج

```bash
# تشغيل الخادم
npm start
```

## 5. النشر على خدمات السحابة

### Netlify:

1. ربط المستودع بـ Netlify
2. إعداد Build Command: `npm run build`
3. إعداد Publish Directory: `dist/spa`
4. إضافة متغيرات البيئة في إعدادات Netlify

### Vercel:

1. استيراد المشروع إلى Vercel
2. إعداد Build Command: `npm run build`
3. إعداد Output Directory: `dist/spa`
4. إضافة متغيرات البيئة في إعدادات Vercel

## 6. اعتبارات الأمان

- تأكد من أن `JWT_SECRET` معقد وفريد
- استخدم HTTPS في الإنتاج
- قم بتفعيل Rate Limiting
- راجع إعدادات CORS

## 7. المراقبة والصيانة

- راقب ا��تخدام قاعدة البيانات
- راجع السجلات بانتظام
- احتفظ بنسخ احتياطية من قاعدة البيانات
- حدّث التبعيات بانتظام

## 8. اختبار الإنتاج محلياً

```bash
# إعداد بيئة الإنتاج محلياً
NODE_ENV=production npm start
```

## مستخدمو الإدارة الافتراضيين

بعد تشغيل `npx prisma db seed`:

- **مدير**: admin@example.com / admin123
- **مدير عام**: superadmin@example.com / superadmin123

⚠️ **تأكد من تغيير كلمات المرور هذه في الإنتاج!**
