import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Package,
  ArrowRight,
  Loader2,
  Plus,
  Minus,
  Check,
  ZoomIn,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { productsApi, queryKeys, wishlistApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import ProductReviews from "@/components/ProductReviews";
import { placeholder } from "@/lib/placeholder";
import { PageLoader } from "@/components/ui/loading-screen";

// Color mappings (للترجمة والعرض) - خارج الـ component لمنع re-creation
const COLOR_MAPPINGS: Record<string, {name: string, hex: string, border?: boolean}> = {
  'black': { name: "أسود", hex: "#000000" },
  'white': { name: "أبيض", hex: "#FFFFFF", border: true },
  'blue': { name: "أزرق", hex: "#3B82F6" },
  'red': { name: "أحمر", hex: "#EF4444" },
  'green': { name: "أخضر", hex: "#10B981" },
  'yellow': { name: "أصفر", hex: "#FBBF24" },
  'purple': { name: "بنفسجي", hex: "#A855F7" },
  'pink': { name: "وردي", hex: "#EC4899" },
  'gray': { name: "رمادي", hex: "#6B7280" },
  'brown': { name: "بني", hex: "#92400E" },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCart();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Wishlist hooks moved above early returns to preserve hooks order across renders
  // Check if product is in wishlist
  const { data: wishlistItems = [] } = useQuery({
    queryKey: queryKeys.wishlist(user?.$id || ""),
    queryFn: () => wishlistApi.getUserWishlist(user?.$id || ""),
    enabled: !!user?.$id,
  });

  const isWishlisted = useMemo(() => {
    return wishlistItems.some((item: any) => item.productId === id);
  }, [wishlistItems, id]);

  const wishlistItem = useMemo(() => {
    return wishlistItems.find((item: any) => item.productId === id);
  }, [wishlistItems, id]);

  // Add to wishlist mutation
  const addToWishlist = useMutation({
    mutationFn: () => wishlistApi.addToWishlist(user?.$id || "", id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.$id || "") });
      toast({
        title: "✅ تمت الإضافة للمفضلة",
        description: "تم إضافة المنتج إلى قائمة المفضلة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة المنتج للمفضلة",
        variant: "destructive",
      });
    },
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: () => wishlistApi.removeFromWishlist(wishlistItem?.id || "", user?.$id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.$id || "") });
      toast({
        title: "تمت الإزالة",
        description: "تم إزالة المنتج من قائمة المفضلة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إزالة المنتج من المفضلة",
        variant: "destructive",
      });
    },
  });

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: [...queryKeys.products, id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  // Calculate inventory from product data (using useMemo to prevent infinite loops)
  const inventory = useMemo(() => {
    if (!product) return [];
    
    try {
      const inventoryData = (product as any).colorSizeInventory;
      
      if (inventoryData && inventoryData !== '[]' && inventoryData !== '') {
        const parsed: Array<{color: string, size: string, quantity: number}> = JSON.parse(inventoryData);
        
        if (parsed.length > 0) {
          console.log('📦 Product inventory loaded:', { inventory: parsed });
          return parsed;
        }
      }
    } catch (error) {
      console.error('❌ Error parsing inventory:', error);
    }
    
    return [];
  }, [product?.id, (product as any)?.colorSizeInventory]);
  
  // Calculate total stock from inventory (using useMemo)
  const totalStock = useMemo(() => {
    if (!product) return 0;
    
    // If we have inventory with quantities
    if (inventory.length > 0) {
      const total = inventory.reduce((sum, item) => sum + (item.quantity || 0), 0);
      console.log('📦 Total stock from inventory:', total);
      return total;
    }
    
    // Fallback: Check if product has colors/sizes
    const colors = (product as any).colors || [];
    const sizes = (product as any).sizes || [];
    
    if (colors.length > 0 || sizes.length > 0) {
      console.log('✅ Product has colors/sizes, defaulting to stock: 999');
      return 999;
    }
    
    // Use old stock field
    const oldStock = (product as any).stock || product.stockQuantity || 0;
    console.log('📦 Using old stock or default:', oldStock || 999);
    return oldStock > 0 ? oldStock : 999;
  }, [product?.id, inventory]);

  // استخراج الألوان المتاحة من الـ inventory
  const availableColors = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    
    const uniqueColors = [...new Set(inventory
      .filter(item => item.quantity > 0 && item.color)
      .map(item => item.color.toLowerCase())
    )];
    
    return uniqueColors.map(color => ({
      name: COLOR_MAPPINGS[color]?.name || color,
      value: color,
      hex: COLOR_MAPPINGS[color]?.hex || '#999999',
      border: COLOR_MAPPINGS[color]?.border,
    }));
  }, [inventory]);

  // استخراج المقاسات المتاحة من الـ inventory
  const availableSizes = useMemo(() => {
    if (!inventory || inventory.length === 0) return [];
    
    const uniqueSizes = [...new Set(inventory
      .filter(item => item.quantity > 0 && item.size)
      .map(item => item.size.toUpperCase())
    )];
    
    // ترتيب المقاسات
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    return uniqueSizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [inventory]);

  if (isLoading) {
    return <PageLoader message="جاري تحميل تفاصيل المنتج..." />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
        <Button asChild>
          <Link to="/products">العودة للمنتجات</Link>
        </Button>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : [{ url: placeholder.product(product?.name), alt: product?.name || "منتج" }];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    // التحقق من اختيار اللون
    if (availableColors.length > 0 && !selectedColor) {
      toast({
        title: "يرجى اختيار اللون",
        description: "الرجاء اختيار لون المنتج قبل الإضافة للسلة",
        variant: "destructive",
      });
      return;
    }

    // التحقق من اختيار المقاس
    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "يرجى اختيار المقاس",
        description: "الرجاء اختيار مقاس المنتج قبل الإضافة للسلة",
        variant: "destructive",
      });
      return;
    }

    // إضافة المنتج للسلة
    const colorName = selectedColor ? availableColors.find(c => c.value === selectedColor)?.name : undefined;
    
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: images[0]?.url || "",
      quantity,
      stockQuantity: totalStock,
      inStock: totalStock > 0,
      color: colorName,
      size: selectedSize || undefined,
    });

    const details = [colorName, selectedSize].filter(Boolean).join(" - ");

    toast({
      title: "✅ تمت الإضافة لسلة التسوق",
      description: `تم إضافة ${quantity} من ${product.name}${details ? ` (${details})` : ""} إلى سلة التسوق`,
    });
  };


  const handleToggleWishlist = () => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول لإضافة المنتجات إلى المفضلة",
        variant: "destructive",
      });
      return;
    }

    if (isWishlisted) {
      removeFromWishlist.mutate();
    } else {
      addToWishlist.mutate();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "تم النسخ",
        description: "تم نسخ رابط المنتج إلى الحافظة",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              الرئيسية
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground">
              المنتجات
            </Link>
            <span>/</span>
            {product.category?.slug ? (
              <Link to={`/category/${product.category.slug}`} className="hover:text-foreground">
                {product.category.name}
              </Link>
            ) : (
              <span className="text-muted-foreground">{product.category?.name || 'غير محدد'}</span>
            )}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div 
              className="relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
              onMouseEnter={() => setIsImageZoomed(true)}
              onMouseLeave={() => setIsImageZoomed(false)}
            >
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isImageZoomed ? "scale-110" : "scale-100"
                }`}
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  خصم {discount}%
                </Badge>
              )}
              {/* Zoom Icon Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground mr-2">
                    ({product.reviewCount} تقييم)
                  </span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <Badge variant={totalStock > 0 ? "default" : "destructive"}>
                  {totalStock > 0 ? `متوفر (${totalStock})` : "غير متوفر"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} ج.م
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString()} ج.م
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-green-600">
                  وفّر {(product.originalPrice - product.price).toLocaleString()} ج.م
                </p>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">وصف المنتج</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">
                  اللون: {selectedColor && <span className="text-primary">{availableColors.find(c => c.value === selectedColor)?.name}</span>}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`relative w-12 h-12 rounded-full transition-all ${
                        selectedColor === color.value
                          ? "ring-2 ring-primary ring-offset-2 scale-110"
                          : "hover:scale-105"
                      } ${color.border ? "border-2 border-gray-300" : ""}`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor === color.value && (
                        <Check className="h-6 w-6 absolute inset-0 m-auto text-white drop-shadow-lg" 
                          style={{ 
                            color: color.value === "white" ? "#000000" : "#ffffff" 
                          }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">
                  المقاس: {selectedSize && <span className="text-primary">{selectedSize}</span>}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">الكمية:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={totalStock === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(totalStock, quantity + 1))
                    }
                    disabled={totalStock === 0}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({totalStock} متوفر)
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 btn-hover-lift"
                  onClick={handleAddToCart}
                  disabled={totalStock === 0}
                >
                  <ShoppingCart className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                  أضف إلى السلة
                </Button>
                <Button
                  size="lg"
                  variant={isWishlisted ? "default" : "outline"}
                  onClick={handleToggleWishlist}
                  disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                >
                  {addToWishlist.isPending || removeFromWishlist.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button
                size="lg"
                variant="secondary"
                className="w-full"
                asChild
                disabled={totalStock === 0}
              >
                <Link to="/cart">
                  اشتر الآن
                  <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                </Link>
              </Button>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">شحن مجاني</p>
                    <p className="text-sm text-muted-foreground">
                      للطلبات فوق 500 ج.م
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">ضمان الجودة</p>
                    <p className="text-sm text-muted-foreground">
                      ضمان استرجاع المال لمدة 14 يوم
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">توصيل سريع</p>
                    <p className="text-sm text-muted-foreground">
                      يصلك خلال 2-5 أيام عمل
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliate Info */}
            {user?.role !== "customer" && (
              <Card className="bg-gradient-to-br from-primary/10 to-brand-purple/10">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">عمولة الشركاء</h3>
                  <p className="text-2xl font-bold text-primary">
                    {product.affiliateCommission}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    اكسب {((product.price * product.affiliateCommission) / 100).toLocaleString()}{" "}
                    ج.م على كل عملية بيع
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="reviews" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">التقييمات ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="specs">المواصفات</TabsTrigger>
            <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
          </TabsList>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <ProductReviews productId={product.id} />
          </TabsContent>

          {/* Specs Tab */}
          <TabsContent value="specs">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 py-2 border-b">
                    <span className="font-semibold">رمز المنتج (SKU)</span>
                    <span>{product.sku || "غير متوفر"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b">
                    <span className="font-semibold">الفئة</span>
                    <span>{product.category?.name || 'غير محدد'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b">
                    <span className="font-semibold">الحالة</span>
                    <span>{totalStock > 0 ? "متوفر" : "غير متوفر"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <span className="font-semibold">الكمية المتوفرة</span>
                    <span>{totalStock}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">سياسة الشحن</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• شحن مجاني للطلبات فوق 500 ج.م</li>
                    <li>• التوصيل خلال 2-5 أيام عمل</li>
                    <li>• الدفع عند الاستلام متاح</li>
                    <li>• تتبع الشحنة متاح لجميع الطلبات</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">سياسة الإرجاع</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• إمكانية الإرجاع خلال 14 يوم من تاريخ الاستلام</li>
                    <li>• يجب أن يكون المنتج في حالته الأصلية</li>
                    <li>• استرجاع كامل المبلغ أو استبدال المنتج</li>
                    <li>• تكلفة الشحن على العميل في حالة الإرجاع</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>

          {/* Main Image */}
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt || product.name}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ArrowRight className="w-6 h-6 text-white rotate-180" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(index);
                  }}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || ""}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
