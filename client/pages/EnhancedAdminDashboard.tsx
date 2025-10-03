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
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AppwriteAuthContext";

export default function EnhancedAdminDashboard() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("month");

  // Mock data - في التطبيق الحقيقي ستأتي من API
  const stats = {
    totalRevenue: 125680,
    revenueChange: 12.5,
    totalOrders: 1547,
    ordersChange: 8.3,
    totalProducts: 234,
    productsChange: -2.1,
    totalUsers: 3892,
    usersChange: 15.7,
    pendingOrders: 23,
    completedOrders: 1456,
    cancelledOrders: 68,
    totalAffiliates: 156,
  };

  const recentActivity = [
    { type: "order", message: "طلب جديد #12456", time: "منذ 5 دقائق", status: "success" },
    { type: "product", message: "تم إضافة منتج جديد", time: "منذ 15 دقيقة", status: "info" },
    { type: "user", message: "مستخدم جديد انضم", time: "منذ 30 دقيقة", status: "success" },
    { type: "order", message: "تم إلغاء طلب #12445", time: "منذ ساعة", status: "warning" },
  ];

  const topProducts = [
    { name: "سماعات بلوتوث", sales: 234, revenue: 29850, trend: 12 },
    { name: "ساعة ذكية", sales: 189, revenue: 85050, trend: 8 },
    { name: "كاميرا رقمية", sales: 145, revenue: 145000, trend: -3 },
    { name: "شاحن لاسلكي", sales: 298, revenue: 14900, trend: 15 },
  ];

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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 ml-2" />
              تصدير التقرير
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

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
            value={`$${stats.totalRevenue.toLocaleString()}`}
            change={stats.revenueChange}
            icon={DollarSign}
            trend="up"
          />
          <StatCard
            title="إجمالي الطلبات"
            value={stats.totalOrders.toLocaleString()}
            change={stats.ordersChange}
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
              <CardDescription>آخر الأحداث في الموقع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
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
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.sales} مبيعة
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ${product.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center text-xs ${
                        product.trend > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {product.trend > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="mr-1">{Math.abs(product.trend)}%</span>
                    </div>
                  </div>
                ))}
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
      </div>
    </AdminLayout>
  );
}
