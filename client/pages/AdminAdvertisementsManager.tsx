import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Eye, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { adsManager, type Advertisement } from '@/lib/ads-manager';

export default function AdminAdvertisementsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [filteredAds, setFilteredAds] = useState<Advertisement[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'expired' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Review Dialog
  const [reviewDialog, setReviewDialog] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');

  // Stats
  const [stats, setStats] = useState({
    pending: 0,
    active: 0,
    expired: 0,
    rejected: 0,
    totalRevenue: 0,
    activeRevenue: 0,
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAds();
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
    calculateStats();
  }, [ads, filter]);

  const loadAds = async () => {
    try {
      setLoading(true);
      const allAds = await adsManager.getMerchantAds(''); // Get all ads (admin view)
      setAds(allAds);
    } catch (error) {
      console.error('Error loading ads:', error);
      toast({
        title: 'خطأ',
        description: 'فشل تحميل الإعلانات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredAds(ads);
    } else {
      setFilteredAds(ads.filter(ad => ad.status === filter));
    }
  };

  const calculateStats = () => {
    const pending = ads.filter(ad => ad.status === 'pending').length;
    const active = ads.filter(ad => ad.status === 'active').length;
    const expired = ads.filter(ad => ad.status === 'expired').length;
    const rejected = ads.filter(ad => ad.status === 'rejected').length;
    const totalRevenue = ads.reduce((sum, ad) => sum + ad.price, 0);
    const activeRevenue = ads.filter(ad => ad.status === 'active').reduce((sum, ad) => sum + ad.price, 0);

    setStats({ pending, active, expired, rejected, totalRevenue, activeRevenue });
  };

  const openReviewDialog = (ad: Advertisement, action: 'approve' | 'reject') => {
    setSelectedAd(ad);
    setReviewAction(action);
    setRejectionReason('');
    setReviewDialog(true);
  };

  const handleReview = async () => {
    if (!selectedAd) return;

    if (reviewAction === 'reject' && !rejectionReason.trim()) {
      toast({
        title: 'خطأ',
        description: 'يجب إدخال سبب الرفض',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);

      if (reviewAction === 'approve') {
        await adsManager.approveAd(selectedAd.$id);
        toast({
          title: 'تمت الموافقة',
          description: 'تم تفعيل الإعلان بنجاح',
        });
      } else {
        await adsManager.rejectAd(selectedAd.$id, rejectionReason);
        toast({
          title: 'تم الرفض',
          description: 'تم رفض الإعلان',
        });
      }

      setReviewDialog(false);
      loadAds();
    } catch (error) {
      console.error('Error reviewing ad:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في معالجة الإعلان',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { label: '⏳ قيد المراجعة', className: 'bg-yellow-100 text-yellow-800' },
      active: { label: '✅ نشط', className: 'bg-green-100 text-green-800' },
      expired: { label: '⌛ منتهي', className: 'bg-gray-100 text-gray-800' },
      rejected: { label: '❌ مرفوض', className: 'bg-red-100 text-red-800' },
    };
    const info = variants[status] || variants.pending;
    return <Badge className={info.className}>{info.label}</Badge>;
  };

  const getAdTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      homepage_banner: 'بانر الصفحة الرئيسية',
      homepage_featured: 'منتج مميز - الرئيسية',
      category_top: 'أعلى التصنيف',
      search_sponsored: 'نتائج البحث',
    };
    return labels[type] || type;
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">غير مصرح</h3>
            <p className="text-muted-foreground">هذه الصفحة متاحة للأدمن فقط</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إدارة الإعلانات</h1>
        <p className="text-muted-foreground">مراجعة وإدارة إعلانات التجار</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الإعلانات النشطة</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات النشطة</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRevenue.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ج.م</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">الكل ({ads.length})</TabsTrigger>
              <TabsTrigger value="pending">معلق ({stats.pending})</TabsTrigger>
              <TabsTrigger value="active">نشط ({stats.active})</TabsTrigger>
              <TabsTrigger value="expired">منتهي ({stats.expired})</TabsTrigger>
              <TabsTrigger value="rejected">مرفوض ({stats.rejected})</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ads Table */}
      <Card>
        <CardContent className="p-6">
          {filteredAds.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد إعلانات</h3>
              <p className="text-muted-foreground">لا توجد إعلانات في هذه الحالة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاجر</TableHead>
                    <TableHead>المنتج</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead>المدة</TableHead>
                    <TableHead>الأداء</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAds.map((ad) => (
                    <TableRow key={ad.$id}>
                      <TableCell>
                        <div className="font-medium">{ad.merchantName}</div>
                        <div className="text-xs text-muted-foreground">{ad.merchantId.slice(0, 8)}...</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {ad.productImage && (
                            <img src={ad.productImage} alt={ad.productName} className="w-10 h-10 object-cover rounded" />
                          )}
                          <div>
                            <div className="font-medium text-sm">{ad.productName}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{getAdTypeLabel(ad.adType)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold">{ad.price} ج.م</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{ad.duration} يوم</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>👁️ {ad.impressions.toLocaleString()}</div>
                          <div>🖱️ {ad.clicks.toLocaleString()}</div>
                          <div className="font-semibold">
                            CTR: {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(ad.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {ad.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openReviewDialog(ad, 'approve')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                موافقة
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openReviewDialog(ad, 'reject')}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                رفض
                              </Button>
                            </>
                          )}
                          {ad.status !== 'pending' && (
                            <Button size="sm" variant="outline" disabled>
                              {ad.status === 'active' ? 'نشط' : ad.status === 'expired' ? 'منتهي' : 'مرفوض'}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'الموافقة على الإعلان' : 'رفض الإعلان'}
            </DialogTitle>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="font-medium mb-2">{selectedAd.productName}</div>
                <div className="text-sm text-muted-foreground">التاجر: {selectedAd.merchantName}</div>
                <div className="text-sm text-muted-foreground">النوع: {getAdTypeLabel(selectedAd.adType)}</div>
                <div className="text-sm font-bold mt-2">{selectedAd.price} ج.م لمدة {selectedAd.duration} يوم</div>
              </div>

              {reviewAction === 'reject' && (
                <div>
                  <Label>سبب الرفض *</Label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="أدخل سبب رفض الإعلان..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)} disabled={processing}>
              إلغاء
            </Button>
            <Button
              onClick={handleReview}
              disabled={processing || (reviewAction === 'reject' && !rejectionReason.trim())}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {reviewAction === 'approve' ? 'موافقة' : 'رفض'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
