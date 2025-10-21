# Service Worker CORS Fix

## 🐛 المشكلة:

```
Access to fetch at 'https://assets.appwrite.io/fonts/...' from origin 'https://egygo.me' 
has been blocked by CORS policy
```

**السبب:** Service Worker كان يحاول cache الموارد الخارجية (خطوط Appwrite) لكن CORS يمنع ذلك.

---

## ✅ الحل المطبق:

### 1. **استثناء الموارد الخارجية**

```javascript
// ✅ بعد التعديل
if (url.origin !== self.location.origin) {
  // Let the browser handle external resources normally
  return;
}
```

**النتيجة:** SW لا يتدخل في الموارد الخارجية (Appwrite, CDNs, إلخ)

### 2. **تحديث isStaticResource**

```javascript
function isStaticResource(request) {
  const url = new URL(request.url);
  // Skip external resources to avoid CORS issues
  if (url.origin !== self.location.origin) {
    return false;
  }
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|ico)$/);
}
```

### 3. **تحديث رقم الإصدار**

```javascript
// قبل
const CACHE_NAME = 'egygo-v1';
const STATIC_CACHE = 'egygo-static-v1';
const DYNAMIC_CACHE = 'egygo-dynamic-v1';

// بعد
const CACHE_NAME = 'egygo-v2';
const STATIC_CACHE = 'egygo-static-v2';
const DYNAMIC_CACHE = 'egygo-dynamic-v2';
```

**الفائدة:** يجبر المتصفح على تحديث SW وحذف الـ cache القديم.

---

## 📊 التغييرات:

| الملف | التعديل |
|------|---------|
| `public/sw.js` | ✅ استثناء الموارد الخارجية |
| `public/sw.js` | ✅ تحديث isStaticResource |
| `public/sw.js` | ✅ رفع رقم الإصدار v1 → v2 |

---

## 🎯 ما يتم caching الآن:

### ✅ **يتم Cache:**
- الموارد المحلية (من نفس الـ domain)
- CSS, JS, صور محلية
- API calls محلية
- صفحات HTML

### ❌ **لا يتم Cache (يمر مباشرة):**
- خطوط Appwrite (`assets.appwrite.io`)
- CDN موارد خارجية
- أي موارد من domains أخرى
- WebSockets

---

## 🔄 للتطبيق:

### 1. **ابني المشروع**
```bash
npm run build
```

### 2. **ارفع التحديث**
```bash
netlify deploy --prod --dir=dist
# أو
.\deploy.ps1
```

### 3. **امسح Service Worker القديم**

في المتصفح:
```javascript
// افتح Console وشغل:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
location.reload(true);
```

**أو:** 
- DevTools → Application → Service Workers → Unregister
- ثم Ctrl+F5

---

## 📝 ملاحظات:

1. **CORS لا يزال موجود** لكن SW لا يتسبب فيه الآن
2. **الخطوط ستُحمل عادياً** من Appwrite بدون مشاكل
3. **Performance:** الموارد المحلية فقط تستفيد من SW caching
4. **External CDNs:** المتصفح يديرها بنفسه (browser cache)

---

## ✅ النتيجة المتوقعة:

```
✅ لا مزيد من CORS errors في Console
✅ الخطوط تُحمل بنجاح من Appwrite
✅ SW يعمل بكفاءة للموارد المحلية
✅ External resources تُحمل عادياً
```

---

**التاريخ:** 21 أكتوبر 2025  
**الإصدار:** Service Worker v2  
**الحالة:** جاهز للنشر ✅
