# 🔧 Fix Service Worker CORS Issue

**المشكلة**: Service Worker يحاول cache external fonts من Appwrite ويفشل بسبب CORS

**الحل**: تعديل Service Worker ليتجاهل external resources

---

## 🎯 الحل السريع:

### Option 1: تعطيل Service Worker مؤقتاً

أضف في `index.html`:

```html
<script>
  // Disable Service Worker temporarily
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
</script>
```

---

### Option 2: تحديث Service Worker (موصى به)

في `dist/sw.js` (أو المصدر إذا موجود)، أضف فلتر للـ external domains:

```javascript
// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // ✅ NEW: Skip external domains that cause CORS issues
  const skipDomains = [
    'assets.appwrite.io',
    'cloud.appwrite.io',
    // Add other external domains if needed
  ];
  
  if (skipDomains.some(domain => url.hostname.includes(domain))) {
    console.log('Skipping external resource:', url.href);
    return; // Let browser handle it normally
  }

  // Rest of the code...
  // Check if it's an API request
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static resources
  event.respondWith(handleStaticResource(request));
});
```

---

### Option 3: Clear Service Worker Cache

في Developer Console:

```javascript
// Clear all caches
caches.keys().then(function(names) {
    for (let name of names) caches.delete(name);
});

// Unregister service worker
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
        registration.unregister();
    }
});

// Reload
location.reload();
```

---

## 📝 الحل الدائم:

### 1. إنشاء Service Worker محدث

```javascript
// service-worker.js (NEW VERSION)
const CACHE_NAME = 'egygo-v2'; // ✅ Increment version
const STATIC_CACHE = 'egygo-static-v2';
const DYNAMIC_CACHE = 'egygo-dynamic-v2';

// Allowed origins for caching
const ALLOWED_ORIGINS = [
  self.location.origin, // Same origin
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

// Domains to skip (CORS issues)
const SKIP_DOMAINS = [
  'assets.appwrite.io',
  'cloud.appwrite.io',
];

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES).catch(err => {
          console.warn('[SW] Some resources failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP(S)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // ✅ Skip domains that cause CORS issues
  if (SKIP_DOMAINS.some(domain => url.hostname.includes(domain))) {
    console.log('[SW] Skipping external domain:', url.hostname);
    return; // Let browser handle normally
  }

  // ✅ Only cache allowed origins
  if (!ALLOWED_ORIGINS.some(origin => url.origin === origin || url.origin === self.location.origin)) {
    console.log('[SW] Skipping non-allowed origin:', url.origin);
    return;
  }

  // Handle API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }

  // Handle static resources - Cache First
  event.respondWith(handleStaticResource(request));
});

// Handle static resources
async function handleStaticResource(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request, {
      mode: 'cors',
      credentials: 'omit' // ✅ Don't send credentials to external domains
    });
    
    if (networkResponse.ok && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.warn('[SW] Failed to cache:', request.url, err);
      });
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static resource fetch failed:', error);
    return new Response('Resource not available', { 
      status: 404,
      statusText: 'Not Found' 
    });
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.warn('[SW] Failed to cache API response:', err);
      });
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}
```

---

## 🚀 خطوات التطبيق:

### 1. نسخ الكود المحدث
- انسخ Service Worker الجديد من أعلاه

### 2. استبدال الملف
```bash
# في المشروع
cp service-worker.js dist/sw.js
cp service-worker.js public/sw.js
```

### 3. Build جديد
```bash
npm run build
```

### 4. Test محلياً
```bash
npm run dev
# افتح Console وتأكد من عدم وجود CORS errors
```

### 5. Deploy
```bash
git add dist/sw.js public/sw.js
git commit -m "fix(sw): skip external domains causing CORS issues"
git push origin main
```

---

## ✅ التحقق من النجاح:

افتح Developer Console:

```javascript
// 1. Check Service Worker
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Active SW:', regs.length > 0 ? '✅' : '❌');
});

// 2. Check Cache
caches.keys().then(names => {
  console.log('Caches:', names);
});

// 3. Test font loading
console.log('Checking fonts...');
document.fonts.ready.then(() => {
  console.log('Fonts loaded:', document.fonts.size);
});
```

يجب ألا ترى:
- ❌ CORS errors for Appwrite fonts
- ❌ 404 errors for fonts
- ❌ Service Worker errors

---

## 📊 ملخص التغييرات:

### Before:
```javascript
// يحاول cache كل شيء
event.respondWith(handleStaticResource(request));
```

### After:
```javascript
// يتجاهل external domains
if (SKIP_DOMAINS.includes(url.hostname)) {
  return; // Let browser handle
}
```

---

## 🎯 البدائل:

### إذا ما نفعتش:

1. **استخدام Google Fonts بس** (مطبق already)
2. **تعطيل SW مؤقتاً**
3. **استضافة Fonts محلياً**

---

## 📝 ملاحظات:

1. ✅ المشكلة من SW مش من الـ CSS
2. ✅ Google Fonts شغالة تمام
3. ✅ Appwrite fonts مش محتاجينها
4. ✅ الحل بسيط - skip external domains

---

**Status**: ✅ Solution Ready
**Priority**: High (يؤثر على UX)
**Effort**: Low (5 minutes)
