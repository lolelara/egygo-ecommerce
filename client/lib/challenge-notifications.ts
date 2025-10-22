/**
 * Challenge Notifications System
 * نظام إشعارات التحديات التلقائية
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';
import notificationService from './notification-service';

/**
 * Send Challenge Reminders
 * إرسال تذكيرات للتحديات التي توشك على الانتهاء
 */
export async function sendChallengeReminders(): Promise<void> {
  try {
    console.log('📢 Checking for expiring challenges...');

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get all active, uncompleted challenges expiring in 24 hours
    const challengesResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      'affiliate_challenges',
      [
        Query.equal('completed', false),
        Query.lessThan('expiresAt', in24Hours.toISOString()),
        Query.greaterThan('expiresAt', now.toISOString()),
      ]
    );

    console.log(`Found ${challengesResponse.documents.length} expiring challenges`);

    for (const challenge of challengesResponse.documents) {
      const challengeData = challenge as any;

      // Check if reminder already sent
      const reminderSent = challengeData.reminderSent || false;
      if (reminderSent) continue;

      // Calculate progress percentage
      const progress = challengeData.current || 0;
      const target = challengeData.target || 1;
      const progressPercent = Math.floor((progress / target) * 100);

      // Send reminder notification
      await notificationService.createNotification({
        userId: challengeData.affiliateId,
        type: 'alert',
        title: '⏰ تذكير: تحدي ينتهي قريباً',
        message: `تحدي "${challengeData.title}" ينتهي خلال 24 ساعة - التقدم: ${progressPercent}%`,
        relatedId: challengeData.$id,
        metadata: {
          challengeId: challengeData.challengeId,
          progress,
          target,
          progressPercent,
          expiresAt: challengeData.expiresAt,
        },
      });

      // Mark reminder as sent
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'affiliate_challenges',
        challengeData.$id,
        {
          reminderSent: true,
        }
      );

      console.log(`✅ Reminder sent for challenge: ${challengeData.title}`);
    }
  } catch (error) {
    console.error('Error sending challenge reminders:', error);
  }
}

/**
 * Send Streak Milestone Notifications
 * إرسال إشعارات عند الوصول لإنجازات السلسلة
 */
export async function checkStreakMilestones(affiliateId: string, currentStreak: number): Promise<void> {
  try {
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];

    if (milestones.includes(currentStreak)) {
      let title = '';
      let message = '';
      let emoji = '🔥';

      switch (currentStreak) {
        case 3:
          title = '🔥 سلسلة 3 أيام!';
          message = 'رائع! استمر في هذا الأداء';
          break;
        case 7:
          title = '🔥 سلسلة أسبوع كامل!';
          message = 'إنجاز رائع! 7 أيام متتالية من المبيعات';
          emoji = '⭐';
          break;
        case 14:
          title = '⭐ سلسلة أسبوعين!';
          message = 'مذهل! أنت في طريقك للقمة';
          emoji = '🌟';
          break;
        case 30:
          title = '🌟 سلسلة شهر كامل!';
          message = 'إنجاز استثنائي! 30 يوم متتالي';
          emoji = '💎';
          break;
        case 60:
          title = '💎 سلسلة شهرين!';
          message = 'أنت أسطورة! استمر في التميز';
          emoji = '👑';
          break;
        case 90:
          title = '👑 سلسلة 3 أشهر!';
          message = 'إنجاز نادر! أنت من النخبة';
          emoji = '🏆';
          break;
        case 180:
          title = '🏆 سلسلة 6 أشهر!';
          message = 'إنجاز خارق! أنت مثال يُحتذى به';
          emoji = '🎖️';
          break;
        case 365:
          title = '🎖️ سلسلة سنة كاملة!';
          message = 'إنجاز تاريخي! أنت أسطورة حقيقية';
          emoji = '🌠';
          break;
      }

      await notificationService.createNotification({
        userId: affiliateId,
        type: 'affiliate',
        title,
        message,
        metadata: {
          type: 'streak_milestone',
          streak: currentStreak,
          emoji,
        },
      });

      console.log(`✅ Streak milestone notification sent: ${currentStreak} days`);
    }
  } catch (error) {
    console.error('Error checking streak milestones:', error);
  }
}

/**
 * Send Daily Motivation
 * إرسال رسالة تحفيزية يومية
 */
export async function sendDailyMotivation(affiliateId: string): Promise<void> {
  try {
    const motivationalMessages = [
      'صباح النجاح! اليوم فرصة جديدة لتحقيق أهدافك 🌟',
      'كل مبيعة تقربك من أحلامك! ابدأ يومك بقوة 💪',
      'النجاح لا يأتي بالصدفة، بل بالعمل الجاد! 🚀',
      'أنت أقرب للنجاح مما تتخيل! استمر 🎯',
      'اليوم يمكن أن يكون أفضل يوم في مسيرتك! 🌈',
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    await notificationService.createNotification({
      userId: affiliateId,
      type: 'info',
      title: '💫 رسالة اليوم',
      message: randomMessage,
      metadata: {
        type: 'daily_motivation',
      },
    });

    console.log(`✅ Daily motivation sent to affiliate ${affiliateId}`);
  } catch (error) {
    console.error('Error sending daily motivation:', error);
  }
}

/**
 * Notify Challenge Completion
 * إشعار عند إكمال تحدي (يتم استدعاؤه من affiliate-sales-tracker)
 */
export async function notifyChallengeCompletion(
  affiliateId: string,
  challengeTitle: string,
  reward: number,
  rewardType: 'cash' | 'points'
): Promise<void> {
  try {
    await notificationService.createNotification({
      userId: affiliateId,
      type: 'affiliate',
      title: '🎉 تحدي مكتمل!',
      message: `أكملت تحدي "${challengeTitle}" - استلم ${reward} ${rewardType === 'cash' ? 'ج.م' : 'نقطة'}`,
      metadata: {
        type: 'challenge_completed',
        challengeTitle,
        reward,
        rewardType,
      },
    });

    console.log(`✅ Challenge completion notification sent: ${challengeTitle}`);
  } catch (error) {
    console.error('Error sending challenge completion notification:', error);
  }
}

/**
 * Notify Level Up
 * إشعار عند الارتقاء لمستوى جديد
 */
export async function notifyLevelUp(affiliateId: string, newLevel: number): Promise<void> {
  try {
    let badge = '';
    let message = '';

    if (newLevel === 5) {
      badge = '🥉';
      message = 'حصلت على شارة برونزية!';
    } else if (newLevel === 10) {
      badge = '🥈';
      message = 'حصلت على شارة فضية!';
    } else if (newLevel === 20) {
      badge = '🥇';
      message = 'حصلت على شارة ذهبية!';
    } else if (newLevel === 50) {
      badge = '💎';
      message = 'حصلت على شارة ماسية!';
    } else {
      message = `وصلت للمستوى ${newLevel}!`;
    }

    await notificationService.createNotification({
      userId: affiliateId,
      type: 'affiliate',
      title: `⭐ مستوى جديد! ${badge}`,
      message,
      metadata: {
        type: 'level_up',
        level: newLevel,
        badge,
      },
    });

    console.log(`✅ Level up notification sent: Level ${newLevel}`);
  } catch (error) {
    console.error('Error sending level up notification:', error);
  }
}

/**
 * Notify Leaderboard Position Change
 * إشعار عند تغيير المركز في لوحة المتصدرين
 */
export async function notifyLeaderboardChange(
  affiliateId: string,
  oldRank: number,
  newRank: number
): Promise<void> {
  try {
    if (newRank < oldRank) {
      // Moved up
      const rankDiff = oldRank - newRank;
      await notificationService.createNotification({
        userId: affiliateId,
        type: 'affiliate',
        title: '📈 تقدم في الترتيب!',
        message: `رائع! تقدمت ${rankDiff} ${rankDiff === 1 ? 'مركز' : 'مراكز'} - أنت الآن في المركز ${newRank}`,
        metadata: {
          type: 'leaderboard_up',
          oldRank,
          newRank,
          rankDiff,
        },
      });
    } else if (newRank > oldRank) {
      // Moved down
      const rankDiff = newRank - oldRank;
      await notificationService.createNotification({
        userId: affiliateId,
        type: 'info',
        title: '📊 تحديث الترتيب',
        message: `تراجعت ${rankDiff} ${rankDiff === 1 ? 'مركز' : 'مراكز'} - أنت الآن في المركز ${newRank}. استمر في العمل!`,
        metadata: {
          type: 'leaderboard_down',
          oldRank,
          newRank,
          rankDiff,
        },
      });
    }

    console.log(`✅ Leaderboard change notification sent: ${oldRank} → ${newRank}`);
  } catch (error) {
    console.error('Error sending leaderboard change notification:', error);
  }
}

export default {
  sendChallengeReminders,
  checkStreakMilestones,
  sendDailyMotivation,
  notifyChallengeCompletion,
  notifyLevelUp,
  notifyLeaderboardChange,
};
