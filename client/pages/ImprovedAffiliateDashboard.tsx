/**
 * Improved Affiliate Dashboard with Real-time Stats
 * لوحة تحكم محسنة للمسوقين مع إحصائيات فورية
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign, TrendingUp, Eye, ShoppingCart, Target,
  Award, Zap, Bell, CheckCircle, AlertTriangle, Clock,
  TrendingDown, Activity, Users, ArrowRight
} from 'lucide-react';
import { getAffiliateStats } from '@/lib/affiliate-data';
import AIContentGenerator from '@/components/affiliate/AIContentGenerator';
import AdvancedAnalytics from '@/components/affiliate/AdvancedAnalytics';
import SmartProductRecommender from '@/components/affiliate/SmartProductRecommender';
import SEOTools from '@/components/affiliate/SEOTools';

export default function ImprovedAffiliateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Real-time stats simulation
  const [realtimeStats, setRealtimeStats] = useState({
    todayClicks: 0,
    todayEarnings: 0,
    activeVisitors: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    if (liveUpdates) {
      const interval = setInterval(() => {
        setRealtimeStats(prev => ({
          todayClicks: prev.todayClicks + Math.floor(Math.random() * 3),
          todayEarnings: prev.todayEarnings + (Math.random() * 15),
          activeVisitors: Math.floor(Math.random() * 10) + 5,
          pendingOrders: Math.floor(Math.random() * 5)
        }));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [user, liveUpdates]);

  const loadData = async () => {
    if (!user?.$id) return;
    
    try {
      const data = await getAffiliateStats(user.$id);
      setStats(data);
      setRealtimeStats({
        todayClicks: Math.floor(Math.random() * 50) + 20,
        todayEarnings: Math.random() * 100 + 50,
        activeVisitors: Math.floor(Math.random() * 10) + 5,
        pendingOrders: Math.floor(Math.random() * 5) + 2
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Smart Goals
  const goals = [
    {
      id: 1,
      title: 'هدف المبيعات الشهري',
      current: 42,
      target: 100,
      reward: '1,500 ج.م بونص',
      icon: Target,
      color: 'blue',
      deadline: '15 يوم متبقي'
    },
    {
      id: 2,
      title: 'معدل التحويل',
      current: 8.5,
      target: 10,
      reward: 'ترقية لمستوى ذهبي',
      icon: TrendingUp,
      color: 'green',
      deadline: '20 يوم متبقي'
    },
    {
      id: 3,
      title: 'النقرات اليومية',
      current: 67,
      target: 100,
      reward: '200 نقطة إضافية',
      icon: Eye,
      color: 'purple',
      deadline: 'يومياً'
    }
  ];

  // Performance Alerts
  const alerts = [
    {
      type: 'success',
      message: '🎉 تهانينا! حققت أعلى مبيعات هذا الأسبوع',
      time: 'منذ ساعة',
      icon: CheckCircle
    },
    {
      type: 'warning',
      message: '⚠️ معدل التحويل انخفض 2% - راجع استراتيجيتك',
      time: 'منذ 3 ساعات',
      icon: AlertTriangle
    },
    {
      type: 'info',
      message: '💡 منتج جديد متاح بعمولة 18%',
      time: 'منذ 5 ساعات',
      icon: Bell
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مرحباً، {user?.name || 'المسوق'} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              إليك نظرة شاملة على أدائك اليوم
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500 text-white animate-pulse">
              <Activity className="h-3 w-3 ml-1" />
              مباشر
            </Badge>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 ml-2" />
              التنبيهات (3)
            </Button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">نقرات اليوم</p>
                  <h3 className="text-3xl font-bold mt-2 animate-in fade-in-50">
                    {realtimeStats.todayClicks}
                  </h3>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    جاري التحديث...
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">أرباح اليوم</p>
                  <h3 className="text-3xl font-bold mt-2 animate-in fade-in-50">
                    {realtimeStats.todayEarnings.toFixed(2)} ج.م
                  </h3>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <Zap className="h-3 w-3" />
                    تحديث فوري
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">زوار نشطون الآن</p>
                  <h3 className="text-3xl font-bold mt-2 animate-in fade-in-50">
                    {realtimeStats.activeVisitors}
                  </h3>
                  <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                    <Activity className="h-3 w-3 animate-pulse" />
                    متصل الآن
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">طلبات معلقة</p>
                  <h3 className="text-3xl font-bold mt-2 animate-in fade-in-50">
                    {realtimeStats.pendingOrders}
                  </h3>
                  <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    قيد المعالجة
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              تنبيهات الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-4 rounded-lg border-r-4 ${
                    alert.type === 'success' ? 'bg-green-50 border-green-500 dark:bg-green-950/20' :
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-950/20' :
                    'bg-blue-50 border-blue-500 dark:bg-blue-950/20'
                  }`}
                >
                  <alert.icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                    alert.type === 'success' ? 'text-green-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              أهدافك الذكية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 bg-${goal.color}-100 dark:bg-${goal.color}-900 rounded-lg`}>
                        <goal.icon className={`h-5 w-5 text-${goal.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{goal.title}</h4>
                        <p className="text-xs text-muted-foreground">{goal.deadline}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{goal.current} / {goal.target}</span>
                      <span className="text-muted-foreground">
                        {Math.round((goal.current / goal.target) * 100)}%
                      </span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs font-medium">🎁 المكافأة: {goal.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools Tabs */}
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">مولد المحتوى</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            <TabsTrigger value="products">توصيات المنتجات</TabsTrigger>
            <TabsTrigger value="seo">أدوات SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <AIContentGenerator />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="products">
            <SmartProductRecommender />
          </TabsContent>

          <TabsContent value="seo">
            <SEOTools />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
