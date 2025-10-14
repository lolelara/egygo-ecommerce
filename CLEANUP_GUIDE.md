# 🧹 دليل تنظيف قاعدة البيانات وإضافة بيانات تجريبية

## ⚠️ متطلبات مهمة

### 1. إنشاء API Key بصلاحيات كاملة

يجب إنشاء API Key جديد من Appwrite Console بالصلاحيات التالية:

#### الذهاب إلى Appwrite Console:
1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اختر مشروعك
3. اذهب إلى **Settings** → **API Keys**
4. اضغط **Create API Key**

#### الصلاحيات المطلوبة:
```
✅ users.read
✅ users.write
✅ databases.read
✅ databases.write
✅ storage.read
✅ storage.write
✅ collections.read
✅ collections.write
✅ documents.read
✅ documents.write
✅ files.read
✅ files.write
```

أو ببساطة: **اختر جميع الصلاحيات (All Scopes)**

### 2. تحديث ملف .env

أضف الـ API Key الجديد في ملف `.env`:

```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_API_KEY=your-new-api-key-with-full-permissions
APPWRITE_STORAGE_BUCKET_ID=product-images
```

## 🚀 تشغيل السكربت

بعد التأكد من الصلاحيات، شغّل الأمر:

```bash
pnpm run cleanup-and-seed
```

## 📋 ما يفعله السكربت

### 1. التنظيف 🗑️
- ✅ حذف جميع المستخدمين من Auth و Users Collection
- ✅ حذف جميع الصور من Storage
- ✅ حذف جميع المنتجات من Products Collection
- ✅ حذف جميع الطلبات من Orders Collection

### 2. إضافة بيانات تجريبية 👥

يتم إنشاء 5 مستخدمين تجريبيين:

#### 1. مدير النظام (Admin)
- **البريد**: `admin@egygo.com`
- **كلمة المرور**: `Admin@123`
- **الصلاحيات**: إدارة كاملة للنظام

#### 2. تاجر (Merchant)
- **البريد**: `merchant@egygo.com`
- **كلمة المرور**: `Merchant@123`
- **الصلاحيات**: إضافة وإدارة المنتجات

#### 3. مسوق بالعمولة (Affiliate)
- **البريد**: `affiliate@egygo.com`
- **كلمة المرور**: `Affiliate@123`
- **الصلاحيات**: إنشاء روابط تسويقية وتتبع العمولات
- **يتم إنشاء**: ملف في Affiliates Collection مع كود تسويقي

#### 4. وسيط (Intermediary)
- **البريد**: `intermediary@egygo.com`
- **كلمة المرور**: `Intermediary@123`
- **الصلاحيات**: استيراد منتجات من Vendoor
- **يتم إنشاء**: ملف في Intermediaries Collection مع كود وسيط

#### 5. عميل (Customer)
- **البريد**: `customer@egygo.com`
- **كلمة المرور**: `Customer@123`
- **الصلاحيات**: تصفح وشراء المنتجات

## 🔐 معلومات تسجيل الدخول

بعد تشغيل السكربت بنجاح، استخدم هذه البيانات للدخول:

| الدور | البريد الإلكتروني | كلمة المرور |
|------|-------------------|-------------|
| Admin | admin@egygo.com | Admin@123 |
| Merchant | merchant@egygo.com | Merchant@123 |
| Affiliate | affiliate@egygo.com | Affiliate@123 |
| Intermediary | intermediary@egygo.com | Intermediary@123 |
| Customer | customer@egygo.com | Customer@123 |

## 🛠️ استكشاف الأخطاء

### خطأ: "The current user is not authorized"

**السبب**: الـ API Key لا يملك صلاحيات كافية

**الحل**:
1. أنشئ API Key جديد بجميع الصلاحيات
2. حدّث `APPWRITE_API_KEY` في `.env`
3. أعد تشغيل السكربت

### خطأ: "Collection not found"

**السبب**: Collections غير موجودة في قاعدة البيانات

**الحل**:
```bash
pnpm run setup-collections
```

### خطأ: "Bucket not found"

**السبب**: Storage Bucket غير موجود

**الحل**:
1. اذهب إلى Appwrite Console → Storage
2. أنشئ Bucket جديد باسم `product-images`
3. أو حدّث `APPWRITE_STORAGE_BUCKET_ID` في `.env`

## 📝 ملاحظات مهمة

- ⚠️ **هذا السكربت يحذف جميع البيانات!** استخدمه فقط في بيئة التطوير
- ✅ جميع المستخدمين التجريبيين **مفعّلون ومعتمدون** (`isApproved: true`)
- ✅ المسوق بالعمولة والوسيط لديهم ملفات كاملة في Collections الخاصة بهم
- 🔒 كلمات المرور قوية وتتبع معايير الأمان

## 🎯 الخطوات التالية

بعد تشغيل السكربت بنجاح:

1. **سجّل الدخول كأدمن** (`admin@egygo.com`)
2. **أضف تصنيفات** من لوحة التحكم
3. **سجّل الدخول كوسيط** (`intermediary@egygo.com`)
4. **استورد منتجات من Vendoor** عبر `/intermediary/import`
5. **جرّب الأدوار المختلفة** للتأكد من عمل كل شيء

## 🔄 إعادة التشغيل

يمكنك تشغيل السكربت عدة مرات بأمان. في كل مرة:
- سيتم حذف جميع البيانات القديمة
- سيتم إنشاء مستخدمين تجريبيين جدد
- ستبدأ من صفحة نظيفة

```bash
pnpm run cleanup-and-seed
```

---

**تم إنشاؤه بواسطة**: نظام EgyGo  
**التاريخ**: 2025-01-14
