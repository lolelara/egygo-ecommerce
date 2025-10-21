import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Users, TrendingUp, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">من نحن</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          إيجي جو - وجهتك الأولى للتسوق الإلكتروني في مصر والعالم العربي
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">رؤيتنا</h2>
          <p className="text-muted-foreground leading-relaxed">
            هدفنا خلق بيئة تنافسية عالية للمنتجات المصرية مع دعم الصناعة المحلية.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">مهمتنا</h2>
          <p className="text-muted-foreground leading-relaxed">
            تقديم أفضل المنتجات بأسعار تنافسية مع خدمة عملاء متميزة، وبناء منصة تربط بين التجار والمسوقين والعملاء في نظام متكامل.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-2xl mb-2">200+</h3>
            <p className="text-sm text-muted-foreground">منتج متنوع</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-2xl mb-2">2,000+</h3>
            <p className="text-sm text-muted-foreground">عميل راضٍ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-2xl mb-2">150+</h3>
            <p className="text-sm text-muted-foreground">مسوق نشط</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold text-2xl mb-2">95%</h3>
            <p className="text-sm text-muted-foreground">رضا العملاء</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-orange-500/10 to-purple-500/10">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">قيمنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-bold mb-2">الجودة</h3>
              <p className="text-sm text-muted-foreground">
                نختار منتجاتنا بعناية لضمان أعلى مستويات الجودة
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold mb-2">الثقة</h3>
              <p className="text-sm text-muted-foreground">
                نبني علاقات طويلة الأمد مع عملائنا على أساس الثقة
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold mb-2">الابتكار</h3>
              <p className="text-sm text-muted-foreground">
                نسعى دائماً لتقديم تجربة تسوق مبتكرة ومميزة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
