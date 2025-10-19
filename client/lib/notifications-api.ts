/**
 * Enhanced Notifications API
 * For managing user notifications with templates, scheduling, and tracking
 */

import { databases, account, appwriteConfig } from './appwrite';
import { Query, ID } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const NOTIFICATIONS_COLLECTION_ID = 'notifications';
const NOTIFICATION_TEMPLATES_COLLECTION_ID = 'notification_templates';
const SCHEDULED_NOTIFICATIONS_COLLECTION_ID = 'scheduled_notifications';

export interface Notification {
  $id: string;
  userId?: string;
  targetAudience: 'all' | 'customers' | 'affiliates' | 'merchants' | 'specific';
  specificUsers?: string[];
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  channels: ('inApp' | 'email' | 'sms' | 'push')[];
  isRead: boolean;
  readAt?: string;
  link?: string;
  status: 'draft' | 'sent' | 'scheduled' | 'failed';
  scheduledFor?: string;
  sentAt?: string;
  totalRecipients: number;
  readCount: number;
  clickCount: number;
  metadata?: any;
  $createdAt: string;
  $updatedAt: string;
}

export interface NotificationTemplate {
  $id: string;
  name: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion';
  targetAudience: 'all' | 'customers' | 'affiliates' | 'merchants' | 'specific';
  channels: ('inApp' | 'email' | 'sms' | 'push')[];
  variables?: string[]; // e.g., ['userName', 'orderNumber']
  isActive: boolean;
  usageCount: number;
  $createdAt: string;
}

/**
 * Get all notifications (Admin only)
 */
export async function getAllNotifications(limit: number = 100): Promise<Notification[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );

    return response.documents as any;
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    return [];
  }
}

/**
 * Get user notifications
 */
export async function getUserNotifications(limit: number = 50): Promise<Notification[]> {
  try {
    const user = await account.get();
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [
        Query.equal('userId', user.$id),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );

    return response.documents as any;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const user = await account.get();
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [
        Query.equal('userId', user.$id),
        Query.equal('read', false),
        Query.limit(1000)
      ]
    );

    return response.total;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string): Promise<void> {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      notificationId,
      { read: true }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(): Promise<void> {
  try {
    const user = await account.get();
    
    const notifications = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [
        Query.equal('userId', user.$id),
        Query.equal('read', false),
        Query.limit(100)
      ]
    );

    await Promise.all(
      notifications.documents.map(notification =>
        databases.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          notification.$id,
          { read: true }
        )
      )
    );
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      notificationId
    );
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

/**
 * Create notification (admin use)
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'order' | 'shipping' | 'delivery' | 'alert' | 'info' | 'commission' | 'affiliate' = 'info',
  link?: string
): Promise<Notification> {
  try {
    const notification = await databases.createDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        title,
        message,
        type,
        read: false,
        relatedId: userId,
        metadata: link ? JSON.stringify({ link }) : undefined
      }
    );

    return notification as any;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Send notification to all users (broadcast)
 */
export async function broadcastNotification(
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' | 'promotion' = 'info'
): Promise<{ success: number; failed: number }> {
  try {
    // Get all users
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      appwriteConfig.collections.users,
      [Query.limit(1000)]
    );

    let success = 0;
    let failed = 0;

    // Create notification for each user
    await Promise.all(
      usersResponse.documents.map(async (user: any) => {
        try {
          await createNotification(user.$id, title, message, type);
          success++;
        } catch {
          failed++;
        }
      })
    );

    return { success, failed };
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    throw error;
  }
}

// ============================================
// NOTIFICATION TEMPLATES
// ============================================

/**
 * Get all notification templates
 */
export async function getNotificationTemplates(): Promise<NotificationTemplate[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATION_TEMPLATES_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
    return response.documents as any;
  } catch (error) {
    console.error('Error fetching templates:', error);
    // Return default templates if collection doesn't exist
    return getDefaultTemplates();
  }
}

/**
 * Get default notification templates
 */
export function getDefaultTemplates(): NotificationTemplate[] {
  return [
    {
      $id: 'welcome',
      name: 'ترحيب بمستخدم جديد',
      title: 'مرحباً بك في إيجي جو! 🎉',
      message: 'مرحباً {userName}، نحن سعداء بانضمامك إلينا. استكشف منتجاتنا واستمتع بالتسوق!',
      type: 'success',
      targetAudience: 'customers',
      channels: ['inApp', 'email'],
      variables: ['userName'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'order_confirmed',
      name: 'تأكيد طلب',
      title: 'تم تأكيد طلبك ✅',
      message: 'طلبك رقم {orderNumber} تم تأكيده بنجاح. سيتم شحنه قريباً.',
      type: 'success',
      targetAudience: 'customers',
      channels: ['inApp', 'email', 'sms'],
      variables: ['orderNumber'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'order_shipped',
      name: 'تم شحن الطلب',
      title: 'طلبك في الطريق 🚚',
      message: 'طلبك رقم {orderNumber} تم شحنه. رقم التتبع: {trackingNumber}',
      type: 'info',
      targetAudience: 'customers',
      channels: ['inApp', 'email', 'sms', 'push'],
      variables: ['orderNumber', 'trackingNumber'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'commission_earned',
      name: 'عمولة جديدة',
      title: 'تهانينا! حصلت على عمولة جديدة 💰',
      message: 'لقد حصلت على عمولة {amount} ج.م من طلب رقم {orderNumber}',
      type: 'success',
      targetAudience: 'affiliates',
      channels: ['inApp', 'email', 'push'],
      variables: ['amount', 'orderNumber'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'commission_paid',
      name: 'تم دفع العمولة',
      title: 'تم تحويل العمولة إلى حسابك 💸',
      message: 'تم تحويل مبلغ {amount} ج.م إلى حسابك. رقم العملية: {transactionId}',
      type: 'success',
      targetAudience: 'affiliates',
      channels: ['inApp', 'email'],
      variables: ['amount', 'transactionId'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'promotion',
      name: 'عرض ترويجي',
      title: 'عرض خاص لفترة محدودة! 🎁',
      message: 'احصل على خصم {discount}% على جميع المنتجات. استخدم كود: {couponCode}',
      type: 'promotion',
      targetAudience: 'all',
      channels: ['inApp', 'email', 'push'],
      variables: ['discount', 'couponCode'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'product_back_in_stock',
      name: 'المنتج متوفر الآن',
      title: 'المنتج الذي تنتظره متوفر الآن! 🎉',
      message: '{productName} عاد للمخزون. اطلبه الآن قبل نفاذ الكمية!',
      type: 'info',
      targetAudience: 'customers',
      channels: ['inApp', 'email', 'push'],
      variables: ['productName'],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    },
    {
      $id: 'password_reset',
      name: 'إعادة تعيين كلمة المرور',
      title: 'طلب إعادة تعيين كلمة المرور',
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.',
      type: 'info',
      targetAudience: 'all',
      channels: ['inApp', 'email'],
      variables: [],
      isActive: true,
      usageCount: 0,
      $createdAt: new Date().toISOString()
    }
  ];
}

/**
 * Create notification from template
 */
export async function createFromTemplate(
  templateId: string,
  variables: Record<string, string>,
  userIds?: string[]
): Promise<{ success: number; failed: number }> {
  try {
    const templates = await getNotificationTemplates();
    const template = templates.find(t => t.$id === templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }

    // Replace variables in title and message
    let title = template.title;
    let message = template.message;
    
    Object.entries(variables).forEach(([key, value]) => {
      title = title.replace(`{${key}}`, value);
      message = message.replace(`{${key}}`, value);
    });

    // Send to specific users or based on target audience
    if (userIds && userIds.length > 0) {
      let success = 0;
      let failed = 0;

      await Promise.all(
        userIds.map(async (userId) => {
          try {
            await createNotification(userId, title, message, template.type);
            success++;
          } catch {
            failed++;
          }
        })
      );

      return { success, failed };
    }

    // Broadcast based on template audience
    return await broadcastNotification(title, message, template.type);
  } catch (error) {
    console.error('Error creating notification from template:', error);
    throw error;
  }
}

// ============================================
// SCHEDULED NOTIFICATIONS
// ============================================

/**
 * Schedule notification for later
 */
export async function scheduleNotification(
  notification: Omit<Notification, '$id' | '$createdAt' | '$updatedAt' | 'status' | 'sentAt' | 'readCount' | 'clickCount'>,
  scheduledFor: Date
): Promise<any> {
  try {
    const doc = await databases.createDocument(
      DATABASE_ID,
      SCHEDULED_NOTIFICATIONS_COLLECTION_ID,
      ID.unique(),
      {
        ...notification,
        status: 'scheduled',
        scheduledFor: scheduledFor.toISOString(),
        readCount: 0,
        clickCount: 0,
        totalRecipients: 0
      }
    );

    return doc;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    // Fallback: store in localStorage
    const scheduled = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
    const newScheduled = {
      id: Date.now().toString(),
      ...notification,
      status: 'scheduled',
      scheduledFor: scheduledFor.toISOString(),
      readCount: 0,
      clickCount: 0
    };
    scheduled.push(newScheduled);
    localStorage.setItem('scheduled_notifications', JSON.stringify(scheduled));
    return newScheduled;
  }
}

/**
 * Get scheduled notifications
 */
export async function getScheduledNotifications(): Promise<any[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SCHEDULED_NOTIFICATIONS_COLLECTION_ID,
      [
        Query.equal('status', 'scheduled'),
        Query.orderAsc('scheduledFor'),
        Query.limit(100)
      ]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching scheduled notifications:', error);
    // Fallback: get from localStorage
    return JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
  }
}

/**
 * Cancel scheduled notification
 */
export async function cancelScheduledNotification(notificationId: string): Promise<void> {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      SCHEDULED_NOTIFICATIONS_COLLECTION_ID,
      notificationId,
      { status: 'cancelled' }
    );
  } catch (error) {
    console.error('Error cancelling scheduled notification:', error);
    // Fallback: remove from localStorage
    const scheduled = JSON.parse(localStorage.getItem('scheduled_notifications') || '[]');
    const updated = scheduled.filter((n: any) => n.id !== notificationId);
    localStorage.setItem('scheduled_notifications', JSON.stringify(updated));
  }
}

// ============================================
// TRACKING & ANALYTICS
// ============================================

/**
 * Track notification read
 */
export async function trackNotificationRead(notificationId: string): Promise<void> {
  try {
    await markAsRead(notificationId);
    
    // Update read count in main notification
    try {
      const notification = await databases.getDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId
      );
      
      await databases.updateDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        {
          readCount: (notification.readCount || 0) + 1,
          readAt: new Date().toISOString()
        }
      );
    } catch (error) {
      console.log('Could not update read count:', error);
    }
  } catch (error) {
    console.error('Error tracking notification read:', error);
  }
}

/**
 * Track notification click
 */
export async function trackNotificationClick(notificationId: string): Promise<void> {
  try {
    const notification = await databases.getDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      notificationId
    );
    
    await databases.updateDocument(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      notificationId,
      {
        clickCount: (notification.clickCount || 0) + 1
      }
    );
  } catch (error) {
    console.error('Error tracking notification click:', error);
  }
}

/**
 * Get notification analytics
 */
export async function getNotificationAnalytics(): Promise<{
  totalSent: number;
  totalRead: number;
  totalClicks: number;
  readRate: number;
  clickRate: number;
}> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      NOTIFICATIONS_COLLECTION_ID,
      [Query.equal('status', 'sent'), Query.limit(1000)]
    );

    const notifications = response.documents;
    const totalSent = notifications.length;
    const totalRead = notifications.filter((n: any) => n.isRead).length;
    const totalClicks = notifications.reduce((sum: number, n: any) => sum + (n.clickCount || 0), 0);

    return {
      totalSent,
      totalRead,
      totalClicks,
      readRate: totalSent > 0 ? (totalRead / totalSent) * 100 : 0,
      clickRate: totalSent > 0 ? (totalClicks / totalSent) * 100 : 0
    };
  } catch (error) {
    console.error('Error getting notification analytics:', error);
    return {
      totalSent: 0,
      totalRead: 0,
      totalClicks: 0,
      readRate: 0,
      clickRate: 0
    };
  }
}

// ============================================
// AUTOMATIC NOTIFICATIONS
// ============================================

/**
 * Send automatic notification for new order
 */
export async function sendOrderConfirmationNotification(
  userId: string,
  orderNumber: string,
  orderTotal: number
): Promise<void> {
  try {
    await createFromTemplate(
      'order_confirmed',
      {
        orderNumber,
        orderTotal: orderTotal.toFixed(2)
      },
      [userId]
    );
  } catch (error) {
    console.error('Error sending order confirmation:', error);
  }
}

/**
 * Send automatic notification for new commission
 */
export async function sendCommissionEarnedNotification(
  affiliateId: string,
  amount: number,
  orderNumber: string
): Promise<void> {
  try {
    await createFromTemplate(
      'commission_earned',
      {
        amount: amount.toFixed(2),
        orderNumber
      },
      [affiliateId]
    );
  } catch (error) {
    console.error('Error sending commission notification:', error);
  }
}

/**
 * Send automatic notification for commission payment
 */
export async function sendCommissionPaidNotification(
  affiliateId: string,
  amount: number,
  transactionId: string
): Promise<void> {
  try {
    await createFromTemplate(
      'commission_paid',
      {
        amount: amount.toFixed(2),
        transactionId
      },
      [affiliateId]
    );
  } catch (error) {
    console.error('Error sending commission paid notification:', error);
  }
}

/**
 * Send automatic notification for order shipped
 */
export async function sendOrderShippedNotification(
  userId: string,
  orderNumber: string,
  trackingNumber: string
): Promise<void> {
  try {
    await createFromTemplate(
      'order_shipped',
      {
        orderNumber,
        trackingNumber
      },
      [userId]
    );
  } catch (error) {
    console.error('Error sending order shipped notification:', error);
  }
}

/**
 * Send welcome notification to new user
 */
export async function sendWelcomeNotification(
  userId: string,
  userName: string
): Promise<void> {
  try {
    await createFromTemplate(
      'welcome',
      { userName },
      [userId]
    );
  } catch (error) {
    console.error('Error sending welcome notification:', error);
  }
}

export const notificationsApi = {
  // User functions
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  
  // Admin functions
  getAllNotifications,
  createNotification,
  broadcastNotification,
  
  // Templates
  getNotificationTemplates,
  getDefaultTemplates,
  createFromTemplate,
  
  // Scheduling
  scheduleNotification,
  getScheduledNotifications,
  cancelScheduledNotification,
  
  // Tracking
  trackNotificationRead,
  trackNotificationClick,
  getNotificationAnalytics,
  
  // Automatic notifications
  sendOrderConfirmationNotification,
  sendCommissionEarnedNotification,
  sendCommissionPaidNotification,
  sendOrderShippedNotification,
  sendWelcomeNotification
};
