import { useState } from 'react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Upload, RefreshCw, ShoppingCart, Eye, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  fetchAllVendoorProducts, 
  fetchSingleVendoorProduct, 
  importVendoorProduct,
  manualVendoorSync,
  checkVendoorFunctionStatus
} from '@/lib/vendoor-function-api';

interface VendoorProduct {
  id: string;
  title: string;
  supplier: string;
  price: string;
  commission: string;
  stock: string;
  image: string;
  variations?: Record<string, string[]>;
  stockDetails?: Record<string, number>;
}

// بيانات تسجيل الدخول الثابتة لـ Vendoor
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';

export default function VendoorImport() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isScrapingAll, setIsScrapingAll] = useState(false);
  const [isScrapingSingle, setIsScrapingSingle] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState({ current: 0, total: 0 });
  const [products, setProducts] = useState<VendoorProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VendoorProduct | null>(null);
  const [importingProducts, setImportingProducts] = useState<Set<string>>(new Set());
  const [viewProductDialog, setViewProductDialog] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [singleProductId, setSingleProductId] = useState('');
  const [markupPercentage, setMarkupPercentage] = useState(20);
  const [importingAll, setImportingAll] = useState(false);

  /**
   * جلب جميع المنتجات من Vendoor
   */
  const handleScrapeAll = async () => {
    setIsScrapingAll(true);
    setScrapingProgress({ current: 0, total: 41 });

    try {
      const response = await fetch('/api/vendoor/scrape-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VENDOOR_EMAIL,
          password: VENDOOR_PASSWORD,
          maxPages: 41
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`فشل جلب المنتجات: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
        
        toast({
          title: 'نجح! 🎉',
          description: `تم جلب ${data.totalProducts} منتج من ${data.totalPages} صفحة`,
        });
      } else {
        throw new Error(data.error || 'فشل في جلب المنتجات');
      }

    } catch (error: any) {
      console.error('خطأ في جلب المنتجات:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل جلب المنتجات',
        variant: 'destructive'
      });
    } finally {
      setIsScrapingAll(false);
      setScrapingProgress({ current: 0, total: 0 });
    }
  };

  /**
   * جلب منتج واحد من Vendoor
   */
  const handleScrapeSingle = async () => {
    if (!singleProductId.trim()) {
      toast({
        title: 'تحذير',
        description: 'الرجاء إدخال رقم المنتج',
        variant: 'destructive'
      });
      return;
    }

    setIsScrapingSingle(true);

    try {
      const response = await fetch('/api/vendoor/scrape-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: VENDOOR_EMAIL,
          password: VENDOOR_PASSWORD,
          productId: singleProductId.trim()
        })
      });

      if (!response.ok) {
        throw new Error('فشل جلب المنتج');
      }

      const data = await response.json();
      
      if (data.success && data.product) {
        setProducts(prev => [data.product, ...prev]);
        setSingleProductId('');
        
        toast({
          title: 'نجح!',
          description: `تم جلب المنتج ${data.product.title}`,
        });
      } else {
        throw new Error(data.error || 'فشل في جلب المنتج');
      }

    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل جلب المنتج',
        variant: 'destructive'
      });
    } finally {
      setIsScrapingSingle(false);
    }
  };

  /**
   * رفع ملف JSON يحتوي على المنتجات
   */
  const handleUploadJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // التحقق من صيغة الملف
        if (json.products && Array.isArray(json.products)) {
          setProducts(json.products);
          toast({
            title: 'نجح!',
            description: `تم تحميل ${json.products.length} منتج من الملف`,
          });
        } else {
          throw new Error('صيغة الملف غير صحيحة');
        }
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'فشل قراءة الملف. تأكد أنه ملف JSON صحيح.',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  /**
   * استيراد منتج إلى الموقع
   */
  const handleImportProduct = async (product: VendoorProduct) => {
    if (!user) {
      toast({
        title: 'خطأ',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive'
      });
      return;
    }

    setImportingProducts(prev => new Set(prev).add(product.id));

    try {
      const response = await fetch('/api/vendoor/import-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: product,
          userId: user.$id,
          userName: user.name,
          markupPercentage: markupPercentage
        })
      });

      if (!response.ok) {
        throw new Error('فشل استيراد المنتج');
      }

      const data = await response.json();

      toast({
        title: 'نجح!',
        description: data.message || `تم استيراد ${product.title} بنجاح`,
      });

      // تحديث حالة المنتج
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, imported: true } : p
      ));

    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل استيراد المنتج',
        variant: 'destructive'
      });
    } finally {
      setImportingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  /**
   * استيراد جميع المنتجات دفعة واحدة
   */
  const handleImportAll = async () => {
    if (!user) {
      toast({
        title: 'خطأ',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive'
      });
      return;
    }

    if (products.length === 0) {
      toast({
        title: 'تحذير',
        description: 'لا توجد منتجات للاستيراد',
        variant: 'destructive'
      });
      return;
    }

    setImportingAll(true);

    try {
      const response = await fetch('/api/vendoor/import-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: products,
          userId: user.$id,
          userName: user.name,
          markupPercentage: markupPercentage
        })
      });

      if (!response.ok) {
        throw new Error('فشل استيراد المنتجات');
      }

      const data = await response.json();

      toast({
        title: 'نجح! 🎉',
        description: data.message || 'تم استيراد المنتجات بنجاح',
      });

      // تحديث حالة جميع المنتجات
      setProducts(prev => prev.map(p => ({ ...p, imported: true })));

    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل استيراد المنتجات',
        variant: 'destructive'
      });
    } finally {
      setImportingAll(false);
    }
  };

  /**
   * عرض تفاصيل المنتج
   */
  const handleViewProduct = (product: VendoorProduct) => {
    setSelectedProduct(product);
    setViewProductDialog(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">استيراد المنتجات من Ven-door</h1>
        <p className="text-muted-foreground">
          استورد منتجاتك بسهولة من Ven-door إلى موقعك
        </p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="import">
            <Download className="ml-2 h-4 w-4" />
            استيراد المنتجات
          </TabsTrigger>
          <TabsTrigger value="settings">
            <RefreshCw className="ml-2 h-4 w-4" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* تبويب الاستيراد */}
        <TabsContent value="import" className="space-y-6">
          {/* بطاقة جلب المنتجات */}
          <Card>
            <CardHeader>
              <CardTitle>جلب كتالوج المنتجات</CardTitle>
              <CardDescription>
                قم بجلب جميع المنتجات من حسابك في Ven-door
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* استيراد منتج واحد */}
              <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                <Label htmlFor="single-product-id">استيراد منتج واحد (رقم المنتج)</Label>
                <div className="flex gap-2">
                  <Input
                    id="single-product-id"
                    type="text"
                    placeholder="4259"
                    value={singleProductId}
                    onChange={(e) => setSingleProductId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleScrapeSingle}
                    disabled={isScrapingSingle}
                  >
                    {isScrapingSingle ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري...
                      </>
                    ) : (
                      <>
                        <Download className="ml-2 h-4 w-4" />
                        جلب
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleScrapeAll}
                    disabled={isScrapingAll}
                    className="flex-1"
                    size="lg"
                  >
                    {isScrapingAll ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري جلب المنتجات... ({scrapingProgress.current}/{scrapingProgress.total})
                      </>
                    ) : (
                      <>
                        <Download className="ml-2 h-4 w-4" />
                        جلب جميع المنتجات (41 صفحة)
                      </>
                    )}
                  </Button>

                  <Label htmlFor="json-upload" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 w-full h-full px-4 py-3 bg-secondary hover:bg-secondary/80 rounded-md border border-input transition-colors text-sm font-medium">
                      <Upload className="h-4 w-4" />
                      <span>رفع ملف JSON</span>
                    </div>
                  </Label>
                  <Input
                    id="json-upload"
                    type="file"
                    accept=".json"
                    onChange={handleUploadJSON}
                    className="hidden"
                  />
                </div>

              </div>

              {isScrapingAll && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>جاري المعالجة...</span>
                    <span>{Math.round((scrapingProgress.current / scrapingProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${(scrapingProgress.current / scrapingProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* قائمة المنتجات */}
          {products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>المنتجات المتاحة ({products.length})</CardTitle>
                <CardDescription>
                  اختر المنتجات التي تريد استيرادها إلى موقعك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* إعدادات الاستيراد */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <Label htmlFor="markup">نسبة الهامش الربحي (%)</Label>
                    <Input
                      id="markup"
                      type="number"
                      value={markupPercentage}
                      onChange={(e) => setMarkupPercentage(Number(e.target.value))}
                      min="0"
                      max="100"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1 flex items-end">
                    <Button
                      onClick={handleImportAll}
                      disabled={importingAll}
                      className="w-full"
                      size="lg"
                    >
                      {importingAll ? (
                        <>
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          جاري الاستيراد...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="ml-2 h-4 w-4" />
                          استيراد جميع المنتجات ({products.length})
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={product.image || '/placeholder-product.jpg'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge 
                          className="absolute top-2 right-2"
                          variant={parseInt(product.stock) > 50 ? 'default' : 'destructive'}
                        >
                          {product.stock}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
                          {product.title}
                        </h3>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">السعر:</span>
                          <span className="font-bold text-primary">{product.price} جنيه</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">العمولة:</span>
                          <span className="font-bold text-green-600">{product.commission} جنيه</span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">المورد:</span>
                          <span className="text-xs">{product.supplier}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleViewProduct(product)}
                          >
                            <Eye className="ml-2 h-4 w-4" />
                            عرض
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleImportProduct(product)}
                            disabled={importingProducts.has(product.id)}
                          >
                            {importingProducts.has(product.id) ? (
                              <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري...
                              </>
                            ) : (
                              <>
                                <Upload className="ml-2 h-4 w-4" />
                                استيراد
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* تبويب الإعدادات */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الاستيراد</CardTitle>
              <CardDescription>
                قم بتخصيص إعدادات استيراد المنتجات والتحديث التلقائي
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">إعدادات الاستيراد</h3>
                
                <div className="space-y-2">
                  <Label>نسبة الهامش الربحي الافتراضية (%)</Label>
                  <Input 
                    type="number" 
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    سيتم إضافة هذه النسبة على سعر Vendoor الأصلي
                  </p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-semibold text-lg">التحديث التلقائي</h3>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">التحديث التلقائي كل ساعة</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        يتم تحديث الأسعار والمخزون تلقائياً كل ساعة
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900 rounded-md">
                          <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            نشط
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={async () => {
                    try {
                      setAutoSyncEnabled(true);
                      const response = await fetch('/api/vendoor/sync-manual', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      const data = await response.json();
                      
                      toast({
                        title: data.success ? 'نجح!' : 'خطأ',
                        description: data.success 
                          ? `تم تحديث ${data.updated} منتج بنجاح`
                          : data.error || 'فشل التحديث',
                        variant: data.success ? 'default' : 'destructive'
                      });
                    } catch (error: any) {
                      toast({
                        title: 'خطأ',
                        description: error.message || 'فشل التحديث اليدوي',
                        variant: 'destructive'
                      });
                    } finally {
                      setAutoSyncEnabled(false);
                    }
                  }}
                  disabled={autoSyncEnabled}
                  variant="outline"
                  className="w-full"
                >
                  {autoSyncEnabled ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري التحديث...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="ml-2 h-4 w-4" />
                      تحديث يدوي الآن
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نافذة عرض تفاصيل المنتج */}
      <Dialog open={viewProductDialog} onOpenChange={setViewProductDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.title}</DialogTitle>
            <DialogDescription>
              تفاصيل المنتج من Ven-door
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">رقم المنتج</span>
                  <p className="font-semibold">#{selectedProduct.id}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">المورد</span>
                  <p className="font-semibold">{selectedProduct.supplier}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">السعر</span>
                  <p className="font-semibold text-primary">{selectedProduct.price} جنيه</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">العمولة</span>
                  <p className="font-semibold text-green-600">{selectedProduct.commission} جنيه</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">المخزون</span>
                  <p className="font-semibold">{selectedProduct.stock}</p>
                </div>
              </div>

              {selectedProduct.variations && Object.keys(selectedProduct.variations).length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">الألوان والمقاسات</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedProduct.variations).map(([color, sizes]) => (
                      <div key={color} className="flex items-center gap-2">
                        <Badge variant="outline">{color}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {(sizes as string[]).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                className="w-full" 
                size="lg"
                onClick={() => {
                  handleImportProduct(selectedProduct);
                  setViewProductDialog(false);
                }}
                disabled={importingProducts.has(selectedProduct.id)}
              >
                {importingProducts.has(selectedProduct.id) ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الاستيراد...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    استيراد هذا المنتج
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
