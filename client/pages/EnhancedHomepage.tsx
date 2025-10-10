import { useEffect, useState } from 'react';
import SwiperProductSlider from '@/components/enhanced/SwiperProductSlider';
import FancyboxGallery from '@/components/enhanced/FancyboxGallery';
import { 
  GSAPAnimation, 
  GSAPHero, 
  GSAPScrollProgress,
  GSAPMagneticButton 
} from '@/components/enhanced/GSAPAnimations';
import { 
  PageTransitionWrapper,
  PagePreloader,
  TransitionCursor,
  useBarbaTransitions
} from '@/components/enhanced/BarbaTransitions';
import Three3DShowcase from '@/components/enhanced/Three3DShowcase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  Award,
  Truck,
  Shield,
  CreditCard,
  HeadphonesIcon
} from 'lucide-react';

export default function EnhancedHomepage() {
  const [showPreloader, setShowPreloader] = useState(true);
  
  // Initialize Barba transitions
  useBarbaTransitions();

  useEffect(() => {
    // Hide preloader after 2 seconds
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Sample data
  const featuredProducts = [
    {
      id: '1',
      name: 'ساعة ذكية متطورة',
      price: 1299,
      originalPrice: 1599,
      image: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Smart+Watch',
      rating: 4.8,
      reviews: 234,
      discount: 19,
      badge: 'جديد',
      description: 'ساعة ذكية بمميزات متقدمة لتتبع الصحة واللياقة'
    },
    {
      id: '2',
      name: 'سماعات لاسلكية Pro',
      price: 899,
      originalPrice: 1199,
      image: 'https://via.placeholder.com/400x400/ec4899/ffffff?text=Headphones',
      rating: 4.6,
      reviews: 156,
      discount: 25,
      badge: 'الأكثر مبيعاً',
      description: 'سماعات بجودة صوت استثنائية وإلغاء الضوضاء'
    },
    {
      id: '3',
      name: 'كاميرا احترافية 4K',
      price: 3499,
      originalPrice: 3999,
      image: 'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Camera',
      rating: 4.9,
      reviews: 89,
      discount: 13,
      description: 'كاميرا احترافية لتصوير الفيديو بدقة 4K'
    },
    {
      id: '4',
      name: 'لابتوب ألعاب متطور',
      price: 5999,
      image: 'https://via.placeholder.com/400x400/10b981/ffffff?text=Gaming+Laptop',
      rating: 4.7,
      reviews: 312,
      badge: 'حصري',
      description: 'لابتوب قوي للألعاب والأعمال الاحترافية'
    },
    {
      id: '5',
      name: 'تابلت رسم رقمي',
      price: 2299,
      originalPrice: 2799,
      image: 'https://via.placeholder.com/400x400/f59e0b/ffffff?text=Drawing+Tablet',
      rating: 4.5,
      reviews: 67,
      discount: 18,
      description: 'تابلت احترافي للرسم والتصميم الرقمي'
    }
  ];

  const galleryImages = [
    {
      id: '1',
      src: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Product+1',
      thumb: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Product+1',
      caption: 'منتج إلكتروني متطور',
      category: 'إلكترونيات'
    },
    {
      id: '2',
      src: 'https://via.placeholder.com/800x1000/ec4899/ffffff?text=Fashion',
      thumb: 'https://via.placeholder.com/400x500/ec4899/ffffff?text=Fashion',
      caption: 'أزياء عصرية',
      category: 'أزياء'
    },
    {
      id: '3',
      src: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Home',
      thumb: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Home',
      caption: 'ديكور منزلي',
      category: 'منزل'
    },
    {
      id: '4',
      src: 'https://via.placeholder.com/800x800/10b981/ffffff?text=Sports',
      thumb: 'https://via.placeholder.com/400x400/10b981/ffffff?text=Sports',
      caption: 'معدات رياضية',
      category: 'رياضة'
    },
    {
      id: '5',
      src: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Beauty',
      thumb: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Beauty',
      caption: 'منتجات العناية',
      category: 'جمال'
    },
    {
      id: '6',
      src: 'https://via.placeholder.com/800x1000/ef4444/ffffff?text=Kids',
      thumb: 'https://via.placeholder.com/400x500/ef4444/ffffff?text=Kids',
      caption: 'ألعاب أطفال',
      category: 'أطفال'
    }
  ];

  if (showPreloader) {
    return <PagePreloader />;
  }

  return (
    <PageTransitionWrapper namespace="home">
      {/* Custom Cursor */}
      <TransitionCursor />
      
      {/* Scroll Progress */}
      <GSAPScrollProgress />

      {/* Hero Section with GSAP */}
      <GSAPHero />

      {/* Features Section */}
      <GSAPAnimation animation="fadeIn" trigger triggerStart="top 90%">
        <section className="py-16 bg-gradient-to-b from-white to-purple-50">
          <div className="container mx-auto px-4">
            <GSAPAnimation animation="slideUp" trigger>
              <h2 className="text-3xl font-bold text-center mb-12">
                لماذا تختار EgyGo؟
              </h2>
            </GSAPAnimation>
            
            <GSAPAnimation animation="stagger" trigger staggerAmount={0.1}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">شحن سريع</h3>
                    <p className="text-sm text-muted-foreground">توصيل خلال 24 ساعة</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">ضمان الجودة</h3>
                    <p className="text-sm text-muted-foreground">منتجات أصلية 100%</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">دفع آمن</h3>
                    <p className="text-sm text-muted-foreground">طرق دفع متعددة وآمنة</p>
                  </CardContent>
                </Card>

                <Card className="text-center hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HeadphonesIcon className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="font-semibold mb-2">دعم 24/7</h3>
                    <p className="text-sm text-muted-foreground">خدمة عملاء متميزة</p>
                  </CardContent>
                </Card>
              </div>
            </GSAPAnimation>
          </div>
        </section>
      </GSAPAnimation>

      {/* Swiper Product Sliders */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="featured">المميزة</TabsTrigger>
              <TabsTrigger value="bestsellers">الأكثر مبيعاً</TabsTrigger>
              <TabsTrigger value="new">جديد</TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <GSAPAnimation animation="fadeIn">
                <SwiperProductSlider
                  products={featuredProducts}
                  title="المنتجات المميزة"
                  subtitle="اكتشف أفضل المنتجات المختارة بعناية"
                  variant="default"
                />
              </GSAPAnimation>
            </TabsContent>

            <TabsContent value="bestsellers">
              <GSAPAnimation animation="fadeIn">
                <SwiperProductSlider
                  products={featuredProducts.slice(0, 3)}
                  title="الأكثر مبيعاً"
                  subtitle="المنتجات الأكثر طلباً هذا الشهر"
                  variant="coverflow"
                  slidesPerView={3}
                />
              </GSAPAnimation>
            </TabsContent>

            <TabsContent value="new">
              <GSAPAnimation animation="fadeIn">
                <SwiperProductSlider
                  products={featuredProducts.slice(2)}
                  title="وصل حديثاً"
                  subtitle="أحدث المنتجات في متجرنا"
                  variant="cards"
                  slidesPerView={1}
                />
              </GSAPAnimation>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 3D Product Showcase */}
      <GSAPAnimation animation="zoomIn" trigger>
        <section className="py-16 bg-gradient-to-b from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge className="mb-4">تقنية ثلاثية الأبعاد</Badge>
              <h2 className="text-3xl font-bold mb-2">استكشف المنتجات بتقنية 3D</h2>
              <p className="text-muted-foreground">تجربة تفاعلية فريدة لعرض المنتجات</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Three3DShowcase
                productName="منتج ثلاثي الأبعاد تفاعلي"
                productImage="https://via.placeholder.com/800x800/8b5cf6/ffffff?text=3D+Product"
                enableControls={true}
                autoRotate={true}
              />
            </div>
          </div>
        </section>
      </GSAPAnimation>

      {/* Fancybox Gallery */}
      <GSAPAnimation animation="slideUp" trigger>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <FancyboxGallery
              images={galleryImages}
              variant="masonry"
              columns={3}
              showCaptions={true}
              enableZoom={true}
            />
          </div>
        </section>
      </GSAPAnimation>

      {/* CTA Section with Parallax */}
      <GSAPAnimation animation="parallax">
        <section className="py-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <GSAPAnimation animation="morphText" trigger>
              <h2 className="text-4xl font-bold text-center mb-6">
                ابدأ رحلة التسوق الآن
              </h2>
            </GSAPAnimation>
            
            <GSAPAnimation animation="bounce" trigger delay={0.3}>
              <p className="text-xl text-center mb-8 opacity-90">
                احصل على خصم 20% على أول طلب لك
              </p>
            </GSAPAnimation>
            
            <div className="flex justify-center gap-4">
              <GSAPMagneticButton className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:shadow-2xl transition-shadow">
                <ShoppingBag className="inline-block ml-2 h-5 w-5" />
                تسوق الآن
              </GSAPMagneticButton>
              
              <GSAPMagneticButton className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all">
                <Sparkles className="inline-block ml-2 h-5 w-5" />
                العروض الخاصة
              </GSAPMagneticButton>
            </div>
          </div>
        </section>
      </GSAPAnimation>

      {/* Stats Section */}
      <GSAPAnimation animation="stagger" trigger>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
                <div className="text-muted-foreground">منتج متنوع</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-pink-600 mb-2">50K+</div>
                <div className="text-muted-foreground">عميل سعيد</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
                <div className="text-muted-foreground">علامة تجارية</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <div className="text-muted-foreground">دعم فني</div>
              </div>
            </div>
          </div>
        </section>
      </GSAPAnimation>
    </PageTransitionWrapper>
  );
}
