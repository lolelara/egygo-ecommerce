import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Package, DollarSign, ShoppingCart, ExternalLink, RefreshCw, Plus, Edit, RotateCw, Clock } from 'lucide-react';
import { 
  importProductFromUrl, 
  bulkImportProducts, 
  getIntermediaryProducts,
  updateProductPrice,
  updateProductDescription,
  restoreOriginalDescription,
  syncProductFromSource,
  toggleProductAutoSync,
  bulkSyncProducts
} from '@/lib/intermediary-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

export default function IntermediaryDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Import Single Product State
  const [importUrl, setImportUrl] = useState('');
  const [markupType, setMarkupType] = useState<'percentage' | 'fixed'>('percentage');
  const [markupValue, setMarkupValue] = useState('20');
  const [importing, setImporting] = useState(false);
  
  // Bulk Import State
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkMarkupType, setBulkMarkupType] = useState<'percentage' | 'fixed'>('percentage');
  const [bulkMarkupValue, setBulkMarkupValue] = useState('20');
  const [bulkImporting, setBulkImporting] = useState(false);
  
  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Auto-Sync State
  const [syncing, setSyncing] = useState(false);
  const [autoSyncing, setAutoSyncing] = useState(false);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getIntermediaryProducts(user.$id);
      setProducts(data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل المنتجات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportSingle = async () => {
    if (!importUrl) {
      toast({
        title: "تحذير",
        description: "الرجاء إدخال رابط المنتج",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      const markup = markupType === 'percentage' 
        ? { type: 'percentage' as const, value: parseFloat(markupValue) }
        : { type: 'fixed' as const, value: parseFloat(markupValue) };
        
      const result = await importProductFromUrl(importUrl, markup);
      
      if (result.success) {
        toast({
          title: "نجح!",
          description: "تم استيراد المنتج بنجاح"
        });
        setImportUrl('');
        loadProducts();
      } else {
        toast({
          title: "فشل",
          description: result.error || "فشل استيراد المنتج",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الاستيراد",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleBulkImport = async () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim());
    
    if (urls.length === 0) {
      toast({
        title: "تحذير",
        description: "الرجاء إدخال روابط المنتجات",
        variant: "destructive"
      });
      return;
    }

    setBulkImporting(true);
    try {
      const markup = bulkMarkupType === 'percentage' 
        ? { type: 'percentage' as const, value: parseFloat(bulkMarkupValue) }
        : { type: 'fixed' as const, value: parseFloat(bulkMarkupValue) };
        
      const result = await bulkImportProducts(urls, markup);
      
      toast({
        title: "اكتمل الاستيراد",
        description: `نجح: ${result.success} | فشل: ${result.failed}`
      });
      
      setBulkUrls('');
      loadProducts();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الاستيراد الجماعي",
        variant: "destructive"
      });
    } finally {
      setBulkImporting(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditPrice(product.price.toString());
    setEditDescription(product.customDescription || product.description || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    
    try {
      // Update price if changed
      const newPrice = parseFloat(editPrice);
      if (newPrice !== editingProduct.price) {
        await updateProductPrice(editingProduct.$id, newPrice);
      }
      
      // Update description if changed
      if (editDescription !== (editingProduct.customDescription || editingProduct.description)) {
        await updateProductDescription(editingProduct.$id, editDescription);
      }
      
      toast({
        title: "نجح!",
        description: "تم تحديث المنتج بنجاح"
      });
      
      setEditDialogOpen(false);
      loadProducts();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث المنتج",
        variant: "destructive"
      });
    }
  };

  const handleSyncProduct = async (productId: string) => {
    setSyncing(true);
    try {
      const result = await syncProductFromSource(productId);
      
      const changes = [];
      if (result.changes.priceChanged) changes.push('السعر');
      if (result.changes.descriptionUpdated) changes.push('الوصف');
      if (result.changes.nameUpdated) changes.push('الاسم');
      
      toast({
        title: "تم التحديث!",
        description: changes.length > 0 
          ? `تم تحديث: ${changes.join(', ')}` 
          : 'لا توجد تغييرات'
      });
      
      loadProducts();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث المنتج",
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleAutoSync = async (productId: string, enabled: boolean) => {
    try {
      await toggleProductAutoSync(productId, enabled, 10);
      
      toast({
        title: enabled ? "تم التفعيل" : "تم التعطيل",
        description: enabled 
          ? "سيتم تحديث المنتج تلقائياً كل 10 دقائق" 
          : "تم إيقاف التحديث التلقائي"
      });
      
      loadProducts();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحديث الإعدادات",
        variant: "destructive"
      });
    }
  };

  const handleBulkSync = async () => {
    if (!user) return;
    
    setAutoSyncing(true);
    try {
      const result = await bulkSyncProducts(user.$id);
      
      toast({
        title: "اكتمل التحديث",
        description: `تم تحديث ${result.synced} من ${result.total} منتج`
      });
      
      loadProducts();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل التحديث الجماعي",
        variant: "destructive"
      });
    } finally {
      setAutoSyncing(false);
    }
  };

  const averageMarkup = products.length > 0
    ? (products.reduce((sum: number, p: any) => sum + (p.priceMarkup || 0), 0) / products.length).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم الوسيط</h1>
          <p className="text-muted-foreground">
            استورد منتجات من مواقع أخرى وحدد هامش الربح
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط الهامش
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageMarkup}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الطلبات النشطة
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Import Tabs */}
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">استيراد منتج واحد</TabsTrigger>
            <TabsTrigger value="bulk">استيراد جماعي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>استيراد منتج من رابط</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>رابط المنتج</Label>
                  <Input
                    placeholder="https://example.com/product/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نوع الهامش</Label>
                    <Select value={markupType} onValueChange={(v: any) => setMarkupType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت (جنيه)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>قيمة الهامش</Label>
                    <Input
                      type="number"
                      value={markupValue}
                      onChange={(e) => setMarkupValue(e.target.value)}
                      placeholder={markupType === 'percentage' ? '20' : '50'}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleImportSingle} 
                  disabled={importing}
                  className="w-full"
                >
                  {importing ? 'جاري الاستيراد...' : 'استيراد المنتج'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>استيراد عدة منتجات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>روابط المنتجات (رابط لكل سطر)</Label>
                  <textarea
                    className="w-full min-h-[200px] p-3 border rounded-md"
                    placeholder="https://example.com/product1&#10;https://example.com/product2&#10;https://example.com/product3"
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نوع الهامش</Label>
                    <Select value={bulkMarkupType} onValueChange={(v: any) => setBulkMarkupType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت (جنيه)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>قيمة الهامش</Label>
                    <Input
                      type="number"
                      value={bulkMarkupValue}
                      onChange={(e) => setBulkMarkupValue(e.target.value)}
                      placeholder={bulkMarkupType === 'percentage' ? '20' : '50'}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleBulkImport} 
                  disabled={bulkImporting}
                  className="w-full"
                >
                  {bulkImporting ? 'جاري الاستيراد...' : 'استيراد المنتجات'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>منتجاتي المستوردة</CardTitle>
              <div className="flex gap-2">
                <Button onClick={handleBulkSync} variant="outline" size="sm" disabled={autoSyncing}>
                  <RotateCw className={`h-4 w-4 ml-2 ${autoSyncing ? 'animate-spin' : ''}`} />
                  {autoSyncing ? 'جاري المزامنة...' : 'مزامنة الكل'}
                </Button>
                <Button onClick={loadProducts} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 ml-2" />
                  تحديث
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد منتجات مستوردة بعد
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الصورة</TableHead>
                      <TableHead>الاسم</TableHead>
                      <TableHead>السعر الأصلي</TableHead>
                      <TableHead>الهامش</TableHead>
                      <TableHead>السعر النهائي</TableHead>
                      <TableHead>تحديث تلقائي</TableHead>
                      <TableHead>آخر تحديث</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product: any) => (
                      <TableRow key={product.$id}>
                        <TableCell>
                          <img 
                            src={product.images?.[0] || '/placeholder.png'} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate">{product.name}</div>
                          {product.customDescription && (
                            <span className="text-xs text-muted-foreground">(وصف معدّل)</span>
                          )}
                        </TableCell>
                        <TableCell>{product.originalPrice || product.price} جنيه</TableCell>
                        <TableCell>
                          {product.priceMarkup || 0} {product.priceMarkupType === 'percentage' ? '%' : 'جنيه'}
                        </TableCell>
                        <TableCell className="font-bold">
                          {product.price} جنيه
                          {product.priceOverride && (
                            <span className="text-xs text-muted-foreground block">(سعر مخصص)</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={product.autoSyncEnabled || false}
                            onCheckedChange={(checked) => handleToggleAutoSync(product.$id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          {product.lastSyncedAt ? (
                            <div className="text-sm">
                              <Clock className="h-3 w-3 inline ml-1" />
                              {new Date(product.lastSyncedAt).toLocaleString('ar-EG')}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">لم يتم</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSyncProduct(product.$id)}
                              disabled={syncing || !product.sourceUrl}
                            >
                              <RotateCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                            </Button>
                            {product.sourceUrl && (
                              <a 
                                href={product.sourceUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Button size="sm" variant="outline">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
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
        
        {/* Edit Product Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل المنتج</DialogTitle>
              <DialogDescription>
                قم بتعديل سعر ووصف المنتج. سيتم الاحتفاظ بالنسخة الأصلية.
              </DialogDescription>
            </DialogHeader>
            
            {editingProduct && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">السعر النهائي</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    السعر الأصلي: {editingProduct.originalPrice} جنيه
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">الوصف</Label>
                  <Textarea
                    id="edit-description"
                    rows={6}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="resize-none"
                  />
                  {editingProduct.originalDescription && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditDescription(editingProduct.originalDescription)}
                    >
                      استعادة الوصف الأصلي
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveEdit}>
                حفظ التغييرات
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
