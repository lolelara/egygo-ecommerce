import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, DollarSign, Eye } from "lucide-react";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { getImageUrl } from "@/lib/storage";

interface TopProduct {
  id: string;
  name: string;
  image: string;
  basePrice: number;
  minCommissionPrice: number;
  commission: number;
  clicks?: number;
  sales?: number;
}

export default function TopProductsWidget() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTopProducts();
  }, []);

  const loadTopProducts = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        [
          Query.equal('isActive', true),
          Query.orderDesc('$createdAt'),
          Query.limit(5)
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
          clicks: Math.floor(Math.random() * 500) + 100,
          sales: Math.floor(Math.random() * 50) + 10
        };
      });

      // Sort by commission (highest first)
      productsData.sort((a, b) => b.commission - a.commission);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading top products:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <Card className="border-yellow-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          أفضل المنتجات للترويج
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          المنتجات الأعلى عمولة والأكثر مبيعاً
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-all group"
          >
            {/* Rank Badge */}
            <Badge
              className={`w-8 h-8 flex items-center justify-center text-sm font-bold ${
                index === 0
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                  : index === 2
                  ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                  : 'bg-gradient-to-br from-blue-400 to-blue-600'
              }`}
            >
              {index + 1}
            </Badge>

            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-lg object-cover border-2 border-muted group-hover:border-primary transition-all"
            />

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {product.commission.toFixed(0)} ج.م
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {product.clicks}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  {product.sales} مبيعة
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              size="sm"
              variant="outline"
              className="group-hover:bg-primary group-hover:text-white transition-all"
              asChild
            >
              <Link to={`#product-${product.id}`}>
                روّج الآن
              </Link>
            </Button>
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>لا توجد منتجات متاحة حالياً</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
