# 📝 إنشاء Notifications Collection في Appwrite

## ⚠️ مهم جداً!

لكي يعمل **Notification Center** بشكل صحيح، يجب إنشاء collection للإشعارات في Appwrite.

---

## 🚀 الطريقة السريعة (باستخدام Script)

### 1. إنشاء ملف Script:

احفظ هذا الكود في ملف `scripts/create-notifications-collection.mjs`:

```javascript
import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

async function createNotificationsCollection() {
  try {
    console.log('🚀 Creating notifications collection...');

    // Create collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      'notifications',
      'Notifications',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any())
      ]
    );

    console.log('✅ Collection created:', collection.$id);

    // Create attributes
    await databases.createStringAttribute(
      DATABASE_ID,
      'notifications',
      'userId',
      255,
      true // required
    );
    console.log('✅ userId attribute created');

    await databases.createStringAttribute(
      DATABASE_ID,
      'notifications',
      'title',
      500,
      true // required
    );
    console.log('✅ title attribute created');

    await databases.createStringAttribute(
      DATABASE_ID,
      'notifications',
      'message',
      2000,
      true // required
    );
    console.log('✅ message attribute created');

    await databases.createEnumAttribute(
      DATABASE_ID,
      'notifications',
      'type',
      ['info', 'success', 'warning', 'error'],
      true, // required
      'info' // default
    );
    console.log('✅ type attribute created');

    await databases.createBooleanAttribute(
      DATABASE_ID,
      'notifications',
      'isRead',
      false, // not required
      false // default
    );
    console.log('✅ isRead attribute created');

    await databases.createStringAttribute(
      DATABASE_ID,
      'notifications',
      'link',
      500,
      false // optional
    );
    console.log('✅ link attribute created');

    console.log('');
    console.log('🎉 Notifications collection created successfully!');
    console.log('');
    console.log('Collection ID: notifications');
    console.log('Attributes: userId, title, message, type, isRead, link');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 409) {
      console.log('ℹ️ Collection already exists!');
    }
  }
}

createNotificationsCollection();
```

### 2. تشغيل الـ Script:

```bash
cd scripts
node create-notifications-collection.mjs
```

---

## 📋 الطريقة اليدوية (من Appwrite Console)

### 1. افتح Appwrite Console:
```
https://cloud.appwrite.io/console
```

### 2. اذهب إلى Database:
- اختر مشروعك
- Databases → اختر الـ Database
- Collections → Create Collection

### 3. إعدادات الـ Collection:

**Collection Settings:**
- **Collection ID:** `notifications`
- **Collection Name:** `Notifications`

### 4. إضافة Attributes:

#### Attribute 1: userId
- **Type:** String
- **Key:** `userId`
- **Size:** 255
- **Required:** ✅ Yes
- **Array:** ❌ No

#### Attribute 2: title
- **Type:** String
- **Key:** `title`
- **Size:** 500
- **Required:** ✅ Yes
- **Array:** ❌ No

#### Attribute 3: message
- **Type:** String
- **Key:** `message`
- **Size:** 2000
- **Required:** ✅ Yes
- **Array:** ❌ No

#### Attribute 4: type
- **Type:** Enum
- **Key:** `type`
- **Elements:** `info`, `success`, `warning`, `error`
- **Required:** ✅ Yes
- **Default:** `info`

#### Attribute 5: isRead
- **Type:** Boolean
- **Key:** `isRead`
- **Required:** ❌ No
- **Default:** `false`

#### Attribute 6: link
- **Type:** String
- **Key:** `link`
- **Size:** 500
- **Required:** ❌ No
- **Array:** ❌ No

### 5. إعدادات الـ Permissions:

**في تبويب Settings → Permissions:**

اختر **Document Security: Disabled** أو أضف هذه الصلاحيات:

```
Collection Permissions:
- Read: Any
- Create: Any
- Update: Any
- Delete: Any
```

**أو Document Permissions (لكل مستخدم يرى إشعاراته فقط):**
```
- Read: Users
- Create: Users
- Update: Users
- Delete: Users
```

---

## 🔍 التحقق من النجاح

### من Appwrite Console:
1. اذهب إلى Collections
2. ابحث عن `notifications`
3. تحقق من وجود 6 attributes

### من التطبيق:
1. شغل المشروع: `pnpm dev`
2. افتح أي صفحة
3. اضغط على أيقونة الجرس 🔔
4. يجب أن تفتح قائمة الإشعارات (حتى لو كانت فارغة)

---

## 🧪 اختبار الإشعارات

### إنشاء إشعار تجريبي:

افتح Console في المتصفح وشغل:

```javascript
import { createNotification } from '@/lib/notifications-api';

// إنشاء إشعار تجريبي
await createNotification(
  'USER_ID_HERE', // ضع userId الخاص بك
  'مرحباً!',
  'هذا إشعار تجريبي للاختبار',
  'success',
  '/admin/dashboard'
);
```

أو استخدم هذا الكود في أي component:

```typescript
import { createNotification } from '@/lib/notifications-api';
import { useAuth } from '@/contexts/AppwriteAuthContext';

function TestComponent() {
  const { user } = useAuth();

  const testNotification = async () => {
    if (user) {
      await createNotification(
        user.$id,
        'إشعار تجريبي',
        'تم إنشاء هذا الإشعار بنجاح!',
        'success'
      );
      alert('تم إنشاء الإشعار!');
    }
  };

  return (
    <button onClick={testNotification}>
      إنشاء إشعار تجريبي
    </button>
  );
}
```

---

## 🎯 استخدام Broadcast (للإدمن)

لإرسال إشعار لجميع المستخدمين:

```typescript
import { broadcastNotification } from '@/lib/notifications-api';

// إرسال إعلان للجميع
const result = await broadcastNotification(
  'إعلان هام',
  'تم إطلاق ميزات جديدة في المنصة!',
  'info'
);

console.log(`تم الإرسال لـ ${result.success} مستخدم`);
```

---

## ❓ الأسئلة الشائعة

### Q: لماذا لا تظهر الإشعارات؟
**A:** تأكد من:
1. ✅ إنشاء الـ collection بشكل صحيح
2. ✅ الـ Permissions صحيحة
3. ✅ وجود إشعارات في الـ Database
4. ✅ userId صحيح

### Q: هل يمكن حذف الإشعارات القديمة؟
**A:** نعم، يمكنك:
- حذف يدوي من كل إشعار
- أو إنشاء function لحذف الإشعارات الأقدم من 30 يوم

### Q: كيف أضيف Real-time Updates?
**A:** يمكنك استخدام Appwrite Realtime:

```typescript
import { client } from '@/lib/appwrite';

client.subscribe('databases.*.collections.notifications.documents', response => {
  console.log('New notification:', response);
  // Refresh notifications list
});
```

---

## 📚 المزيد من المعلومات

للتفاصيل الكاملة عن Notifications API:
- راجع: `ADVANCED_FEATURES_APPLIED.md`
- الكود: `client/lib/notifications-api.ts`
- الـ Component: `client/components/NotificationCenter.tsx`

---

**الحالة:** ✅ جاهز للتطبيق!  
**التاريخ:** 4 أكتوبر 2025
