import { useState, useEffect } from 'react';
import { Zap, Plus, Calendar, Clock, Percent, Loader2, Search, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { adminFlashSalesApi } from '@/lib/admin-api';
import { productsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getImageUrl } from '@/lib/storage';

interface FlashSaleCreatorProps {
  onSuccess?: () => void;
}

export default function FlashSaleCreator({ onSuccess }: FlashSaleCreatorProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    productIds: [] as string[]
  });

  // Product Selection State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        // Search by name
        const data = await productsApi.getAll({ search: searchTerm, limit: 5 });
        setSearchResults(data.products || []);
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddProduct = (product: any) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      const newSelected = [...selectedProducts, product];
      setSelectedProducts(newSelected);
      setFormData(prev => ({
        ...prev,
        productIds: newSelected.map(p => p.id)
      }));
    }
    setSearchTerm(''); // Clear search after adding
  };

  const handleRemoveProduct = (productId: string) => {
    const newSelected = selectedProducts.filter(p => p.id !== productId);
    setSelectedProducts(newSelected);
    setFormData(prev => ({
      ...prev,
      productIds: newSelected.map(p => p.id)
    }));
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.discount || !formData.startDate || !formData.endDate) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    if (formData.productIds.length === 0) {
      toast({
        title: 'تنبيه',
        description: 'لم يتم اختيار أي منتجات للعرض',
        variant: 'warning'
      });
      // Allow creating without products, but warn
    }

    setLoading(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);

      await adminFlashSalesApi.create({
        title: formData.title,
        discount: parseFloat(formData.discount),
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        merchantId: user?.$id,
        merchantName: user?.name,
        status: 'scheduled',
        productIds: formData.productIds,
      });

      toast({
        title: 'تم الإنشاء بنجاح',
        description: 'تم إنشاء عرض الفلاش سيل'
      });

      // Reset form
      setFormData({
        title: '',
        discount: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        productIds: []
      });
      setSelectedProducts([]);

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error creating flash sale:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إنشاء العرض',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          إنشاء عرض فلاش سيل
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>عنوان العرض</Label>
            <Input
              placeholder="مثال: تخفيضات نهاية الأسبوع"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label>نسبة الخصم (%)</Label>
            <div className="relative">
              <Input
                type="number"
                min="1"
                max="99"
                placeholder="50"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>تاريخ البداية</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <Label>وقت البداية</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>تاريخ النهاية</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <Label>وقت النهاية</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Selection Section */}
        <div className="space-y-3 border-t pt-4">
          <Label>المنتجات المشمولة بالعرض</Label>

          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن منتج لإضافته..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-9"
            />
            {searching && (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="border rounded-md shadow-sm bg-background max-h-48 overflow-y-auto z-10">
              {searchResults.map(product => {
                const isSelected = selectedProducts.some(p => p.id === product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-2 hover:bg-muted cursor-pointer transition-colors ${isSelected ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => handleAddProduct(product)}
                  >
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.price} ج.م</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Products List */}
          {selectedProducts.length > 0 && (
            <div className="space-y-2 mt-2">
              <p className="text-sm text-muted-foreground">تم اختيار {selectedProducts.length} منتج:</p>
              <ScrollArea className="h-32 border rounded-md p-2">
                <div className="space-y-2">
                  {selectedProducts.map(product => (
                    <div key={product.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="h-8 w-8 rounded bg-background overflow-hidden flex-shrink-0">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm truncate">{product.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <Button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري الإنشاء...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء العرض
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
