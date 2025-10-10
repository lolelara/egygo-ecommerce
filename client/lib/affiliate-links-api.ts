/**
 * Affiliate Links API - Real Data from Appwrite
 */

import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const LINKS_COLLECTION = 'affiliate_links'; // Assuming this exists
const CLICKS_COLLECTION = 'affiliate_clicks';
const CONVERSIONS_COLLECTION = 'affiliate_conversions';

export interface AffiliateLink {
  $id: string;
  affiliateId: string;
  linkCode: string;
  productId?: string;
  url: string;
  clicks: number;
  conversions: number;
  earnings: number;
  createdAt: string;
}

export interface LinkClick {
  $id: string;
  affiliateId: string;
  linkId: string;
  productId?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  clickedAt: string;
}

export interface LinkConversion {
  $id: string;
  affiliateId: string;
  linkId: string;
  orderId: string;
  productId: string;
  amount: number;
  commission: number;
  status: string;
  convertedAt: string;
}

class AffiliateLinksAPI {
  /**
   * Get all links for an affiliate
   */
  async getAffiliateLinks(affiliateId: string): Promise<AffiliateLink[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LINKS_COLLECTION,
        [Query.equal('affiliateId', affiliateId), Query.orderDesc('$createdAt')]
      );
      return response.documents as unknown as AffiliateLink[];
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      return [];
    }
  }

  /**
   * Create a new affiliate link
   */
  async createLink(
    affiliateId: string,
    linkCode: string,
    url: string,
    productId?: string
  ): Promise<AffiliateLink | null> {
    try {
      const link = await databases.createDocument(
        DATABASE_ID,
        LINKS_COLLECTION,
        ID.unique(),
        {
          affiliateId,
          linkCode,
          url,
          productId: productId || null,
          clicks: 0,
          conversions: 0,
          earnings: 0,
          createdAt: new Date().toISOString()
        }
      );
      return link as unknown as AffiliateLink;
    } catch (error) {
      console.error('Error creating affiliate link:', error);
      return null;
    }
  }

  /**
   * Track a click on an affiliate link
   */
  async trackClick(
    affiliateId: string,
    linkId: string,
    productId?: string,
    ipAddress?: string,
    userAgent?: string,
    referrer?: string
  ): Promise<void> {
    try {
      // Create click record
      await databases.createDocument(
        DATABASE_ID,
        CLICKS_COLLECTION,
        ID.unique(),
        {
          affiliateId,
          linkId,
          productId: productId || null,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          referrer: referrer || null,
          clickedAt: new Date().toISOString()
        }
      );

      // Update link clicks count
      const link = await databases.getDocument(DATABASE_ID, LINKS_COLLECTION, linkId);
      await databases.updateDocument(
        DATABASE_ID,
        LINKS_COLLECTION,
        linkId,
        {
          clicks: (link.clicks || 0) + 1
        }
      );
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  }

  /**
   * Get link statistics
   */
  async getLinkStats(linkId: string): Promise<{
    clicks: number;
    conversions: number;
    earnings: number;
    conversionRate: number;
  }> {
    try {
      const link = await databases.getDocument(DATABASE_ID, LINKS_COLLECTION, linkId);
      
      const clicks = link.clicks || 0;
      const conversions = link.conversions || 0;
      const earnings = link.earnings || 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      return {
        clicks,
        conversions,
        earnings,
        conversionRate
      };
    } catch (error) {
      console.error('Error fetching link stats:', error);
      return { clicks: 0, conversions: 0, earnings: 0, conversionRate: 0 };
    }
  }

  /**
   * Delete an affiliate link
   */
  async deleteLink(linkId: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, LINKS_COLLECTION, linkId);
      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      return false;
    }
  }

  /**
   * Get clicks for a specific link
   */
  async getLinkClicks(linkId: string, limit: number = 100): Promise<LinkClick[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CLICKS_COLLECTION,
        [
          Query.equal('linkId', linkId),
          Query.orderDesc('clickedAt'),
          Query.limit(limit)
        ]
      );
      return response.documents as unknown as LinkClick[];
    } catch (error) {
      console.error('Error fetching link clicks:', error);
      return [];
    }
  }

  /**
   * Get total clicks for an affiliate
   */
  async getTotalClicks(affiliateId: string): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CLICKS_COLLECTION,
        [Query.equal('affiliateId', affiliateId), Query.limit(1)]
      );
      return response.total;
    } catch (error) {
      console.error('Error fetching total clicks:', error);
      return 0;
    }
  }

  /**
   * Get conversions for an affiliate
   */
  async getConversions(affiliateId: string): Promise<LinkConversion[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CONVERSIONS_COLLECTION,
        [Query.equal('affiliateId', affiliateId), Query.orderDesc('convertedAt')]
      );
      return response.documents as unknown as LinkConversion[];
    } catch (error) {
      console.error('Error fetching conversions:', error);
      return [];
    }
  }
}

export const affiliateLinksAPI = new AffiliateLinksAPI();
