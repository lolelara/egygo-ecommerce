import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Users,
  Loader2,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from "date-fns";
import { ar } from "date-fns/locale";

interface ReportData {
  type: string;
  dateRange: { from: Date; to: Date };
  platformEarnings?: number;
  totalWithdrawals?: number;
  totalMerchantPayments?: number;
  netRevenue?: number;
  withdrawalsCount?: number;
  paymentsCount?: number;
  affiliateCommissions?: number;
  merchantEarnings?: number;
  avgWithdrawal?: number;
  avgPayment?: number;
}

export default function FinancialReportsPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState<'platform' | 'commissions' | 'withdrawals' | 'merchant-payments'>('platform');
  const [timePeriod, setTimePeriod] = useState<'thisMonth' | 'lastMonth' | 'thisYear' | 'custom'>('thisMonth');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const getDateRange = () => {
    const now = new Date();
    switch (timePeriod) {
      case 'thisMonth':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
      case 'thisYear':
        return { from: startOfYear(now), to: endOfYear(now) };
      default:
        return { from: startOfMonth(now), to: endOfMonth(now) };
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const dateRange = getDateRange();
      const fromDate = dateRange.from.toISOString();
      const toDate = dateRange.to.toISOString();

      if (reportType === 'platform') {
        // Platform earnings report
        const [withdrawals, merchantPayments] = await Promise.all([
          databases.listDocuments(appwriteConfig.databaseId, 'withdrawalRequests', [
            Query.equal('status', 'completed'),
            Query.greaterThanEqual('$createdAt', fromDate),
            Query.lessThanEqual('$createdAt', toDate),
            Query.limit(1000)
          ]),
          databases.listDocuments(appwriteConfig.databaseId, 'merchantPayments', [
            Query.equal('status', 'verified'),
            Query.greaterThanEqual('$createdAt', fromDate),
            Query.lessThanEqual('$createdAt', toDate),
            Query.limit(1000)
          ])
        ]);

        const totalWithdrawals = withdrawals.documents.reduce((sum: number, w: any) => sum + (w.amount || 0), 0);
        const totalPlatformRevenue = merchantPayments.documents.reduce((sum: number, p: any) => sum + (p.platformFee || 0), 0);
        const totalMerchantPayments = merchantPayments.documents.reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0);
        const affiliateCommissions = merchantPayments.documents.reduce((sum: number, p: any) => sum + (p.commissionAmount || 0), 0);

        setReportData({
          type: 'platform',
          dateRange,
          platformEarnings: totalPlatformRevenue,
          totalWithdrawals,
          totalMerchantPayments,
          netRevenue: totalPlatformRevenue - totalWithdrawals,
          withdrawalsCount: withdrawals.total,
          paymentsCount: merchantPayments.total,
          affiliateCommissions,
          merchantEarnings: totalMerchantPayments - totalPlatformRevenue - affiliateCommissions,
          avgWithdrawal: withdrawals.total > 0 ? totalWithdrawals / withdrawals.total : 0,
          avgPayment: merchantPayments.total > 0 ? totalPlatformRevenue / merchantPayments.total : 0
        });
      } else if (reportType === 'withdrawals') {
        // Withdrawals report
        const withdrawals = await databases.listDocuments(
          appwriteConfig.databaseId,
          'withdrawalRequests',
          [
            Query.greaterThanEqual('$createdAt', fromDate),
            Query.lessThanEqual('$createdAt', toDate),
            Query.limit(1000)
          ]
        );

        const completed = withdrawals.documents.filter((w: any) => w.status === 'completed');
        const pending = withdrawals.documents.filter((w: any) => w.status === 'pending');
        const rejected = withdrawals.documents.filter((w: any) => w.status === 'rejected');

        const totalCompleted = completed.reduce((sum: number, w: any) => sum + (w.amount || 0), 0);
        const totalPending = pending.reduce((sum: number, w: any) => sum + (w.amount || 0), 0);

        setReportData({
          type: 'withdrawals',
          dateRange,
          totalWithdrawals: totalCompleted,
          withdrawalsCount: withdrawals.total,
          platformEarnings: totalPending,
          netRevenue: completed.length,
          paymentsCount: pending.length,
          affiliateCommissions: rejected.length
        });
      } else if (reportType === 'merchant-payments') {
        // Merchant payments report
        const payments = await databases.listDocuments(
          appwriteConfig.databaseId,
          'merchantPayments',
          [
            Query.greaterThanEqual('$createdAt', fromDate),
            Query.lessThanEqual('$createdAt', toDate),
            Query.limit(1000)
          ]
        );

        const verified = payments.documents.filter((p: any) => p.status === 'verified');
        const pending = payments.documents.filter((p: any) => p.status === 'pending');

        const totalRevenue = verified.reduce((sum: number, p: any) => sum + (p.platformFee || 0), 0);
        const totalPending = pending.reduce((sum: number, p: any) => sum + (p.platformFee || 0), 0);

        setReportData({
          type: 'merchant-payments',
          dateRange,
          platformEarnings: totalRevenue,
          totalMerchantPayments: verified.reduce((sum: number, p: any) => sum + (p.totalAmount || 0), 0),
          netRevenue: totalPending,
          paymentsCount: payments.total,
          withdrawalsCount: verified.length,
          affiliateCommissions: pending.length
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    if (!reportData) return;

    // Create CSV data
    let csvContent = '';
    
    if (reportData.type === 'platform') {
      csvContent = `تقرير أرباح المنصة\n`;
      csvContent += `الفترة,${format(reportData.dateRange.from, 'PPP', { locale: ar })} - ${format(reportData.dateRange.to, 'PPP', { locale: ar })}\n\n`;
      csvContent += `المؤشر,القيمة\n`;
      csvContent += `إيرادات المنصة,${reportData.platformEarnings?.toFixed(2)} ج.م\n`;
      csvContent += `إجمالي السحوبات,${reportData.totalWithdrawals?.toFixed(2)} ج.م\n`;
      csvContent += `صافي الربح,${reportData.netRevenue?.toFixed(2)} ج.م\n`;
      csvContent += `عدد المدفوعات,${reportData.paymentsCount}\n`;
      csvContent += `عدد السحوبات,${reportData.withdrawalsCount}\n`;
      csvContent += `عمولات المسوقين,${reportData.affiliateCommissions?.toFixed(2)} ج.م\n`;
      csvContent += `أرباح التجار,${reportData.merchantEarnings?.toFixed(2)} ج.م\n`;
    }

    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      generateReport();
    }
  }, [reportType, timePeriod]);

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">غير مصرح</h3>
            <p className="text-muted-foreground">هذه الصفحة متاحة للأدمن فقط</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">📊 التقارير المالية</h1>
        <p className="text-muted-foreground">
          تقارير شاملة عن الأداء المالي للمنصة
        </p>
      </div>

      {/* Report Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>إعدادات التقرير</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>نوع التقرير</Label>
              <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">💰 تقرير أرباح المنصة</SelectItem>
                  <SelectItem value="commissions">💵 تقرير عمولات المسوقين</SelectItem>
                  <SelectItem value="withdrawals">💸 تقرير طلبات السحب</SelectItem>
                  <SelectItem value="merchant-payments">🏪 تقرير مدفوعات التجار</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الفترة الزمنية</Label>
              <Select value={timePeriod} onValueChange={(v: any) => setTimePeriod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisMonth">📅 هذا الشهر</SelectItem>
                  <SelectItem value="lastMonth">📆 الشهر الماضي</SelectItem>
                  <SelectItem value="thisYear">🗓️ هذه السنة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button onClick={generateReport} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BarChart3 className="mr-2 h-4 w-4" />}
              تحديث التقرير
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData && (
        <>
          {/* Export Buttons */}
          <div className="flex gap-2 mb-6 justify-end">
            <Button size="sm" variant="outline" onClick={() => exportReport('csv')}>
              <Download className="mr-2 h-4 w-4" /> تصدير CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportReport('excel')}>
              <Download className="mr-2 h-4 w-4" /> تصدير Excel
            </Button>
            <Button size="sm" variant="outline" onClick={() => exportReport('pdf')}>
              <Download className="mr-2 h-4 w-4" /> تصدير PDF
            </Button>
          </div>

          {/* Stats Cards */}
          {reportData.type === 'platform' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">إيرادات المنصة</p>
                        <p className="text-2xl font-bold text-green-600">
                          {reportData.platformEarnings?.toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">إجمالي السحوبات</p>
                        <p className="text-2xl font-bold text-red-600">
                          {reportData.totalWithdrawals?.toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">صافي الربح</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {reportData.netRevenue?.toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">عدد المدفوعات</p>
                    <p className="text-3xl font-bold">{reportData.paymentsCount}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">عدد السحوبات</p>
                    <p className="text-3xl font-bold">{reportData.withdrawalsCount}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">متوسط السحب</p>
                    <p className="text-xl font-bold">{reportData.avgWithdrawal?.toFixed(2)} ج.م</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">متوسط الدفع</p>
                    <p className="text-xl font-bold">{reportData.avgPayment?.toFixed(2)} ج.م</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>التفاصيل الكاملة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="font-medium">إجمالي مدفوعات التجار</span>
                      <span className="font-bold text-lg">{reportData.totalMerchantPayments?.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="font-medium">عمولات المسوقين</span>
                      <span className="font-bold text-lg text-orange-600">{reportData.affiliateCommissions?.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="font-medium">أرباح التجار</span>
                      <span className="font-bold text-lg text-purple-600">{reportData.merchantEarnings?.toFixed(2)} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-200">
                      <span className="font-bold text-lg">رسوم المنصة (10%)</span>
                      <span className="font-bold text-2xl text-green-600">{reportData.platformEarnings?.toFixed(2)} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Period Info */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">فترة التقرير</p>
                  <p className="font-bold">
                    {format(reportData.dateRange.from, 'PPP', { locale: ar })} - {format(reportData.dateRange.to, 'PPP', { locale: ar })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
