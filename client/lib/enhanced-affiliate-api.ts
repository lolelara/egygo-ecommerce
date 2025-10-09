import { databases, account, appwriteConfig } from './appwrite';
import { Query, ID } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const AFFILIATES_COLLECTION = appwriteConfig.collections.affiliates;
const COMMISSIONS_COLLECTION = 'commissions';
const CLICKS_COLLECTION = 'affiliate_clicks';
const CONVERSIONS_COLLECTION = 'affiliate_conversions';

export interface AffiliateStats {
  // Financial Stats
  totalEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  thisWeekEarnings: number;
  todayEarnings: number;
  pendingEarnings: number;
  availableBalance: number;
  lifetimeEarnings: number;
  
  // Performance Stats
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  averageOrderValue: number;
  averageCommission: number;
  
  // Tier & Ranking
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTierProgress: number;
  nextTierRequirement: number;
  rank: number;
  totalAffiliates: number;
  percentile: number;
  
  // Time-based Performance
  monthlyGrowth: number;
  weeklyGrowth: number;
  bestDay: string;
  bestMonth: string;
  
  // Product Performance
  topProducts: ProductPerformance[];
  topCategories: CategoryPerformance[];
  
  // Traffic Sources
  trafficSources: TrafficSource[];
  
  // Additional Info
  affiliateCode: string;
  joinedDate: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  earnings: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CategoryPerformance {
  category: string;
  earnings: number;
  conversions: number;
  percentage: number;
}

export interface TrafficSource {
  source: string;
  clicks: number;
  conversions: number;
  conversionRate: number;
  earnings: number;
}

export interface Commission {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export interface AffiliateLink {
  id: string;
  url: string;
  productId?: string;
  productName?: string;
  customAlias?: string;
  clicks: number;
  conversions: number;
  earnings: number;
  source?: string;
  campaign?: string;
  createdAt: string;
  qrCode?: string;
  shortUrl?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  method: 'bank' | 'vodafone_cash' | 'instapay' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  accountDetails: any;
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

class EnhancedAffiliateAPI {
  // Get comprehensive affiliate statistics
  async getStats(affiliateId: string): Promise<AffiliateStats> {
    try {
      // Get affiliate data
      const affiliate = await this.getAffiliateData(affiliateId);
      
      // Get commissions
      const commissions = await this.getCommissions(affiliateId);
      
      // Calculate stats
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      
      const stats: AffiliateStats = {
        // Financial calculations
        totalEarnings: commissions.reduce((sum, c) => c.status === 'paid' ? sum + c.amount : sum, 0),
        thisMonthEarnings: commissions
          .filter(c => {
            const date = new Date(c.createdAt);
            return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
          })
          .reduce((sum, c) => sum + c.amount, 0),
        lastMonthEarnings: commissions
          .filter(c => {
            const date = new Date(c.createdAt);
            const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
            const year = thisMonth === 0 ? thisYear - 1 : thisYear;
            return date.getMonth() === lastMonth && date.getFullYear() === year;
          })
          .reduce((sum, c) => sum + c.amount, 0),
        thisWeekEarnings: this.calculateWeeklyEarnings(commissions),
        todayEarnings: this.calculateTodayEarnings(commissions),
        pendingEarnings: commissions
          .filter(c => c.status === 'pending' || c.status === 'approved')
          .reduce((sum, c) => sum + c.amount, 0),
        availableBalance: commissions
          .filter(c => c.status === 'approved')
          .reduce((sum, c) => sum + c.amount, 0),
        lifetimeEarnings: commissions.reduce((sum, c) => sum + c.amount, 0),
        
        // Performance metrics (mock data for now)
        totalClicks: affiliate.totalClicks || 0,
        totalConversions: affiliate.totalConversions || 0,
        conversionRate: affiliate.totalClicks > 0 
          ? (affiliate.totalConversions / affiliate.totalClicks) * 100 
          : 0,
        averageOrderValue: affiliate.averageOrderValue || 0,
        averageCommission: commissions.length > 0 
          ? commissions.reduce((sum, c) => sum + c.amount, 0) / commissions.length 
          : 0,
        
        // Tier calculation
        tier: this.calculateTier(commissions),
        nextTierProgress: this.calculateTierProgress(commissions),
        nextTierRequirement: this.getNextTierRequirement(this.calculateTier(commissions)),
        rank: affiliate.rank || 0,
        totalAffiliates: affiliate.totalAffiliates || 0,
        percentile: affiliate.percentile || 0,
        
        // Growth metrics
        monthlyGrowth: this.calculateGrowth(commissions, 'month'),
        weeklyGrowth: this.calculateGrowth(commissions, 'week'),
        bestDay: affiliate.bestDay || '',
        bestMonth: affiliate.bestMonth || '',
        
        // Performance data
        topProducts: await this.getTopProducts(affiliateId),
        topCategories: await this.getTopCategories(affiliateId),
        trafficSources: await this.getTrafficSources(affiliateId),
        
        // Additional info
        affiliateCode: affiliate.code || `AFF${affiliateId.substring(0, 6).toUpperCase()}`,
        joinedDate: affiliate.joinedDate || new Date().toISOString(),
        lastActivity: affiliate.lastActivity || new Date().toISOString(),
        status: affiliate.status || 'active'
      };
      
      return stats;
    } catch (error) {
      console.error('Error fetching affiliate stats:', error);
      // Return mock data for testing
      return this.getMockStats();
    }
  }

  // Get affiliate commissions
  async getCommissions(affiliateId: string, limit = 100): Promise<Commission[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COMMISSIONS_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit)
        ]
      );
      
      return response.documents.map(doc => ({
        id: doc.$id,
        orderId: doc.orderId,
        productId: doc.productId,
        productName: doc.productName,
        amount: doc.amount,
        percentage: doc.percentage,
        status: doc.status,
        createdAt: doc.$createdAt,
        paidAt: doc.paidAt
      }));
    } catch (error) {
      console.error('Error fetching commissions:', error);
      return this.getMockCommissions();
    }
  }

  // Create affiliate link
  async createLink(affiliateId: string, data: {
    productId?: string;
    customAlias?: string;
    source?: string;
    campaign?: string;
  }): Promise<AffiliateLink> {
    const code = `AFF${affiliateId.substring(0, 6).toUpperCase()}`;
    const baseUrl = window.location.origin;
    
    let url = baseUrl;
    if (data.productId) {
      url += `/products/${data.productId}`;
    }
    url += `?ref=${code}`;
    
    if (data.source) {
      url += `&source=${data.source}`;
    }
    if (data.campaign) {
      url += `&campaign=${data.campaign}`;
    }
    
    const link: AffiliateLink = {
      id: ID.unique(),
      url,
      productId: data.productId,
      productName: '', // Will be fetched
      customAlias: data.customAlias,
      clicks: 0,
      conversions: 0,
      earnings: 0,
      source: data.source,
      campaign: data.campaign,
      createdAt: new Date().toISOString(),
      shortUrl: await this.createShortUrl(url),
      qrCode: await this.generateQRCode(url)
    };
    
    // Save to database (if collection exists)
    try {
      await databases.createDocument(
        DATABASE_ID,
        'affiliate_links',
        link.id,
        link
      );
    } catch (error) {
      console.log('Links collection not found, using local storage');
      this.saveToLocalStorage('affiliate_links', link);
    }
    
    return link;
  }

  // Request withdrawal
  async requestWithdrawal(affiliateId: string, data: {
    amount: number;
    method: WithdrawalRequest['method'];
    accountDetails: any;
  }): Promise<WithdrawalRequest> {
    const request: WithdrawalRequest = {
      id: ID.unique(),
      amount: data.amount,
      method: data.method,
      status: 'pending',
      accountDetails: data.accountDetails,
      requestedAt: new Date().toISOString()
    };
    
    try {
      await databases.createDocument(
        DATABASE_ID,
        'withdrawal_requests',
        request.id,
        { ...request, affiliateId }
      );
    } catch (error) {
      console.log('Withdrawal collection not found, using local storage');
      this.saveToLocalStorage('withdrawal_requests', request);
    }
    
    return request;
  }

  // Track click
  async trackClick(linkId: string, data: {
    ip?: string;
    userAgent?: string;
    referer?: string;
  }): Promise<void> {
    try {
      await databases.createDocument(
        DATABASE_ID,
        CLICKS_COLLECTION,
        ID.unique(),
        {
          linkId,
          ...data,
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.log('Click tracking failed');
    }
  }

  // Track conversion
  async trackConversion(affiliateId: string, data: {
    orderId: string;
    productId: string;
    amount: number;
    commission: number;
  }): Promise<void> {
    try {
      await databases.createDocument(
        DATABASE_ID,
        CONVERSIONS_COLLECTION,
        ID.unique(),
        {
          affiliateId,
          ...data,
          timestamp: new Date().toISOString()
        }
      );
    } catch (error) {
      console.log('Conversion tracking failed');
    }
  }

  // Helper methods
  private async getAffiliateData(affiliateId: string): Promise<any> {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        AFFILIATES_COLLECTION,
        affiliateId
      );
      return response;
    } catch (error) {
      return {};
    }
  }

  private calculateTier(commissions: Commission[]): AffiliateStats['tier'] {
    const total = commissions.reduce((sum, c) => sum + c.amount, 0);
    if (total >= 50000) return 'Platinum';
    if (total >= 20000) return 'Gold';
    if (total >= 5000) return 'Silver';
    return 'Bronze';
  }

  private calculateTierProgress(commissions: Commission[]): number {
    const total = commissions.reduce((sum, c) => sum + c.amount, 0);
    const tier = this.calculateTier(commissions);
    const requirement = this.getNextTierRequirement(tier);
    return Math.min((total / requirement) * 100, 100);
  }

  private getNextTierRequirement(currentTier: AffiliateStats['tier']): number {
    switch (currentTier) {
      case 'Bronze': return 5000;
      case 'Silver': return 20000;
      case 'Gold': return 50000;
      case 'Platinum': return 100000;
      default: return 5000;
    }
  }

  private calculateWeeklyEarnings(commissions: Commission[]): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return commissions
      .filter(c => new Date(c.createdAt) >= weekAgo)
      .reduce((sum, c) => sum + c.amount, 0);
  }

  private calculateTodayEarnings(commissions: Commission[]): number {
    const today = new Date().toDateString();
    
    return commissions
      .filter(c => new Date(c.createdAt).toDateString() === today)
      .reduce((sum, c) => sum + c.amount, 0);
  }

  private calculateGrowth(commissions: Commission[], period: 'week' | 'month'): number {
    const now = new Date();
    const current = period === 'week' 
      ? this.calculateWeeklyEarnings(commissions)
      : commissions.filter(c => {
          const date = new Date(c.createdAt);
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).reduce((sum, c) => sum + c.amount, 0);
    
    // Calculate previous period
    const previousDate = new Date();
    if (period === 'week') {
      previousDate.setDate(previousDate.getDate() - 14);
    } else {
      previousDate.setMonth(previousDate.getMonth() - 1);
    }
    
    const previous = commissions
      .filter(c => {
        const date = new Date(c.createdAt);
        if (period === 'week') {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= previousDate && date < weekAgo;
        } else {
          return date.getMonth() === previousDate.getMonth() && 
                 date.getFullYear() === previousDate.getFullYear();
        }
      })
      .reduce((sum, c) => sum + c.amount, 0);
    
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  private async getTopProducts(affiliateId: string): Promise<ProductPerformance[]> {
    // Mock data for now
    return [
      {
        productId: '1',
        productName: 'iPhone 15 Pro',
        clicks: 234,
        conversions: 18,
        conversionRate: 7.7,
        earnings: 4500,
        trend: 'up'
      },
      {
        productId: '2',
        productName: 'Samsung TV 65"',
        clicks: 189,
        conversions: 12,
        conversionRate: 6.3,
        earnings: 3200,
        trend: 'up'
      }
    ];
  }

  private async getTopCategories(affiliateId: string): Promise<CategoryPerformance[]> {
    return [
      { category: 'إلكترونيات', earnings: 8500, conversions: 45, percentage: 35 },
      { category: 'ملابس', earnings: 6200, conversions: 82, percentage: 25 },
      { category: 'منزل وحديقة', earnings: 4800, conversions: 36, percentage: 20 }
    ];
  }

  private async getTrafficSources(affiliateId: string): Promise<TrafficSource[]> {
    return [
      {
        source: 'Facebook',
        clicks: 1234,
        conversions: 67,
        conversionRate: 5.4,
        earnings: 3400
      },
      {
        source: 'Instagram',
        clicks: 987,
        conversions: 45,
        conversionRate: 4.6,
        earnings: 2300
      }
    ];
  }

  private async createShortUrl(url: string): Promise<string> {
    // Implement URL shortening service integration
    return url; // For now, return original URL
  }

  private async generateQRCode(url: string): Promise<string> {
    // Generate QR code using a library or service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  }

  private saveToLocalStorage(key: string, data: any): void {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
  }

  private getMockStats(): AffiliateStats {
    return {
      totalEarnings: 15420.50,
      thisMonthEarnings: 5100.00,
      lastMonthEarnings: 4200.00,
      thisWeekEarnings: 1200.00,
      todayEarnings: 250.00,
      pendingEarnings: 1200.00,
      availableBalance: 14220.50,
      lifetimeEarnings: 25420.50,
      totalClicks: 3415,
      totalConversions: 186,
      conversionRate: 5.45,
      averageOrderValue: 82.90,
      averageCommission: 82.90,
      tier: 'Gold',
      nextTierProgress: 75,
      nextTierRequirement: 50000,
      rank: 12,
      totalAffiliates: 450,
      percentile: 97.3,
      monthlyGrowth: 21.4,
      weeklyGrowth: 8.5,
      bestDay: 'الأحد',
      bestMonth: 'مايو',
      topProducts: [],
      topCategories: [],
      trafficSources: [],
      affiliateCode: 'AFF001',
      joinedDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active'
    };
  }

  private getMockCommissions(): Commission[] {
    return [
      {
        id: '1',
        orderId: 'ORD001',
        productId: 'PROD001',
        productName: 'iPhone 15 Pro',
        amount: 450,
        percentage: 15,
        status: 'paid',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        orderId: 'ORD002',
        productId: 'PROD002',
        productName: 'Samsung TV',
        amount: 320,
        percentage: 12,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

export const enhancedAffiliateApi = new EnhancedAffiliateAPI();
