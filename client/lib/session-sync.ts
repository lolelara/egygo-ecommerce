/**
 * Session Sync System
 * يحدث session تلقائياً عند تغيير accountStatus بدون logout/login
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

export interface SessionSyncOptions {
  userId: string;
  onUpdate: (userData: any) => void;
  interval?: number; // milliseconds
}

/**
 * Start polling for user updates
 */
export function startSessionSync(options: SessionSyncOptions): () => void {
  const { userId, onUpdate, interval = 10000 } = options; // Poll every 10 seconds
  
  let intervalId: NodeJS.Timeout;
  let lastAccountStatus: string | null = null;

  const checkForUpdates = async () => {
    try {
      // Check userPreferences for updates
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'userPreferences',
        [Query.equal('userId', userId)]
      );

      if (response.documents.length > 0) {
        const userData = response.documents[0];
        
        // Check if accountStatus changed
        if (lastAccountStatus === null) {
          lastAccountStatus = userData.accountStatus;
        } else if (lastAccountStatus !== userData.accountStatus) {
          console.log('🔄 Account status changed:', lastAccountStatus, '→', userData.accountStatus);
          
          // Trigger update
          onUpdate(userData);
          
          // Update last status
          lastAccountStatus = userData.accountStatus;
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  // Start polling
  intervalId = setInterval(checkForUpdates, interval);
  
  // Initial check
  checkForUpdates();

  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}

/**
 * Check for immediate updates (call after important actions)
 */
export async function checkSessionUpdate(userId: string): Promise<any | null> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      'userPreferences',
      [Query.equal('userId', userId)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }
  } catch (error) {
    console.error('Error checking session update:', error);
  }
  
  return null;
}

/**
 * Force refresh user session
 */
export async function refreshUserSession(userId: string, updateContext: (data: any) => void): Promise<void> {
  try {
    console.log('🔄 Refreshing user session...');
    
    const userData = await checkSessionUpdate(userId);
    
    if (userData) {
      console.log('✅ Session refreshed with new data');
      updateContext(userData);
    }
  } catch (error) {
    console.error('Error refreshing session:', error);
  }
}
