import { useEffect, useState } from 'react';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Link } from 'react-router-dom';

interface LowStockProduct {
  $id: string;
  name: string;
  stock: number;
  sku: string;
  price: number;
}

export default function LowStockAlert() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const LOW_STOCK_THRESHOLD = 10;

  useEffect(() => {
    loadLowStockProducts();
  }, [user]);

  const loadLowStockProducts = async () => {
    if (!user?.isMerchant) return;

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'products',
        [
          Query.equal('merchantId', user.$id),
          Query.lessThan('stock', LOW_STOCK_THRESHOLD),
          Query.orderAsc('stock')
        ]
      );

      setProducts(response.documents as any);
    } catch (error) {
      console.error('Error loading low stock products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isMerchant || loading) return null;
  if (products.length === 0) return null;

  const criticalStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  const mediumStock = products.filter(p => p.stock > 5 && p.stock < LOW_STOCK_THRESHOLD);

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <AlertTriangle className="h-5 w-5" />
          تنبيه: منتجات منخفضة المخزون
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-700">{criticalStock.length}</div>
            <div className="text-xs text-red-600">نفذ المخزون</div>
          </div>
          <div className="text-center p-3 bg-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">{lowStock.length}</div>
            <div className="text-xs text-orange-600">مخزون منخفض جداً</div>
          </div>
          <div className="text-center p-3 bg-yellow-100 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">{mediumStock.length}</div>
            <div className="text-xs text-yellow-600">مخزون منخفض</div>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.$id}
              className="flex items-center justify-between p-3 bg-white rounded-lg border"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{product.name}</p>
                <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={product.stock === 0 ? 'destructive' : 'secondary'}
                  className={
                    product.stock === 0
                      ? 'bg-red-100 text-red-700'
                      : product.stock <= 5
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }
                >
                  <Package className="h-3 w-3 ml-1" />
                  {product.stock}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {products.length > 5 && (
          <p className="text-sm text-center text-muted-foreground">
            و {products.length - 5} منتج آخر
          </p>
        )}

        <Button asChild className="w-full" variant="outline">
          <Link to="/merchant/products">
            <TrendingDown className="h-4 w-4 ml-2" />
            إدارة المخزون
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
