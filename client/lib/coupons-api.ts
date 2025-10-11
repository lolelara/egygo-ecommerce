/**
 * Coupons API - Advanced Coupon Management
 */

import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const COUPONS_COLLECTION = 'coupons';

export interface Coupon {
  $id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  $createdAt: string;
}

export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  message?: string;
}

class CouponsAPI {
  /**
   * Get all coupons (Admin only)
   */
  async getAllCoupons(): Promise<Coupon[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COUPONS_COLLECTION,
        [Query.orderDesc('$createdAt')]
      );
      return response.documents as unknown as Coupon[];
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  }

  /**
   * Get active coupons only
   */
  async getActiveCoupons(): Promise<Coupon[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COUPONS_COLLECTION,
        [
          Query.equal('isActive', true),
          Query.greaterThan('validUntil', new Date().toISOString()),
          Query.orderDesc('$createdAt')
        ]
      );
      return response.documents as unknown as Coupon[];
    } catch (error) {
      console.error('Error fetching active coupons:', error);
      return [];
    }
  }

  /**
   * Create a new coupon (Admin only)
   */
  async createCoupon(couponData: {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minAmount?: number;
    maxUses?: number;
    validFrom: string;
    validUntil: string;
  }): Promise<Coupon | null> {
    try {
      const coupon = await databases.createDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        ID.unique(),
        {
          ...couponData,
          code: couponData.code.toUpperCase(),
          usedCount: 0,
          isActive: true
        }
      );
      return coupon as unknown as Coupon;
    } catch (error) {
      console.error('Error creating coupon:', error);
      return null;
    }
  }

  /**
   * Update coupon (Admin only)
   */
  async updateCoupon(
    couponId: string,
    updates: Partial<Omit<Coupon, '$id' | '$createdAt'>>
  ): Promise<boolean> {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        couponId,
        updates
      );
      return true;
    } catch (error) {
      console.error('Error updating coupon:', error);
      return false;
    }
  }

  /**
   * Delete coupon (Admin only)
   */
  async deleteCoupon(couponId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, COUPONS_COLLECTION, couponId);
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      return false;
    }
  }

  /**
   * Validate and apply coupon
   */
  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidation> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COUPONS_COLLECTION,
        [
          Query.equal('code', code.toUpperCase()),
          Query.equal('isActive', true)
        ]
      );

      if (response.documents.length === 0) {
        return {
          valid: false,
          message: 'الكوبون غير موجود أو غير نشط'
        };
      }

      const coupon = response.documents[0] as unknown as Coupon;
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);

      // Check validity period
      if (now < validFrom) {
        return {
          valid: false,
          message: 'الكوبون لم يبدأ بعد'
        };
      }

      if (now > validUntil) {
        return {
          valid: false,
          message: 'انتهت صلاحية الكوبون'
        };
      }

      // Check usage limit
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return {
          valid: false,
          message: 'تم استخدام الكوبون بالكامل'
        };
      }

      // Check minimum amount
      if (coupon.minAmount && cartTotal < coupon.minAmount) {
        return {
          valid: false,
          message: `الحد الأدنى للطلب ${coupon.minAmount} ج.م`
        };
      }

      // Calculate discount
      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = (cartTotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }

      // Ensure discount doesn't exceed cart total
      discount = Math.min(discount, cartTotal);

      return {
        valid: true,
        coupon,
        discount,
        message: `تم تطبيق خصم ${discount.toFixed(2)} ج.م`
      };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return {
        valid: false,
        message: 'حدث خطأ في التحقق من الكوبون'
      };
    }
  }

  /**
   * Increment coupon usage count
   */
  async incrementUsage(couponId: string): Promise<boolean> {
    try {
      const coupon = await databases.getDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        couponId
      );

      await databases.updateDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        couponId,
        {
          usedCount: (coupon.usedCount || 0) + 1
        }
      );

      return true;
    } catch (error) {
      console.error('Error incrementing coupon usage:', error);
      return false;
    }
  }

  /**
   * Get coupon statistics
   */
  async getCouponStats(couponId: string): Promise<{
    totalUses: number;
    remainingUses: number;
    totalDiscount: number;
  }> {
    try {
      const coupon = await databases.getDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        couponId
      ) as unknown as Coupon;

      const remainingUses = coupon.maxUses 
        ? coupon.maxUses - coupon.usedCount 
        : Infinity;

      return {
        totalUses: coupon.usedCount,
        remainingUses: remainingUses === Infinity ? -1 : remainingUses,
        totalDiscount: 0 // TODO: Calculate from orders
      };
    } catch (error) {
      console.error('Error fetching coupon stats:', error);
      return {
        totalUses: 0,
        remainingUses: 0,
        totalDiscount: 0
      };
    }
  }

  /**
   * Toggle coupon active status
   */
  async toggleActive(couponId: string): Promise<boolean> {
    try {
      const coupon = await databases.getDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        couponId
      );

      await databases.updateDocument(
        DATABASE_ID,
        COUPONS_COLLECTION,
        couponId,
        {
          isActive: !coupon.isActive
        }
      );

      return true;
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      return false;
    }
  }
}

export const couponsAPI = new CouponsAPI();
