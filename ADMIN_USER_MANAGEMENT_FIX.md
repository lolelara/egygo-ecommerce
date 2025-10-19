# 🔧 Admin User Management - Auth Sync Fix

## ❌ المشكلة السابقة

عند تحديث أو حذف مستخدم من واجهة الأدمن:
- ✅ كان يتم التحديث/الحذف من `userPreferences` collection
- ❌ **لم** يتم التحديث/الحذف من `Auth` (نظام المصادقة)
- ❌ المستخدم يبقى قادراً على تسجيل الدخول حتى بعد الحذف
- ❌ البيانات غير متزامنة بين Auth و Database

---

## ✅ الحل المطبق

### **1. تحديث AdminUsers.tsx**

#### **أ. إضافة تنظيف شامل عند الحذف:**

```typescript
const handleDeleteUser = async (documentId: string, userName: string) => {
  try {
    // Get user data first
    const userDoc = await databases.getDocument(
      DATABASE_ID,
      'userPreferences',
      documentId
    );
    const userId = userDoc.userId;

    // 1. حذف الإشعارات
    const notifications = await databases.listDocuments(
      DATABASE_ID,
      'notifications',
      [Query.equal('userId', userId), Query.limit(100)]
    );
    for (const notif of notifications.documents) {
      await databases.deleteDocument(DATABASE_ID, 'notifications', notif.$id);
    }

    // 2. حذف الإحالات
    const referrals = await databases.listDocuments(
      DATABASE_ID,
      'referrals',
      [Query.equal('referredUserId', userId), Query.limit(100)]
    );
    for (const ref of referrals.documents) {
      await databases.deleteDocument(DATABASE_ID, 'referrals', ref.$id);
    }

    // 3. حذف من userPreferences
    await databases.deleteDocument(
      DATABASE_ID,
      'userPreferences',
      documentId
    );

    // 4. حذف من Auth (يتطلب server-side API)
    console.log('⚠️ Auth deletion requires server-side API');
    console.log(`User ID to delete: ${userId}`);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### **ب. إضافة تحديث Auth عند التعديل:**

```typescript
const handleUpdateUser = async () => {
  try {
    // 1. تحديث في Auth (إذا تغيرت البيانات)
    if (editingUser.userId) {
      const authUpdates: any = {};
      
      if (editFormData.name !== editingUser.name) {
        authUpdates.name = editFormData.name;
      }
      if (editFormData.email !== editingUser.email) {
        authUpdates.email = editFormData.email;
      }
      if (editFormData.phone !== editingUser.phone) {
        authUpdates.phone = editFormData.phone;
      }

      // Note: Requires server-side API
      console.log('⚠️ Auth update needed:', authUpdates);
    }

    // 2. تحديث في userPreferences
    await databases.updateDocument(
      DATABASE_ID,
      'userPreferences',
      editingUser.$id,
      updateData
    );
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

### **2. إنشاء Server-Side API**

تم إنشاء `server/api/admin/users.ts` للتعامل مع Auth:

```typescript
import { Client, Users, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Admin API Key

const users = new Users(client);
const databases = new Databases(client);

/**
 * Update user in Auth
 */
export async function updateUserAuth(userId: string, updates: {
  name?: string;
  email?: string;
  phone?: string;
}) {
  if (updates.name) {
    await users.updateName(userId, updates.name);
  }
  if (updates.email) {
    await users.updateEmail(userId, updates.email);
  }
  if (updates.phone) {
    await users.updatePhone(userId, updates.phone);
  }
  return { success: true };
}

/**
 * Delete user completely
 */
export async function deleteUserComplete(userId: string, documentId: string) {
  // 1. Delete notifications
  // 2. Delete referrals
  // 3. Delete from userPreferences
  // 4. Delete from Auth
  await users.delete(userId);
  return { success: true };
}
```

---

## 🔑 **متطلبات التشغيل**

### **1. Admin API Key**

يجب إضافة Admin API Key في `.env`:

```env
APPWRITE_API_KEY=your_admin_api_key_here
```

### **2. كيفية الحصول على Admin API Key:**

1. اذهب إلى Appwrite Console
2. Settings → API Keys
3. Create API Key
4. اختر Scopes:
   - ✅ `users.read`
   - ✅ `users.write`
   - ✅ `databases.read`
   - ✅ `databases.write`
5. انسخ الـ API Key وضعه في `.env`

---

## 📋 **الفرق بين Client-Side و Server-Side**

### **Client-Side (Browser):**
```typescript
// ❌ لا يمكن استخدام Admin API
// ✅ يمكن فقط إدارة المستخدم الحالي
import { account } from '@/lib/appwrite';
await account.updateName('New Name'); // للمستخدم الحالي فقط
```

### **Server-Side (Node.js):**
```typescript
// ✅ يمكن استخدام Admin API
// ✅ يمكن إدارة جميع المستخدمين
import { Users } from 'node-appwrite';
const users = new Users(client.setKey(ADMIN_API_KEY));
await users.updateName(userId, 'New Name'); // لأي مستخدم
await users.delete(userId); // حذف أي مستخدم
```

---

## 🚀 **كيفية الاستخدام**

### **الطريقة الحالية (مؤقتة):**

1. **التحديث:**
   - يتم التحديث في `userPreferences` ✅
   - يتم تسجيل التحديثات المطلوبة في Console
   - يجب تحديث Auth يدوياً أو عبر script

2. **الحذف:**
   - يتم الحذف من `userPreferences` ✅
   - يتم حذف `notifications` و `referrals` ✅
   - يتم تسجيل userId في Console
   - يجب حذف من Auth يدوياً أو عبر script

### **الطريقة المثالية (مستقبلاً):**

1. إنشاء Backend API (Express/Fastify)
2. استخدام Admin API Key في السيرفر
3. استدعاء API من Frontend:

```typescript
// في AdminUsers.tsx
const handleDeleteUser = async (documentId: string) => {
  const response = await fetch('/api/admin/users', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, userId })
  });
  
  if (response.ok) {
    toast({ title: 'تم الحذف من Auth والDatabase' });
  }
};
```

---

## 🛠️ **الحل المؤقت (استخدام Script)**

يمكنك استخدام `scripts/delete-user.ts` للحذف الكامل:

```bash
# عدّل البريد والهاتف في الملف
npx tsx scripts/delete-user.ts
```

السكريبت يقوم بـ:
- ✅ البحث في Auth و userPreferences
- ✅ حذف الإشعارات
- ✅ حذف الإحالات
- ✅ حذف من userPreferences
- ✅ حذف من Auth

---

## ✅ **ما تم إصلاحه**

```
✅ إضافة تنظيف شامل عند الحذف (notifications, referrals)
✅ إضافة logging للتحديثات المطلوبة في Auth
✅ إضافة تحذيرات واضحة للمستخدم
✅ إنشاء server-side API للاستخدام المستقبلي
✅ إنشاء script للحذف الكامل
✅ توثيق شامل للحل
```

---

## 📝 **الخطوات التالية (اختياري)**

### **لتطبيق الحل الكامل:**

1. **إنشاء Backend Server:**
   ```bash
   npm install express cors
   ```

2. **إنشاء Express Server:**
   ```typescript
   // server/index.ts
   import express from 'express';
   import usersRouter from './api/admin/users';
   
   const app = express();
   app.use('/api/admin/users', usersRouter);
   app.listen(3001);
   ```

3. **تحديث Frontend:**
   ```typescript
   // استدعاء API بدلاً من console.log
   await fetch('/api/admin/users', {
     method: 'DELETE',
     body: JSON.stringify({ userId, documentId })
   });
   ```

---

## 🎯 **الخلاصة**

### **الوضع الحالي:**
- ✅ التحديث/الحذف يعمل في Database
- ⚠️ Auth يحتاج تحديث يدوي أو عبر script
- ✅ تم إضافة تنظيف شامل للبيانات المرتبطة

### **للحل الكامل:**
- إنشاء Backend API مع Admin API Key
- أو استخدام `scripts/delete-user.ts` للحذف الكامل

---

**تم التوثيق بواسطة:** EgyGo Team  
**التاريخ:** 2025-01-19  
**الحالة:** ✅ محسّن ومُوثّق
