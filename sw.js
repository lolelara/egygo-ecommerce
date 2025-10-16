// EgyGo Service Worker
const CACHE_NAME = 'egygo-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/global.css',
  '/styles/animations.css',
  '/styles/gradients.css',
  '/styles/shimmer.css',
  '/styles/color-effects.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache install error:', err))
  );
  // Force the waiting service worker to become active
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API requests - always fetch fresh
  if (event.request.url.includes('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response for future use
          caches.open(CACHE_NAME)
            .then(cache => {
              // Only cache same-origin and CORS requests
              if (event.request.url.startsWith(self.location.origin) || 
                  event.request.url.startsWith('https://')) {
                cache.put(event.request, responseToCache);
              }
            })
            .catch(err => console.error('Cache put error:', err));

          return response;
        }).catch(error => {
          console.error('Fetch failed:', error);
          
          // Offline fallback for HTML pages
          if (event.request.destination === 'document') {
            return caches.match('/offline.html');
          }
          
          // Return a simple error response for other requests
          return new Response('Network error', {
            status: 408,
            statusText: 'Request Timeout'
          });
        });
      })
      .catch(error => {
        console.error('Cache match error:', error);
        // Try to fetch anyway
        return fetch(event.request);
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

// Push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'لديك إشعار جديد من إيجي جو',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'عرض',
        icon: '/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('إيجي جو', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function to sync cart
async function syncCart() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    // Filter cart-related requests
    const cartRequests = requests.filter(req => 
      req.url.includes('/cart') || req.url.includes('/api/cart')
    );

    // Sync each cart request
    for (const request of cartRequests) {
      try {
        await fetch(request);
      } catch (error) {
        console.error('Failed to sync cart item:', error);
      }
    }
  } catch (error) {
    console.error('Cart sync failed:', error);
  }
}
