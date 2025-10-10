import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Eye, 
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface AffiliateStatsProps {
  affiliateId: string;
}

export default function AffiliateStats({ affiliateId }: AffiliateStatsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState({
    totalEarnings: 12450,
    totalClicks: 3420,
    totalSales: 156,
    conversionRate: 4.56,
    pendingEarnings: 2340,
    availableBalance: 10110
  });

  // Sample data for charts
  const earningsData = [
    { date: '1 يناير', earnings: 450, clicks: 120, sales: 5 },
    { date: '5 يناير', earnings: 680, clicks: 180, sales: 8 },
    { date: '10 يناير', earnings: 520, clicks: 150, sales: 6 },
    { date: '15 يناير', earnings: 890, clicks: 240, sales: 11 },
    { date: '20 يناير', earnings: 1200, clicks: 320, sales: 15 },
    { date: '25 يناير', earnings: 950, clicks: 280, sales: 12 },
    { date: '30 يناير', earnings: 1100, clicks: 300, sales: 14 }
  ];

  const productPerformance = [
    { name: 'إلكترونيات', sales: 45, earnings: 4500 },
    { name: 'أزياء', sales: 38, earnings: 3200 },
    { name: 'منزل', sales: 28, earnings: 2100 },
    { name: 'رياضة', sales: 25, earnings: 1800 },
    { name: 'أخرى', sales: 20, earnings: 1200 }
  ];

  const conversionFunnel = [
    { stage: 'زيارات', value: 3420, color: '#8b5cf6' },
    { stage: 'نقرات', value: 890, color: '#ec4899' },
    { stage: 'إضافة للسلة', value: 320, color: '#3b82f6' },
    { stage: 'مبيعات', value: 156, color: '#10b981' }
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              إجمالي الأرباح
            </CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ${stats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-purple-700 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 ml-1" />
              +12.5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              إجمالي النقرات
            </CardTitle>
            <MousePointerClick className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {stats.totalClicks.toLocaleString()}
            </div>
            <p className="text-xs text-blue-700 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 ml-1" />
              +8.2% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              إجمالي المبيعات
            </CardTitle>
            <ShoppingCart className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {stats.totalSales}
            </div>
            <p className="text-xs text-green-700 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 ml-1" />
              +15.3% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              معدل التحويل
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {stats.conversionRate}%
            </div>
            <p className="text-xs text-orange-700 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 ml-1" />
              +2.1% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">تحليلات الأداء</h3>
          <TabsList>
            <TabsTrigger value="week">أسبوع</TabsTrigger>
            <TabsTrigger value="month">شهر</TabsTrigger>
            <TabsTrigger value="year">سنة</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>الأرباح والمبيعات</CardTitle>
              <CardDescription>تتبع أرباحك ومبيعاتك بمرور الوقت</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="earnings" 
                    stroke="#8b5cf6" 
                    fillOpacity={1} 
                    fill="url(#colorEarnings)"
                    name="الأرباح ($)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorSales)"
                    name="المبيعات"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Product Performance */}
          <Card>
            <CardHeader>
              <CardTitle>أداء المنتجات</CardTitle>
              <CardDescription>أفضل الفئات مبيعاً</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8b5cf6" name="المبيعات" />
                  <Bar dataKey="earnings" fill="#ec4899" name="الأرباح ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Clicks Trend */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه النقرات</CardTitle>
              <CardDescription>عدد النقرات على روابطك</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="النقرات"
                    dot={{ fill: '#3b82f6', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>قمع التحويل</CardTitle>
              <CardDescription>رحلة العميل من الزيارة للشراء</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversionFunnel}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ stage, value }) => `${stage}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conversionFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-900">الأرباح المعلقة</CardTitle>
            <CardDescription className="text-yellow-700">
              في انتظار تأكيد الطلبات
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-900">
              ${stats.pendingEarnings.toLocaleString()}
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              سيتم إضافتها للرصيد المتاح بعد 7 أيام
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">الرصيد المتاح</CardTitle>
            <CardDescription className="text-green-700">
              جاهز للسحب
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ${stats.availableBalance.toLocaleString()}
            </div>
            <p className="text-sm text-green-700 mt-2">
              الحد الأدنى للسحب: $50
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
