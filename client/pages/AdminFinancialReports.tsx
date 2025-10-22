/**
 * Admin Financial Reports Page
 * Generate and view financial reports
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export default function AdminFinancialReports() {
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
            <CardTitle className="text-sm font-medium">إيرادات الشهر</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125,000 ج.م</div>
            <p className="text-xs text-muted-foreground">+12% عن الشهر السابق</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">العمولات</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,500 ج.م</div>
            <p className="text-xs text-muted-foreground">من الطلبات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الإعلانات</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,000 ج.م</div>
            <p className="text-xs text-muted-foreground">إيرادات الإعلانات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الاشتراكات</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,000 ج.م</div>
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
            <Button variant="outline" className="w-full justify-between">
              <span>تقرير أكتوبر 2025</span>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>تقرير سبتمبر 2025</span>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>تقرير أغسطس 2025</span>
              <Download className="h-4 w-4" />
            </Button>
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
