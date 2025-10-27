# 🍪 نظام الكوكيز والإشعارات

## ✅ ما تم تنفيذه

### **1. مكون الموافقة على الكوكيز (CookieConsent)**

#### **المميزات:**
- ✅ بانر جميل في أسفل الصفحة
- ✅ أيقونة كوكيز ملونة 🍪
- ✅ خيارات متعددة:
  - **قبول الكل** - قبول جميع أنواع الكوكيز
  - **الضرورية فقط** - قبول الكوكيز الأساسية فقط
  - **إعدادات الكوكيز** - تخصيص الكوكيز
- ✅ رابط سياسة الخصوصية
- ✅ زر إغلاق

#### **أنواع الكوكيز:**

**1. الكوكيز الضرورية (Always On)**
```typescript
{
  necessary: true  // لا يمكن تعطيلها
}
```
- تسجيل الدخول
- السلة
- اللغة المفضلة
- الأمان

**2. كوكيز التحليلات (Analytics)**
```typescript
{
  analytics: true/false  // اختياري
}
```
- Google Analytics
- عدد الزوار
- الصفحات الأكثر زيارة
- سلوك المستخدمين

**3. كوكيز التسويق (Marketing)**
```typescript
{
  marketing: true/false  // اختياري
}
```
- Facebook Pixel
- Google Ads
- إعادة الاستهداف
- إعلانات مخصصة

**4. كوكيز التفضيلات (Preferences)**
```typescript
{
  preferences: true/false  // اختياري
}
```
- اللغة المفضلة
- الثيم (فاتح/داكن)
- المنطقة الزمنية
- إعدادات العرض

---

### **2. مكون طلب الإشعارات (NotificationPermission)**

#### **المميزات:**
- ✅ بطاقة أنيقة في الأعلى يمين
- ✅ أيقونة جرس متحركة 🔔
- ✅ قائمة بالفوائد:
  - 🏷️ أحدث العروض والخصومات
  - ⚡ عروض البرق
  - 🎁 كوبونات خصم خاصة
- ✅ زرين:
  - **تفعيل الإشعارات**
  - **ليس الآن**

#### **السلوك الذكي:**

**1. التوقيت:**
```typescript
// يظهر بعد 3 ثوان من فتح الموقع
setTimeout(() => {
  setIsVisible(true);
}, 3000);
```

**2. التذكير:**
```typescript
// إذا رفض المستخدم، يظهر مرة أخرى بعد 7 أيام
if (daysSinceDismissed >= 7) {
  setIsVisible(true);
}
```

**3. الإشعار الترحيبي:**
```typescript
// بعد الموافقة، يرسل إشعار ترحيبي
new Notification("مرحباً بك في إيجي جو! 🎉", {
  body: "ستصلك إشعارات بأفضل العروض",
  icon: "/logo.png"
});
```

---

## 📂 الملفات المنشأة

### **1. CookieConsent.tsx**
```
client/components/CookieConsent.tsx
```

**المكونات الداخلية:**
- Banner الرئيسي
- Settings Dialog
- Cookie Categories
- Save/Accept Buttons

### **2. NotificationPermission.tsx**
```
client/components/NotificationPermission.tsx
```

**المكونات الداخلية:**
- Notification Card
- Benefits List
- Action Buttons
- Permission Request

### **3. App.tsx (معدّل)**
```
client/App.tsx
```

**التغييرات:**
```tsx
// Imports
import { CookieConsent } from "./components/CookieConsent";
import { NotificationPermission } from "./components/NotificationPermission";

// في Layout
<CookieConsent />
<NotificationPermission />
```

---

## 🎯 سير العمل (Workflow)

### **عند فتح الموقع:**

```
┌─────────────────────────────────────┐
│  المستخدم يفتح الموقع              │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  بعد 1 ثانية:                       │
│  يظهر بانر الكوكيز 🍪                │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│  بعد 3 ثواني:                       │
│  يظهر طلب الإشعارات 🔔               │
└──────────────┬───────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
      ▼                 ▼
┌──────────┐    ┌──────────────┐
│ موافقة   │    │ رفض/تجاهل   │
└────┬─────┘    └──────┬───────┘
     │                 │
     ▼                 ▼
┌──────────┐    ┌──────────────┐
│ حفظ في   │    │ تذكير بعد   │
│ Local    │    │ 7 أيام       │
│ Storage  │    │              │
└──────────┘    └──────────────┘
```

---

## 💾 التخزين (LocalStorage)

### **الكوكيز:**
```typescript
// 1. هل تم طلب الموافقة؟
localStorage.setItem("cookieConsent", "true");

// 2. تفضيلات المستخدم
localStorage.setItem("cookiePreferences", JSON.stringify({
  necessary: true,
  analytics: true,
  marketing: false,
  preferences: true
}));

// 3. تاريخ الموافقة
localStorage.setItem("cookieConsentDate", "2025-10-17T20:30:00Z");
```

### **الإشعارات:**
```typescript
// 1. هل تم طلب الإذن؟
localStorage.setItem("notificationPermissionAsked", "true");

// 2. تاريخ الرفض (للتذكير بعد 7 أيام)
localStorage.setItem("notificationPermissionDismissed", "2025-10-17T20:30:00Z");
```

---

## 🎨 التصميم

### **الألوان:**

**Cookie Banner:**
```css
/* أيقونة الكوكيز */
background: linear-gradient(to bottom right, #f59e0b, #eab308);

/* الأزرار */
.accept-all {
  background: linear-gradient(to right, var(--primary), #a855f7);
}

.necessary-only {
  border: 1px solid;
  background: transparent;
}
```

**Notification Card:**
```css
/* أيقونة الجرس */
background: linear-gradient(to bottom right, #f59e0b, #eab308);
animation: pulse 2s infinite;

/* زر التفعيل */
background: linear-gradient(to right, #f59e0b, #eab308);

/* شريط علوي */
background: linear-gradient(to right, #f59e0b, #eab308, #f59e0b);
```

---

## 🔔 إعداد Push Notifications (خطوات إضافية)

### **1. إنشاء Service Worker**

```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id
    },
    actions: [
      {
        action: 'explore',
        title: 'عرض المنتج',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/products')
    );
  }
});
```

### **2. تسجيل Service Worker**

```typescript
// في App.tsx أو main.tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}
```

### **3. الاشتراك في Push**

```typescript
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready;
  
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });
  
  // إرسال subscription للسيرفر
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });
}
```

---

## 📱 أمثلة على الإشعارات

### **1. عرض جديد**
```javascript
{
  title: "🔥 عرض حصري!",
  body: "خصم 50% على جميع الإلكترونيات - لمدة 24 ساعة فقط!",
  icon: "/products/electronics.png",
  tag: "flash-sale-electronics",
  requireInteraction: true
}
```

### **2. تحديث الطلب**
```javascript
{
  title: "📦 تحديث طلبك #12345",
  body: "طلبك في الطريق إليك! التوصيل المتوقع: غداً",
  icon: "/icons/delivery.png",
  tag: "order-12345",
  data: {
    orderId: "12345",
    url: "/orders/12345"
  }
}
```

### **3. منتج متوفر**
```javascript
{
  title: "✅ المنتج متوفر الآن!",
  body: "سماعات Sony WH-1000XM5 عادت للمخزون",
  icon: "/products/sony-headphones.png",
  tag: "back-in-stock",
  actions: [
    { action: "buy", title: "اشتري الآن" },
    { action: "dismiss", title: "لاحقاً" }
  ]
}
```

---

## ⚙️ الإعدادات

### **تخصيص التوقيت:**

```typescript
// في CookieConsent.tsx
setTimeout(() => {
  setIsVisible(true);
}, 1000);  // ← غيّر هذا الرقم (بالميلي ثانية)

// في NotificationPermission.tsx
setTimeout(() => {
  setIsVisible(true);
}, 3000);  // ← غيّر هذا الرقم
```

### **تخصيص مدة التذكير:**

```typescript
// في NotificationPermission.tsx
if (daysSinceDismissed >= 7) {  // ← غيّر 7 للعدد المطلوب
  setIsVisible(true);
}
```

### **تعطيل أحد المكونات:**

```tsx
// في App.tsx
{/* Cookie Consent & Notification Permission */}
<CookieConsent />              {/* ← احذف هذا السطر لتعطيل الكوكيز */}
<NotificationPermission />     {/* ← احذف هذا السطر لتعطيل الإشعارات */}
```

---

## 🧪 الاختبار

### **1. اختبار الكوكيز:**
```javascript
// في Console
// مسح البيانات
localStorage.removeItem("cookieConsent");
localStorage.removeItem("cookiePreferences");

// إعادة تحميل الصفحة
location.reload();
```

### **2. اختبار الإشعارات:**
```javascript
// في Console
// إعادة تعيين الحالة
localStorage.removeItem("notificationPermissionAsked");
localStorage.removeItem("notificationPermissionDismissed");

// إعادة تعيين إذن المتصفح (يدوياً)
// Settings > Site Settings > Notifications > Reset
```

### **3. اختبار إرسال إشعار:**
```javascript
// في Console (بعد الموافقة)
new Notification("اختبار", {
  body: "هذا إشعار تجريبي",
  icon: "/logo.png"
});
```

---

## 🚀 الخطوات التالية (اختيارية)

### **1. Server-Side Push Notifications:**
- إعداد VAPID keys
- إنشاء API endpoint للاشتراك
- إنشاء نظام إرسال الإشعارات

### **2. تحليلات الكوكيز:**
- دمج Google Analytics
- دمج Facebook Pixel
- تتبع التحويلات

### **3. تحسينات UX:**
- إضافة أصوات للإشعارات
- إضافة رسوم متحركة
- تحسين الرسائل

---

## ✅ الخلاصة

**ما تم تنفيذه:**
1. ✅ مكون الموافقة على الكوكيز كامل
2. ✅ مكون طلب الإشعارات كامل
3. ✅ دمج في App.tsx
4. ✅ تصميم احترافي
5. ✅ تخزين التفضيلات
6. ✅ نظام تذكير ذكي

**النتيجة:**
- 🍪 المستخدم يمكنه التحكم في الكوكيز
- 🔔 المستخدم يمكنه تفعيل الإشعارات
- ✅ متوافق مع GDPR
- ✅ تجربة مستخدم ممتازة

**جاهز للاستخدام! 🎉**
