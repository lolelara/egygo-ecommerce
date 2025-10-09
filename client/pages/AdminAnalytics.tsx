"use client";
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
import { Skeleton } from "@/components/ui/skeleton";
import { PageSkeleton, DashboardStatsSkeleton } from "@/components/LoadingSkeletons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Download,
} from "lucide-react";
import {
  getDailySales,
  getProductPerformance,
  getOrderStatusDistribution,
  getUserGrowth,
  getAnalyticsSummary,
  type DailySalesData,
  type ProductPerformance,
  type OrderStatusDistribution,
  type UserGrowthData,
  type AnalyticsSummary,
} from "@/lib/analytics-api";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailySales, setDailySales] = useState<DailySalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [orderDistribution, setOrderDistribution] = useState<OrderStatusDistribution[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<
    { category: string; revenue: number }[]
  >([]);

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line
  }, [dateRange]);

  async function loadAnalytics() {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, salesData, productsData, ordersData, usersData] =
        await Promise.all([
          getAnalyticsSummary(),
          getDailySales(dateRange),
          getProductPerformance(dateRange),
          getOrderStatusDistribution(),
          getUserGrowth(dateRange),
        ]);

      setSummary(summaryData);
      setDailySales(salesData);
      setProductPerformance(productsData);
      setOrderDistribution(ordersData);
      setUserGrowth(usersData);
      // يمكنك هنا إضافة getRevenueByCategory لاحقًا
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }

  const exportToPDF = () => {
    alert("سيتم إضافة تصدير PDF قريباً");
  };

  // 🟡 عرض شاشة التحميل
  if (loading) {
    return (
      <PageSkeleton>
        <DashboardStatsSkeleton count={4} />
      </PageSkeleton>
    );
  }

  // 🔴 عرض الخطأ
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Button onClick={loadAnalytics}>إعادة المحاولة</Button>
      </div>
    );
  }

  // ✅ المحتوى الرئيسي
  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحليلات المتقدمة</h1>
          <p className="text-muted-foreground">نظرة شاملة على أداء المتجر</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg"
          >
            <option value={7}>آخر 7 أيام</option>
            <option value={30}>آخر 30 يوم</option>
            <option value={90}>آخر 90 يوم</option>
          </select>
          <Button onClick={exportToPDF} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير PDF
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* المستخدمين */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalUsers}</div>
              {summary.revenueGrowth !== undefined && (
                <div className="flex items-center text-sm">
                  {summary.revenueGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                  )}
                  <span
                    className={
                      summary.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {Math.abs(summary.revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground mr-1">عن الفترة السابقة</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* الطلبات */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalOrders}</div>
              {summary.ordersGrowth !== undefined && (
                <div className="flex items-center text-sm">
                  {summary.ordersGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                  )}
                  <span
                    className={
                      summary.ordersGrowth >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {Math.abs(summary.ordersGrowth).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground mr-1">عن الفترة السابقة</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* المنتجات */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalProducts}</div>
              <p className="text-sm text-muted-foreground">منتج متاح</p>
            </CardContent>
          </Card>

          {/* متوسط قيمة الطلب */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {summary.avgOrderValue.toFixed(2)} ج.م
              </div>
              <p className="text-sm text-muted-foreground">لكل طلب</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* المبيعات اليومية */}
      <Card>
        <CardHeader>
          <CardTitle>المبيعات اليومية</CardTitle>
          <CardDescription>تتبع الإيرادات والطلبات بمرور الوقت</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="left" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                name="الإيرادات (ج.م)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#10b981"
                name="عدد الطلبات"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* أداء المنتجات + توزيع الطلبات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* أداء المنتجات */}
        <Card>
          <CardHeader>
            <CardTitle>أداء المنتجات</CardTitle>
            <CardDescription>أفضل 10 منتجات مبيعاً</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRevenue" fill="#3b82f6" name="الإيرادات (ج.م)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* توزيع حالة الطلبات */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالة الطلبات</CardTitle>
            <CardDescription>نظرة عامة على حالات الطلبات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {orderDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {orderDistribution.map((item, index) => (
                <Badge
                  key={item.status}
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                >
                  {item.status}: {item.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نمو المستخدمين */}
      <Card>
        <CardHeader>
          <CardTitle>نمو المستخدمين</CardTitle>
          <CardDescription>عدد المستخدمين الجدد بمرور الوقت</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                fill="#3b82f6"
                name="المستخدمون الجدد"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
