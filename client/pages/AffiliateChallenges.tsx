/**
 * Affiliate Challenges & Gamification System
 * نظام التحديات والمكافآت للمسوقين
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Target,
  Zap,
  Star,
  Award,
  TrendingUp,
  Gift,
  Clock,
  CheckCircle2,
  Flame,
  Crown,
  Medal,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

// Challenge types
interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  target: number;
  current: number;
  reward: number;
  rewardType: 'cash' | 'points' | 'badge';
  icon: any;
  color: string;
  expiresAt: string;
  completed: boolean;
  claimed: boolean;
}

// Predefined challenges
const challengeTemplates = [
  {
    id: 'daily_10_sales',
    title: 'بع 10 منتجات اليوم',
    description: 'حقق 10 مبيعات في يوم واحد',
    type: 'daily',
    target: 10,
    reward: 100,
    rewardType: 'cash',
    icon: Target,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'weekly_50_sales',
    title: 'بع 50 منتج هذا الأسبوع',
    description: 'حقق 50 مبيعة خلال الأسبوع',
    type: 'weekly',
    target: 50,
    reward: 500,
    rewardType: 'cash',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'monthly_200_sales',
    title: 'بع 200 منتج هذا الشهر',
    description: 'حقق 200 مبيعة خلال الشهر',
    type: 'monthly',
    target: 200,
    reward: 2000,
    rewardType: 'cash',
    icon: Trophy,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'daily_5_products',
    title: 'روّج لـ 5 منتجات مختلفة',
    description: 'شارك روابط 5 منتجات مختلفة اليوم',
    type: 'daily',
    target: 5,
    reward: 50,
    rewardType: 'cash',
    icon: Sparkles,
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'weekly_streak',
    title: 'سلسلة 7 أيام',
    description: 'حقق مبيعة واحدة على الأقل يومياً لمدة 7 أيام',
    type: 'weekly',
    target: 7,
    reward: 300,
    rewardType: 'cash',
    icon: Flame,
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'special_first_sale',
    title: 'أول عملية بيع',
    description: 'حقق أول عملية بيع لك',
    type: 'special',
    target: 1,
    reward: 50,
    rewardType: 'cash',
    icon: Star,
    color: 'from-yellow-500 to-amber-500',
  },
];

// Badges/Achievements
const badges = [
  { id: 'bronze', name: 'برونزي', icon: Medal, color: 'text-orange-600', requirement: 10 },
  { id: 'silver', name: 'فضي', icon: Medal, color: 'text-gray-400', requirement: 50 },
  { id: 'gold', name: 'ذهبي', icon: Medal, color: 'text-yellow-500', requirement: 100 },
  { id: 'platinum', name: 'بلاتيني', icon: Crown, color: 'text-blue-400', requirement: 200 },
  { id: 'diamond', name: 'ماسي', icon: Crown, color: 'text-purple-500', requirement: 500 },
];

export default function AffiliateChallenges() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userStats, setUserStats] = useState({
    totalSales: 0,
    todaySales: 0,
    weekSales: 0,
    monthSales: 0,
    currentStreak: 0,
    level: 1,
    points: 0,
    totalEarnings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userBadges, setUserBadges] = useState<string[]>([]);

  useEffect(() => {
    if (user?.$id) {
      loadChallenges();
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user?.$id) return;

    try {
      // Load affiliate stats
      const statsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'affiliate_stats',
        [Query.equal('affiliateId', user.$id)]
      );

      if (statsResponse.documents.length > 0) {
        const stats = statsResponse.documents[0] as any;
        setUserStats({
          totalSales: stats.totalSales || 0,
          todaySales: stats.todaySales || 0,
          weekSales: stats.weekSales || 0,
          monthSales: stats.monthSales || 0,
          currentStreak: stats.currentStreak || 0,
          level: stats.level || 1,
          points: stats.points || 0,
          totalEarnings: stats.totalEarnings || 0,
        });

        // Check badges
        const earnedBadges = badges
          .filter(badge => stats.totalSales >= badge.requirement)
          .map(badge => badge.id);
        setUserBadges(earnedBadges);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      setIsLoading(true);

      // Generate challenges based on templates and user stats
      const activeChallenges: Challenge[] = challengeTemplates.map(template => {
        const now = new Date();
        let expiresAt = new Date();

        switch (template.type) {
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

        // Calculate current progress based on user stats
        let current = 0;
        if (template.id === 'daily_10_sales') current = userStats.todaySales;
        if (template.id === 'weekly_50_sales') current = userStats.weekSales;
        if (template.id === 'monthly_200_sales') current = userStats.monthSales;
        if (template.id === 'weekly_streak') current = userStats.currentStreak;
        if (template.id === 'special_first_sale') current = userStats.totalSales > 0 ? 1 : 0;

        const completed = current >= template.target;

        return {
          ...template,
          current,
          expiresAt: expiresAt.toISOString(),
          completed,
          claimed: false, // TODO: Load from database
        } as Challenge;
      });

      setChallenges(activeChallenges);
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const claimReward = async (challenge: Challenge) => {
    if (!challenge.completed || challenge.claimed) return;

    try {
      // TODO: Save claim to database and update user balance
      toast({
        title: '🎉 تم استلام المكافأة!',
        description: `حصلت على ${challenge.reward} ${challenge.rewardType === 'cash' ? 'ج.م' : 'نقطة'}`,
      });

      // Update challenge state
      setChallenges(prev =>
        prev.map(c =>
          c.id === challenge.id ? { ...c, claimed: true } : c
        )
      );
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في استلام المكافأة',
        variant: 'destructive',
      });
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();

    if (diff <= 0) return 'انتهى';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} يوم`;
    }

    return `${hours}س ${minutes}د`;
  };

  const filterChallenges = (type: string) => {
    if (type === 'all') return challenges;
    return challenges.filter(c => c.type === type);
  };

  const currentBadge = badges.reverse().find(badge => userBadges.includes(badge.id)) || badges[0];
  const nextBadge = badges.find(badge => !userBadges.includes(badge.id));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            التحديات والمكافآت
          </h1>
          <p className="text-muted-foreground mt-1">
            أكمل التحديات واحصل على مكافآت رائعة
          </p>
        </div>
      </div>

      {/* User Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">المستوى</p>
                <p className="text-2xl font-bold">{userStats.level}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">النقاط</p>
                <p className="text-2xl font-bold">{userStats.points}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">السلسلة</p>
                <p className="text-2xl font-bold">{userStats.currentStreak} يوم</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">الشارة</p>
                <p className="text-lg font-bold">{currentBadge.name}</p>
              </div>
              <currentBadge.icon className={`h-8 w-8 ${currentBadge.color}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            تقدم الشارات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <currentBadge.icon className={`h-6 w-6 ${currentBadge.color}`} />
                <span className="font-semibold">{currentBadge.name}</span>
              </div>
              {nextBadge && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">التالي:</span>
                  <nextBadge.icon className={`h-5 w-5 ${nextBadge.color}`} />
                  <span className="text-sm">{nextBadge.name}</span>
                </div>
              )}
            </div>
            {nextBadge && (
              <>
                <Progress
                  value={(userStats.totalSales / nextBadge.requirement) * 100}
                  className="h-2"
                />
                <p className="text-sm text-muted-foreground text-center">
                  {userStats.totalSales} / {nextBadge.requirement} مبيعة
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Challenges */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">الكل</TabsTrigger>
          <TabsTrigger value="daily">يومي</TabsTrigger>
          <TabsTrigger value="weekly">أسبوعي</TabsTrigger>
          <TabsTrigger value="monthly">شهري</TabsTrigger>
          <TabsTrigger value="special">خاص</TabsTrigger>
        </TabsList>

        {['all', 'daily', 'weekly', 'monthly', 'special'].map(type => (
          <TabsContent key={type} value={type} className="space-y-4">
            {filterChallenges(type).map(challenge => {
              const Icon = challenge.icon;
              const progress = (challenge.current / challenge.target) * 100;

              return (
                <Card
                  key={challenge.id}
                  className={`relative overflow-hidden ${
                    challenge.completed ? 'border-green-500' : ''
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${challenge.color} opacity-5`}
                  />
                  <CardContent className="pt-6 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-lg bg-gradient-to-r ${challenge.color}`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {challenge.title}
                            {challenge.completed && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {challenge.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="gap-1">
                              <Gift className="h-3 w-3" />
                              {challenge.reward}{' '}
                              {challenge.rewardType === 'cash' ? 'ج.م' : 'نقطة'}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              <Clock className="h-3 w-3" />
                              {getTimeRemaining(challenge.expiresAt)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {challenge.completed && !challenge.claimed && (
                        <Button
                          onClick={() => claimReward(challenge)}
                          className="gap-2"
                        >
                          <Gift className="h-4 w-4" />
                          استلم المكافأة
                        </Button>
                      )}

                      {challenge.claimed && (
                        <Badge className="bg-green-500">تم الاستلام</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">التقدم</span>
                        <span className="font-semibold">
                          {challenge.current} / {challenge.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filterChallenges(type).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    لا توجد تحديات {type === 'all' ? '' : type === 'daily' ? 'يومية' : type === 'weekly' ? 'أسبوعية' : type === 'monthly' ? 'شهرية' : 'خاصة'} حالياً
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
