/**
 * Advanced Analytics Dashboard for Affiliates
 * لوحة تحليلات متقدمة للمسوقين
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Eye, MousePointerClick, 
  ShoppingCart, DollarSign, Target, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('7days');

  const performanceData = [
    { date: '1 نوفمبر', clicks: 120, conversions: 8, earnings: 240 },
    { date: '2 نوفمبر', clicks: 150, conversions: 12, earnings: 360 },
    { date: '3 نوفمبر', clicks: 180, conversions: 15, earnings: 450 },
    { date: '4 نوفمبر', clicks: 145, conversions: 10, earnings: 300 },
    { date: '5 نوفمبر', clicks: 200, conversions: 18, earnings: 540 },
    { date: '6 نوفمبر', clicks: 175, conversions: 14, earnings: 420 },
    { date: '7 نوفمبر', clicks: 220, conversions: 20, earnings: 600 }
  ];

  const productsData = [
    { name: 'تيشيرت قطن', value: 35, earnings: 1050 },
    { name: 'بنطلون جينز', value: 28, earnings: 980 },
    { name: 'حذاء رياضي', value: 22, earnings: 880 },
    { name: 'ساعة يد', value: 15, earnings: 600 }
  ];

  const trafficData = [
    { source: 'فيسبوك', visitors: 450, conversions: 35, rate: 7.8 },
    { source: 'إنستجرام', visitors: 380, conversions: 28, rate: 7.4 },
    { source: 'واتساب', visitors: 290, conversions: 25, rate: 8.6 },
    { source: 'يوتيوب', visitors: 180, conversions: 15, rate: 8.3 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">التحليلات المتقدمة</h2>
          <p className="text-muted-foreground">تتبع أداءك بالتفصيل</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-background"
        >
          <option value="today">اليوم</option>
          <option value="7days">آخر 7 أيام</option>
          <option value="30days">آخر 30 يوم</option>
          <option value="90days">آخر 3 شهور</option>
          <option value="year">هذا العام</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي النقرات</p>
                <h3 className="text-3xl font-bold mt-2">1,190</h3>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +12.5%
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">التحويلات</p>
                <h3 className="text-3xl font-bold mt-2">97</h3>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +18.3%
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">معدل التحويل</p>
                <h3 className="text-3xl font-bold mt-2">8.15%</h3>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +0.8%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">الأرباح</p>
                <h3 className="text-3xl font-bold mt-2">2,910 ج.م</h3>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4" />
                  +25.2%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <BarChart3 className="h-4 w-4 ml-2" />
            الأداء
          </TabsTrigger>
          <TabsTrigger value="products">
            <PieChartIcon className="h-4 w-4 ml-2" />
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="traffic">
            <MousePointerClick className="h-4 w-4 ml-2" />
            مصادر الزيارات
          </TabsTrigger>
        </TabsList>

        {/* Performance Chart */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>أداء الحملات التسويقية</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fillOpacity={1} fill="url(#colorClicks)" name="النقرات" />
                  <Area type="monotone" dataKey="conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConversions)" name="التحويلات" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Chart */}
        <TabsContent value="products">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>توزيع الأرباح حسب المنتج</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={productsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أفضل المنتجات ربحاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productsData.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: COLORS[index] }}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.value}% من الإجمالي</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-green-600">{product.earnings} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Sources */}
        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>مصادر الزيارات والتحويلات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitors" fill="#3b82f6" name="الزيارات" />
                  <Bar dataKey="conversions" fill="#10b981" name="التحويلات" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-3">
                {trafficData.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                    <div>
                      <p className="font-semibold">{source.source}</p>
                      <p className="text-sm text-muted-foreground">{source.visitors} زيارة • {source.conversions} تحويل</p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-green-600">{source.rate}%</p>
                      <p className="text-xs text-muted-foreground">معدل التحويل</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
