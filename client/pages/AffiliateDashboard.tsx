import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  Copy,
  ExternalLink,
  Calendar,
  Download,
  Award,
  Target,
  BarChart3,
  LinkIcon,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fallbackProductsApi } from "../lib/api-fallback";
import { affiliateApi } from "@/lib/affiliate-api";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithRelations } from "@shared/prisma-types";

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products for link generation
      const productsData = await fallbackProductsApi.getAll({ limit: 6 });
      setProducts(productsData.products);

      // Load affiliate stats if user is logged in
      if (user?.$id) {
        const statsData = await affiliateApi.getStats(user.$id);
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في تحميل البيانات",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateLink = (productId: string) => {
    const baseUrl = window.location.origin;
    const code = stats?.affiliateCode || "NOCODE";
    return `${baseUrl}/products/${productId}?ref=${code}`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2000);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الرابط بنجاح",
      });
    } catch (err) {
      console.error("فشل في نسخ الرابط:", err);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في نسخ الرابط",
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500";
      case "Silver":
        return "bg-gray-400";
      case "Bronze":
        return "bg-orange-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                مرحباً، {user?.name || "الشريك"}
              </h1>
              <p className="text-muted-foreground mt-1">
                إليك نظرة عامة على أداء شراكتك
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500 text-white">
                شريك نشط
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الأرباح
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalEarnings.toFixed(2)} ج.م
                </div>
                <p className="text-xs text-muted-foreground">
              +12.5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              أرباح هذا الشهر
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.thisMonthEarnings.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              النقرات هذا الشهر
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.clicks?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي النقرات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +0.8% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="links">روابط الشراكة</TabsTrigger>
          <TabsTrigger value="performance">الأداء</TabsTrigger>
          <TabsTrigger value="resources">مصادر التسويق</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Account Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    معلومات الحساب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">كود الشراكة</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {affiliateUser.affiliateCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(affiliateUser.affiliateCode, "code")
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        معدل العمولة
                      </Label>
                      <p className="text-lg font-semibold text-brand-orange mt-1">
                        {affiliateUser.commissionRate}%
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        عدد الإحالات
                      </Label>
                      <p className="text-lg font-semibold mt-1">
                        {affiliateUser.referralCount}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        تاريخ الانضمام
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(affiliateUser.joinedAt).toLocaleDateString(
                          "ar",
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>النشاط الأخير</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {performanceData.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {activity.type === "sale" ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {activity.type === "sale" ? "عملية بيع" : "نقرات"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {"product" in activity
                                ? activity.product
                                : `${activity.clicks} نقرة من ${activity.source}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {"amount" in activity
                              ? `$${activity.amount}`
                              : new Date(activity.date).toLocaleDateString(
                                  "ar",
                                )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString("ar")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إجراءات سريعة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link to="/affiliate/withdraw">
                      <DollarSign className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      سحب الأرباح
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/affiliate/resources">
                      <Download className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      مواد التسويق
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/affiliate/support">
                      <Users className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                      الدعم الفني
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>الأرباح المعلقة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-orange">
                      ${affiliateUser.pendingEarnings.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      سيتم دفعها خلال 7 أيام
                    </p>
                    <Button size="sm" className="mt-3">
                      عرض التفاصيل
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء روابط الشراكة</CardTitle>
              <p className="text-sm text-muted-foreground">
                قم بإنشاء روابط شراكة مخصصة للمنتجات لمشاركتها مع جمهورك
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          عمولة: {product.affiliateCommission}% ($
                          {(
                            (product.price * product.affiliateCommission) /
                            100
                          ).toFixed(2)}
                          )
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={generateAffiliateLink(product.id)}
                        readOnly
                        className="w-80"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            generateAffiliateLink(product.id),
                            product.id,
                          )
                        }
                      >
                        {copiedLink === product.id ? (
                          "تم النسخ!"
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={generateAffiliateLink(product.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الأداء</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {performanceData.clicksThisMonth}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      نقرات هذا الشهر
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {performanceData.conversionsThisMonth}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      تحويلات هذا الشهر
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {performanceData.conversionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      معدل التحويل
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      ${performanceData.averageOrderValue}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      متوسط قيمة الطلب
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أفضل البلدان</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceData.topCountries.map((country, index) => (
                    <div
                      key={country}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span>{country}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 50) + 10} تحويل
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  بانرات إعلانية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  قم بتحميل بانرات جاهزة لاستخدامها في موقعك أو وسائل التواصل
                </p>
                <Button className="w-full">تحميل البانرات</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  نصائح التسويق
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  اكتشف أفضل الاستراتيجيات لزيادة مبيعاتك وأرباحك
                </p>
                <Button variant="outline" className="w-full">
                  عرض النصائح
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  شهادات المنتجات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  احصل على شهادات ومراجعات موثوقة لمشاركتها مع العملاء
                </p>
                <Button variant="outline" className="w-full">
                  عرض الشهادات
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
