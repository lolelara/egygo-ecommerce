import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, TrendingDown, AlertTriangle, Calendar, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface PerformanceAlert {
  id: string;
  type: "conversion_drop" | "coupon_expiry" | "link_performance" | "commission_change";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  metric?: {
    current: number;
    previous: number;
    change: number;
  };
  actionUrl?: string;
  timestamp: Date;
  read: boolean;
}

interface PerformanceAlertsProps {
  userId: string;
  userRole: "affiliate" | "merchant" | "admin";
}

export function PerformanceAlerts({ userId, userRole }: PerformanceAlertsProps) {
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Fetch alerts from API
  const { data: alertsData } = useQuery({
    queryKey: ["performance-alerts", userId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockAlerts;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  useEffect(() => {
    if (alertsData) {
      setAlerts(alertsData);
    }
  }, [alertsData]);

  const handleDismiss = (alertId: string) => {
    setDismissed(prev => new Set(prev).add(alertId));
    // TODO: Mark as read in backend
  };

  const visibleAlerts = alerts.filter(alert => !dismissed.has(alert.id));
  const highPriorityAlerts = visibleAlerts.filter(a => a.severity === "high");

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Summary Badge */}
      {highPriorityAlerts.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="font-semibold">
            لديك {highPriorityAlerts.length} تنبيه عاجل يحتاج اهتمامك
          </AlertDescription>
        </Alert>
      )}

      {/* Alerts List */}
      <div className="grid gap-4">
        {visibleAlerts.map(alert => (
          <Card
            key={alert.id}
            className={cn(
              "relative",
              alert.severity === "high" && "border-destructive",
              alert.severity === "medium" && "border-warning",
              alert.severity === "low" && "border-muted"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 rounded-full p-2",
                      alert.severity === "high" && "bg-destructive/10 text-destructive",
                      alert.severity === "medium" && "bg-warning/10 text-warning",
                      alert.severity === "low" && "bg-muted text-muted-foreground"
                    )}
                  >
                    {alert.type === "conversion_drop" && <TrendingDown className="h-4 w-4" />}
                    {alert.type === "coupon_expiry" && <Calendar className="h-4 w-4" />}
                    {alert.type === "link_performance" && <AlertTriangle className="h-4 w-4" />}
                    {alert.type === "commission_change" && <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      <Badge
                        variant={
                          alert.severity === "high" ? "destructive" :
                          alert.severity === "medium" ? "default" :
                          "secondary"
                        }
                      >
                        {alert.severity === "high" ? "عاجل" :
                         alert.severity === "medium" ? "مهم" :
                         "إشعار"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {alert.metric && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-6 rounded-lg bg-muted/50 p-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">الحالي</div>
                    <div className="text-lg font-bold">{alert.metric.current}%</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">السابق</div>
                    <div className="text-lg font-semibold text-muted-foreground">
                      {alert.metric.previous}%
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">التغيير</div>
                    <div
                      className={cn(
                        "text-lg font-bold flex items-center gap-1",
                        alert.metric.change < 0 ? "text-destructive" : "text-success"
                      )}
                    >
                      <TrendingDown className={cn(
                        "h-4 w-4",
                        alert.metric.change >= 0 && "rotate-180"
                      )} />
                      {Math.abs(alert.metric.change)}%
                    </div>
                  </div>
                </div>

                {alert.actionUrl && (
                  <Button className="mt-3 w-full" asChild>
                    <a href={alert.actionUrl}>اتخاذ إجراء</a>
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockAlerts: PerformanceAlert[] = [
  {
    id: "1",
    type: "conversion_drop",
    severity: "high",
    title: "انخفاض كبير في معدل التحويل",
    description: "انخفض معدل التحويل بنسبة 35% في آخر 24 ساعة مقارنة بالمتوسط الأسبوعي.",
    metric: {
      current: 2.3,
      previous: 3.5,
      change: -35
    },
    actionUrl: "/affiliate/analytics",
    timestamp: new Date(),
    read: false
  },
  {
    id: "2",
    type: "coupon_expiry",
    severity: "medium",
    title: "كوبون قرب الانتهاء",
    description: "كوبون SUMMER25 سينتهي خلال 3 أيام. تأكد من تحديث حملاتك التسويقية.",
    timestamp: new Date(),
    read: false
  },
  {
    id: "3",
    type: "link_performance",
    severity: "low",
    title: "رابط بأداء منخفض",
    description: "الرابط الخاص بحملة Instagram لم يحقق أي نقرات في آخر 7 أيام.",
    actionUrl: "/affiliate/links",
    timestamp: new Date(),
    read: false
  }
];
