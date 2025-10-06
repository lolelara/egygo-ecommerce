# ⚡ الخطوات التالية - ابدأ الآن!

> **هدف:** بناء MVP جاهز للإطلاق في 4 أسابيع

---

## 🎯 الأسبوع الأول - RBAC APIs (الأولوية القصوى)

### اليوم 1-2: إعداد البنية التحتية

```bash
# 1. إنشاء مجلدات
mkdir -p server/routes server/middleware server/utils

# 2. تثبيت dependencies
pnpm add express-rate-limit helmet jsonwebtoken bcrypt
pnpm add -D @types/jsonwebtoken @types/bcrypt

# 3. إعداد .env
cat >> .env << EOF
JWT_SECRET=your-super-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/egygo
REDIS_URL=redis://localhost:6379
EOF
```

### اليوم 3-4: RBAC API

**ملف:** `server/routes/rbac.ts`

```typescript
import { RequestHandler } from 'express';
import { databases } from '@/lib/appwrite';

// قائمة الأدوار
export const listRoles: RequestHandler = async (req, res) => {
  try {
    const roles = await databases.listDocuments(
      'egygo-db',
      'roles'
    );
    res.json(roles.documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// إنشاء دور
export const createRole: RequestHandler = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    
    const role = await databases.createDocument(
      'egygo-db',
      'roles',
      'unique()',
      { name, permissions }
    );
    
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// سجل التدقيق
export const getAuditLogs: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const logs = await databases.listDocuments(
      'egygo-db',
      'audit_logs',
      [
        Query.limit(Number(limit)),
        Query.offset((Number(page) - 1) * Number(limit))
      ]
    );
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
```

**تسجيل في:** `server/index.ts`

```typescript
import { listRoles, createRole, getAuditLogs } from './routes/rbac';

app.get('/api/rbac/roles', listRoles);
app.post('/api/rbac/roles', createRole);
app.get('/api/rbac/audit-logs', getAuditLogs);
```

### اليوم 5-7: Notifications API + WebSocket

**ملف:** `server/routes/notifications.ts`

```typescript
export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const notifications = await databases.listDocuments(
      'egygo-db',
      'notifications',
      [Query.equal('userId', userId)]
    );
    
    res.json(notifications.documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};
```

**ملف:** `server/websocket.ts`

```typescript
import { WebSocketServer } from 'ws';

export function setupWebSocket(port = 8081) {
  const wss = new WebSocketServer({ port });
  
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    console.log(`✅ User ${userId} connected`);
    
    ws.on('close', () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });
  
  return wss;
}
```

**✅ نهاية الأسبوع الأول:** RBAC + Notifications يعملان

---

## 🎯 الأسبوع الثاني - Inventory & Search APIs

### اليوم 8-10: Inventory Alerts API

**ملف:** `server/routes/inventory.ts`

```typescript
export const getInventoryAlerts: RequestHandler = async (req, res) => {
  try {
    const products = await databases.listDocuments(
      'egygo-db',
      'products',
      [Query.lessThan('stock', 20)]
    );
    
    const alerts = products.documents.map(product => ({
      id: product.$id,
      productId: product.$id,
      productName: product.name,
      currentStock: product.stock,
      reorderPoint: 20,
      severity: product.stock < 5 ? 'critical' : 
                product.stock < 10 ? 'warning' : 'info',
      daysUntilStockout: Math.ceil(product.stock / (product.salesRate || 1))
    }));
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory alerts' });
  }
};
```

### اليوم 11-12: Universal Search API

**ملف:** `server/routes/search.ts`

```typescript
export const universalSearch: RequestHandler = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    const results = {
      products: [],
      orders: [],
      pages: []
    };
    
    if (type === 'all' || type === 'products') {
      const products = await databases.listDocuments(
        'egygo-db',
        'products',
        [Query.search('name', q as string)]
      );
      results.products = products.documents;
    }
    
    if (type === 'all' || type === 'orders') {
      const orders = await databases.listDocuments(
        'egygo-db',
        'orders',
        [Query.search('orderId', q as string)]
      );
      results.orders = orders.documents;
    }
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};
```

### اليوم 13-14: Testing & Integration

```bash
# اختبار APIs
curl http://localhost:8080/api/rbac/roles
curl http://localhost:8080/api/notifications?userId=123
curl http://localhost:8080/api/inventory/alerts
curl "http://localhost:8080/api/search?q=قميص"

# اختبار WebSocket
npm install -g wscat
wscat -c "ws://localhost:8081?userId=test-user"
```

**✅ نهاية الأسبوع الثاني:** 12 API endpoints يعملون

---

## 🎯 الأسبوع الثالث - Database Setup

### اليوم 15-17: Appwrite Collections

**في Appwrite Console:**

1. **Collection: roles**
```json
{
  "name": "roles",
  "attributes": [
    { "key": "name", "type": "string", "size": 100, "required": true },
    { "key": "permissions", "type": "string", "size": 5000, "array": true },
    { "key": "createdAt", "type": "datetime", "required": true }
  ]
}
```

2. **Collection: audit_logs**
```json
{
  "name": "audit_logs",
  "attributes": [
    { "key": "userId", "type": "string", "size": 100, "required": true },
    { "key": "action", "type": "string", "size": 100, "required": true },
    { "key": "resource", "type": "string", "size": 100, "required": true },
    { "key": "ipAddress", "type": "string", "size": 45 },
    { "key": "success", "type": "boolean", "default": true },
    { "key": "timestamp", "type": "datetime", "required": true }
  ]
}
```

3. **Collection: notifications**
```json
{
  "name": "notifications",
  "attributes": [
    { "key": "userId", "type": "string", "size": 100, "required": true },
    { "key": "title", "type": "string", "size": 200, "required": true },
    { "key": "message", "type": "string", "size": 1000, "required": true },
    { "key": "type", "type": "string", "size": 50, "required": true },
    { "key": "isRead", "type": "boolean", "default": false },
    { "key": "createdAt", "type": "datetime", "required": true }
  ]
}
```

### اليوم 18-19: Seed Data

**ملف:** `server/scripts/seed.ts`

```typescript
import { databases } from '@/lib/appwrite';

async function seedRoles() {
  const roles = [
    { name: 'admin', permissions: ['read', 'write', 'delete', 'admin'] },
    { name: 'merchant', permissions: ['read', 'write'] },
    { name: 'affiliate', permissions: ['read'] },
    { name: 'customer', permissions: ['read'] }
  ];
  
  for (const role of roles) {
    await databases.createDocument(
      'egygo-db',
      'roles',
      'unique()',
      { ...role, createdAt: new Date().toISOString() }
    );
  }
  
  console.log('✅ Roles seeded');
}

seedRoles();
```

```bash
# تشغيل seeding
pnpm tsx server/scripts/seed.ts
```

### اليوم 20-21: Indexes & Performance

**في Appwrite Console:**

```javascript
// Index على notifications.userId
createIndex('notifications', 'userId_idx', 'userId');

// Index على audit_logs.timestamp
createIndex('audit_logs', 'timestamp_idx', 'timestamp');

// Index على products.stock
createIndex('products', 'stock_idx', 'stock');
```

**✅ نهاية الأسبوع الثالث:** Database جاهزة مع seed data

---

## 🎯 الأسبوع الرابع - Testing & Bug Fixes

### اليوم 22-24: Unit Tests

**ملف:** `tests/unit/RBACSystem.test.tsx`

```typescript
import { render, screen } from '@testing-library/react';
import { RBACSystem } from '@/components/advanced/RBACSystem';

describe('RBACSystem', () => {
  it('should render roles list', () => {
    render(<RBACSystem />);
    expect(screen.getByText('نظام إدارة الصلاحيات')).toBeInTheDocument();
  });
  
  it('should allow creating new role', async () => {
    // Test logic
  });
});
```

```bash
# تشغيل tests
pnpm test
```

### اليوم 25-26: Integration Tests

**ملف:** `tests/integration/rbac.test.ts`

```typescript
import request from 'supertest';
import { app } from '@/server';

describe('RBAC API', () => {
  it('GET /api/rbac/roles should return roles', async () => {
    const res = await request(app).get('/api/rbac/roles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  it('POST /api/rbac/roles should create role', async () => {
    const res = await request(app)
      .post('/api/rbac/roles')
      .send({ name: 'editor', permissions: ['read', 'write'] });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('editor');
  });
});
```

### اليوم 27-28: Manual QA & Bug Fixes

**قائمة الاختبار:**

- [ ] تسجيل دخول وخروج
- [ ] إنشاء دور جديد
- [ ] تعديل صلاحيات
- [ ] عرض سجل التدقيق
- [ ] استقبال إشعار real-time
- [ ] بحث شامل عن منتج
- [ ] عرض تنبيهات المخزون
- [ ] إعادة طلب منتج

```bash
# تشغيل على production mode
pnpm build
pnpm start

# اختبار Performance
pnpm lighthouse http://localhost:8080
```

**✅ نهاية الأسبوع الرابع:** MVP جاهز للإطلاق! 🚀

---

## 📊 Checklist النهائي

### قبل الإطلاق
- [ ] ✅ جميع APIs الأساسية تعمل
- [ ] ✅ Database منشأة ومفهرسة
- [ ] ✅ WebSocket يعمل
- [ ] ✅ Unit tests > 60%
- [ ] ✅ Integration tests للـ APIs
- [ ] ✅ Manual QA مكتمل
- [ ] ✅ Environment variables محددة
- [ ] ✅ Error handling موجود
- [ ] ✅ Logging enabled
- [ ] ✅ Security headers مضافة

### Deployment
```bash
# 1. Build
pnpm build

# 2. تحقق من الأخطاء
pnpm typecheck

# 3. Deploy على Vercel/Netlify
vercel --prod
# أو
netlify deploy --prod
```

---

## 🎉 بعد الإطلاق

### الأسبوع الخامس (اختياري)
- إضافة Smart Contracts APIs
- إضافة A/B Testing APIs
- تحسين Performance

### الأسبوع السادس (اختياري)
- External APIs (OpenAI, Maps)
- E2E testing
- Monitoring & Analytics

---

## 💡 نصائح للنجاح

1. **ابدأ صغيرًا:** MVP أولاً، Features لاحقًا
2. **اختبر باستمرار:** Test كل API بعد كتابته
3. **استخدم Git:** Commit بعد كل feature
4. **راجع التوثيق:** QUICK_START_BACKEND.md دليلك
5. **اطلب مساعدة:** GitHub Issues للأسئلة

---

## 📞 المساعدة

**وثق في:** `REMAINING_IMPROVEMENTS.md` - تفاصيل شاملة  
**اتبع:** `QUICK_START_BACKEND.md` - أمثلة كود كاملة  
**راجع:** `DEPLOYMENT_CHECKLIST.md` - قبل النشر

---

**🚀 ابدأ الآن! أول خطوة: إنشاء RBAC API**

```bash
cd server/routes
touch rbac.ts
code rbac.ts
```

✨ **حظ موفق!**
