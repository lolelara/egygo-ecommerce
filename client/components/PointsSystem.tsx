/**
 * Points & Rewards System Component
 * Gamification: Earn points, levels, and rewards
 */

import { useState, useEffect } from 'react';
import { Star, TrendingUp, Gift, Crown, Zap, Award } from 'lucide-react';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserPoints {
  total: number;
  level: number;
  pointsToNextLevel: number;
  streak: number;
}

interface Reward {
  id: string;
  title: string;
  points: number;
  type: 'discount' | 'coupon' | 'free_shipping' | 'gift';
  value: string;
  icon: React.ReactNode;
  claimed: boolean;
}

interface PointsSystemProps {
  userPoints: UserPoints;
  onClaimReward: (rewardId: string) => void;
  className?: string;
}

export function PointsSystem({
  userPoints,
  onClaimReward,
  className,
}: PointsSystemProps) {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: '1',
      title: 'خصم 10%',
      points: 100,
      type: 'discount',
      value: '10%',
      icon: <Gift className="h-5 w-5" />,
      claimed: false,
    },
    {
      id: '2',
      title: 'كوبون 50 جنيه',
      points: 250,
      type: 'coupon',
      value: '50 EGP',
      icon: <Star className="h-5 w-5" />,
      claimed: false,
    },
    {
      id: '3',
      title: 'شحن مجاني',
      points: 150,
      type: 'free_shipping',
      value: 'Free',
      icon: <Zap className="h-5 w-5" />,
      claimed: false,
    },
    {
      id: '4',
      title: 'هدية مجانية',
      points: 500,
      type: 'gift',
      value: 'Gift',
      icon: <Award className="h-5 w-5" />,
      claimed: false,
    },
  ]);

  const levelProgress = ((userPoints.total % userPoints.pointsToNextLevel) / userPoints.pointsToNextLevel) * 100;

  const getLevelBadge = (level: number) => {
    if (level >= 10) return { text: 'ملك', color: 'bg-yellow-500', icon: <Crown /> };
    if (level >= 5) return { text: 'نجم', color: 'bg-purple-500', icon: <Star /> };
    return { text: 'مبتدئ', color: 'bg-blue-500', icon: <TrendingUp /> };
  };

  const levelBadge = getLevelBadge(userPoints.level);

  const handleClaimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && userPoints.total >= reward.points) {
      setRewards(rewards.map(r => 
        r.id === rewardId ? { ...r, claimed: true } : r
      ));
      onClaimReward(rewardId);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Points Overview */}
      <EnhancedCard variant="gradient">
        <EnhancedCardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-1">نقاطي</h3>
              <p className="text-sm text-muted-foreground">
                اجمع النقاط واحصل على مكافآت
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full text-white",
              levelBadge.color
            )}>
              {levelBadge.icon}
              <span className="font-bold">{levelBadge.text}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                <AnimatedCounter value={userPoints.total} />
              </div>
              <div className="text-xs text-muted-foreground">إجمالي النقاط</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {userPoints.level}
              </div>
              <div className="text-xs text-muted-foreground">المستوى</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
                {userPoints.streak}
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-xs text-muted-foreground">سلسلة الأيام</div>
            </div>
          </div>

          {/* Level Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">تقدم المستوى</span>
              <span className="text-sm text-muted-foreground">
                {userPoints.pointsToNextLevel - (userPoints.total % userPoints.pointsToNextLevel)} نقطة للمستوى التالي
              </span>
            </div>
            <ProgressIndicator
              value={levelProgress}
              color="success"
              size="lg"
            />
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* How to Earn Points */}
      <EnhancedCard>
        <EnhancedCardContent className="p-6">
          <h3 className="text-lg font-bold mb-4">كيف تكسب النقاط؟</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">شراء منتج</div>
                <div className="text-sm text-muted-foreground">10 نقاط لكل 100 جنيه</div>
              </div>
              <Badge>+10</Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">تقييم منتج</div>
                <div className="text-sm text-muted-foreground">بعد كل عملية شراء</div>
              </div>
              <Badge>+5</Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">دعوة صديق</div>
                <div className="text-sm text-muted-foreground">عند أول عملية شراء</div>
              </div>
              <Badge>+50</Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium">تسجيل دخول يومي</div>
                <div className="text-sm text-muted-foreground">كل يوم متتالي</div>
              </div>
              <Badge>+2</Badge>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Available Rewards */}
      <div>
        <h3 className="text-lg font-bold mb-4">المكافآت المتاحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map((reward) => {
            const canClaim = userPoints.total >= reward.points && !reward.claimed;
            const isLocked = userPoints.total < reward.points;

            return (
              <EnhancedCard
                key={reward.id}
                variant={canClaim ? 'glow' : 'default'}
                className={cn(
                  "transition-all",
                  reward.claimed && "opacity-50"
                )}
              >
                <EnhancedCardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center",
                      canClaim ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {reward.icon}
                    </div>

                    <div className="flex-1">
                      <div className="font-bold mb-1">{reward.title}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {reward.value}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={canClaim ? "default" : "secondary"}>
                          {reward.points} نقطة
                        </Badge>
                        {reward.claimed ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            تم الاستلام
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleClaimReward(reward.id)}
                            disabled={isLocked}
                          >
                            {isLocked ? 'مقفل' : 'استلم'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PointsSystem;
