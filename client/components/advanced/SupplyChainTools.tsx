import { Package, TrendingUp, Calculator, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

// Supply Offers Comparison
export function SupplyOffersComparison() {
  const offers = [
    {
      supplier: "المورد A",
      price: 850,
      minQuantity: 100,
      leadTime: "7 أيام",
      rating: 4.5,
      quality: "ممتاز",
    },
    {
      supplier: "المورد B",
      price: 820,
      minQuantity: 200,
      leadTime: "10 أيام",
      rating: 4.2,
      quality: "جيد جداً",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <div>
            <CardTitle>لوحة عروض التوريد</CardTitle>
            <CardDescription>مقارنة الأسعار والحد الأدنى للكمية</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {offers.map((offer, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-lg">{offer.supplier}</p>
                    <Badge variant="default">{offer.quality}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">السعر</p>
                      <p className="font-bold text-lg">{offer.price} جنيه</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">الحد الأدنى</p>
                      <p className="font-bold text-lg">{offer.minQuantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">مدة التسليم</p>
                      <p className="font-bold text-lg">{offer.leadTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">التقييم</p>
                      <p className="font-bold text-lg">⭐ {offer.rating}</p>
                    </div>
                  </div>
                  <Button className="w-full">اختر هذا العرض</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Margin Analyzer with Price Recommendations
export function MarginAnalyzer() {
  const [cost, setCost] = useState(850);
  const [margin, setMargin] = useState(35);
  
  const sellingPrice = cost * (1 + margin / 100);
  const profit = sellingPrice - cost;
  const competitorPrice = 1350;
  const marketPosition =
    sellingPrice < competitorPrice * 0.9
      ? "تنافسي جداً"
      : sellingPrice < competitorPrice * 1.1
      ? "تنافسي"
      : "مرتفع";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          <div>
            <CardTitle>محلل الهوامش</CardTitle>
            <CardDescription>توصيات الأسعار المثلى</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>التكلفة الأساسية</Label>
            <Input
              type="number"
              value={cost}
              onChange={(e) => setCost(Number(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>هامش الربح: {margin}%</Label>
            <Slider
              value={[margin]}
              onValueChange={(v) => setMargin(v[0])}
              min={10}
              max={100}
              step={5}
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-primary/5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">سعر البيع الموصى به</p>
              <p className="text-3xl font-bold text-primary">{sellingPrice.toFixed(0)} جنيه</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الربح</p>
              <p className="text-3xl font-bold text-green-600">{profit.toFixed(0)} جنيه</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">موقعك في السوق:</span>
            <Badge
              variant={marketPosition === "تنافسي جداً" ? "default" : "secondary"}
            >
              {marketPosition}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">متوسط سعر المنافسين:</span>
            <span className="font-semibold">{competitorPrice} جنيه</span>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-sm font-medium text-blue-900">💡 توصية</p>
          <p className="text-xs text-blue-700 mt-1">
            {margin < 25
              ? "هامش الربح منخفض. حاول زيادته إلى 30%"
              : margin > 50
              ? "السعر مرتفع جداً. قد يؤثر على المبيعات"
              : "هامش ربح مثالي! استمر."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Smart Bundles Builder
export function SmartBundlesBuilder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6" />
          <div>
            <CardTitle>حزم المنتجات الذكية</CardTitle>
            <CardDescription>Bundles & Upsells تلقائية</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">الحزمة الرياضية</p>
                  <Badge variant="default">خصم 20%</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">حذاء رياضي</span>
                    <span>1299 جنيه</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">شنطة رياضية</span>
                    <span>450 جنيه</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">زجاجة مياه</span>
                    <span>120 جنيه</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 font-bold">
                    <span>الإجمالي بعد الخصم:</span>
                    <span className="text-green-600">1495 جنيه</span>
                  </div>
                  <p className="text-xs text-muted-foreground">توفير: 374 جنيه</p>
                </div>
                <Button className="w-full">تطبيق الحزمة</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

// Price Simulator
export function PriceSimulator() {
  const scenarios = [
    { price: 1199, estimatedSales: 450, revenue: 539550, margin: 35 },
    { price: 1299, estimatedSales: 380, revenue: 493620, margin: 40 },
    { price: 1399, estimatedSales: 280, revenue: 391720, margin: 45 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>محاكي السعر النهائي</CardTitle>
        <CardDescription>أرباح السيناريوهات قبل التطبيق</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scenarios.map((scenario, idx) => (
            <Card
              key={idx}
              className={idx === 1 ? "border-green-500 border-2" : ""}
            >
              <CardContent className="pt-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">السعر</p>
                    <p className="font-bold">{scenario.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">المبيعات</p>
                    <p className="font-bold">{scenario.estimatedSales}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الإيرادات</p>
                    <p className="font-bold text-green-600">
                      {(scenario.revenue / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">الهامش</p>
                    <p className="font-bold">{scenario.margin}%</p>
                  </div>
                </div>
                {idx === 1 && (
                  <Badge variant="default" className="w-full mt-2 justify-center">
                    الأفضل
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
