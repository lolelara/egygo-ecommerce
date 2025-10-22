import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Star, ShoppingCart, Users, TrendingUp, Award, Sparkles, Package, Truck, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/storage";
import { productsApi, queryKeys } from "@/lib/api";
import { formatPrice } from "@/lib/currency";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useEffect } from "react";

export default function IndexClean() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      if (user.role === 'merchant' || user.isMerchant) {
        navigate('/merchant/dashboard');
        return;
      }
      if (user.isAffiliate) {
        navigate('/products');
        return;
      }
    }
  }, [user, navigate]);

  // Fetch featured products
  const { data: featuredProducts = [] } = useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => productsApi.getFeatured(),
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - بسيط ونظيف */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">منصة التجارة الإلكترونية الأولى في مصر</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                تسوق بذكاء،
                <br />
                <span className="text-primary">اربح بسهولة</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                اكتشف آلاف المنتجات بأفضل الأسعار، أو انضم لبرنامج الشراكة واربح عمولات تصل إلى 25%
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-lg">
                  <Link to="/products">
                    ابدأ التسوق
                    <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg">
                  <Link to="/register?type=affiliate">
                    <Users className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
                    انضم كمسوق
                  </Link>
                </Button>
              </div>

              {/* Simple Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+10K</div>
                  <div className="text-sm text-muted-foreground">عميل</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+500</div>
                  <div className="text-sm text-muted-foreground">منتج</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+1K</div>
                  <div className="text-sm text-muted-foreground">مسوق</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Products */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <Link key={product.id} to={`/product/${product.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-4">
                        <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                          <img
                            src={getImageUrl(product.images?.[0])}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - بسيطة وواضحة */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">لماذا إيجي جو؟</h2>
            <p className="text-muted-foreground">نوفر لك تجربة تسوق استثنائية</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">شحن سريع</h3>
                <p className="text-muted-foreground">
                  توصيل لجميع أنحاء مصر خلال 2-5 أيام
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">دفع آمن</h3>
                <p className="text-muted-foreground">
                  نظام دفع محمي بأحدث تقنيات الأمان
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">اربح معنا</h3>
                <p className="text-muted-foreground">
                  عمولات تصل إلى 25% لكل عملية بيع
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products - نظيف */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">المنتجات المميزة</h2>
              <p className="text-muted-foreground">اكتشف أفضل العروض</p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/products">
                عرض الكل
                <ArrowRight className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-4">
                    <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-muted">
                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <Button size="sm" variant="ghost">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliate CTA - بسيط */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              💰 برنامج الشراكة
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              ابدأ الربح من الإنترنت اليوم
            </h2>
            <p className="text-lg opacity-90">
              انضم لآلاف المسوقين الناجحين واكسب عمولة تصل إلى 25% على كل عملية بيع
            </p>

            <div className="grid grid-cols-3 gap-6 py-8">
              <div>
                <div className="text-3xl font-bold">25%</div>
                <div className="text-sm opacity-80">عمولة</div>
              </div>
              <div>
                <div className="text-3xl font-bold">+1000</div>
                <div className="text-sm opacity-80">مسوق نشط</div>
              </div>
              <div>
                <div className="text-3xl font-bold">مجاني</div>
                <div className="text-sm opacity-80">الانضمام</div>
              </div>
            </div>

            <Button size="lg" variant="secondary" asChild>
              <Link to="/register?type=affiliate">
                انضم الآن مجاناً
                <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
