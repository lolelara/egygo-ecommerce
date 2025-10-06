import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  format?: "currency" | "percentage" | "number";
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  format = "number",
  className,
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  const formattedValue = () => {
    if (format === "currency") {
      return `${value} جنيه`;
    }
    if (format === "percentage") {
      return `${value}%`;
    }
    return value;
  };

  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue()}</div>
        {change !== undefined && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            {isPositive && (
              <>
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="font-medium text-green-600">+{change}%</span>
              </>
            )}
            {isNegative && (
              <>
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="font-medium text-destructive">{change}%</span>
              </>
            )}
            {changeLabel && (
              <span className="text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AnalyticsOverviewProps {
  role?: "customer" | "affiliate" | "merchant" | "admin";
}

export function AnalyticsOverview({ role = "customer" }: AnalyticsOverviewProps) {
  // Mock data - replace with real API calls
  const customerKPIs = [
    {
      title: "إجمالي المشتريات",
      value: "12,450",
      change: 12.5,
      changeLabel: "هذا الشهر",
      icon: <ShoppingCart className="h-4 w-4" />,
      format: "currency" as const,
    },
    {
      title: "الطلبات المكتملة",
      value: 23,
      change: 8,
      changeLabel: "هذا الشهر",
      icon: <Target className="h-4 w-4" />,
    },
    {
      title: "نقاط الولاء",
      value: 1250,
      change: 15,
      changeLabel: "مكافآت جديدة",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  const affiliateKPIs = [
    {
      title: "إجمالي العمولات",
      value: "24,350",
      change: 18.2,
      changeLabel: "هذا الشهر",
      icon: <DollarSign className="h-4 w-4" />,
      format: "currency" as const,
    },
    {
      title: "النقرات",
      value: "3,456",
      change: 12.5,
      changeLabel: "آخر 7 أيام",
      icon: <Target className="h-4 w-4" />,
    },
    {
      title: "معدل التحويل",
      value: "3.2",
      change: 0.8,
      changeLabel: "تحسن",
      icon: <TrendingUp className="h-4 w-4" />,
      format: "percentage" as const,
    },
    {
      title: "متوسط قيمة الطلب",
      value: "680",
      change: 5.3,
      changeLabel: "زيادة",
      icon: <ShoppingCart className="h-4 w-4" />,
      format: "currency" as const,
    },
  ];

  const merchantKPIs = [
    {
      title: "إجمالي المبيعات (GMV)",
      value: "156,340",
      change: 22.1,
      changeLabel: "هذا الشهر",
      icon: <DollarSign className="h-4 w-4" />,
      format: "currency" as const,
    },
    {
      title: "الطلبات النشطة",
      value: 47,
      change: -5,
      changeLabel: "انخفاض طفيف",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      title: "المنتجات النشطة",
      value: 128,
      change: 12,
      changeLabel: "منتجات جديدة",
      icon: <Target className="h-4 w-4" />,
    },
    {
      title: "معدل التقييم",
      value: "4.7",
      change: 0.2,
      changeLabel: "تحسن",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  const adminKPIs = [
    {
      title: "إجمالي الإيرادات (GMV)",
      value: "1,234,560",
      change: 15.8,
      changeLabel: "مقارنة بالشهر الماضي",
      icon: <DollarSign className="h-4 w-4" />,
      format: "currency" as const,
    },
    {
      title: "العملاء النشطين",
      value: "12,458",
      change: 8.3,
      changeLabel: "نمو",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "تكلفة اكتساب العميل (CAC)",
      value: "125",
      change: -12,
      changeLabel: "تحسن",
      icon: <Target className="h-4 w-4" />,
      format: "currency" as const,
    },
    {
      title: "القيمة الدائمة (LTV)",
      value: "2,450",
      change: 18,
      changeLabel: "زيادة",
      icon: <TrendingUp className="h-4 w-4" />,
      format: "currency" as const,
    },
    {
      title: "معدل التوقف (Churn)",
      value: "2.1",
      change: -0.5,
      changeLabel: "تحسن",
      icon: <TrendingDown className="h-4 w-4" />,
      format: "percentage" as const,
    },
    {
      title: "الطلبات اليومية",
      value: 342,
      change: 12,
      changeLabel: "اليوم",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
  ];

  const kpis = {
    customer: customerKPIs,
    affiliate: affiliateKPIs,
    merchant: merchantKPIs,
    admin: adminKPIs,
  }[role];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">نظرة عامة على الأداء</h2>
        <p className="text-muted-foreground">مؤشرات الأداء الرئيسية</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
    </div>
  );
}
