import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Award, Lightbulb, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MerchantPerformanceInsightsProps {
  stats?: {
    totalRevenue?: number;
    totalOrders?: number;
    totalProducts?: number;
    averageOrderValue?: number;
    conversionRate?: number;
    returnRate?: number;
  };
}

export default function MerchantPerformanceInsights({ stats }: MerchantPerformanceInsightsProps) {
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalProducts = stats?.totalProducts || 0;
  const averageOrderValue = stats?.averageOrderValue || 0;
  const conversionRate = stats?.conversionRate || 0;
  const returnRate = stats?.returnRate || 0;

  // Calculate performance level
  const getPerformanceLevel = () => {
    if (totalRevenue >= 50000) return { level: "ممتاز", color: "green", percentage: 90 };
    if (totalRevenue >= 20000) return { level: "جيد جداً", color: "blue", percentage: 70 };
    if (totalRevenue >= 10000) return { level: "جيد", color: "yellow", percentage: 50 };
    return { level: "يحتاج تحسين", color: "orange", percentage: 30 };
  };

  const performance = getPerformanceLevel();

  // Generate smart insights
  const insights = [];

  // Revenue insight
  if (totalRevenue >= 20000) {
    insights.push({
      icon: TrendingUp,
      color: "green",
      title: "أداء مبيعات ممتاز!",
      description: `إيراداتك ${totalRevenue.toLocaleString()} ج.م أعلى من ${performance.percentage}% من التجار`,
      type: "success"
    });
  } else if (totalRevenue < 5000) {
    insights.push({
      icon: AlertCircle,
      color: "orange",
      title: "فرصة للنمو",
      description: "جرب إضافة المزيد من المنتجات وتحسين الوصف والصور",
      type: "warning"
    });
  }

  // Orders insight
  if (totalOrders > 50) {
    insights.push({
      icon: Award,
      color: "blue",
      title: "نشاط رائع!",
      description: `حققت ${totalOrders} طلب - استمر في تقديم خدمة ممتازة`,
      type: "info"
    });
  }

  // Average order value insight
  if (averageOrderValue > 500) {
    insights.push({
      icon: TrendingUp,
      color: "purple",
      title: "متوسط طلب عالي",
      description: `متوسط قيمة الطلب ${averageOrderValue.toFixed(0)} ج.م - ممتاز!`,
      type: "success"
    });
  } else if (averageOrderValue < 200) {
    insights.push({
      icon: Lightbulb,
      color: "yellow",
      title: "نصيحة ذكية",
      description: "جرب عروض الشراء المجمع لزيادة متوسط قيمة الطلب",
      type: "tip"
    });
  }

  // Return rate insight
  if (returnRate > 10) {
    insights.push({
      icon: AlertCircle,
      color: "red",
      title: "تنبيه معدل الإرجاع",
      description: `معدل الإرجاع ${returnRate.toFixed(1)}% - راجع جودة المنتجات والأوصاف`,
      type: "alert"
    });
  } else if (returnRate < 3) {
    insights.push({
      icon: Award,
      color: "green",
      title: "معدل إرجاع منخفض",
      description: "عملاؤك راضون عن منتجاتك - استمر!",
      type: "success"
    });
  }

  // Product count insight
  if (totalProducts < 5) {
    insights.push({
      icon: Target,
      color: "blue",
      title: "وسّع كتالوجك",
      description: `لديك ${totalProducts} منتجات فقط - إضافة المزيد يزيد فرص البيع`,
      type: "goal"
    });
  }

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: any = {
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600', border: 'border-green-200' },
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', border: 'border-blue-200' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600', border: 'border-purple-200' },
      yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600', border: 'border-yellow-200' },
      red: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600', border: 'border-red-200' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          رؤى الأداء
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Level */}
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${getColorClasses(performance.color, 'bg')} ${getColorClasses(performance.color, 'border')}`}>
          <div>
            <p className="text-sm text-muted-foreground">مستوى الأداء</p>
            <p className={`text-2xl font-bold ${getColorClasses(performance.color, 'text')}`}>
              {performance.level}
            </p>
          </div>
          <Badge className={`${getColorClasses(performance.color, 'bg')} ${getColorClasses(performance.color, 'text')} text-lg px-4 py-2`}>
            {performance.percentage}%
          </Badge>
        </div>

        {/* Progress to next level */}
        {totalRevenue < 50000 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">التقدم للمستوى التالي</span>
              <span className="font-semibold">{((totalRevenue / 50000) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(totalRevenue / 50000) * 100} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              تحتاج <strong className="text-primary">{(50000 - totalRevenue).toLocaleString()} ج.م</strong> للوصول لمستوى "ممتاز"
            </p>
          </div>
        )}

        {/* Insights */}
        <div className="space-y-3">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg border ${getColorClasses(insight.color, 'bg')} ${getColorClasses(insight.color, 'border')} transition-all hover:shadow-md`}
              >
                <div className={`p-2 rounded-lg ${getColorClasses(insight.color, 'bg')}`}>
                  <Icon className={`h-5 w-5 ${getColorClasses(insight.color, 'text')}`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">الطلبات</p>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">المنتجات</p>
            <p className="text-lg font-bold">{totalProducts}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">متوسط الطلب</p>
            <p className="text-lg font-bold">{averageOrderValue.toFixed(0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
