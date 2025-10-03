# 🔔 نظام الإشعارات - دليل الإعداد

## 📋 نظرة عامة

تم ربط نظام الإشعارات بـ Appwrite بالكامل! الآن يمكن للمستخدمين استقبال إشعارات فورية عن:
- ✅ تأكيد الطلبات
- 📦 شحن الطلبات
- 🎉 تسليم الطلبات
- 💰 عمولات الأفلييت
- ℹ️ تنبيهات عامة

## 🚀 خطوات الإعداد

### 1. إنشاء مجموعة الإشعارات في Appwrite

قم بتشغيل السكريبت التالي لإنشاء المجموعة تلقائياً:

```bash
cd scripts
node create-notifications-collection.mjs
```

**ملاحظة:** تأكد من وجود `APPWRITE_API_KEY` في ملف `.env`

### 2. التحقق من الإعداد

بعد تشغيل السكريبت، تحقق من:
- ✅ تم إنشاء مجموعة `notifications` في قاعدة البيانات
- ✅ تم إنشاء جميع الحقول (userId, type, title, message, read, relatedId, metadata)
- ✅ تم إنشاء الفهارس (indexes) للأداء الأمثل

### 3. اختبار النظام

1. سجل دخول بحساب مستخدم
2. قم بإنشاء طلب جديد
3. ستظهر إشعار فوري في الـ Bell icon
4. الإشعارات تحدث تلقائياً في الوقت الفعلي

## 🎯 الميزات

### ✅ الميزات المفعلة

1. **Real-time Updates** - التحديثات الفورية
   - اشتراك WebSocket لاستقبال الإشعارات فوراً
   - بدون الحاجة لتحديث الصفحة

2. **Unread Count** - عداد الإشعارات غير المقروءة
   - Badge أحمر يظهر عدد الإشعارات الجديدة
   - يختفي عند قراءة جميع الإشعارات

3. **Mark as Read** - تحديد كمقروء
   - النقر على الإشعار يحدده كمقروء تلقائياً
   - زر "تحديد الكل كمقروء" لتحديد جميع الإشعارات

4. **Notification Types** - أنواع الإشعارات
   - 📦 Order - طلبات
   - 🚚 Shipping - شحن
   - ✅ Delivery - تسليم
   - ⚠️ Alert - تنبيهات
   - ℹ️ Info - معلومات
   - 💰 Commission - عمولات
   - 🎯 Affiliate - أفلييت

5. **Auto Refresh** - تحديث تلقائي
   - يحدث كل 30 ثانية تلقائياً
   - + Real-time للتحديثات الفورية

6. **Navigation** - الانتقال للصفحات
   - النقر على إشعار الطلب ينقلك لصفحة الطلب
   - دعم `relatedId` للربط بين الإشعارات والصفحات

## 📁 الملفات المحدثة

### 1. `client/lib/notification-service.ts` (جديد)
خدمة الإشعارات الكاملة:
- `getUserNotifications()` - جلب إشعارات المستخدم
- `getUnreadCount()` - عدد الإشعارات غير المقروءة
- `createNotification()` - إنشاء إشعار جديد
- `markAsRead()` - تحديد كمقروء
- `markAllAsRead()` - تحديد الكل كمقروء
- `subscribeToNotifications()` - الاشتراك في التحديثات الفورية
- `notifyOrderStatus()` - إشعارات حالة الطلب
- `notifyAffiliateCommission()` - إشعارات العمولات

### 2. `client/components/NotificationDropdown.tsx` (محدث)
- استبدال mock data بـ Appwrite
- Real-time subscriptions
- التكامل مع notification-service

### 3. `client/lib/appwrite.ts` (محدث)
- إرسال إشعار تلقائي عند إنشاء طلب جديد

### 4. `scripts/create-notifications-collection.mjs` (جديد)
سكريبت إنشاء المجموعة تلقائياً

## 🔧 API Reference

### إنشاء إشعار

```typescript
import { notificationService } from '@/lib/notification-service';

// إشعار عادي
await notificationService.createNotification({
  userId: 'user123',
  type: 'info',
  title: 'عنوان الإشعار',
  message: 'نص الإشعار',
  relatedId: 'optional-id',
  metadata: { key: 'value' }
});

// إشعار حالة الطلب
await notificationService.notifyOrderStatus(
  'user123',
  'order456',
  'confirmed' // or 'shipped' or 'delivered' or 'cancelled'
);

// إشعار عمولة أفلييت
await notificationService.notifyAffiliateCommission(
  'affiliate123',
  50.00,
  'order456'
);
```

### الاشتراك في الإشعارات الفورية

```typescript
const unsubscribe = notificationService.subscribeToNotifications(
  userId,
  (notification) => {
    console.log('New notification:', notification);
  }
);

// عند الخروج
unsubscribe();
```

## 🎨 التخصيص

### تغيير أنواع الإشعارات

عدل في `notification-service.ts`:

```typescript
export interface Notification {
  type: 'order' | 'shipping' | 'delivery' | 'alert' | 'info' | 'commission' | 'affiliate' | 'your-new-type';
  // ...
}
```

ثم أضف الأيقونة في `NotificationDropdown.tsx`:

```typescript
const notificationIcons = {
  // ...
  'your-new-type': YourIcon,
};
```

### تغيير فترة التحديث التلقائي

في `NotificationDropdown.tsx`:

```typescript
const { data: notifications = [] } = useQuery({
  // ...
  refetchInterval: 30000, // غير هذا الرقم (بالميلي ثانية)
});
```

## 🐛 استكشاف الأخطاء

### الإشعارات لا تظهر؟

1. تأكد من إنشاء مجموعة notifications في Appwrite
2. تحقق من Console للأخطاء
3. تأكد من تسجيل الدخول بحساب صحيح
4. تحقق من أن `VITE_APPWRITE_DATABASE_ID` صحيح

### الإشعارات الفورية لا تعمل؟

1. تأكد من أن Appwrite يدعم Real-time في خطتك
2. تحقق من أن المجموعة تدعم Real-time Events
3. تحقق من Console للأخطاء في الاتصال

### السكريبت لا يعمل؟

1. تأكد من وجود `APPWRITE_API_KEY` في `.env`
2. تحقق من أن المفتاح له صلاحيات `databases.write`
3. تأكد من أن `DATABASE_ID` صحيح

## 📈 التحسينات المستقبلية

- [ ] إضافة تصنيفات للإشعارات
- [ ] إضافة إعدادات تخصيص الإشعارات
- [ ] إضافة أصوات للإشعارات الفورية
- [ ] إضافة صور/أيقونات مخصصة للإشعارات
- [ ] إضافة إشعارات البريد الإلكتروني
- [ ] إضافة إشعارات Push للموبايل

## ✅ الخلاصة

نظام الإشعارات الآن متصل بالكامل بـ Appwrite ويعمل بشكل real-time! 🎉

للأسئلة أو المساعدة، راجع:
- [Appwrite Databases Docs](https://appwrite.io/docs/products/databases)
- [Appwrite Realtime Docs](https://appwrite.io/docs/apis/realtime)
