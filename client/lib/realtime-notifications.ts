/**
 * Real-time Notifications System
 * WebSocket-based notifications using Appwrite Realtime
 */

import { client, databases } from './appwrite';
import { Query } from 'appwrite';

export type NotificationType = 
  | 'order_new'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'commission_approved'
  | 'commission_paid'
  | 'payment_verified'
  | 'payment_rejected'
  | 'withdrawal_approved'
  | 'withdrawal_rejected'
  | 'product_approved'
  | 'product_rejected'
  | 'subscription_expiring'
  | 'subscription_expired';

export interface Notification {
  $id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

class RealtimeNotificationService {
  private unsubscribe: (() => void) | null = null;
  private listeners: Map<string, Set<(notification: Notification) => void>> = new Map();

  /**
   * Subscribe to real-time notifications for a user
   */
  subscribe(userId: string, callback: (notification: Notification) => void) {
    // Add callback to listeners
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }
    this.listeners.get(userId)!.add(callback);

    // Subscribe to Appwrite realtime if not already subscribed
    if (!this.unsubscribe) {
      this.unsubscribe = client.subscribe(
        `databases.68de037e003bd03c4d45.collections.notifications.documents`,
        (response) => {
          if (response.events.includes('databases.*.collections.*.documents.*.create')) {
            const notification = response.payload as Notification;
            
            // Notify all listeners for this user
            const userListeners = this.listeners.get(notification.userId);
            if (userListeners) {
              userListeners.forEach(cb => cb(notification));
            }

            // Show browser notification if permitted
            this.showBrowserNotification(notification);
          }
        }
      );
    }

    // Return unsubscribe function
    return () => {
      const userListeners = this.listeners.get(userId);
      if (userListeners) {
        userListeners.delete(callback);
        if (userListeners.size === 0) {
          this.listeners.delete(userId);
        }
      }

      // Unsubscribe from Appwrite if no more listeners
      if (this.listeners.size === 0 && this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    };
  }

  /**
   * Create a new notification
   */
  async create(notification: Omit<Notification, '$id' | 'createdAt'>): Promise<Notification> {
    try {
      const created = await databases.createDocument(
        '68de037e003bd03c4d45',
        'notifications',
        'unique()',
        {
          ...notification,
          createdAt: new Date().toISOString(),
        }
      );

      return created as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  /**
   * Get user notifications
   */
  async getNotifications(userId: string, limit: number = 20, offset: number = 0): Promise<Notification[]> {
    try {
      const response = await databases.listDocuments(
        '68de037e003bd03c4d45',
        'notifications',
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ]
      );

      return response.documents as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await databases.updateDocument(
        '68de037e003bd03c4d45',
        'notifications',
        notificationId,
        { read: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notifications = await this.getNotifications(userId, 100);
      const unread = notifications.filter(n => !n.read);

      await Promise.all(
        unread.map(n => this.markAsRead(n.$id))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        '68de037e003bd03c4d45',
        'notifications',
        [
          Query.equal('userId', userId),
          Query.equal('read', false),
        ]
      );

      return response.total;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Delete notification
   */
  async delete(notificationId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        '68de037e003bd03c4d45',
        'notifications',
        notificationId
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  /**
   * Show browser notification
   */
  private async showBrowserNotification(notification: Notification) {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/egygo.png',
        badge: '/egygo.png',
        tag: notification.$id,
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/egygo.png',
        });
      }
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    return await Notification.requestPermission();
  }
}

export const realtimeNotifications = new RealtimeNotificationService();

/**
 * Helper functions for creating specific notifications
 */

export const notifyNewOrder = async (merchantId: string, orderId: string, orderTotal: number) => {
  await realtimeNotifications.create({
    userId: merchantId,
    type: 'order_new',
    title: 'طلب جديد! 🎉',
    message: `لديك طلب جديد بقيمة ${orderTotal.toFixed(2)} ج.م`,
    data: { orderId },
    read: false,
  });
};

export const notifyOrderStatusChange = async (
  customerId: string,
  orderId: string,
  status: string
) => {
  const messages = {
    confirmed: 'تم تأكيد طلبك ✅',
    shipped: 'تم شحن طلبك 🚚',
    delivered: 'تم تسليم طلبك 📦',
  };

  await realtimeNotifications.create({
    userId: customerId,
    type: `order_${status}` as NotificationType,
    title: 'تحديث حالة الطلب',
    message: messages[status as keyof typeof messages] || 'تم تحديث حالة طلبك',
    data: { orderId, status },
    read: false,
  });
};

export const notifyCommissionPaid = async (
  affiliateId: string,
  amount: number,
  orderId: string
) => {
  await realtimeNotifications.create({
    userId: affiliateId,
    type: 'commission_paid',
    title: 'تم دفع العمولة 💰',
    message: `تم دفع عمولتك بقيمة ${amount.toFixed(2)} ج.م`,
    data: { amount, orderId },
    read: false,
  });
};

export const notifyPaymentVerified = async (
  merchantId: string,
  orderId: string,
  amount: number
) => {
  await realtimeNotifications.create({
    userId: merchantId,
    type: 'payment_verified',
    title: 'تم التحقق من الدفع ✅',
    message: `تم التحقق من دفعك بقيمة ${amount.toFixed(2)} ج.م`,
    data: { orderId, amount },
    read: false,
  });
};

export const notifyWithdrawalStatus = async (
  userId: string,
  amount: number,
  approved: boolean
) => {
  await realtimeNotifications.create({
    userId,
    type: approved ? 'withdrawal_approved' : 'withdrawal_rejected',
    title: approved ? 'تم الموافقة على السحب ✅' : 'تم رفض السحب ❌',
    message: approved
      ? `تم الموافقة على طلب سحب ${amount.toFixed(2)} ج.م`
      : `تم رفض طلب سحب ${amount.toFixed(2)} ج.م`,
    data: { amount, approved },
    read: false,
  });
};

export const notifySubscriptionExpiring = async (
  merchantId: string,
  daysLeft: number
) => {
  await realtimeNotifications.create({
    userId: merchantId,
    type: 'subscription_expiring',
    title: 'اشتراكك على وشك الانتهاء ⚠️',
    message: `اشتراكك سينتهي خلال ${daysLeft} أيام. جدد الآن!`,
    data: { daysLeft },
    read: false,
  });
};
