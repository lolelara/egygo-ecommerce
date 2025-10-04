import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users,
  Download, Calendar, Loader2
} from 'lucide-react';
import {
  getDailySales,
  getProductPerformance,
  getOrderStatusDistribution,
  getUserGrowth,
  getAnalyticsSummary,
  getRevenueByCategory,
  type DailySalesData,
  type ProductPerformance,
  type OrderStatusDistribution,
  type UserGrowthData,
  type AnalyticsSummary
} from '@/lib/analytics-api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState(30);

  // Data states
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailySales, setDailySales] = useState<DailySalesData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [orderDistribution, setOrderDistribution] = useState<OrderStatusDistribution[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [revenueByCategory, setRevenueByCategory] = useState<{ category: string; revenue: number }[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        summaryData,
        salesData,
        productsData,
        ordersData,
        usersData,
        categoryData
      ] = await Promise.all([
        getAnalyticsSummary(),
        getDailySales(dateRange),
        getProductPerformance(10),
        getOrderStatusDistribution(),
        getUserGrowth(dateRange),
        getRevenueByCategory()
      ]);

      setSummary(summaryData);
      setDailySales(salesData);
      setProductPerformance(productsData);
      setOrderDistribution(ordersData);
      setUserGrowth(usersData);
      setRevenueByCategory(categoryData);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('فشل تحميل البيانات. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export using jspdf
    alert('سيتم إضافة تصدير PDF قريباً');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir="rtl">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[350px] w-full" />
          </CardContent>
        </Card>

        {/* Two Column Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* More Charts */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Button onClick={loadAnalytics}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
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

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalRevenue.toFixed(2)} ج.م</div>
              <div className="flex items-center text-sm">
                {summary.revenueGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={summary.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(summary.revenueGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground mr-1">عن الفترة السابقة</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <ShoppingCart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalOrders}</div>
              <div className="flex items-center text-sm">
                {summary.ordersGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 ml-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
                )}
                <span className={summary.ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(summary.ordersGrowth).toFixed(1)}%
                </span>
                <span className="text-muted-foreground mr-1">عن الفترة السابقة</span>
              </div>
            </CardContent>
          </Card>

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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.avgOrderValue.toFixed(2)} ج.م</div>
              <p className="text-sm text-muted-foreground">لكل طلب</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Chart */}
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

      {/* Product Performance & Order Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Performance */}
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

        {/* Order Status Distribution */}
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
                  outerRadius={100}
                  label={(entry) => `${entry.status}: ${entry.count}`}
                >
                  {orderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {orderDistribution.map((item, index) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full ml-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <Badge variant="secondary">{item.percentage.toFixed(1)}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle>نمو المستخدمين</CardTitle>
          <CardDescription>تتبع نمو قاعدة المستخدمين</CardDescription>
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
                dataKey="totalUsers"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
                name="إجمالي المستخدمين"
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.6}
                name="مستخدمين جدد"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <CardTitle>الإيرادات حسب الفئة</CardTitle>
          <CardDescription>توزيع الإيرادات على الفئات المختلفة</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="الإيرادات (ج.م)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
