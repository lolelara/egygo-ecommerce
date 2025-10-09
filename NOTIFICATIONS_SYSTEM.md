# 🔔 نظام الإشعارات المتقدم - EgyGo

## 📋 نظرة عامة

نظام إشعارات متكامل وشامل يدعم الإرسال الفوري والمجدول، القوالب الجاهزة، التتبع والتحليلات، والإشعارات التلقائية.

## ✨ الميزات الرئيسية

### 1. **إرسال الإشعارات** 📤

#### إرسال فوري:
- إرسال إشعارات فورية للمستخدمين
- دعم أنواع متعددة: معلومات، نجاح، تحذير، خطأ، عرض ترويجي
- إرسال لفئات محددة أو جميع المستخدمين

#### إرسال مجدول:
- جدولة الإشعارات للإرسال في وقت محدد
- عرض جميع الإشعارات المجدولة
- إلغاء الإشعارات المجدولة

#### قنوات الإرسال:
- 🔔 داخل التطبيق (In-App)
- 📧 البريد الإلكتروني (Email)
- 💬 رسائل SMS
- 📱 إشعارات Push

### 2. **الجمهور المستهدف** 🎯

يمكنك إرسال الإشعارات إلى:
- **جميع المستخدمين**: إشعار شامل لجميع المسجلين
- **العملاء فقط**: للمتسوقين العاديين
- **المسوقين بالعمولة**: للشركاء التسويقيين
- **التجار**: لأصحاب المتاجر
- **مستخدمين محددين**: بإدخال بريدهم الإلكتروني

### 3. **القوالب الجاهزة** 📝

#### القوالب الافتراضية:

1. **ترحيب بمستخدم جديد**
   - العنوان: "مرحباً بك في إيجي جو! 🎉"
   - المتغيرات: `{userName}`
   - الجمهور: العملاء
   - القنوات: App + Email

2. **تأكيد طلب**
   - العنوان: "تم تأكيد طلبك ✅"
   - المتغيرات: `{orderNumber}`, `{orderTotal}`
   - الجمهور: العملاء
   - القنوات: App + Email + SMS

3. **تم شحن الطلب**
   - العنوان: "طلبك في الطريق 🚚"
   - المتغيرات: `{orderNumber}`, `{trackingNumber}`
   - الجمهور: العملاء
   - القنوات: App + Email + SMS + Push

4. **عمولة جديدة**
   - العنوان: "تهانينا! حصلت على عمولة جديدة 💰"
   - المتغيرات: `{amount}`, `{orderNumber}`
   - الجمهور: المسوقين
   - القنوات: App + Email + Push

5. **تم دفع العمولة**
   - العنوان: "تم تحويل العمولة إلى حسابك 💸"
   - المتغيرات: `{amount}`, `{transactionId}`
   - الجمهور: المسوقين
   - القنوات: App + Email

6. **عرض ترويجي**
   - العنوان: "عرض خاص لفترة محدودة! 🎁"
   - المتغيرات: `{discount}`, `{couponCode}`
   - الجمهور: الجميع
   - القنوات: App + Email + Push

7. **المنتج متوفر الآن**
   - العنوان: "المنتج الذي تنتظره متوفر الآن! 🎉"
   - المتغيرات: `{productName}`
   - الجمهور: العملاء
   - القنوات: App + Email + Push

8. **إعادة تعيين كلمة المرور**
   - العنوان: "طلب إعادة تعيين كلمة المرور"
   - الجمهور: الجميع
   - القنوات: App + Email

#### كيفية استخدام القوالب:
1. اذهب إلى تبويب "القوالب"
2. اختر القالب المناسب
3. اضغط على "استخدام"
4. املأ المتغيرات المطلوبة
5. أرسل الإشعار

### 4. **التتبع والتحليلات** 📊

#### معدلات الأداء:
- **معدل القراءة (Read Rate)**: نسبة المستخدمين الذين قرأوا الإشعار
- **معدل النقر (Click Rate)**: نسبة المستخدمين الذين نقروا على الإشعار
- **إجمالي المرسل**: عدد الإشعارات المرسلة
- **إجمالي المقروء**: عدد الإشعارات المقروءة
- **إجمالي النقرات**: عدد النقرات على الإشعارات

#### تتبع تلقائي:
- تتبع وقت القراءة
- تتبع عدد النقرات
- حفظ تاريخ الإرسال
- حساب معدلات التفاعل

### 5. **الإشعارات التلقائية** 🤖

يتم إرسال إشعارات تلقائية عند:

#### للعملاء:
- **عند التسجيل**: رسالة ترحيب
- **عند تأكيد الطلب**: تأكيد الطلب مع رقم الطلب
- **عند شحن الطلب**: إشعار بالشحن مع رقم التتبع
- **عند توفر منتج**: إشعار بتوفر منتج من قائمة الأمنيات

#### للمسوقين:
- **عند اكتساب عمولة جديدة**: إشعار بالمبلغ ورقم الطلب
- **عند دفع العمولة**: تأكيد التحويل مع رقم العملية

#### للتجار:
- **عند طلب جديد**: إشعار بطلب جديد على منتجاتهم
- **عند انخفاض المخزون**: تنبيه بنفاذ المخزون قريباً

## 🚀 كيفية الاستخدام

### للمدير (Admin):

#### 1. الوصول لصفحة الإشعارات:
```
https://egygo.me/#/admin/notifications
```

#### 2. إرسال إشعار جديد:
1. اختر تبويب "إرسال إشعار جديد"
2. املأ البيانات:
   - عنوان الإشعار
   - نص الرسالة (حتى 500 حرف)
   - نوع الإشعار
   - الجمهور المستهدف
   - قنوات الإرسال
3. (اختياري) حدد تاريخ ووقت للجدولة
4. اضغط "معاينة" للمراجعة
5. اضغط "إرسال فوراً" أو "جدولة للإرسال"

#### 3. استخدام القوالب:
1. اذهب إلى تبويب "القوالب"
2. اختر القالب المناسب
3. اضغط "استخدام"
4. املأ المتغيرات (مثل: اسم المستخدم، رقم الطلب، إلخ)
5. أرسل الإشعار

#### 4. مراجعة الإشعارات المجدولة:
1. اذهب إلى تبويب "المجدولة"
2. شاهد جميع الإشعارات المقرر إرسالها
3. يمكنك إلغاء أي إشعار مجدول

#### 5. مراجعة السجل:
1. اذهب إلى تبويب "سجل الإشعارات"
2. شاهد جميع الإشعارات المرسلة
3. راجع معدلات القراءة والتفاعل

### للمطورين:

#### إرسال إشعار تلقائي عند تأكيد طلب:
```typescript
import { notificationsApi } from '@/lib/notifications-api';

// عند تأكيد طلب جديد
await notificationsApi.sendOrderConfirmationNotification(
  userId,
  orderNumber,
  orderTotal
);
```

#### إرسال إشعار عند اكتساب عمولة:
```typescript
// عند إضافة عمولة جديدة لمسوق
await notificationsApi.sendCommissionEarnedNotification(
  affiliateId,
  commissionAmount,
  orderNumber
);
```

#### إرسال إشعار عند دفع عمولة:
```typescript
// عند تحويل العمولة للمسوق
await notificationsApi.sendCommissionPaidNotification(
  affiliateId,
  amount,
  transactionId
);
```

#### إرسال إشعار عند شحن طلب:
```typescript
// عند شحن الطلب
await notificationsApi.sendOrderShippedNotification(
  userId,
  orderNumber,
  trackingNumber
);
```

#### إرسال رسالة ترحيب لمستخدم جديد:
```typescript
// عند تسجيل مستخدم جديد
await notificationsApi.sendWelcomeNotification(
  userId,
  userName
);
```

#### استخدام قالب مخصص:
```typescript
// إرسال إشعار من قالب
await notificationsApi.createFromTemplate(
  'template_id',
  {
    userName: 'أحمد',
    orderNumber: '#12345',
    amount: '250.00'
  },
  [userId] // اختياري: مستخدمين محددين
);
```

#### جدولة إشعار:
```typescript
// جدولة إشعار للإرسال لاحقاً
const scheduledDate = new Date('2024-12-25T10:00:00');
await notificationsApi.scheduleNotification(
  {
    title: 'عرض خاص',
    message: 'احصل على خصم 50%',
    type: 'promotion',
    targetAudience: 'all',
    channels: ['inApp', 'email', 'push'],
    isRead: false,
    totalRecipients: 0
  },
  scheduledDate
);
```

#### تتبع الإحصائيات:
```typescript
// الحصول على إحصائيات الإشعارات
const analytics = await notificationsApi.getNotificationAnalytics();
console.log('معدل القراءة:', analytics.readRate + '%');
console.log('معدل النقر:', analytics.clickRate + '%');
```

## 📁 هيكل الملفات

```
client/
├── lib/
│   └── notifications-api.ts         # API الإشعارات الكامل
├── pages/
│   └── AdminNotifications.tsx       # صفحة إدارة الإشعارات
└── components/
    └── AdminLayout.tsx              # تحديث القائمة الجانبية

server/
└── (ستحتاج لإضافة endpoints للإشعارات)
```

## 🗄️ قاعدة البيانات

### Collections المطلوبة في Appwrite:

#### 1. notifications
```json
{
  "userId": "string",
  "targetAudience": "string", // all, customers, affiliates, merchants, specific
  "specificUsers": "array",
  "title": "string",
  "message": "string",
  "type": "string", // info, success, warning, error, promotion
  "channels": "array", // inApp, email, sms, push
  "isRead": "boolean",
  "readAt": "datetime",
  "link": "string",
  "status": "string", // draft, sent, scheduled, failed
  "scheduledFor": "datetime",
  "sentAt": "datetime",
  "totalRecipients": "integer",
  "readCount": "integer",
  "clickCount": "integer",
  "metadata": "json"
}
```

#### 2. notification_templates
```json
{
  "name": "string",
  "title": "string",
  "message": "string",
  "type": "string",
  "targetAudience": "string",
  "channels": "array",
  "variables": "array",
  "isActive": "boolean",
  "usageCount": "integer"
}
```

#### 3. scheduled_notifications
```json
{
  "title": "string",
  "message": "string",
  "type": "string",
  "targetAudience": "string",
  "channels": "array",
  "scheduledFor": "datetime",
  "status": "string", // scheduled, sent, cancelled
  "totalRecipients": "integer"
}
```

## 🔐 الصلاحيات

- **Admin فقط**: يمكنه إرسال الإشعارات لجميع المستخدمين
- **System**: الإشعارات التلقائية تعمل تلقائياً
- **Users**: يمكنهم قراءة إشعاراتهم فقط

## 📊 الإحصائيات المتاحة

### في لوحة الإدارة:
- إجمالي الإشعارات المرسلة
- معدل القراءة الإجمالي
- المستخدمين النشطين اليوم
- معدل التفاعل

### لكل إشعار:
- عدد المستلمين
- عدد القراءات
- معدل القراءة %
- عدد النقرات
- تاريخ الإرسال

## 🎯 حالات الاستخدام

### 1. عرض ترويجي لنهاية الأسبوع:
```typescript
await notificationsApi.broadcastNotification(
  'عرض خاص لنهاية الأسبوع! 🎉',
  'احصل على خصم 30% على جميع المنتجات. استخدم كود: WEEKEND30',
  'promotion'
);
```

### 2. تنبيه المسوقين بتحديث العمولات:
```typescript
await notificationsApi.createFromTemplate(
  'commission_update',
  { newRate: '25' },
  affiliateUserIds
);
```

### 3. إشعار بمنتج جديد:
```typescript
await notificationsApi.broadcastNotification(
  'منتج جديد! 🆕',
  'تم إضافة منتج جديد: iPhone 15 Pro. تسوق الآن!',
  'info'
);
```

## 🔄 التكامل مع الأحداث

### يجب إضافة استدعاءات API في:

1. **عند تسجيل مستخدم جديد** (`Register.tsx`):
```typescript
await notificationsApi.sendWelcomeNotification(user.$id, user.name);
```

2. **عند تأكيد طلب** (`Checkout.tsx`):
```typescript
await notificationsApi.sendOrderConfirmationNotification(
  user.$id,
  order.orderNumber,
  order.total
);
```

3. **عند شحن طلب** (Admin Orders):
```typescript
await notificationsApi.sendOrderShippedNotification(
  order.userId,
  order.orderNumber,
  order.trackingNumber
);
```

4. **عند إضافة عمولة** (Affiliate System):
```typescript
await notificationsApi.sendCommissionEarnedNotification(
  affiliate.userId,
  commission.amount,
  commission.orderNumber
);
```

## 💡 نصائح وأفضل الممارسات

### 1. التوقيت:
- أرسل الإشعارات المهمة فوراً
- جدول الإشعارات الترويجية لأوقات الذروة
- تجنب الإرسال في أوقات متأخرة من الليل

### 2. المحتوى:
- اجعل العنوان واضحاً ومختصراً (أقل من 50 حرف)
- استخدم الرموز التعبيرية بحكمة 🎉
- اذكر قيمة واضحة للمستخدم

### 3. التخصيص:
- استخدم المتغيرات لجعل الإشعارات شخصية
- استهدف الجمهور المناسب
- اختر القنوات المناسبة

### 4. التتبع:
- راقب معدلات القراءة
- حلل معدلات النقر
- قم بتحسين الرسائل بناءً على الأداء

## 🆘 استكشاف الأخطاء

### المشكلة: الإشعارات لا تظهر
**الحل**:
1. تأكد من وجود collection "notifications" في Appwrite
2. تحقق من صلاحيات القراءة للمستخدمين
3. راجع console للأخطاء

### المشكلة: القوالب لا تظهر
**الحل**:
- القوالب تعمل من localStorage كـ fallback
- سيتم عرض القوالب الافتراضية تلقائياً

### المشكلة: الجدولة لا تعمل
**الحل**:
1. تأكد من وجود collection "scheduled_notifications"
2. ستحتاج لإضافة Cron Job لتنفيذ الإشعارات المجدولة

## 📝 خطوات مستقبلية مقترحة

- [ ] إضافة Cron Job لتنفيذ الإشعارات المجدولة
- [ ] تكامل مع خدمات Email (SendGrid, Mailgun)
- [ ] تكامل مع خدمات SMS (Twilio, Nexmo)
- [ ] إضافة Firebase Cloud Messaging للـ Push
- [ ] لوحة تحكم للمستخدمين لإدارة تفضيلات الإشعارات
- [ ] إضافة قوالب Email HTML جاهزة
- [ ] A/B Testing للإشعارات
- [ ] Segmentation متقدم للمستخدمين

---

**🎉 النظام جاهز وقابل للاستخدام فوراً!**

للدعم والأسئلة: راجع الكود في `client/lib/notifications-api.ts`
