/**
 * Ad Notifications System
 * نظام إشعارات الإعلانات
 */

import { databases, appwriteConfig } from './appwrite';
import { ID } from 'appwrite';

/**
 * Notify admin when merchant creates new ad
 */
export async function notifyAdCreated(adminId: string, ad: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications || 'notifications',
      ID.unique(),
      {
        userId: adminId || 'admin',
        title: '📢 إعلان جديد قيد المراجعة',
        message: `${ad.merchantName} أنشأ إعلان لـ ${ad.productName} بقيمة ${ad.price} ج.م`,
        type: 'info',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ 
          type: 'ad_pending', 
          adId: ad.$id,
          merchantId: ad.merchantId,
          productId: ad.productId
        })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Notify merchant when ad is approved
 */
export async function notifyAdApproved(merchantId: string, ad: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications || 'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '✅ تمت الموافقة على إعلانك',
        message: `تم تفعيل إعلان ${ad.productName} بنجاح! سيظهر في الموقع الآن.`,
        type: 'success',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ 
          type: 'ad_approved', 
          adId: ad.$id,
          adType: ad.adType,
          duration: ad.duration
        })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Notify merchant when ad is rejected
 */
export async function notifyAdRejected(merchantId: string, ad: any, reason: string) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications || 'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '❌ تم رفض إعلانك',
        message: `تم رفض إعلان ${ad.productName}. السبب: ${reason}`,
        type: 'alert',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ 
          type: 'ad_rejected', 
          adId: ad.$id,
          reason
        })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Notify merchant when ad is expiring soon (3 days before)
 */
export async function notifyAdExpiringSoon(merchantId: string, ad: any, daysLeft: number) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications || 'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '⏰ إعلانك ينتهي قريباً',
        message: `إعلان ${ad.productName} سينتهي خلال ${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'}. هل تريد التجديد؟`,
        type: 'info',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ 
          type: 'ad_expiring', 
          adId: ad.$id,
          daysLeft,
          canRenew: true
        })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Notify merchant when ad has expired
 */
export async function notifyAdExpired(merchantId: string, ad: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications || 'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '⌛ انتهى إعلانك',
        message: `انتهت صلاحية إعلان ${ad.productName}. يمكنك إنشاء إعلان جديد للاستمرار.`,
        type: 'info',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ 
          type: 'ad_expired', 
          adId: ad.$id,
          canRenew: true
        })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}

/**
 * Notify merchant about ad performance (optional - can be sent weekly)
 */
export async function notifyAdPerformance(merchantId: string, ad: any, analytics: any) {
  try {
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.notifications || 'notifications',
      ID.unique(),
      {
        userId: merchantId,
        title: '📊 تقرير أداء إعلانك',
        message: `إعلان ${ad.productName}: ${analytics.impressions} مشاهدة و ${analytics.clicks} نقرة بنسبة CTR ${analytics.ctr}%`,
        type: 'info',
        read: false,
        relatedId: ad.$id,
        metadata: JSON.stringify({ 
          type: 'ad_performance', 
          adId: ad.$id,
          analytics
        })
      }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
