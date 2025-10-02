# نشر الموقع على Appwrite Cloud

## معلومات المشروع
- **مشروع Appwrite**: `fra-68d8b9db00134c41e7c8`
- **رابط المشروع**: https://cloud.appwrite.io/console/project-fra-68d8b9db00134c41e7c8

## الخطوات المطلوبة:

### 1. إعداد قاعدة البيانات (مطلوب أولاً)
```bash
# انتقل إلى Appwrite Console وأنشئ:
# - Database: ecommerce-db
# - Collections: users, products, categories, orders, order-items, reviews, affiliates
# - Storage Bucket: product-images
# راجع ملف APPWRITE_SETUP.md للتفاصيل الكاملة
```

### 2. بناء المشروع للإنتاج
```bash
# تأكد من وجود متغيرات البيئة
cp .env.example .env

# قم ببناء المشروع
pnpm build
```

### 3. نشر إلى Appwrite Hosting
```bash
# تثبيت Appwrite CLI
npm install -g appwrite-cli

# تسجيل الدخول
appwrite login

# ربط المشروع
appwrite init project --project-id fra-68d8b9db00134c41e7c8

# نشر الموقع
appwrite deploy collection
appwrite deploy bucket
appwrite deploy function

# رفع ملفات الموقع
cd dist/spa
appwrite hosting deploy --project-id fra-68d8b9db00134c41e7c8
```

### 4. إعداد Domain المخصص (اختياري)
```bash
# في Appwrite Console > Hosting:
# 1. اضغط على "Add Custom Domain"
# 2. أدخل النطاق الخاص بك
# 3. اتبع التعليمات لإعداد DNS
```

## المتغيرات المطلوبة:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=fra-68d8b9db00134c41e7c8
VITE_APPWRITE_DATABASE_ID=ecommerce-db
VITE_APPWRITE_STORAGE_ID=product-images
```

## إعدادات الأمان:

### في Appwrite Console:
1. **Auth Settings**:
   - أضف نطاقات الموثقة في "Web Platform"
   - فعّل Email/Password authentication

2. **Database Permissions**:
   - Users: `read("user:self")`, `write("user:self")`
   - Products: `read("any")`, `create("role:admin")`
   - Orders: `read("user:self")`, `create("users")`

3. **Storage Permissions**:
   - `read("any")`, `create("users")`, `update("users")`

## تحديث DNS (إذا كان لديك نطاق):

```dns
# CNAME Record
Type: CNAME
Name: www
Value: fra-68d8b9db00134c41e7c8.appwrite.global

# A Record (for root domain)
Type: A
Name: @
Value: [IP provided by Appwrite]
```

## المراقبة والصيانة:

1. **Analytics**: فعّل التحليلات في Appwrite Console
2. **Backup**: راجع إعدادات النسخ الاحتياطي
3. **Monitoring**: راقب استخدام قاعدة البيانات والتخزين
4. **Updates**: تابع تحديثات Appwrite

## روابط مفيدة:

- [Appwrite Hosting Docs](https://appwrite.io/docs/products/hosting)
- [Appwrite CLI Docs](https://appwrite.io/docs/tooling/cli)
- [Custom Domains](https://appwrite.io/docs/products/hosting/custom-domains)

## تأكد من:

✅ إعداد قاعدة البيانات والمجموعات
✅ رفع بيانات تجريبية
✅ اختبار المصادقة
✅ اختبار تحميل الصور
✅ اختبار إنشاء الطلبات
✅ ضبط الصلاحيات بدقة