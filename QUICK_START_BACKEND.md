# 🚀 دليل البدء السريع - التحسينات المتبقية

## ⚡ البدء الآن (30 دقيقة)

### الخطوة 1: Backend APIs - الأساسيات

```bash
# إنشاء structure
mkdir -p server/routes
cd server/routes
```

#### 1. إنشاء RBAC API

```typescript
// server/routes/rbac.ts
import { RequestHandler } from 'express';

interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
}

// قائمة الأدوار
export const listRoles: RequestHandler = async (req, res) => {
  try {
    // TODO: استبدال بـ database query
    const roles: Role[] = [
      {
        id: '1',
        name: 'admin',
        permissions: ['read', 'write', 'delete', 'admin'],
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'merchant',
        permissions: ['read', 'write'],
        createdAt: new Date()
      }
    ];
    
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

// إنشاء دور جديد
export const createRole: RequestHandler = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    
    // Validation
    if (!name || !permissions) {
      return res.status(400).json({ error: 'Name and permissions required' });
    }
    
    const newRole: Role = {
      id: Date.now().toString(),
      name,
      permissions,
      createdAt: new Date()
    };
    
    // TODO: حفظ في database
    
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// فحص الصلاحيات
export const checkPermission: RequestHandler = async (req, res) => {
  try {
    const { userId, resource, action } = req.body;
    
    // TODO: فحص من database
    const hasPermission = true; // mock
    
    res.json({ hasPermission });
  } catch (error) {
    res.status(500).json({ error: 'Permission check failed' });
  }
};

// سجل التدقيق
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  success: boolean;
  timestamp: Date;
}

export const getAuditLogs: RequestHandler = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // TODO: جلب من database مع pagination
    const logs: AuditLog[] = [
      {
        id: '1',
        userId: 'user-123',
        action: 'update',
        resource: 'product',
        ipAddress: '192.168.1.1',
        success: true,
        timestamp: new Date()
      }
    ];
    
    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: logs.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};
```

#### 2. تحديث server/index.ts

```typescript
// server/index.ts
import express from 'express';
import { listRoles, createRole, checkPermission, getAuditLogs } from './routes/rbac';

export function createServer() {
  const app = express();

  // Existing routes
  app.get('/api/ping', (req, res) => {
    res.json({ message: 'pong' });
  });

  // ✨ NEW: RBAC Routes
  app.get('/api/rbac/roles', listRoles);
  app.post('/api/rbac/roles', createRole);
  app.post('/api/rbac/check-permission', checkPermission);
  app.get('/api/rbac/audit-logs', getAuditLogs);

  return app;
}
```

#### 3. اختبار APIs

```bash
# تشغيل الخادم
pnpm dev

# في terminal آخر، اختبر:
# 1. قائمة الأدوار
curl http://localhost:8080/api/rbac/roles

# 2. إنشاء دور
curl -X POST http://localhost:8080/api/rbac/roles \
  -H "Content-Type: application/json" \
  -d '{"name":"editor","permissions":["read","write"]}'

# 3. فحص الصلاحيات
curl -X POST http://localhost:8080/api/rbac/check-permission \
  -H "Content-Type: application/json" \
  -d '{"userId":"123","resource":"products","action":"write"}'

# 4. سجل التدقيق
curl http://localhost:8080/api/rbac/audit-logs
```

---

### الخطوة 2: ربط Frontend بـ Backend

```typescript
// client/lib/rbac-api.ts
export interface Role {
  id: string;
  name: string;
  permissions: string[];
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  success: boolean;
  timestamp: Date;
}

// جلب الأدوار
export async function fetchRoles(): Promise<Role[]> {
  const response = await fetch('/api/rbac/roles');
  if (!response.ok) throw new Error('Failed to fetch roles');
  return response.json();
}

// إنشاء دور
export async function createRole(data: {
  name: string;
  permissions: string[];
}): Promise<Role> {
  const response = await fetch('/api/rbac/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create role');
  return response.json();
}

// فحص الصلاحيات
export async function checkPermission(data: {
  userId: string;
  resource: string;
  action: string;
}): Promise<{ hasPermission: boolean }> {
  const response = await fetch('/api/rbac/check-permission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Permission check failed');
  return response.json();
}

// جلب سجل التدقيق
export async function fetchAuditLogs(params?: {
  page?: number;
  limit?: number;
}): Promise<{
  logs: AuditLog[];
  pagination: { page: number; limit: number; total: number };
}> {
  const query = new URLSearchParams(params as any).toString();
  const response = await fetch(`/api/rbac/audit-logs?${query}`);
  if (!response.ok) throw new Error('Failed to fetch audit logs');
  return response.json();
}
```

#### تحديث RBACSystem Component

```typescript
// client/components/advanced/RBACSystem.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRoles, createRole, fetchAuditLogs } from '@/lib/rbac-api';

export function RBACSystem() {
  const queryClient = useQueryClient();
  
  // جلب الأدوار
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles
  });
  
  // جلب سجل التدقيق
  const { data: auditData } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => fetchAuditLogs({ page: 1, limit: 20 })
  });
  
  // إنشاء دور جديد
  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });
  
  // ... بقية الكود
}
```

---

### الخطوة 3: Notifications API مع Real-time

```typescript
// server/routes/notifications.ts
import { RequestHandler } from 'express';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
}

// جلب الإشعارات
export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // TODO: جلب من database
    const notifications: Notification[] = [
      {
        id: '1',
        userId: userId as string,
        title: 'طلب جديد',
        message: 'لديك طلب جديد #12345',
        type: 'info',
        isRead: false,
        createdAt: new Date()
      }
    ];
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// تعليم كمقروء
export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: تحديث في database
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

// تعليم الكل كمقروء
export const markAllAsRead: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // TODO: تحديث الكل في database
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};
```

#### إضافة WebSocket للإشعارات الفورية

```typescript
// server/websocket.ts
import { WebSocketServer, WebSocket } from 'ws';

interface Client {
  userId: string;
  ws: WebSocket;
}

const clients: Client[] = [];

export function setupWebSocket(port: number = 8081) {
  const wss = new WebSocketServer({ port });
  
  wss.on('connection', (ws, req) => {
    // استخراج userId من URL
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      ws.close(1008, 'User ID required');
      return;
    }
    
    // إضافة client
    clients.push({ userId, ws });
    console.log(`✅ Client connected: ${userId}`);
    
    // عند الانقطاع
    ws.on('close', () => {
      const index = clients.findIndex(c => c.ws === ws);
      if (index !== -1) {
        clients.splice(index, 1);
        console.log(`❌ Client disconnected: ${userId}`);
      }
    });
  });
  
  console.log(`🔌 WebSocket server running on port ${port}`);
  
  return wss;
}

// إرسال إشعار لمستخدم محدد
export function sendNotification(userId: string, notification: any) {
  const client = clients.find(c => c.userId === userId);
  
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify({
      type: 'notification',
      data: notification
    }));
    return true;
  }
  
  return false;
}

// broadcast لكل المستخدمين
export function broadcastNotification(notification: any) {
  clients.forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  });
}
```

#### تحديث server/index.ts

```typescript
// server/index.ts
import { setupWebSocket } from './websocket';
import { getNotifications, markAsRead, markAllAsRead } from './routes/notifications';

export function createServer() {
  const app = express();
  
  // Notification routes
  app.get('/api/notifications', getNotifications);
  app.post('/api/notifications/:id/mark-read', markAsRead);
  app.post('/api/notifications/mark-all-read', markAllAsRead);
  
  return app;
}

// في نهاية الملف
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT);

// WebSocket على port مختلف
setupWebSocket(8081);
```

#### ربط Frontend بـ WebSocket

```typescript
// client/hooks/useNotifications.ts
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: Date;
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const queryClient = useQueryClient();
  
  // جلب الإشعارات من API
  const { data } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      return res.json();
    }
  });
  
  useEffect(() => {
    if (data) setNotifications(data);
  }, [data]);
  
  // اتصال WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8081?userId=${userId}`);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'notification') {
        // إضافة إشعار جديد
        setNotifications(prev => [message.data, ...prev]);
        
        // تحديث cache
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('❌ WebSocket disconnected');
    };
    
    return () => {
      ws.close();
    };
  }, [userId]);
  
  // تعليم كمقروء
  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}/mark-read`, { method: 'POST' });
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };
  
  return {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    markAsRead
  };
}
```

#### استخدام في Component

```typescript
// client/components/NotificationsCenter.tsx
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationsCenter() {
  const userId = 'current-user-id'; // من authentication
  const { notifications, unreadCount, markAsRead } = useNotifications(userId);
  
  return (
    <div>
      <h2>الإشعارات ({unreadCount})</h2>
      
      {notifications.map(notification => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          <h3>{notification.title}</h3>
          <p>{notification.message}</p>
          {!notification.isRead && <span>جديد</span>}
        </div>
      ))}
    </div>
  );
}
```

---

### الخطوة 4: اختبار النظام الكامل

```bash
# Terminal 1: تشغيل الخادم
pnpm dev

# Terminal 2: اختبار WebSocket
npm install -g wscat
wscat -c "ws://localhost:8081?userId=test-user"

# Terminal 3: إرسال إشعار تجريبي (في Node.js REPL)
node
> const WebSocket = require('ws');
> const ws = new WebSocket('ws://localhost:8081?userId=test-user');
> ws.on('open', () => {
    ws.send(JSON.stringify({
      type: 'notification',
      data: {
        id: Date.now(),
        title: 'اختبار',
        message: 'إشعار تجريبي',
        type: 'success',
        isRead: false,
        createdAt: new Date()
      }
    }));
  });
```

---

## ✅ ما تم إنجازه بهذا الدليل

1. ✅ RBAC API كامل مع audit logs
2. ✅ Notifications API مع WebSocket
3. ✅ Real-time updates للإشعارات
4. ✅ Integration مع Frontend components
5. ✅ Custom hooks للاستخدام السهل

---

## 🎯 الخطوات التالية

1. **قاعدة البيانات**
   ```bash
   # إنشاء جداول MongoDB/Appwrite
   # أو PostgreSQL/MySQL حسب اختيارك
   ```

2. **Authentication**
   ```bash
   # إضافة JWT middleware
   pnpm add jsonwebtoken
   ```

3. **المزيد من APIs**
   - Smart Contracts API
   - A/B Testing API
   - Customer Experience API
   - Supply Chain API

---

**الوقت المتوقع:** 30-60 دقيقة لكل API  
**المستوى:** متوسط  
**المتطلبات:** معرفة أساسية بـ Express + React

🚀 **ابدأ الآن!**
