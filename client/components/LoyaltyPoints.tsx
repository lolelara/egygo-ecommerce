import { useState, useEffect } from 'react';
import { Award, Gift, TrendingUp, Star, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

interface LoyaltyData {
  points: number;
  level: string;
  nextLevelPoints: number;
  totalEarned: number;
  totalRedeemed: number;
}

const LEVELS = [
  { name: 'برونزي', minPoints: 0, maxPoints: 499, color: 'text-orange-600', icon: '🥉' },
  { name: 'فضي', minPoints: 500, maxPoints: 999, color: 'text-gray-400', icon: '🥈' },
  { name: 'ذهبي', minPoints: 1000, maxPoints: 2499, color: 'text-yellow-500', icon: '🥇' },
  { name: 'بلاتيني', minPoints: 2500, maxPoints: 4999, color: 'text-blue-500', icon: '💎' },
  { name: 'ماسي', minPoints: 5000, maxPoints: Infinity, color: 'text-purple-600', icon: '👑' }
];

export default function LoyaltyPoints() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
      loadHistory();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    if (!user) return;

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'loyalty_points',
        [Query.equal('userId', user.$id)]
      );

      if (response.documents.length > 0) {
        const data = response.documents[0];
        const currentLevel = getCurrentLevel(data.points);
        const nextLevel = getNextLevel(data.points);

        setLoyaltyData({
          points: data.points,
          level: currentLevel.name,
          nextLevelPoints: nextLevel.minPoints,
          totalEarned: data.totalEarned || 0,
          totalRedeemed: data.totalRedeemed || 0
        });
      } else {
        // Initialize with 0 points
        setLoyaltyData({
          points: 0,
          level: 'برونزي',
          nextLevelPoints: 500,
          totalEarned: 0,
          totalRedeemed: 0
        });
      }
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (!user) return;

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'loyalty_history',
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(10)
        ]
      );
      setHistory(response.documents);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const getCurrentLevel = (points: number) => {
    return LEVELS.find(level => points >= level.minPoints && points <= level.maxPoints) || LEVELS[0];
  };

  const getNextLevel = (points: number) => {
    const currentIndex = LEVELS.findIndex(level => points >= level.minPoints && points <= level.maxPoints);
    return LEVELS[currentIndex + 1] || LEVELS[LEVELS.length - 1];
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!loyaltyData) return null;

  const currentLevel = getCurrentLevel(loyaltyData.points);
  const progress = ((loyaltyData.points - currentLevel.minPoints) / (loyaltyData.nextLevelPoints - currentLevel.minPoints)) * 100;

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">نقاطك الحالية</p>
              <p className="text-4xl font-bold">{loyaltyData.points}</p>
            </div>
            <div className="text-6xl">{currentLevel.icon}</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>المستوى: {loyaltyData.level}</span>
              <span>{loyaltyData.nextLevelPoints - loyaltyData.points} نقطة للمستوى التالي</span>
            </div>
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loyaltyData.totalEarned}</p>
                <p className="text-sm text-muted-foreground">إجمالي النقاط المكتسبة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Gift className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loyaltyData.totalRedeemed}</p>
                <p className="text-sm text-muted-foreground">النقاط المستخدمة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Earn */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            كيف تكسب النقاط؟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>كل 10 جنيه من المشتريات</span>
              <Badge>+1 نقطة</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>تقييم المنتج</span>
              <Badge>+5 نقاط</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>دعوة صديق</span>
              <Badge>+50 نقطة</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>عيد ميلادك</span>
              <Badge>+100 نقطة</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>النشاط الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.$id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.$createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <Badge variant={item.type === 'earned' ? 'default' : 'secondary'}>
                    {item.type === 'earned' ? '+' : '-'}{item.points}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Redeem Button */}
      <Button className="w-full" size="lg">
        <Gift className="h-5 w-5 ml-2" />
        استبدل نقاطك
      </Button>
    </div>
  );
}
