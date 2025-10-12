import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, TrendingUp, Award, Medal } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LeaderboardWidgetProps {
  currentUserRank?: number;
  currentUserEarnings?: number;
}

export default function LeaderboardWidget({ 
  currentUserRank = 3, 
  currentUserEarnings = 2450 
}: LeaderboardWidgetProps) {
  const topAffiliates = [
    { rank: 1, name: "أحمد محمد", earnings: 5200, avatar: "👑" },
    { rank: 2, name: "سارة علي", earnings: 2800, avatar: "🌟" },
    { rank: 3, name: "أنت", earnings: currentUserEarnings, avatar: "🎯", isCurrentUser: true },
    { rank: 4, name: "محمد حسن", earnings: 2100, avatar: "⭐" },
    { rank: 5, name: "فاطمة أحمد", earnings: 1950, avatar: "💎" }
  ];

  const nextRank = topAffiliates.find(a => a.rank === currentUserRank - 1);
  const gapToNext = nextRank ? nextRank.earnings - currentUserEarnings : 0;
  const progressToNext = nextRank ? (currentUserEarnings / nextRank.earnings) * 100 : 100;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-500" />;
      default:
        return <Award className="h-5 w-5 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
    }
  };

  return (
    <Card className="border-yellow-200 shadow-lg bg-gradient-to-br from-white to-yellow-50/30 dark:from-neutral-800 dark:to-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          لوحة المتصدرين
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          تنافس مع أفضل المسوقين هذا الشهر
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Highlight */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Badge className={`${getRankBadgeColor(currentUserRank)} text-lg px-3 py-1`}>
                #{currentUserRank}
              </Badge>
              <div>
                <p className="font-bold text-lg">أنت 🎯</p>
                <p className="text-xs text-muted-foreground">مركزك الحالي</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-2xl text-orange-600">
                {currentUserEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">ج.م</p>
            </div>
          </div>

          {nextRank && gapToNext > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">التقدم للمركز {nextRank.rank}</span>
                <span className="font-semibold">{progressToNext.toFixed(0)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                تحتاج <strong className="text-primary">{gapToNext.toLocaleString()} ج.م</strong> للوصول للمركز {nextRank.rank}
              </p>
            </div>
          )}
        </div>

        {/* Top 5 Leaderboard */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">أفضل 5 مسوقين</h4>
          {topAffiliates.map((affiliate) => (
            <div
              key={affiliate.rank}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                affiliate.isCurrentUser
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                <Badge className={`${getRankBadgeColor(affiliate.rank)} w-8 h-8 flex items-center justify-center`}>
                  {affiliate.rank}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{affiliate.avatar}</span>
                  <div>
                    <p className={`font-semibold text-sm ${affiliate.isCurrentUser ? 'text-primary' : ''}`}>
                      {affiliate.name}
                    </p>
                    {affiliate.rank <= 3 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {getRankIcon(affiliate.rank)}
                        <span className="text-xs text-muted-foreground">
                          {affiliate.rank === 1 ? 'البطل' : affiliate.rank === 2 ? 'الوصيف' : 'الثالث'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg">
                  {affiliate.earnings.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">ج.م</p>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation Message */}
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="text-sm font-semibold">استمر في التميز!</p>
          <p className="text-xs text-muted-foreground mt-1">
            كل مبيعة تقربك من القمة 🚀
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
