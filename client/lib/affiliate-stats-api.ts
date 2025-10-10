/**
 * Affiliate Statistics API - Real Data from Appwrite
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const CONVERSIONS_COLLECTION = 'affiliate_conversions';
const CLICKS_COLLECTION = 'affiliate_clicks';
const WITHDRAWALS_COLLECTION = 'affiliate_withdrawals';

export interface AffiliateStatsData {
  totalEarnings: number;
  totalClicks: number;
  totalSales: number;
  conversionRate: number;
  pendingEarnings: number;
  availableBalance: number;
  thisMonthEarnings: number;
  thisMonthClicks: number;
  thisMonthSales: number;
}

export interface EarningsData {
  date: string;
  earnings: number;
  clicks: number;
  sales: number;
}

export interface ProductPerformance {
  name: string;
  sales: number;
  earnings: number;
}

class AffiliateStatsAPI {
  /**
   * Get comprehensive affiliate statistics
   */
  async getStats(affiliateId: string): Promise<AffiliateStatsData> {
    try {
      // Get all conversions
      const conversionsResponse = await databases.listDocuments(
        DATABASE_ID,
        CONVERSIONS_COLLECTION,
        [Query.equal('affiliateId', affiliateId)]
      );

      const conversions = conversionsResponse.documents;

      // Calculate total earnings
      const totalEarnings = conversions
        .filter((c: any) => c.status === 'paid' || c.status === 'approved')
        .reduce((sum: number, c: any) => sum + (c.commission || 0), 0);

      // Calculate pending earnings
      const pendingEarnings = conversions
        .filter((c: any) => c.status === 'pending')
        .reduce((sum: number, c: any) => sum + (c.commission || 0), 0);

      // Get total clicks
      const clicksResponse = await databases.listDocuments(
        DATABASE_ID,
        CLICKS_COLLECTION,
        [Query.equal('affiliateId', affiliateId), Query.limit(1)]
      );
      const totalClicks = clicksResponse.total;

      // Total sales
      const totalSales = conversions.length;

      // Conversion rate
      const conversionRate = totalClicks > 0 ? (totalSales / totalClicks) * 100 : 0;

      // This month data
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const thisMonthConversions = conversions.filter((c: any) => {
        const convertedAt = new Date(c.convertedAt);
        return convertedAt >= firstDayOfMonth;
      });

      const thisMonthEarnings = thisMonthConversions
        .filter((c: any) => c.status === 'paid' || c.status === 'approved')
        .reduce((sum: number, c: any) => sum + (c.commission || 0), 0);

      const thisMonthSales = thisMonthConversions.length;

      // This month clicks
      const thisMonthClicksResponse = await databases.listDocuments(
        DATABASE_ID,
        CLICKS_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.greaterThanEqual('clickedAt', firstDayOfMonth.toISOString()),
          Query.limit(1)
        ]
      );
      const thisMonthClicks = thisMonthClicksResponse.total;

      // Get withdrawals to calculate available balance
      const withdrawalsResponse = await databases.listDocuments(
        DATABASE_ID,
        WITHDRAWALS_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.equal('status', 'completed')
        ]
      );

      const totalWithdrawn = withdrawalsResponse.documents.reduce(
        (sum: number, w: any) => sum + (w.amount || 0),
        0
      );

      const availableBalance = totalEarnings - totalWithdrawn;

      return {
        totalEarnings,
        totalClicks,
        totalSales,
        conversionRate,
        pendingEarnings,
        availableBalance,
        thisMonthEarnings,
        thisMonthClicks,
        thisMonthSales
      };
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      return {
        totalEarnings: 0,
        totalClicks: 0,
        totalSales: 0,
        conversionRate: 0,
        pendingEarnings: 0,
        availableBalance: 0,
        thisMonthEarnings: 0,
        thisMonthClicks: 0,
        thisMonthSales: 0
      };
    }
  }

  /**
   * Get earnings data for charts (last 7 days)
   */
  async getEarningsData(affiliateId: string, days: number = 7): Promise<EarningsData[]> {
    try {
      const data: EarningsData[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        // Get conversions for this day
        const conversionsResponse = await databases.listDocuments(
          DATABASE_ID,
          CONVERSIONS_COLLECTION,
          [
            Query.equal('affiliateId', affiliateId),
            Query.greaterThanEqual('convertedAt', date.toISOString()),
            Query.lessThan('convertedAt', nextDate.toISOString())
          ]
        );

        const earnings = conversionsResponse.documents
          .filter((c: any) => c.status === 'paid' || c.status === 'approved')
          .reduce((sum: number, c: any) => sum + (c.commission || 0), 0);

        const sales = conversionsResponse.documents.length;

        // Get clicks for this day
        const clicksResponse = await databases.listDocuments(
          DATABASE_ID,
          CLICKS_COLLECTION,
          [
            Query.equal('affiliateId', affiliateId),
            Query.greaterThanEqual('clickedAt', date.toISOString()),
            Query.lessThan('clickedAt', nextDate.toISOString()),
            Query.limit(1)
          ]
        );

        const clicks = clicksResponse.total;

        data.push({
          date: dateStr,
          earnings,
          clicks,
          sales
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      return [];
    }
  }

  /**
   * Get product performance data
   */
  async getProductPerformance(affiliateId: string): Promise<ProductPerformance[]> {
    try {
      const conversionsResponse = await databases.listDocuments(
        DATABASE_ID,
        CONVERSIONS_COLLECTION,
        [Query.equal('affiliateId', affiliateId)]
      );

      // Group by product
      const productMap = new Map<string, { sales: number; earnings: number }>();

      conversionsResponse.documents.forEach((c: any) => {
        const productId = c.productId || 'unknown';
        const current = productMap.get(productId) || { sales: 0, earnings: 0 };
        
        productMap.set(productId, {
          sales: current.sales + 1,
          earnings: current.earnings + (c.commission || 0)
        });
      });

      // Convert to array and get product names
      const performance: ProductPerformance[] = [];
      for (const [productId, data] of productMap.entries()) {
        // TODO: Fetch product name from products collection
        performance.push({
          name: `منتج ${productId.substring(0, 8)}`,
          sales: data.sales,
          earnings: data.earnings
        });
      }

      // Sort by earnings
      return performance.sort((a, b) => b.earnings - a.earnings).slice(0, 5);
    } catch (error) {
      console.error('Error fetching product performance:', error);
      return [];
    }
  }
}

export const affiliateStatsAPI = new AffiliateStatsAPI();
