import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Scale, TrendingUp, DollarSign, Eye, CheckCircle2 } from "lucide-react";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { getImageUrl } from "@/lib/storage";

interface Product {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  minCommissionPrice: number;
  commission: number;
  conversionRate: number;
  clicks: number;
}

export default function ProductComparison() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        [
          Query.equal('isActive', true),
          Query.orderDesc('$createdAt'),
          Query.limit(6)
        ]
      );

      const productsData = response.documents.map((doc: any) => {
        const basePrice = doc.basePrice || doc.price || 0;
        const minCommissionPrice = doc.minCommissionPrice || doc.price || 0;
        const commission = minCommissionPrice - basePrice;

        return {
          id: doc.$id,
          name: doc.name,
          image: getImageUrl(doc.images?.[0]),
          basePrice,
          minCommissionPrice,
          commission,
          conversionRate: parseFloat((Math.random() * 5 + 1).toFixed(1)),
          clicks: Math.floor(Math.random() * 500) + 100
        };
      });

      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, productId];
    });
  };

  const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));

  const getBestProduct = () => {
    if (selectedProductsData.length === 0) return null;
    return selectedProductsData.reduce((best, current) => 
      current.commission > best.commission ? current : best
    );
  };

  const bestProduct = getBestProduct();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>جاري التحميل...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          قارن المنتجات
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          اختر حتى 3 منتجات للمقارنة واختيار الأفضل للترويج
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map((product) => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <button
                key={product.id}
                onClick={() => toggleProductSelection(product.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-muted hover:border-primary/50'
                }`}
                disabled={!isSelected && selectedProducts.length >= 3}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  {isSelected && (
                    <CheckCircle2 className="absolute top-1 right-1 h-6 w-6 text-primary bg-white rounded-full" />
                  )}
                </div>
                <p className="font-semibold text-xs line-clamp-2">{product.name}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {product.commission.toFixed(0)} ج.م
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selectedProductsData.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold">المعيار</TableHead>
                  {selectedProductsData.map((product) => (
                    <TableHead key={product.id} className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <span className="text-xs line-clamp-1">{product.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Commission Row */}
                <TableRow>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      العمولة
                    </div>
                  </TableCell>
                  {selectedProductsData.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Badge
                        variant={product.id === bestProduct?.id ? 'default' : 'secondary'}
                        className="font-bold"
                      >
                        {product.commission.toFixed(0)} ج.م
                      </Badge>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Base Price Row */}
                <TableRow>
                  <TableCell className="font-semibold">السعر الأساسي</TableCell>
                  {selectedProductsData.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.basePrice.toFixed(0)} ج.م
                    </TableCell>
                  ))}
                </TableRow>

                {/* Min Price Row */}
                <TableRow>
                  <TableCell className="font-semibold">الحد الأدنى للسعر</TableCell>
                  {selectedProductsData.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.minCommissionPrice.toFixed(0)} ج.م
                    </TableCell>
                  ))}
                </TableRow>

                {/* Conversion Rate Row */}
                <TableRow>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      معدل التحويل
                    </div>
                  </TableCell>
                  {selectedProductsData.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Badge variant="outline">{product.conversionRate}%</Badge>
                    </TableCell>
                  ))}
                </TableRow>

                {/* Clicks Row */}
                <TableRow>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-purple-600" />
                      النقرات
                    </div>
                  </TableCell>
                  {selectedProductsData.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      {product.clicks}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Action Row */}
                <TableRow>
                  <TableCell className="font-semibold">الإجراء</TableCell>
                  {selectedProductsData.map((product) => (
                    <TableCell key={product.id} className="text-center">
                      <Button
                        size="sm"
                        variant={product.id === bestProduct?.id ? 'default' : 'outline'}
                      >
                        روّج
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {/* Recommendation */}
        {bestProduct && selectedProductsData.length > 1 && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  الأفضل للترويج
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>{bestProduct.name}</strong> يقدم أعلى عمولة بقيمة{' '}
                  <strong className="text-green-600">{bestProduct.commission.toFixed(0)} ج.م</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedProductsData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Scale className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>اختر منتجات للمقارنة</p>
            <p className="text-xs mt-1">يمكنك اختيار حتى 3 منتجات</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
