import { databases, appwriteConfig, client } from './appwrite';
import { Query, type Models } from 'appwrite';

export const NOTIFICATIONS_COLLECTION_ID = 'notifications';

export interface Notification {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId?: string;
  $collectionId?: string;
  userId: string;
  type: 'order' | 'shipping' | 'delivery' | 'alert' | 'info' | 'commission' | 'affiliate';
  title: string;
  message: string;
  read: boolean;
  relatedId?: string; // Order ID, Product ID, etc.
  metadata?: Record<string, any>;
}

export interface CreateNotificationData {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  relatedId?: string;
  metadata?: Record<string, any>;
}

class NotificationService {
  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
        ]
      );
      return response.documents as unknown as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('read', false),
        ]
      );
      return response.total;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationData): Promise<Notification | null> {
    try {
      const notification = await databases.createDocument(
        appwriteConfig.databaseId,
        NOTIFICATIONS_COLLECTION_ID,
        'unique()',
        {
          ...data,
          read: false,
        }
      );
      return notification as unknown as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        { read: true }
      );
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const notifications = await this.getUserNotifications(userId);
      const unreadNotifications = notifications.filter((n) => !n.read);

      await Promise.all(
        unreadNotifications.map((notification) =>
          this.markAsRead(notification.$id)
        )
      );
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId
      );
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId: string): Promise<boolean> {
    try {
      const notifications = await this.getUserNotifications(userId);
      await Promise.all(
        notifications.map((notification) =>
          this.deleteNotification(notification.$id)
        )
      );
      return true;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return false;
    }
  }

  /**
   * Subscribe to real-time notifications
   */
  subscribeToNotifications(
    userId: string,
    callback: (notification: Notification) => void
  ) {
    return client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${NOTIFICATIONS_COLLECTION_ID}.documents`,
      (response) => {
        const payload = response.payload as unknown as Notification;
        
        // Only trigger callback for notifications belonging to this user
        if (payload.userId === userId) {
          callback(payload);
        }
      }
    );
  }

  /**
   * Helper: Create order notification
   */
  async notifyOrderStatus(
    userId: string,
    orderId: string,
    status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  ) {
    const messages = {
      confirmed: {
        title: 'تم تأكيد طلبك',
        message: `تم تأكيد طلبك #${orderId} وجاري التجهيز للشحن`,
        type: 'order' as const,
      },
      shipped: {
        title: 'تم شحن طلبك',
        message: `طلبك #${orderId} في الطريق إليك`,
        type: 'shipping' as const,
      },
      delivered: {
        title: 'تم تسليم طلبك',
        message: `تم تسليم طلبك #${orderId} بنجاح`,
        type: 'delivery' as const,
      },
      cancelled: {
        title: 'تم إلغاء طلبك',
        message: `تم إلغاء طلبك #${orderId}`,
        type: 'alert' as const,
      },
    };

    const config = messages[status];
    return this.createNotification({
      userId,
      ...config,
      relatedId: orderId,
    });
  }

  /**
   * Helper: Create affiliate commission notification
   */
  async notifyAffiliateCommission(
    affiliateId: string,
    amount: number,
    orderId: string
  ) {
    return this.createNotification({
      userId: affiliateId,
      type: 'commission',
      title: 'عمولة جديدة',
      message: `حصلت على عمولة ${amount} ج.م من الطلب #${orderId}`,
      relatedId: orderId,
      metadata: { amount },
    });
  }
}

export const notificationService = new NotificationService();
