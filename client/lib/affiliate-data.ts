/**
 * Affiliate Data Service
 * 
 * يوفر جميع البيانات الحقيقية للمسوق من Appwrite
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

/**
 * Get Affiliate Stats from Database
 */
export async function getAffiliateStats(affiliateId: string) {
  try {
    // Get or create affiliate stats document
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateStats,
      [
        Query.equal('affiliateId', affiliateId),
        Query.limit(1)
      ]
    );

    if (response.documents.length > 0) {
      const stats = response.documents[0] as any;
      return {
        totalClicks: stats.totalClicks || 0,
        totalOrders: stats.totalOrders || 0,
        totalEarnings: stats.totalEarnings || 0,
        pendingEarnings: stats.pendingEarnings || 0,
        thisMonthEarnings: stats.thisMonthEarnings || 0,
        conversionRate: stats.conversionRate || 0,
        clicks: stats.totalClicks || 0,
        conversions: stats.totalOrders || 0,
        referralCount: stats.totalOrders || 0,
        commissionRate: 15, // Default commission rate
        affiliateCode: `AFF${affiliateId.slice(0, 6).toUpperCase()}`,
        rank: stats.rank || null
      };
    }

    // Create initial stats if not exists
    const newStats = {
      affiliateId,
      totalClicks: 0,
      totalOrders: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      thisMonthEarnings: 0,
      updatedAt: new Date().toISOString()
    };

    try {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.affiliateStats,
        'unique()',
        newStats
      );
    } catch (error) {
      console.error('Error creating stats:', error);
    }

    return {
      ...newStats,
      clicks: 0,
      conversions: 0,
      referralCount: 0,
      commissionRate: 15,
      affiliateCode: `AFF${affiliateId.slice(0, 6).toUpperCase()}`,
      rank: null
    };
  } catch (error) {
    console.error('Error getting affiliate stats:', error);
    throw error;
  }
}

/**
 * Get Affiliate Activities
 */
export async function getAffiliateActivities(affiliateId: string, limit = 10) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateActivities,
      [
        Query.equal('affiliateId', affiliateId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      type: doc.type,
      title: doc.title,
      description: doc.description,
      amount: doc.amount,
      time: new Date(doc.createdAt),
      productName: doc.productName
    }));
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
}

/**
 * Get Affiliate Clicks
 */
export async function getAffiliateClicks(affiliateId: string) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateClicks,
      [
        Query.equal('affiliateId', affiliateId),
        Query.limit(1000)
      ]
    );

    return response.total;
  } catch (error) {
    console.error('Error getting clicks:', error);
    return 0;
  }
}

/**
 * Get Affiliate Notifications
 */
export async function getAffiliateNotifications(userId: string, limit = 5) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      type: doc.type,
      title: doc.title,
      message: doc.message,
      actionLabel: doc.actionLabel,
      actionLink: doc.actionLink,
      isRead: doc.isRead,
      isNew: doc.isNew
    }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

/**
 * Get Withdrawal Requests
 */
export async function getWithdrawalRequests(affiliateId: string) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.withdrawalRequests,
      [
        Query.equal('affiliateId', affiliateId),
        Query.orderDesc('$createdAt'),
        Query.limit(10)
      ]
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      amount: doc.amount,
      fee: doc.fee,
      netAmount: doc.netAmount,
      paymentMethod: doc.paymentMethod,
      status: doc.status,
      createdAt: doc.createdAt,
      processedAt: doc.processedAt
    }));
  } catch (error) {
    console.error('Error getting withdrawal requests:', error);
    return [];
  }
}

/**
 * Get Active Products for Affiliate
 */
export async function getActiveProducts(limit = 10) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.products,
      [
        Query.equal('isActive', true),
        Query.orderDesc('$createdAt'),
        Query.limit(limit)
      ]
    );

    return response.documents;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

/**
 * Update Affiliate Stats
 */
export async function updateAffiliateStats(affiliateId: string, updates: any) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateStats,
      [
        Query.equal('affiliateId', affiliateId),
        Query.limit(1)
      ]
    );

    if (response.documents.length > 0) {
      const statsDoc = response.documents[0];
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.affiliateStats,
        statsDoc.$id,
        {
          ...updates,
          updatedAt: new Date().toISOString()
        }
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error updating stats:', error);
    return false;
  }
}

/**
 * Track Affiliate Click
 */
export async function trackAffiliateClick(affiliateId: string, productId: string, metadata?: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateClicks,
      'unique()',
      {
        affiliateId,
        productId,
        ipAddress: metadata?.ipAddress || '',
        userAgent: metadata?.userAgent || navigator.userAgent,
        referrer: metadata?.referrer || document.referrer,
        converted: false,
        createdAt: new Date().toISOString()
      }
    );

    // Update total clicks
    const stats = await getAffiliateStats(affiliateId);
    await updateAffiliateStats(affiliateId, {
      totalClicks: (stats.totalClicks || 0) + 1
    });

    return true;
  } catch (error) {
    console.error('Error tracking click:', error);
    return false;
  }
}

/**
 * Record Affiliate Activity
 */
export async function recordActivity(
  affiliateId: string,
  type: 'sale' | 'click' | 'link_created' | 'earning',
  title: string,
  description?: string,
  amount?: number,
  productId?: string,
  productName?: string
) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateActivities,
      'unique()',
      {
        affiliateId,
        type,
        title,
        description: description || '',
        amount: amount || 0,
        productId: productId || '',
        productName: productName || '',
        createdAt: new Date().toISOString()
      }
    );

    return true;
  } catch (error) {
    console.error('Error recording activity:', error);
    return false;
  }
}

/**
 * Get Leaderboard Data
 */
export async function getLeaderboard(limit = 10) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateStats,
      [
        Query.orderDesc('totalEarnings'),
        Query.limit(limit)
      ]
    );

    return response.documents.map((doc: any, index: number) => ({
      rank: index + 1,
      affiliateId: doc.affiliateId,
      earnings: doc.totalEarnings || 0,
      clicks: doc.totalClicks || 0,
      orders: doc.totalOrders || 0
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}
