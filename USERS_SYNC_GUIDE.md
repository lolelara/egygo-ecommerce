# 👥 دليل مزامنة المستخدمين - EgyGo

## 🔍 المشكلة

**المستخدمون القدماء لا يظهرون في صفحة إدارة المستخدمين**

### السبب:
- المستخدمون القدماء موجودون فقط في **Appwrite Auth**
- لكنهم غير موجودين في **users collection**
- الموقع يجلب المستخدمين من collection وليس من Auth مباشرة

---

## ✅ الحلول المتاحة

### الحل 1: مزامنة المستخدمين باستخدام Server-side Script ⭐ (موصى به)

#### الخطوات:

1. **إضافة API Key في `.env`:**
```env
# في ملف .env
APPWRITE_API_KEY=your_api_key_here
```

**كيفية الحصول على API Key:**
- افتح Appwrite Console
- اذهب إلى Project Settings > API Keys
- اضغط "Create API Key"
- أعطه الصلاحيات التالية:
  - `users.read`
  - `databases.read`
  - `databases.write`
- انسخ الـ API Key وضعه في `.env`

2. **تشغيل سكريبت المزامنة:**
```bash
# مزامنة جميع المستخدمين
pnpm run sync-users sync

# أو إنشاء مستخدم مسوق تجريبي
pnpm run sync-users test
```

3. **النتيجة:**
- ✅ سيتم نسخ جميع المستخدمين من Auth إلى Collection
- ✅ سيتم الحفاظ على جميع البيانات (preferences)
- ✅ سيظهر المستخدمون في صفحة الإدارة

---

### الحل 2: إنشاء المستخدمين يدوياً في Appwrite Console

#### الخطوات:

1. افتح Appwrite Console
2. اذهب إلى Databases > egygo > users collection
3. اضغط "Add Document"
4. أضف البيانات التالية:

```json
{
  "$id": "user_id_from_auth",
  "email": "user@example.com",
  "name": "اسم المستخدم",
  "phone": "01234567890",
  "isAffiliate": false,
  "isMerchant": false,
  "affiliateCode": null,
  "commissionRate": 0.15,
  "totalEarnings": 0,
  "pendingEarnings": 0,
  "referralCount": 0,
  "accountStatus": "approved",
  "isActive": true
}
```

**ملاحظة:** يجب أن يكون `$id` هو نفس ID المستخدم في Auth

---

### الحل 3: إنشاء Appwrite Function (متقدم)

#### الخطوات:

1. إنشاء Function في Appwrite Console
2. رفع الكود من `scripts/sync-users-to-collection.ts`
3. ضبط Environment Variables
4. تشغيل الـ Function

---

## 📊 هيكل users Collection المطلوب

### Attributes:

| Attribute | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `email` | string | ✅ | - | البريد الإلكتروني |
| `name` | string | ✅ | - | الاسم |
| `phone` | string | ❌ | '' | رقم الهاتف |
| `alternativePhone` | string | ❌ | '' | رقم بديل |
| `isAffiliate` | boolean | ❌ | false | مسوق؟ |
| `isMerchant` | boolean | ❌ | false | تاجر؟ |
| `affiliateCode` | string | ❌ | null | كود المسوق |
| `commissionRate` | double | ❌ | 0.15 | نسبة العمولة |
| `totalEarnings` | double | ❌ | 0 | إجمالي الأرباح |
| `pendingEarnings` | double | ❌ | 0 | الأرباح المعلقة |
| `referralCount` | integer | ❌ | 0 | عدد الإحالات |
| `accountStatus` | string | ❌ | 'approved' | حالة الحساب |
| `isActive` | boolean | ❌ | true | نشط؟ |
| `approvedAt` | datetime | ❌ | null | تاريخ الموافقة |
| `approvedBy` | string | ❌ | null | من وافق |
| `rejectionReason` | string | ❌ | null | سبب الرفض |

---

## 🧪 اختبار النظام

### 1. التحقق من وجود المستخدمين:

```bash
# افتح Appwrite Console
# اذهب إلى Databases > egygo > users
# تحقق من عدد المستندات
```

### 2. اختبار صفحة الإدارة:

```
https://egygo.me/#/admin/users
```

يجب أن ترى:
- ✅ جميع المستخدمين
- ✅ معلوماتهم كاملة
- ✅ حالة الحساب
- ✅ نوع الحساب (عميل/تاجر/مسوق)

### 3. اختبار المسوقين:

```
https://egygo.me/#/admin/users
# اضغط على تبويب "المسوقين بالعمولة"
```

يجب أن ترى:
- ✅ جميع المسوقين
- ✅ كود المسوق
- ✅ نسبة العمولة
- ✅ الأرباح
- ✅ عدد الإحالات

---

## 🔧 استكشاف الأخطاء

### المشكلة: "APPWRITE_API_KEY غير موجود"

**الحل:**
```bash
# أضف API Key في .env
APPWRITE_API_KEY=your_api_key_here
```

### المشكلة: "Collection not found"

**الحل:**
1. تأكد من وجود `users` collection في Appwrite
2. تأكد من صحة DATABASE_ID في `.env`
3. تأكد من صحة COLLECTION_ID في `.env`

### المشكلة: "Permission denied"

**الحل:**
1. تأكد من أن API Key لديه الصلاحيات المطلوبة:
   - `users.read`
   - `databases.read`
   - `databases.write`

### المشكلة: "المستخدمون لا يزالون لا يظهرون"

**الحل:**
1. افتح Console في المتصفح (F12)
2. ابحث عن أخطاء في Console tab
3. تحقق من Network tab
4. تأكد من تشغيل سكريبت المزامنة بنجاح

---

## 📝 ملاحظات مهمة

### ⚠️ الأمان:
- **لا تشارك API Key أبداً**
- **لا ترفع `.env` على GitHub**
- **استخدم API Key فقط في Server-side**

### 🔄 المزامنة التلقائية:
بعد تشغيل السكريبت مرة واحدة، جميع المستخدمين الجدد سيتم إنشاؤهم تلقائياً في Collection عند التسجيل (الكود موجود في `AppwriteAuthContext.tsx`)

### 📊 البيانات:
- المستخدمون القدماء: `accountStatus = 'approved'`
- المستخدمون الجدد (تجار/مسوقين): `accountStatus = 'pending'`

---

## 🎯 الخلاصة

**الحل الموصى به:**
1. ✅ أضف APPWRITE_API_KEY في `.env`
2. ✅ شغل `pnpm run sync-users sync`
3. ✅ تحقق من صفحة الإدارة

**النتيجة:**
- ✅ جميع المستخدمين القدماء سيظهرون
- ✅ جميع المسوقين سيظهرون مع بياناتهم
- ✅ النظام جاهز للعمل بشكل كامل

---

**للمزيد من المعلومات:**
- راجع `scripts/sync-users-to-collection.ts`
- راجع `CODE_REVIEW_REPORT.md`
- راجع `PENDING_ACCOUNTS_GUIDE.md`
