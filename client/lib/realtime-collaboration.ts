/**
 * Real-time Collaboration للأدمن
 * تعاون لحظي بين المديرين على نفس البيانات
 */

import { client, databases, appwriteConfig } from './appwrite';

interface CollaborationEvent {
  type: 'edit' | 'lock' | 'unlock' | 'presence';
  userId: string;
  userName: string;
  resourceType: string;
  resourceId: string;
  data?: any;
  timestamp: Date;
}

interface UserPresence {
  userId: string;
  userName: string;
  avatar?: string;
  lastSeen: Date;
  currentResource?: {
    type: string;
    id: string;
  };
}

export class RealtimeCollaboration {
  private presenceMap: Map<string, UserPresence> = new Map();
  private lockedResources: Map<string, string> = new Map(); // resourceId -> userId
  private subscriptions: Map<string, () => void> = new Map();
  private heartbeatInterval?: NodeJS.Timeout;
  
  constructor(
    private userId: string,
    private userName: string
  ) {
    this.startHeartbeat();
  }
  
  /**
   * بدء مراقبة موارد معينة
   */
  watchResource(resourceType: string, resourceId: string, callbacks: {
    onEdit?: (event: CollaborationEvent) => void;
    onLock?: (event: CollaborationEvent) => void;
    onUnlock?: (event: CollaborationEvent) => void;
    onPresence?: (users: UserPresence[]) => void;
  }) {
    const subscriptionKey = `${resourceType}:${resourceId}`;
    
    // الاشتراك في تحديثات الـ collection
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${resourceType}.documents.${resourceId}`,
      (response) => {
        const events = response.events;
        
        if (events.includes('databases.*.collections.*.documents.*.update')) {
          const payload = response.payload as any;
          
          // تجاهل التحديثات من نفس المستخدم
          if (payload.lastEditedBy !== this.userId) {
            callbacks.onEdit?.({
              type: 'edit',
              userId: payload.lastEditedBy,
              userName: payload.lastEditedByName || 'Unknown',
              resourceType,
              resourceId,
              data: payload,
              timestamp: new Date()
            });
          }
        }
      }
    );
    
    this.subscriptions.set(subscriptionKey, unsubscribe);
    
    // تحديث presence
    this.updatePresence(resourceType, resourceId);
    
    return () => {
      this.unwatchResource(resourceType, resourceId);
    };
  }
  
  /**
   * إيقاف المراقبة
   */
  unwatchResource(resourceType: string, resourceId: string) {
    const subscriptionKey = `${resourceType}:${resourceId}`;
    const unsubscribe = this.subscriptions.get(subscriptionKey);
    
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
    
    // إلغاء القفل إذا كان موجود
    this.unlockResource(resourceType, resourceId);
  }
  
  /**
   * قفل مورد للتحرير الحصري
   */
  async lockResource(
    resourceType: string,
    resourceId: string
  ): Promise<boolean> {
    const lockKey = `${resourceType}:${resourceId}`;
    
    // التحقق من القفل الحالي
    const currentLock = this.lockedResources.get(lockKey);
    if (currentLock && currentLock !== this.userId) {
      return false;
    }
    
    try {
      // حفظ القفل في قاعدة البيانات
      await databases.updateDocument(
        appwriteConfig.databaseId,
        resourceType,
        resourceId,
        {
          lockedBy: this.userId,
          lockedByName: this.userName,
          lockedAt: new Date().toISOString()
        }
      );
      
      this.lockedResources.set(lockKey, this.userId);
      
      // إشعار باقي المستخدمين
      this.broadcastEvent({
        type: 'lock',
        userId: this.userId,
        userName: this.userName,
        resourceType,
        resourceId,
        timestamp: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Failed to lock resource:', error);
      return false;
    }
  }
  
  /**
   * فك قفل مورد
   */
  async unlockResource(resourceType: string, resourceId: string) {
    const lockKey = `${resourceType}:${resourceId}`;
    
    // التحقق من أن المستخدم هو من قام بالقفل
    if (this.lockedResources.get(lockKey) !== this.userId) {
      return;
    }
    
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        resourceType,
        resourceId,
        {
          lockedBy: null,
          lockedByName: null,
          lockedAt: null
        }
      );
      
      this.lockedResources.delete(lockKey);
      
      // إشعار باقي المستخدمين
      this.broadcastEvent({
        type: 'unlock',
        userId: this.userId,
        userName: this.userName,
        resourceType,
        resourceId,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to unlock resource:', error);
    }
  }
  
  /**
   * تحديث presence
   */
  private async updatePresence(resourceType: string, resourceId: string) {
    const presence: UserPresence = {
      userId: this.userId,
      userName: this.userName,
      lastSeen: new Date(),
      currentResource: {
        type: resourceType,
        id: resourceId
      }
    };
    
    this.presenceMap.set(this.userId, presence);
    
    // حفظ في localStorage لمشاركة عبر tabs
    localStorage.setItem(
      `presence_${this.userId}`,
      JSON.stringify(presence)
    );
    
    // إشعار باقي المستخدمين
    this.broadcastEvent({
      type: 'presence',
      userId: this.userId,
      userName: this.userName,
      resourceType,
      resourceId,
      data: presence,
      timestamp: new Date()
    });
  }
  
  /**
   * الحصول على المستخدمين المتواجدين
   */
  getActiveUsers(resourceType?: string, resourceId?: string): UserPresence[] {
    const now = Date.now();
    const activeThreshold = 60000; // دقيقة واحدة
    
    return Array.from(this.presenceMap.values()).filter(user => {
      const isActive = now - user.lastSeen.getTime() < activeThreshold;
      
      if (!isActive) return false;
      
      if (resourceType && resourceId) {
        return user.currentResource?.type === resourceType &&
               user.currentResource?.id === resourceId;
      }
      
      return true;
    });
  }
  
  /**
   * بث حدث لباقي المستخدمين
   */
  private broadcastEvent(event: CollaborationEvent) {
    // استخدام BroadcastChannel للمشاركة بين tabs
    const channel = new BroadcastChannel('egygo_collaboration');
    channel.postMessage(event);
    channel.close();
  }
  
  /**
   * بدء heartbeat للحفاظ على presence
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const lastPresence = this.presenceMap.get(this.userId);
      if (lastPresence?.currentResource) {
        this.updatePresence(
          lastPresence.currentResource.type,
          lastPresence.currentResource.id
        );
      }
    }, 30000); // كل 30 ثانية
  }
  
  /**
   * التنظيف عند الخروج
   */
  async cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // فك قفل جميع الموارد
    for (const [lockKey, userId] of this.lockedResources.entries()) {
      if (userId === this.userId) {
        const [resourceType, resourceId] = lockKey.split(':');
        await this.unlockResource(resourceType, resourceId);
      }
    }
    
    // إزالة presence
    this.presenceMap.delete(this.userId);
    localStorage.removeItem(`presence_${this.userId}`);
    
    // إلغاء جميع الاشتراكات
    for (const unsubscribe of this.subscriptions.values()) {
      unsubscribe();
    }
    this.subscriptions.clear();
  }
}

// Hook لاستخدام في React
export function useRealtimeCollaboration(
  resourceType: string,
  resourceId: string,
  userId: string,
  userName: string
) {
  const [activeUsers, setActiveUsers] = React.useState<UserPresence[]>([]);
  const [isLocked, setIsLocked] = React.useState(false);
  const [lockedBy, setLockedBy] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const collaboration = new RealtimeCollaboration(userId, userName);
    
    const unwatch = collaboration.watchResource(resourceType, resourceId, {
      onEdit: (event) => {
        console.log('Resource edited by:', event.userName);
        // إعادة تحميل البيانات
      },
      onLock: (event) => {
        setIsLocked(true);
        setLockedBy(event.userName);
      },
      onUnlock: () => {
        setIsLocked(false);
        setLockedBy(null);
      },
      onPresence: (users) => {
        setActiveUsers(users);
      }
    });
    
    // تحديث active users كل 30 ثانية
    const interval = setInterval(() => {
      setActiveUsers(collaboration.getActiveUsers(resourceType, resourceId));
    }, 30000);
    
    return () => {
      unwatch();
      clearInterval(interval);
      collaboration.cleanup();
    };
  }, [resourceType, resourceId, userId, userName]);
  
  const lockResource = async () => {
    const collaboration = new RealtimeCollaboration(userId, userName);
    return await collaboration.lockResource(resourceType, resourceId);
  };
  
  const unlockResource = async () => {
    const collaboration = new RealtimeCollaboration(userId, userName);
    await collaboration.unlockResource(resourceType, resourceId);
  };
  
  return {
    activeUsers,
    isLocked,
    lockedBy,
    lockResource,
    unlockResource
  };
}

// استيراد React للـ hook
import React from 'react';
