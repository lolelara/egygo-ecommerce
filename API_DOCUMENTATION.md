# 🔌 API Documentation

## 📋 Overview

Complete API documentation for EgyGo E-commerce platform.

**Base URL:** `https://api.egygo.me/v1`  
**Authentication:** Bearer Token (JWT)

---

## 🔐 Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "أحمد محمد",
  "phone": "+20123456789"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "أحمد محمد",
      "role": "customer"
    }
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {token}
```

---

## 🔍 Search API

### Search Products
```http
POST /search
Content-Type: application/json
Authorization: Bearer {token}

{
  "query": "iPhone",
  "filters": {
    "category": "mobiles",
    "minPrice": 5000,
    "maxPrice": 50000,
    "brand": "Apple"
  },
  "sort": "price_asc",
  "page": 1,
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "iPhone 15 Pro",
        "price": 45000,
        "image": "https://cdn.egygo.me/products/iphone-15.jpg",
        "rating": 4.8,
        "reviews": 342
      }
    ],
    "total": 15,
    "page": 1,
    "pages": 1
  }
}
```

### Get Search Suggestions
```http
GET /search/suggestions?q=iPhone
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "id": "1",
        "text": "iPhone 15 Pro",
        "category": "موبايلات",
        "image": "https://cdn.egygo.me/products/iphone-15.jpg"
      },
      {
        "id": "2",
        "text": "iPhone 15 Pro Max",
        "category": "موبايلات"
      }
    ]
  }
}
```

---

## 📦 Products API

### Get All Products
```http
GET /products?page=1&limit=20&category=mobiles
Authorization: Bearer {token}
```

### Get Product by ID
```http
GET /products/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "iPhone 15 Pro",
    "description": "وصف المنتج...",
    "price": 45000,
    "originalPrice": 50000,
    "discount": 10,
    "images": [
      "https://cdn.egygo.me/products/iphone-15-1.jpg",
      "https://cdn.egygo.me/products/iphone-15-2.jpg"
    ],
    "images360": [
      "https://cdn.egygo.me/products/360/iphone-0.jpg",
      "https://cdn.egygo.me/products/360/iphone-15.jpg"
    ],
    "specs": {
      "الشاشة": "6.1 بوصة",
      "المعالج": "A17 Pro",
      "الكاميرا": "48 MP"
    },
    "brand": "Apple",
    "category": "موبايلات",
    "stock": 50,
    "rating": 4.8,
    "reviews": 342
  }
}
```

### Get Product 360° Images
```http
GET /products/:id/360
Authorization: Bearer {token}
```

---

## 📊 Comparison API

### Get Comparison
```http
POST /comparison
Content-Type: application/json
Authorization: Bearer {token}

{
  "productIds": ["prod_123", "prod_456", "prod_789"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "iPhone 15 Pro",
        "price": 45000,
        "specs": {
          "الشاشة": "6.1 بوصة",
          "المعالج": "A17 Pro"
        }
      }
    ]
  }
}
```

---

## 🎮 Gamification API

### Get User Points
```http
GET /points/user/:userId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 450,
    "level": 3,
    "pointsToNextLevel": 550,
    "streak": 5,
    "rewards": [
      {
        "id": "reward_1",
        "title": "خصم 10%",
        "points": 100,
        "claimed": false
      }
    ]
  }
}
```

### Earn Points
```http
POST /points/earn
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "action": "purchase",
  "amount": 1000,
  "points": 10
}
```

### Claim Reward
```http
POST /points/claim
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "rewardId": "reward_1"
}
```

---

## 🎰 Spin Wheel API

### Execute Spin
```http
POST /spin/execute
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "result": {
      "id": "2",
      "label": "خصم 10%",
      "value": "10",
      "type": "discount"
    },
    "spinsLeft": 2
  }
}
```

### Get Remaining Spins
```http
GET /spin/remaining/:userId
Authorization: Bearer {token}
```

---

## 🤖 Recommendations API

### Get Recommendations
```http
POST /recommendations
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "productId": "prod_123",
  "categories": ["personalized", "similar", "trending", "frequently"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "personalized": [
      {
        "id": "prod_456",
        "name": "Product Name",
        "price": 1000,
        "rating": 4.5
      }
    ],
    "similar": [],
    "trending": [],
    "frequently": []
  }
}
```

---

## 📊 Reports API

### Generate Report
```http
POST /reports/generate
Content-Type: application/json
Authorization: Bearer {token}

{
  "type": "sales",
  "dateRange": "30days",
  "format": "pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reportId": "report_123",
    "downloadUrl": "https://cdn.egygo.me/reports/report_123.pdf",
    "expiresAt": "2025-10-19T00:00:00Z"
  }
}
```

### Get Report Data
```http
GET /reports/:reportId
Authorization: Bearer {token}
```

---

## 🔔 Notifications API

### Get User Notifications
```http
GET /notifications/user/:userId?page=1&limit=20
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "title": "تم شحن طلبك",
        "message": "طلب #1234 في الطريق إليك",
        "type": "order",
        "channel": "push",
        "timestamp": "2025-10-18T10:30:00Z",
        "read": false,
        "actionUrl": "/orders/1234"
      }
    ],
    "total": 10,
    "unreadCount": 5
  }
}
```

### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer {token}
```

### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer {token}
```

### Update Preferences
```http
PUT /notifications/preferences
Content-Type: application/json
Authorization: Bearer {token}

{
  "orderUpdates": {
    "push": true,
    "email": true,
    "sms": false,
    "whatsapp": true
  },
  "promotions": {
    "push": true,
    "email": true,
    "sms": false,
    "whatsapp": false
  }
}
```

---

## 🛒 Cart API

### Get Cart
```http
GET /cart/:userId
Authorization: Bearer {token}
```

### Add to Cart
```http
POST /cart/add
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "productId": "prod_123",
  "quantity": 1
}
```

### Update Quantity
```http
PUT /cart/update
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "productId": "prod_123",
  "quantity": 2
}
```

### Remove from Cart
```http
DELETE /cart/remove
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "productId": "prod_123"
}
```

---

## 📦 Orders API

### Create Order
```http
POST /orders
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "user_abc123",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 1,
      "price": 45000
    }
  ],
  "shippingAddress": {
    "name": "أحمد محمد",
    "phone": "+20123456789",
    "street": "شارع التحرير",
    "city": "القاهرة",
    "country": "مصر"
  },
  "paymentMethod": "card",
  "couponCode": "SAVE10"
}
```

### Get Order
```http
GET /orders/:orderId
Authorization: Bearer {token}
```

### Get User Orders
```http
GET /orders/user/:userId?page=1&limit=20
Authorization: Bearer {token}
```

---

## 📈 Analytics API

### Track Event
```http
POST /analytics/event
Content-Type: application/json
Authorization: Bearer {token}

{
  "eventName": "product_view",
  "userId": "user_abc123",
  "productId": "prod_123",
  "timestamp": "2025-10-18T10:30:00Z",
  "metadata": {
    "source": "search",
    "category": "mobiles"
  }
}
```

---

## ❌ Error Responses

### Error Format
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "المنتج غير موجود",
    "details": {}
  }
}
```

### Common Error Codes
```
401 - UNAUTHORIZED: Invalid or expired token
403 - FORBIDDEN: Insufficient permissions
404 - NOT_FOUND: Resource not found
400 - BAD_REQUEST: Invalid request data
429 - TOO_MANY_REQUESTS: Rate limit exceeded
500 - INTERNAL_ERROR: Server error
```

---

## 🔒 Rate Limiting

```
Rate Limit: 100 requests per minute per IP
Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1634567890
```

---

## 📝 Webhook Events

### Order Created
```json
{
  "event": "order.created",
  "data": {
    "orderId": "order_123",
    "userId": "user_abc123",
    "total": 45000,
    "timestamp": "2025-10-18T10:30:00Z"
  }
}
```

### Order Shipped
```json
{
  "event": "order.shipped",
  "data": {
    "orderId": "order_123",
    "trackingNumber": "TRACK123456",
    "timestamp": "2025-10-18T10:30:00Z"
  }
}
```

---

## 🧪 Testing

### Test Credentials
```
Email: test@egygo.me
Password: Test123!@#
```

### Test API Key
```
Bearer test_sk_1234567890abcdef
```

---

## 📚 SDKs & Libraries

### JavaScript/TypeScript
```bash
npm install @egygo/api-client
```

```typescript
import { EgyGoClient } from '@egygo/api-client';

const client = new EgyGoClient({
  apiKey: 'your_api_key',
  environment: 'production'
});

const products = await client.products.list();
```

---

## 🆘 Support

- 📧 Email: api@egygo.me
- 💬 Discord: [API Support Channel](https://discord.gg/egygo-api)
- 📖 Docs: https://docs.egygo.me/api
- 🐛 Issues: https://github.com/lolelara/egygo-ecommerce/issues

---

**API Version:** v1.0.0  
**Last Updated:** October 2025
