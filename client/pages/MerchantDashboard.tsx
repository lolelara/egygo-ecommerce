import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  AlertCircle,
  Plus,
  Edit,
  BarChart3,
  ArrowUpRight,
  Loader2,
  Megaphone,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Link, Navigate } from "react-router-dom";
import { PageLoader } from "@/components/ui/loading-screen";
import PendingApprovalScreen from "@/components/PendingApprovalScreen";
import { 
  getMerchantStats, 
  getMerchantProducts, 
  getMerchantOrders,
  type MerchantStats,
  type MerchantProduct,
  type MerchantOrder
} from "@/lib/merchant-api";
import InventoryManager from "@/components/merchant/InventoryManager";

export default function MerchantDashboard() {
  const { user } = useAuth();

  // Check if merchant account is pending approval
  if (user?.isMerchant && user?.accountStatus === 'pending') {
    return <PendingApprovalScreen />;
  }

  // Redirect if not a merchant
  if (!user?.isMerchant) {
    return <Navigate to="/" replace />;
  }

  // State for real data from Appwrite
  const [merchantStats, setMerchantStats] = useState<MerchantStats | null>(null);
  const [myProducts, setMyProducts] = useState<MerchantProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<MerchantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch merchant data on mount
  useEffect(() => {
    if (!user) return;

    const fetchMerchantData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel for better performance
        const [stats, products, orders] = await Promise.all([
          getMerchantStats(user.$id),
          getMerchantProducts(user.$id),
          getMerchantOrders(user.$id)
        ]);

        setMerchantStats(stats);
        setMyProducts(products.slice(0, 3)); // Top 3 products
        setRecentOrders(orders.slice(0, 3)); // Last 3 orders
      } catch (err) {
        console.error('Error fetching merchant data:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [user]);

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <PageLoader message="جاري تحميل لوحة التحكم..." />
      </AdminLayout>
    );
  }

  // Show error state
  if (error || !merchantStats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">خطأ</CardTitle>
              <CardDescription>{error || 'فشل تحميل البيانات'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              لوحة تحكم التاجر
            </h2>
            <p className="text-muted-foreground">
              مرحباً {user?.name}، إليك ملخص منتجاتك ومبيعاتك
            </p>
          </div>
          <Link to="/merchant/products">
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {merchantStats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {merchantStats.activeProducts} نشط، {merchantStats.outOfStock}{" "}
                نفذت من المخزون
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المبيعات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {merchantStats.totalSales}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {merchantStats.pendingOrders} قيد التنفيذ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${merchantStats.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs mt-1">
                {(merchantStats.revenueChange || 0) >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                    <span className="text-green-500">
                      +{(merchantStats.revenueChange || 0).toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
                    <span className="text-red-500">
                      {(merchantStats.revenueChange || 0).toFixed(1)}%
                    </span>
                  </>
                )}
                <span className="text-muted-foreground mr-1">
                  عن الشهر الماضي
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقييم</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {merchantStats.avgRating}/5.0
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {merchantStats.totalReviews} تقييم
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Management Section */}
        <InventoryManager />

        {/* Products Performance */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>أداء المنتجات</CardTitle>
                <CardDescription>
                  أفضل منتجاتك أداءً هذا الشهر
                </CardDescription>
              </div>
              <Link to="/merchant/products">
                <Button variant="outline" size="sm">
                  عرض الكل <ArrowUpRight className="h-4 w-4 mr-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>لا توجد منتجات بعد</p>
                  <Link to="/merchant/products">
                    <Button className="mt-4" size="sm">
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة منتج
                    </Button>
                  </Link>
                </div>
              ) : (
                myProducts.map((product) => {
                  const statusMap = {
                    active: { label: "نشط", variant: "default" as const },
                    out_of_stock: { label: "نفذ من المخزون", variant: "destructive" as const },
                    draft: { label: "مسودة", variant: "secondary" as const },
                  };

                  const statusInfo = statusMap[product.status] || statusMap.active;

                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 rounded-lg border"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{product.name}</h4>
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">السعر</p>
                            <p className="font-medium">${product.price}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المبيعات</p>
                            <p className="font-medium">{product.sales}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">الإيرادات</p>
                            <p className="font-medium">
                              ${product.revenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">المشاهدات</p>
                            <p className="font-medium">{product.views}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={product.stock > 0 ? Math.min((product.stock / 100) * 100, 100) : 0}
                            className="flex-1"
                          />
                          <span className="text-xs text-muted-foreground">
                            {product.stock} في المخزون
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link to={`/merchant/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 ml-1" />
                            تعديل
                          </Button>
                        </Link>
                        <Link to={`/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 ml-1" />
                            معاينة
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders & Alerts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الأخيرة</CardTitle>
              <CardDescription>
                آخر طلبات منتجاتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد طلبات بعد</p>
                  </div>
                ) : (
                  recentOrders.map((order) => {
                    const statusMap = {
                      pending: { label: "قيد الانتظار", variant: "secondary" as const },
                      processing: { label: "قيد المعالجة", variant: "secondary" as const },
                      shipped: { label: "تم الشحن", variant: "default" as const },
                      delivered: { label: "تم التسليم", variant: "default" as const },
                      cancelled: { label: "ملغي", variant: "destructive" as const },
                    };

                    const statusInfo = statusMap[order.status] || statusMap.pending;

                    return (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">#{order.orderId.slice(0, 8)}</span>
                            <Badge variant={statusInfo.variant}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.product} - {order.customer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.date}
                          </p>
                        </div>
                        <div className="text-lg font-bold">${order.amount.toLocaleString()}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Tips */}
          <Card>
            <CardHeader>
              <CardTitle>تنبيهات ونصائح</CardTitle>
              <CardDescription>تحسينات مقترحة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {merchantStats.outOfStock > 0 && (
                  <div className="flex gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">منتجات نفذت من المخزون</p>
                      <p className="text-xs text-muted-foreground">
                        لديك {merchantStats.outOfStock} منتجات نفذت من المخزون. قم بتحديث الكميات.
                      </p>
                    </div>
                  </div>
                )}

                {merchantStats.revenueChange > 0 && (
                  <div className="flex gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
                    <BarChart3 className="h-5 w-5 text-blue-600 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">أداء ممتاز</p>
                      <p className="text-xs text-muted-foreground">
                        مبيعاتك زادت بنسبة {(merchantStats.revenueChange || 0).toFixed(1)}% هذا الشهر!
                      </p>
                    </div>
                  </div>
                )}

                {merchantStats.revenueChange < 0 && (
                  <div className="flex gap-3 p-3 rounded-lg border border-red-200 bg-red-50">
                    <TrendingDown className="h-5 w-5 text-red-600 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">انخفاض في المبيعات</p>
                      <p className="text-xs text-muted-foreground">
                        مبيعاتك انخفضت بنسبة {Math.abs(merchantStats.revenueChange || 0).toFixed(1)}% هذا الشهر.
                      </p>
                    </div>
                  </div>
                )}

                {merchantStats.totalReviews > 0 && (
                  <div className="flex gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                    <Star className="h-5 w-5 text-green-600 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">تقييمات رائعة</p>
                      <p className="text-xs text-muted-foreground">
                        لديك {merchantStats.totalReviews} تقييم بمتوسط {merchantStats.avgRating}/5
                      </p>
                    </div>
                  </div>
                )}

                {merchantStats.pendingOrders > 0 && (
                  <div className="flex gap-3 p-3 rounded-lg border border-orange-200 bg-orange-50">
                    <ShoppingCart className="h-5 w-5 text-orange-600 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">طلبات قيد المعالجة</p>
                      <p className="text-xs text-muted-foreground">
                        لديك {merchantStats.pendingOrders} طلب يحتاج إلى معالجة
                      </p>
                    </div>
                  </div>
                )}

                {merchantStats.totalProducts === 0 && (
                  <div className="flex gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <Package className="h-5 w-5 text-gray-600 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-medium text-sm">ابدأ بإضافة منتجات</p>
                      <p className="text-xs text-muted-foreground">
                        لم تضف أي منتجات بعد. ابدأ بإضافة منتجك الأول!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/merchant/products">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-6 w-6" />
                    <span>إضافة منتج</span>
                  </div>
                </Button>
              </Link>
              <Link to="/merchant/products">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-6 w-6" />
                    <span>إدارة المنتجات</span>
                  </div>
                </Button>
              </Link>
              <Link to="/merchant/analytics">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>التقارير</span>
                  </div>
                </Button>
              </Link>
              <Link to="/merchant/advertising">
                <Button variant="outline" className="w-full h-auto py-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex flex-col items-center gap-2">
                    <Megaphone className="h-6 w-6 text-purple-600" />
                    <span className="text-purple-700 font-semibold">روّج منتجاتك</span>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
