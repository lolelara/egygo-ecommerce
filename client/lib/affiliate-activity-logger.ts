/**
 * Affiliate Activity Logger
 * يسجل جميع أنشطة المسوق تلقائياً في قاعدة البيانات
 */

import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

export type ActivityType = 'sale' | 'click' | 'link_created' | 'earning' | 'withdrawal' | 'commission';

export interface LogActivityParams {
  affiliateId: string;
  type: ActivityType;
  title: string;
  description?: string;
  amount?: number;
  productId?: string;
  productName?: string;
  orderId?: string;
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Log Affiliate Activity
 */
export async function logAffiliateActivity(params: LogActivityParams): Promise<void> {
  try {
    const activityData = {
      affiliateId: params.affiliateId,
      type: params.type,
      title: params.title,
      description: params.description || '',
      amount: params.amount || 0,
      productId: params.productId || '',
      productName: params.productName || '',
      orderId: params.orderId || '',
      link: params.link || '',
      metadata: JSON.stringify(params.metadata || {}),
      createdAt: new Date().toISOString(),
    };

    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateActivities,
      ID.unique(),
      activityData
    );

    console.log('✅ Activity logged:', params.type);
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - logging shouldn't break the main flow
  }
}

/**
 * Log Click Activity
 */
export async function logClickActivity(
  affiliateId: string,
  productId: string,
  productName: string,
  link: string
): Promise<void> {
  await logAffiliateActivity({
    affiliateId,
    type: 'click',
    title: 'نقرة جديدة',
    description: `نقرة على رابط ${productName}`,
    productId,
    productName,
    link,
  });

  // Also log in affiliate_clicks collection
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateClicks,
      ID.unique(),
      {
        affiliateId,
        productId,
        productName,
        link,
        ipAddress: '', // Can be filled from server-side
        userAgent: navigator.userAgent,
      }
    );
  } catch (error) {
    console.error('Error logging click:', error);
  }
}

/**
 * Log Sale Activity
 */
export async function logSaleActivity(
  affiliateId: string,
  orderId: string,
  productId: string,
  productName: string,
  amount: number,
  commission: number
): Promise<void> {
  await logAffiliateActivity({
    affiliateId,
    type: 'sale',
    title: 'مبيعة جديدة',
    description: `تم شراء ${productName} عبر رابطك`,
    amount: commission,
    productId,
    productName,
    orderId,
  });
}

/**
 * Log Earning Activity
 */
export async function logEarningActivity(
  affiliateId: string,
  amount: number,
  description?: string
): Promise<void> {
  await logAffiliateActivity({
    affiliateId,
    type: 'earning',
    title: 'عمولة مضافة',
    description: description || 'تم إضافة عمولة إلى رصيدك',
    amount,
  });
}

/**
 * Log Link Created Activity
 */
export async function logLinkCreatedActivity(
  affiliateId: string,
  productId: string,
  productName: string,
  link: string
): Promise<void> {
  await logAffiliateActivity({
    affiliateId,
    type: 'link_created',
    title: 'رابط جديد',
    description: `تم إنشاء رابط لمنتج ${productName}`,
    productId,
    productName,
    link,
  });
}

/**
 * Log Withdrawal Activity
 */
export async function logWithdrawalActivity(
  affiliateId: string,
  amount: number,
  status: 'pending' | 'approved' | 'rejected'
): Promise<void> {
  await logAffiliateActivity({
    affiliateId,
    type: 'withdrawal',
    title: 'طلب سحب',
    description: `طلب سحب ${amount} ج.م - ${status === 'pending' ? 'قيد المراجعة' : status === 'approved' ? 'تمت الموافقة' : 'مرفوض'}`,
    amount,
  });
}

/**
 * Update Affiliate Stats
 */
export async function updateAffiliateStats(
  affiliateId: string,
  updates: {
    totalClicks?: number;
    totalOrders?: number;
    totalEarnings?: number;
    pendingEarnings?: number;
    thisMonthEarnings?: number;
  }
): Promise<void> {
  try {
    // Get existing stats
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateStats,
      [
        Query.equal('affiliateId', affiliateId),
      ]
    );

    if (response.documents.length > 0) {
      // Update existing
      const statsDoc = response.documents[0];
      const currentStats = statsDoc as any;

      const updatedStats = {
        totalClicks: updates.totalClicks !== undefined ? updates.totalClicks : currentStats.totalClicks,
        totalOrders: updates.totalOrders !== undefined ? updates.totalOrders : currentStats.totalOrders,
        totalEarnings: updates.totalEarnings !== undefined ? updates.totalEarnings : currentStats.totalEarnings,
        pendingEarnings: updates.pendingEarnings !== undefined ? updates.pendingEarnings : currentStats.pendingEarnings,
        thisMonthEarnings: updates.thisMonthEarnings !== undefined ? updates.thisMonthEarnings : currentStats.thisMonthEarnings,
        updatedAt: new Date().toISOString(),
      };

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.affiliateStats,
        statsDoc.$id,
        updatedStats
      );
    } else {
      // Create new
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.affiliateStats,
        ID.unique(),
        {
          affiliateId,
          totalClicks: updates.totalClicks || 0,
          totalOrders: updates.totalOrders || 0,
          totalEarnings: updates.totalEarnings || 0,
          pendingEarnings: updates.pendingEarnings || 0,
          thisMonthEarnings: updates.thisMonthEarnings || 0,
          updatedAt: new Date().toISOString(),
        }
      );
    }

    console.log('✅ Stats updated for affiliate:', affiliateId);
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

/**
 * Increment Click Count
 */
export async function incrementClickCount(affiliateId: string): Promise<void> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateStats,
      [
        Query.equal('affiliateId', affiliateId),
      ]
    );

    if (response.documents.length > 0) {
      const statsDoc = response.documents[0] as any;
      await updateAffiliateStats(affiliateId, {
        totalClicks: (statsDoc.totalClicks || 0) + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementing clicks:', error);
  }
}

/**
 * Add Commission
 */
export async function addCommission(
  affiliateId: string,
  amount: number,
  orderId: string,
  productName: string
): Promise<void> {
  try {
    // Log earning activity
    await logEarningActivity(affiliateId, amount, `عمولة من طلب ${productName}`);

    // Update stats
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.affiliateStats,
      [
        Query.equal('affiliateId', affiliateId),
      ]
    );

    if (response.documents.length > 0) {
      const statsDoc = response.documents[0] as any;
      await updateAffiliateStats(affiliateId, {
        totalEarnings: (statsDoc.totalEarnings || 0) + amount,
        pendingEarnings: (statsDoc.pendingEarnings || 0) + amount,
        totalOrders: (statsDoc.totalOrders || 0) + 1,
      });
    }

    console.log(`✅ Commission added: ${amount} ج.م for affiliate ${affiliateId}`);
  } catch (error) {
    console.error('Error adding commission:', error);
  }
}
