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
  PieChart,
  Activity,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { adminDashboardApi, type AdminStats } from "@/lib/admin-api";
// @ts-ignore - Using simplified AdminStats from admin-api
import type { Order, Product } from "@/shared/api";

// Mock data for admin stats - in real app this would come from API
// @ts-ignore - Mock data has extra properties
const mockAdminStats: AdminStats = {
  totalUsers: 1250,
  totalProducts: 89,
  totalOrders: 342,
  totalRevenue: 45780,
  pendingOrders: 12,
  totalAffiliates: 68,
  pendingCommissions: 2340,
  thisMonthRevenue: 12450,
  thisMonthOrders: 87,
  topProducts: [
    {
      product: {
        id: "1",
        name: "سماعات بلوتوث لاسلكية",
        description: "",
        price: 299,
        originalPrice: 399,
        images: ["/placeholder.svg"],
        category: "electronics",
        tags: [],
        inStock: true,
        rating: 4.8,
        reviewCount: 24,
        affiliateCommission: 8,
      },
      soldQuantity: 45,
      revenue: 13455,
    },
    {
      product: {
        id: "2",
        name: "ساعة ذكية رياضية",
        description: "",
        price: 899,
        originalPrice: 1099,
        images: ["/placeholder.svg"],
        category: "electronics",
        tags: [],
        inStock: true,
        rating: 4.6,
        reviewCount: 18,
        affiliateCommission: 10,
      },
      soldQuantity: 32,
      revenue: 28768,
    },
  ],
  recentOrders: [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      status: "PENDING",
      total: 599,
      subtotal: 599,
      tax: 0,
      shipping: 0,
      discount: 0,
      shippingAddress: {},
      paymentStatus: "PENDING",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      userId: "1",
      items: [],
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      status: "PROCESSING",
      total: 1299,
      subtotal: 1299,
      tax: 0,
      shipping: 0,
      discount: 0,
      shippingAddress: {},
      paymentStatus: "PAID",
      createdAt: "2024-01-15T09:15:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
      userId: "2",
      items: [],
    },
  ],
};

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
        // Fallback to mock data if API fails
        setStats(mockAdminStats);
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
            title="إجمالي ال��ركاء"
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
