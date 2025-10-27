/**
 * Smart Product Recommender for Affiliates
 * نظام توصيات المنتجات الذكي للمسوقين
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Flame, Star, Clock, ShoppingBag, 
  Sparkles, ArrowRight, Eye, DollarSign
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  commission: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  category: string;
  season?: string;
  image?: string;
}

export default function SmartProductRecommender() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // منتجات مبنية على أداء المسوق
  const performanceBasedProducts: Product[] = [
    {
      id: '1',
      name: 'تيشيرت قطن مصري فاخر',
      price: 299,
      commission: 45,
      trend: 'up',
      trendValue: 23,
      clicks: 156,
      conversions: 18,
      conversionRate: 11.5,
      category: 'ملابس'
    },
    {
      id: '2',
      name: 'حذاء رياضي مريح',
      price: 599,
      commission: 90,
      trend: 'up',
      trendValue: 18,
      clicks: 134,
      conversions: 12,
      conversionRate: 9.0,
      category: 'أحذية'
    },
    {
      id: '3',
      name: 'شنطة جلد طبيعي',
      price: 899,
      commission: 135,
      trend: 'stable',
      trendValue: 0,
      clicks: 98,
      conversions: 8,
      conversionRate: 8.2,
      category: 'إكسسوارات'
    }
  ];

  // منتجات موسمية
  const seasonalProducts: Product[] = [
    {
      id: '4',
      name: 'جاكيت شتوي صوف',
      price: 1299,
      commission: 195,
      trend: 'up',
      trendValue: 45,
      clicks: 245,
      conversions: 28,
      conversionRate: 11.4,
      category: 'ملابس',
      season: 'شتاء'
    },
    {
      id: '5',
      name: 'بوت شتوي مقاوم للماء',
      price: 799,
      commission: 120,
      trend: 'up',
      trendValue: 38,
      clicks: 189,
      conversions: 22,
      conversionRate: 11.6,
      category: 'أحذية',
      season: 'شتاء'
    },
    {
      id: '6',
      name: 'وشاح كشمير',
      price: 399,
      commission: 60,
      trend: 'up',
      trendValue: 52,
      clicks: 167,
      conversions: 25,
      conversionRate: 15.0,
      category: 'إكسسوارات',
      season: 'شتاء'
    }
  ];

  // منتجات رائجة
  const trendingProducts: Product[] = [
    {
      id: '7',
      name: 'ساعة ذكية - موديل 2024',
      price: 1899,
      commission: 285,
      trend: 'up',
      trendValue: 67,
      clicks: 432,
      conversions: 45,
      conversionRate: 10.4,
      category: 'إلكترونيات'
    },
    {
      id: '8',
      name: 'سماعات بلوتوث لاسلكية',
      price: 599,
      commission: 90,
      trend: 'up',
      trendValue: 55,
      clicks: 378,
      conversions: 38,
      conversionRate: 10.1,
      category: 'إلكترونيات'
    },
    {
      id: '9',
      name: 'حقيبة لابتوب عملية',
      price: 499,
      commission: 75,
      trend: 'up',
      trendValue: 41,
      clicks: 298,
      conversions: 32,
      conversionRate: 10.7,
      category: 'إكسسوارات'
    }
  ];

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
            {product.trend === 'up' && (
              <Badge className="bg-green-500 text-white">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{product.trendValue}%
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">السعر</p>
              <p className="font-bold text-blue-600">{product.price} ج.م</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">عمولتك</p>
              <p className="font-bold text-green-600">{product.commission} ج.م</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">النقرات</span>
              <span className="font-semibold">{product.clicks}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">التحويلات</span>
              <span className="font-semibold">{product.conversions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">معدل التحويل</span>
              <span className="font-semibold text-green-600">{product.conversionRate}%</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button className="flex-1" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              معاينة
            </Button>
            <Button className="flex-1" variant="outline" size="sm">
              <ArrowRight className="h-4 w-4 mr-2" />
              احصل على الرابط
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500" />
            توصيات المنتجات الذكية
          </h2>
          <p className="text-muted-foreground mt-1">
            منتجات مختارة خصيصاً بناءً على أدائك وتوجهات السوق
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Flame className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                🔥 فرصة ساخنة: منتجات الشتاء الآن!
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                الطلب على الملابس الشتوية زاد بنسبة 45% خلال الأسبوع الماضي. 
                ابدأ الترويج الآن لتحقيق أقصى أرباح!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">
            <Star className="h-4 w-4 ml-2" />
            مناسبة لأدائك
          </TabsTrigger>
          <TabsTrigger value="seasonal">
            <Clock className="h-4 w-4 ml-2" />
            منتجات موسمية
          </TabsTrigger>
          <TabsTrigger value="trending">
            <Flame className="h-4 w-4 ml-2" />
            الأكثر رواجاً
          </TabsTrigger>
        </TabsList>

        {/* Performance Based */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Star className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">لماذا هذه المنتجات؟</h3>
                  <p className="text-sm text-muted-foreground">
                    بناءً على تحليل أدائك السابق، هذه المنتجات تتطابق مع نمط تسويقك الناجح.
                    معدل التحويل المتوقع: <strong className="text-blue-600">9-12%</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceBasedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        {/* Seasonal Products */}
        <TabsContent value="seasonal" className="space-y-6">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">الموسم الحالي: شتاء 2024</h3>
                  <p className="text-sm text-muted-foreground">
                    الطلب على هذه المنتجات في ذروته الآن! اغتنم الفرصة قبل نهاية الموسم.
                    متوسط الأرباح المتوقعة: <strong className="text-orange-600">150-200 ج.م/يوم</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seasonalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        {/* Trending Products */}
        <TabsContent value="trending" className="space-y-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Flame className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">المنتجات الأكثر رواجاً اليوم</h3>
                  <p className="text-sm text-muted-foreground">
                    هذه المنتجات تحقق أعلى معدلات بيع في السوق حالياً. 
                    سرعة البيع: <strong className="text-green-600">عالية جداً</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Tips Section */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-600" />
            نصائح لزيادة مبيعاتك
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>روج للمنتجات الموسمية في بداية الموسم لتحقيق أعلى الأرباح</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>استخدم المنتجات الرائجة في حملاتك الإعلانية المدفوعة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">✓</span>
              <span>ركز على المنتجات ذات معدل التحويل الأعلى في قائمتك الشخصية</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
