/**
 * Commission System
 * نظام العمولات للمسوقين والتجار
 */

import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

export interface CommissionRecord {
  id: string;
  affiliateId: string;
  orderId: string;
  productId: string;
  productName: string;
  orderTotal: number;
  commissionAmount: number;
  commissionRate: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paymentCollected: boolean; // تم تحصيل الدفع من العميل
  deliveryConfirmed: boolean; // تم تأكيد التوصيل
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface MerchantEarning {
  id: string;
  merchantId: string;
  orderId: string;
  productId: string;
  productName: string;
  saleAmount: number;
  merchantEarning: number;
  platformFee: number;
  status: 'pending' | 'approved' | 'paid';
  deliveryConfirmed: boolean;
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

/**
 * Create Commission Record when order is placed
 */
export async function createCommissionRecord(params: {
  affiliateId: string;
  orderId: string;
  productId: string;
  productName: string;
  orderTotal: number;
  commissionRate?: number;
}): Promise<void> {
  try {
    const commissionRate = params.commissionRate || 0.15; // 15% default
    const commissionAmount = params.orderTotal * commissionRate;

    await databases.createDocument(
      appwriteConfig.databaseId,
      'affiliate_commissions',
      ID.unique(),
      {
        affiliateId: params.affiliateId,
        orderId: params.orderId,
        productId: params.productId,
        productName: params.productName,
        orderTotal: params.orderTotal,
        commissionAmount,
        commissionRate,
        status: 'pending',
        paymentCollected: false,
        deliveryConfirmed: false,
        createdAt: new Date().toISOString(),
      }
    );

    console.log(`✅ Commission record created: ${commissionAmount} ج.م for affiliate ${params.affiliateId}`);
  } catch (error) {
    console.error('Error creating commission record:', error);
  }
}

/**
 * Create Merchant Earning Record
 */
export async function createMerchantEarning(params: {
  merchantId: string;
  orderId: string;
  productId: string;
  productName: string;
  saleAmount: number;
  platformFeeRate?: number;
}): Promise<void> {
  try {
    const platformFeeRate = params.platformFeeRate || 0.10; // 10% platform fee
    const platformFee = params.saleAmount * platformFeeRate;
    const merchantEarning = params.saleAmount - platformFee;

    await databases.createDocument(
      appwriteConfig.databaseId,
      'merchant_earnings',
      ID.unique(),
      {
        merchantId: params.merchantId,
        orderId: params.orderId,
        productId: params.productId,
        productName: params.productName,
        saleAmount: params.saleAmount,
        merchantEarning,
        platformFee,
        status: 'pending',
        deliveryConfirmed: false,
        createdAt: new Date().toISOString(),
      }
    );

    console.log(`✅ Merchant earning created: ${merchantEarning} ج.م for merchant ${params.merchantId}`);
  } catch (error) {
    console.error('Error creating merchant earning:', error);
  }
}

/**
 * Approve Commission after Payment Collection
 * يتم استدعاؤها من الأدمن بعد تأكيد تحصيل الدفع
 */
export async function approveCommissionAfterPayment(
  commissionId: string,
  adminId: string
): Promise<void> {
  try {
    // Update commission record
    const commission = await databases.getDocument(
      appwriteConfig.databaseId,
      'affiliate_commissions',
      commissionId
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      'affiliate_commissions',
      commissionId,
      {
        status: 'approved',
        paymentCollected: true,
        approvedAt: new Date().toISOString(),
        approvedBy: adminId,
      }
    );

    // Add to affiliate's available balance
    await updateAffiliateBalance(
      (commission as any).affiliateId,
      (commission as any).commissionAmount,
      'add'
    );

    console.log(`✅ Commission approved: ${commissionId}`);
  } catch (error) {
    console.error('Error approving commission:', error);
    throw error;
  }
}

/**
 * Approve Merchant Earning after Delivery Confirmation
 * يتم استدعاؤها من الأدمن بعد تأكيد التوصيل
 */
export async function approveMerchantEarningAfterDelivery(
  earningId: string,
  adminId: string
): Promise<void> {
  try {
    // Update earning record
    const earning = await databases.getDocument(
      appwriteConfig.databaseId,
      'merchant_earnings',
      earningId
    );

    await databases.updateDocument(
      appwriteConfig.databaseId,
      'merchant_earnings',
      earningId,
      {
        status: 'approved',
        deliveryConfirmed: true,
        approvedAt: new Date().toISOString(),
        approvedBy: adminId,
      }
    );

    // Add to merchant's available balance
    await updateMerchantBalance(
      (earning as any).merchantId,
      (earning as any).merchantEarning,
      'add'
    );

    console.log(`✅ Merchant earning approved: ${earningId}`);
  } catch (error) {
    console.error('Error approving merchant earning:', error);
    throw error;
  }
}

/**
 * Update Affiliate Balance
 */
async function updateAffiliateBalance(
  affiliateId: string,
  amount: number,
  operation: 'add' | 'subtract'
): Promise<void> {
  try {
    // Get current balance from users collection
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      affiliateId
    );

    const currentBalance = (user as any).totalEarnings || 0;
    const newBalance = operation === 'add' 
      ? currentBalance + amount 
      : currentBalance - amount;

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      affiliateId,
      {
        totalEarnings: newBalance,
      }
    );

    console.log(`✅ Affiliate balance updated: ${affiliateId} - ${newBalance} ج.م`);
  } catch (error) {
    console.error('Error updating affiliate balance:', error);
  }
}

/**
 * Update Merchant Balance
 */
async function updateMerchantBalance(
  merchantId: string,
  amount: number,
  operation: 'add' | 'subtract'
): Promise<void> {
  try {
    // Get current balance from users collection
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      merchantId
    );

    const currentBalance = (user as any).totalEarnings || 0;
    const newBalance = operation === 'add' 
      ? currentBalance + amount 
      : currentBalance - amount;

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      merchantId,
      {
        totalEarnings: newBalance,
      }
    );

    console.log(`✅ Merchant balance updated: ${merchantId} - ${newBalance} ج.م`);
  } catch (error) {
    console.error('Error updating merchant balance:', error);
  }
}

/**
 * Get Pending Commissions (for Admin)
 */
export async function getPendingCommissions(): Promise<CommissionRecord[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      'affiliate_commissions',
      [
        Query.equal('status', 'pending'),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ]
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      affiliateId: doc.affiliateId,
      orderId: doc.orderId,
      productId: doc.productId,
      productName: doc.productName,
      orderTotal: doc.orderTotal,
      commissionAmount: doc.commissionAmount,
      commissionRate: doc.commissionRate,
      status: doc.status,
      paymentCollected: doc.paymentCollected,
      deliveryConfirmed: doc.deliveryConfirmed,
      createdAt: doc.createdAt,
      approvedAt: doc.approvedAt,
      paidAt: doc.paidAt,
    }));
  } catch (error) {
    console.error('Error getting pending commissions:', error);
    return [];
  }
}

/**
 * Get Pending Merchant Earnings (for Admin)
 */
export async function getPendingMerchantEarnings(): Promise<MerchantEarning[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      'merchant_earnings',
      [
        Query.equal('status', 'pending'),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ]
    );

    return response.documents.map((doc: any) => ({
      id: doc.$id,
      merchantId: doc.merchantId,
      orderId: doc.orderId,
      productId: doc.productId,
      productName: doc.productName,
      saleAmount: doc.saleAmount,
      merchantEarning: doc.merchantEarning,
      platformFee: doc.platformFee,
      status: doc.status,
      deliveryConfirmed: doc.deliveryConfirmed,
      createdAt: doc.createdAt,
      approvedAt: doc.approvedAt,
      paidAt: doc.paidAt,
    }));
  } catch (error) {
    console.error('Error getting pending merchant earnings:', error);
    return [];
  }
}

/**
 * Track Landing Page Visit and Purchase
 */
export async function trackLandingPagePurchase(params: {
  landingPageId: string;
  affiliateId: string;
  productId: string;
  orderId: string;
  orderTotal: number;
}): Promise<void> {
  try {
    // Create commission record
    await createCommissionRecord({
      affiliateId: params.affiliateId,
      orderId: params.orderId,
      productId: params.productId,
      productName: '', // Will be filled from product data
      orderTotal: params.orderTotal,
    });

    // Log activity
    await databases.createDocument(
      appwriteConfig.databaseId,
      'landing_page_conversions',
      ID.unique(),
      {
        landingPageId: params.landingPageId,
        affiliateId: params.affiliateId,
        productId: params.productId,
        orderId: params.orderId,
        orderTotal: params.orderTotal,
        convertedAt: new Date().toISOString(),
      }
    );

    console.log(`✅ Landing page purchase tracked: ${params.orderId}`);
  } catch (error) {
    console.error('Error tracking landing page purchase:', error);
  }
}
