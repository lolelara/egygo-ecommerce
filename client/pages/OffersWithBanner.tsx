/**
 * Offers Page with Rotating Banner
 * صفحة العروض مع البانر المتحرك
 */

import { useState, useEffect } from 'react';
import RotatingBanner from '@/components/banners/RotatingBanner';
import { getBannersByLocation, getBannerSettings } from '@/lib/banners-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tag, Clock, TrendingUp } from 'lucide-react';

export default function OffersWithBanner() {
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const bannersData = await getBannersByLocation('offers');
      const settingsData = await getBannerSettings('offers');
      setBanners(bannersData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  // عروض توضيحية
  const offers = [
    {
      id: 1,
      title: 'خصم 50% على جميع الملابس',
      description: 'عرض لفترة محدودة على تشكيلة الملابس الشتوية',
      discount: '50%',
      endDate: '2024-12-31',
      image: 'https://via.placeholder.com/400x200'
    },
    {
      id: 2,
      title: 'اشتري 2 واحصل على 1 مجاناً',
      description: 'على جميع الأحذية الرياضية',
      discount: 'Buy 2 Get 1',
      endDate: '2024-11-30',
      image: 'https://via.placeholder.com/400x200'
    },
    {
      id: 3,
      title: 'شحن مجاني',
      description: 'على الطلبات فوق 500 جنيه',
      discount: 'Free Shipping',
      endDate: '2024-12-15',
      image: 'https://via.placeholder.com/400x200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <div className="container mx-auto p-6 space-y-8">
        {/* البانر المتحرك */}
        {!loading && banners.length > 0 && (
          <div className="animate-in fade-in-50 duration-500">
            <RotatingBanner
              banners={banners}
              autoPlayInterval={settings?.autoPlayInterval || 5}
              showControls={settings?.showControls ?? true}
              height={settings?.height || '300px'}
              location="offers"
            />
          </div>
        )}

        {/* عنوان الصفحة */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            العروض الحالية
          </h1>
          <p className="text-muted-foreground">
            احصل على أفضل الصفقات والخصومات الحصرية
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عدد العروض</p>
                  <h3 className="text-2xl font-bold">{offers.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">أعلى خصم</p>
                  <h3 className="text-2xl font-bold">50%</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">عروض تنتهي قريباً</p>
                  <h3 className="text-2xl font-bold">2</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* قائمة العروض */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-red-500 text-white text-lg">
                  {offer.discount}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{offer.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{offer.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>ينتهي في {offer.endDate}</span>
                  </div>
                </div>
                <Button className="w-full">
                  استفد من العرض
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* تنبيه */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 نصيحة للمسوقين
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  استخدم هذه العروض في حملاتك التسويقية لزيادة معدل التحويل. 
                  العروض المحدودة بوقت تحقق أعلى نسبة مبيعات!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
