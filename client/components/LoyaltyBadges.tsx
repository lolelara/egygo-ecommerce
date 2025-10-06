import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, Star, Crown, Gift, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type LoyaltyTier = "silver" | "gold" | "platinum";

interface LoyaltyData {
  tier: LoyaltyTier;
  points: number;
  lifetimeValue: number;
  nextTier?: LoyaltyTier;
  pointsToNextTier?: number;
  tierSince: Date;
}

interface TierBenefit {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

interface TierConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  minPoints: number;
  benefits: TierBenefit[];
}

const TIER_CONFIGS: Record<LoyaltyTier, TierConfig> = {
  silver: {
    name: "الفضي",
    icon: Star,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    minPoints: 0,
    benefits: [
      {
        icon: Gift,
        label: "خصم 5%",
        description: "على جميع المنتجات",
      },
      {
        icon: TrendingUp,
        label: "شحن مجاني",
        description: "على الطلبات أكثر من 500 جنيه",
      },
      {
        icon: Sparkles,
        label: "نقاط مضاعفة",
        description: "في المناسبات الخاصة",
      },
    ],
  },
  gold: {
    name: "الذهبي",
    icon: Award,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-700",
    minPoints: 1000,
    benefits: [
      {
        icon: Gift,
        label: "خصم 10%",
        description: "على جميع المنتجات",
      },
      {
        icon: TrendingUp,
        label: "شحن مجاني دائماً",
        description: "بدون حد أدنى",
      },
      {
        icon: Sparkles,
        label: "إرجاع مجاني",
        description: "خلال 30 يوم",
      },
      {
        icon: Award,
        label: "عروض حصرية",
        description: "وصول مبكر للتخفيضات",
      },
    ],
  },
  platinum: {
    name: "البلاتيني",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    minPoints: 5000,
    benefits: [
      {
        icon: Gift,
        label: "خصم 15%",
        description: "على جميع المنتجات",
      },
      {
        icon: TrendingUp,
        label: "شحن سريع مجاني",
        description: "توصيل في نفس اليوم",
      },
      {
        icon: Sparkles,
        label: "أولوية الدعم",
        description: "دعم فوري 24/7",
      },
      {
        icon: Award,
        label: "عروض VIP حصرية",
        description: "منتجات وخصومات خاصة",
      },
      {
        icon: Crown,
        label: "مدير حساب شخصي",
        description: "خدمة شخصية مخصصة",
      },
    ],
  },
};

interface LoyaltyBadgeProps {
  tier: LoyaltyTier;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function LoyaltyBadge({ tier, size = "md", showLabel = true }: LoyaltyBadgeProps) {
  const config = TIER_CONFIGS[tier];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Badge
      className={cn(
        "gap-1.5 font-semibold",
        config.bgColor,
        config.borderColor,
        config.textColor
      )}
    >
      <Icon className={cn(sizeClasses[size], config.color)} />
      {showLabel && config.name}
    </Badge>
  );
}

interface LoyaltyDashboardProps {
  userId: string;
}

export function LoyaltyDashboard({ userId }: LoyaltyDashboardProps) {
  // Fetch loyalty data - replace with real API
  const { data: loyaltyData, isLoading } = useQuery({
    queryKey: ["loyalty", userId],
    queryFn: async (): Promise<LoyaltyData> => {
      // Mock data - replace with actual API call
      return {
        tier: "gold",
        points: 2350,
        lifetimeValue: 18500,
        nextTier: "platinum",
        pointsToNextTier: 2650,
        tierSince: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
      };
    },
  });

  if (isLoading || !loyaltyData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Star className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const currentConfig = TIER_CONFIGS[loyaltyData.tier];
  const nextConfig = loyaltyData.nextTier ? TIER_CONFIGS[loyaltyData.nextTier] : null;
  const progressPercentage = loyaltyData.nextTier
    ? ((loyaltyData.points - currentConfig.minPoints) /
        (TIER_CONFIGS[loyaltyData.nextTier].minPoints - currentConfig.minPoints)) *
      100
    : 100;

  const CurrentIcon = currentConfig.icon;

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card className={cn("relative overflow-hidden", currentConfig.borderColor)}>
        {/* Decorative Background */}
        <div
          className={cn(
            "absolute inset-0 opacity-10",
            currentConfig.bgColor
          )}
        >
          <CurrentIcon className="absolute -right-10 -top-10 h-48 w-48 opacity-20" />
        </div>

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">برنامج الولاء</CardTitle>
              <CardDescription>
                عضو منذ {loyaltyData.tierSince.toLocaleDateString("ar-EG")}
              </CardDescription>
            </div>
            <LoyaltyBadge tier={loyaltyData.tier} size="lg" />
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Points & Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">نقاط الولاء</p>
              <p className="text-3xl font-bold">{loyaltyData.points.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-4 space-y-1">
              <p className="text-sm text-muted-foreground">إجمالي المشتريات</p>
              <p className="text-3xl font-bold">
                {loyaltyData.lifetimeValue.toLocaleString()} جنيه
              </p>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {nextConfig && loyaltyData.pointsToNextTier && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">التقدم نحو المستوى {nextConfig.name}</p>
                <p className="text-sm text-muted-foreground">
                  {loyaltyData.pointsToNextTier.toLocaleString()} نقطة متبقية
                </p>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>المستوى الحالي: {currentConfig.name}</span>
                <span>•</span>
                <span>المستوى القادم: {nextConfig.name}</span>
              </div>
            </div>
          )}

          {/* Current Tier Benefits */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Gift className="h-5 w-5" />
              مزايا المستوى {currentConfig.name}
            </h4>
            <div className="grid gap-2">
              {currentConfig.benefits.map((benefit, index) => {
                const BenefitIcon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0",
                        currentConfig.bgColor
                      )}
                    >
                      <BenefitIcon className={cn("h-5 w-5", currentConfig.color)} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold">{benefit.label}</p>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Tiers Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>مستويات الولاء</CardTitle>
          <CardDescription>قارن بين المستويات واختر هدفك القادم</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.entries(TIER_CONFIGS) as [LoyaltyTier, TierConfig][]).map(
              ([tier, config]) => {
                const Icon = config.icon;
                const isCurrentTier = tier === loyaltyData.tier;
                return (
                  <Card
                    key={tier}
                    className={cn(
                      "relative overflow-hidden",
                      isCurrentTier && [config.borderColor, "border-2 shadow-lg"]
                    )}
                  >
                    {isCurrentTier && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="text-xs">
                          مستواك الحالي
                        </Badge>
                      </div>
                    )}
                    <CardHeader className={cn("pb-3", config.bgColor)}>
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-6 w-6", config.color)} />
                        <CardTitle className="text-lg">{config.name}</CardTitle>
                      </div>
                      <CardDescription>
                        {config.minPoints === 0
                          ? "0 نقطة فأكثر"
                          : `${config.minPoints.toLocaleString()} نقطة فأكثر`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pt-4">
                      {config.benefits.slice(0, 3).map((benefit, index) => {
                        const BenefitIcon = benefit.icon;
                        return (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <BenefitIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{benefit.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {benefit.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {config.benefits.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          + {config.benefits.length - 3} مزايا إضافية
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* How to Earn Points */}
      <Card>
        <CardHeader>
          <CardTitle>كيفية ربح النقاط</CardTitle>
          <CardDescription>اكسب نقاط الولاء من خلال هذه الأنشطة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { action: "كل 1 جنيه مشتريات", points: 1 },
              { action: "إكمال ملفك الشخصي", points: 50 },
              { action: "مراجعة منتج", points: 20 },
              { action: "إحالة صديق", points: 100 },
              { action: "متابعة حسابات التواصل", points: 30 },
              { action: "الطلب في عيد ميلادك", points: 200 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <span className="text-sm">{item.action}</span>
                <Badge variant="secondary" className="font-semibold">
                  +{item.points} نقطة
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
