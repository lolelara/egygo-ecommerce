import { RequestHandler } from 'express';

// ============================================
// Notifications APIs
// ============================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'important';
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// GET /api/notifications - جلب الإشعارات
export const getNotifications: RequestHandler = async (req, res) => {
  try {
    const { userId, isRead, type, page = 1, limit = 20 } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // TODO: جلب من Appwrite database
    const notifications: Notification[] = [
      {
        id: '1',
        userId: String(userId),
        title: 'طلب جديد',
        message: 'تم تأكيد طلبك رقم #12345',
        type: 'success',
        isRead: false,
        actionUrl: '/orders/12345',
        createdAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: '2',
        userId: String(userId),
        title: 'خصم خاص',
        message: 'خصم 20% على جميع المنتجات لمدة يوم واحد!',
        type: 'important',
        isRead: false,
        actionUrl: '/products',
        createdAt: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        id: '3',
        userId: String(userId),
        title: 'تم الشحن',
        message: 'طلبك #12340 في الطريق إليك',
        type: 'info',
        isRead: true,
        actionUrl: '/orders/12340/track',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        id: '4',
        userId: String(userId),
        title: 'تحذير مخزون',
        message: 'المنتج "قميص أبيض" أوشك على النفاد',
        type: 'warning',
        isRead: true,
        actionUrl: '/products/shirt-white',
        metadata: { productId: 'shirt-white', stock: 5 },
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ];
    
    // Filter
    let filtered = notifications;
    if (isRead !== undefined) {
      filtered = filtered.filter(n => n.isRead === (isRead === 'true'));
    }
    if (type) {
      filtered = filtered.filter(n => n.type === type);
    }
    
    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginated = filtered.slice(startIndex, endIndex);
    
    res.json({
      notifications: paginated,
      unreadCount: notifications.filter(n => !n.isRead).length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// POST /api/notifications - إنشاء إشعار جديد
export const createNotification: RequestHandler = async (req, res) => {
  try {
    const { userId, title, message, type = 'info', actionUrl, metadata } = req.body;
    
    if (!userId || !title || !message) {
      return res.status(400).json({ 
        error: 'userId, title, and message are required' 
      });
    }
    
    const notification: Notification = {
      id: Date.now().toString(),
      userId,
      title,
      message,
      type,
      isRead: false,
      actionUrl,
      metadata,
      createdAt: new Date()
    };
    
    // TODO: حفظ في database
    
    // Send via WebSocket (if available)
    try {
      const { sendNotificationToUser } = require('../websocket');
      sendNotificationToUser(userId, notification);
    } catch (wsError) {
      console.log('WebSocket not available or user not connected');
    }
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// POST /api/notifications/mark-read - تعليم كمقروء
export const markAsRead: RequestHandler = async (req, res) => {
  try {
    const { notificationId, userId } = req.body;
    
    if (!notificationId) {
      return res.status(400).json({ error: 'notificationId is required' });
    }
    
    // TODO: تحديث في database
    
    res.json({ success: true, notificationId, markedAt: new Date() });
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

// POST /api/notifications/mark-all-read - تعليم الكل كمقروء
export const markAllAsRead: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // TODO: تحديث جميع إشعارات المستخدم في database
    
    res.json({ success: true, userId, markedCount: 5, markedAt: new Date() });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

// DELETE /api/notifications/:id - حذف إشعار
export const deleteNotification: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Notification ID is required' });
    }
    
    // TODO: حذف من database (verify userId owns it)
    
    res.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// POST /api/notifications/broadcast - إرسال إشعار جماعي
export const broadcastNotification: RequestHandler = async (req, res) => {
  try {
    const { title, message, type = 'info', targetUsers, targetRole } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ 
        error: 'title and message are required' 
      });
    }
    
    // TODO: إرسال لمجموعة مستخدمين
    const recipients = targetUsers || ['all'];
    
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      targetUsers: recipients,
      targetRole,
      sentAt: new Date(),
      recipientsCount: recipients.length
    };
    
    // Broadcast via WebSocket
    try {
      const { broadcastToAll, broadcastToRole } = require('../websocket');
      
      if (targetRole) {
        broadcastToRole(targetRole, notification);
      } else {
        broadcastToAll(notification);
      }
    } catch (wsError) {
      console.log('WebSocket broadcast failed');
    }
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
};
