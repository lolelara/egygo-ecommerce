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
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [inventory, setInventory] = useState<Array<{color: string, size: string, quantity: number}>>([]);
  const [totalStock, setTotalStock] = useState<number>(0);
  const queryClient = useQueryClient();
  
  // Get quantity for selected color/size combo
  const getAvailableQuantity = () => {
    if (!selectedColor || !selectedSize || inventory.length === 0) {
      return 0;
    }
    const item = inventory.find(i => i.color === selectedColor && i.size === selectedSize);
    return item?.quantity || 0;
  };

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
  
  // Process inventory data and filter available colors/sizes
  useEffect(() => {
    if (!product) return;
    
    console.log('🔍 Product data:', product);
    console.log('📦 colorSizeInventory:', (product as any).colorSizeInventory);
    console.log('🎨 colors:', (product as any).colors);
    console.log('📏 sizes:', (product as any).sizes);
    
    try {
      const inventoryData = (product as any).colorSizeInventory;
      
      // Check if inventory data exists and is not empty
      if (inventoryData && inventoryData !== '[]' && inventoryData !== '') {
        const parsed: Array<{color: string, size: string, quantity: number}> = JSON.parse(inventoryData);
        console.log('✅ Parsed inventory:', parsed);
        
        if (parsed.length > 0) {
          setInventory(parsed);
          
          // Calculate total stock
          const total = parsed.reduce((sum, item) => sum + (item.quantity || 0), 0);
          setTotalStock(total);
          console.log('📊 Total stock:', total);
          
          // Get unique colors and sizes that have quantity > 0
          const availColorsSet = new Set<string>();
          const availSizesSet = new Set<string>();
          
          parsed.forEach(item => {
            if (item.quantity > 0) {
              availColorsSet.add(item.color);
              availSizesSet.add(item.size);
            }
          });
          
          setAvailableColors(Array.from(availColorsSet));
          setAvailableSizes(Array.from(availSizesSet));
          
          // Auto-select first available options
          if (availColorsSet.size > 0 && !selectedColor) {
            setSelectedColor(Array.from(availColorsSet)[0]);
          }
          if (availSizesSet.size > 0 && !selectedSize) {
            setSelectedSize(Array.from(availSizesSet)[0]);
          }
          
          return; // Exit early if inventory system is active
        }
      }
      
      // Fallback: No inventory system or empty inventory
      console.log('⚠️ No inventory data, using fallback');
      const colors = (product as any).colors || [];
      const sizes = (product as any).sizes || [];
      setAvailableColors(colors);
      setAvailableSizes(sizes);
      
      // If product has colors/sizes, assume it's available
      if (colors.length > 0 || sizes.length > 0) {
        setTotalStock(999);
        console.log('✅ Product has colors/sizes, setting stock to 999');
      } else {
        // If no colors/sizes, check old stock field
        const oldStock = (product as any).stock || (product as any).stockQuantity || 0;
        setTotalStock(oldStock > 0 ? oldStock : 999);
        console.log('📦 Using old stock:', oldStock || 999);
      }
      
    } catch (error) {
      console.error('❌ Error parsing inventory:', error);
      // Fallback on error
      const colors = (product as any).colors || [];
      const sizes = (product as any).sizes || [];
      setAvailableColors(colors);
      setAvailableSizes(sizes);
      setTotalStock(999); // Assume available on error
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    const imageUrl = getImageUrl(product.images?.[0]);
    const availableStock = inventory.length > 0 && selectedColor && selectedSize 
      ? getAvailableQuantity() 
      : totalStock;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      stockQuantity: availableStock,
      inStock: totalStock > 0,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    } as any);

    // Navigate to cart
    navigate("/cart");
  };

  const handleBuyNow = () => {
    if (!product) return;

    const imageUrl = getImageUrl(product.images?.[0]);
    const availableStock = inventory.length > 0 && selectedColor && selectedSize 
      ? getAvailableQuantity() 
      : totalStock;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      stockQuantity: availableStock,
      inStock: totalStock > 0,
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
            {totalStock > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="font-semibold">متوفر في المخزون</span>
                {inventory.length > 0 && selectedColor && selectedSize && (
                  <span className="text-sm text-muted-foreground">
                    ({getAvailableQuantity()} متوفر)
                  </span>
                )}
              </div>
            ) : (
              <div className="text-red-600 font-semibold">
                غير متوفر حالياً
              </div>
            )}

            {/* Colors Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">اختر اللون:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color: string, index: number) => (
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
                {selectedColor && (
                  <p className="text-sm text-muted-foreground">
                    تم اختيار: <span className="font-semibold">{selectedColor}</span>
                  </p>
                )}
              </div>
            )}

            {/* Sizes Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">اختر المقاس:</Label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size: string, index: number) => (
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
                {selectedSize && selectedColor && inventory.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    الكمية المتاحة: <span className="font-semibold">
                      {inventory.find(item => item.color === selectedColor && item.size === selectedSize)?.quantity || 0} قطعة
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                size="lg"
                className="w-full text-lg h-14 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600"
                disabled={totalStock === 0}
              >
                <ShoppingCart className="ml-2 h-6 w-6" />
                اشترِ الآن - وفّر {discount}%
              </Button>

              <Button
                onClick={handleAddToCart}
                variant="outline"
                size="lg"
                className="w-full text-lg h-14"
                disabled={totalStock === 0}
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

        {/* Inventory Table */}
        {inventory.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">المخزون المتاح</h2>
              <Badge variant="outline" className="text-lg px-4 py-2">
                إجمالي المخزون: {totalStock} قطعة
              </Badge>
            </div>
            <Card className="overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                        المقاس
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                        اللون
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-bold uppercase tracking-wider">
                        الكمية المتاحة
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                          {item.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                          {item.color}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant={item.quantity > 10 ? "default" : item.quantity > 0 ? "secondary" : "destructive"}
                            className="text-sm font-semibold px-3 py-1"
                          >
                            {item.quantity} قطعة
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

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
