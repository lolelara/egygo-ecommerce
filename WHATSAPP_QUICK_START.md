# 🚀 WhatsApp Integration - Quick Start Guide

## ⚡ **5 دقائق للبدء**

---

## ✅ **ما تم إضافته**

### **1. WhatsApp Button في كل الصفحات** 📱
- زر أخضر عائم في الجانب الأيسر
- يفتح نافذة دردشة سريعة
- رسائل جاهزة للاختيار
- تصميم احترافي مع animations

### **2. Admin Panel للواتساب** 💼
- **الرابط:** `/admin/whatsapp`
- إرسال رسائل فردية وجماعية
- قوالب جاهزة (ترحيب، شحن، عروض، تذكير)
- سجل الرسائل
- إحصائيات

### **3. إشعارات تلقائية** 🔔
- إشعار عند إتمام الطلب
- إشعار عند الموافقة على الحساب
- إشعار عند كسب عمولة (للمسوقين)
- إشعار عند تحديث حالة الطلب

---

## 🔧 **الإعداد (خطوة واحدة)**

أضف هذه المتغيرات في ملف `.env`:

```env
# WhatsApp Business Configuration
VITE_WHATSAPP_BUSINESS_PHONE=+201234567890
VITE_WHATSAPP_ACCESS_TOKEN=your_access_token_here
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

**ملاحظة:** في وضع Dev، الرسائل تُطبع في Console فقط (لا ترسل حقيقياً)

---

## 🎯 **كيفية الاستخدام**

### **للمستخدمين (العملاء):**

1. افتح أي صفحة في الموقع
2. اضغط على الزر الأخضر في الأسفل (يسار)
3. اختر رسالة سريعة أو اكتب رسالتك
4. اضغط "إرسال"
5. سيتم فتح واتساب مباشرة

### **للمديرين (Admins):**

1. اذهب إلى `/admin/whatsapp`
2. اختر Tab "رسالة فردية" أو "رسالة جماعية"
3. أدخل رقم الهاتف والرسالة
4. أو استخدم قالب جاهز
5. اضغط "إرسال"

---

## 📋 **القوالب الجاهزة**

### **1. ترحيب**
```
🎉 مرحباً بك في EgyGo!

شكراً لانضمامك إلينا.
نحن سعداء بوجودك معنا.

استمتع بتجربة تسوق فريدة!
```

### **2. شحن الطلب**
```
📦 تم شحن طلبك!

رقم الطلب: {orderId}
رقم التتبع: {trackingNumber}

يمكنك تتبع شحنتك الآن.
```

### **3. عرض خاص**
```
🔥 عرض خاص لـ 24 ساعة فقط!

خصم يصل لـ 50% على منتجات مختارة.

لا تفوت الفرصة!
```

### **4. تذكير بالدفع**
```
💳 تذكير بالدفع

رقم الطلب: {orderId}
المبلغ: {amount} ج.م

يرجى إتمام الدفع لإكمال طلبك.
```

---

## 💡 **أمثلة الاستخدام**

### **إرسال إشعار طلب:**

```typescript
import { sendOrderConfirmation } from '@/lib/whatsapp-service';

await sendOrderConfirmation({
  orderId: 'ORD-12345',
  customerName: 'أحمد محمد',
  customerPhone: '+201234567890',
  orderTotal: 500,
  orderItems: '- منتج 1 (x2)\n- منتج 2 (x1)',
  orderStatus: 'تم التأكيد'
});
```

### **إرسال إشعار موافقة:**

```typescript
import { sendAccountApprovalNotification } from '@/lib/whatsapp-service';

await sendAccountApprovalNotification(
  '+201234567890',
  'أحمد محمد',
  'merchant' // أو 'affiliate'
);
```

### **إرسال إشعار عمولة:**

```typescript
import { sendCommissionNotification } from '@/lib/whatsapp-service';

await sendCommissionNotification(
  '+201234567890',
  150.50, // المبلغ
  'ORD-12345' // رقم الطلب
);
```

---

## ✨ **الميزات الإضافية**

### **1. Button Customization:**

```tsx
// Position يمين
<WhatsAppButton position="bottom-right" />

// Position يسار (default)
<WhatsAppButton position="bottom-left" />

// بدون نافذة دردشة (فتح مباشر)
<WhatsAppButton showQuickChat={false} />
```

### **2. Generate Links:**

```typescript
import { generateWhatsAppLink, generateSupportLink } from '@/lib/whatsapp-service';

// رابط مع رسالة مخصصة
const link = generateWhatsAppLink('+201234567890', 'مرحباً!');

// رابط دعم مع رقم طلب
const supportLink = generateSupportLink('ORD-12345');
```

### **3. Bulk Messages:**

```typescript
import { sendBulkMessages } from '@/lib/whatsapp-service';

const recipients = [
  { phone: '+201234567890', message: 'رسالة 1' },
  { phone: '+201098765432', message: 'رسالة 2' },
];

const result = await sendBulkMessages(recipients, 1000); // 1 second delay
console.log(`Success: ${result.success}, Failed: ${result.failed}`);
```

---

## 🎨 **التخصيص**

### **تغيير موضع الزر:**

في `client/App.tsx`:
```tsx
<WhatsAppButton position="bottom-left" /> // يسار (افتراضي)
// أو
<WhatsAppButton position="bottom-right" /> // يمين
```

### **تغيير رقم الدعم:**

في `.env`:
```env
VITE_WHATSAPP_BUSINESS_PHONE=+201234567890
```

### **إضافة رسائل سريعة:**

في `client/components/WhatsAppButton.tsx`:
```typescript
const quickMessages = [
  { ar: 'رسالة جديدة', en: 'New message' },
  // أضف المزيد...
];
```

---

## 🔍 **الاختبار**

### **Dev Mode (افتراضي):**
- الرسائل تُطبع في Console
- لا ترسل رسائل حقيقية
- مثالي للتطوير

```typescript
// سترى في Console:
📱 WhatsApp Message (Dev Mode):
To: +201234567890
Message: مرحباً!
```

### **Production Mode:**
- أضف Access Token في `.env`
- الرسائل تُرسل حقيقياً
- تأكد من وجود رصيد في حساب Facebook

---

## 📊 **الإحصائيات**

في Admin Panel (`/admin/whatsapp`):
- ✅ رسائل اليوم
- ✅ نسبة النجاح
- ✅ إجمالي المستلمين
- ✅ سجل الرسائل

---

## 🐛 **حل المشاكل**

### **الزر لا يظهر:**
- تأكد من تشغيل الـ dev server
- افحص Console للأخطاء
- تأكد من import صحيح في App.tsx

### **الرسائل لا ترسل:**
- تأكد من Access Token صحيح
- تحقق من رقم الهاتف (يجب أن يبدأ بـ +20)
- راجع Network tab في DevTools

### **خطأ في الرقم:**
- الرقم يجب أن يكون: +201234567890
- بدون مسافات أو رموز خاصة
- سيتم إضافة +20 تلقائياً إذا كان غير موجود

---

## 📚 **مزيد من المعلومات**

- **دليل كامل:** `WHATSAPP_INTEGRATION.md`
- **تحليل المشروع:** `CURRENT_STATE_ANALYSIS.md`
- **WhatsApp Business API:** https://developers.facebook.com/docs/whatsapp

---

## 🎉 **جاهز للاستخدام!**

```bash
# 1. تشغيل الموقع
npm run dev

# 2. افتح المتصفح
http://localhost:5173

# 3. شاهد الزر الأخضر في الأسفل!
```

---

**💼 للدخول على Admin Panel:**
```
http://localhost:5173/#/admin/whatsapp
```

**🎨 الزر العائم موجود في:**
- كل صفحات الموقع
- الموضع: أسفل يسار
- اللون: أخضر واتساب (#25D366)
- Animation: bounce

---

**✅ اكتمل التكامل!**  
**📱 WhatsApp Integration is Live!**
