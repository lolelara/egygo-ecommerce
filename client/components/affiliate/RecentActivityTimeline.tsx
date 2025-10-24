import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Eye, ShoppingCart, Link2, TrendingUp, Sparkles, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
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

  // Use only real activities from database - no fake data
  const displayActivities = activities;

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

          {displayActivities.length === 0 && !loading && (
            <div className="text-center py-12 px-4">
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-8 border-2 border-dashed border-primary/30">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-10 w-10 text-primary" />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">
                  ابدأ رحلتك التسويقية الآن!
                </h3>
                
                <p className="text-sm text-muted-foreground mb-1">
                  لا توجد نشاطات بعد. لكن هذا يعني فرصة عظيمة!
                </p>
                
                <p className="text-xs text-muted-foreground mb-6">
                  أنشئ روابطك الأولى وابدأ بمشاركتها لرؤية نشاطاتك هنا
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button 
                    asChild 
                    className="gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <RouterLink to="/affiliate/product-links">
                      <Sparkles className="h-4 w-4" />
                      إنشاء رابط تسويقي
                    </RouterLink>
                  </Button>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="gap-2"
                  >
                    <RouterLink to="/affiliate/landing-pages">
                      <Share2 className="h-4 w-4" />
                      صفحات الهبوط
                    </RouterLink>
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>نصيحة:</strong> كلما شاركت روابطك أكثر، زادت فرصك في الربح!
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
