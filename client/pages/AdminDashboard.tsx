import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  PieChart,
  Activity,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { adminDashboardApi, type AdminStats } from "@/lib/admin-api";
import VendoorProductsCard from "@/components/VendoorProductsCard";

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div
          className={`flex items-center text-xs mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend.isPositive ? "+" : ""}
          {trend.value}% من الشهر الماضي
        </div>
      )}
    </CardContent>
  </Card>
);

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { label: "في الانتظار", variant: "secondary" as const },
    PROCESSING: { label: "قيد المعالجة", variant: "default" as const },
    SHIPPED: { label: "تم الشحن", variant: "outline" as const },
    DELIVERED: { label: "تم التسليم", variant: "secondary" as const },
    CANCELLED: { label: "ملغي", variant: "destructive" as const },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminDashboardApi.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        // Show error message to user
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!stats) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
          <div className="flex items-center space-x-2">
            <Button size="sm">تحديث البيانات</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="إجمالي المستخدمين"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="إجمالي المنتجات"
            value={stats.totalProducts}
            icon={Package}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="إجمالي الطلبات"
            value={stats.totalOrders.toLocaleString()}
            icon={ShoppingCart}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="إجمالي الإيرادات"
            value={`${stats.totalRevenue.toLocaleString()} ج.م`}
            icon={DollarSign}
            trend={{ value: 23, isPositive: true }}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="الطلبات المعلقة"
            value={stats.pendingOrders}
            description="تحتاج لمراجعة"
            icon={Clock}
          />
          <StatCard
            title="إجمالي الشركاء"
            value={stats.totalAffiliates}
            icon={UserCheck}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="العمولات المعلقة"
            value={`${stats.pendingCommissions.toLocaleString()} ج.م`}
            description="في انتظار الدفع"
            icon={AlertTriangle}
          />
          <StatCard
            title="إيرادات هذا الشهر"
            value={`${stats.thisMonthRevenue.toLocaleString()} ج.م`}
            description={`${stats.thisMonthOrders} طلب`}
            icon={TrendingUp}
          />
        </div>

        {/* Vendoor Products Card */}
        <div className="grid gap-4 md:grid-cols-3">
          <VendoorProductsCard />
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/hero-products')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">منتجات الهيرو</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">إدارة العروض</div>
              <p className="text-xs text-muted-foreground mt-1">التحكم في المنتجات المميزة في الصفحة الرئيسية</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/marketer-tools')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أدوات المسوق</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">الذكاء الاصطناعي</div>
              <p className="text-xs text-muted-foreground mt-1">تحسين الوصف، إنشاء حملات، وتحليل المتجر</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
              <CardDescription>أفضل المنتجات من حيث المبيعات</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((item, index) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.soldQuantity} قطعة •{" "}
                        {item.revenue.toLocaleString()} ج.م
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.product.price} ج.م
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الحديثة</CardTitle>
              <CardDescription>آخر الطلبات المستلمة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {order.total} ج.م
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  عرض جميع الطلبات
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
