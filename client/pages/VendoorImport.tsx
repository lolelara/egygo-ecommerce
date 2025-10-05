import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, Upload, RefreshCw, ShoppingCart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function VendoorImport() {
  const { toast } = useToast();
  
  const [vendoorEmail, setVendoorEmail] = useState('');
  const [vendoorPassword, setVendoorPassword] = useState('');
  const [isScrapingAll, setIsScrapingAll] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState({ current: 0, total: 0 });
  const [products, setProducts] = useState<VendoorProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VendoorProduct | null>(null);
  const [importingProducts, setImportingProducts] = useState<Set<string>>(new Set());
  const [viewProductDialog, setViewProductDialog] = useState(false);

  /**
   * جلب جميع المنتجات من Ven-door
   */
  const handleScrapeAll = async () => {
    if (!vendoorEmail || !vendoorPassword) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال بيانات تسجيل الدخول لـ Ven-door',
        variant: 'destructive'
      });
      return;
    }

    setIsScrapingAll(true);
    setScrapingProgress({ current: 0, total: 41 });

    try {
      const response = await fetch('/api/vendoor/scrape-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: vendoorEmail,
          password: vendoorPassword,
          maxPages: 41
        })
      });

      if (!response.ok) {
        throw new Error('فشل جلب المنتجات');
      }

      const data = await response.json();
      
      setProducts(data.products);
      
      toast({
        title: 'نجح!',
        description: `تم جلب ${data.products.length} منتج من Ven-door`,
      });

    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: error.message || 'فشل جلب المنتجات',
        variant: 'destructive'
      });
    } finally {
      setIsScrapingAll(false);
    }
  };

  /**
   * استيراد منتج إلى الموقع
   */
  const handleImportProduct = async (product: VendoorProduct) => {
    setImportingProducts(prev => new Set(prev).add(product.id));

    try {
      const response = await fetch('/api/vendoor/import-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          vendoorEmail,
          vendoorPassword
        })
      });

      if (!response.ok) {
        throw new Error('فشل استيراد المنتج');
      }

      const data = await response.json();

      toast({
        title: 'نجح!',
        description: `تم استيراد ${product.title} بنجاح`,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendoor-email">البريد الإلكتروني لـ Ven-door</Label>
                  <Input
                    id="vendoor-email"
                    type="text"
                    placeholder="almlmibrahym574@gmail.com"
                    value={vendoorEmail}
                    onChange={(e) => setVendoorEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendoor-password">كلمة المرور</Label>
                  <Input
                    id="vendoor-password"
                    type="password"
                    placeholder="••••••••"
                    value={vendoorPassword}
                    onChange={(e) => setVendoorPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleScrapeAll}
                disabled={isScrapingAll || !vendoorEmail || !vendoorPassword}
                className="w-full md:w-auto"
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
                    جلب جميع المنتجات
                  </>
                )}
              </Button>

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
              <CardContent>
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
                قم بتخصيص إعدادات استيراد المنتجات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>نسبة الهامش الربحي الافتراضية (%)</Label>
                <Input type="number" placeholder="20" defaultValue="20" />
              </div>
              
              <div className="space-y-2">
                <Label>الفئة الافتراضية</Label>
                <Input placeholder="أحذية" />
              </div>

              <Button>حفظ الإعدادات</Button>
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
