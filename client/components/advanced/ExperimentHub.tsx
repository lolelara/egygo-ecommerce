import { FlaskConical, TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ABTest {
  id: string;
  name: string;
  status: "running" | "completed" | "draft";
  variants: {
    name: string;
    traffic: number;
    conversions: number;
    revenue: number;
  }[];
  winner?: string;
}

export function ExperimentHub() {
  const tests: ABTest[] = [
    {
      id: "1",
      name: "بانر الصفحة الرئيسية",
      status: "running",
      variants: [
        { name: "الأصلي", traffic: 50, conversions: 3.2, revenue: 12500 },
        { name: "التجريبي A", traffic: 50, conversions: 4.5, revenue: 18200 },
      ],
      winner: "التجريبي A",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6" />
            <div>
              <CardTitle>مختبر التجارب (A/B Testing)</CardTitle>
              <CardDescription>إدارة وتحليل الاختبارات المتعددة</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {tests.map((test) => (
        <Card key={test.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{test.name}</CardTitle>
              <Badge variant={test.status === "running" ? "default" : "secondary"}>
                {test.status === "running" ? "جارٍ" : "مكتمل"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {test.variants.map((variant, idx) => (
                <Card
                  key={idx}
                  className={variant.name === test.winner ? "border-green-500 border-2" : ""}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{variant.name}</p>
                        {variant.name === test.winner && (
                          <Badge variant="default" className="bg-green-600">
                            الفائز
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Traffic</p>
                          <p className="font-bold">{variant.traffic}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">تحويل</p>
                          <p className="font-bold text-green-600">{variant.conversions}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">إيرادات</p>
                          <p className="font-bold">{variant.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="w-full">تطبيق النسخة الفائزة</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Next Best Offer Engine
export function NextBestOffer({ userId }: { userId: string }) {
  const offers = [
    {
      productName: "حذاء رياضي نايك",
      confidence: 89,
      reason: "مبني على مشترياتك السابقة",
      discount: 15,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>العرض الأفضل التالي</CardTitle>
        <CardDescription>مبني على تحليلات الشبكة</CardDescription>
      </CardHeader>
      <CardContent>
        {offers.map((offer, idx) => (
          <div key={idx} className="p-4 rounded-lg border space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{offer.productName}</p>
              <Badge>خصم {offer.discount}%</Badge>
            </div>
            <Progress value={offer.confidence} className="h-2" />
            <p className="text-xs text-muted-foreground">{offer.reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Multi-Channel Campaign Manager
export function MultiChannelCampaigns() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>حملات متعددة القنوات</CardTitle>
        <CardDescription>إدارة Facebook • TikTok • Email • SMS</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {[
            { channel: "Facebook", reach: 12500, conversions: 3.2, cost: 850 },
            { channel: "TikTok", reach: 8900, conversions: 4.8, cost: 620 },
            { channel: "Email", reach: 5400, conversions: 6.1, cost: 120 },
            { channel: "SMS", reach: 3200, conversions: 8.5, cost: 180 },
          ].map((campaign) => (
            <Card key={campaign.channel}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="font-semibold">{campaign.channel}</p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الوصول:</span>
                      <span>{campaign.reach.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">التحويل:</span>
                      <span className="text-green-600">{campaign.conversions}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">التكلفة:</span>
                      <span>{campaign.cost} جنيه</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
