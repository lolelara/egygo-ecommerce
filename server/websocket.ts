import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

// ============================================
// WebSocket Server للـ Real-time Updates
// ============================================

interface Client {
  userId: string;
  role?: string;
  ws: WebSocket;
  connectedAt: Date;
}

const clients: Client[] = [];

export function setupWebSocket(server: Server, port: number = 8081) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws'
  });
  
  wss.on('connection', (ws: WebSocket, req) => {
    try {
      // استخراج userId من URL query params
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      const role = url.searchParams.get('role');
      
      if (!userId) {
        ws.close(1008, 'User ID required');
        return;
      }
      
      // إضافة client جديد
      const client: Client = {
        userId,
        role: role || undefined,
        ws,
        connectedAt: new Date()
      };
      
      clients.push(client);
      
      console.log(`✅ WebSocket: User ${userId} connected (${role || 'no role'}). Total clients: ${clients.length}`);
      
      // إرسال رسالة ترحيب
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to إيجي جو WebSocket',
        userId,
        timestamp: new Date()
      }));
      
      // استقبال رسائل من client
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          handleClientMessage(userId, data, ws);
        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });
      
      // معالجة الأخطاء
      ws.on('error', (error) => {
        console.error(`❌ WebSocket error for user ${userId}:`, error);
      });
      
      // عند قطع الاتصال
      ws.on('close', () => {
        const index = clients.findIndex(c => c.ws === ws);
        if (index !== -1) {
          clients.splice(index, 1);
          console.log(`❌ WebSocket: User ${userId} disconnected. Total clients: ${clients.length}`);
        }
      });
      
      // Ping/Pong لإبقاء الاتصال حي
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000); // كل 30 ثانية
      
      ws.on('pong', () => {
        // Connection is alive
      });
      
    } catch (error) {
      console.error('Error in WebSocket connection:', error);
      ws.close(1011, 'Internal server error');
    }
  });
  
  console.log(`🔌 WebSocket server ready on port ${port}`);
  
  return wss;
}

// معالجة رسائل من Clients
function handleClientMessage(userId: string, data: any, ws: WebSocket) {
  switch (data.type) {
    case 'ping':
      ws.send(JSON.stringify({
        type: 'pong',
        timestamp: new Date()
      }));
      break;
      
    case 'subscribe':
      // Subscribe to specific channels
      console.log(`User ${userId} subscribed to ${data.channel}`);
      ws.send(JSON.stringify({
        type: 'subscribed',
        channel: data.channel
      }));
      break;
      
    case 'unsubscribe':
      console.log(`User ${userId} unsubscribed from ${data.channel}`);
      break;
      
    default:
      console.log(`Unknown message type from ${userId}:`, data.type);
  }
}

// إرسال إشعار لمستخدم محدد
export function sendNotificationToUser(userId: string, notification: any) {
  const client = clients.find(c => c.userId === userId);
  
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify({
      type: 'notification',
      data: notification,
      timestamp: new Date()
    }));
    return true;
  }
  
  console.log(`User ${userId} not connected to WebSocket`);
  return false;
}

// إرسال لجميع المستخدمين
export function broadcastToAll(data: any) {
  let sentCount = 0;
  
  clients.forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({
        type: 'broadcast',
        data,
        timestamp: new Date()
      }));
      sentCount++;
    }
  });
  
  console.log(`📢 Broadcast sent to ${sentCount} clients`);
  return sentCount;
}

// إرسال بناءً على الدور
export function broadcastToRole(role: string, data: any) {
  let sentCount = 0;
  
  clients
    .filter(c => c.role === role)
    .forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({
          type: 'role-broadcast',
          data,
          timestamp: new Date()
        }));
        sentCount++;
      }
    });
  
  console.log(`📢 Broadcast sent to ${sentCount} ${role} clients`);
  return sentCount;
}

// إرسال تحديث live (للـ analytics, tracking, etc.)
export function sendLiveUpdate(userId: string, updateType: string, data: any) {
  const client = clients.find(c => c.userId === userId);
  
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify({
      type: 'live-update',
      updateType,
      data,
      timestamp: new Date()
    }));
    return true;
  }
  
  return false;
}

// جلب إحصائيات الاتصالات
export function getWebSocketStats() {
  return {
    totalClients: clients.length,
    clientsByRole: clients.reduce((acc, client) => {
      const role = client.role || 'unknown';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    clients: clients.map(c => ({
      userId: c.userId,
      role: c.role,
      connectedAt: c.connectedAt,
      uptime: Date.now() - c.connectedAt.getTime()
    }))
  };
}

// إغلاق اتصال مستخدم محدد
export function disconnectUser(userId: string, reason?: string) {
  const client = clients.find(c => c.userId === userId);
  
  if (client) {
    client.ws.close(1000, reason || 'Disconnected by server');
    return true;
  }
  
  return false;
}
