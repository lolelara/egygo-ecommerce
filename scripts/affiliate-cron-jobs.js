/**
 * Affiliate Cron Jobs
 * مهام دورية لتحديث إحصائيات المسوقين
 * 
 * يمكن تشغيلها من:
 * 1. Appwrite Functions (Scheduled)
 * 2. Node.js Cron Job
 * 3. GitHub Actions
 */

import * as sdk from 'node-appwrite';

// Configuration
const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '68d8b9db00134c41e7c8',
  databaseId: '68de037e003bd03c4d45',
  apiKey: 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5',
};

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

/**
 * Reset Daily Stats
 * يتم تشغيله كل يوم في منتصف الليل
 */
async function resetDailyStats() {
  try {
    console.log('🔄 Resetting daily stats...');

    // Get all affiliate stats
    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_stats',
      [sdk.Query.limit(1000)]
    );

    let updated = 0;
    for (const doc of response.documents) {
      try {
        await databases.updateDocument(
          config.databaseId,
          'affiliate_stats',
          doc.$id,
          {
            todaySales: 0,
          }
        );
        updated++;
      } catch (error) {
        console.error(`Error updating ${doc.$id}:`, error.message);
      }
    }

    console.log(`✅ Daily stats reset complete: ${updated} affiliates updated`);
  } catch (error) {
    console.error('❌ Error resetting daily stats:', error);
  }
}

/**
 * Reset Weekly Stats
 * يتم تشغيله كل أسبوع (الأحد)
 */
async function resetWeeklyStats() {
  try {
    console.log('🔄 Resetting weekly stats...');

    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_stats',
      [sdk.Query.limit(1000)]
    );

    let updated = 0;
    for (const doc of response.documents) {
      try {
        await databases.updateDocument(
          config.databaseId,
          'affiliate_stats',
          doc.$id,
          {
            weekSales: 0,
          }
        );
        updated++;
      } catch (error) {
        console.error(`Error updating ${doc.$id}:`, error.message);
      }
    }

    console.log(`✅ Weekly stats reset complete: ${updated} affiliates updated`);
  } catch (error) {
    console.error('❌ Error resetting weekly stats:', error);
  }
}

/**
 * Reset Monthly Stats
 * يتم تشغيله كل شهر (أول يوم)
 */
async function resetMonthlyStats() {
  try {
    console.log('🔄 Resetting monthly stats...');

    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_stats',
      [sdk.Query.limit(1000)]
    );

    let updated = 0;
    for (const doc of response.documents) {
      try {
        await databases.updateDocument(
          config.databaseId,
          'affiliate_stats',
          doc.$id,
          {
            monthSales: 0,
          }
        );
        updated++;
      } catch (error) {
        console.error(`Error updating ${doc.$id}:`, error.message);
      }
    }

    console.log(`✅ Monthly stats reset complete: ${updated} affiliates updated`);
  } catch (error) {
    console.error('❌ Error resetting monthly stats:', error);
  }
}

/**
 * Update Leaderboard Rankings
 * يتم تشغيله كل ساعة
 */
async function updateLeaderboardRankings() {
  try {
    console.log('🏆 Updating leaderboard rankings...');

    // Get all leaderboard entries for current month
    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_leaderboard',
      [
        sdk.Query.equal('period', 'month'),
        sdk.Query.orderDesc('totalEarnings'),
        sdk.Query.limit(1000),
      ]
    );

    let updated = 0;
    for (let i = 0; i < response.documents.length; i++) {
      const doc = response.documents[i];
      const newRank = i + 1;

      // Only update if rank changed
      if (doc.rank !== newRank) {
        try {
          await databases.updateDocument(
            config.databaseId,
            'affiliate_leaderboard',
            doc.$id,
            {
              rank: newRank,
              updatedAt: new Date().toISOString(),
            }
          );
          updated++;
        } catch (error) {
          console.error(`Error updating rank for ${doc.$id}:`, error.message);
        }
      }
    }

    console.log(`✅ Leaderboard rankings updated: ${updated} changes`);
  } catch (error) {
    console.error('❌ Error updating leaderboard rankings:', error);
  }
}

/**
 * Send Challenge Reminders
 * يتم تشغيله كل 6 ساعات
 */
async function sendChallengeReminders() {
  try {
    console.log('📢 Checking for expiring challenges...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get challenges expiring in 24 hours
    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_challenges',
      [
        sdk.Query.equal('completed', false),
        sdk.Query.lessThan('expiresAt', in24Hours.toISOString()),
        sdk.Query.greaterThan('expiresAt', now.toISOString()),
        sdk.Query.limit(1000),
      ]
    );

    let remindersSent = 0;
    for (const challenge of response.documents) {
      // Skip if reminder already sent
      if (challenge.reminderSent) continue;

      try {
        // Create notification
        await databases.createDocument(
          config.databaseId,
          'notifications',
          sdk.ID.unique(),
          {
            userId: challenge.affiliateId,
            type: 'alert',
            title: '⏰ تذكير: تحدي ينتهي قريباً',
            message: `تحدي "${challenge.title}" ينتهي خلال 24 ساعة`,
            read: false,
            relatedId: challenge.$id,
          }
        );

        // Mark reminder as sent
        await databases.updateDocument(
          config.databaseId,
          'affiliate_challenges',
          challenge.$id,
          {
            reminderSent: true,
          }
        );

        remindersSent++;
      } catch (error) {
        console.error(`Error sending reminder for ${challenge.$id}:`, error.message);
      }
    }

    console.log(`✅ Challenge reminders sent: ${remindersSent} notifications`);
  } catch (error) {
    console.error('❌ Error sending challenge reminders:', error);
  }
}

/**
 * Clean Expired Challenges
 * يتم تشغيله كل يوم
 */
async function cleanExpiredChallenges() {
  try {
    console.log('🧹 Cleaning expired challenges...');

    const now = new Date().toISOString();

    // Get expired, uncompleted challenges
    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_challenges',
      [
        sdk.Query.equal('completed', false),
        sdk.Query.lessThan('expiresAt', now),
        sdk.Query.limit(1000),
      ]
    );

    let cleaned = 0;
    for (const challenge of response.documents) {
      try {
        // Mark as expired (or delete)
        await databases.updateDocument(
          config.databaseId,
          'affiliate_challenges',
          challenge.$id,
          {
            isActive: false,
            expiredAt: now,
          }
        );
        cleaned++;
      } catch (error) {
        console.error(`Error cleaning ${challenge.$id}:`, error.message);
      }
    }

    console.log(`✅ Expired challenges cleaned: ${cleaned} challenges`);
  } catch (error) {
    console.error('❌ Error cleaning expired challenges:', error);
  }
}

/**
 * Main Function
 */
async function runCronJobs() {
  const args = process.argv.slice(2);
  const job = args[0];

  console.log(`\n🚀 Starting Affiliate Cron Jobs - ${new Date().toISOString()}\n`);

  switch (job) {
    case 'daily':
      await resetDailyStats();
      await cleanExpiredChallenges();
      break;

    case 'weekly':
      await resetWeeklyStats();
      break;

    case 'monthly':
      await resetMonthlyStats();
      await updateLeaderboardRankings();
      break;

    case 'hourly':
      await updateLeaderboardRankings();
      break;

    case 'reminders':
      await sendChallengeReminders();
      break;

    case 'all':
      await resetDailyStats();
      await resetWeeklyStats();
      await resetMonthlyStats();
      await updateLeaderboardRankings();
      await sendChallengeReminders();
      await cleanExpiredChallenges();
      break;

    default:
      console.log('Usage: node affiliate-cron-jobs.js [daily|weekly|monthly|hourly|reminders|all]');
      console.log('\nAvailable jobs:');
      console.log('  daily     - Reset daily stats + clean expired challenges');
      console.log('  weekly    - Reset weekly stats');
      console.log('  monthly   - Reset monthly stats + update leaderboard');
      console.log('  hourly    - Update leaderboard rankings');
      console.log('  reminders - Send challenge reminders');
      console.log('  all       - Run all jobs');
      break;
  }

  console.log(`\n✅ Cron jobs completed - ${new Date().toISOString()}\n`);
}

// Run
runCronJobs().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
