import { useState, useEffect } from 'react';
import { databases, appwriteConfig, functions } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
}

interface Referral {
  $id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  status: 'pending' | 'active' | 'completed';
  reward: number;
  level: number;
  $createdAt: string;
  completedAt?: string;
}

interface ReferralEarning {
  $id: string;
  referrerId: string;
  referredUserId: string;
  orderId?: string;
  amount: number;
  percentage: number;
  level: number;
  type: 'signup' | 'first_purchase' | 'commission';
  status: 'pending' | 'completed' | 'paid';
  $createdAt: string;
  paidAt?: string;
}

export function useReferralSystem() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<ReferralEarning[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    thisMonthReferrals: 0,
    thisMonthEarnings: 0,
  });
  const [affiliateCode, setAffiliateCode] = useState('');
  const [referralLink, setReferralLink] = useState('');

  /**
   * Load referral data
   */
  const loadReferralData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load referrals
      const referralsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.referrals,
        [
          Query.equal('referrerId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ]
      );

      const referralData = referralsResponse.documents as unknown as Referral[];
      setReferrals(referralData);

      // Load earnings
      const earningsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.referral_earnings || 'referral_earnings',
        [
          Query.equal('referrerId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ]
      );

      const earningsData = earningsResponse.documents as unknown as ReferralEarning[];
      setEarnings(earningsData);

      // Calculate stats
      calculateStats(referralData, earningsData);

      // Load affiliate code
      await loadAffiliateCode();
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load affiliate code
   */
  const loadAffiliateCode = async () => {
    if (!user) return;

    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.userPreferences,
        [Query.equal('userId', user.$id), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        const code = response.documents[0].affiliateCode;
        setAffiliateCode(code);
        setReferralLink(`${window.location.origin}/register?ref=${code}`);
      }
    } catch (error) {
      console.error('Error loading affiliate code:', error);
    }
  };

  /**
   * Calculate statistics
   */
  const calculateStats = (referralData: Referral[], earningsData: ReferralEarning[]) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: ReferralStats = {
      totalReferrals: referralData.length,
      activeReferrals: referralData.filter((r) => r.status === 'active').length,
      completedReferrals: referralData.filter((r) => r.status === 'completed').length,
      totalEarnings: earningsData
        .filter((e) => e.status === 'completed' || e.status === 'paid')
        .reduce((sum, e) => sum + e.amount, 0),
      pendingEarnings: earningsData
        .filter((e) => e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0),
      thisMonthReferrals: referralData.filter(
        (r) => new Date(r.$createdAt) >= thisMonth
      ).length,
      thisMonthEarnings: earningsData
        .filter(
          (e) =>
            (e.status === 'completed' || e.status === 'paid') &&
            new Date(e.$createdAt) >= thisMonth
        )
        .reduce((sum, e) => sum + e.amount, 0),
    };

    setStats(stats);
  };

  /**
   * Register new user with referral code
   */
  const registerWithReferral = async (
    userId: string,
    userName: string,
    userEmail: string,
    referralCode?: string
  ) => {
    try {
      // Call Appwrite Function
      const response = await functions.createExecution(
        'referral-handler',
        JSON.stringify({
          action: 'register',
          userId,
          userName,
          userEmail,
          referralCode,
        })
      );

      const result = JSON.parse(response.responseBody);
      return result;
    } catch (error) {
      console.error('Error registering with referral:', error);
      throw error;
    }
  };

  /**
   * Handle first purchase
   */
  const handleFirstPurchase = async (userId: string, orderId: string, orderAmount: number) => {
    try {
      const response = await functions.createExecution(
        'referral-handler',
        JSON.stringify({
          action: 'first_purchase',
          userId,
          orderId,
          orderAmount,
        })
      );

      const result = JSON.parse(response.responseBody);
      
      // Reload data
      await loadReferralData();
      
      return result;
    } catch (error) {
      console.error('Error handling first purchase:', error);
      throw error;
    }
  };

  /**
   * Handle purchase commission
   */
  const handlePurchaseCommission = async (
    userId: string,
    orderId: string,
    orderAmount: number
  ) => {
    try {
      const response = await functions.createExecution(
        'referral-handler',
        JSON.stringify({
          action: 'purchase',
          userId,
          orderId,
          orderAmount,
        })
      );

      const result = JSON.parse(response.responseBody);
      
      // Reload data
      await loadReferralData();
      
      return result;
    } catch (error) {
      console.error('Error handling purchase commission:', error);
      throw error;
    }
  };

  /**
   * Get referral by code
   */
  const getReferralByCode = async (code: string) => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.userPreferences,
        [Query.equal('affiliateCode', code), Query.limit(1)]
      );

      if (response.documents.length > 0) {
        return response.documents[0];
      }
      return null;
    } catch (error) {
      console.error('Error getting referral by code:', error);
      return null;
    }
  };

  /**
   * Get earnings by type
   */
  const getEarningsByType = (type: 'signup' | 'first_purchase' | 'commission') => {
    return earnings.filter((e) => e.type === type);
  };

  /**
   * Get earnings by level
   */
  const getEarningsByLevel = (level: number) => {
    return earnings.filter((e) => e.level === level);
  };

  /**
   * Get total earnings by month
   */
  const getEarningsByMonth = (year: number, month: number) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return earnings.filter((e) => {
      const date = new Date(e.$createdAt);
      return date >= startDate && date <= endDate;
    });
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      loadReferralData();
    }
  }, [user]);

  return {
    loading,
    referrals,
    earnings,
    stats,
    affiliateCode,
    referralLink,
    loadReferralData,
    registerWithReferral,
    handleFirstPurchase,
    handlePurchaseCommission,
    getReferralByCode,
    getEarningsByType,
    getEarningsByLevel,
    getEarningsByMonth,
  };
}
