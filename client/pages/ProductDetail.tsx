import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { productsApi, queryKeys } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: [...queryKeys.products, id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
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
    : [{ url: "https://via.placeholder.com/600x600?text=No+Image", alt: product.name }];

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    toast({
      title: "تمت الإضافة لسلة التسوق",
      description: `تم إضافة ${quantity} من ${product.name} إلى سلة التسوق`,
    });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "تمت الإزالة من المفضلة" : "تمت الإضافة للمفضلة",
      description: isWishlisted
        ? "تم إزالة المنتج من قائمة المفضلة"
        : "تم إضافة المنتج إلى قائمة المفضلة",
    });
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

  // Mock reviews data
  const reviews = [
    {
      id: "1",
      userName: "أحمد محمد",
      rating: 5,
      comment: "منتج ممتاز جداً وبجودة عالية، أنصح بشرائه",
      date: "2025-09-15",
    },
    {
      id: "2",
      userName: "فاطمة علي",
      rating: 4,
      comment: "جيد جداً لكن التوصيل كان متأخر قليلاً",
      date: "2025-09-10",
    },
    {
      id: "3",
      userName: "محمود حسن",
      rating: 5,
      comment: "أفضل منتج اشتريته، يستحق السعر",
      date: "2025-09-05",
    },
  ];

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 10, percentage: 17 },
    { stars: 3, count: 3, percentage: 5 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ];

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
            <Link to={`/category/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage].url}
                alt={images[selectedImage].alt || product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  خصم {discount}%
                </Badge>
              )}
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
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? `متوفر (${product.stockQuantity})` : "غير متوفر"}
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

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">الكمية:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.inStock}
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
                      setQuantity(Math.min(product.stockQuantity, quantity + 1))
                    }
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.stockQuantity} متوفر)
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                  أضف إلى السلة
                </Button>
                <Button
                  size="lg"
                  variant={isWishlisted ? "default" : "outline"}
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
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
                disabled={!product.inStock}
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
            {user?.role !== "USER" && (
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
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Rating Summary */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold mb-2">
                        {product.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
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
                      </div>
                      <p className="text-sm text-muted-foreground">
                        بناءً على {product.reviewCount} تقييم
                      </p>
                    </div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2">
                        <span className="text-sm w-8">{item.stars} ⭐</span>
                        <Progress value={item.percentage} className="flex-1" />
                        <span className="text-sm text-muted-foreground w-12 text-left">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {review.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{review.userName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString("ar")}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {user && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">اكتب تقييمك</h3>
                  <Button>إضافة تقييم</Button>
                </CardContent>
              </Card>
            )}
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
                    <span>{product.category.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2 border-b">
                    <span className="font-semibold">الحالة</span>
                    <span>{product.inStock ? "متوفر" : "غير متوفر"}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-2">
                    <span className="font-semibold">الكمية المتوفرة</span>
                    <span>{product.stockQuantity}</span>
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
    </div>
  );
}
