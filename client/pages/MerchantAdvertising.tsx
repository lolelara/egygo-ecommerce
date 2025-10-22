import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Eye, MousePointer, DollarSign, Calendar, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { adsManager, AD_PRICES, type Advertisement } from '@/lib/ads-manager';
import { AdminLayout } from '@/components/AdminLayout';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { notifyAdCreated } from '@/lib/ad-notifications';

export default function MerchantAdvertising() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    productId: '',
    adType: 'homepage_featured' as keyof typeof AD_PRICES,
    weeks: 1,
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [merchantAds, merchantProducts] = await Promise.all([
        adsManager.getMerchantAds(user.$id),
        databases.listDocuments(DATABASE_ID, 'products', [
          Query.equal('merchantId', user.$id),
          Query.equal('status', 'approved'),
        ]),
      ]);

      setAds(merchantAds);
      setProducts(merchantProducts.documents);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل البيانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.productId) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار منتج',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const product = products.find(p => p.$id === formData.productId);
      if (!product) throw new Error('Product not found');

      const price = adsManager.calculatePrice(formData.adType, formData.weeks);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (formData.weeks * 7));

      const createdAd = await adsManager.createAd({
        merchantId: user!.$id,
        merchantName: user!.name,
        productId: product.$id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        adType: formData.adType,
        placement: 'top',
        duration: formData.weeks * 7,
        price,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'pending',
      });

      // Notify admin about new ad
      await notifyAdCreated('admin', createdAd);

      toast({
        title: 'تم الإنشاء',
        description: 'تم إنشاء الإعلان بنجاح. في انتظار الموافقة من الإدارة.',
      });

      setOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating ad:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إنشاء الإعلان',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  const getAdTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      homepage_banner: 'بانر الصفحة الرئيسية',
      homepage_featured: 'منتج مميز - الصفحة الرئيسية',
      category_top: 'أعلى صفحة التصنيف',
      search_sponsored: 'نتائج البحث المدعومة',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: 'قيد المراجعة', variant: 'secondary' },
      active: { label: 'نشط', variant: 'default' },
      expired: { label: 'منتهي', variant: 'outline' },
      rejected: { label: 'مرفوض', variant: 'destructive' },
    };
    const info = variants[status] || variants.pending;
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  const totalSpent = ads.reduce((sum, ad) => sum + ad.price, 0);
  const activeAds = ads.filter(ad => ad.status === 'active').length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">إعلانات المنتجات</h2>
            <p className="text-muted-foreground">روّج لمنتجاتك وزد مبيعاتك</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                إنشاء إعلان جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>إنشاء إعلان جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>اختر المنتج</Label>
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر منتج" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.$id} value={product.$id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>نوع الإعلان</Label>
                  <Select value={formData.adType} onValueChange={(value: any) => setFormData({ ...formData, adType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage_featured">
                        منتج مميز - الصفحة الرئيسية (300 ج.م/أسبوع)
                      </SelectItem>
                      <SelectItem value="homepage_banner">
                        بانر الصفحة الرئيسية (500 ج.م/أسبوع)
                      </SelectItem>
                      <SelectItem value="category_top">
                        أعلى صفحة التصنيف (200 ج.م/أسبوع)
                      </SelectItem>
                      <SelectItem value="search_sponsored">
                        نتائج البحث (150 ج.م/أسبوع)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>المدة (أسابيع)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.weeks}
                    onChange={(e) => setFormData({ ...formData, weeks: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">التكلفة الإجمالية:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {adsManager.calculatePrice(formData.adType, formData.weeks)} ج.م
                    </span>
                  </div>
                </div>

                <Button onClick={handleCreate} disabled={creating} className="w-full">
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 ml-2" />
                      إنشاء الإعلان
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإعلانات النشطة</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAds}</div>
              <p className="text-xs text-muted-foreground">من أصل {ads.length} إعلان</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإنفاق</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSpent.toLocaleString()} ج.م</div>
              <p className="text-xs text-muted-foreground">جميع الإعلانات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المشاهدات</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()} نقرة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ads List */}
        <Card>
          <CardHeader>
            <CardTitle>إعلاناتي</CardTitle>
            <CardDescription>جميع إعلاناتك وإحصائياتها</CardDescription>
          </CardHeader>
          <CardContent>
            {ads.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">لم تنشئ أي إعلانات بعد</p>
                <Button onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء إعلان
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div key={ad.$id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{ad.productName}</h3>
                          {getStatusBadge(ad.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{getAdTypeLabel(ad.adType)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{ad.price} ج.م</p>
                        <p className="text-xs text-muted-foreground">{ad.duration} يوم</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Eye className="h-3 w-3" />
                          <span>المشاهدات</span>
                        </div>
                        <p className="font-semibold">{ad.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <MousePointer className="h-3 w-3" />
                          <span>النقرات</span>
                        </div>
                        <p className="font-semibold">{ad.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>CTR</span>
                        </div>
                        <p className="font-semibold">
                          {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>الحالة</span>
                        </div>
                        <p className="font-semibold text-xs">
                          {new Date(ad.endDate) > new Date() ? 'نشط' : 'منتهي'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pricing Info */}
        <Card>
          <CardHeader>
            <CardTitle>الأسعار</CardTitle>
            <CardDescription>أسعار الإعلانات المختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">منتج مميز - الصفحة الرئيسية</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">300 ج.م/أسبوع</p>
                <p className="text-sm text-muted-foreground">يظهر في قسم المنتجات المميزة</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">بانر الصفحة الرئيسية</h4>
                <p className="text-2xl font-bold text-purple-600 mb-2">500 ج.م/أسبوع</p>
                <p className="text-sm text-muted-foreground">بانر كبير في أعلى الصفحة</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">أعلى صفحة التصنيف</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">200 ج.م/أسبوع</p>
                <p className="text-sm text-muted-foreground">يظهر في أعلى صفحة التصنيف</p>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">نتائج البحث المدعومة</h4>
                <p className="text-2xl font-bold text-orange-600 mb-2">150 ج.م/أسبوع</p>
                <p className="text-sm text-muted-foreground">يظهر في نتائج البحث</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
