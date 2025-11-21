import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AdminFinancialReports() {
  const [stats, setStats] = useState({
    revenue: 0,
    commissions: 0,
    ads: 0,
    subscriptions: 0,
    revenueGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFinancialStats();
  }, []);

  const loadFinancialStats = async () => {
    try {
      setIsLoading(true);

      // Fetch all orders to calculate total revenue
      // In a real production app, you would use Appwrite Functions for aggregation
      // or fetch only necessary fields/timeframes
      const orders = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        [
          Query.limit(1000), // Limit to last 1000 orders for now
          Query.orderDesc('$createdAt')
        ]
      );

      let totalRevenue = 0;
      let currentMonthRevenue = 0;
      let lastMonthRevenue = 0;

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      orders.documents.forEach((order: any) => {
        const amount = order.totalAmount || 0;
        totalRevenue += amount;

        const orderDate = new Date(order.$createdAt);
        if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
          currentMonthRevenue += amount;
        } else if (orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear) {
          lastMonthRevenue += amount;
        }
      });

      // Calculate growth
      const growth = lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 100;

      // Estimate commissions (e.g., 10% of revenue)
      const commissions = totalRevenue * 0.10;

      setStats({
        revenue: currentMonthRevenue, // Show current month revenue in the card
        commissions: commissions,
        ads: 0, // Placeholder
        subscriptions: 0, // Placeholder
        revenueGrowth: Math.round(growth)
      });

    } catch (error) {
      console.error('Error loading financial stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">التقارير المالية</h1>
        <p className="text-muted-foreground">
          عرض وتصدير التقارير المالية المفصلة
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إيرادات الشهر الحالي</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${stats.revenue.toLocaleString()} ج.م`}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueGrowth > 0 ? '+' : ''}{stats.revenueGrowth}% عن الشهر السابق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العمولات المتوقعة</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${stats.commissions.toLocaleString()} ج.م`}
            </div>
            <p className="text-xs text-muted-foreground">10% من إجمالي المبيعات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الإعلانات</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ads.toLocaleString()} ج.م</div>
            <p className="text-xs text-muted-foreground">إيرادات الإعلانات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الاشتراكات</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subscriptions.toLocaleString()} ج.م</div>
            <p className="text-xs text-muted-foreground">اشتراكات التجار</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>التقارير الشهرية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[0, 1, 2].map((offset) => {
              const date = new Date();
              date.setMonth(date.getMonth() - offset);
              return (
                <Button key={offset} variant="outline" className="w-full justify-between">
                  <span>تقرير {format(date, 'MMMM yyyy', { locale: ar })}</span>
                  <Download className="h-4 w-4" />
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تقارير مخصصة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                اختر نطاق تاريخي وأنشئ تقرير مخصص
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                إنشاء تقرير جديد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>ملاحظة:</strong> يمكنك الوصول إلى التقارير المالية التفصيلية من صفحة{' '}
              <a href="/#/admin/financial" className="underline font-semibold">
                النظام المالي
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
