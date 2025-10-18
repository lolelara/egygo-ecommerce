import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Eye, ShoppingCart, Link2, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useState, useEffect } from "react";
import { getAffiliateActivities } from "@/lib/affiliate-data";
import { useAuth } from "@/contexts/AppwriteAuthContext";

interface Activity {
  id: string;
  type: 'sale' | 'click' | 'link_created' | 'earning';
  title: string;
  description?: string;
  amount?: number;
  time: Date;
  productName?: string;
  link?: string;
}

interface RecentActivityTimelineProps {
  activities?: Activity[];
}

export default function RecentActivityTimeline({ activities: propActivities }: RecentActivityTimelineProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(propActivities || []);
  const [loading, setLoading] = useState(!propActivities);

  useEffect(() => {
    if (!propActivities && user?.$id) {
      loadActivities();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadActivities();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user, propActivities]);

  const loadActivities = async () => {
    if (!user?.$id) return;
    
    try {
      setLoading(true);
      const data = await getAffiliateActivities(user.$id, 10);
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for fallback
  const sampleActivities: Activity[] = [
    {
      id: '1',
      type: 'sale',
      title: 'مبيعة جديدة',
      description: 'تم شراء ساعة ذكية عبر رابطك',
      amount: 45.50,
      time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      productName: 'ساعة ذكية متطورة'
    },
    {
      id: '2',
      type: 'earning',
      title: 'عمولة مضافة',
      description: 'تم إضافة عمولة إلى رصيدك',
      amount: 45.50,
      time: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: '3',
      type: 'click',
      title: 'نقرات جديدة',
      description: '15 نقرة على رابط سماعات لاسلكية',
      time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      productName: 'سماعات لاسلكية Pro'
    },
    {
      id: '4',
      type: 'link_created',
      title: 'رابط جديد',
      description: 'تم إنشاء رابط لمنتج كاميرا احترافية',
      time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      productName: 'كاميرا احترافية 4K'
    },
    {
      id: '5',
      type: 'sale',
      title: 'مبيعة جديدة',
      description: 'تم شراء لابتوب ألعاب عبر رابطك',
      amount: 120.00,
      time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      productName: 'لابتوب ألعاب متطور'
    },
    {
      id: '6',
      type: 'click',
      title: 'نقرات جديدة',
      description: '8 نقرات على رابط تابلت رسم',
      time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      productName: 'تابلت رسم رقمي'
    }
  ];

  // Use loaded activities or fallback to sample
  const displayActivities = activities.length > 0 ? activities : (loading ? [] : sampleActivities);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return ShoppingCart;
      case 'click':
        return Eye;
      case 'link_created':
        return Link2;
      case 'earning':
        return DollarSign;
      default:
        return TrendingUp;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'click':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'link_created':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'earning':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    return type === 'sale' || type === 'earning' ? 'default' : 'secondary';
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          النشاطات الأخيرة
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          تتبع آخر تحديثات حسابك
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <div key={activity.id} className="flex gap-3 items-start group">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-0.5 h-12 bg-muted mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.description}
                        </p>
                      )}
                      {activity.productName && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <span className="font-semibold">المنتج:</span>
                          {activity.productName}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(activity.time, { addSuffix: true, locale: ar })}
                      </p>
                    </div>

                    {activity.amount && (
                      <Badge
                        variant={getBadgeVariant(activity.type)}
                        className="text-sm font-bold whitespace-nowrap"
                      >
                        +{activity.amount.toFixed(2)} ج.م
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {displayActivities.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد نشاطات حديثة</p>
              <p className="text-xs mt-1">ابدأ بإنشاء روابط ومشاركتها</p>
            </div>
          )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
