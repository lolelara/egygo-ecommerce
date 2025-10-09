import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { TableSkeleton } from '@/components/LoadingSkeletons';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  CheckSquare,
  Square,
  Download,
  Upload,
  Edit,
  Trash2,
  Power,
  PowerOff,
  DollarSign,
  Package,
  Loader2,
  AlertCircle,
  Keyboard
} from 'lucide-react';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { useToast } from '@/components/ui/use-toast';
import {
  bulkUpdatePrices,
  bulkUpdateProductStatus,
  bulkDeleteProducts,
  bulkUpdateStock,
  bulkUpdateCategory,
  exportProductsToCSV,
  importProductsFromCSV,
  downloadCSV,
  type BulkOperationResult
} from '@/lib/bulk-operations-api';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;

interface Product {
  $id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  isActive: boolean;
  merchantId?: string;
  $createdAt: string;
}

export default function AdminProductsAdvanced() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    priceMin: '',
    priceMax: '',
    stockMin: ''
  });

  // Bulk action dialog
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    open: boolean;
    action: 'price' | 'stock' | 'category' | 'status' | 'delete' | null;
    value?: any;
  }>({ open: false, action: null });

  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkOperationResult | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.limit(1000)]
      );
      setProducts(response.documents as any);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status === 'active' && !product.isActive) return false;
    if (filters.status === 'inactive' && product.isActive) return false;

    // Price filters
    if (filters.priceMin && product.price < parseFloat(filters.priceMin)) return false;
    if (filters.priceMax && product.price > parseFloat(filters.priceMax)) return false;

    // Stock filter
    if (filters.stockMin && product.stock < parseInt(filters.stockMin)) return false;

    return true;
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+A: Select all visible products
      if (e.ctrlKey && e.key === 'a' && !e.shiftKey) {
        e.preventDefault();
        const allIds = filteredProducts.map(p => p.$id);
        setSelectedIds(new Set(allIds));
        toast({
          title: "تم التحديد",
          description: `تم تحديد ${allIds.length} منتج`,
        });
      }
      
      // Delete: Open delete dialog if products are selected
      if (e.key === 'Delete' && selectedIds.size > 0 && !bulkActionDialog.open) {
        e.preventDefault();
        setBulkActionDialog({ open: true, action: 'delete' });
      }
      
      // Escape: Clear selection
      if (e.key === 'Escape' && selectedIds.size > 0 && !bulkActionDialog.open) {
        e.preventDefault();
        setSelectedIds(new Set());
        toast({
          title: "تم الإلغاء",
          description: "تم إلغاء التحديد",
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredProducts, selectedIds, bulkActionDialog.open, toast]);

  const toggleSelection = (productId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.$id)));
    }
  };

  const handleBulkAction = async () => {
    if (selectedIds.size === 0) return;

    setBulkLoading(true);
    setBulkResult(null);
    setBatchProgress({ current: 0, total: selectedIds.size });

    try {
      const ids = Array.from(selectedIds);
      const BATCH_SIZE = 50; // Process 50 items at a time
      let successCount = 0;
      let failedCount = 0;
      
      // Process in batches
      for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = ids.slice(i, i + BATCH_SIZE);
        setBatchProgress({ current: i, total: ids.length });
        
        let result: BulkOperationResult;
        
        switch (bulkActionDialog.action) {
          case 'price':
            result = await bulkUpdatePrices(batch, bulkActionDialog.value);
            break;
          case 'stock':
            result = await bulkUpdateStock(batch, bulkActionDialog.value);
            break;
          case 'category':
            result = await bulkUpdateCategory(batch, bulkActionDialog.value);
            break;
          case 'status':
            result = await bulkUpdateProductStatus(batch, bulkActionDialog.value);
            break;
          case 'delete':
            result = await bulkDeleteProducts(batch);
            break;
          default:
            return;
        }
        
        successCount += result.success;
        failedCount += result.failed;
      }
      
      const finalResult: BulkOperationResult = {
        success: successCount,
        failed: failedCount,
        total: ids.length,
        errors: []
      };
      
      setBatchProgress({ current: ids.length, total: ids.length });
      setBulkResult(finalResult);
      
      if (finalResult.success > 0) {
        await loadProducts();
        setSelectedIds(new Set());
        
        // Show success toast
        toast({
          title: "نجح!",
          description: `تم ${bulkActionDialog.action === 'delete' ? 'حذف' : 'تحديث'} ${finalResult.success} منتج بنجاح${finalResult.failed > 0 ? ` (فشل ${finalResult.failed})` : ''}`,
          variant: "default",
        });
      } else if (finalResult.failed > 0) {
        // Show error toast
        toast({
          title: "فشل!",
          description: `فشل تحديث ${finalResult.failed} منتج`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        title: "خطأ!",
        description: "حدث خطأ أثناء تنفيذ العملية",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const csvContent = await exportProductsToCSV(
        selectedIds.size > 0 ? Array.from(selectedIds) : undefined
      );
      downloadCSV(csvContent, `products-${new Date().toISOString().split('T')[0]}.csv`);
      
      toast({
        title: "تم التصدير!",
        description: `تم تصدير ${selectedIds.size > 0 ? selectedIds.size : products.length} منتج بنجاح`,
        variant: "default",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "خطأ!",
        description: "فشل تصدير المنتجات",
        variant: "destructive",
      });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const csvContent = e.target?.result as string;
      setBulkLoading(true);
      try {
        const result = await importProductsFromCSV(csvContent);
        setBulkResult(result);
        await loadProducts();
        
        if (result.success > 0) {
          toast({
            title: "تم الاستيراد!",
            description: `تم استيراد ${result.success} منتج بنجاح${result.failed > 0 ? ` (فشل ${result.failed})` : ''}`,
            variant: "default",
          });
        } else {
          toast({
            title: "فشل الاستيراد!",
            description: "فشل استيراد جميع المنتجات",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "خطأ!",
          description: "فشل استيراد الملف",
          variant: "destructive",
        });
      } finally {
        setBulkLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6" dir="rtl">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  <TableHead><Skeleton className="h-4 w-24" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-16" /></TableHead>
                  <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(10)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات المتقدمة</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} منتج • {selectedIds.size} محدد
          </p>
        </div>

        <div className="flex gap-3">
          {/* Keyboard Shortcuts Info */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="اختصارات لوحة المفاتيح">
                <Keyboard className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>اختصارات لوحة المفاتيح</DialogTitle>
                <DialogDescription>
                  استخدم هذه الاختصارات لإدارة المنتجات بسرعة
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>تحديد الكل</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">Ctrl + A</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>حذف المحدد</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">Delete</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span>إلغاء التحديد</span>
                  <kbd className="px-2 py-1 text-xs font-semibold bg-background border rounded">Escape</kbd>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 ml-2" />
            تصدير
          </Button>
          
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 ml-2" />
                استيراد
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{selectedIds.size} منتج محدد</span>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkActionDialog({ open: true, action: 'price' })}
                >
                  <DollarSign className="w-4 h-4 ml-2" />
                  تحديث السعر
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkActionDialog({ open: true, action: 'stock' })}
                >
                  <Package className="w-4 h-4 ml-2" />
                  تحديث المخزون
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkActionDialog({ open: true, action: 'status', value: true })}
                >
                  <Power className="w-4 h-4 ml-2" />
                  تفعيل
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkActionDialog({ open: true, action: 'status', value: false })}
                >
                  <PowerOff className="w-4 h-4 ml-2" />
                  إلغاء تفعيل
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setBulkActionDialog({ open: true, action: 'delete' })}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>التصفية والبحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Input
              placeholder="بحث بالاسم..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="السعر من"
              value={filters.priceMin}
              onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
            />

            <Input
              type="number"
              placeholder="السعر إلى"
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
            />

            <Input
              type="number"
              placeholder="مخزون أقل من"
              value={filters.stockMin}
              onChange={(e) => setFilters({ ...filters, stockMin: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>المنتج</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>المخزون</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.$id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(product.$id)}
                      onCheckedChange={() => toggleSelection(product.$id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price.toFixed(2)} ج.م</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 10 ? 'default' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(product.$createdAt).toLocaleDateString('ar-EG')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog.open} onOpenChange={(open) => setBulkActionDialog({ ...bulkActionDialog, open })}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>عملية جماعية</DialogTitle>
            <DialogDescription>
              سيتم تطبيق هذه العملية على {selectedIds.size} منتج
            </DialogDescription>
          </DialogHeader>

          {bulkResult ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckSquare className="w-5 h-5" />
                <span>نجح: {bulkResult.success} منتج</span>
              </div>
              {bulkResult.failed > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span>فشل: {bulkResult.failed} منتج</span>
                </div>
              )}
            </div>
          ) : bulkLoading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>جاري المعالجة...</span>
                  <span>{batchProgress.current} / {batchProgress.total}</span>
                </div>
                <Progress 
                  value={(batchProgress.current / batchProgress.total) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground text-center">
                  يتم معالجة المنتجات في مجموعات من 50 منتج لضمان الأداء الأمثل
                </p>
              </div>
            </div>
          ) : bulkActionDialog.action === 'delete' ? (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-red-900 dark:text-red-100">⚠️ تحذير: عملية حذف نهائية</h4>
                    <p className="text-sm text-red-700 dark:text-red-200">
                      سيتم حذف <strong>{selectedIds.size}</strong> منتج نهائياً. هذا الإجراء لا يمكن التراجع عنه!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-delete">
                  للتأكيد، اكتب <strong className="text-red-600">DELETE</strong> في الحقل أدناه:
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="اكتب DELETE"
                  className="text-center font-mono uppercase"
                  autoFocus
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBulkActionDialog({ open: false, action: null });
                setBulkResult(null);
                setConfirmText('');
              }}
            >
              {bulkResult ? 'إغلاق' : 'إلغاء'}
            </Button>
            
            {!bulkResult && (
              <Button
                onClick={handleBulkAction}
                disabled={bulkLoading || (bulkActionDialog.action === 'delete' && confirmText !== 'DELETE')}
                variant={bulkActionDialog.action === 'delete' ? 'destructive' : 'default'}
              >
                {bulkLoading ? (
                  <Skeleton className="w-20 h-6 ml-2 inline-block align-middle" />
                ) : (
                  'تأكيد'
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
