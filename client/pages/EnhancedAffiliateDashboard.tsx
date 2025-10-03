import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  Copy,
  Share2,
  Download,
  Award,
  Target,
  BarChart3,
  LinkIcon,
  CheckCircle,
  Clock,
  Sparkles,
  Gift,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EnhancedAffiliateDashboard() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const affiliateCode = "AHMED2024";
  const affiliateLink = `https://egygo.com/ref/${affiliateCode}`;

  const stats = {
    totalEarnings: 2847.5,
    pendingEarnings: 450.75,
    thisMonthEarnings: 680.25,
    availableForWithdraw: 2396.75,
    totalClicks: 1234,
    totalSales: 89,
    conversionRate: 7.2,
    referralCount: 34,
  };

  const tierProgress = {
    current: "Silver",
    next: "Gold",
    salesNeeded: 150,
    currentSales: 89,
    percentage: (89 / 150) * 100,
  };

  const recentSales = [
    {
      id: "#12456",
      product: "سماعات بلوتوث",
      customer: "عميل 1234",
      amount: 299,
      commission: 44.85,
      date: "2025-10-02",
      status: "completed",
    },
    {
      id: "#12455",
      product: "ساعة ذكية",
      customer: "عميل 5678",
      amount: 899,
      commission: 134.85,
      date: "2025-10-01",
      status: "pending",
    },
    {
      id: "#12454",
      product: "شاحن لاسلكي",
      customer: "عميل 9012",
      amount: 89,
      commission: 13.35,
      date: "2025-10-01",
      status: "completed",
    },
  ];

  const topProducts = [
    { name: "سماعات بلوتوث", sales: 23, commission: 345.75, clicks: 456 },
    { name: "ساعة ذكية", sales: 18, commission: 242.10, clicks: 389 },
    { name: "شاحن لاسلكي", sales: 34, commission: 153.00, clicks: 578 },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الرابط إلى الحافظة",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">لوحة تحكم المسوق</h1>
              <p className="text-muted-foreground">
                تتبع أرباحك وإحصائياتك التسويقية
              </p>
            </div>
            <Badge variant="default" className="text-lg px-4 py-2">
              <Award className="h-5 w-5 ml-2" />
              {tierProgress.current} Tier
            </Badge>
          </div>

          {/* Tier Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">
                  تقدمك نحو {tierProgress.next} Tier
                </p>
                <p className="text-sm text-muted-foreground">
                  {tierProgress.currentSales} / {tierProgress.salesNeeded} مبيعة
                </p>
              </div>
              <Progress value={tierProgress.percentage} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {tierProgress.salesNeeded - tierProgress.currentSales} مبيعة متبقية
                للوصول إلى المستوى الذهبي وزيادة نسبة العمولة!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الأرباح
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.totalEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                منذ الانضمام
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">هذا الشهر</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.thisMonthEarnings.toFixed(2)}
              </div>
              <div className="flex items-center text-xs mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                <span className="text-green-500">+12.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                معدل التحويل
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.conversionRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalSales} مبيعة من {stats.totalClicks} زيارة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                جاهز للسحب
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${stats.availableForWithdraw.toFixed(2)}
              </div>
              <Button size="sm" className="mt-2">
                سحب الآن
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Link Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>رابط الإحالة الخاص بك</CardTitle>
            <CardDescription>
              شارك هذا الرابط لكسب عمولة على كل عملية بيع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={affiliateLink} readOnly className="font-mono" />
              <Button
                onClick={() => copyToClipboard(affiliateLink)}
                variant="outline"
              >
                <Copy className="h-4 w-4 ml-2" />
                {copied ? "تم النسخ!" : "نسخ"}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 ml-2" />
                فيسبوك
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 ml-2" />
                تويتر
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 ml-2" />
                واتساب
              </Button>
            </div>

            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{stats.totalClicks} زيارة</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span>{stats.totalSales} مبيعة</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>نسبة العمولة: 15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">
              <ShoppingCart className="h-4 w-4 ml-2" />
              المبيعات
            </TabsTrigger>
            <TabsTrigger value="products">
              <BarChart3 className="h-4 w-4 ml-2" />
              أفضل المنتجات
            </TabsTrigger>
            <TabsTrigger value="tools">
              <Sparkles className="h-4 w-4 ml-2" />
              أدوات التسويق
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Gift className="h-4 w-4 ml-2" />
              المكافآت
            </TabsTrigger>
          </TabsList>

          {/* Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>المبيعات الأخيرة</CardTitle>
                <CardDescription>
                  تفاصيل العمولات من مبيعاتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{sale.id}</span>
                          <Badge
                            variant={
                              sale.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {sale.status === "completed" ? (
                              <>
                                <CheckCircle className="h-3 w-3 ml-1" />
                                مكتمل
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 ml-1" />
                                قيد المعالجة
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sale.product} - ${sale.amount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {sale.date}
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">عمولتك</p>
                        <p className="text-lg font-bold text-green-600">
                          ${sale.commission.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>أفضل منتجاتك أداءً</CardTitle>
                <CardDescription>
                  المنتجات التي تحقق أعلى عمولات
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{product.sales} مبيعة</span>
                          <span>{product.clicks} نقرة</span>
                          <span>
                            معدل التحويل:{" "}
                            {((product.sales / product.clicks) * 100).toFixed(
                              1
                            )}
                            %
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">
                          إجمالي العمولات
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          ${product.commission.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tools Tab */}
          <TabsContent value="tools">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>روابط مخصصة للمنتجات</CardTitle>
                  <CardDescription>
                    أنشئ روابط خاصة لمنتجات محددة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <LinkIcon className="h-4 w-4 ml-2" />
                    إنشاء رابط جديد
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>بانرات إعلانية</CardTitle>
                  <CardDescription>
                    تحميل صور جاهزة للترويج
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 ml-2" />
                    تحميل البانرات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>كوبونات خصم</CardTitle>
                  <CardDescription>
                    أنشئ كوبونات خاصة لعملائك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Gift className="h-4 w-4 ml-2" />
                    إنشاء كوبون
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تقارير مفصلة</CardTitle>
                  <CardDescription>
                    تصدير تقارير الأداء
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 ml-2" />
                    تصدير التقرير
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>برنامج المكافآت</CardTitle>
                <CardDescription>
                  احصل على مكافآت إضافية عند تحقيق أهداف محددة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">مكافأة 100 مبيعة</p>
                        <p className="text-sm text-muted-foreground">
                          احصل على $50 إضافية
                        </p>
                      </div>
                      <Badge variant="default">89%</Badge>
                    </div>
                    <Progress value={89} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      11 مبيعة فقط للوصول للهدف!
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">مكافأة 200 مبيعة</p>
                        <p className="text-sm text-muted-foreground">
                          احصل على $150 إضافية
                        </p>
                      </div>
                      <Badge variant="secondary">44.5%</Badge>
                    </div>
                    <Progress value={44.5} className="mt-2" />
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">مكافأة 500 مبيعة</p>
                        <p className="text-sm text-muted-foreground">
                          احصل على $500 إضافية
                        </p>
                      </div>
                      <Badge variant="secondary">17.8%</Badge>
                    </div>
                    <Progress value={17.8} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
