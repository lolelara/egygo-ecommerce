# 🔧 Appwrite 503 Error - Troubleshooting Guide

## ❌ المشكلة

```
GET https://fra.cloud.appwrite.io/v1/... 503 (Service Unavailable)
WebSocket connection failed
Realtime got disconnected
Request failed: TypeError: Failed to fetch
```

---

## 🔍 **تحليل الخطأ:**

### **1. الأخطاء الظاهرة:**
```javascript
// 1. HTTP 503 Errors
GET .../collections/userPreferences/documents 503
GET .../collections/notifications/documents 503

// 2. WebSocket Failures
WebSocket connection to 'wss://fra.cloud.appwrite.io/v1/realtime...' failed

// 3. Service Worker Errors
Request failed: TypeError: Failed to fetch at handleOtherRequest (sw.js:190:18)

// 4. React Query Retries
Error checking for updates: AppwriteException: Request failed
Error fetching notifications: AppwriteException: Request failed
```

### **2. الأسباب المحتملة:**

#### **أ. Appwrite Cloud Server Issues (الأكثر احتمالاً):**
```
✅ 503 = Service Temporarily Unavailable
✅ يحدث على جميع endpoints
✅ مشكلة من جانب Appwrite Cloud
✅ قد تكون صيانة أو حمل زائد
```

#### **ب. Rate Limiting:**
```
⚠️ عدد كبير من الطلبات المتكررة
⚠️ React Query auto-refetch
⚠️ Service Worker retries
⚠️ Realtime reconnection attempts
```

#### **ج. Service Worker Conflicts:**
```
⚠️ Service Worker يحاول cache الطلبات
⚠️ قد يتعارض مع Appwrite API
⚠️ handleOtherRequest في sw.js يفشل
```

---

## ✅ **الحلول:**

### **الحل 1: التحقق من حالة Appwrite Cloud**

```bash
# تحقق من status page
https://status.appwrite.io/

# أو جرب ping الخدمة
curl -I https://fra.cloud.appwrite.io/v1/health
```

**إذا كانت الخدمة down:**
- ✅ انتظر حتى تعود الخدمة
- ✅ تحقق من Twitter/Discord لـ Appwrite
- ✅ لا تحتاج لتغيير أي كود

---

### **الحل 2: تقليل عدد الطلبات (React Query)**

أضف retry limits و stale time:

```typescript
// في ملف setup React Query
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,                    // بدلاً من 3
      retryDelay: 3000,           // 3 ثواني بين المحاولات
      staleTime: 5 * 60 * 1000,   // 5 دقائق
      cacheTime: 10 * 60 * 1000,  // 10 دقائق
      refetchOnWindowFocus: false, // تعطيل refetch عند focus
      refetchInterval: false,      // تعطيل auto-refetch
    },
  },
});
```

---

### **الحل 3: تعطيل Service Worker مؤقتاً**

#### **الطريقة 1: من Browser DevTools**
```
1. افتح DevTools (F12)
2. اذهب إلى Application tab
3. Service Workers (في القائمة اليسرى)
4. اضغط "Unregister" لكل service worker
5. أعد تحميل الصفحة
```

#### **الطريقة 2: من الكود**
```typescript
// في index.html أو main entry file
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('Service Worker unregistered');
    });
  });
}
```

---

### **الحل 4: إضافة Error Boundaries**

```typescript
// ErrorBoundary.tsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        ⚠️ حدث خطأ في الاتصال
      </h2>
      <p className="text-gray-600 mb-4">
        {error.message === 'Request failed' 
          ? 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.'
          : error.message
        }
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  const { reset } = useQueryErrorResetBoundary();
  
  return (
    <ReactErrorBoundary
      onReset={reset}
      FallbackComponent={ErrorFallback}
    >
      {children}
    </ReactErrorBoundary>
  );
}
```

---

### **الحل 5: إضافة Retry Logic مع Exponential Backoff**

```typescript
// lib/appwrite-retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastRetry = i === maxRetries - 1;
      const is503 = error.message?.includes('503') || 
                    error.message?.includes('Service Unavailable');
      
      if (isLastRetry || !is503) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
}

// الاستخدام:
const data = await retryWithBackoff(async () => {
  return await databases.listDocuments(DATABASE_ID, 'userPreferences', queries);
});
```

---

### **الحل 6: إضافة Offline Detection**

```typescript
// hooks/useOnlineStatus.ts
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}

// الاستخدام في Component:
function App() {
  const isOnline = useOnlineStatus();
  
  if (!isOnline) {
    return (
      <div className="p-4 bg-yellow-100 text-center">
        ⚠️ لا يوجد اتصال بالإنترنت
      </div>
    );
  }
  
  return <YourApp />;
}
```

---

### **الحل 7: تحسين Service Worker**

```javascript
// public/sw.js
const CACHE_NAME = 'egygo-v1';
const APPWRITE_API = 'https://fra.cloud.appwrite.io';

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // لا تحاول cache طلبات Appwrite API
  if (url.origin === APPWRITE_API) {
    event.respondWith(
      fetch(request).catch(error => {
        console.error('Appwrite API request failed:', error);
        // Return a custom offline response
        return new Response(
          JSON.stringify({ 
            error: 'Service temporarily unavailable',
            offline: true 
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
    );
    return;
  }
  
  // Cache static assets only
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
```

---

## 🎯 **الحل السريع (Quick Fix):**

### **1. أعد تشغيل المتصفح:**
```
1. أغلق جميع نوافذ المتصفح
2. امسح Cache (Ctrl+Shift+Delete)
3. اختر "Cached images and files"
4. احذف
5. أعد فتح الموقع
```

### **2. تعطيل Service Worker:**
```
F12 → Application → Service Workers → Unregister All
```

### **3. انتظر 5-10 دقائق:**
```
✅ 503 عادة مؤقت
✅ Appwrite Cloud قد يكون تحت صيانة
✅ جرب مرة أخرى بعد قليل
```

---

## 📊 **مراقبة الأخطاء:**

### **إضافة Error Logging:**

```typescript
// lib/error-logger.ts
export function logAppwriteError(error: any, context: string) {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    code: error.code,
    type: error.type,
    response: error.response,
  };
  
  console.error('Appwrite Error:', errorInfo);
  
  // يمكنك إرسالها لـ Sentry أو logging service
  // Sentry.captureException(error, { extra: errorInfo });
}

// الاستخدام:
try {
  await databases.listDocuments(...);
} catch (error) {
  logAppwriteError(error, 'Loading user preferences');
  throw error;
}
```

---

## ✅ **التحقق من الحل:**

### **1. تحقق من Console:**
```javascript
// يجب أن تختفي هذه الأخطاء:
❌ GET ... 503 (Service Unavailable)
❌ WebSocket connection failed
❌ Request failed: TypeError: Failed to fetch
```

### **2. تحقق من Network Tab:**
```
✅ Status: 200 OK (بدلاً من 503)
✅ WebSocket: Connected
✅ لا توجد failed requests
```

### **3. تحقق من Application:**
```
✅ البيانات تحمّل بشكل صحيح
✅ الإشعارات تعمل
✅ Realtime updates تعمل
```

---

## 🎊 **الخلاصة:**

### **السبب الأكثر احتمالاً:**
```
🔴 Appwrite Cloud Server Issue (503)
🟡 Rate Limiting من كثرة الطلبات
🟡 Service Worker conflicts
```

### **الحل الموصى به:**
```
1. ✅ تحقق من https://status.appwrite.io/
2. ✅ عطّل Service Worker مؤقتاً
3. ✅ قلل retry attempts في React Query
4. ✅ أضف Error Boundaries
5. ✅ انتظر 5-10 دقائق وحاول مرة أخرى
```

### **إذا استمرت المشكلة:**
```
1. تواصل مع Appwrite Support
2. تحقق من Discord/Twitter
3. راجع Rate Limits في Dashboard
4. تحقق من Billing/Quota
```

---

**📅 تم التوثيق:** 2025-01-19  
**✅ الحالة:** جاهز للتطبيق
