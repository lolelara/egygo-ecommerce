import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Percent, Gift, Star, Clock, ShoppingCart, TrendingDown, Loader2, Zap, Heart, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi, queryKeys } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import RotatingBanner from "@/components/banners/RotatingBanner";
import { getBannersByLocation, getBannerSettings } from "@/lib/banners-api";

export default function DealsPage() {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  // Fetch banners
  const { data: bannersData } = useQuery({
    queryKey: ['banners', 'offers'],
    queryFn: () => getBannersByLocation('offers'),
  });

  const { data: bannerSettings } = useQuery({
    queryKey: ['bannerSettings', 'offers'],
    queryFn: () => getBannerSettings('offers'),
  });

  // Fetch featured deals from admin-selected products
  const { data: productsData, isLoading } = useQuery({
    queryKey: [...queryKeys.products, 'deals'],
    queryFn: async () => {
      try {
        // First try to get explicitly marked flash deals
        const flashDealsData = await productsApi.getAll({ isFlashDeal: true, limit: 50 });

        if (flashDealsData.products.length > 0) {
          return flashDealsData.products;
        }

        // Fallback to original logic (products with discounts)
        console.log('No flash deals found, using fallback');
        const data = await productsApi.getAll({ limit: 50 });
        const dealsProducts = data.products.filter(
          (product: any) => product.originalPrice && product.originalPrice > product.price
        );
        return dealsProducts.sort((a: any, b: any) => {
          const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
          const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
          return discountB - discountA;
        });
      } catch (error) {
        console.error("Error fetching deals:", error);
        return [];
      }
    },
  });

  const deals = productsData || [];

  const calculateDiscount = (originalPrice: number, price: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleQuickAdd = async (product: any) => {
    setLoadingProduct(product.id);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images?.[0]?.url || product.image,
      quantity: 1,
      stockQuantity: product.stockQuantity || 999,
      inStock: true,
    });
    toast({
      title: "✅ تمت الإضافة للسلة",
      description: `${product.name} تم إضافته لسلة التسوق`,
    });
    setTimeout(() => setLoadingProduct(null), 500);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">العروض الخاصة</h1>
          <p className="text-muted-foreground">أفضل العروض والخصومات المتاحة الآن</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-500/10 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/10 dark:to-yellow-950/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 mb-4 animate-pulse">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold">عروض البرق ⚡</h1>
            <p className="text-lg text-muted-foreground">
              وفّر حتى <span className="text-3xl font-bold text-red-600">70%</span> على منتجات مختارة
            </p>
            {deals.length > 0 && (
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg px-4 py-2">
                  {deals.length} عرض متاح الآن
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Clock className="h-4 w-4 ml-1" />
                  ينتهي قريباً
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banners Section */}
      {bannersData && bannersData.length > 0 && (
        <div className="container mx-auto px-4 py-4">
          <RotatingBanner
            banners={bannersData}
            autoPlayInterval={bannerSettings?.autoPlayInterval || 5}
            showControls={bannerSettings?.showControls ?? true}
            height={bannerSettings?.height || '300px'}
            location="offers"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-12">

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-20">
              <div className="text-center space-y-6">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 mx-auto flex items-center justify-center">
                  <Gift className="h-12 w-12 text-red-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">لا توجد عروض متاحة حالياً</h2>
                  <p className="text-muted-foreground mb-6">
                    تابعنا للحصول على إشعار عند توفر عروض جديدة 🔔
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-600">
                    <Link to="/products">
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      تصفح المنتجات
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/categories">
                      الفئات
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((product: any) => {
              const discount = calculateDiscount(product.originalPrice, product.price);
              const savings = product.originalPrice - product.price;

              return (
                <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-red-500/50">
                  {/* Badges */}
                  <div className="relative">
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-lg font-bold px-3 py-1 shadow-lg">
                        -{discount}%
                      </Badge>
                      {discount >= 50 && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 animate-pulse">
                          <Zap className="h-3 w-3 ml-1" />
                          HOT
                        </Badge>
                      )}
                    </div>

                    {/* Product Image */}
                    <Link to={`/product/${product.id}`}>
                      <div className="h-48 overflow-hidden bg-muted">
                        <img
                          src={product.images?.[0]?.url || product.image || '/placeholder.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  </div>

                  <CardHeader>
                    <Link to={`/product/${product.id}`}>
                      <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Price Section */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary">
                          {product.price.toLocaleString()} ج.م
                        </span>
                        <span className="text-lg line-through text-muted-foreground">
                          {product.originalPrice.toLocaleString()} ج.م
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          وفّر {savings.toLocaleString()} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Stock & Rating */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>ينتهي قريباً</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        onClick={() => handleQuickAdd(product)}
                        disabled={loadingProduct === product.id}
                      >
                        {loadingProduct === product.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            أضف للسلة
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link to={`/product/${product.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Coming Soon Section */}
        <Card className="mt-12 bg-gradient-to-r from-orange-500/10 via-red-50 to-purple-500/10 dark:from-orange-950/20 dark:via-red-950/10 dark:to-purple-950/20 border-2">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">المزيد من العروض قريباً! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              تابعنا للحصول على أحدث العروض والخصومات الحصرية
            </p>
            <div className="flex gap-3 justify-center">
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5 ml-2" />
                فعّل الإشعارات
              </Button>
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-600">
                <Link to="/products">
                  تصفح المنتجات
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
