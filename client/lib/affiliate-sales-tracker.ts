/**
 * Affiliate Sales Tracker
 * ربط المبيعات الحقيقية مع نظام التحديات والإحصائيات
 */

import { databases, appwriteConfig, ID } from './appwrite';
import { Query } from 'appwrite';
import { logSaleActivity, updateAffiliateStats } from './affiliate-activity-logger';
import notificationService from './notification-service';

/**
 * Get Affiliate Stats
 */
async function getAffiliateStats(affiliateId: string): Promise<any> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      'affiliate_stats',
      [Query.equal('affiliateId', affiliateId)]
    );

    if (response.documents.length > 0) {
      return response.documents[0];
    }

    // Create new stats if not exists
    const newStats = await databases.createDocument(
      appwriteConfig.databaseId,
      'affiliate_stats',
      ID.unique(),
      {
        affiliateId,
        totalSales: 0,
        todaySales: 0,
        weekSales: 0,
        monthSales: 0,
        currentStreak: 0,
        level: 1,
        points: 0,
        totalEarnings: 0,
        lastSaleDate: '',
      }
    );

    return newStats;
  } catch (error) {
    console.error('Error getting affiliate stats:', error);
    return null;
  }
}

/**
 * Get Week Number
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Calculate Streak
 */
function calculateStreak(lastSaleDate: string, currentStreak: number): number {
  if (!lastSaleDate) return 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastSale = new Date(lastSaleDate);
  lastSale.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastSale.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day - keep streak
    return currentStreak;
  } else if (daysDiff === 1) {
    // Next day - increment streak
    return currentStreak + 1;
  } else {
    // Streak broken - reset to 1
    return 1;
  }
}

/**
 * Check Challenges Progress
 */
async function checkChallengesProgress(affiliateId: string, stats: any): Promise<void> {
  try {
    // Get active challenges for this affiliate
    const challengesResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      'affiliate_challenges',
      [
        Query.equal('affiliateId', affiliateId),
        Query.equal('completed', false),
      ]
    );

    for (const challenge of challengesResponse.documents) {
      const challengeData = challenge as any;
      let currentProgress = 0;

      // Calculate progress based on challenge type
      switch (challengeData.challengeId) {
        case 'daily_10_sales':
          currentProgress = stats.todaySales || 0;
          break;
        case 'weekly_50_sales':
          currentProgress = stats.weekSales || 0;
          break;
        case 'monthly_200_sales':
          currentProgress = stats.monthSales || 0;
          break;
        case 'weekly_streak':
          currentProgress = stats.currentStreak || 0;
          break;
        case 'special_first_sale':
          currentProgress = stats.totalSales > 0 ? 1 : 0;
          break;
        default:
          currentProgress = stats.totalSales || 0;
      }

      // Update challenge progress
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'affiliate_challenges',
        challengeData.$id,
        {
          current: currentProgress,
        }
      );

      // Check if challenge is completed
      if (currentProgress >= challengeData.target && !challengeData.completed) {
        // Mark as completed
        await databases.updateDocument(
          appwriteConfig.databaseId,
          'affiliate_challenges',
          challengeData.$id,
          {
            completed: true,
            completedAt: new Date().toISOString(),
          }
        );

        // Send notification
        await notificationService.createNotification({
          userId: affiliateId,
          type: 'affiliate',
          title: '🎉 تحدي مكتمل!',
          message: `أكملت تحدي "${challengeData.title}" - استلم ${challengeData.reward} ${challengeData.rewardType === 'cash' ? 'ج.م' : 'نقطة'}`,
          relatedId: challengeData.$id,
          metadata: {
            challengeId: challengeData.challengeId,
            reward: challengeData.reward,
            rewardType: challengeData.rewardType,
          },
        });

        console.log(`✅ Challenge completed: ${challengeData.title} for affiliate ${affiliateId}`);
      }
    }
  } catch (error) {
    console.error('Error checking challenges progress:', error);
  }
}

/**
 * Update Leaderboard
 */
async function updateLeaderboard(affiliateId: string, stats: any): Promise<void> {
  try {
    // Update monthly leaderboard
    const leaderboardResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      'affiliate_leaderboard',
      [
        Query.equal('affiliateId', affiliateId),
        Query.equal('period', 'month'),
      ]
    );

    const leaderboardData = {
      totalEarnings: stats.totalEarnings || 0,
      totalSales: stats.monthSales || 0,
      totalClicks: 0, // Can be added later
      updatedAt: new Date().toISOString(),
    };

    if (leaderboardResponse.documents.length > 0) {
      // Update existing
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'affiliate_leaderboard',
        leaderboardResponse.documents[0].$id,
        leaderboardData
      );
    } else {
      // Create new
      await databases.createDocument(
        appwriteConfig.databaseId,
        'affiliate_leaderboard',
        ID.unique(),
        {
          affiliateId,
          period: 'month',
          rank: 0, // Will be calculated by cron job
          ...leaderboardData,
        }
      );
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
}

/**
 * Track Affiliate Sale (Main Function)
 */
export async function trackAffiliateSale(
  affiliateId: string,
  orderId: string,
  productId: string,
  productName: string,
  orderAmount: number,
  commission: number
): Promise<void> {
  try {
    console.log(`📊 Tracking sale for affiliate ${affiliateId}`);

    // 1. Get current stats
    const stats = await getAffiliateStats(affiliateId);
    if (!stats) {
      console.error('Failed to get affiliate stats');
      return;
    }

    // 2. Calculate dates
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = getWeekNumber(new Date());
    const thisMonth = new Date().getMonth();

    const lastSaleDate = stats.lastSaleDate || '';
    const lastSaleWeek = lastSaleDate ? getWeekNumber(new Date(lastSaleDate)) : 0;
    const lastSaleMonth = lastSaleDate ? new Date(lastSaleDate).getMonth() : -1;

    // 3. Calculate new stats
    const todaySales = lastSaleDate === today ? (stats.todaySales || 0) + 1 : 1;
    const weekSales = lastSaleWeek === thisWeek ? (stats.weekSales || 0) + 1 : 1;
    const monthSales = lastSaleMonth === thisMonth ? (stats.monthSales || 0) + 1 : 1;
    const totalSales = (stats.totalSales || 0) + 1;
    const currentStreak = calculateStreak(lastSaleDate, stats.currentStreak || 0);
    const totalEarnings = (stats.totalEarnings || 0) + commission;

    // Calculate level and points
    const points = (stats.points || 0) + Math.floor(commission);
    const level = Math.floor(totalSales / 10) + 1; // Level up every 10 sales

    // 4. Update stats
    await databases.updateDocument(
      appwriteConfig.databaseId,
      'affiliate_stats',
      stats.$id,
      {
        todaySales,
        weekSales,
        monthSales,
        totalSales,
        currentStreak,
        level,
        points,
        totalEarnings,
        lastSaleDate: today,
      }
    );

    console.log(`✅ Stats updated: ${todaySales} today, ${weekSales} this week, ${monthSales} this month`);

    // 5. Log sale activity
    await logSaleActivity(affiliateId, orderId, productId, productName, orderAmount, commission);

    // 6. Check challenges progress
    const updatedStats = {
      ...stats,
      todaySales,
      weekSales,
      monthSales,
      totalSales,
      currentStreak,
      totalEarnings,
    };
    await checkChallengesProgress(affiliateId, updatedStats);

    // 7. Update leaderboard
    await updateLeaderboard(affiliateId, updatedStats);

    // 8. Send sale notification
    await notificationService.createNotification({
      userId: affiliateId,
      type: 'commission',
      title: '💰 عمولة جديدة!',
      message: `حصلت على ${commission} ج.م من بيع ${productName}`,
      relatedId: orderId,
      metadata: {
        productId,
        productName,
        commission,
        orderAmount,
      },
    });

    // 9. Check for streak milestones
    if (currentStreak === 7) {
      await notificationService.createNotification({
        userId: affiliateId,
        type: 'affiliate',
        title: '🔥 سلسلة 7 أيام!',
        message: 'رائع! حققت مبيعات لمدة 7 أيام متتالية',
        metadata: { streak: currentStreak },
      });
    }

    // 10. Check for level up
    if (level > (stats.level || 1)) {
      await notificationService.createNotification({
        userId: affiliateId,
        type: 'affiliate',
        title: '⭐ مستوى جديد!',
        message: `تهانينا! وصلت للمستوى ${level}`,
        metadata: { level },
      });
    }

    console.log(`✅ Sale tracked successfully for affiliate ${affiliateId}`);
  } catch (error) {
    console.error('Error tracking affiliate sale:', error);
  }
}

/**
 * Initialize Challenges for Affiliate
 */
export async function initializeAffiliateChallenge(affiliateId: string, challengeTemplate: any): Promise<void> {
  try {
    const now = new Date();
    let expiresAt = new Date();

    switch (challengeTemplate.type) {
      case 'daily':
        expiresAt.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        expiresAt.setDate(now.getDate() + (7 - now.getDay()));
        expiresAt.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'special':
        expiresAt.setFullYear(now.getFullYear() + 1);
        break;
    }

    await databases.createDocument(
      appwriteConfig.databaseId,
      'affiliate_challenges',
      ID.unique(),
      {
        affiliateId,
        challengeId: challengeTemplate.id,
        title: challengeTemplate.title,
        description: challengeTemplate.description,
        type: challengeTemplate.type,
        target: challengeTemplate.target,
        current: 0,
        reward: challengeTemplate.reward,
        rewardType: challengeTemplate.rewardType,
        completed: false,
        claimed: false,
        expiresAt: expiresAt.toISOString(),
      }
    );

    console.log(`✅ Challenge initialized: ${challengeTemplate.title} for affiliate ${affiliateId}`);
  } catch (error) {
    console.error('Error initializing challenge:', error);
  }
}

export default {
  trackAffiliateSale,
  initializeAffiliateChallenge,
};
