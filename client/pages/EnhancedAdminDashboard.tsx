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
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  UserCheck,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Boxes,
  Bell,
  Zap,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Link } from "react-router-dom";
import { adminDashboardApi } from "@/lib/admin-api";
import { useToast } from "@/hooks/use-toast";

export default function EnhancedAdminDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("month");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminDashboardApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في تحميل الإحصائيات",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs mt-1">
          {trend === "up" ? (
            <>
              <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
              <span className="text-green-500">+{change}%</span>
            </>
          ) : trend === "down" ? (
            <>
              <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
              <span className="text-red-500">{change}%</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
              <span className="text-green-500">+{change}%</span>
            </>
          )}
          <span className="text-muted-foreground mr-1">عن الشهر الماضي</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              لوحة التحكم
            </h2>
            <p className="text-muted-foreground">
              مرحباً {user?.name}، إليك ملخص نشاط موقعك
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : stats ? (
          <>
            {/* Time Range Selector */}
            <Tabs defaultValue="month" className="w-full">
              <TabsList>
                <TabsTrigger value="today">اليوم</TabsTrigger>
                <TabsTrigger value="week">هذا الأسبوع</TabsTrigger>
                <TabsTrigger value="month">هذا الشهر</TabsTrigger>
                <TabsTrigger value="year">هذا العام</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Main Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="إجمالي الإيرادات"
                value={`${stats.totalRevenue.toLocaleString()} ج.م`}
                change={stats.revenueChange || 0}
                icon={DollarSign}
                trend="up"
              />
              <StatCard
                title="إجمالي الطلبات"
                value={stats.totalOrders.toLocaleString()}
                change={stats.ordersChange || 0}
            icon={ShoppingCart}
            trend="up"
          />
          <StatCard
            title="المنتجات"
            value={stats.totalProducts}
            change={Math.abs(stats.productsChange)}
            icon={Package}
            trend="down"
          />
          <StatCard
            title="المستخدمين"
            value={stats.totalUsers.toLocaleString()}
            change={stats.usersChange}
            icon={Users}
            trend="up"
          />
        </div>

        {/* New Features Quick Access */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  الميزات الجديدة
                </CardTitle>
                <CardDescription>
                  تم إضافة ميزات متقدمة جديدة لتحسين تجربتك
                </CardDescription>
              </div>
              <Badge variant="default" className="animate-pulse">جديد</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link to="/admin/analytics">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
                  <CardHeader className="pb-3">
                    <LineChart className="h-8 w-8 text-blue-500 mb-2" />
                    <CardTitle className="text-base">لوحة التحليلات</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground">
                      رسوم بيانية احترافية وتحليلات شاملة
                    </p>
                    <div className="flex items-center text-xs text-primary mt-2">
                      عرض التحليلات <ArrowUpRight className="h-3 w-3 mr-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/admin/products-advanced">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
                  <CardHeader className="pb-3">
                    <Boxes className="h-8 w-8 text-green-500 mb-2" />
                    <CardTitle className="text-base">إدارة متقدمة</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground">
                      عمليات جماعية وتصدير/استيراد CSV
                    </p>
                    <div className="flex items-center text-xs text-primary mt-2">
                      إدارة المنتجات <ArrowUpRight className="h-3 w-3 mr-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
                <CardHeader className="pb-3">
                  <Bell className="h-8 w-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">مركز الإشعارات</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground">
                    موجود في الـ Header - اضغط الجرس 🔔
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    متاح الآن
                  </Badge>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
                <CardHeader className="pb-3">
                  <BarChart3 className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">المزيد قريباً</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground">
                    Kanban Board، Command Palette، وأكثر...
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    قيد التطوير
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Orders Status & Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                طلبات قيد الانتظار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </div>
              <Button variant="link" className="p-0 h-auto text-xs mt-2">
                عرض الطلبات <ArrowUpRight className="h-3 w-3 mr-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                طلبات مكتملة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedOrders}
              </div>
              <Progress value={94} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                طلبات ملغاة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelledOrders}
              </div>
              <Progress value={4} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">المسوقين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-purple">
                {stats.totalAffiliates}
              </div>
              <Button variant="link" className="p-0 h-auto text-xs mt-2">
                إدارة المسوقين <ArrowUpRight className="h-3 w-3 mr-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activity */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>النشاط الأخير</CardTitle>
              <CardDescription>آخر الطلبات في الموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  stats.recentOrders.slice(0, 5).map((order: any, i: number) => (
                    <div key={order.id} className="flex items-center gap-4">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          order.status === "completed"
                            ? "bg-green-500"
                            : order.status === "pending"
                            ? "bg-yellow-500"
                            : order.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          طلب #{order.id.substring(0, 8)} - {order.total.toLocaleString()} ج.م
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("ar-EG")}
                        </p>
                      </div>
                      <Badge variant={
                        order.status === "completed" ? "default" :
                        order.status === "pending" ? "secondary" : "destructive"
                      }>
                        {order.status === "completed" ? "مكتمل" :
                         order.status === "pending" ? "قيد المراجعة" :
                         order.status === "cancelled" ? "ملغي" : order.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">لا توجد طلبات حديثة</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>أفضل المنتجات</CardTitle>
              <CardDescription>الأكثر مبيعاً هذا الشهر</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts && stats.topProducts.length > 0 ? (
                  stats.topProducts.slice(0, 5).map((product: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {product.quantity} مبيعة
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {product.revenue.toLocaleString()} ج.م
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                        <span>{i + 1}#</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center">لا توجد بيانات منتجات</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                معدل التحويل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.24%</div>
              <Progress value={32} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                من إجمالي الزيارات
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                متوسط قيمة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$81.25</div>
              <div className="flex items-center text-xs mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                <span className="text-green-500">+5.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                معدل رضا العملاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5.0</div>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < 5 ? "bg-yellow-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">لا توجد بيانات</div>
        )}
      </div>
    </AdminLayout>
  );
}
