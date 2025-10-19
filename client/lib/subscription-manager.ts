/**
 * Subscription Manager for Merchants
 * Handles product limits and subscription payments
 */

import { databases } from './appwrite';
import { Query, ID } from 'appwrite';

export interface Subscription {
  $id: string;
  merchantId: string;
  merchantName: string;
  planType: 'free' | 'premium';
  productLimit: number;
  currentProducts: number;
  price: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  autoRenew: boolean;
  paymentProof?: string;
}

const FREE_PRODUCT_LIMIT = 50;
const PREMIUM_PRODUCT_LIMIT = 100;
const PREMIUM_PRICE = 750; // EGP

class SubscriptionManager {
  private readonly DATABASE_ID = '68de037e003bd03c4d45';
  private readonly COLLECTION_ID = 'subscriptions';

  /**
   * Get merchant subscription
   */
  async getSubscription(merchantId: string): Promise<Subscription | null> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [Query.equal('merchantId', merchantId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        // Create free subscription
        return await this.createFreeSubscription(merchantId);
      }

      return response.documents[0] as Subscription;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  /**
   * Create free subscription for new merchant
   */
  async createFreeSubscription(merchantId: string): Promise<Subscription> {
    const subscription = {
      merchantId,
      merchantName: '',
      planType: 'free',
      productLimit: FREE_PRODUCT_LIMIT,
      currentProducts: 0,
      price: 0,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      status: 'active',
      autoRenew: false,
    };

    try {
      const created = await databases.createDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        ID.unique(),
        subscription
      );

      return created as Subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Check if merchant can add more products
   */
  async canAddProduct(merchantId: string): Promise<{ allowed: boolean; reason?: string }> {
    const subscription = await this.getSubscription(merchantId);

    if (!subscription) {
      return { allowed: false, reason: 'لم يتم العثور على اشتراك' };
    }

    if (subscription.status !== 'active') {
      return { allowed: false, reason: 'الاشتراك غير نشط' };
    }

    if (subscription.currentProducts >= subscription.productLimit) {
      return {
        allowed: false,
        reason: `لقد وصلت للحد الأقصى (${subscription.productLimit} منتج). قم بالترقية للاشتراك المميز!`,
      };
    }

    return { allowed: true };
  }

  /**
   * Increment product count
   */
  async incrementProductCount(merchantId: string): Promise<void> {
    const subscription = await this.getSubscription(merchantId);
    if (!subscription) return;

    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        subscription.$id,
        { currentProducts: subscription.currentProducts + 1 }
      );
    } catch (error) {
      console.error('Error incrementing product count:', error);
    }
  }

  /**
   * Decrement product count
   */
  async decrementProductCount(merchantId: string): Promise<void> {
    const subscription = await this.getSubscription(merchantId);
    if (!subscription) return;

    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        subscription.$id,
        { currentProducts: Math.max(0, subscription.currentProducts - 1) }
      );
    } catch (error) {
      console.error('Error decrementing product count:', error);
    }
  }

  /**
   * Request premium subscription
   */
  async requestPremiumUpgrade(merchantId: string, paymentProof: string): Promise<Subscription> {
    const subscription = await this.getSubscription(merchantId);
    if (!subscription) throw new Error('Subscription not found');

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month

    try {
      const updated = await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        subscription.$id,
        {
          planType: 'premium',
          productLimit: subscription.productLimit + PREMIUM_PRODUCT_LIMIT,
          price: PREMIUM_PRICE,
          endDate: endDate.toISOString(),
          status: 'pending',
          paymentProof,
        }
      );

      return updated as Subscription;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    }
  }

  /**
   * Approve premium subscription (Admin only)
   */
  async approvePremiumSubscription(subscriptionId: string): Promise<void> {
    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        subscriptionId,
        { status: 'active' }
      );
    } catch (error) {
      console.error('Error approving subscription:', error);
      throw error;
    }
  }

  /**
   * Reject premium subscription (Admin only)
   */
  async rejectPremiumSubscription(subscriptionId: string, reason: string): Promise<void> {
    const subscription = await databases.getDocument(
      this.DATABASE_ID,
      this.COLLECTION_ID,
      subscriptionId
    ) as Subscription;

    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        subscriptionId,
        {
          planType: 'free',
          productLimit: FREE_PRODUCT_LIMIT,
          price: 0,
          status: 'active',
          paymentProof: null,
        }
      );
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      throw error;
    }
  }

  /**
   * Check and expire subscriptions
   */
  async checkExpiredSubscriptions(): Promise<void> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('status', 'active'),
          Query.lessThan('endDate', new Date().toISOString()),
        ]
      );

      for (const subscription of response.documents) {
        await databases.updateDocument(
          this.DATABASE_ID,
          this.COLLECTION_ID,
          subscription.$id,
          {
            status: 'expired',
            planType: 'free',
            productLimit: FREE_PRODUCT_LIMIT,
          }
        );
      }
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
    }
  }

  /**
   * Get all pending subscriptions (Admin)
   */
  async getPendingSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [Query.equal('status', 'pending')]
      );

      return response.documents as Subscription[];
    } catch (error) {
      console.error('Error getting pending subscriptions:', error);
      return [];
    }
  }

  /**
   * Get subscription stats
   */
  async getStats() {
    try {
      const [total, active, premium, expired] = await Promise.all([
        databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [Query.limit(1)]),
        databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [
          Query.equal('status', 'active'),
          Query.limit(1),
        ]),
        databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [
          Query.equal('planType', 'premium'),
          Query.limit(1),
        ]),
        databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [
          Query.equal('status', 'expired'),
          Query.limit(1),
        ]),
      ]);

      return {
        total: total.total,
        active: active.total,
        premium: premium.total,
        expired: expired.total,
        revenue: premium.total * PREMIUM_PRICE,
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      return { total: 0, active: 0, premium: 0, expired: 0, revenue: 0 };
    }
  }
}

export const subscriptionManager = new SubscriptionManager();
export { FREE_PRODUCT_LIMIT, PREMIUM_PRODUCT_LIMIT, PREMIUM_PRICE };
