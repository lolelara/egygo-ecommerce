/**
 * Admin Users API
 * API endpoints for managing users (requires Admin API key)
 */

import { Client, Users, Databases, Query } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || ''); // Admin API Key

const users = new Users(client);
const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

/**
 * Update user in Auth
 */
export async function updateUserAuth(userId: string, updates: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}) {
  try {
    // Update name
    if (updates.name) {
      await users.updateName(userId, updates.name);
    }

    // Update email
    if (updates.email) {
      await users.updateEmail(userId, updates.email);
    }

    // Update phone
    if (updates.phone) {
      await users.updatePhone(userId, updates.phone);
    }

    // Update password
    if (updates.password) {
      await users.updatePassword(userId, updates.password);
    }

    return { success: true, message: 'User updated in Auth successfully' };
  } catch (error: any) {
    console.error('Error updating user in Auth:', error);
    throw error;
  }
}

/**
 * Delete user from Auth and all related data
 */
export async function deleteUserComplete(userId: string, documentId: string) {
  try {
    // 1. Delete notifications
    const notifications = await databases.listDocuments(
      DATABASE_ID,
      'notifications',
      [
        Query.equal('userId', userId),
        Query.limit(100)
      ]
    );

    for (const notif of notifications.documents) {
      await databases.deleteDocument(DATABASE_ID, 'notifications', notif.$id);
    }
    console.log(`✅ Deleted ${notifications.documents.length} notifications`);

    // 2. Delete referrals
    try {
      const referrals = await databases.listDocuments(
        DATABASE_ID,
        'referrals',
        [
          Query.equal('referredUserId', userId),
          Query.limit(100)
        ]
      );

      for (const ref of referrals.documents) {
        await databases.deleteDocument(DATABASE_ID, 'referrals', ref.$id);
      }
      console.log(`✅ Deleted ${referrals.documents.length} referrals`);
    } catch (refError) {
      console.error('Error deleting referrals:', refError);
    }

    // 3. Delete from userPreferences
    await databases.deleteDocument(
      DATABASE_ID,
      'userPreferences',
      documentId
    );
    console.log('✅ Deleted from userPreferences');

    // 4. Delete from Auth
    await users.delete(userId);
    console.log('✅ Deleted from Auth');

    return {
      success: true,
      message: 'User deleted completely from all systems',
      deletedNotifications: notifications.documents.length
    };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Express/Node.js API endpoints
 */
export default function handler(req: any, res: any) {
  const { method, body } = req;

  switch (method) {
    case 'PUT':
      // Update user
      return updateUserAuth(body.userId, body.updates)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({ error: error.message }));

    case 'DELETE':
      // Delete user
      return deleteUserComplete(body.userId, body.documentId)
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json({ error: error.message }));

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
