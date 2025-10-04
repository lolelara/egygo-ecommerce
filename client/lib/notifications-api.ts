/**
 * Notifications API
 * For managing user notifications
 */

import { databases, account } from './appwrite';
import { Query, ID } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const NOTIFICATIONS_COLLECTION_ID = 'notifications'; // Make sure this collection exists

export interface Notification {
  $id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  $createdAt: string;
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
        Query.equal('isRead', false),
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
      { isRead: true }
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
        Query.equal('isRead', false),
        Query.limit(100)
      ]
    );

    await Promise.all(
      notifications.documents.map(notification =>
        databases.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          notification.$id,
          { isRead: true }
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
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
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
        isRead: false,
        link: link || null
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
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<{ success: number; failed: number }> {
  try {
    // Get all users
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      'users',
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
