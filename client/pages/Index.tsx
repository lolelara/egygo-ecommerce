import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  ShoppingCart,
  Users,
  TrendingUp,
  Award,
  Loader2,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Headphones,
  Truck,
  Clock4,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/storage";
import { productsApi, categoriesApi, queryKeys } from "@/lib/api";
import { EnhancedSEO, pageSEO } from "@/components/EnhancedSEO";
import { placeholder } from "@/lib/placeholder";
import EgyGoLogo3D from "@/components/enhanced/EgyGoLogo3D";
import SwiperProductSlider from '@/components/enhanced/SwiperProductSlider';
import { useEffect } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  // Initialize GSAP animations
  useEffect(() => {
    // Only animate if elements exist
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    }
    
    const featureCards = document.querySelectorAll('.feature-card');
    const featuresSection = document.querySelector('.features-section');
    if (featureCards.length > 0 && featuresSection) {
      gsap.from('.feature-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%'
        }
      });
    }
    
    const productCards = document.querySelectorAll('.product-card');
    const productsSection = document.querySelector('.products-section');
    if (productCards.length > 0 && productsSection) {
      gsap.from('.product-card', {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.products-section',
          start: 'top 80%'
        }
      });
    }
  }, []);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
  });

  // Fetch featured products (first 4 products sorted by featured)
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: [...queryKeys.products, "featured"],
    queryFn: () => productsApi.getAll({ sortBy: "featured", limit: 4 }),
  });

  // Fetch best sellers (products with high review count)
  const { data: bestSellersData, isLoading: bestSellersLoading } = useQuery({
    queryKey: [...queryKeys.products, "bestsellers"],
    queryFn: () => productsApi.getAll({ sortBy: "rating", limit: 4 }),
  });

  const categories = categoriesData?.categories || [];
  const featuredProducts = featuredData?.products || [];
  const bestSellers =
    bestSellersData?.products.filter((p) => p.reviewCount > 50) || [];

  if (categoriesLoading || featuredLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      <EnhancedSEO {...pageSEO.home()} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-purple-600 to-secondary text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* 3D Logo Background - خلف كل المحتوى مع دوران بطيء */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25 scale-[2] blur-[1px]">
          <div className="w-full h-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
            <EgyGoLogo3D 
              size="large" 
              interactive={false} 
              autoRotate={true} 
              showParticles={false}
              colorScheme="gradient"
            />
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 hero-content">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary bg-gradient-to-r from-white to-yellow-50 shadow-lg">
                  ✨ منتجات مميزة
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  تسوق بذكاء،
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent"> اربح أكثر</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  اكتشف مجموعة متنوعة من المنتجات عالية الجودة وانضم لبرنامج الشراكة لتحقيق دخل إضافي مميز.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-primary font-semibold btn-hover-lift"
                  asChild
                >
                  <Link to="/products">
                    تسوق الآن
                    <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 btn-hover-lift"
                  asChild
                >
                  <Link to="/affiliate">
                    <Users className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                    انضم لبرنامج الشراكة
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="text-2xl font-bold text-yellow-300">+10K</div>
                  <div className="text-sm text-white/80">عميل راضي</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="text-2xl font-bold text-green-300">+500</div>
                  <div className="text-sm text-white/80">منتج</div>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all">
                  <div className="text-2xl font-bold text-blue-300">+1K</div>
                  <div className="text-sm text-white/80">مسوق</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-4">
                  {featuredProducts.slice(0, 2).map((product, index) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                        <CardContent className="p-4">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-white text-sm">
                            {product.name}
                          </h3>
                          <p className="text-brand-yellow font-bold">
                            ${product.price}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
                <div className="space-y-4 mt-8">
                  {featuredProducts.slice(2, 4).map((product, index) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                        <CardContent className="p-4">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-white text-sm">
                            {product.name}
                          </h3>
                          <p className="text-brand-yellow font-bold">
                            ${product.price}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics - إحصائيات المنصة */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">📊 إحصائيات المنصة</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            منصة موثوقة يستخدمها الآلاف
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            انضم لمجتمع متنامي من التجار والمسوقين والعملاء الراضين
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-primary mb-2">+10,000</div>
            <div className="text-muted-foreground">عميل نشط</div>
          </Card>
          <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-brand-purple mb-2">+500</div>
            <div className="text-muted-foreground">تاجر ناجح</div>
          </Card>
          <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-brand-orange mb-2">+2,000</div>
            <div className="text-muted-foreground">مسوق نشط</div>
          </Card>
          <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
            <div className="text-4xl font-bold text-success mb-2">5M+</div>
            <div className="text-muted-foreground">جنيه مبيعات</div>
          </Card>
        </div>
      </section>

      {/* How It Works - كيف تعمل المنصة */}
      <section className="bg-muted/40 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4">⚙️ كيف تعمل</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              ابدأ رحلتك في 3 خطوات بسيطة
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              سواء كنت تاجر، مسوق، أو عميل - نحن نسهل عليك البداية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* للعملاء */}
            <Card className="p-6 hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">للعملاء</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">تصفح المنتجات</h4>
                    <p className="text-sm text-muted-foreground">اكتشف آلاف المنتجات عالية الجودة</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">أضف للسلة</h4>
                    <p className="text-sm text-muted-foreground">اختر ما يعجبك وأضفه لسلة المشتريات</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">اطلب واستلم</h4>
                    <p className="text-sm text-muted-foreground">ادفع واستلم طلبك في 2-4 أيام</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* للتجار */}
            <Card className="p-6 border-brand-purple hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-full mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">للتجار</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">سجل حساب</h4>
                    <p className="text-sm text-muted-foreground">انشئ حساب تاجر مجاناً</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">أضف منتجاتك</h4>
                    <p className="text-sm text-muted-foreground">ارفع منتجاتك وحدد الأسعار والعمولات</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">ابدأ البيع</h4>
                    <p className="text-sm text-muted-foreground">راقب مبيعاتك واستلم أرباحك أسبوعياً</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* للمسوقين */}
            <Card className="p-6 border-brand-orange hover:shadow-xl transition-all">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-full mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">للمسوقين</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">انضم مجاناً</h4>
                    <p className="text-sm text-muted-foreground">سجل كمسوق بدون أي رسوم</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">احصل على روابطك</h4>
                    <p className="text-sm text-muted-foreground">اختر المنتجات وخذ روابط التسويق</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">سوّق واربح</h4>
                    <p className="text-sm text-muted-foreground">اربح عمولة لحد 25% على كل بيعة</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            تسوق حسب الفئة
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            اكتشف مجموعتنا الواسعة من المنتجات عبر فئات مختلفة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.filter(cat => cat.slug).map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group"
            >
              <Card className="overflow-hidden card-hover group">
                <div className="relative">
                  <img
                    src={category.image || placeholder.category(category.name)}
                    alt={category.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.productCount} منتج
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products with Swiper */}
      <section className="container mx-auto px-4 products-section">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              المنتجات المميزة
            </h2>
            <p className="text-muted-foreground text-lg">
              منتجات مختارة بعناية خصيصًا لك
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/products">
              عرض الكل
              <ArrowRight className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        {featuredProducts.length > 0 && (
          <SwiperProductSlider 
            products={featuredProducts.map(p => ({
              id: p.id,
              name: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              image: getImageUrl(p.images?.[0]),
              rating: p.rating,
              reviews: p.reviewCount,
              badge: p.originalPrice && p.originalPrice > p.price ? `وفر $${(p.originalPrice - p.price).toFixed(0)}` : undefined,
              description: p.description || ''
            }))}
            variant="cards"
            autoplay={true}
          />
        )}
      </section>

      {/* Affiliate Program CTA */}
      <section className="bg-gradient-to-r from-brand-orange to-brand-purple text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="text-brand-orange bg-white/90"
                >
                  💰 برنامج الشراكة
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  ابدأ تكسب دلوقتي مع برنامج الشراكة
                </h2>
                <p className="text-xl text-white/90">
                  انضم لآلاف المسوقين الناجحين واكسب عمولة لحد 25% على كل
                  عملية بيع تيجي منك. الانضمام مجاني وعندنا كل الأدوات اللي
                  تحتاجها عشان تنجح.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">لحد 25%</div>
                  <div className="text-sm text-white/80">عمولة</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Users className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">+1000</div>
                  <div className="text-sm text-white/80">مسوق نشط</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Award className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-bold text-lg">+10 مليون جنيه</div>
                  <div className="text-sm text-white/80">اتدفع عمولات</div>
                </div>
              </div>

              <Button
                size="lg"
                variant="secondary"
                className="text-primary font-semibold"
                asChild
              >
                <Link to="/affiliate">
                  انضم لبرنامج الشراكة
                  <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader>
                  <CardTitle className="text-white">
                    لماذا تختار برنامجنا؟
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        معدلات عمولة عالية
                      </h4>
                      <p className="text-white/80 text-sm">
                        اكسب 8-25% عمولة على جميع المبيعات
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">تتبع فوري</h4>
                      <p className="text-white/80 text-sm">
                        راقب أداءك وأرباحك مباشرة
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">دعم تسويقي</h4>
                      <p className="text-white/80 text-sm">
                        احصل على بانرات وروابط ومواد ترويجية
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-yellow flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">دفعات سريعة</h4>
                      <p className="text-white/80 text-sm">
                        دفعات أسبوعية عبر PayPal أو التحويل البنكي
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              الأكثر مبيعًا
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              منتجاتنا الأكثر شعبية المحبوبة من العملاء حول العالم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="relative">
                    <img
                      src={getImageUrl(product.images?.[0])}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
                      الأكثر مبيعًا
                    </Badge>
                    <div className="absolute top-2 right-2 bg-brand-orange text-white text-xs px-2 py-1 rounded">
                      {product.affiliateCommission}% عمولة
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">
                            ${product.price}
                          </span>
                          {product.originalPrice &&
                            product.originalPrice > product.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                        </div>
                      </div>
                      <Button size="sm">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Trust Signals & Customer Care */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary">
                لماذا إيجي جو؟
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                ثقة كاملة، دعم حقيقي، وتجربة تسوق ولا أسهل
              </h2>
              <p className="text-muted-foreground text-lg">
                بنقدم لك أقوى تجربة تسوق إلكتروني في مصر: منتجات أصلية مضمونة،
                دعم عربي 24/7، وسياسة إرجاع سهلة. هدفنا إنك تشتري وتكسب وأنت مطمن.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[{
                  icon: ShieldCheck,
                  title: "ضمان استرجاع 30 يوم",
                  description: "في حالة المنتج مش مطابق للتوقعات، نرجعلك فلوسك بالكامل بدون أسئلة."
                }, {
                  icon: Truck,
                  title: "شحن سريع داخل مصر",
                  description: "شراكتنا مع أفضل شركات الشحن تضمن توصيل الطلب في 2-4 أيام عمل."
                }, {
                  icon: Headphones,
                  title: "خدمة عملاء ودعم تسويقي",
                  description: "فريق عربي جاهز يساعدك بالهاتف، الواتساب، أو الإيميل طول اليوم."
                }, {
                  icon: Clock4,
                  title: "تتبع لحظي للطلبات",
                  description: "تابع حالة الطلب لحظة بلحظة من حسابك أو عبر صفحة تتبع الطلبات."
                }].map((item) => (
                  <Card key={item.title} className="h-full">
                    <CardContent className="flex h-full flex-col gap-3 p-5">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">
                  آراء عملائنا
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[{
                  name: "محمود السيد",
                  role: "مسوق شريك",
                  quote: "أرباحي زادت 3 أضعاف من أول شهر مع إيجي جو. لوحة التحكم واضحة، والعمولات بتتصرف في مواعيدها."
                }, {
                  name: "إسراء أحمد",
                  role: "عميلة",
                  quote: "تجربة الشراء كانت ممتازة، خدمة العملاء ساعدوني أختار الهدية المناسبة ووصلت في يومين."
                }].map((testimonial) => (
                  <div key={testimonial.name} className="rounded-xl bg-muted/80 p-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      “{testimonial.quote}”
                    </p>
                    <div className="mt-4 text-sm font-semibold">
                      {testimonial.name}
                      <span className="ms-2 text-xs text-muted-foreground">
                        • {testimonial.role}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="rounded-xl border border-dashed border-primary/50 p-5 text-center">
                  <h3 className="text-lg font-semibold mb-1">عايز تتأكد بنفسك؟</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    تواصل مع فريق الدعم أو اطلب مكالمة مجانية دلوقتي وهنرد عليك خلال دقائق.
                  </p>
                  <Button asChild variant="outline">
                    <Link to="/contact">تواصل معنا الآن</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Merchant CTA Section - قسم دعوة التجار */}
      <section className="bg-gradient-to-r from-brand-purple via-primary to-brand-orange text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <Badge variant="secondary" className="text-primary bg-white/90 text-lg px-4 py-2">
                  🏪 للتجار والبائعين
                </Badge>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                هل لديك منتجات للبيع؟
                <br />
                <span className="text-brand-yellow">ابدأ البيع معنا!</span>
              </h2>
              <p className="text-xl text-white/90">
                انضم إلى أكثر من 500 تاجر ناجح على إيجي جو. عمولات منخفضة (5-10%)،
                دفعات أسبوعية، ووصول لملايين العملاء المحتملين.
              </p>
              
              <div className="grid grid-cols-2 gap-4 py-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">5-10%</div>
                  <div className="text-sm text-white/80">عمولة فقط</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">+500</div>
                  <div className="text-sm text-white/80">تاجر نشط</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">أسبوعي</div>
                  <div className="text-sm text-white/80">دفع الأرباح</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-3xl font-bold mb-1">مجاني</div>
                  <div className="text-sm text-white/80">بدون رسوم</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-primary font-semibold"
                  asChild
                >
                  <Link to="/register?type=merchant">
                    ابدأ البيع الآن
                    <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  asChild
                >
                  <Link to="/merchant">
                    اعرف المزيد
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader>
                  <CardTitle className="text-white text-2xl mb-4">
                    لماذا تبيع على إيجي جو؟
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        عمولات منخفضة
                      </h4>
                      <p className="text-sm text-white/80">
                        ادفع 5-10% فقط - أقل من المنافسين
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        تحليلات متقدمة
                      </h4>
                      <p className="text-sm text-white/80">
                        تتبع مبيعاتك وأدائك لحظياً
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        ملايين العملاء
                      </h4>
                      <p className="text-sm text-white/80">
                        وصول لقاعدة عملاء ضخمة جاهزة للشراء
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        دعم مخصص
                      </h4>
                      <p className="text-sm text-white/80">
                        فريق دعم متخصص لمساعدتك 24/7
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - دعوة نهائية */}
      <section className="bg-gradient-to-r from-primary via-purple-600 to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge variant="secondary" className="text-primary bg-white/90 mb-4">
              🚀 ابدأ الآن
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              جاهز للبدء؟
            </h2>
            <p className="text-xl text-white/90 mb-8">
              انضم الآن لآلاف المستخدمين الناجحين واستمتع بتجربة فريدة
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-primary font-semibold"
                asChild
              >
                <Link to="/products">
                  <ShoppingCart className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                  تسوق الآن
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                asChild
              >
                <Link to="/register?type=merchant">
                  <Sparkles className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                  سجل كتاجر
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                asChild
              >
                <Link to="/affiliate">
                  <TrendingUp className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                  انضم كمسوق
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
