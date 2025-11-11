import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  ExternalLink,
  Eye,
  Package,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import { PageLoader } from "@/components/ui/loading-screen";
import { getImageUrl } from "@/lib/storage";
import { productsApi } from "@/lib/api";
import type { Product } from "@shared/api";

interface VendoorProduct extends Product {
  source?: string;
  sourceUrl?: string;
  lastSyncedAt?: string;
  stock?: number;
  totalStock?: number;
  colors?: string[];
  sizes?: string[];
  colorSizeInventory?: string;
  sku?: string;
}

interface OrderStats {
  total: number;
  vendoor: number;
  otherSources: number;
  inStock: number;
  outOfStock: number;
}

export default function VendoorOrders() {
  const [products, setProducts] = useState<VendoorProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<VendoorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<VendoorProduct | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    vendoor: 0,
    otherSources: 0,
    inStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getAll({ limit: 1000 });
      
      // Filter products from scraping sources (Vendoor, etc.)
      const allProducts = response.products || [];
      const scrapedProducts = allProducts.filter(
        (p: any) => p.source && p.source !== 'manual'
      ) as VendoorProduct[];
      
      setProducts(scrapedProducts);
      setFilteredProducts(scrapedProducts);
      
      // Calculate stats
      const vendoorCount = scrapedProducts.filter(p => p.source === 'vendoor').length;
      const inStockCount = scrapedProducts.filter(p => (p.stock || 0) > 0).length;
      
      setStats({
        total: scrapedProducts.length,
        vendoor: vendoorCount,
        otherSources: scrapedProducts.length - vendoorCount,
        inStock: inStockCount,
        outOfStock: scrapedProducts.length - inStockCount,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;

    // Filter by source
    if (selectedSource !== "all") {
      filtered = filtered.filter((p) => p.source === selectedSource);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedSource, products]);

  const handleViewDetails = (product: VendoorProduct) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const getSourceBadgeColor = (source?: string) => {
    switch (source) {
      case 'vendoor':
        return 'bg-blue-500';
      case 'jumia':
        return 'bg-orange-500';
      case 'amazon':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStockBadge = (stock?: number) => {
    if (!stock || stock === 0) {
      return <Badge variant="destructive">نفذ المخزون</Badge>;
    } else if (stock < 10) {
      return <Badge variant="secondary" className="bg-yellow-500">مخزون منخفض ({stock})</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500">متوفر ({stock})</Badge>;
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['SKU', 'الاسم', 'المصدر', 'السعر', 'المخزون', 'رابط المصدر', 'آخر تحديث'],
      ...filteredProducts.map(p => [
        p.sku || '',
        p.name,
        p.source || 'manual',
        p.price,
        p.stock || 0,
        p.sourceUrl || '',
        p.lastSyncedAt ? new Date(p.lastSyncedAt).toLocaleDateString('ar-EG') : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `vendoor-products-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">منتجات Vendoor والمصادر الأخرى</h1>
            <p className="text-muted-foreground mt-1">
              إدارة ومتابعة المنتجات المستوردة من مواقع أخرى
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchProducts} variant="outline">
              <RefreshCw className="h-4 w-4 ml-2" />
              تحديث
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 ml-2" />
              تصدير CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">من Vendoor</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vendoor}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مصادر أخرى</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.otherSources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوفر</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">نفذ المخزون</CardTitle>
              <Package className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="بحث بالاسم، الوصف، أو SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-9"
                  />
                </div>
              </div>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="المصدر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المصادر</SelectItem>
                  <SelectItem value="vendoor">Vendoor</SelectItem>
                  <SelectItem value="jumia">Jumia</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>المنتجات ({filteredProducts.length})</CardTitle>
            <CardDescription>
              قائمة بجميع المنتجات المستوردة من مواقع أخرى
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>المصدر</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      لا توجد منتجات
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {product.description?.substring(0, 100)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSourceBadgeColor(product.source)}>
                          {product.source?.toUpperCase() || 'MANUAL'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{product.sku || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.price} ج.م</div>
                        {product.originalPrice && product.originalPrice !== product.price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {product.originalPrice} ج.م
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStockBadge(product.stock)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {product.lastSyncedAt
                            ? new Date(product.lastSyncedAt).toLocaleDateString('ar-EG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(product)}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            عرض
                          </Button>
                          {product.sourceUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(product.sourceUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 ml-1" />
                              المصدر
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل المنتج</DialogTitle>
            <DialogDescription>
              معلومات كاملة عن المنتج المستورد
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              {/* Images */}
              <div>
                <h3 className="font-semibold mb-3">الصور</h3>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.images?.map((img, index) => (
                    <img
                      key={index}
                      src={getImageUrl(img)}
                      alt={`${selectedProduct.name} ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الاسم</label>
                  <p className="text-sm mt-1">{selectedProduct.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="text-sm mt-1 font-mono">{selectedProduct.sku || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">المصدر</label>
                  <p className="text-sm mt-1">
                    <Badge className={getSourceBadgeColor(selectedProduct.source)}>
                      {selectedProduct.source?.toUpperCase() || 'MANUAL'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">السعر</label>
                  <p className="text-sm mt-1 font-bold">{selectedProduct.price} ج.م</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">المخزون الكلي</label>
                  <p className="text-sm mt-1">{selectedProduct.totalStock || selectedProduct.stock || 0} قطعة</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">آخر تحديث</label>
                  <p className="text-sm mt-1">
                    {selectedProduct.lastSyncedAt
                      ? new Date(selectedProduct.lastSyncedAt).toLocaleString('ar-EG')
                      : '-'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">الوصف</label>
                <p className="text-sm mt-1 whitespace-pre-line">{selectedProduct.description}</p>
              </div>

              {/* Colors & Sizes */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">الألوان المتاحة</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProduct.colors.map((color, index) => (
                      <Badge key={index} variant="outline">{color}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">المقاسات المتاحة</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedProduct.sizes.slice(0, 20).map((size, index) => (
                      <Badge key={index} variant="secondary">{size}</Badge>
                    ))}
                    {selectedProduct.sizes.length > 20 && (
                      <Badge variant="secondary">+{selectedProduct.sizes.length - 20} أخرى</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Inventory Details */}
              {selectedProduct.colorSizeInventory && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">تفاصيل المخزون</label>
                  <div className="mt-2 max-h-60 overflow-y-auto border rounded p-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>اللون</TableHead>
                          <TableHead>المقاس</TableHead>
                          <TableHead>الكمية</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(() => {
                          try {
                            const inventory = JSON.parse(selectedProduct.colorSizeInventory!);
                            return inventory.slice(0, 20).map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{item.color}</TableCell>
                                <TableCell>{item.size}</TableCell>
                                <TableCell>
                                  <Badge variant={item.quantity > 0 ? 'default' : 'destructive'}>
                                    {item.quantity}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ));
                          } catch {
                            return (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                  خطأ في قراءة البيانات
                                </TableCell>
                              </TableRow>
                            );
                          }
                        })()}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Source URL */}
              {selectedProduct.sourceUrl && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">رابط المنتج الأصلي</label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => window.open(selectedProduct.sourceUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 ml-2" />
                      {selectedProduct.sourceUrl}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
