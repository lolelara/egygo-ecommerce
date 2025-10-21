import { Link } from "react-router-dom";
import {
  ArrowRight,
  Store,
  TrendingUp,
  Award,
  DollarSign,
  BarChart3,
  Package,
  Clock,
  Shield,
  Lightbulb,
  CheckCircle,
  Star,
  Users,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Merchant() {
  const benefits = [
    {
      icon: Store,
      title: "منصة بيع متكاملة",
      description: "أنشئ متجرك الإلكتروني وابدأ البيع في دقائق",
      highlight: "سهل الاستخدام",
    },
    {
      icon: BarChart3,
      title: "تحليلات متقدمة",
      description: "تتبع مبيعاتك وأدائك مع تقارير مفصلة",
      highlight: "تقارير لحظية",
    },
    {
      icon: Globe,
      title: "وصول لملايين العملاء",
      description: "استفد من قاعدة عملائنا الكبيرة في مصر والوطن العربي",
      highlight: "ملايين العملاء",
    },
    {
      icon: DollarSign,
      title: "عمولات منخفضة",
      description: "ادفع فقط 5-10% عمولة على كل عملية بيع - أقل من المنافسين",
      highlight: "عمولة 5-10%",
    },
    {
      icon: Clock,
      title: "مدفوعات سريعة",
      description: "احصل على أموالك كل أسبوع مباشرة في حسابك البنكي",
      highlight: "دفع أسبوعي",
    },
    {
      icon: Shield,
      title: "حماية كاملة",
      description: "نحن نتعامل مع المدفوعات، الشحن، وخدمة العملاء",
      highlight: "أمان 100%",
    },
    {
      icon: Package,
      title: "إدارة المخزون",
      description: "نظام متطور لإدارة المنتجات والمخزون بسهولة",
      highlight: "إدارة ذكية",
    },
    {
      icon: Users,
      title: "دعم مخصص للتجار",
      description: "فريق دعم متخصص لمساعدتك في تنمية مبيعاتك",
      highlight: "دعم 24/7",
    },
    {
      icon: Lightbulb,
      title: "أدوات تسويقية",
      description: "احصل على أدوات ترويجية ودعم تسويقي مجاني",
      highlight: "تسويق مجاني",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "سجل كتاجر",
      description: "أنشئ حسابك كتاجر في أقل من 3 دقائق",
    },
    {
      step: "2",
      title: "أضف منتجاتك",
      description: "ارفع منتجاتك بالصور والأوصاف والأسعار",
    },
    {
      step: "3",
      title: "ابدأ البيع",
      description: "نحن نتعامل مع الطلبات والشحن والمدفوعات",
    },
    {
      step: "4",
      title: "اقبض أرباحك",
      description: "احصل على أموالك أسبوعياً في حسابك البنكي",
    },
  ];

  const testimonials = [
    {
      name: "أحمد محمود",
      role: "صاحب متجر إلكترونيات",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      quote:
        "منذ انضمامي لإيجي جو، تضاعفت مبيعاتي 3 مرات! المنصة سهلة والدعم ممتاز. أفضل قرار أخذته لتجارتي الإلكترونية.",
      earnings: "150,000 جنيه/شهر",
      rating: 5,
    },
    {
      name: "فاطمة عبدالله",
      role: "بائعة أزياء",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      quote:
        "المنصة وفرت عليّ الكثير! لا حاجة لموقع خاص أو التعامل مع تعقيدات الشحن والدفع. أركز فقط على منتجاتي.",
      earnings: "85,000 جنيه/شهر",
      rating: 5,
    },
    {
      name: "محمد حسن",
      role: "تاجر منتجات منزلية",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      quote:
        "العمولات أقل بكثير من المنافسين، والدفعات سريعة. تحليلات المبيعات ساعدتني أفهم عملائي بشكل أفضل.",
      earnings: "220,000 جنيه/شهر",
      rating: 5,
    },
  ];

  const commissionTiers = [
    {
      tier: "مبتدئ",
      commission: "10%",
      sales: "0 - 50,000 جنيه",
      color: "text-gray-600",
      borderColor: "border-gray-200",
    },
    {
      tier: "برونزي",
      commission: "8%",
      sales: "50,000 - 150,000 جنيه",
      color: "text-brand-orange",
      borderColor: "border-brand-orange",
    },
    {
      tier: "فضي",
      commission: "6%",
      sales: "150,000 - 300,000 جنيه",
      color: "text-brand-purple",
      borderColor: "border-brand-purple",
    },
    {
      tier: "ذهبي",
      commission: "5%",
      sales: "+300,000 جنيه",
      color: "text-primary",
      borderColor: "border-primary",
      badge: true,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-purple via-primary to-brand-orange text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary bg-white/90">
                  🏪 منصة البيع الأفضل في مصر
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  حوّل منتجاتك إلى
                  <span className="text-brand-yellow"> مبيعات</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  انضم إلى أكثر من 500 تاجر ناجح يبيعون على إيجي جو. عمولات منخفضة
                  (5-10%)، دفعات سريعة، ووصول لملايين العملاء.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?type=merchant">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-primary font-semibold w-full sm:w-auto"
                  >
                    ابدأ البيع الآن
                    <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  شاهد كيف يعمل
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">5-10%</div>
                  <div className="text-sm text-white/80">عمولة فقط</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">+500</div>
                  <div className="text-sm text-white/80">تاجر نشط</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">ملايين</div>
                  <div className="text-sm text-white/80">عميل محتمل</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    لوحة تحكم التاجر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">المبيعات اليوم</span>
                      <span className="text-white font-semibold">
                        12,450 جنيه
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">الطلبات الجديدة</span>
                      <span className="text-white font-semibold">24 طلب</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">معدل التحويل</span>
                      <span className="text-white font-semibold">4.2%</span>
                    </div>
                  </div>
                  <div className="bg-white/20 h-32 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-white/40" />
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
            لماذا تبيع على إيجي جو؟
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نوفر لك كل ما تحتاجه لبناء تجارة إلكترونية ناجحة ومربحة
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
                  <benefit.icon className="h-8 w-8 text-brand-purple" />
                  <Badge
                    variant="secondary"
                    className="text-brand-purple bg-brand-purple/10"
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

      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">كيف يعمل؟</h2>
          <p className="text-muted-foreground text-lg">
            ابدأ البيع في 4 خطوات بسيطة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-purple text-white flex items-center justify-center text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-brand-purple to-transparent -z-10"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/register?type=merchant">
            <Button size="lg" className="font-semibold">
              ابدأ البيع الآن - مجاناً
              <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/30">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              قصص نجاح التجار
            </h2>
            <p className="text-muted-foreground text-lg">
              استمع لتجار حققوا نجاحاً كبيراً على منصتنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      className="text-brand-purple bg-brand-purple/10"
                    >
                      مبيعات: {testimonial.earnings}
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
            كل ما تحتاج معرفته عن البيع على إيجي جو
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                هل يوجد رسوم اشتراك شهرية؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                لا، التسجيل والبيع على إيجي جو مجاني تماماً. ندفع فقط عمولة
                بسيطة (5-10%) على المبيعات المحققة.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">كيف أستلم أموالي؟</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                نحول أموالك أسبوعياً مباشرة إلى حسابك البنكي أو محفظتك
                الإلكترونية. سريع وآمن 100%.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                من يتعامل مع الشحن والتوصيل؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                يمكنك إما التعامل مع الشحن بنفسك أو استخدام شركاء الشحن لدينا.
                نوفر أسعار شحن مخفضة لتجارنا.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                كم عدد المنتجات التي يمكنني رفعها؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                غير محدود! يمكنك رفع عدد لا نهائي من المنتجات بدون أي رسوم
                إضافية.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-brand-purple to-primary text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              جاهز لبدء تجارتك الإلكترونية؟
            </h2>
            <p className="text-xl text-white/90">
              انضم إلى مئات التجار الناجحين على إيجي جو. سجل الآن وابدأ البيع
              في أقل من 5 دقائق - بدون رسوم اشتراك!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?type=merchant">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-primary font-semibold w-full sm:w-auto"
                >
                  ابدأ البيع مجاناً
                  <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                تحدث مع فريق المبيعات
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-white/80 pt-4">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                تسجيل مجاني
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
