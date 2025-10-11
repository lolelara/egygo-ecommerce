/**
 * Gamification API for Affiliates
 */

import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const BADGES_COLLECTION = 'affiliate_badges';
const CHALLENGES_COLLECTION = 'affiliate_challenges';
const LEADERBOARD_COLLECTION = 'affiliate_leaderboard';
const ACHIEVEMENTS_COLLECTION = 'affiliate_achievements';

export type BadgeType = 'rookie' | 'rising' | 'star' | 'legend' | 'master';
export type ChallengeType = 'sales' | 'clicks' | 'conversions' | 'earnings';
export type Period = 'week' | 'month' | 'year' | 'alltime';

export interface Badge {
  $id: string;
  affiliateId: string;
  badgeType: BadgeType;
  level: number;
  earnedAt: string;
}

export interface Challenge {
  $id: string;
  name: string;
  description: string;
  type: ChallengeType;
  target: number;
  reward: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface LeaderboardEntry {
  $id: string;
  affiliateId: string;
  period: Period;
  rank: number;
  totalEarnings: number;
  totalSales: number;
  totalClicks: number;
  updatedAt: string;
}

export interface Achievement {
  $id: string;
  affiliateId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
}

class GamificationAPI {
  /**
   * Get affiliate badges
   */
  async getBadges(affiliateId: string): Promise<Badge[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        BADGES_COLLECTION,
        [Query.equal('affiliateId', affiliateId), Query.orderDesc('earnedAt')]
      );
      return response.documents as unknown as Badge[];
    } catch (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
  }

  /**
   * Award badge to affiliate
   */
  async awardBadge(affiliateId: string, badgeType: BadgeType, level: number): Promise<Badge | null> {
    try {
      const badge = await databases.createDocument(
        DATABASE_ID,
        BADGES_COLLECTION,
        ID.unique(),
        {
          affiliateId,
          badgeType,
          level,
          earnedAt: new Date().toISOString()
        }
      );
      return badge as unknown as Badge;
    } catch (error) {
      console.error('Error awarding badge:', error);
      return null;
    }
  }

  /**
   * Get active challenges
   */
  async getActiveChallenges(): Promise<Challenge[]> {
    try {
      const now = new Date().toISOString();
      const response = await databases.listDocuments(
        DATABASE_ID,
        CHALLENGES_COLLECTION,
        [
          Query.equal('isActive', true),
          Query.lessThanEqual('startDate', now),
          Query.greaterThanEqual('endDate', now)
        ]
      );
      return response.documents as unknown as Challenge[];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  }

  /**
   * Get affiliate achievements
   */
  async getAchievements(affiliateId: string): Promise<Achievement[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        ACHIEVEMENTS_COLLECTION,
        [Query.equal('affiliateId', affiliateId)]
      );
      return response.documents as unknown as Achievement[];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }

  /**
   * Update achievement progress
   */
  async updateProgress(affiliateId: string, challengeId: string, progress: number): Promise<boolean> {
    try {
      // Check if achievement exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        ACHIEVEMENTS_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.equal('challengeId', challengeId)
        ]
      );

      if (existing.documents.length > 0) {
        // Update existing
        await databases.updateDocument(
          DATABASE_ID,
          ACHIEVEMENTS_COLLECTION,
          existing.documents[0].$id,
          { progress }
        );
      } else {
        // Create new
        await databases.createDocument(
          DATABASE_ID,
          ACHIEVEMENTS_COLLECTION,
          ID.unique(),
          {
            affiliateId,
            challengeId,
            progress,
            completed: false
          }
        );
      }
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  }

  /**
   * Complete achievement
   */
  async completeAchievement(affiliateId: string, challengeId: string): Promise<boolean> {
    try {
      const existing = await databases.listDocuments(
        DATABASE_ID,
        ACHIEVEMENTS_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.equal('challengeId', challengeId)
        ]
      );

      if (existing.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          ACHIEVEMENTS_COLLECTION,
          existing.documents[0].$id,
          {
            completed: true,
            completedAt: new Date().toISOString()
          }
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error completing achievement:', error);
      return false;
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(period: Period = 'month', limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LEADERBOARD_COLLECTION,
        [
          Query.equal('period', period),
          Query.orderAsc('rank'),
          Query.limit(limit)
        ]
      );
      return response.documents as unknown as LeaderboardEntry[];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }

  /**
   * Update leaderboard entry
   */
  async updateLeaderboard(
    affiliateId: string,
    period: Period,
    data: {
      rank: number;
      totalEarnings: number;
      totalSales: number;
      totalClicks: number;
    }
  ): Promise<boolean> {
    try {
      const existing = await databases.listDocuments(
        DATABASE_ID,
        LEADERBOARD_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.equal('period', period)
        ]
      );

      if (existing.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          LEADERBOARD_COLLECTION,
          existing.documents[0].$id,
          {
            ...data,
            updatedAt: new Date().toISOString()
          }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          LEADERBOARD_COLLECTION,
          ID.unique(),
          {
            affiliateId,
            period,
            ...data,
            updatedAt: new Date().toISOString()
          }
        );
      }
      return true;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      return false;
    }
  }

  /**
   * Get affiliate rank
   */
  async getAffiliateRank(affiliateId: string, period: Period = 'month'): Promise<number> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LEADERBOARD_COLLECTION,
        [
          Query.equal('affiliateId', affiliateId),
          Query.equal('period', period)
        ]
      );

      if (response.documents.length > 0) {
        return (response.documents[0] as any).rank;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching rank:', error);
      return 0;
    }
  }

  /**
   * Create challenge (Admin only)
   */
  async createChallenge(challenge: Omit<Challenge, '$id'>): Promise<Challenge | null> {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        CHALLENGES_COLLECTION,
        ID.unique(),
        challenge
      );
      return doc as unknown as Challenge;
    } catch (error) {
      console.error('Error creating challenge:', error);
      return null;
    }
  }
}

export const gamificationAPI = new GamificationAPI();
