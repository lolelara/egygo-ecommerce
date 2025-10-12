import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EarningsCalculator() {
  const [sales, setSales] = useState<number>(10);
  const [avgCommission, setAvgCommission] = useState<number>(50);
  const [conversionRate, setConversionRate] = useState<number>(2);

  const calculateEarnings = () => {
    const daily = sales * avgCommission;
    const weekly = daily * 7;
    const monthly = daily * 30;
    const yearly = daily * 365;
    return { daily, weekly, monthly, yearly };
  };

  const calculateClicks = () => {
    return Math.ceil(sales / (conversionRate / 100));
  };

  const earnings = calculateEarnings();
  const requiredClicks = calculateClicks();

  return (
    <Card className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-800 dark:to-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-green-600" />
          حاسبة الأرباح المتوقعة
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          احسب أرباحك المتوقعة بناءً على أهدافك
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sales" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              المبيعات اليومية
            </Label>
            <Input
              id="sales"
              type="number"
              min="1"
              value={sales}
              onChange={(e) => setSales(Number(e.target.value))}
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="commission" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              متوسط العمولة (ج.م)
            </Label>
            <Input
              id="commission"
              type="number"
              min="1"
              value={avgCommission}
              onChange={(e) => setAvgCommission(Number(e.target.value))}
              className="text-lg font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conversion" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              معدل التحويل (%)
            </Label>
            <Input
              id="conversion"
              type="number"
              min="0.1"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="text-lg font-semibold"
            />
          </div>
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-center border border-green-200">
              <p className="text-xs text-muted-foreground mb-1">يومياً</p>
              <p className="text-2xl font-bold text-green-600">
                {earnings.daily.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">ج.م</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg text-center border border-blue-200">
              <p className="text-xs text-muted-foreground mb-1">أسبوعياً</p>
              <p className="text-2xl font-bold text-blue-600">
                {earnings.weekly.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">ج.م</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-center border border-purple-200">
              <p className="text-xs text-muted-foreground mb-1">شهرياً</p>
              <p className="text-2xl font-bold text-purple-600">
                {earnings.monthly.toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">ج.م</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg text-center border border-orange-200">
              <p className="text-xs text-muted-foreground mb-1">سنوياً</p>
              <p className="text-2xl font-bold text-orange-600">
                {earnings.yearly.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">ج.م</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">النقرات المطلوبة يومياً</p>
              <Badge variant="secondary" className="text-lg font-bold mt-1">
                {requiredClicks}
              </Badge>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">المبيعات المطلوبة شهرياً</p>
              <Badge variant="secondary" className="text-lg font-bold mt-1">
                {sales * 30}
              </Badge>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            💡 <strong>نصيحة:</strong> لتحقيق هدفك الشهري، ركز على زيادة معدل التحويل من خلال استهداف الجمهور المناسب
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Import missing icon
import { ShoppingCart } from "lucide-react";
