import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { affiliateApi } from "@/lib/affiliate-api";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
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
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "68de037e003bd03c4d45";

export default function EnhancedAffiliateDashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.$id) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      
      // Get affiliate stats
      const affiliateStats = await affiliateApi.getStats(user!.$id);
      setStats(affiliateStats);

      // Get commissions for recent sales
      const commissionsResponse = await databases.listDocuments(
        DATABASE_ID,
        "commissions",
        [
          Query.equal("affiliateId", user!.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(10)
        ]
      );

      const salesData = await Promise.all(
        commissionsResponse.documents.slice(0, 3).map(async (comm: any) => {
          try {
            const order = await databases.getDocument(
              DATABASE_ID,
              "orders",
              comm.orderId
            );
            return {
              id: order.orderNumber || comm.$id,
              product: order.items?.[0]?.name || "منتج",
              customer: `عميل ${order.userId?.substring(0, 4)}`,
              amount: comm.orderAmount || 0,
              commission: comm.amount || 0,
              date: new Date(comm.$createdAt).toLocaleDateString("ar-EG"),
              status: comm.status === "PAID" ? "completed" : "pending",
            };
          } catch (error) {
            return {
              id: comm.$id,
              product: "منتج",
              customer: "عميل",
              amount: comm.orderAmount || 0,
              commission: comm.amount || 0,
              date: new Date(comm.$createdAt).toLocaleDateString("ar-EG"),
              status: comm.status === "PAID" ? "completed" : "pending",
            };
          }
        })
      );

      setRecentSales(salesData);
      
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في تحميل بيانات المسوق",
      });
    } finally {
      setLoading(false);
    }
  };

  const affiliateCode = (user as any)?.prefs?.affiliateCode || user?.$id?.substring(0, 8) || "AFFILIATE";
  const affiliateLink = `${window.location.origin}/#/ref/${affiliateCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الرابط إلى الحافظة",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">جاري تحميل بيانات المسوق...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>خطأ</CardTitle>
            <CardDescription>فشل في تحميل بيانات المسوق</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchAffiliateData}>إعادة المحاولة</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierProgress = {
    current: "Bronze",
    next: "Silver",
    salesNeeded: 50,
    currentSales: stats.conversions || 0,
    percentage: ((stats.conversions || 0) / 50) * 100,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Quick Access Menu */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link to="/affiliate/links">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20">
              <CardContent className="p-4 text-center">
                <LinkIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold text-sm">إدارة الروابط</h3>
                <p className="text-xs text-muted-foreground mt-1">أنشئ وتتبع روابطك</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/affiliate/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-500/20">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <h3 className="font-semibold text-sm">التحليلات</h3>
                <p className="text-xs text-muted-foreground mt-1">رسوم بيانية وإحصائيات</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/affiliate/creatives">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-500/20">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-sm">أدوات تسويقية</h3>
                <p className="text-xs text-muted-foreground mt-1">بانرات ورموز QR</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/affiliate/withdraw">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-500/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold text-sm">سحب الأرباح</h3>
                <p className="text-xs text-muted-foreground mt-1">اسحب عمولاتك</p>
              </CardContent>
            </Card>
          </Link>
        </div>

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
                ${(stats.totalEarnings || 0).toFixed(2)}
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
                ${(stats.thisMonthEarnings || 0).toFixed(2)}
              </div>
              <div className="flex items-center text-xs mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                <span className="text-green-500">
                  {stats.thisMonthEarnings > 0 ? '+' : ''}
                  {((stats.thisMonthEarnings / Math.max(stats.totalEarnings, 1)) * 100).toFixed(1)}%
                </span>
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
                {(stats.conversionRate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.conversions || 0} مبيعة من {stats.referralCount || 0} إحالة
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
                ${((stats.totalEarnings || 0) - (stats.pendingEarnings || 0)).toFixed(2)}
              </div>
              <Link to="/affiliate/withdraw">
                <Button size="sm" className="mt-2 w-full">
                  سحب الآن
                </Button>
              </Link>
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
