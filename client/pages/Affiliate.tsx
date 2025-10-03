import { Link } from "react-router-dom";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  DollarSign,
  BarChart3,
  Globe,
  Clock,
  Shield,
  Lightbulb,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fallbackProductsApi } from "../lib/api-fallback";
import { useState, useEffect } from "react";
import type { ProductWithRelations } from "@shared/prisma-types";

export default function Affiliate() {
  const [featuredProducts, setFeaturedProducts] = useState<
    ProductWithRelations[]
  >([]);

  useEffect(() => {
    // Load featured products
    fallbackProductsApi
      .getAll({ sortBy: "featured", limit: 4 })
      .then((data) => {
        setFeaturedProducts(data.products);
      })
      .catch(() => {
        setFeaturedProducts([]);
      });
  }, []);

  const benefits = [
    {
      icon: DollarSign,
      title: "معدلات عمولة عالية",
      description: "اكسب 8-25% عمولة على كل عملية بيع تحيلها",
      highlight: "حتى 25%",
    },
    {
      icon: BarChart3,
      title: "تحليلات فورية",
      description: "تتبع أداءك مع تحليلات وتقارير مفصلة",
      highlight: "تتبع مباشر",
    },
    {
      icon: Globe,
      title: "وصول عالمي",
      description: "روج للعملاء حول العالم مع الشحن الدولي",
      highlight: "عالمي",
    },
    {
      icon: Clock,
      title: "دفعات أسبوعية",
      description: "احصل على أموالك كل أسبوع عبر PayPal أو التحويل البنكي",
      highlight: "دفع أسبوعي",
    },
    {
      icon: Shield,
      title: "حماية الكوكيز",
      description:
        "تتبع الكوكيز لمدة 30 يومًا يضمن حصولك على الرصيد لجميع المبيعات",
      highlight: "كوكيز 30 يوم",
    },
    {
      icon: Lightbulb,
      title: "دعم تسويقي",
      description: "احصل على بانرات وروابط ومواد ترويجية",
      highlight: "دعم كامل",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "اشترك مجانًا",
      description: "أنشئ حساب الشراكة في أقل من دقيقتين",
    },
    {
      step: "2",
      title: "احصل على روابطك",
      description: "احصل على روابط الشراكة الفريدة ومواد التسويق",
    },
    {
      step: "3",
      title: "ابدأ الترويج",
      description:
        "شارك المنتجات على موقعك أو وسائل التواصل أو البريد الإلكتروني",
    },
    {
      step: "4",
      title: "اكسب العمولات",
      description: "احصل على أموالك أسبوعيًا عن كل عملية بيع تحققها",
    },
  ];

  const testimonials = [
    {
      name: "سارة أحمد",
      role: "مدونة أسلوب حياة",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b132?w=100&h=100&fit=crop&crop=face",
      quote:
        "أنا مع برنامج شراكة شوب كو منذ 6 أشهر وقد كسبت أكثر من 5000 دولار. المنتجات عالية الجودة ومعدلات العمولة لا تُقاوم!",
      earnings: "$5,240",
      rating: 5,
    },
    {
      name: "محمد علي",
      role: "مراجع تقني",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote:
        "لوحة التحليلات مذهلة. يمكنني رؤية أي المنتجات تعمل بشكل أفضل بالضبط وتحسين المحتوى تبعًا لذلك. أفضل برنامج شراكة انضممت إليه.",
      earnings: "$8,150",
      rating: 5,
    },
    {
      name: "فاطمة خالد",
      role: "مؤثرة وسائل التواصل",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote:
        "برنامج شراكة شوب كو حول وسائل التواصل الاجتماعي إلى مصدر دخل حقيقي. الدفعات الأسبوعية تغير قواعد اللعبة للتدفق النقدي.",
      earnings: "$12,890",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-orange via-brand-purple to-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary bg-white/90">
                  �� برنامج الشراكة الأعلى دفعًا
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  حول جمهورك إلى
                  <span className="text-brand-yellow"> دخل</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  انضم إلى أكثر من 1000 شريك ناجح يكسبون عمولة تصل إلى 25%
                  بترويج منتجات عالية الجودة سيحبها جمهورك.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?type=affiliate">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-primary font-semibold w-full sm:w-auto"
                  >
                    انضم مجانًا اليوم
                    <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  عرض معدلات العمولة
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">25%</div>
                  <div className="text-sm text-white/80">أقصى عمولة</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">+$2M</div>
                  <div className="text-sm text-white/80">مدفوع</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">+1000</div>
                  <div className="text-sm text-white/80">شريك نشط</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    لوحة تحكم أرباح الشراكة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-brand-yellow">
                        $1,247
                      </div>
                      <div className="text-xs text-white/80">هذا الشهر</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-brand-yellow">
                        $8,392
                      </div>
                      <div className="text-xs text-white/80">
                        المجموع المكتسب
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-brand-yellow">
                        156
                      </div>
                      <div className="text-xs text-white/80">النقرات</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-brand-yellow">
                        23
                      </div>
                      <div className="text-xs text-white/80">المبيعات</div>
                    </div>
                  </div>
                  <div className="text-center text-white/90 text-sm">
                    تتبع وتحليلات فورية مشمولة
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            لماذا تختار برنامج الشراكة لدينا؟
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نحن نقدم أفضل الشروط وأعلى معدلات العمولة والدعم الأكثر شمولية في
            الصناعة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <benefit.icon className="h-8 w-8 text-brand-orange" />
                  <Badge
                    variant="secondary"
                    className="text-brand-orange bg-brand-orange/10"
                  >
                    {benefit.highlight}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Commission Structure */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              هيكل العمولة
            </h2>
            <p className="text-muted-foreground text-lg">
              مبيعات أعلى = معدلات عمولة أعلى
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-orange">8%</CardTitle>
                <p className="text-sm text-muted-foreground">معدل العمولة</p>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">مبتدئ</p>
                <p className="text-sm text-muted-foreground">
                  $0 - $500 مبيعات شهرية
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-brand-orange">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-orange">
                  15%
                </CardTitle>
                <p className="text-sm text-muted-foreground">معدل العمولة</p>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">برونزي</p>
                <p className="text-sm text-muted-foreground">
                  $500 - $2,000 مبيعات شهرية
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-brand-purple">
              <CardHeader>
                <CardTitle className="text-2xl text-brand-purple">
                  20%
                </CardTitle>
                <p className="text-sm text-muted-foreground">معدل العمولة</p>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">فضي</p>
                <p className="text-sm text-muted-foreground">
                  $2,000 - $5,000 مبيعات شهرية
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">25%</CardTitle>
                <p className="text-sm text-muted-foreground">معدل العمولة</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <p className="font-semibold">ذه��ي</p>
                  <Award className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  +$5,000 مبيعات شهرية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">كيف يعمل</h2>
          <p className="text-muted-foreground text-lg">ابدأ في 4 خطوات بسيطة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-brand-orange to-brand-purple transform translate-x-8"></div>
              )}
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-orange to-brand-purple rounded-full flex items-center justify-center text-white font-bold text-xl relative z-10">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            منتجات عالية التحويل
          </h2>
          <p className="text-muted-foreground text-lg">
            روج لهذه المنتجات الأكثر مبيعًا واحصل على أقصى أرباحك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={product.images[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
                  عالي التحويل
                </Badge>
                <div className="absolute top-2 right-2 bg-brand-orange text-white text-xs px-2 py-1 rounded font-bold">
                  {product.affiliateCommission}% عمولة
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${product.price}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-brand-orange">
                      $
                      {(
                        product.price *
                        (product.affiliateCommission / 100)
                      ).toFixed(2)}{" "}
                      لكل بيعة
                    </div>
                    <div className="text-xs text-muted-foreground">عمولة</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">قصص النجاح</h2>
            <p className="text-muted-foreground text-lg">
              اسمع من أفضل الشركاء أداءً لدين��
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-brand-orange bg-brand-orange/10"
                    >
                      المجموع المكتسب: {testimonial.earnings}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            الأسئلة الشائعة
          </h2>
          <p className="text-muted-foreground text-lg">
            كل ما تحتاج لمعرفته حول برنامج الشراكة لدينا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">كيف أحصل على الدفع؟</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                ندفع للشركاء أسبوعيًا عبر PayPal أو التحويل البنكي المباشر. الحد
                الأدنى للدفع هو 50 دولار.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">هل هناك رسوم انضمام؟</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                لا، الانضمام إلى برنامج الشراكة مجاني تمامًا. لا توجد رسوم خفية
                أو تكاليف.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">كم تدوم الكوكيز؟</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                كوكيزنا تدوم لمدة 30 يومًا، مما يمنحك وقتًا كافيًا لكسب عمولة
                على العملاء المحالين.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                هل يمكنني الترويج على وسائل التواصل الاجتماعي؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                نعم! يمكنك الترويج على أي منصة بما في ذلك وسائل التواصل
                ا��اجتماعي والمدونات والبريد الإلكتروني وأكثر.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-brand-orange to-brand-purple text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              جاهز للبدء في الكسب؟
            </h2>
            <p className="text-xl text-white/90">
              انضم إلى آلاف الشركاء الناجحين وابدأ في كسب عمولة تصل إلى 25%
              اليوم. يستغرق أقل من دقيقتين للبدء.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-primary font-semibold"
              >
                انضم مجانًا الآن
                <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                اتصل بال��عم
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-white/80 pt-4">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                انضمام مجاني
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                بدون رسوم شهرية
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                دفعات أسبوعية
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
