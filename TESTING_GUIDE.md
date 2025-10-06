# 🧪 دليل الاختبار الشامل

## 📋 نظرة عامة

هذا الدليل يوضح كيفية اختبار جميع الـ42 endpoint الجديدة بالإضافة إلى WebSocket server والمكونات الأخرى.

---

## 🚀 الإعداد الأولي

### 1. تشغيل المشروع
```bash
pnpm dev
```

السيرفر سيعمل على:
- **Backend API:** http://localhost:8080
- **WebSocket:** ws://localhost:8081
- **Frontend:** http://localhost:3000 (أو حسب إعدادك)

### 2. أدوات الاختبار

#### استخدام curl (Command Line)
متوفر مباشرة في PowerShell/Terminal

#### استخدام Postman
- قم بتحميل [Postman](https://www.postman.com/downloads/)
- استيراد Collection من `postman_collection.json` (سيتم إنشاؤه لاحقاً)

#### استخدام WebSocket Client
```bash
# تثبيت wscat globally
pnpm add -g wscat

# أو استخدام npx
npx wscat -c ws://localhost:8081
```

---

## 🔐 RBAC & Security APIs

### Base URL: `http://localhost:8080/api/rbac`

### 1. Get All Roles
```bash
curl http://localhost:8080/api/rbac/roles
```

**Expected Response:**
```json
{
  "roles": [
    {
      "id": "1",
      "name": "admin",
      "permissions": ["read", "write", "delete", "admin"],
      "createdAt": "2024-01-01T00:00:00Z"
    },
    // ... more roles
  ]
}
```

### 2. Create Role
```bash
curl -X POST http://localhost:8080/api/rbac/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "moderator",
    "permissions": ["read", "write"]
  }'
```

**Expected Response:**
```json
{
  "id": "5",
  "name": "moderator",
  "permissions": ["read", "write"],
  "createdAt": "2024-12-20T10:30:00Z"
}
```

### 3. Update Role
```bash
curl -X PUT http://localhost:8080/api/rbac/roles/5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "moderator",
    "permissions": ["read", "write", "delete"]
  }'
```

### 4. Get Audit Logs
```bash
# All logs
curl http://localhost:8080/api/rbac/audit-logs

# Filtered by user
curl "http://localhost:8080/api/rbac/audit-logs?userId=user123"

# Filtered by action
curl "http://localhost:8080/api/rbac/audit-logs?action=delete"

# With pagination
curl "http://localhost:8080/api/rbac/audit-logs?page=1&limit=10"
```

**Expected Response:**
```json
{
  "logs": [
    {
      "id": "1",
      "userId": "admin1",
      "action": "create_role",
      "resource": "roles/moderator",
      "ipAddress": "192.168.1.100",
      "success": true,
      "timestamp": "2024-12-20T10:30:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

### 5. Check Permission
```bash
curl -X POST http://localhost:8080/api/rbac/check-permission \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "permission": "write"
  }'
```

**Expected Response:**
```json
{
  "hasPermission": true,
  "role": "merchant"
}
```

---

## 📝 Smart Contracts APIs

### Base URL: `http://localhost:8080/api/contracts`

### 1. Get All Contracts
```bash
# All contracts
curl http://localhost:8080/api/contracts

# Filtered by user
curl "http://localhost:8080/api/contracts?userId=user123"

# Filtered by type
curl "http://localhost:8080/api/contracts?type=affiliate"

# Filtered by status
curl "http://localhost:8080/api/contracts?status=active"
```

### 2. Create Contract
```bash
# Affiliate contract
curl -X POST http://localhost:8080/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "type": "affiliate",
    "terms": {
      "commissionRate": 15,
      "paymentSchedule": "monthly",
      "minimumSales": 50000,
      "bonusThreshold": 100000
    }
  }'

# Merchant contract
curl -X POST http://localhost:8080/api/contracts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "merchant456",
    "type": "merchant",
    "terms": {
      "commissionRate": 5,
      "paymentSchedule": "weekly",
      "minimumSales": 100000,
      "bonusThreshold": 500000
    }
  }'
```

### 3. Update Contract
```bash
curl -X PUT http://localhost:8080/api/contracts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "terms": {
      "commissionRate": 20,
      "paymentSchedule": "bi-weekly"
    },
    "status": "active"
  }'
```

### 4. Get Contract Performance
```bash
curl http://localhost:8080/api/contracts/performance/1
```

**Expected Response:**
```json
{
  "contractId": "1",
  "performance": {
    "totalSales": 250000,
    "commissionsEarned": 25000,
    "ordersCompleted": 127,
    "conversionRate": 4.2
  },
  "trends": {
    "salesGrowth": "+15%",
    "commissionsGrowth": "+18%"
  },
  "milestones": [
    {
      "target": 100000,
      "achieved": true,
      "date": "2024-11-15T00:00:00Z"
    }
  ],
  "projections": {
    "estimatedMonthlySales": 320000,
    "estimatedMonthlyCommissions": 32000
  }
}
```

---

## 🧪 A/B Testing APIs

### Base URL: `http://localhost:8080/api/ab-tests`

### 1. Get All Tests
```bash
# All tests
curl http://localhost:8080/api/ab-tests

# Filter by status
curl "http://localhost:8080/api/ab-tests?status=running"
```

### 2. Create A/B Test
```bash
curl -X POST http://localhost:8080/api/ab-tests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Page Layout",
    "description": "Test 2 layouts for product pages",
    "variants": [
      {
        "id": "control",
        "name": "Original Layout",
        "trafficPercentage": 50
      },
      {
        "id": "variant_a",
        "name": "New Layout",
        "trafficPercentage": 50
      }
    ],
    "startDate": "2024-12-20T00:00:00Z",
    "endDate": "2024-12-27T23:59:59Z"
  }'
```

**Note:** مجموع trafficPercentage يجب أن يكون 100

### 3. Set Winner
```bash
curl -X PUT http://localhost:8080/api/ab-tests/1/winner \
  -H "Content-Type: application/json" \
  -d '{
    "winnerId": "variant_a"
  }'
```

### 4. Get Test Results
```bash
curl http://localhost:8080/api/ab-tests/1/results
```

**Expected Response:**
```json
{
  "testId": "1",
  "name": "Homepage Banner Test",
  "variants": [
    {
      "id": "control",
      "name": "Original Banner",
      "visitors": 5000,
      "conversions": 160,
      "conversionRate": 3.2,
      "revenue": 48000
    },
    {
      "id": "variant_a",
      "name": "New Banner",
      "visitors": 5000,
      "conversions": 225,
      "conversionRate": 4.5,
      "revenue": 67500
    }
  ],
  "analysis": {
    "winner": "variant_a",
    "confidenceScore": 98.5,
    "pValue": 0.003,
    "liftPercentage": 40.6,
    "estimatedImpact": {
      "monthlyRevenue": 19500,
      "annualRevenue": 234000
    }
  }
}
```

---

## 🤖 Customer Experience APIs

### AI Chat
```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "أريد شراء لابتوب للبرمجة"
  }'
```

**Expected Response:**
```json
{
  "reply": "بناءً على احتياجاتك للبرمجة، أنصحك بـ...",
  "suggestions": [
    {
      "productId": "laptop-001",
      "name": "Dell XPS 15",
      "reason": "مثالي للبرمجة مع 16GB RAM"
    }
  ]
}
```

### AR Models

**Create AR Model:**
```bash
curl -X POST http://localhost:8080/api/ar/models \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "chair-001",
    "modelUrl": "https://example.com/models/chair.glb",
    "format": "glb",
    "scale": {"x": 1, "y": 1, "z": 1}
  }'
```

**Get AR Models:**
```bash
curl http://localhost:8080/api/ar/models/chair-001
```

### Family Accounts

**Create Family Account:**
```bash
curl -X POST http://localhost:8080/api/family/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "adminUserId": "user123",
    "members": ["user456", "user789"]
  }'
```

**Get Family Account:**
```bash
curl http://localhost:8080/api/family/accounts/family123
```

**Expected Response:**
```json
{
  "id": "family123",
  "adminUserId": "user123",
  "members": [
    {
      "userId": "user123",
      "role": "admin",
      "joinedAt": "2024-01-01T00:00:00Z"
    },
    {
      "userId": "user456",
      "role": "member",
      "joinedAt": "2024-01-02T00:00:00Z"
    }
  ],
  "sharedCart": [...],
  "sharedWishlist": [...],
  "totalOrders": 25,
  "totalSpend": 125000
}
```

### Shipment Tracking
```bash
curl http://localhost:8080/api/shipments/track/order123
```

**Expected Response:**
```json
{
  "orderId": "order123",
  "status": "in_transit",
  "currentLocation": {
    "lat": 30.0444,
    "lng": 31.2357,
    "address": "وسط البلد، القاهرة"
  },
  "driver": {
    "name": "أحمد محمد",
    "phone": "+20 100 123 4567",
    "rating": 4.8
  },
  "estimatedArrival": "2024-12-20T15:30:00Z",
  "timeline": [
    {
      "status": "order_placed",
      "timestamp": "2024-12-18T10:00:00Z"
    },
    {
      "status": "picked_up",
      "timestamp": "2024-12-18T14:00:00Z"
    },
    {
      "status": "in_transit",
      "timestamp": "2024-12-19T08:00:00Z"
    }
  ]
}
```

---

## 🏭 Supply Chain APIs

### Supply Offers
```bash
curl "http://localhost:8080/api/supply/offers?productId=laptop-001"
```

### Compare Suppliers
```bash
curl -X POST http://localhost:8080/api/supply/compare \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "laptop-001",
    "quantity": 100
  }'
```

**Expected Response:**
```json
{
  "comparison": [
    {
      "supplierId": "supplier-001",
      "name": "Tech Suppliers Co.",
      "unitPrice": 15000,
      "totalCost": 1500000,
      "moq": 50,
      "leadTime": "5-7 days",
      "rating": 4.5,
      "score": 95,
      "recommendation": "أفضل خيار"
    }
  ]
}
```

### Create Bundle
```bash
curl -X POST http://localhost:8080/api/supply/bundles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Setup Bundle",
    "productIds": ["laptop-001", "mouse-002", "keyboard-003"],
    "discountPercentage": 15
  }'
```

### Price Simulation
```bash
curl -X POST http://localhost:8080/api/supply/simulate-price \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "laptop-001",
    "currentPrice": 20000,
    "scenarios": ["low", "medium", "high"]
  }'
```

**Expected Response:**
```json
{
  "scenarios": [
    {
      "name": "low",
      "price": 17000,
      "priceChange": -15,
      "estimatedSales": 150,
      "estimatedRevenue": 2550000,
      "profitMargin": 12
    },
    {
      "name": "medium",
      "price": 20000,
      "priceChange": 0,
      "estimatedSales": 100,
      "estimatedRevenue": 2000000,
      "profitMargin": 20
    },
    {
      "name": "high",
      "price": 24000,
      "priceChange": 20,
      "estimatedSales": 60,
      "estimatedRevenue": 1440000,
      "profitMargin": 32
    }
  ]
}
```

---

## 📦 Inventory APIs

### Get Alerts
```bash
# All alerts
curl http://localhost:8080/api/inventory/alerts

# Filter by severity
curl "http://localhost:8080/api/inventory/alerts?severity=critical"
```

### Reorder Inventory
```bash
curl -X POST http://localhost:8080/api/inventory/reorder \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "laptop-001",
    "quantity": 100,
    "supplierId": "supplier-001"
  }'
```

### Get Predictions
```bash
curl http://localhost:8080/api/inventory/predictions?productId=laptop-001
```

---

## 🔍 Search APIs

### Universal Search
```bash
# Search all
curl "http://localhost:8080/api/search?q=laptop"

# Search products only
curl "http://localhost:8080/api/search?q=laptop&type=products"

# Search orders only
curl "http://localhost:8080/api/search?q=order123&type=orders"
```

### Search Suggestions
```bash
curl "http://localhost:8080/api/search/suggestions?q=lap"
```

**Expected Response:**
```json
{
  "suggestions": ["laptop", "laptop bag", "laptop stand"]
}
```

---

## 🎁 Loyalty APIs

### Get Tiers
```bash
curl http://localhost:8080/api/loyalty/tiers
```

**Expected Response:**
```json
{
  "tiers": [
    {
      "id": "silver",
      "name": "فضي",
      "minPoints": 0,
      "benefits": ["1x نقاط", "خصم 5%", "شحن مخفض"]
    },
    {
      "id": "gold",
      "name": "ذهبي",
      "minPoints": 1000,
      "benefits": ["1.5x نقاط", "خصم 10%", "شحن مجاني"]
    },
    {
      "id": "platinum",
      "name": "بلاتيني",
      "minPoints": 5000,
      "benefits": ["2x نقاط", "خصم 15%", "أولوية"]
    }
  ]
}
```

### Calculate Points
```bash
curl -X POST http://localhost:8080/api/loyalty/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "orderAmount": 5000
  }'
```

**Expected Response:**
```json
{
  "pointsEarned": 500,
  "totalPoints": 1500,
  "currentTier": "gold",
  "nextTier": "platinum",
  "pointsToNextTier": 3500
}
```

---

## 💱 Currency APIs

### Get Rates
```bash
curl http://localhost:8080/api/currency/rates
```

**Expected Response:**
```json
{
  "baseCurrency": "EGP",
  "rates": {
    "USD": 0.032,
    "EUR": 0.030,
    "GBP": 0.025,
    "SAR": 0.12,
    "AED": 0.12,
    "KWD": 0.01
  },
  "lastUpdated": "2024-12-20T12:00:00Z"
}
```

### Convert Currency
```bash
curl -X POST http://localhost:8080/api/currency/convert \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "from": "EGP",
    "to": "USD"
  }'
```

**Expected Response:**
```json
{
  "amount": 1000,
  "from": "EGP",
  "to": "USD",
  "result": 32.00,
  "rate": 0.032
}
```

---

## 🔔 Notifications APIs

### Get Notifications
```bash
# All notifications for user
curl "http://localhost:8080/api/notifications?userId=user123"

# Unread only
curl "http://localhost:8080/api/notifications?userId=user123&isRead=false"

# Filter by type
curl "http://localhost:8080/api/notifications?userId=user123&type=important"

# With pagination
curl "http://localhost:8080/api/notifications?userId=user123&page=1&limit=10"
```

### Create Notification
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "title": "طلبك في الطريق",
    "message": "السائق أحمد في طريقه إليك الآن",
    "type": "info",
    "actionUrl": "/orders/order123"
  }'
```

### Mark as Read
```bash
curl -X POST http://localhost:8080/api/notifications/mark-read \
  -H "Content-Type: application/json" \
  -d '{
    "notificationIds": ["notif-1", "notif-2"]
  }'
```

### Mark All as Read
```bash
curl -X POST http://localhost:8080/api/notifications/mark-all-read \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123"
  }'
```

### Delete Notification
```bash
curl -X DELETE http://localhost:8080/api/notifications/notif-1
```

### Broadcast Notification
```bash
# To specific users
curl -X POST http://localhost:8080/api/notifications/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "عرض خاص",
    "message": "خصم 50% على جميع المنتجات",
    "type": "success",
    "targetUsers": ["user123", "user456"]
  }'

# To all users with role
curl -X POST http://localhost:8080/api/notifications/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تحديث النظام",
    "message": "سيتم تحديث النظام الساعة 2 صباحاً",
    "type": "warning",
    "targetRole": "merchant"
  }'
```

---

## 🌐 WebSocket Testing

### 1. باستخدام wscat

**تثبيت wscat:**
```bash
pnpm add -g wscat
```

**الاتصال:**
```bash
# As customer
wscat -c "ws://localhost:8081?userId=user123&role=customer"

# As merchant
wscat -c "ws://localhost:8081?userId=merchant456&role=merchant"
```

**إرسال رسائل:**
```json
// Subscribe to room
{"type": "subscribe", "room": "notifications"}

// Unsubscribe from room
{"type": "unsubscribe", "room": "notifications"}

// Ping
{"type": "ping"}
```

**استقبال رسائل:**
```json
// Pong response
{"type": "pong"}

// Notification
{
  "type": "notification",
  "data": {
    "title": "طلب جديد",
    "message": "لديك طلب جديد #12345"
  }
}

// Live update
{
  "type": "live_update",
  "updateType": "order_tracking",
  "data": {
    "orderId": "order123",
    "location": {...}
  }
}
```

### 2. باستخدام JavaScript

```javascript
const ws = new WebSocket('ws://localhost:8081?userId=user123&role=customer');

ws.onopen = () => {
  console.log('Connected to WebSocket');
  
  // Subscribe to notifications
  ws.send(JSON.stringify({
    type: 'subscribe',
    room: 'notifications'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
  
  if (data.type === 'notification') {
    // Handle notification
    showNotification(data.data);
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket');
};
```

---

## ✅ Testing Checklist

### Backend APIs
- [ ] ✅ RBAC: جميع الـ5 endpoints تعمل
- [ ] ✅ Contracts: جميع الـ4 endpoints تعمل
- [ ] ✅ A/B Tests: جميع الـ4 endpoints تعمل
- [ ] ✅ Customer Experience: جميع الـ6 endpoints تعمل
- [ ] ✅ Supply Chain: جميع الـ4 endpoints تعمل
- [ ] ✅ Inventory: جميع الـ3 endpoints تعمل
- [ ] ✅ Search: جميع الـ2 endpoints تعمل
- [ ] ✅ Loyalty: جميع الـ2 endpoints تعمل
- [ ] ✅ Currency: جميع الـ2 endpoints تعمل
- [ ] ✅ Notifications: جميع الـ6 endpoints تعمل

### WebSocket
- [ ] ✅ الاتصال يعمل
- [ ] ✅ Subscribe/Unsubscribe يعمل
- [ ] ✅ Ping/Pong يعمل
- [ ] ✅ تلقي الإشعارات يعمل
- [ ] ✅ Broadcast يعمل

### Frontend Libraries
- [ ] ✅ Performance: Debounce يعمل
- [ ] ✅ Accessibility: Keyboard shortcuts تعمل
- [ ] ✅ i18n: تبديل اللغة يعمل

---

## 🐛 Troubleshooting

### مشكلة: Cannot connect to API
**الحل:**
```bash
# تأكد أن السيرفر يعمل
pnpm dev

# تحقق من البورت
curl http://localhost:8080/api/ping
```

### مشكلة: WebSocket connection failed
**الحل:**
```bash
# تأكد من تشغيل WebSocket server
# راجع server/index.ts - يجب أن يكون setupWebSocket موجود

# تحقق من البورت 8081
netstat -an | findstr 8081
```

### مشكلة: CORS errors
**الحل:**
في `server/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true
}));
```

---

## 📊 Performance Testing

### Load Testing مع Artillery
```bash
# Install Artillery
pnpm add -g artillery

# Create test file: artillery-test.yml
artillery run artillery-test.yml
```

### Sample Artillery Config:
```yaml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - flow:
    - get:
        url: "/api/rbac/roles"
    - post:
        url: "/api/notifications"
        json:
          userId: "user123"
          title: "Test"
          message: "Load test"
          type: "info"
```

---

## 🎯 Next Steps

1. ✅ اختبار جميع الـ42 endpoint
2. ✅ اختبار WebSocket connections
3. ⬜ ربط قاعدة البيانات
4. ⬜ إضافة Unit Tests
5. ⬜ إضافة Integration Tests
6. ⬜ Setup CI/CD للاختبارات التلقائية

---

## 📚 مراجع إضافية

- [QUICK_START_BACKEND.md](./QUICK_START_BACKEND.md) - دليل Backend التفصيلي
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - ملخص ما تم إنجازه
- [NEXT_STEPS.md](./NEXT_STEPS.md) - الخطوات القادمة

---

*آخر تحديث: ديسمبر 2024*
