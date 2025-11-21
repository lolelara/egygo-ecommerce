import { Link, useNavigate } from "react-router-dom";
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
  Play,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/storage";
import { productsApi, categoriesApi, queryKeys } from "@/lib/api";
import { EnhancedSEO, pageSEO } from "@/components/EnhancedSEO";
import { placeholder } from "@/lib/placeholder";
import { formatPrice, formatDiscount } from "@/lib/currency";
import SwiperProductSlider from '@/components/enhanced/SwiperProductSlider';
import { useEffect, useState } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { analytics } from "@/lib/enhanced-analytics";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { HeroSectionEnhanced } from "@/components/HeroSectionEnhanced";
import { ProductCarouselModern } from "@/components/ProductCarouselModern";
import { CategoryGridAnimated } from "@/components/CategoryGridAnimated";
import { Smartphone, Shirt, Home as HomeIcon, Gamepad2, Watch, Gift } from "lucide-react";
import { EgyGoCartAnimation } from "@/components/EgyGoCartAnimation";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();


  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["متفوتش الفرصة", "اعمل دخل بسهولة", "حافظ على فلوسك", "اكسب أكتر"];

  // Typewriter effect
  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= currentWord.length) {
        setDisplayedText(currentWord.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Wait before switching to next word
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentWordIndex]);

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      // If user is a merchant, redirect to merchant dashboard
      if (user.role === 'merchant' || user.isMerchant) {
        navigate('/merchant/dashboard');
        return;
      }

      // If user is an affiliate, redirect to products page
      if (user.isAffiliate) {
        navigate('/products');
        return;
      }

      // Admin stays on homepage (can see everything)
      // Customer stays on homepage (default shopping experience)
    }
  }, [user, navigate]);

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

  // Fetch hero featured products
  const { data: heroFeaturedData, isLoading: heroFeaturedLoading } = useQuery({
    queryKey: [...queryKeys.products, "hero-featured"],
    queryFn: () => productsApi.getAll({ isFeaturedInHero: true, limit: 3 }),
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

      import {EgyGoCartAnimation} from "@/components/EgyGoCartAnimation";

      // ... existing imports ...

      // Inside Index component return:

      {/* Hero Section - Modern Enhanced Design */}
      <HeroSectionEnhanced
        onShopNow={() => navigate('/products')}
        onExploreDeals={() => navigate('/deals')}
        featuredProducts={heroFeaturedData?.products || []}
      />

      {/* Creative Cart Animation */}
      <EgyGoCartAnimation />

      {/* Scrolling Marquee Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEyIDhhNCA0IDAgMSAwIDAtOCA0IDQgMCAwIDAgMCA4em0yNCAwYTQgNCAwIDEgMCAwLTggNCA0IDAgMCAwIDAgOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        <div className="relative flex whitespace-nowrap animate-marquee">
          <div className="flex items-center gap-12 px-6">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="flex items-center gap-12">
                <span className="text-white font-black text-2xl flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  egygo.me
                </span>
                <span className="text-white/80 font-bold text-xl flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  PowerFamily
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Affiliate Hero Section - قسم المسوقين */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-amber-600 text-white overflow-hidden min-h-[80vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEyIDhhNCA0IDAgMSAwIDAtOCA0IDQgMCAwIDAgMCA4em0yNCAwYTQgNCAwIDEgMCAwLTggNCA0IDAgMCAwIDAgOHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        {/* Floating Money Icons */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" style={{ animation: 'float 4s ease-in-out infinite' }}></div>

        <div className="relative container mx-auto px-4 py-20 z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-0 shadow-xl font-bold px-8 py-3 text-lg">
              💰 برنامج المسوقين بالعمولة
            </Badge>

            <h2 className="text-5xl lg:text-7xl font-black leading-tight text-white drop-shadow-2xl">
              <span className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent">
                ابدأ الربح من المنزل
              </span>
            </h2>

            <p className="text-2xl lg:text-3xl text-white/95 max-w-3xl mx-auto font-medium leading-relaxed">
              انضم لآلاف المسوقين الناجحين واحصل على عمولات مجزية على كل عملية بيع
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl hover:from-white/30 hover:to-white/10 transition-all duration-300 hover:scale-105">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-2">عمولات عالية</h3>
                <p className="text-white/80">احصل على نسبة من كل عملية بيع تتم عبر رابطك الخاص</p>
              </div>

              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl hover:from-white/30 hover:to-white/10 transition-all duration-300 hover:scale-105">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-blue-300" />
                <h3 className="text-2xl font-bold mb-2">تتبع دقيق</h3>
                <p className="text-white/80">راقب أرباحك ومبيعاتك بشكل مباشر من لوحة التحكم</p>
              </div>

              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl hover:from-white/30 hover:to-white/10 transition-all duration-300 hover:scale-105">
                <Headphones className="w-12 h-12 mx-auto mb-4 text-pink-300" />
                <h3 className="text-2xl font-bold mb-2">دعم مستمر</h3>
                <p className="text-white/80">فريق دعم متواجد لمساعدتك على النجاح وزيادة أرباحك</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:from-yellow-500 hover:to-amber-600 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-500 hover:scale-110 font-black text-2xl px-12 py-8 rounded-2xl relative overflow-hidden group"
                asChild
              >
                <Link to="/register?type=affiliate">
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  <DollarSign className="ml-3 h-7 w-7 rtl:ml-0 rtl:mr-3 group-hover:animate-pulse" />
                  <span className="relative z-10">اربح معنا الآن</span>
                  <TrendingUp className="mr-3 h-6 w-6 rtl:mr-0 rtl:ml-3 group-hover:translate-y-[-4px] transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-12">
              <div className="text-center">
                <AnimatedCounter
                  end={25}
                  suffix="%"
                  className="text-5xl font-black text-yellow-300 mb-2"
                  duration={2000}
                />
                <div className="text-lg text-white/80 font-medium">نسبة العمولة</div>
              </div>
              <div className="text-center">
                <AnimatedCounter
                  end={1000}
                  prefix="+"
                  className="text-5xl font-black text-white mb-2"
                  duration={2500}
                />
                <div className="text-lg text-white/80 font-medium">مسوق نشط</div>
              </div>
              <div className="text-center">
                <AnimatedCounter
                  end={50000}
                  prefix="+"
                  suffix=" ج.م"
                  className="text-5xl font-black text-green-300 mb-2"
                  duration={3000}
                />
                <div className="text-lg text-white/80 font-medium">متوسط الدخل الشهري</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics - إحصائيات المنصة */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 px-6 py-2 text-base font-bold">
            📊 إحصائيات مبهرة
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 dark:from-gray-100 dark:via-red-400 dark:to-gray-100 bg-clip-text text-transparent">
            منصة موثوقة يستخدمها الآلاف
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            انضم لمجتمع متنامي من التجار والمسوقين والعملاء الراضين
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-red-50/30 dark:from-gray-800 dark:to-red-950/30 border-2 border-red-100 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <CardContent className="text-center p-8">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 dark:bg-red-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <Users className="w-12 h-12 mx-auto mb-4 text-red-600 dark:text-red-400" />
              <AnimatedCounter
                end={10000}
                prefix="+"
                className="text-5xl font-black text-red-600 dark:text-red-400 mb-3"
                duration={2500}
              />
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-base">عميل نشط</div>
            </CardContent>
          </Card>
          <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-950/30 border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <CardContent className="text-center p-8">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 dark:bg-blue-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
              <AnimatedCounter
                end={500}
                prefix="+"
                className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-3"
                duration={2000}
              />
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-base">تاجر ناجح</div>
            </CardContent>
          </Card>
          <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-green-50/30 dark:from-gray-800 dark:to-green-950/30 border-2 border-green-100 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <CardContent className="text-center p-8">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/5 dark:bg-green-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600 dark:text-green-400" />
              <AnimatedCounter
                end={2000}
                prefix="+"
                className="text-5xl font-black text-green-600 dark:text-green-400 mb-3"
                duration={2200}
              />
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-base">مسوق نشط</div>
            </CardContent>
          </Card>
          <Card className="group relative overflow-hidden bg-gradient-to-br from-white to-yellow-50/30 dark:from-gray-800 dark:to-yellow-950/30 border-2 border-yellow-100 dark:border-yellow-900/50 hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <CardContent className="text-center p-8">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-600/5 dark:bg-yellow-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-yellow-600 dark:text-yellow-400" />
              <AnimatedCounter
                end={5}
                suffix="M+"
                className="text-5xl font-black text-yellow-600 dark:text-yellow-400 mb-3"
                duration={2000}
              />
              <div className="text-gray-600 dark:text-gray-300 font-semibold text-base">جنيه مبيعات</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works - كيف تعمل المنصة */}
      <section className="relative bg-gradient-to-b from-muted/30 via-white dark:via-gray-900 to-muted/30 py-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-100/30 dark:bg-red-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/20 dark:bg-blue-900/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 px-6 py-2 text-base font-bold">
              ⚙️ كيف تعمل المنصة
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-gray-900 via-red-800 to-gray-900 dark:from-gray-100 dark:via-red-400 dark:to-gray-100 bg-clip-text text-transparent">
              ابدأ رحلتك في 3 خطوات بسيطة
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              سواء كنت تاجر، مسوق، أو عميل - نحن نسهل عليك البداية
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* للعملاء */}
            <Card className="group relative bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-700 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-100 dark:from-red-900/30 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="p-8 relative z-10">
                {/* فيديو توضيحي */}
                <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/50 dark:to-red-900/30 aspect-video group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 dark:bg-red-600/20 group-hover:bg-red-600/20 dark:group-hover:bg-red-600/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white mr-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-sm font-medium">🎬 كيف تتسوق على إيجي جو</p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-gray-100">للعملاء</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">تصفح المنتجات</h4>
                      <p className="text-sm text-muted-foreground">اكتشف آلاف المنتجات عالية الجودة</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">أضف للسلة</h4>
                      <p className="text-sm text-muted-foreground">اختر ما يعجبك وأضفه لسلة المشتريات</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">اطلب واستلم</h4>
                      <p className="text-sm text-muted-foreground">ادفع واستلم طلبك في 2-4 أيام</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* للتجار */}
            <Card className="group relative bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-600 overflow-visible">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-200 dark:from-red-900/40 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -top-3 -right-3 z-20">
                <Badge className="bg-gradient-to-r from-red-600 to-red-500 dark:from-red-500 dark:to-red-600 text-white px-4 py-2 font-bold text-sm shadow-xl shadow-red-500/50 dark:shadow-red-400/50 border-2 border-white dark:border-gray-700">
                  ⭐ الأكثر طلباً
                </Badge>
              </div>
              <CardContent className="p-8 relative z-10">
                {/* فيديو توضيحي */}
                <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/50 dark:to-red-900/30 aspect-video group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 dark:bg-red-600/20 group-hover:bg-red-600/20 dark:group-hover:bg-red-600/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white mr-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-sm font-medium">🎬 كيف تبدأ البيع كتاجر</p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-gray-100">للتجار</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">سجل حساب</h4>
                      <p className="text-sm text-muted-foreground">انشئ حساب تاجر مجاناً</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">أضف منتجاتك</h4>
                      <p className="text-sm text-muted-foreground">ارفع منتجاتك وحدد الأسعار والعمولات</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">ابدأ البيع</h4>
                      <p className="text-sm text-muted-foreground">راقب مبيعاتك واستلم أرباحك أسبوعياً</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* للمسوقين */}
            <Card className="group relative bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 dark:from-green-900/30 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
              <CardContent className="p-8 relative z-10">
                {/* فيديو توضيحي */}
                <div className="relative mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/50 dark:to-red-900/30 aspect-video group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center bg-red-600/10 dark:bg-red-600/20 group-hover:bg-red-600/20 dark:group-hover:bg-red-600/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-red-600 dark:bg-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white mr-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-sm font-medium">🎬 كيف تربح كمسوق</p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-gray-100">للمسوقين</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">انضم مجاناً</h4>
                      <p className="text-sm text-muted-foreground">سجل كمسوق بدون أي رسوم</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">احصل على روابطك</h4>
                      <p className="text-sm text-muted-foreground">اختر المنتجات وخذ روابط التسويق</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 dark:bg-red-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <h4 className="font-semibold dark:text-gray-200">سوّق واربح</h4>
                      <p className="text-sm text-muted-foreground">اربح عمولة لحد 25% على كل بيعة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Animated Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            تسوق حسب الفئة
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            اكتشف مجموعتنا الواسعة من المنتجات عبر فئات مختلفة
          </p>
        </div>

        <CategoryGridAnimated
          categories={categories.filter(cat => cat.slug).slice(0, 6).map((category, index) => ({
            id: category.id,
            name: category.name,
            nameAr: category.name,
            icon: [Smartphone, Shirt, HomeIcon, Gamepad2, Watch, Gift][index % 6],
            productCount: category.productCount || 0,
            gradient: [
              'from-purple-500 to-blue-500',
              'from-pink-500 to-orange-500',
              'from-green-500 to-teal-500',
              'from-red-500 to-pink-500',
              'from-yellow-500 to-orange-500',
              'from-indigo-500 to-purple-500',
            ][index % 6],
          }))}
          onCategoryClick={(cat) => navigate(`/products?category=${categories.find(c => c.id === cat.id)?.slug}`)}
        />
      </section>

      {/* Featured Products - Modern Carousel */}
      <section className="container mx-auto px-4 products-section">
        {featuredProducts.length > 0 && (
          <ProductCarouselModern
            products={featuredProducts.map(p => ({
              id: p.id,
              name: p.name,
              nameAr: p.name,
              price: p.price,
              originalPrice: p.originalPrice,
              image: getImageUrl(p.images?.[0]),
              rating: p.rating || 4.5,
              reviewCount: p.reviewCount || 0,
              discount: p.originalPrice && p.originalPrice > p.price ?
                Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : undefined,
              isNew: false,
              isTrending: p.reviewCount > 100,
            }))}
            title="المنتجات المميزة"
            subtitle="منتجات مختارة بعناية خصيصًا لك"
            onProductClick={(p) => navigate(`/product/${p.id}`)}
            onAddToCart={(p) => {
              // Navigate to product page to add to cart
              navigate(`/product/${p.id}`);
            }}
            onQuickView={(p) => {
              // Navigate to product page for quick view
              navigate(`/product/${p.id}`);
            }}
            wishlistedIds={[]}
            onToggleWishlist={(id) => {
              // Navigate to product page to add to wishlist
              const product = featuredProducts.find(fp => fp.id === id);
              if (product) navigate(`/product/${id}`);
            }}
          />
        )}
      </section>

      {/* Affiliate Program CTA */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="text-red-600 bg-white font-bold"
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
                className="bg-white text-red-600 hover:bg-red-50 font-semibold shadow-lg"
                asChild
              >
                <Link to="/register?type=affiliate">
                  انضم لبرنامج الشراكة
                  <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 relative z-10">
                <CardHeader>
                  <CardTitle className="text-white">
                    لماذا تختار برنامجنا؟
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-600">✓</span>
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
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-600">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">تتبع فوري</h4>
                      <p className="text-white/80 text-sm">
                        راقب أداءك وأرباحك مباشرة
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-600">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">دعم تسويقي</h4>
                      <p className="text-white/80 text-sm">
                        احصل على بانرات وروابط ومواد ترويجية
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-red-600">✓</span>
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
      {
        bestSellers.length > 0 && (
          <section className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                الأكثر مبيعًا
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                منتجاتنا الأكثر شعبية المحبوبة من العملاء في جميع أنحاء مصر
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
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        {product.affiliateCommission}% عمولة
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(product.rating)
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
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(product.originalPrice)}
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
        )
      }

      {/* Trust Signals & Customer Care */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-4 py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <Badge className="bg-red-100 text-red-600">
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
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
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
                <div className="rounded-xl border border-dashed border-red-200 p-5 text-center">
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
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <Badge className="text-red-600 bg-white shadow-lg text-lg px-4 py-2 font-bold">
                  🏪 للتجار والبائعين
                </Badge>
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                هل لديك منتجات للبيع؟
                <br />
                <span className="text-white">ابدأ البيع معنا!</span>
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
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold shadow-lg"
                  asChild
                >
                  <Link to="/register?type=merchant">
                    سجل كتاجر الآن
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
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Badge className="bg-white text-red-600 shadow-lg mb-4 font-bold">
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
                className="bg-white text-red-600 hover:bg-red-50 font-semibold shadow-lg"
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
                <Link to="/register?type=affiliate">
                  <TrendingUp className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                  انضم كمسوق
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div >
  );
}
