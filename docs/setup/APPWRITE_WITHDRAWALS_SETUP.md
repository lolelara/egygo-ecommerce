# Appwrite Withdrawals Setup Guide

## تعليمات إعداد نظام السحوبات في Appwrite

### 📋 الخطوات المطلوبة:

---

## 1️⃣ إنشاء Collection: `withdrawalRequests`

اذهب إلى Appwrite Console → Database → Create Collection

### معلومات Collection:
- **Collection ID**: `withdrawalRequests`
- **Collection Name**: `Withdrawal Requests`
- **Permissions**: 
  - ✅ `read("users")` - القراءة للمستخدمين المسجلين
  - ✅ `create("users")` - الإنشاء للمستخدمين
  - ✅ `update("users")` - للمستخدم صاحب الطلب
  - ✅ Admin يحتاج صلاحية `update` لمعالجة الطلبات
- **Document Security**: ✅ Enabled

---

## 2️⃣ إضافة Attributes:

### Required Attributes:

| Attribute | Type | Size | Required | Default | Description |
|-----------|------|------|----------|---------|-------------|
| `userId` | string | 255 | ✅ | - | معرف المستخدم |
| `userName` | string | 255 | ✅ | - | اسم المستخدم |
| `userType` | string | 50 | ✅ | - | نوع المستخدم (affiliate/merchant) |
| `amount` | float | - | ✅ | - | المبلغ المطلوب سحبه |
| `method` | string | 100 | ✅ | - | طريقة السحب |
| `accountDetails` | string | 1000 | ✅ | - | تفاصيل الحساب (JSON) |
| `status` | string | 50 | ✅ | `pending` | حالة الطلب |

### Optional Attributes:

| Attribute | Type | Size | Required | Description |
|-----------|------|------|----------|-------------|
| `phoneNumber` | string | 20 | ❌ | رقم الهاتف (فودافون كاش) |
| `bankName` | string | 200 | ❌ | اسم البنك |
| `accountNumber` | string | 100 | ❌ | رقم الحساب البنكي |
| `accountHolder` | string | 255 | ❌ | اسم صاحب الحساب |
| `rejectionReason` | string | 1000 | ❌ | سبب الرفض |
| `paymentProof` | string | 500 | ❌ | معرف ملف إثبات الدفع |
| `transactionId` | string | 255 | ❌ | رقم المعاملة |
| `notes` | string | 2000 | ❌ | ملاحظات الأدمن |
| `processedAt` | string | 50 | ❌ | تاريخ المعالجة |
| `processedBy` | string | 255 | ❌ | معرف المسؤول الذي عالج الطلب |

---

## 3️⃣ إنشاء Indexes:

### Index 1: `userId_index`
```
Type: Key
Attributes: ["userId"]
Orders: ["DESC"]
```

### Index 2: `status_index`
```
Type: Key
Attributes: ["status"]
Orders: ["ASC"]
```

### Index 3: `created_at_index`
```
Type: Key
Attributes: ["$createdAt"]
Orders: ["DESC"]
```

### Index 4: `userType_index`
```
Type: Key
Attributes: ["userType"]
Orders: ["ASC"]
```

---

## 4️⃣ إنشاء Storage Bucket: `payment-proofs`

اذهب إلى Appwrite Console → Storage → Create Bucket

### معلومات Bucket:
- **Bucket ID**: `payment-proofs`
- **Bucket Name**: `Payment Proofs`
- **Permissions**:
  - ✅ `read("users")` - القراءة للمستخدمين
  - ✅ `create("users")` - الرفع للمستخدمين
  - ✅ Admin needs read/write/delete permissions
- **File Security**: ✅ Enabled
- **Max File Size**: `10 MB` (10485760 bytes)
- **Allowed Extensions**: 
  - `jpg`, `jpeg`, `png`, `pdf`, `webp`
- **Compression**: ✅ Enabled
- **Encryption**: ✅ Enabled

---

## 5️⃣ حالات الطلب (Status Values):

| Status | Description | Color |
|--------|-------------|-------|
| `pending` | معلق - في انتظار المراجعة | 🟡 Yellow |
| `processing` | قيد المعالجة | 🔵 Blue |
| `completed` | مكتمل - تم الدفع | 🟢 Green |
| `rejected` | مرفوض | 🔴 Red |

---

## 6️⃣ طرق السحب (Withdrawal Methods):

| Method | Field Required | Description |
|--------|----------------|-------------|
| `vodafone_cash` | `phoneNumber` | فودافون كاش |
| `bank_transfer` | `bankName`, `accountNumber`, `accountHolder` | تحويل بنكي |
| `instapay` | `phoneNumber` | إنستا باي |

---

## 7️⃣ Permissions Setup:

### Document Level Permissions:

```javascript
// عند إنشاء طلب سحب جديد
permissions: [
  Permission.read(Role.user(userId)),      // المستخدم يقرأ طلبه
  Permission.update(Role.user(userId)),    // المستخدم يعدل طلبه (قبل المعالجة)
  Permission.read(Role.label('admin')),    // الأدمن يقرأ كل الطلبات
  Permission.update(Role.label('admin')),  // الأدمن يعالج الطلبات
  Permission.delete(Role.label('admin'))   // الأدمن يحذف الطلبات
]
```

---

## 8️⃣ استخدام Collection من الكود:

### 📝 **إنشاء طلب سحب جديد:**

```typescript
const withdrawal = await databases.createDocument(
  appwriteConfig.databaseId,
  'withdrawalRequests',
  ID.unique(),
  {
    userId: user.$id,
    userName: user.name,
    userType: 'affiliate', // or 'merchant'
    amount: 500,
    method: 'vodafone_cash',
    accountDetails: JSON.stringify({ phone: '01234567890' }),
    phoneNumber: '01234567890',
    status: 'pending'
  },
  [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.read(Role.label('admin')),
    Permission.update(Role.label('admin')),
    Permission.delete(Role.label('admin'))
  ]
);
```

### 📊 **جلب طلبات السحب (Admin):**

```typescript
const withdrawals = await databases.listDocuments(
  appwriteConfig.databaseId,
  'withdrawalRequests',
  [
    Query.orderDesc('$createdAt'),
    Query.limit(100)
  ]
);
```

### ✅ **معالجة طلب سحب (Admin):**

```typescript
await databases.updateDocument(
  appwriteConfig.databaseId,
  'withdrawalRequests',
  withdrawalId,
  {
    status: 'completed',
    transactionId: 'TXN123456',
    processedAt: new Date().toISOString(),
    processedBy: adminUserId,
    notes: 'تم الدفع بنجاح'
  }
);
```

---

## 9️⃣ التحقق من الإعداد:

بعد إنشاء الـ Collection والـ Bucket، تحقق من:

- ✅ Collection `withdrawalRequests` موجود
- ✅ جميع الـ Attributes تم إنشاؤها
- ✅ الـ Indexes تم إنشاؤها
- ✅ الـ Permissions صحيحة
- ✅ Bucket `payment-proofs` موجود
- ✅ الصفحة `/admin/withdrawals` تعمل بدون أخطاء

---

## 🔧 الملفات المتأثرة:

1. **client/pages/AdminWithdrawalsManager.tsx** - صفحة إدارة السحوبات (متصلة بالـ database)
2. **client/lib/lazy-routes.tsx** - تم تحديث الـ import لاستخدام AdminWithdrawalsManager
3. **appwrite-collections.json** - تم إضافة withdrawalRequests collection

---

## 🚀 الخطوة التالية:

1. **افتح Appwrite Console**
2. **اذهب إلى Database → Create Collection**
3. **أنشئ `withdrawalRequests` collection حسب المواصفات أعلاه**
4. **أنشئ Bucket `payment-proofs`**
5. **اختبر الصفحة `/admin/withdrawals`**

---

## ✅ بعد الإعداد:

الصفحة ستعرض:
- 📊 إحصائيات الطلبات المعلقة والمكتملة
- 📋 جدول بكل طلبات السحب
- 🔍 فلاتر حسب الحالة (معلق، قيد المعالجة، مكتمل، مرفوض)
- ⚙️ خيارات المعالجة (موافقة، رفض، إضافة ملاحظات)
- 📤 رفع إثبات الدفع
- 💾 البيانات متصلة بـ Appwrite بالكامل

---

**🎉 تم! الآن صفحة السحوبات متصلة بالـ database ويمكنك إدارة طلبات السحب بشكل كامل!**
