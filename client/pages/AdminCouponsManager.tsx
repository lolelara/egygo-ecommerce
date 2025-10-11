import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { couponsAPI, type Coupon } from '@/lib/coupons-api';
import { AdminLayout } from '@/components/AdminLayout';

export default function AdminCouponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minAmount: 0,
    maxUses: 0,
    validFrom: '',
    validUntil: ''
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponsAPI.getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
      toast.error('فشل تحميل الكوبونات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.value || !formData.validFrom || !formData.validUntil) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      if (editingCoupon) {
        // Update existing coupon
        const success = await couponsAPI.updateCoupon(editingCoupon.$id, formData);
        if (success) {
          toast.success('تم تحديث الكوبون بنجاح');
        } else {
          toast.error('فشل تحديث الكوبون');
        }
      } else {
        // Create new coupon
        const coupon = await couponsAPI.createCoupon(formData);
        if (coupon) {
          toast.success('تم إنشاء الكوبون بنجاح');
        } else {
          toast.error('فشل إنشاء الكوبون');
        }
      }

      setIsDialogOpen(false);
      setEditingCoupon(null);
      resetForm();
      loadCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minAmount: coupon.minAmount || 0,
      maxUses: coupon.maxUses || 0,
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;

    try {
      const success = await couponsAPI.deleteCoupon(couponId);
      if (success) {
        toast.success('تم حذف الكوبون بنجاح');
        loadCoupons();
      } else {
        toast.error('فشل حذف الكوبون');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const handleToggleActive = async (couponId: string) => {
    try {
      const success = await couponsAPI.toggleActive(couponId);
      if (success) {
        toast.success('تم تحديث حالة الكوبون');
        loadCoupons();
      } else {
        toast.error('فشل تحديث الحالة');
      }
    } catch (error) {
      console.error('Error toggling coupon:', error);
      toast.error('حدث خطأ');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      minAmount: 0,
      maxUses: 0,
      validFrom: '',
      validUntil: ''
    });
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      return <Badge variant="secondary">معطل</Badge>;
    }

    if (now > validUntil) {
      return <Badge variant="destructive">منتهي</Badge>;
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return <Badge variant="destructive">مستخدم بالكامل</Badge>;
    }

    return <Badge className="bg-green-500">نشط</Badge>;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">إدارة الكوبونات</h1>
            <p className="text-muted-foreground">إنشاء وإدارة كوبونات الخصم</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingCoupon(null); }}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة كوبون جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCoupon ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}
                </DialogTitle>
                <DialogDescription>
                  املأ البيانات لإنشاء كوبون خصم جديد
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">كود الكوبون *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">نوع الخصم *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'percentage' | 'fixed') => 
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية %</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت ج.م</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="value">
                      قيمة الخصم * {formData.type === 'percentage' ? '(%)' : '(ج.م)'}
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="minAmount">الحد الأدنى للطلب (ج.م)</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxUses">الحد الأقصى للاستخدامات</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                      min="0"
                      placeholder="غير محدود"
                    />
                  </div>

                  <div>
                    <Label htmlFor="validFrom">صالح من *</Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="validUntil">صالح حتى *</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit">
                    {editingCoupon ? 'تحديث' : 'إنشاء'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الكوبونات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coupons.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الكوبونات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {coupons.filter(c => c.isActive && new Date(c.validUntil) > new Date()).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الكوبونات المنتهية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {coupons.filter(c => new Date(c.validUntil) < new Date()).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الاستخدامات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coupons Table */}
        <Card>
          <CardHeader>
            <CardTitle>جميع الكوبونات</CardTitle>
            <CardDescription>إدارة وتتبع كوبونات الخصم</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>لا توجد كوبونات بعد</p>
                <p className="text-sm mt-2">ابدأ بإنشاء كوبون جديد</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الكود</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>القيمة</TableHead>
                    <TableHead>الاستخدامات</TableHead>
                    <TableHead>الصلاحية</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.$id}>
                      <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                      </TableCell>
                      <TableCell>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} ج.م`}
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount} / {coupon.maxUses || '∞'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(coupon.validFrom).toLocaleDateString('ar-EG')} - {new Date(coupon.validUntil).toLocaleDateString('ar-EG')}
                      </TableCell>
                      <TableCell>{getStatusBadge(coupon)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(coupon.$id)}
                          >
                            {coupon.isActive ? (
                              <ToggleRight className="h-4 w-4 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(coupon.$id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
