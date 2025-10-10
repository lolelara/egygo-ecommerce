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
  AlertTriangle,
  Calendar,
  Download,
  Award,
  Target,
  BarChart3,
  LinkIcon,
  Share2
} from "lucide-react";
import { DashboardStatsSkeleton } from "@/components/LoadingSkeletons";
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
import AffiliateStats from "@/components/charts/AffiliateStats";

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in and has affiliate role
      if (!user) {
        setError("يجب تسجيل الدخول أولاً");
        return;
      }
      
      if (!user.isAffiliate && user.role !== 'affiliate' && user.role !== 'admin') {
        setError("ليس لديك صلاحية الوصول لهذه الصفحة. يجب أن تكون مسوق بالعمولة.");
        return;
      }
      
      // Load products for link generation
      const productsData = await fallbackProductsApi.getAll({ limit: 6 });
      setProducts(productsData.products || []);

      // Load affiliate stats if user is logged in
      if (user?.$id) {
        try {
          const statsData = await affiliateApi.getStats(user.$id);
          setStats(statsData || {
            totalClicks: 0,
            totalOrders: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            affiliateCode: user.affiliateCode || `AFF${user.$id.slice(0, 6).toUpperCase()}`,
            conversionRate: 0
          });
        } catch (statsError) {
          console.error("Error loading stats:", statsError);
          // Set default stats if API fails
          setStats({
            totalClicks: 0,
            totalOrders: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            affiliateCode: user.affiliateCode || `AFF${user.$id.slice(0, 6).toUpperCase()}`,
            conversionRate: 0
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("فشل في تحميل البيانات. حاول مرة أخرى.");
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
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gradient-to-br from-orange-50/50 via-white to-yellow-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 min-h-screen">
      {loading ? (
        <div className="py-8">
          <DashboardStatsSkeleton count={4} />
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                {error}
              </h2>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => window.location.href = '/login'} variant="outline">
                  تسجيل الدخول
                </Button>
                <Button onClick={() => window.location.href = '/affiliate'}>
                  التسجيل كمسوق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : stats ? (
        <>
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                مرحباً، {user?.name || "الشريك"}
              </h1>
              <p className="text-muted-foreground mt-1">
                إليك نظرة عامة على أداء شراكتك
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                شريك نشط
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-orange-200 dark:border-orange-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-800 dark:to-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الأرباح
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.totalEarnings || 0).toFixed(2)} ج.م
                </div>
                <p className="text-xs text-muted-foreground">
              +12.5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-800 dark:to-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              أرباح هذا الشهر
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.thisMonthEarnings || 0).toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50/30 dark:from-neutral-800 dark:to-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              النقرات هذا الشهر
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
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

        <Card className="border-purple-200 dark:border-purple-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-800 dark:to-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
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
                          {stats.affiliateCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(stats.affiliateCode, "code")
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
                        {stats.commissionRate}%
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
                        {stats.referralCount}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        تاريخ الانضمام
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date().toLocaleDateString("ar")}
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
                    {stats.recentCommissions && stats.recentCommissions.length > 0 ? (
                      stats.recentCommissions.slice(0, 5).map((commission: any) => (
                        <div
                          key={commission.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">عمولة جديدة</p>
                              <p className="text-sm text-muted-foreground">
                                طلب #{commission.orderId.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              +{(commission.amount || 0).toFixed(2)} ج.م
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(commission.createdAt).toLocaleDateString("ar")}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        لا يوجد نشاط حديث
                      </p>
                    )}
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
                      {(stats.pendingEarnings || 0).toFixed(2)} ج.م
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      سيتم دفعها خلال 7 أيام
                    </p>
                    <Button size="sm" className="mt-3" asChild>
                      <Link to="/affiliate/withdraw">عرض التفاصيل</Link>
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
                            ((product.price || 0) * (product.affiliateCommission || 0)) /
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
          {/* Advanced Analytics Component */}
          <AffiliateStats affiliateId={user?.$id || ''} />
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الأداء</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {stats.clicks || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      إجمالي النقرات
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {stats.conversions || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      إجمالي التحويلات
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {stats.conversionRate || 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      معدل التحويل
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">
                      {stats.referralCount || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      عدد الإحالات
                    </div>
                  </div>
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-muted-foreground mb-4">لم يتم العثور على بيانات الشريك</p>
          <Button asChild>
            <Link to="/">العودة للرئيسية</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
