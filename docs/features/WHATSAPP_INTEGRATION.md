# 📱 WhatsApp Business Integration Guide

## 🎯 Overview

تكامل كامل مع WhatsApp Business API لإرسال:
- ✅ إشعارات الطلبات
- ✅ رسائل الموافقة/الرفض
- ✅ إشعارات العمولات
- ✅ رسائل تسويقية
- ✅ دعم العملاء

---

## 🔧 **Setup Instructions**

### **1. إنشاء WhatsApp Business Account**

1. اذهب إلى [Facebook Developers](https://developers.facebook.com/)
2. أنشئ تطبيق جديد
3. اختر "Business" → "WhatsApp"
4. أكمل البيانات المطلوبة

### **2. احصل على Access Token**

1. من لوحة تحكم التطبيق
2. اذهب إلى WhatsApp → Getting Started
3. انسخ الـ Temporary Access Token
4. (للإنتاج: احصل على Permanent Access Token)

### **3. إضافة المتغيرات في `.env`**

```env
# WhatsApp Business Configuration
VITE_WHATSAPP_BUSINESS_PHONE=+201234567890
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token_here
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
VITE_WHATSAPP_WEBHOOK_TOKEN=your_webhook_verify_token
```

### **4. تفعيل رقم الهاتف**

1. في لوحة التحكم، اذهب إلى Phone Numbers
2. أضف رقم هاتف العمل
3. أكمل التحقق (OTP)

---

## 📦 **Features Implemented**

### **1. WhatsApp Service** (`client/lib/whatsapp-service.ts`)

```typescript
// إرسال رسالة عادية
await sendWhatsAppMessage('+201234567890', 'مرحباً!');

// إرسال تأكيد طلب
await sendOrderConfirmation({
  orderId: 'ORD-123',
  customerName: 'أحمد',
  customerPhone: '+201234567890',
  orderTotal: 500,
  orderItems: '- منتج 1\n- منتج 2',
  orderStatus: 'تم التأكيد'
});

// إرسال إشعار موافقة
await sendAccountApprovalNotification(
  '+201234567890',
  'أحمد',
  'merchant'
);

// إرسال إشعار عمولة
await sendCommissionNotification(
  '+201234567890',
  150.50,
  'ORD-123'
);

// إرسال رسائل جماعية
await sendBulkMessages([
  { phone: '+201234567890', message: 'رسالة 1' },
  { phone: '+201098765432', message: 'رسالة 2' }
], 1000); // 1 second delay
```

### **2. WhatsApp Button** (`client/components/WhatsAppButton.tsx`)

زر عائم في كل الصفحات:
- ✅ موضع قابل للتخصيص (يمين/يسار)
- ✅ نافذة دردشة سريعة
- ✅ رسائل جاهزة
- ✅ رسالة مخصصة
- ✅ تصميم جذاب مع animation

### **3. Admin Panel** (`client/pages/AdminWhatsAppManager.tsx`)

لوحة تحكم كاملة:
- ✅ إرسال رسائل فردية
- ✅ إرسال رسائل جماعية
- ✅ قوالب رسائل جاهزة
- ✅ سجل الرسائل
- ✅ إحصائيات

---

## 🎨 **Usage Examples**

### **في Checkout (عند إتمام الطلب):**

```typescript
import { sendOrderConfirmation } from '@/lib/whatsapp-service';

// بعد إنشاء الطلب
await sendOrderConfirmation({
  orderId: order.$id,
  customerName: user.name,
  customerPhone: user.phone,
  orderTotal: cartTotal,
  orderItems: cartItems.map(item => `- ${item.name} (x${item.quantity})`).join('\n'),
  orderStatus: 'تم التأكيد'
});
```

### **في Admin (عند الموافقة على حساب):**

```typescript
import { sendAccountApprovalNotification } from '@/lib/whatsapp-service';

// عند الموافقة
await sendAccountApprovalNotification(
  user.phone,
  user.name,
  user.isMerchant ? 'merchant' : 'affiliate'
);
```

### **في Affiliate (عند كسب عمولة):**

```typescript
import { sendCommissionNotification } from '@/lib/whatsapp-service';

// عند إتمام عملية شراء من رابط إحالة
await sendCommissionNotification(
  affiliate.phone,
  commission.amount,
  order.$id
);
```

---

## 🔔 **Message Templates**

### **1. Order Confirmation**
```
🎉 تم تأكيد طلبك بنجاح!

رقم الطلب: ORD-12345
العميل: أحمد محمد
الإجمالي: 500 ج.م

المنتجات:
- منتج 1 (x2)
- منتج 2 (x1)

الحالة: تم التأكيد

شكراً لتسوقك معنا! 🛍️
```

### **2. Account Approval**
```
✅ تم قبول طلبك!

مرحباً أحمد،

تم الموافقة على حسابك كـ *التاجر*! 🎉

يمكنك الآن الدخول إلى لوحة التحكم والبدء.

نتمنى لك تجربة ممتعة ومربحة! 💰
```

### **3. Commission Notification**
```
💰 عمولة جديدة!

تهانينا! حصلت على عمولة جديدة:

المبلغ: 150.50 ج.م
الطلب: ORD-12345

يمكنك مراجعة أرباحك من لوحة التحكم.

استمر في التسويق! 🚀
```

### **4. Order Status Update**
```
📦 تحديث حالة الطلب

رقم الطلب: ORD-12345
الحالة الجديدة: تم الشحن
رقم التتبع: TR123456

يمكنك تتبع طلبك من خلال الموقع.
```

---

## 🚀 **Testing in Development**

في وضع التطوير (Development Mode):
- ✅ الرسائل تُطبع في Console
- ✅ لا يتم إرسال رسائل حقيقية
- ✅ يمكن اختبار جميع الوظائف

```typescript
// في dev mode
if (import.meta.env.DEV) {
  console.log('📱 WhatsApp Message (Dev Mode):');
  console.log(`To: ${phone}`);
  console.log(`Message: ${message}`);
  return true;
}
```

---

## 🔐 **Security Best Practices**

### **1. حماية Access Token:**
```env
# ❌ لا تضع في الكود مباشرة
const token = 'EAAxxxxx';

# ✅ استخدم .env
const token = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
```

### **2. Rate Limiting:**
```typescript
// استخدم delay بين الرسائل الجماعية
await sendBulkMessages(recipients, 1000); // 1 second delay
```

### **3. Phone Number Validation:**
```typescript
// التحقق من صيغة الرقم
const formattedPhone = formatPhoneNumber(phone);
// +20 1234567890
```

---

## 📊 **Admin Panel Guide**

### **الوصول:**
```
/admin/whatsapp
```

### **الميزات:**

1. **رسالة فردية:**
   - أدخل رقم الهاتف
   - اكتب الرسالة
   - أو اختر قالب جاهز
   - اضغط "إرسال"

2. **رسالة جماعية:**
   - أدخل أرقام الهواتف (كل رقم في سطر)
   - اكتب الرسالة الموحدة
   - اختر التأخير بين الرسائل
   - اضغط "إرسال للجميع"

3. **القوالب:**
   - عرض جميع القوالب الجاهزة
   - استخدام أي قالب بضغطة واحدة
   - تخصيص القالب حسب الحاجة

4. **السجل:**
   - عرض آخر الرسائل المرسلة
   - حالة كل رسالة (تم التوصيل/فشل)
   - وقت الإرسال

---

## 🎯 **Integration Points**

### **1. Checkout Page:**
```typescript
// عند إتمام الطلب
await sendOrderConfirmation(orderData);
```

### **2. Admin Pending Accounts:**
```typescript
// عند الموافقة/الرفض
if (approved) {
  await sendAccountApprovalNotification(phone, name, type);
} else {
  await sendAccountRejectionNotification(phone, name, reason);
}
```

### **3. Affiliate Dashboard:**
```typescript
// عند كسب عمولة جديدة
await sendCommissionNotification(phone, amount, orderId);
```

### **4. Order Tracking:**
```typescript
// عند تحديث حالة الطلب
await sendOrderStatusUpdate(phone, orderId, newStatus, trackingNumber);
```

---

## 🔄 **Webhook Integration (Optional)**

لاستقبال رسائل من العملاء:

### **1. إعداد Webhook Endpoint:**

```typescript
// server/api/whatsapp-webhook.ts
export async function POST(req: Request) {
  const body = await req.json();
  const message = handleWebhook(body);
  
  if (message) {
    // معالجة الرسالة الواردة
    console.log(`Message from ${message.from}: ${message.message}`);
  }
  
  return new Response('OK', { status: 200 });
}
```

### **2. تفعيل في Facebook:**
1. اذهب إلى WhatsApp → Configuration
2. أضف Webhook URL: `https://yourdomain.com/api/whatsapp-webhook`
3. أضف Verify Token
4. اشترك في الأحداث المطلوبة

---

## 📱 **WhatsApp Button Customization**

### **Position:**
```tsx
<WhatsAppButton position="bottom-right" /> // يمين
<WhatsAppButton position="bottom-left" />  // يسار
```

### **Quick Chat:**
```tsx
<WhatsAppButton showQuickChat={true} />  // مع نافذة دردشة
<WhatsAppButton showQuickChat={false} /> // بدون (فتح مباشر)
```

### **Custom Phone:**
```tsx
<WhatsAppButton phone="+201234567890" />
```

### **Pre-filled Message:**
```tsx
<WhatsAppButton message="مرحباً، أحتاج مساعدة" />
```

---

## 🧪 **Testing Checklist**

- [ ] إرسال رسالة فردية ✅
- [ ] إرسال رسالة جماعية ✅
- [ ] استخدام القوالب ✅
- [ ] زر WhatsApp العائم يظهر ✅
- [ ] نافذة الدردشة السريعة تعمل ✅
- [ ] الرسائل السريعة تعمل ✅
- [ ] تنسيق أرقام الهواتف صحيح ✅
- [ ] Admin Panel يعمل ✅
- [ ] Dev Mode يطبع الرسائل ✅

---

## 🐛 **Troubleshooting**

### **المشكلة: الرسائل لا تُرسل**

**الحل:**
1. تأكد من Access Token صحيح
2. تحقق من Phone Number ID
3. تحقق من رصيد الحساب في Facebook
4. راجع Network tab في DevTools

### **المشكلة: خطأ 401 Unauthorized**

**الحل:**
```env
# تحقق من Token في .env
VITE_WHATSAPP_ACCESS_TOKEN=your_correct_token
```

### **المشكلة: خطأ 400 Bad Request**

**الحل:**
- تحقق من صيغة رقم الهاتف
- يجب أن يبدأ بـ country code (+20 لمصر)
- بدون مسافات أو رموز خاصة

---

## 📈 **Future Enhancements**

- [ ] Rich Media Messages (صور، فيديوهات)
- [ ] Interactive Buttons
- [ ] List Messages
- [ ] Templates with Variables
- [ ] Analytics Dashboard
- [ ] Auto-replies
- [ ] Chatbot Integration

---

## 📞 **Support**

للمساعدة والاستفسارات:
- WhatsApp: +20 123 456 7890
- Email: support@egygo.me
- Documentation: https://developers.facebook.com/docs/whatsapp

---

**تم إنشاء هذا النظام بواسطة:** EgyGo Development Team  
**التاريخ:** October 2025  
**الحالة:** ✅ Production Ready

---

**🎉 WhatsApp Integration is now live!**
