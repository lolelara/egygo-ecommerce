/**
 * Affiliate Leaderboard Page
 * لوحة المتصدرين - عرض أفضل المسوقين
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Crown, 
  Medal,
  Award,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  Star,
  Timer
} from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";

interface LeaderboardEntry {
  rank: number;
  affiliateId: string;
  name: string;
  earnings: number;
  sales: number;
  clicks: number;
  conversionRate: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export default function AffiliateLeaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'alltime'>('month');
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<number>(0);

  useEffect(() => {
    loadLeaderboard();
  }, [period, user]);

  const loadLeaderboard = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load affiliate stats
      const statsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.affiliateStats,
        [
          Query.orderDesc('totalEarnings'),
          Query.limit(100)
        ]
      );

      // Process and rank
      const entries: LeaderboardEntry[] = statsResponse.documents.map((doc: any, index: number) => ({
        rank: index + 1,
        affiliateId: doc.affiliateId,
        name: doc.affiliateId === user.$id ? 'أنت' : `مسوق ${index + 1}`,
        earnings: doc.totalEarnings || 0,
        sales: doc.totalOrders || 0,
        clicks: doc.totalClicks || 0,
        conversionRate: doc.conversionRate || 0,
        avatar: getAvatarEmoji(index),
        isCurrentUser: doc.affiliateId === user.$id
      }));

      setLeaderboard(entries);

      // Find current user rank
      const userEntry = entries.find(e => e.isCurrentUser);
      if (userEntry) {
        setMyRank(userEntry.rank);
      }

    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarEmoji = (index: number) => {
    const emojis = ['👑', '🌟', '🎯', '⭐', '💎', '🔥', '⚡', '🚀', '💪', '🏆'];
    return emojis[index] || '💫';
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', icon: Crown, text: 'البطل' };
    if (rank === 2) return { color: 'bg-gradient-to-r from-gray-300 to-gray-500', icon: Medal, text: 'الوصيف' };
    if (rank === 3) return { color: 'bg-gradient-to-r from-orange-400 to-orange-600', icon: Medal, text: 'الثالث' };
    return { color: 'bg-gradient-to-r from-blue-400 to-blue-600', icon: Award, text: `#${rank}` };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            لوحة المتصدرين
          </h1>
          <p className="text-muted-foreground mt-1">
            تنافس مع أفضل المسوقين وكن في القمة
          </p>
        </div>
        {myRank > 0 && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-2">
            مركزك: #{myRank}
          </Badge>
        )}
      </div>

      {/* Period Filter */}
      <Tabs value={period} onValueChange={(v: any) => setPeriod(v)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">اليوم</TabsTrigger>
          <TabsTrigger value="week">هذا الأسبوع</TabsTrigger>
          <TabsTrigger value="month">هذا الشهر</TabsTrigger>
          <TabsTrigger value="alltime">كل الأوقات</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المسوقين</p>
                <p className="text-2xl font-bold">{leaderboard.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأرباح</p>
                <p className="text-2xl font-bold">
                  {leaderboard.reduce((sum, e) => sum + e.earnings, 0).toLocaleString()} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
                <p className="text-2xl font-bold">
                  {leaderboard.reduce((sum, e) => sum + e.sales, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">إجمالي النقرات</p>
                <p className="text-2xl font-bold">
                  {leaderboard.reduce((sum, e) => sum + e.clicks, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              المنصة الذهبية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Second Place */}
              {leaderboard[1] && (
                <div className="order-1 md:order-1">
                  <div className="text-center p-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-300">
                    <div className="text-6xl mb-3">{leaderboard[1].avatar}</div>
                    <Badge className="bg-gradient-to-r from-gray-300 to-gray-500 text-white mb-2">
                      #2
                    </Badge>
                    <h3 className="text-xl font-bold mb-1">{leaderboard[1].name}</h3>
                    <p className="text-2xl font-bold text-gray-600 mb-1">
                      {leaderboard[1].earnings.toLocaleString()} ج.م
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {leaderboard[1].sales} مبيعة
                    </p>
                  </div>
                </div>
              )}

              {/* First Place */}
              {leaderboard[0] && (
                <div className="order-2 md:order-2">
                  <div className="text-center p-8 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-2xl border-4 border-yellow-400 transform md:-translate-y-4">
                    <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-2 animate-bounce" />
                    <div className="text-7xl mb-3">{leaderboard[0].avatar}</div>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white mb-2 text-lg px-4 py-1">
                      👑 البطل
                    </Badge>
                    <h3 className="text-2xl font-bold mb-2">{leaderboard[0].name}</h3>
                    <p className="text-3xl font-bold text-yellow-700 mb-2">
                      {leaderboard[0].earnings.toLocaleString()} ج.م
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {leaderboard[0].sales} مبيعة
                    </p>
                  </div>
                </div>
              )}

              {/* Third Place */}
              {leaderboard[2] && (
                <div className="order-3 md:order-3">
                  <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 rounded-2xl border-2 border-orange-300">
                    <div className="text-6xl mb-3">{leaderboard[2].avatar}</div>
                    <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white mb-2">
                      #3
                    </Badge>
                    <h3 className="text-xl font-bold mb-1">{leaderboard[2].name}</h3>
                    <p className="text-2xl font-bold text-orange-600 mb-1">
                      {leaderboard[2].earnings.toLocaleString()} ج.م
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {leaderboard[2].sales} مبيعة
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>جميع المتسابقين</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">لا توجد بيانات متاحة</p>
              <p className="text-sm mt-2">كن أول المتصدرين!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry) => {
                const badge = getRankBadge(entry.rank);
                const Icon = badge.icon;

                return (
                  <div
                    key={entry.affiliateId}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                      entry.isCurrentUser
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank Badge */}
                      <Badge className={`${badge.color} text-white w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                        {entry.rank}
                      </Badge>

                      {/* Avatar */}
                      <div className="text-4xl">{entry.avatar}</div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-lg ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                            {entry.name}
                          </h3>
                          {entry.rank <= 3 && (
                            <Icon className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {entry.sales} مبيعة • {entry.clicks} نقرة • {entry.conversionRate.toFixed(1)}% معدل تحويل
                        </p>
                      </div>
                    </div>

                    {/* Earnings */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {entry.earnings.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">ج.م</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivation Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Target className="h-12 w-12 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">استمر في التميز!</h3>
              <p className="text-muted-foreground">
                كل مبيعة تقربك من القمة. شارك روابطك، قدم محتوى قيّم، وكن الأفضل! 🚀
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
