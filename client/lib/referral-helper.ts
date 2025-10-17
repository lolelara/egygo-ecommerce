/**
 * Referral System Helper
 * 
 * مساعد لنظام الإحالة بدون الاعتماد على Cloud Functions
 */

import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

/**
 * Constants
 */
export const REFERRAL_REWARDS = {
  SIGNUP_BONUS: 50, // مكافأة التسجيل للمُحيل (ج.م)
  FIRST_PURCHASE_BONUS: 100, // مكافأة أول عملية شراء
  COMMISSION_PERCENTAGE: 10, // نسبة العمولة على المبيعات (%)
};

export const REFERRAL_STATUS = {
  PENDING: 'pending', // في انتظار أول عملية شراء
  ACTIVE: 'active', // أجرى المُحال أول عملية شراء
  COMPLETED: 'completed', // تم صرف المكافأة
};

/**
 * Get referrer info by affiliate code
 */
export async function getReferrerByCode(affiliateCode: string) {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.userPreferences,
      [Query.equal('affiliateCode', affiliateCode), Query.limit(1)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting referrer by code:', error);
    return null;
  }
}

/**
 * Create referral record
 */
export async function createReferralRecord(data: {
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  referralCode: string;
}) {
  try {
    const record = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referrals,
      ID.unique(),
      {
        referrerId: data.referrerId,
        referredUserId: data.referredUserId,
        referredUserName: data.referredUserName,
        referredUserEmail: data.referredUserEmail,
        referralCode: data.referralCode,
        status: REFERRAL_STATUS.PENDING,
        reward: 0,
        level: 1,
        createdAt: new Date().toISOString(),
      }
    );

    console.log('✅ Referral record created:', record.$id);
    return record;
  } catch (error) {
    console.error('Error creating referral record:', error);
    throw error;
  }
}

/**
 * Handle first purchase by referred user
 * يتم استدعاء هذه الدالة عند أول عملية شراء للمُحال
 */
export async function handleFirstPurchase(
  referredUserId: string,
  orderId: string,
  orderAmount: number
) {
  try {
    // البحث عن سجل الإحالة
    const referralsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referrals,
      [
        Query.equal('referredUserId', referredUserId),
        Query.equal('status', REFERRAL_STATUS.PENDING),
        Query.limit(1),
      ]
    );

    if (referralsResponse.documents.length === 0) {
      console.log('No pending referral found for user:', referredUserId);
      return null;
    }

    const referral = referralsResponse.documents[0];

    // تحديث حالة الإحالة إلى active
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referrals,
      referral.$id,
      {
        status: REFERRAL_STATUS.ACTIVE,
        reward: REFERRAL_REWARDS.FIRST_PURCHASE_BONUS,
        completedAt: new Date().toISOString(),
      }
    );

    // إنشاء سجل أرباح
    await createEarningRecord({
      referrerId: referral.referrerId,
      referredUserId: referredUserId,
      orderId: orderId,
      amount: REFERRAL_REWARDS.FIRST_PURCHASE_BONUS,
      percentage: 0,
      level: 1,
      type: 'first_purchase',
      status: 'completed',
    });

    console.log('✅ First purchase handled successfully');
    return referral;
  } catch (error) {
    console.error('Error handling first purchase:', error);
    throw error;
  }
}

/**
 * Handle purchase commission
 * يتم استدعاء هذه الدالة عند كل عملية شراء للمُحال
 */
export async function handlePurchaseCommission(
  referredUserId: string,
  orderId: string,
  orderAmount: number
) {
  try {
    // البحث عن سجل الإحالة النشط
    const referralsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referrals,
      [
        Query.equal('referredUserId', referredUserId),
        Query.equal('status', REFERRAL_STATUS.ACTIVE),
        Query.limit(1),
      ]
    );

    if (referralsResponse.documents.length === 0) {
      console.log('No active referral found for user:', referredUserId);
      return null;
    }

    const referral = referralsResponse.documents[0];

    // حساب العمولة
    const commissionAmount = (orderAmount * REFERRAL_REWARDS.COMMISSION_PERCENTAGE) / 100;

    // إنشاء سجل أرباح
    await createEarningRecord({
      referrerId: referral.referrerId,
      referredUserId: referredUserId,
      orderId: orderId,
      amount: commissionAmount,
      percentage: REFERRAL_REWARDS.COMMISSION_PERCENTAGE,
      level: 1,
      type: 'commission',
      status: 'pending', // يحتاج موافقة أو انتظار استلام الطلب
    });

    console.log('✅ Purchase commission handled successfully');
    return { referral, commission: commissionAmount };
  } catch (error) {
    console.error('Error handling purchase commission:', error);
    throw error;
  }
}

/**
 * Create earning record
 */
async function createEarningRecord(data: {
  referrerId: string;
  referredUserId: string;
  orderId?: string;
  amount: number;
  percentage: number;
  level: number;
  type: 'signup' | 'first_purchase' | 'commission';
  status: 'pending' | 'completed' | 'paid';
}) {
  try {
    const record = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referral_earnings || 'referral_earnings',
      ID.unique(),
      {
        referrerId: data.referrerId,
        referredUserId: data.referredUserId,
        orderId: data.orderId || null,
        amount: data.amount,
        percentage: data.percentage,
        level: data.level,
        type: data.type,
        status: data.status,
        createdAt: new Date().toISOString(),
      }
    );

    console.log('✅ Earning record created:', record.$id);
    return record;
  } catch (error) {
    console.error('Error creating earning record:', error);
    throw error;
  }
}

/**
 * Get referral stats for user
 */
export async function getReferralStats(userId: string) {
  try {
    // Get all referrals
    const referralsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referrals,
      [Query.equal('referrerId', userId), Query.limit(100)]
    );

    // Get all earnings
    const earningsResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.referral_earnings || 'referral_earnings',
      [Query.equal('referrerId', userId), Query.limit(100)]
    );

    const referrals = referralsResponse.documents;
    const earnings = earningsResponse.documents;

    // Calculate stats
    const stats = {
      totalReferrals: referrals.length,
      pendingReferrals: referrals.filter((r: any) => r.status === REFERRAL_STATUS.PENDING).length,
      activeReferrals: referrals.filter((r: any) => r.status === REFERRAL_STATUS.ACTIVE).length,
      totalEarnings: earnings
        .filter((e: any) => e.status === 'completed' || e.status === 'paid')
        .reduce((sum: number, e: any) => sum + (e.amount || 0), 0),
      pendingEarnings: earnings
        .filter((e: any) => e.status === 'pending')
        .reduce((sum: number, e: any) => sum + (e.amount || 0), 0),
    };

    return {
      stats,
      referrals,
      earnings,
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
}

/**
 * Generate referral link
 */
export function generateReferralLink(affiliateCode: string): string {
  return `${window.location.origin}/#/register?ref=${affiliateCode}`;
}
