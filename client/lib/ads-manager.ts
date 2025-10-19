/**
 * Ads Manager - Paid Advertising System
 * Handles sponsored products and premium placements
 */

import { databases, storage } from './appwrite';
import { Query, ID } from 'appwrite';

export interface Advertisement {
  $id: string;
  merchantId: string;
  merchantName: string;
  productId: string;
  productName: string;
  productImage: string;
  adType: 'homepage_banner' | 'homepage_featured' | 'category_top' | 'search_sponsored';
  placement: 'top' | 'sidebar' | 'grid';
  duration: number; // days
  price: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'expired' | 'rejected';
  clicks: number;
  impressions: number;
  paymentProof?: string;
  createdAt: string;
}

// Pricing structure
const AD_PRICES = {
  homepage_banner: 500, // EGP per week
  homepage_featured: 300, // EGP per week
  category_top: 200, // EGP per week
  search_sponsored: 150, // EGP per week
};

class AdsManager {
  private readonly DATABASE_ID = '68de037e003bd03c4d45';
  private readonly COLLECTION_ID = 'advertisements';

  /**
   * Create new advertisement
   */
  async createAd(ad: Omit<Advertisement, '$id' | 'clicks' | 'impressions' | 'createdAt'>): Promise<Advertisement> {
    try {
      const created = await databases.createDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        ID.unique(),
        {
          ...ad,
          clicks: 0,
          impressions: 0,
          createdAt: new Date().toISOString(),
        }
      );

      return created as Advertisement;
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  /**
   * Get active ads by type
   */
  async getActiveAds(adType?: string, limit: number = 10): Promise<Advertisement[]> {
    try {
      const queries = [
        Query.equal('status', 'active'),
        Query.greaterThan('endDate', new Date().toISOString()),
        Query.limit(limit),
        Query.orderDesc('$createdAt'),
      ];

      if (adType) {
        queries.push(Query.equal('adType', adType));
      }

      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        queries
      );

      return response.documents as Advertisement[];
    } catch (error) {
      console.error('Error getting active ads:', error);
      return [];
    }
  }

  /**
   * Get merchant's ads
   */
  async getMerchantAds(merchantId: string): Promise<Advertisement[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('merchantId', merchantId),
          Query.orderDesc('$createdAt'),
        ]
      );

      return response.documents as Advertisement[];
    } catch (error) {
      console.error('Error getting merchant ads:', error);
      return [];
    }
  }

  /**
   * Track impression
   */
  async trackImpression(adId: string): Promise<void> {
    try {
      const ad = await databases.getDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId
      ) as Advertisement;

      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId,
        { impressions: ad.impressions + 1 }
      );
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  }

  /**
   * Track click
   */
  async trackClick(adId: string): Promise<void> {
    try {
      const ad = await databases.getDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId
      ) as Advertisement;

      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId,
        { clicks: ad.clicks + 1 }
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  /**
   * Calculate ad price
   */
  calculatePrice(adType: keyof typeof AD_PRICES, weeks: number): number {
    return AD_PRICES[adType] * weeks;
  }

  /**
   * Approve ad (Admin)
   */
  async approveAd(adId: string): Promise<void> {
    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId,
        { status: 'active' }
      );
    } catch (error) {
      console.error('Error approving ad:', error);
      throw error;
    }
  }

  /**
   * Reject ad (Admin)
   */
  async rejectAd(adId: string, reason: string): Promise<void> {
    try {
      await databases.updateDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId,
        { status: 'rejected' }
      );
    } catch (error) {
      console.error('Error rejecting ad:', error);
      throw error;
    }
  }

  /**
   * Get pending ads (Admin)
   */
  async getPendingAds(): Promise<Advertisement[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [Query.equal('status', 'pending')]
      );

      return response.documents as Advertisement[];
    } catch (error) {
      console.error('Error getting pending ads:', error);
      return [];
    }
  }

  /**
   * Check and expire ads
   */
  async checkExpiredAds(): Promise<void> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        [
          Query.equal('status', 'active'),
          Query.lessThan('endDate', new Date().toISOString()),
        ]
      );

      for (const ad of response.documents) {
        await databases.updateDocument(
          this.DATABASE_ID,
          this.COLLECTION_ID,
          ad.$id,
          { status: 'expired' }
        );
      }
    } catch (error) {
      console.error('Error checking expired ads:', error);
    }
  }

  /**
   * Get ad analytics
   */
  async getAdAnalytics(adId: string) {
    try {
      const ad = await databases.getDocument(
        this.DATABASE_ID,
        this.COLLECTION_ID,
        adId
      ) as Advertisement;

      const ctr = ad.impressions > 0 ? (ad.clicks / ad.impressions) * 100 : 0;
      const costPerClick = ad.clicks > 0 ? ad.price / ad.clicks : 0;

      return {
        impressions: ad.impressions,
        clicks: ad.clicks,
        ctr: ctr.toFixed(2),
        costPerClick: costPerClick.toFixed(2),
        totalSpent: ad.price,
        daysRemaining: Math.ceil(
          (new Date(ad.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        ),
      };
    } catch (error) {
      console.error('Error getting ad analytics:', error);
      return null;
    }
  }

  /**
   * Get revenue stats (Admin)
   */
  async getRevenueStats() {
    try {
      const [active, total] = await Promise.all([
        databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, [
          Query.equal('status', 'active'),
        ]),
        databases.listDocuments(this.DATABASE_ID, this.COLLECTION_ID, []),
      ]);

      const activeRevenue = active.documents.reduce(
        (sum, ad: any) => sum + (ad.price || 0),
        0
      );

      const totalRevenue = total.documents.reduce(
        (sum, ad: any) => sum + (ad.price || 0),
        0
      );

      return {
        activeAds: active.total,
        totalAds: total.total,
        activeRevenue,
        totalRevenue,
        averagePrice: total.total > 0 ? totalRevenue / total.total : 0,
      };
    } catch (error) {
      console.error('Error getting revenue stats:', error);
      return {
        activeAds: 0,
        totalAds: 0,
        activeRevenue: 0,
        totalRevenue: 0,
        averagePrice: 0,
      };
    }
  }
}

export const adsManager = new AdsManager();
export { AD_PRICES };
