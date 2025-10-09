
import { RequestHandler } from 'express';
import { Query, ID, createDocument, getDocument, updateDocument, deleteDocument, listDocuments } from '../lib/appwrite';
const NOTIFICATIONS_COLLECTION = 'notifications';

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
    const queries: any[] = [Query.equal('userId', String(userId))];
    if (isRead !== undefined) {
      queries.push(Query.equal('isRead', isRead === 'true'));
    }
    if (type) {
      queries.push(Query.equal('type', String(type)));
    }
    queries.push(Query.orderDesc('$createdAt'));
    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    queries.push(Query.limit(Number(limit)));
    queries.push(Query.offset(offset));
    const result = await listDocuments(NOTIFICATIONS_COLLECTION, queries);
    // Get unread count
    const unreadResult = await listDocuments(NOTIFICATIONS_COLLECTION, [
      Query.equal('userId', String(userId)),
      Query.equal('isRead', false)
    ]);
    res.json({
      notifications: result.documents,
      unreadCount: unreadResult.total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit))
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
      return res.status(400).json({ error: 'userId, title, and message are required' });
    }
    const data = {
      userId,
      title,
      message,
      type,
      isRead: false,
      actionUrl,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      createdAt: new Date().toISOString()
    };
    const created = await createDocument(NOTIFICATIONS_COLLECTION, data);
    // Send via WebSocket (if available)
    try {
      const { sendNotificationToUser } = require('../websocket');
      sendNotificationToUser(userId, created);
    } catch (wsError) {
      console.log('WebSocket not available or user not connected');
    }
    res.status(201).json(created);
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
    // Update notification as read
    const updated = await updateDocument(
      NOTIFICATIONS_COLLECTION,
      notificationId,
      { isRead: true }
    );
    res.json({ success: true, notificationId, markedAt: new Date(), updated });
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
    // Get all unread notifications for user
    const unread = await listDocuments(NOTIFICATIONS_COLLECTION, [
      Query.equal('userId', userId),
      Query.equal('isRead', false),
      Query.limit(1000)
    ]);
    const updates = unread.documents.map((n: any) => ({ documentId: n.$id, data: { isRead: true } }));
    let markedCount = 0;
    if (updates.length > 0) {
      // Batch update
      const { updateMultipleDocuments } = require('../lib/appwrite');
      await updateMultipleDocuments(NOTIFICATIONS_COLLECTION, updates);
      markedCount = updates.length;
    }
    res.json({ success: true, userId, markedCount, markedAt: new Date() });
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
    // Optionally: verify userId owns it (not enforced here)
    await deleteDocument(NOTIFICATIONS_COLLECTION, id);
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
      return res.status(400).json({ error: 'title and message are required' });
    }
    let recipients: string[] = [];
    if (targetUsers && Array.isArray(targetUsers)) {
      recipients = targetUsers;
    } else if (targetRole) {
      // Fetch all users with this role (not implemented, placeholder)
      // recipients = await getUsersByRole(targetRole);
      recipients = [];
    } else {
      // Broadcast to all users (not implemented, placeholder)
      recipients = [];
    }
    // Create notification for each recipient
    let createdNotifications = [];
    if (recipients.length > 0) {
      const dataArray = recipients.map(userId => ({
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString()
      }));
      const { createMultipleDocuments } = require('../lib/appwrite');
      createdNotifications = await createMultipleDocuments(NOTIFICATIONS_COLLECTION, dataArray);
    }
    // Broadcast via WebSocket
    try {
      const { broadcastToAll, broadcastToRole } = require('../websocket');
      if (targetRole) {
        broadcastToRole(targetRole, { title, message, type });
      } else {
        broadcastToAll({ title, message, type });
      }
    } catch (wsError) {
      console.log('WebSocket broadcast failed');
    }
    res.status(201).json({
      title,
      message,
      type,
      recipients,
      sentAt: new Date(),
      recipientsCount: recipients.length,
      createdNotifications
    });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
};
