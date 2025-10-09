import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Edit, Trash2, Copy, Eye, TrendingUp, Users, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  description?: string;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
}

interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  totalUsage: number;
  totalSavings: number;
  topCoupons: Array<{
    code: string;
    usageCount: number;
    totalSavings: number;
  }>;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState<CouponStats>({
    totalCoupons: 0,
    activeCoupons: 0,
    totalUsage: 0,
    totalSavings: 0,
    topCoupons: []
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    usageLimit: '',
    expiresAt: '',
    description: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    isActive: true
  });

  // Load coupons data
  useEffect(() => {
    loadCoupons();
    loadStats();
  }, []);

  const loadCoupons = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCoupons: Coupon[] = [
        {
          id: '1',
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          usageLimit: 100,
          usageCount: 45,
          expiresAt: new Date('2024-12-31'),
          isActive: true,
          createdAt: new Date('2024-01-01'),
          description: 'خصم 10% للعملاء الجدد',
          minOrderAmount: 100
        },
        {
          id: '2',
          code: 'SAVE50',
          type: 'fixed',
          value: 50,
          usageLimit: 50,
          usageCount: 23,
          expiresAt: new Date('2024-11-30'),
          isActive: true,
          createdAt: new Date('2024-02-01'),
          description: 'خصم 50 جنيه على الطلبات',
          minOrderAmount: 200
        },
        {
          id: '3',
          code: 'SUMMER20',
          type: 'percentage',
          value: 20,
          usageLimit: 200,
          usageCount: 156,
          expiresAt: new Date('2024-08-31'),
          isActive: false,
          createdAt: new Date('2024-06-01'),
          description: 'عرض الصيف - خصم 20%'
        }
      ];
      setCoupons(mockCoupons);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الكوبونات",
        variant: "destructive"
      });
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats - replace with actual API call
      const mockStats: CouponStats = {
        totalCoupons: 15,
        activeCoupons: 8,
        totalUsage: 1247,
        totalSavings: 45680,
        topCoupons: [
          { code: 'SUMMER20', usageCount: 156, totalSavings: 12500 },
          { code: 'WELCOME10', usageCount: 145, totalSavings: 8900 },
          { code: 'SAVE50', usageCount: 89, totalSavings: 4450 }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCreateCoupon = async () => {
    try {
      // Validate form
      if (!formData.code || formData.value <= 0) {
        toast({
          title: "خطأ",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive"
        });
        return;
      }

      // Create coupon object
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.value,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        usageCount: 0,
        expiresAt: selectedDate,
        isActive: formData.isActive,
        createdAt: new Date(),
        description: formData.description,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined
      };

      // Add to coupons list
      setCoupons(prev => [newCoupon, ...prev]);
      
      // Reset form
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        usageLimit: '',
        expiresAt: '',
        description: '',
        minOrderAmount: '',
        maxDiscountAmount: '',
        isActive: true
      });
      setSelectedDate(undefined);
      setIsCreateDialogOpen(false);

      toast({
        title: "نجح",
        description: "تم إنشاء الكوبون بنجاح"
      });

    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الكوبون",
        variant: "destructive"
      });
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      usageLimit: coupon.usageLimit?.toString() || '',
      expiresAt: coupon.expiresAt?.toISOString().split('T')[0] || '',
      description: coupon.description || '',
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscountAmount: coupon.maxDiscountAmount?.toString() || '',
      isActive: coupon.isActive
    });
    setSelectedDate(coupon.expiresAt);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon) return;

    try {
      const updatedCoupon: Coupon = {
        ...editingCoupon,
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.value,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        expiresAt: selectedDate,
        isActive: formData.isActive,
        description: formData.description,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : undefined
      };

      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? updatedCoupon : c));
      setIsEditDialogOpen(false);
      setEditingCoupon(null);

      toast({
        title: "نجح",
        description: "تم تحديث الكوبون بنجاح"
      });

    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الكوبون",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
      toast({
        title: "نجح",
        description: "تم حذف الكوبون بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حذف الكوبون",
        variant: "destructive"
      });
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ",
      description: `تم نسخ كود الكوبون: ${code}`
    });
  };

  const getUsagePercentage = (usageCount: number, usageLimit?: number) => {
    if (!usageLimit) return 0;
    return Math.round((usageCount / usageLimit) * 100);
  };

  const isExpired = (expiresAt?: Date) => {
    if (!expiresAt) return false;
    return new Date() > expiresAt;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الكوبونات والعروض</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              إضافة كوبون جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إنشاء كوبون جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">كود الكوبون</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="مثال: WELCOME10"
                  />
                </div>
                <div>
                  <Label htmlFor="type">نوع الخصم</Label>
                  <Select value={formData.type} onValueChange={(value: 'percentage' | 'fixed') => 
                    setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">نسبة مئوية</SelectItem>
                      <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">قيمة الخصم</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                    placeholder={formData.type === 'percentage' ? '10' : '50'}
                  />
                </div>
                <div>
                  <Label htmlFor="usageLimit">حد الاستخدام</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label>تاريخ الانتهاء</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف الكوبون"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minOrderAmount">الحد الأدنى للطلب</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="maxDiscountAmount">الحد الأقصى للخصم</Label>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDiscountAmount: e.target.value }))}
                    placeholder="200"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleCreateCoupon}>
                  إنشاء الكوبون
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الكوبونات</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCoupons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الكوبونات النشطة</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCoupons}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الاستخدام</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي التوفير</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSavings.toLocaleString()} جنيه</div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الكوبونات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>كود الكوبون</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>القيمة</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>تاريخ الانتهاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">{coupon.code}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCouponCode(coupon.code)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={coupon.type === 'percentage' ? 'default' : 'secondary'}>
                      {coupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `${coupon.value} جنيه`}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {coupon.usageCount} / {coupon.usageLimit || '∞'}
                      </div>
                      {coupon.usageLimit && (
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${getUsagePercentage(coupon.usageCount, coupon.usageLimit)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                      {isExpired(coupon.expiresAt) && (
                        <Badge variant="destructive">منتهي الصلاحية</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.expiresAt ? format(coupon.expiresAt, 'dd/MM/yyyy') : 'بدون انتهاء'}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCoupon(coupon)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCoupon(coupon.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تعديل الكوبون</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Same form fields as create dialog */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleUpdateCoupon}>
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
