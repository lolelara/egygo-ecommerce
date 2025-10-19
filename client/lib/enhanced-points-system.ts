/**
 * Enhanced Points & Rewards System
 * Gamification with levels, achievements, and rewards
 */

import { databases } from './appwrite';
import { Query, ID } from 'appwrite';

export interface UserPoints {
  $id: string;
  userId: string;
  userName: string;
  totalPoints: number;
  availablePoints: number;
  level: number;
  nextLevelPoints: number;
  streak: number;
  lastActivityDate: string;
  achievements: string[];
  redeemedRewards: string[];
}

export interface PointsTransaction {
  $id: string;
  userId: string;
  type: 'earn' | 'redeem';
  action: string;
  points: number;
  description: string;
  metadata?: any;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirement: number;
  category: 'orders' | 'reviews' | 'referrals' | 'social' | 'special';
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'free_shipping' | 'cashback' | 'gift';
  value: number;
  stock: number;
  image?: string;
}

// Points earning rules
const POINTS_RULES = {
  order_placed: 10,
  order_completed: 50,
  review_written: 20,
  review_helpful: 5,
  referral_signup: 100,
  referral_purchase: 200,
  daily_login: 5,
  social_share: 10,
  profile_complete: 50,
  first_purchase: 100,
  milestone_10_orders: 500,
  milestone_50_orders: 2000,
};

// Level thresholds
const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2500, 4000, 6000, 10000
];

// Achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_order',
    name: 'أول طلب',
    description: 'أكمل أول طلب لك',
    icon: '🎉',
    points: 100,
    requirement: 1,
    category: 'orders',
  },
  {
    id: 'order_master',
    name: 'خبير الطلبات',
    description: 'أكمل 50 طلب',
    icon: '🏆',
    points: 2000,
    requirement: 50,
    category: 'orders',
  },
  {
    id: 'review_writer',
    name: 'كاتب التقييمات',
    description: 'اكتب 10 تقييمات',
    icon: '✍️',
    points: 200,
    requirement: 10,
    category: 'reviews',
  },
  {
    id: 'social_butterfly',
    name: 'نشيط اجتماعياً',
    description: 'شارك 20 منتج',
    icon: '🦋',
    points: 150,
    requirement: 20,
    category: 'social',
  },
  {
    id: 'referral_king',
    name: 'ملك الإحالات',
    description: 'أحضر 10 أصدقاء',
    icon: '👑',
    points: 1000,
    requirement: 10,
    category: 'referrals',
  },
  {
    id: 'streak_7',
    name: 'أسبوع متواصل',
    description: 'سجل دخول لمدة 7 أيام متتالية',
    icon: '🔥',
    points: 100,
    requirement: 7,
    category: 'special',
  },
  {
    id: 'streak_30',
    name: 'شهر متواصل',
    description: 'سجل دخول لمدة 30 يوم متتالية',
    icon: '⭐',
    points: 500,
    requirement: 30,
    category: 'special',
  },
];

// Rewards catalog
const REWARDS_CATALOG: Reward[] = [
  {
    id: 'discount_50',
    name: 'خصم 50 جنيه',
    description: 'خصم فوري 50 جنيه على طلبك القادم',
    pointsCost: 500,
    type: 'discount',
    value: 50,
    stock: 1000,
  },
  {
    id: 'discount_100',
    name: 'خصم 100 جنيه',
    description: 'خصم فوري 100 جنيه على طلبك القادم',
    pointsCost: 900,
    type: 'discount',
    value: 100,
    stock: 500,
  },
  {
    id: 'free_shipping',
    name: 'شحن مجاني',
    description: 'شحن مجاني على طلبك القادم',
    pointsCost: 300,
    type: 'free_shipping',
    value: 0,
    stock: 2000,
  },
  {
    id: 'cashback_5',
    name: 'استرداد نقدي 5%',
    description: 'احصل على 5% استرداد نقدي',
    pointsCost: 1000,
    type: 'cashback',
    value: 5,
    stock: 100,
  },
];

class EnhancedPointsSystem {
  private readonly DATABASE_ID = '68de037e003bd03c4d45';
  private readonly POINTS_COLLECTION = 'user_points';
  private readonly TRANSACTIONS_COLLECTION = 'points_transactions';

  /**
   * Get or create user points
   */
  async getUserPoints(userId: string): Promise<UserPoints> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.POINTS_COLLECTION,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return await this.createUserPoints(userId);
      }

      return response.documents[0] as UserPoints;
    } catch (error) {
      console.error('Error getting user points:', error);
      throw error;
    }
  }

  /**
   * Create user points record
   */
  private async createUserPoints(userId: string): Promise<UserPoints> {
    const userPoints = {
      userId,
      userName: '',
      totalPoints: 0,
      availablePoints: 0,
      level: 1,
      nextLevelPoints: LEVEL_THRESHOLDS[1],
      streak: 0,
      lastActivityDate: new Date().toISOString(),
      achievements: [],
      redeemedRewards: [],
    };

    const created = await databases.createDocument(
      this.DATABASE_ID,
      this.POINTS_COLLECTION,
      ID.unique(),
      userPoints
    );

    return created as UserPoints;
  }

  /**
   * Award points to user
   */
  async awardPoints(
    userId: string,
    action: keyof typeof POINTS_RULES,
    description: string,
    metadata?: any
  ): Promise<void> {
    const points = POINTS_RULES[action];
    const userPoints = await this.getUserPoints(userId);

    const newTotal = userPoints.totalPoints + points;
    const newAvailable = userPoints.availablePoints + points;
    const newLevel = this.calculateLevel(newTotal);

    // Update user points
    await databases.updateDocument(
      this.DATABASE_ID,
      this.POINTS_COLLECTION,
      userPoints.$id,
      {
        totalPoints: newTotal,
        availablePoints: newAvailable,
        level: newLevel,
        nextLevelPoints: LEVEL_THRESHOLDS[newLevel] || newTotal,
      }
    );

    // Record transaction
    await databases.createDocument(
      this.DATABASE_ID,
      this.TRANSACTIONS_COLLECTION,
      ID.unique(),
      {
        userId,
        type: 'earn',
        action,
        points,
        description,
        metadata,
        createdAt: new Date().toISOString(),
      }
    );

    // Check for achievements
    await this.checkAchievements(userId);
  }

  /**
   * Redeem points for reward
   */
  async redeemReward(userId: string, rewardId: string): Promise<{ success: boolean; code?: string; error?: string }> {
    const reward = REWARDS_CATALOG.find(r => r.id === rewardId);
    if (!reward) {
      return { success: false, error: 'المكافأة غير موجودة' };
    }

    const userPoints = await this.getUserPoints(userId);

    if (userPoints.availablePoints < reward.pointsCost) {
      return { success: false, error: 'نقاط غير كافية' };
    }

    // Deduct points
    await databases.updateDocument(
      this.DATABASE_ID,
      this.POINTS_COLLECTION,
      userPoints.$id,
      {
        availablePoints: userPoints.availablePoints - reward.pointsCost,
        redeemedRewards: [...userPoints.redeemedRewards, rewardId],
      }
    );

    // Record transaction
    await databases.createDocument(
      this.DATABASE_ID,
      this.TRANSACTIONS_COLLECTION,
      ID.unique(),
      {
        userId,
        type: 'redeem',
        action: 'reward_redeemed',
        points: -reward.pointsCost,
        description: `استبدال: ${reward.name}`,
        metadata: { rewardId },
        createdAt: new Date().toISOString(),
      }
    );

    // Generate reward code
    const code = this.generateRewardCode(rewardId);

    return { success: true, code };
  }

  /**
   * Update daily streak
   */
  async updateStreak(userId: string): Promise<void> {
    const userPoints = await this.getUserPoints(userId);
    const lastActivity = new Date(userPoints.lastActivityDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = userPoints.streak;

    if (daysDiff === 1) {
      // Consecutive day
      newStreak++;
      await this.awardPoints(userId, 'daily_login', 'تسجيل دخول يومي');
    } else if (daysDiff > 1) {
      // Streak broken
      newStreak = 1;
    }

    await databases.updateDocument(
      this.DATABASE_ID,
      this.POINTS_COLLECTION,
      userPoints.$id,
      {
        streak: newStreak,
        lastActivityDate: today.toISOString(),
      }
    );
  }

  /**
   * Check and award achievements
   */
  private async checkAchievements(userId: string): Promise<void> {
    const userPoints = await this.getUserPoints(userId);
    
    // Get user stats
    const orders = await databases.listDocuments(
      this.DATABASE_ID,
      'orders',
      [Query.equal('userId', userId), Query.equal('status', 'delivered')]
    );

    const reviews = await databases.listDocuments(
      this.DATABASE_ID,
      'reviews',
      [Query.equal('userId', userId)]
    );

    // Check each achievement
    for (const achievement of ACHIEVEMENTS) {
      if (userPoints.achievements.includes(achievement.id)) continue;

      let earned = false;

      switch (achievement.category) {
        case 'orders':
          earned = orders.total >= achievement.requirement;
          break;
        case 'reviews':
          earned = reviews.total >= achievement.requirement;
          break;
        case 'special':
          if (achievement.id.startsWith('streak_')) {
            earned = userPoints.streak >= achievement.requirement;
          }
          break;
      }

      if (earned) {
        await databases.updateDocument(
          this.DATABASE_ID,
          this.POINTS_COLLECTION,
          userPoints.$id,
          {
            achievements: [...userPoints.achievements, achievement.id],
            totalPoints: userPoints.totalPoints + achievement.points,
            availablePoints: userPoints.availablePoints + achievement.points,
          }
        );
      }
    }
  }

  /**
   * Calculate level from total points
   */
  private calculateLevel(totalPoints: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (totalPoints >= LEVEL_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Generate reward code
   */
  private generateRewardCode(rewardId: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${rewardId.toUpperCase()}-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10): Promise<UserPoints[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.POINTS_COLLECTION,
        [
          Query.orderDesc('totalPoints'),
          Query.limit(limit),
        ]
      );

      return response.documents as UserPoints[];
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  /**
   * Get user transactions
   */
  async getUserTransactions(userId: string, limit: number = 50): Promise<PointsTransaction[]> {
    try {
      const response = await databases.listDocuments(
        this.DATABASE_ID,
        this.TRANSACTIONS_COLLECTION,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
        ]
      );

      return response.documents as PointsTransaction[];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }
}

export const enhancedPoints = new EnhancedPointsSystem();
export { ACHIEVEMENTS, REWARDS_CATALOG, POINTS_RULES };
