import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "recharts";
import {
  TrendingUp,
  Eye,
  ShoppingCart,
  DollarSign,
  Calendar,
  Award,
  Target,
  Activity,
} from "lucide-react";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

export default function AffiliateAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("7days");

  // Fetch affiliate's links
  const { data: affiliateLinks = [], isLoading } = useQuery({
    queryKey: ["affiliate-links", user?.$id],
    queryFn: async () => {
      if (!user?.$id) return [];
      const response = await databases.listDocuments(
        DATABASE_ID,
        "affiliate_links",
        [Query.equal("affiliateId", user.$id), Query.orderDesc("$createdAt")]
      );
      return response.documents;
    },
    enabled: !!user?.$id,
  });

  // Calculate statistics
  const stats = {
    totalClicks: affiliateLinks.reduce(
      (sum: number, link: any) => sum + (link.clicks || 0),
      0
    ),
    totalConversions: affiliateLinks.reduce(
      (sum: number, link: any) => sum + (link.conversions || 0),
      0
    ),
    totalRevenue: affiliateLinks.reduce(
      (sum: number, link: any) => sum + (link.revenue || 0),
      0
    ),
    totalLinks: affiliateLinks.length,
    avgConversionRate:
      affiliateLinks.length > 0
        ? (
            affiliateLinks.reduce((sum: number, link: any) => {
              const rate =
                link.clicks > 0 ? (link.conversions / link.clicks) * 100 : 0;
              return sum + rate;
            }, 0) / affiliateLinks.length
          ).toFixed(2)
        : "0.00",
  };

  // Prepare chart data - Daily performance (last 7 days)
  const getDailyData = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
      });
      
      // Simulate data - in real app, fetch from database with date filters
      days.push({
        date: dateStr,
        clicks: Math.floor(Math.random() * 50) + 10,
        conversions: Math.floor(Math.random() * 10),
        revenue: Math.floor(Math.random() * 500) + 100,
      });
    }
    return days;
  };

  // Top performing links
  const topLinks = [...affiliateLinks]
    .sort((a: any, b: any) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5)
    .map((link: any) => ({
      linkCode: link.linkCode,
      clicks: link.clicks || 0,
      conversions: link.conversions || 0,
      revenue: link.revenue || 0,
    }));

  // Conversion funnel data
  const funnelData = [
    { name: "النقرات", value: stats.totalClicks, fill: "#f97316" },
    { name: "التحويلات", value: stats.totalConversions, fill: "#10b981" },
  ];

  if (!user?.isAffiliate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">هذه الصفحة للمسوقين فقط</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              يجب أن يكون حسابك مفعّلاً كحساب مسوق للوصول إلى لوحة التحليلات والإحصائيات
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/update-affiliate-prefs")}>
                تفعيل حساب المسوق
              </Button>
              <Button variant="outline" onClick={() => navigate("/affiliate")}>
                معرفة المزيد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة التحليلات</h1>
        <p className="text-muted-foreground">
          تابع أداء حملاتك التسويقية بالتفصيل
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4" />
              إجمالي النقرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              من {stats.totalLinks} رابط نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              إجمالي التحويلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalConversions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              معدل التحويل {stats.avgConversionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              إجمالي العمولات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats.totalRevenue.toFixed(2)} جنيه
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط {(stats.totalRevenue / (stats.totalConversions || 1)).toFixed(2)} لكل تحويل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              معدل التحويل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.avgConversionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط جميع الروابط
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">الأداء اليومي</TabsTrigger>
          <TabsTrigger value="top-links">أفضل الروابط</TabsTrigger>
          <TabsTrigger value="funnel">مسار التحويل</TabsTrigger>
        </TabsList>

        {/* Daily Performance Chart */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>الأداء اليومي - آخر 7 أيام</CardTitle>
              <CardDescription>
                تتبع النقرات والتحويلات والعمولات يومياً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getDailyData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="النقرات"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="conversions"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="التحويلات"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="العمولة (جنيه)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Links Chart */}
        <TabsContent value="top-links">
          <Card>
            <CardHeader>
              <CardTitle>أفضل 5 روابط أداءً</CardTitle>
              <CardDescription>
                الروابط التي حققت أعلى عمولات
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topLinks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  لا توجد بيانات كافية لعرض الرسم البياني
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={topLinks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="linkCode" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="clicks"
                      fill="#f97316"
                      name="النقرات"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="conversions"
                      fill="#10b981"
                      name="التحويلات"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="العمولة"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conversion Funnel */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>مسار التحويل</CardTitle>
              <CardDescription>
                تحليل رحلة العميل من النقرة إلى الشراء
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={funnelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Funnel Stats */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">النقرات</span>
                      <Badge variant="outline">{stats.totalClicks}</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">التحويلات</span>
                      <Badge variant="outline">{stats.totalConversions}</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${
                            stats.totalClicks > 0
                              ? (stats.totalConversions / stats.totalClicks) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span className="font-semibold">معدل التحويل</span>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {stats.avgConversionRate}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.totalClicks > 0
                        ? `${stats.totalConversions} من ${stats.totalClicks} نقرة أصبحت عملية شراء`
                        : "لا توجد بيانات بعد"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            نصائح لتحسين الأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • معدل تحويل أعلى من 5% يُعتبر ممتاز - استمر بهذا الأداء!
          </p>
          <p className="text-sm">
            • ركز على الروابط ذات الأداء الأفضل وأنشئ المزيد من المحتوى حولها
          </p>
          <p className="text-sm">
            • جرب أوقات نشر مختلفة لمعرفة متى يكون جمهورك أكثر نشاطاً
          </p>
          <p className="text-sm">
            • استخدم البانرات والأدوات التسويقية لزيادة النقرات
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
