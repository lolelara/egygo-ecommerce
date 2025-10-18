/**
 * Advanced Reports Generator Component
 * Generate custom reports with PDF/Excel export
 */

import { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

interface ReportData {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  topProducts: Array<{ name: string; sales: number }>;
  salesByCategory: Array<{ category: string; amount: number }>;
  conversionRate: number;
}

interface AdvancedReportsProps {
  onGenerateReport: (config: ReportConfig) => void;
  className?: string;
}

interface ReportConfig {
  type: string;
  dateRange: string;
  format: string;
}

export function AdvancedReports({ onGenerateReport, className }: AdvancedReportsProps) {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('7days');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock data for preview
  const [previewData] = useState<ReportData>({
    totalSales: 125430.50,
    totalOrders: 342,
    totalCustomers: 289,
    totalProducts: 156,
    topProducts: [
      { name: 'أيفون 15 برو', sales: 45000 },
      { name: 'سامسونج جالاكسي S24', sales: 32000 },
      { name: 'لابتوب HP', sales: 28000 },
    ],
    salesByCategory: [
      { category: 'موبايلات', amount: 75000 },
      { category: 'إلكترونيات', amount: 30000 },
      { category: 'أجهزة كمبيوتر', amount: 20430.50 },
    ],
    conversionRate: 68.5,
  });

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setShowPreview(false);

    const config: ReportConfig = {
      type: reportType,
      dateRange,
      format: exportFormat,
    };

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
      onGenerateReport(config);
    }, 2000);
  };

  const handleDownload = () => {
    // Simulate download
    const filename = `report_${reportType}_${dateRange}.${exportFormat}`;
    console.log(`Downloading: ${filename}`);
    // In real implementation, trigger actual download
  };

  return (
    <div className={className}>
      <EnhancedCard>
        <EnhancedCardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">مولد التقارير المتقدم</h2>
          </div>

          {/* Report Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Report Type */}
            <div>
              <Label className="mb-2 block">نوع التقرير</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>تقرير المبيعات</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="orders">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span>تقرير الطلبات</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="customers">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>تقرير العملاء</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="products">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>تقرير المنتجات</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Label className="mb-2 block">الفترة الزمنية</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="7days">آخر 7 أيام</SelectItem>
                  <SelectItem value="30days">آخر 30 يوم</SelectItem>
                  <SelectItem value="90days">آخر 3 أشهر</SelectItem>
                  <SelectItem value="year">السنة الحالية</SelectItem>
                  <SelectItem value="custom">تخصيص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Export Format */}
            <div>
              <Label className="mb-2 block">صيغة التصدير</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex-1"
              size="lg"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإنشاء...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  إنشاء التقرير
                </span>
              )}
            </Button>

            {showPreview && (
              <Button
                onClick={handleDownload}
                variant="outline"
                size="lg"
              >
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </Button>
            )}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Report Preview */}
      {showPreview && (
        <div className="mt-6 space-y-4 animate-fade-in-up">
          <h3 className="text-lg font-bold">معاينة التقرير</h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <EnhancedCard>
              <EnhancedCardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">إجمالي المبيعات</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  <AnimatedCounter 
                    value={previewData.totalSales}
                    prefix="EGP "
                    decimals={2}
                  />
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard>
              <EnhancedCardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">عدد الطلبات</span>
                </div>
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={previewData.totalOrders} />
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard>
              <EnhancedCardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">العملاء</span>
                </div>
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={previewData.totalCustomers} />
                </div>
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard>
              <EnhancedCardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">معدل التحويل</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {previewData.conversionRate}%
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          </div>

          {/* Top Products */}
          <EnhancedCard>
            <EnhancedCardContent className="p-6">
              <h4 className="font-bold mb-4">أفضل المنتجات مبيعاً</h4>
              <div className="space-y-3">
                {previewData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        EGP {product.sales.toLocaleString()}
                      </div>
                    </div>
                    <ProgressIndicator
                      value={(product.sales / previewData.topProducts[0].sales) * 100}
                      color="success"
                      showLabel={false}
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>

          {/* Sales by Category */}
          <EnhancedCard>
            <EnhancedCardContent className="p-6">
              <h4 className="font-bold mb-4">المبيعات حسب الفئة</h4>
              <div className="space-y-3">
                {previewData.salesByCategory.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-sm text-muted-foreground">
                        EGP {item.amount.toLocaleString()}
                      </span>
                    </div>
                    <ProgressIndicator
                      value={(item.amount / previewData.totalSales) * 100}
                      color="default"
                      showLabel={false}
                    />
                  </div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
      )}
    </div>
  );
}

export default AdvancedReports;
