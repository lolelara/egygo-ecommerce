import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Lightbulb, Target, Award, AlertCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PerformanceInsightsProps {
  stats?: {
    conversionRate?: number;
    totalClicks?: number;
    totalOrders?: number;
    totalEarnings?: number;
  };
}

export default function PerformanceInsights({ stats }: PerformanceInsightsProps) {
  const conversionRate = stats?.conversionRate || 0;
  const totalClicks = stats?.totalClicks || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalEarnings = stats?.totalEarnings || 0;

  // Calculate performance level
  const getPerformanceLevel = () => {
    if (conversionRate >= 5) return { level: "ممتاز", color: "green", percentage: 90 };
    if (conversionRate >= 3) return { level: "جيد جداً", color: "blue", percentage: 70 };
    if (conversionRate >= 2) return { level: "جيد", color: "yellow", percentage: 50 };
    return { level: "يحتاج تحسين", color: "orange", percentage: 30 };
  };

  const performance = getPerformanceLevel();

  // Generate smart insights
  const insights = [];

  if (conversionRate >= 3) {
    insights.push({
      icon: TrendingUp,
      color: "green",
      title: "أداء ممتاز!",
      description: `معدل التحويل ${conversionRate.toFixed(1)}% أعلى من ${performance.percentage}% من المسوقين`,
      type: "success"
    });
  } else if (conversionRate < 2) {
    insights.push({
      icon: AlertCircle,
      color: "orange",
      title: "يمكنك تحسين الأداء",
      description: "جرب استهداف جمهور أكثر تحديداً لزيادة معدل التحويل",
      type: "warning"
    });
  }

  if (totalClicks > 100) {
    insights.push({
      icon: Zap,
      color: "blue",
      title: "نشاط رائع!",
      description: `حققت ${totalClicks} نقرة - استمر في المشاركة النشطة`,
      type: "info"
    });
  }

  // Smart tip based on actual performance
  if (totalClicks > 0 && totalOrders > 0) {
    insights.push({
      icon: Lightbulb,
      color: "purple",
      title: "نصيحة ذكية",
      description: `معدل تحويلك الحالي ${conversionRate.toFixed(1)}% - حاول تحسينه للوصول إلى 3-5%`,
      type: "tip"
    });
  } else {
    insights.push({
      icon: Lightbulb,
      color: "purple",
      title: "نصيحة للبدء",
      description: "ابدأ بمشاركة روابطك على وسائل التواصل الاجتماعي لجذب أول عملائك",
      type: "tip"
    });
  }

  // Goal-based insight
  if (totalEarnings < 1000) {
    insights.push({
      icon: Target,
      color: "pink",
      title: "هدفك القادم",
      description: `تحتاج ${(1000 - totalEarnings).toFixed(0)} ج.م للوصول لمستوى 'المسوق الذهبي'`,
      type: "goal"
    });
  } else {
    insights.push({
      icon: Award,
      color: "yellow",
      title: "إنجاز رائع!",
      description: "وصلت لمستوى 'المسوق الذهبي' - استمر في التميز",
      type: "achievement"
    });
  }

  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border') => {
    const colors: any = {
      green: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600', border: 'border-green-200' },
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600', border: 'border-blue-200' },
      orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600', border: 'border-orange-200' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600', border: 'border-purple-200' },
      pink: { bg: 'bg-pink-50 dark:bg-pink-900/20', text: 'text-pink-600', border: 'border-pink-200' },
      yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600', border: 'border-yellow-200' }
    };
    return colors[color]?.[type] || colors.blue[type];
  };

  return (
    <Card className="border-purple-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          رؤى الأداء
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          تحليل ذكي لأدائك ونصائح للتحسين
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Performance Level */}
        <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${getColorClasses(performance.color, 'bg')} ${getColorClasses(performance.color, 'border')}`}>
          <div>
            <p className="text-sm text-muted-foreground">مستوى الأداء</p>
            <p className={`text-2xl font-bold ${getColorClasses(performance.color, 'text')}`}>
              {performance.level}
            </p>
          </div>
          <Badge className={`${getColorClasses(performance.color, 'bg')} ${getColorClasses(performance.color, 'text')} text-lg px-4 py-2`}>
            {conversionRate.toFixed(1)}%
          </Badge>
        </div>

        {/* Insights */}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">النقرات</p>
            <p className="text-lg font-bold">{totalClicks}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">المبيعات</p>
            <p className="text-lg font-bold">{totalOrders}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">التحويل</p>
            <p className="text-lg font-bold">{conversionRate.toFixed(1)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
