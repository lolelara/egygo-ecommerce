# 🚀 تعليمات الإعداد السريع - EgyGo

## ⚡ إعداد قاعدة البيانات تلقائياً

### الخطوة 1: إضافة API Key

افتح ملف `.env` وأضف:

```env
APPWRITE_API_KEY=your_api_key_here
```

**كيفية الحصول على API Key:**
1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اذهب إلى Project Settings > API Keys
3. اضغط "Create API Key"
4. أعطه الصلاحيات: `users.read`, `databases.read`, `databases.write`
5. انسخ الـ Key وضعه في `.env`

---

### الخطوة 2: تشغيل سكريبت الإعداد

```bash
# إعداد كامل (Collection + Attributes + Indexes + مزامنة المستخدمين)
pnpm run setup-appwrite

# أو مع مستخدمين تجريبيين
pnpm run setup-appwrite:test
```

**هذا السكريبت سيقوم بـ:**
- ✅ إنشاء `users` collection
- ✅ إضافة جميع الـ attributes (email, name, phone, isAffiliate, etc.)
- ✅ إنشاء الـ indexes
- ✅ مزامنة جميع المستخدمين من Auth إلى Collection
- ✅ إنشاء مستخدمين تجريبيين (اختياري)

---

### الخطوة 3: التحقق

افتح الموقع:
```
https://egygo.me/#/admin/users
```

يجب أن ترى:
- ✅ جميع المستخدمين
- ✅ تبويب "المسوقين بالعمولة"
- ✅ جميع البيانات كاملة

---

## 🎯 الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `pnpm run setup-appwrite` | إعداد كامل تلقائي |
| `pnpm run setup-appwrite:test` | إعداد + مستخدمين تجريبيين |
| `pnpm run sync-users sync` | مزامنة المستخدمين فقط |
| `pnpm run sync-users test` | إنشاء مستخدم مسوق تجريبي |

---

## 📊 ما يتم إنشاؤه

### Users Collection Attributes:

| Attribute | Type | Description |
|-----------|------|-------------|
| `email` | string | البريد الإلكتروني |
| `name` | string | الاسم |
| `phone` | string | رقم الهاتف |
| `isAffiliate` | boolean | مسوق؟ |
| `isMerchant` | boolean | تاجر؟ |
| `affiliateCode` | string | كود المسوق |
| `commissionRate` | double | نسبة العمولة (0.15 = 15%) |
| `totalEarnings` | double | إجمالي الأرباح |
| `pendingEarnings` | double | الأرباح المعلقة |
| `referralCount` | integer | عدد الإحالات |
| `accountStatus` | string | حالة الحساب |
| `isActive` | boolean | نشط؟ |

### Indexes:
- `email` (unique)
- `isAffiliate` (key)
- `isMerchant` (key)
- `accountStatus` (key)
- `affiliateCode` (unique)

---

## 🧪 المستخدمون التجريبيون

عند تشغيل `pnpm run setup-appwrite:test`، سيتم إنشاء:

1. **مسوق تجريبي 1**
   - Email: `affiliate1@egygo.test`
   - كود المسوق: `AFFxxxxx`
   - الأرباح: 2,500.75 ج.م
   - الإحالات: 35

2. **تاجر تجريبي 1**
   - Email: `merchant1@egygo.test`
   - حالة: موافق عليه

3. **حساب معلق تجريبي**
   - Email: `pending@egygo.test`
   - حالة: قيد المراجعة

---

## 🔧 استكشاف الأخطاء

### "APPWRITE_API_KEY غير موجود"
```bash
# أضف API Key في .env
APPWRITE_API_KEY=your_key_here
```

### "Permission denied"
تأكد من أن API Key لديه الصلاحيات:
- `users.read`
- `databases.read`
- `databases.write`

### "Collection already exists"
هذا طبيعي! السكريبت سيتخطى الإنشاء ويضيف الـ attributes المفقودة فقط.

---

## ✅ النتيجة النهائية

بعد تشغيل السكريبت:
- ✅ قاعدة البيانات جاهزة بالكامل
- ✅ جميع المستخدمين مزامنين
- ✅ صفحة إدارة المستخدمين تعمل
- ✅ صفحة المسوقين تعمل
- ✅ نظام الحسابات المعلقة يعمل

**لا حاجة لأي إعداد يدوي! 🎉**

---

## 📚 ملفات إضافية

- `scripts/setup-appwrite-database.ts` - السكريبت الرئيسي
- `scripts/sync-users-to-collection.ts` - مزامنة المستخدمين فقط
- `USERS_SYNC_GUIDE.md` - دليل مفصل
- `CODE_REVIEW_REPORT.md` - تقرير المراجعة الشاملة
- `PENDING_ACCOUNTS_GUIDE.md` - دليل نظام الحسابات المعلقة
