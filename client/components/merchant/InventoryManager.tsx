import { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Search, 
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { filterMerchantProducts } from '@/lib/permissions';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  merchantId: string;
}

export default function InventoryManager() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Sample data - replace with actual API call
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'ساعة ذكية Pro',
        sku: 'SW-001',
        stock: 45,
        price: 299,
        category: 'إلكترونيات',
        status: 'in_stock',
        lastUpdated: '2024-01-15',
        merchantId: user?.$id || ''
      },
      {
        id: '2',
        name: 'سماعات لاسلكية',
        sku: 'HP-002',
        stock: 8,
        price: 149,
        category: 'إلكترونيات',
        status: 'low_stock',
        lastUpdated: '2024-01-14',
        merchantId: user?.$id || ''
      },
      {
        id: '3',
        name: 'حقيبة جلدية',
        sku: 'BG-003',
        stock: 0,
        price: 89,
        category: 'أزياء',
        status: 'out_of_stock',
        lastUpdated: '2024-01-13',
        merchantId: user?.$id || ''
      },
      {
        id: '4',
        name: 'كاميرا رقمية',
        sku: 'CM-004',
        stock: 23,
        price: 599,
        category: 'إلكترونيات',
        status: 'in_stock',
        lastUpdated: '2024-01-15',
        merchantId: user?.$id || ''
      },
      {
        id: '5',
        name: 'حذاء رياضي',
        sku: 'SH-005',
        stock: 5,
        price: 129,
        category: 'رياضة',
        status: 'low_stock',
        lastUpdated: '2024-01-12',
        merchantId: user?.$id || ''
      }
    ];

    // Filter products by merchant ID (security)
    const merchantProducts = filterMerchantProducts(sampleProducts, user?.$id || '');
    setProducts(merchantProducts);
    setFilteredProducts(merchantProducts);
  }, [user]);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, statusFilter, products]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-green-500">متوفر</Badge>;
      case 'low_stock':
        return <Badge className="bg-yellow-500">مخزون منخفض</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-500">نفذ المخزون</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  // Calculate stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.status === 'in_stock').length,
    lowStock: products.filter(p => p.status === 'low_stock').length,
    outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    totalValue: products.reduce((sum, p) => sum + (p.stock * p.price), 0)
  };

  // Update stock
  const updateStock = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        let status: Product['status'] = 'in_stock';
        if (newStock === 0) status = 'out_of_stock';
        else if (newStock < 10) status = 'low_stock';
        
        return { ...p, stock: newStock, status, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return p;
    }));
    toast.success('تم تحديث المخزون بنجاح');
  };

  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      ['الاسم', 'SKU', 'المخزون', 'السعر', 'الفئة', 'الحالة'],
      ...filteredProducts.map(p => [p.name, p.sku, p.stock, p.price, p.category, p.status])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('تم تصدير البيانات بنجاح');
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-900">متوفر</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.inStock}</div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-900">مخزون منخفض</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.lowStock}</div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-900">نفذ المخزون</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.outOfStock}</div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">قيمة المخزون</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ${stats.totalValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>إدارة المخزون</CardTitle>
              <CardDescription>تتبع وإدارة مخزون منتجاتك</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 ml-2" />
                تصدير
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 ml-2" />
                استيراد
              </Button>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 ml-2" />
                منتج جديد
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ابحث عن منتج أو SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="حالة المخزون" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="in_stock">متوفر</SelectItem>
                <SelectItem value="low_stock">مخزون منخفض</SelectItem>
                <SelectItem value="out_of_stock">نفذ المخزون</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>آخر تحديث</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      لا توجد منتجات
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.sku}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                          />
                        </div>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {product.lastUpdated}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      {stats.lowStock > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertTriangle className="w-5 h-5" />
              تنبيهات المخزون المنخفض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.filter(p => p.status === 'low_stock').map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">المخزون المتبقي: {product.stock}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    إعادة الطلب
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
