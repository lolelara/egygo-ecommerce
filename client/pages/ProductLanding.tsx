import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { databases } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { useCart } from "@/contexts/CartContext";
import { getImageUrl, getImageUrls } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProductGridSkeleton } from "@/components/LoadingSkeletons";
import { ErrorDisplay } from "@/components/ErrorBoundary";
import SEO from "@/components/SEO";
import {
  ShoppingCart,
  Star,
  Check,
  TrendingUp,
  Shield,
  Truck,
  RefreshCw,
  Timer,
  Heart,
  Share2,
} from "lucide-react";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';

export default function ProductLanding() {
  const { linkCode } = useParams<{ linkCode: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [linkData, setLinkData] = useState<any>(null);
  const [clickTracked, setClickTracked] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch affiliate link data
  const { data: affiliateLink, isLoading: linkLoading, error: linkError } = useQuery({
    queryKey: ["affiliate-link", linkCode],
    queryFn: async () => {
      if (!linkCode) throw new Error("Link code is required");
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        "affiliate_links",
        [Query.equal("linkCode", linkCode)]
      );

      if (response.documents.length === 0) {
        throw new Error("رابط غير صالح");
      }

      return response.documents[0];
    },
    enabled: !!linkCode,
  });

  // Fetch product data
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", affiliateLink?.productId],
    queryFn: () => productsApi.getById(affiliateLink.productId),
    enabled: !!affiliateLink?.productId,
  });

  // Track click mutation
  const trackClick = useMutation({
    mutationFn: async () => {
      if (!affiliateLink) return;

      await databases.updateDocument(
        DATABASE_ID,
        "affiliate_links",
        affiliateLink.$id,
        {
          clicks: (affiliateLink.clicks || 0) + 1,
          lastClickAt: new Date().toISOString(),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-link", linkCode] });
    },
  });

  // Track click once on mount
  useEffect(() => {
    if (affiliateLink && !clickTracked) {
      trackClick.mutate();
      setClickTracked(true);
      
      // Save affiliate ID for order tracking
      sessionStorage.setItem("referralAffiliateId", affiliateLink.affiliateId);
      sessionStorage.setItem("referralLinkCode", linkCode || "");
    }
  }, [affiliateLink, clickTracked]);

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = getImageUrl(product.images?.[0]);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      stockQuantity: (product as any).stock || product.stockQuantity || 0,
      inStock: (product as any).isActive ?? product.inStock ?? true,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    } as any);

    // Navigate to cart
    navigate("/cart");
  };

  const handleBuyNow = () => {
    if (!product) return;

    const imageUrl = getImageUrl(product.images?.[0]);

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      stockQuantity: (product as any).stock || product.stockQuantity || 0,
      inStock: (product as any).isActive ?? product.inStock ?? true,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    } as any);

    // Navigate directly to checkout
    navigate("/checkout");
  };

  // Loading state
  if (linkLoading || productLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
        <div className="container mx-auto px-4 py-8">
          <ProductGridSkeleton count={1} />
        </div>
      </div>
    );
  }

  // Error state
  if (linkError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-4">
          <ErrorDisplay
            error={linkError || new Error("المنتج غير موجود")}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <SEO
        title={`${product.name} - عرض خاص`}
        description={product.description}
        ogImage={getImageUrl(product.images?.[0])}
      />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-r from-primary via-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <Badge className="mb-4 bg-white text-primary hover:bg-white">
            🔥 عرض خاص لفترة محدودة
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {product.name}
          </h1>
          {discount > 0 && (
            <p className="text-2xl md:text-3xl font-semibold">
              وفّر {discount}% الآن!
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div>
            <Card className="overflow-hidden shadow-xl">
              <img
                src={getImageUrl(product.images?.[0])}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </Card>

            {/* Thumbnail Grid */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.slice(1, 5).map((img, idx: number) => {
                  const imageUrl = getImageUrl(img);
                  return (
                    <Card key={idx} className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                      <img
                        src={imageUrl}
                        alt={`${product.name} ${idx + 2}`}
                        className="w-full aspect-square object-cover"
                      />
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Info & CTA */}
          <div className="space-y-6">
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} ({product.reviewCount} تقييم)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-primary">
                  {product.price.toFixed(2)} جنيه
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)} جنيه
                  </span>
                )}
              </div>
              {discount > 0 && (
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  وفّر {(product.originalPrice! - product.price).toFixed(2)} جنيه
                </Badge>
              )}
            </div>

            {/* Benefits */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-5 w-5" />
                  <span>ضمان استرجاع المال خلال 14 يوم</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Truck className="h-5 w-5" />
                  <span>شحن مجاني للطلبات فوق 500 جنيه</span>
                </div>
                <div className="flex items-center gap-2 text-green-700">
                  <Shield className="h-5 w-5" />
                  <span>منتج أصلي 100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Stock Status */}
            {product.inStock ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-semibold">متوفر في المخزون</span>
              </div>
            ) : (
              <div className="text-red-600 font-semibold">
                غير متوفر حالياً
              </div>
            )}

            {/* Colors Selection */}
            {(product as any).colors && (product as any).colors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">اختر اللون:</Label>
                <div className="flex flex-wrap gap-2">
                  {(product as any).colors.map((color: string, index: number) => (
                    <Button
                      key={index}
                      variant={selectedColor === color ? "default" : "outline"}
                      className="min-w-[80px]"
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selection */}
            {(product as any).sizes && (product as any).sizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">اختر المقاس:</Label>
                <div className="flex flex-wrap gap-2">
                  {(product as any).sizes.map((size: string, index: number) => (
                    <Button
                      key={index}
                      variant={selectedSize === size ? "default" : "outline"}
                      className="min-w-[60px]"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="w-full text-lg h-14 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600"
                disabled={!product.inStock}
              >
                <ShoppingCart className="ml-2 h-6 w-6" />
                اشترِ الآن - وفّر {discount}%
              </Button>

              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="w-full text-lg h-14"
                disabled={!product.inStock}
              >
                أضف إلى السلة
              </Button>
            </div>

            {/* Social Share */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">تفاصيل المنتج</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        {product.reviewCount > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6">
              آراء العملاء ({product.reviewCount})
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500">
                  التقييمات قادمة قريباً...
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">دفع آمن</h3>
              <p className="text-sm text-gray-600">
                جميع المعاملات محمية ومشفرة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Truck className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">شحن سريع</h3>
              <p className="text-sm text-gray-600">
                توصيل خلال 2-5 أيام عمل
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">إرجاع مجاني</h3>
              <p className="text-sm text-gray-600">
                استرجاع المال خلال 14 يوم
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">الأكثر مبيعاً</h3>
              <p className="text-sm text-gray-600">
                يثق به آلاف العملاء
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Final CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              لا تفوت هذا العرض الخاص!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              احصل على {product.name} الآن بسعر مخفّض
            </p>
            <Button
              onClick={handleBuyNow}
              size="lg"
              className="text-xl px-12 h-16 bg-gradient-to-r from-primary to-orange-500"
              disabled={!product.inStock}
            >
              اطلب الآن - وفّر {discount}%!
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
