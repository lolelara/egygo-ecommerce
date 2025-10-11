/**
 * Script to create Gamification collections for Affiliates
 * Run: pnpm tsx scripts/create-gamification-collections.ts
 */

import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createGamificationCollections() {
  console.log('🎮 بدء إنشاء Gamification Collections...\n');

  try {
    // 1. affiliate_badges
    console.log('🏆 إنشاء collection: affiliate_badges');
    try {
      const badgesCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_badges',
        'Affiliate Badges',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, badgesCollection.$id, 'affiliateId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, badgesCollection.$id, 'badgeType', 50, true);
      await databases.createIntegerAttribute(DATABASE_ID, badgesCollection.$id, 'level', true);
      await databases.createDatetimeAttribute(DATABASE_ID, badgesCollection.$id, 'earnedAt', true);
      
      console.log('✅ تم إنشاء affiliate_badges\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_badges موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 2. affiliate_challenges
    console.log('🎯 إنشاء collection: affiliate_challenges');
    try {
      const challengesCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_challenges',
        'Affiliate Challenges',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, challengesCollection.$id, 'name', 255, true);
      await databases.createStringAttribute(DATABASE_ID, challengesCollection.$id, 'description', 1000, true);
      await databases.createStringAttribute(DATABASE_ID, challengesCollection.$id, 'type', 50, true);
      await databases.createIntegerAttribute(DATABASE_ID, challengesCollection.$id, 'target', true);
      await databases.createFloatAttribute(DATABASE_ID, challengesCollection.$id, 'reward', true);
      await databases.createDatetimeAttribute(DATABASE_ID, challengesCollection.$id, 'startDate', true);
      await databases.createDatetimeAttribute(DATABASE_ID, challengesCollection.$id, 'endDate', true);
      await databases.createBooleanAttribute(DATABASE_ID, challengesCollection.$id, 'isActive', false, true);
      
      console.log('✅ تم إنشاء affiliate_challenges\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_challenges موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 3. affiliate_leaderboard
    console.log('🏅 إنشاء collection: affiliate_leaderboard');
    try {
      const leaderboardCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_leaderboard',
        'Affiliate Leaderboard',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, leaderboardCollection.$id, 'affiliateId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, leaderboardCollection.$id, 'period', 20, true);
      await databases.createIntegerAttribute(DATABASE_ID, leaderboardCollection.$id, 'rank', true);
      await databases.createFloatAttribute(DATABASE_ID, leaderboardCollection.$id, 'totalEarnings', true);
      await databases.createIntegerAttribute(DATABASE_ID, leaderboardCollection.$id, 'totalSales', true);
      await databases.createIntegerAttribute(DATABASE_ID, leaderboardCollection.$id, 'totalClicks', true);
      await databases.createDatetimeAttribute(DATABASE_ID, leaderboardCollection.$id, 'updatedAt', true);
      
      console.log('✅ تم إنشاء affiliate_leaderboard\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_leaderboard موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 4. affiliate_achievements
    console.log('⭐ إنشاء collection: affiliate_achievements');
    try {
      const achievementsCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_achievements',
        'Affiliate Achievements',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, achievementsCollection.$id, 'affiliateId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, achievementsCollection.$id, 'challengeId', 255, true);
      await databases.createIntegerAttribute(DATABASE_ID, achievementsCollection.$id, 'progress', true);
      await databases.createBooleanAttribute(DATABASE_ID, achievementsCollection.$id, 'completed', false, false);
      await databases.createDatetimeAttribute(DATABASE_ID, achievementsCollection.$id, 'completedAt', false);
      
      console.log('✅ تم إنشاء affiliate_achievements\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_achievements موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 تم إنشاء جميع Gamification Collections بنجاح!');
    console.log('\n📋 ملخص Collections:');
    console.log('   1. affiliate_badges - الشارات والمستويات');
    console.log('   2. affiliate_challenges - التحديات');
    console.log('   3. affiliate_leaderboard - لوحة المتصدرين');
    console.log('   4. affiliate_achievements - الإنجازات');
    
  } catch (error) {
    console.error('\n❌ خطأ في إنشاء Collections:', error);
    process.exit(1);
  }
}

createGamificationCollections()
  .then(() => {
    console.log('\n✅ تم الانتهاء بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل التنفيذ:', error);
    process.exit(1);
  });
