/**
 * Affiliate Marketing Tools Dashboard
 * أدوات التسويق الاحترافية للمسوقين
 */

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Link2, QrCode, BarChart3, Share2, TrendingUp } from 'lucide-react';
import { LinkShortener } from '@/components/affiliate/LinkShortener';
import { QRCodeGenerator } from '@/components/affiliate/QRCodeGenerator';
import { UTMBuilder } from '@/components/affiliate/UTMBuilder';
import { SocialShareTool } from '@/components/affiliate/SocialShareTool';

export default function AffiliateTools() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Sparkles className="h-10 w-10 text-blue-600" />
            أدوات التسويق الاحترافية
          </h1>
          <p className="text-gray-600 text-lg">
            كل ما تحتاجه لتسويق منتجاتك بشكل احترافي وفعال
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">الروابط المختصرة</p>
                  <p className="text-2xl font-bold text-blue-600">247</p>
                </div>
                <Link2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">رموز QR</p>
                  <p className="text-2xl font-bold text-green-600">132</p>
                </div>
                <QrCode className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المشاركات</p>
                  <p className="text-2xl font-bold text-purple-600">1.2K</p>
                </div>
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">معدل التحويل</p>
                  <p className="text-2xl font-bold text-orange-600">3.8%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools Tabs */}
        <Tabs defaultValue="shortener" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="shortener" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              اختصار الروابط
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              رمز QR
            </TabsTrigger>
            <TabsTrigger value="utm" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              UTM Builder
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              المشاركة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shortener">
            <LinkShortener />
          </TabsContent>

          <TabsContent value="qr">
            <QRCodeGenerator />
          </TabsContent>

          <TabsContent value="utm">
            <UTMBuilder />
          </TabsContent>

          <TabsContent value="social">
            <SocialShareTool />
          </TabsContent>
        </Tabs>

        {/* Tips Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-blue-900">💡 نصيحة اليوم</h3>
              <p className="text-sm text-gray-700">
                استخدم روابط UTM لتتبع أداء كل حملة تسويقية بشكل منفصل وقم بتحليل النتائج لتحسين استراتيجيتك
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-green-900">🎯 أفضل ممارسة</h3>
              <p className="text-sm text-gray-700">
                اختصر روابطك قبل مشاركتها على السوشيال ميديا لتحصل على مظهر احترافي وإحصائيات دقيقة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3 text-purple-900">📊 إحصائية مهمة</h3>
              <p className="text-sm text-gray-700">
                المسوقون الذين يستخدمون رموز QR يحصلون على 40% المزيد من التفاعل مع حملاتهم التسويقية
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
