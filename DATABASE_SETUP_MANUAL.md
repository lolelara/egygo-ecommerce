# 🗄️ دليل إعداد قاعدة البيانات - EgyGo

## المشكلة الحالية
الصفحة `/admin/users` تعرض رسالة تحذير لأن collection `users` غير موجود في Appwrite.

## ✅ الحل: إنشاء Collections يدوياً

### الخطوة 1: افتح Appwrite Console

1. اذهب إلى: https://cloud.appwrite.io/console
2. اختر مشروعك: `egygo-ecommerce`
3. من القائمة الجانبية، اختر **Databases**
4. افتح Database: `main` (ID: `68de037e003bd03c4d45`)

---

## 📦 Collection 1: Users

### إنشاء Collection:
- اضغط **Create Collection**
- Collection ID: `users`
- Name: `Users`
- Permissions: 
  - `read("any")`
  - `create("users")`
  - `update("users")`
  - `delete("users")`

### Attributes المطلوبة:

| Attribute | Type | Size | Required | Default | Notes |
|-----------|------|------|----------|---------|-------|
| `email` | String | 255 | ✅ Yes | - | البريد الإلكتروني |
| `name` | String | 255 | ❌ No | - | اسم المستخدم |
| `userName` | String | 255 | ❌ No | - | اسم المستخدم البديل |
| `avatar` | String | 2000 | ❌ No | - | رابط الصورة |
| `profileImage` | String | 2000 | ❌ No | - | صورة البروفايل |
| `role` | Enum | - | ✅ Yes | `USER` | Options: USER, ADMIN, MERCHANT, AFFILIATE |
| `isActive` | Boolean | - | ❌ No | `true` | حالة النشاط |
| `isAdmin` | Boolean | - | ❌ No | `false` | هل مدير |
| `isAffiliate` | Boolean | - | ❌ No | `false` | هل مسوق بالعمولة |
| `isMerchant` | Boolean | - | ❌ No | `false` | هل تاجر |
| `phone` | String | 50 | ❌ No | - | رقم الهاتف |
| `affiliateCode` | String | 50 | ❌ No | - | كود المسوق |
| `commissionRate` | Float | - | ❌ No | `15` | نسبة العمولة % |
| `totalEarnings` | Float | - | ❌ No | `0` | إجمالي الأرباح |
| `pendingEarnings` | Float | - | ❌ No | `0` | الأرباح المعلقة |
| `referralCount` | Integer | - | ❌ No | `0` | عدد الإحالات (min: 0, max: 999999) |
| `lastActivity` | DateTime | - | ❌ No | - | آخر نشاط |
| `status` | String | 50 | ❌ No | `active` | حالة الحساب |

---

## 🔔 Collection 2: Notifications

### إنشاء Collection:
- Collection ID: `notifications`
- Name: `Notifications`

### Attributes المطلوبة:

| Attribute | Type | Size | Required | Default | Notes |
|-----------|------|------|----------|---------|-------|
| `userId` | String | 255 | ❌ No | - | معرف المستخدم |
| `targetAudience` | String | 50 | ✅ Yes | `all` | الجمهور المستهدف |
| `title` | String | 500 | ✅ Yes | - | عنوان الإشعار |
| `message` | String | 2000 | ✅ Yes | - | نص الإشعار |
| `type` | Enum | - | ✅ Yes | `info` | Options: info, success, warning, error, promotion |
| `isRead` | Boolean | - | ❌ No | `false` | هل تمت القراءة |
| `readAt` | DateTime | - | ❌ No | - | وقت القراءة |
| `link` | String | 2000 | ❌ No | - | رابط الإشعار |
| `status` | Enum | - | ❌ No | `sent` | Options: draft, sent, scheduled, failed |
| `scheduledFor` | DateTime | - | ❌ No | - | موعد الإرسال المجدول |
| `sentAt` | DateTime | - | ❌ No | - | وقت الإرسال الفعلي |
| `totalRecipients` | Integer | - | ❌ No | `0` | عدد المستلمين |
| `readCount` | Integer | - | ❌ No | `0` | عدد القراءات |
| `clickCount` | Integer | - | ❌ No | `0` | عدد النقرات |

---

## 💰 Collection 3: Commissions

### إنشاء Collection:
- Collection ID: `commissions`
- Name: `Commissions`

### Attributes المطلوبة:

| Attribute | Type | Size | Required | Default | Notes |
|-----------|------|------|----------|---------|-------|
| `affiliateId` | String | 255 | ✅ Yes | - | معرف المسوق |
| `orderId` | String | 255 | ✅ Yes | - | رقم الطلب |
| `productId` | String | 255 | ❌ No | - | معرف المنتج |
| `productName` | String | 500 | ❌ No | - | اسم المنتج |
| `amount` | Float | - | ✅ Yes | `0` | مبلغ العمولة |
| `percentage` | Float | - | ❌ No | `15` | نسبة العمولة |
| `status` | Enum | - | ✅ Yes | `pending` | Options: pending, approved, paid, cancelled |
| `paidAt` | DateTime | - | ❌ No | - | تاريخ الدفع |

---

## 📋 Collection 4: Notification Templates

### إنشاء Collection:
- Collection ID: `notification_templates`
- Name: `Notification Templates`

### Attributes المطلوبة:

| Attribute | Type | Size | Required | Default | Notes |
|-----------|------|------|----------|---------|-------|
| `name` | String | 255 | ✅ Yes | - | اسم القالب |
| `title` | String | 500 | ✅ Yes | - | عنوان القالب |
| `message` | String | 2000 | ✅ Yes | - | نص القالب |
| `type` | Enum | - | ✅ Yes | `info` | Options: info, success, warning, error, promotion |
| `targetAudience` | String | 50 | ✅ Yes | `all` | الجمهور المستهدف |
| `isActive` | Boolean | - | ❌ No | `true` | هل القالب نشط |
| `usageCount` | Integer | - | ❌ No | `0` | عدد مرات الاستخدام |

---

## 🔗 Collections إضافية (اختيارية)

### Collection 5: Scheduled Notifications
- Collection ID: `scheduled_notifications`
- **Attributes**: title, message, type, targetAudience, scheduledFor (DateTime), status

### Collection 6: Affiliate Clicks
- Collection ID: `affiliate_clicks`
- **Attributes**: linkId, affiliateId, productId, ip, userAgent, referer, timestamp

### Collection 7: Affiliate Conversions
- Collection ID: `affiliate_conversions`
- **Attributes**: affiliateId, orderId, productId, amount, commission, timestamp

### Collection 8: Affiliate Links
- Collection ID: `affiliate_links`
- **Attributes**: affiliateId, url, productId, clicks, conversions, earnings, source, campaign

### Collection 9: Withdrawal Requests
- Collection ID: `withdrawal_requests`
- **Attributes**: affiliateId, amount, method, status, accountDetails, requestedAt, processedAt

---

## 🎯 الأولويات

### إنشاء الآن (مطلوب):
1. ✅ **Users** - لإظهار المستخدمين في `/admin/users`
2. ✅ **Notifications** - لنظام الإشعارات
3. ✅ **Commissions** - لعمولات المسوقين
4. ✅ **Notification Templates** - للقوالب الجاهزة

### إنشاء لاحقاً (محسّنات):
5. Scheduled Notifications
6. Affiliate Clicks
7. Affiliate Conversions
8. Affiliate Links
9. Withdrawal Requests

---

## 📝 نصائح مهمة

### 1. Permissions
تأكد من ضبط Permissions بشكل صحيح:
- `read("any")` - أي شخص يمكنه القراءة
- `create("users")` - المستخدمين المسجلين يمكنهم الإضافة
- `update("users")` - المستخدمين المسجلين يمكنهم التعديل
- `delete("users")` - المستخدمين المسجلين يمكنهم الحذف

### 2. Indexes (للأداء الأفضل)
بعد إنشاء الـ collections، أضف indexes على:
- `users.email` (unique)
- `users.isAffiliate`
- `users.role`
- `commissions.affiliateId`
- `commissions.status`
- `notifications.userId`
- `notifications.isRead`

### 3. إضافة مستخدمين تجريبيين
بعد إنشاء collection `users`، أضف بعض المستخدمين التجريبيين:

```json
{
  "email": "admin@egygo.com",
  "name": "مدير النظام",
  "role": "ADMIN",
  "isActive": true,
  "isAdmin": true
}
```

```json
{
  "email": "affiliate@egygo.com",
  "name": "مسوق بالعمولة",
  "role": "AFFILIATE",
  "isActive": true,
  "isAffiliate": true,
  "affiliateCode": "AFF001",
  "commissionRate": 20,
  "totalEarnings": 1500,
  "pendingEarnings": 500,
  "referralCount": 25
}
```

---

## 🔧 استخدام Appwrite CLI (بديل)

إذا كنت تفضل استخدام CLI:

### 1. تسجيل الدخول:
```bash
appwrite login
```

### 2. تشغيل الـ script:
```bash
powershell -ExecutionPolicy Bypass -File setup-collections.ps1
```

**ملاحظة**: يجب تسجيل الدخول أولاً عبر CLI.

---

## ✅ التحقق من النجاح

بعد إنشاء Collections:

1. افتح `/admin/users` - يجب أن تختفي رسالة التحذير
2. إذا لم توجد بيانات، ستظهر رسالة "لا يوجد مستخدمين" (بدون بيانات وهمية)
3. أضف مستخدمين من Appwrite Console
4. أعد تحميل الصفحة - يجب أن تظهر البيانات الحقيقية

---

## 🆘 المساعدة

إذا واجهت مشاكل:

1. **Collection already exists**: تجاهل الخطأ، المهم أن الـ collection موجود
2. **Attribute already exists**: نفس الشيء، تجاهل
3. **Permission denied**: تأكد من صلاحيات حسابك في Appwrite
4. **لا تظهر البيانات**: تأكد من:
   - Collection ID صحيح في `.env`
   - Permissions مضبوطة صح
   - أضفت بيانات للـ collection

---

**🎉 بعد إنشاء Collections، سيعمل النظام بشكل صحيح وستظهر البيانات الحقيقية!**
