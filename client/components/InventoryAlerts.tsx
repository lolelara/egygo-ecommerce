import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Package,
  TrendingDown,
  RefreshCcw,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  currentStock: number;
  threshold: number;
  averageDailySales: number;
  predictedStockoutDate: Date;
  severity: "critical" | "warning" | "info";
  status: "active" | "resolved" | "ignored";
  recommendedReorderQuantity: number;
  recommendedReorderDate: Date;
  supplierLeadTime: number; // in days
}

interface InventoryAlertsProps {
  merchantId: string;
}

export function InventoryAlerts({ merchantId }: InventoryAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set(JSON.parse(localStorage.getItem("dismissedInventoryAlerts") || "[]"))
  );

  // Fetch inventory alerts - replace with real API
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["inventory-alerts", merchantId],
    queryFn: async () => {
      // Mock data - replace with actual API call
      const mockAlerts: InventoryAlert[] = [
        {
          id: "alert_1",
          productId: "prod_123",
          productName: "حذاء رياضي نايك - أسود",
          productImage: "/products/nike-shoe.jpg",
          currentStock: 5,
          threshold: 20,
          averageDailySales: 3,
          predictedStockoutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
          severity: "critical",
          status: "active",
          recommendedReorderQuantity: 50,
          recommendedReorderDate: new Date(Date.now()),
          supplierLeadTime: 7,
        },
        {
          id: "alert_2",
          productId: "prod_456",
          productName: "تيشرت قطن - أبيض",
          productImage: "/products/tshirt.jpg",
          currentStock: 15,
          threshold: 30,
          averageDailySales: 2,
          predictedStockoutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
          severity: "warning",
          status: "active",
          recommendedReorderQuantity: 60,
          recommendedReorderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // in 2 days
          supplierLeadTime: 5,
        },
        {
          id: "alert_3",
          productId: "prod_789",
          productName: "حقيبة ظهر - أزرق",
          productImage: "/products/backpack.jpg",
          currentStock: 25,
          threshold: 40,
          averageDailySales: 1.5,
          predictedStockoutDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 16), // 16 days
          severity: "info",
          status: "active",
          recommendedReorderQuantity: 40,
          recommendedReorderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9), // in 9 days
          supplierLeadTime: 7,
        },
      ];
      return mockAlerts;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "active" && !dismissedAlerts.has(alert.id)
  );

  const dismissAlert = (alertId: string) => {
    const newDismissed = new Set(dismissedAlerts);
    newDismissed.add(alertId);
    setDismissedAlerts(newDismissed);
    localStorage.setItem("dismissedInventoryAlerts", JSON.stringify([...newDismissed]));
  };

  const getSeverityStyles = (severity: InventoryAlert["severity"]) => {
    const styles = {
      critical: {
        badge: "bg-red-100 text-red-800 border-red-200",
        alert: "border-red-200 bg-red-50",
        icon: "text-red-600",
        progress: "bg-red-600",
      },
      warning: {
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
        alert: "border-yellow-200 bg-yellow-50",
        icon: "text-yellow-600",
        progress: "bg-yellow-600",
      },
      info: {
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        alert: "border-blue-200 bg-blue-50",
        icon: "text-blue-600",
        progress: "bg-blue-600",
      },
    };
    return styles[severity];
  };

  const getSeverityLabel = (severity: InventoryAlert["severity"]) => {
    const labels = {
      critical: "حرج",
      warning: "تحذير",
      info: "معلومة",
    };
    return labels[severity];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntil = (date: Date) => {
    return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getStockPercentage = (current: number, threshold: number) => {
    return Math.max(0, Math.min(100, (current / threshold) * 100));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">تنبيهات المخزون</CardTitle>
              <CardDescription>
                مراقبة فورية لمستويات المخزون وتوقعات النفاد
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-lg px-3 py-1",
                activeAlerts.filter((a) => a.severity === "critical").length > 0 &&
                  "bg-red-100 text-red-800 border-red-200 animate-pulse"
              )}
            >
              {activeAlerts.length} تنبيه
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold">
                    {activeAlerts.filter((a) => a.severity === "critical").length}
                  </p>
                  <p className="text-xs text-muted-foreground">حرجة</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold">
                    {activeAlerts.filter((a) => a.severity === "warning").length}
                  </p>
                  <p className="text-xs text-muted-foreground">تحذيرية</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold">
                    {alerts.length - activeAlerts.length}
                  </p>
                  <p className="text-xs text-muted-foreground">محلولة</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد تنبيهات</h3>
            <p className="text-sm text-muted-foreground text-center">
              جميع المنتجات لديها مخزون كافٍ
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            const stockPercentage = getStockPercentage(alert.currentStock, alert.threshold);
            const daysUntilStockout = getDaysUntil(alert.predictedStockoutDate);
            const daysUntilReorder = getDaysUntil(alert.recommendedReorderDate);

            return (
              <Alert key={alert.id} className={cn("relative", styles.alert)}>
                <div className="flex gap-4">
                  {/* Product Image */}
                  {alert.productImage && (
                    <img
                      src={alert.productImage}
                      alt={alert.productName}
                      className="w-20 h-20 rounded object-cover flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={cn("h-5 w-5", styles.icon)} />
                          <AlertTitle className="mb-0 font-semibold">
                            {alert.productName}
                          </AlertTitle>
                        </div>
                        <AlertDescription className="text-sm">
                          المخزون الحالي: <strong>{alert.currentStock} قطعة</strong> من{" "}
                          {alert.threshold} قطعة مطلوبة
                        </AlertDescription>
                      </div>
                      <Badge className={styles.badge}>{getSeverityLabel(alert.severity)}</Badge>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>مستوى المخزون</span>
                        <span>{stockPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={stockPercentage} className={cn("h-2", styles.progress)} />
                    </div>

                    <Separator />

                    {/* Predictions */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <TrendingDown className="h-4 w-4" />
                          <span>متوسط المبيعات اليومية</span>
                        </div>
                        <p className="font-semibold">
                          {alert.averageDailySales.toFixed(1)} قطعة/يوم
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>نفاد متوقع خلال</span>
                        </div>
                        <p
                          className={cn(
                            "font-semibold",
                            daysUntilStockout <= 3 && "text-red-600"
                          )}
                        >
                          {daysUntilStockout} يوم
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Reorder Recommendations */}
                    <div className="rounded-lg bg-background border p-3 space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        توصيات إعادة الطلب
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">الكمية الموصى بها</p>
                          <p className="font-semibold">
                            {alert.recommendedReorderQuantity} قطعة
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">مدة توصيل المورّد</p>
                          <p className="font-semibold">{alert.supplierLeadTime} أيام</p>
                        </div>
                      </div>
                      {daysUntilReorder <= 0 ? (
                        <Alert className="bg-red-50 border-red-200 py-2">
                          <AlertDescription className="text-sm text-red-800">
                            ⚠️ يجب إعادة الطلب <strong>الآن</strong> لتفادي النفاد
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          يُفضل إعادة الطلب خلال: {daysUntilReorder} يوم (
                          {formatDate(alert.recommendedReorderDate)})
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <Button size="sm" className="flex-1">
                        <Package className="h-4 w-4 ml-1" />
                        إعادة طلب {alert.recommendedReorderQuantity} قطعة
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`/merchant/products/${alert.productId}`, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        إخفاء
                      </Button>
                    </div>
                  </div>
                </div>
              </Alert>
            );
          })}
        </div>
      )}
    </div>
  );
}
