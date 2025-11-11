import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  ExternalLink,
  RefreshCw,
  Settings,
  Filter,
  Check,
  Eye,
  ShoppingCart,
  Palette,
  Ruler,
  Box,
  ArrowLeft,
  DollarSign,
  Plus,
  Edit
} from 'lucide-react';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/storage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface VendoorProduct {
  $id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  totalStock: number;
  images: string[];
  colors?: string[];
  sizes?: string[];
  colorSizeInventory?: string;
  source: string;
  sourceUrl?: string;
  status: string;
  categoryId?: string;
  $createdAt: string;
}

export default function VendoorProductsNew() {
  const [products, setProducts] = useState<VendoorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPriceDialog, setShowPriceDialog] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState(10);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'set'>('add');
  const [updating, setUpdating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queries = [
        Query.equal('source', 'vendoor'),
        Query.limit(pagination.limit),
        Query.offset((pagination.page - 1) * pagination.limit),
        Query.orderDesc('$createdAt')
      ];
      
      if (statusFilter !== 'all') {
        queries.push(Query.equal('status', statusFilter));
      }

      const resp: any = await databases.listDocuments(DATABASE_ID, 'products', queries);
      const total = resp.total ?? (resp.documents?.length || 0);
      
      setProducts(resp.documents || []);
      setPagination(prev => ({
        ...prev,
        total,
        pages: Math.max(1, Math.ceil(total / prev.limit))
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('فشل تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const getInventoryCount = (product: VendoorProduct) => {
    if (!product.colorSizeInventory) return 0;
    try {
      const inventory = JSON.parse(product.colorSizeInventory);
      return Array.isArray(inventory) ? inventory.length : 0;
    } catch {
      return 0;
    }
  };

  const handleBulkPriceUpdate = async () => {
    if (!confirm(`هل أنت متأكد من ${adjustmentType === 'add' ? `إضافة ${priceAdjustment} جنيه` : `تعيين السعر إلى ${priceAdjustment} جنيه`} لجميع المنتجات؟`)) {
      return;
    }

    setUpdating(true);
    try {
      let updated = 0;
      let failed = 0;

      // تحديث جميع المنتجات
      for (const product of products) {
        try {
          const newPrice = adjustmentType === 'add' 
            ? product.price + priceAdjustment 
            : priceAdjustment;

          await databases.updateDocument(
            DATABASE_ID,
            'products',
            product.$id,
            { price: newPrice }
          );
          updated++;
        } catch (error) {
          console.error(`Failed to update product ${product.$id}:`, error);
          failed++;
        }
        // تأخير صغير لتجنب Rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast.success(`تم تحديث ${updated} منتج بنجاح${failed > 0 ? ` (فشل ${failed})` : ''}`);
      setShowPriceDialog(false);
      fetchProducts(); // إعادة تحميل المنتجات
    } catch (error) {
      console.error('Bulk update error:', error);
      toast.error('حدث خطأ أثناء تحديث الأسعار');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg text-white">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">منتجات Vendoor</h1>
                  <p className="text-sm text-gray-500">إدارة المنتجات المستوردة من Vendoor</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPriceDialog(true)}
                className="flex items-center gap-2 border-green-500 text-green-600 hover:bg-green-50"
              >
                <DollarSign className="w-4 h-4" />
                تعديل الأسعار
              </Button>
              <Button
                variant="outline"
                onClick={fetchProducts}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث
              </Button>
              <Link to="/admin/vendoor-settings">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  إعدادات
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <Package className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">منشور</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.status === 'approved').length}
                  </p>
                </div>
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مسودة</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {products.filter(p => p.status === 'draft').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المخزون</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {products.reduce((sum, p) => sum + (p.totalStock || p.stock || 0), 0)}
                  </p>
                </div>
                <Box className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="all">جميع المنتجات</option>
                <option value="approved">منشور</option>
                <option value="draft">مسودة</option>
              </select>
              <div className="text-sm text-gray-600">
                عرض {products.length} من أصل {pagination.total} منتج
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المنتجات...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
              <p className="text-gray-500">لم يتم العثور على منتجات من Vendoor</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.$id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(product.images?.[0]) || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      {product.status === 'approved' ? (
                        <Badge className="bg-green-500 text-white">منشور</Badge>
                      ) : (
                        <Badge variant="secondary">مسودة</Badge>
                      )}
                    </div>

                    {/* Vendoor Link Badge */}
                    {product.sourceUrl && (
                      <a
                        href={product.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full shadow-lg transition-all"
                        title="عرض على Vendoor"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    {/* Product Title */}
                    <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Product Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          <span>{product.colors.length} لون</span>
                        </div>
                      )}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Ruler className="w-3 h-3" />
                          <span>{product.sizes.length} مقاس</span>
                        </div>
                      )}
                      {getInventoryCount(product) > 0 && (
                        <div className="flex items-center gap-1">
                          <Box className="w-3 h-3" />
                          <span>{getInventoryCount(product)} متغير</span>
                        </div>
                      )}
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <p className="text-xl font-bold text-red-600">{product.price} ج.م</p>
                        {product.originalPrice && product.originalPrice !== product.price && (
                          <p className="text-xs text-gray-400 line-through">
                            {product.originalPrice} ج.م
                          </p>
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-700">
                          {product.totalStock || product.stock || 0}
                        </p>
                        <p className="text-xs text-gray-500">متوفر</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <Link to={`/product/${product.$id}`} target="_blank">
                      <Button className="w-full mt-2" variant="outline">
                        <ShoppingCart className="w-4 h-4 ml-2" />
                        معاينة المنتج
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      صفحة {pagination.page} من {pagination.pages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        variant="outline"
                      >
                        السابق
                      </Button>
                      <Button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.pages}
                        variant="outline"
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Price Update Dialog */}
      <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              تعديل أسعار المنتجات
            </DialogTitle>
            <DialogDescription>
              قم بتعديل أسعار جميع منتجات Vendoor دفعة واحدة
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Adjustment Type */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">نوع التعديل</Label>
              <RadioGroup value={adjustmentType} onValueChange={(value: 'add' | 'set') => setAdjustmentType(value)}>
                <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="add" id="add" />
                  <Label htmlFor="add" className="cursor-pointer flex-1">
                    <div className="font-semibold">إضافة مبلغ</div>
                    <div className="text-sm text-gray-500">إضافة مبلغ محدد على السعر الحالي لكل منتج</div>
                  </Label>
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="set" id="set" />
                  <Label htmlFor="set" className="cursor-pointer flex-1">
                    <div className="font-semibold">تعيين سعر ثابت</div>
                    <div className="text-sm text-gray-500">تعيين نفس السعر لجميع المنتجات</div>
                  </Label>
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
              </RadioGroup>
            </div>

            {/* Price Input */}
            <div className="space-y-3">
              <Label htmlFor="price" className="text-base font-semibold">
                {adjustmentType === 'add' ? 'المبلغ المضاف (جنيه)' : 'السعر الجديد (جنيه)'}
              </Label>
              <Input
                id="price"
                type="number"
                value={priceAdjustment}
                onChange={(e) => setPriceAdjustment(Number(e.target.value))}
                placeholder={adjustmentType === 'add' ? '10' : '100'}
                className="text-lg"
                min="0"
                step="1"
              />
              <p className="text-sm text-gray-500">
                {adjustmentType === 'add' 
                  ? `سيتم إضافة ${priceAdjustment} جنيه على سعر كل منتج`
                  : `سيتم تعيين سعر جميع المنتجات إلى ${priceAdjustment} جنيه`
                }
              </p>
            </div>

            {/* Preview */}
            {products.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">مثال:</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المنتج الأول:</span>
                    <span className="font-mono">{products[0].name.substring(0, 30)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعر الحالي:</span>
                    <span className="font-semibold">{products[0].price} ج.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">السعر الجديد:</span>
                    <span className="font-bold text-green-600">
                      {adjustmentType === 'add' 
                        ? products[0].price + priceAdjustment 
                        : priceAdjustment
                      } ج.م
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                ⚠️ <strong>تحذير:</strong> سيتم تطبيق هذا التعديل على <strong>{products.length} منتج</strong> في الصفحة الحالية.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPriceDialog(false)}
              disabled={updating}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleBulkPriceUpdate}
              disabled={updating || priceAdjustment <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {updating ? (
                <>
                  <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 ml-2" />
                  تطبيق التعديل
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
