import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Clock, MapPin } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">معلومات الشحن</h1>
        <p className="text-muted-foreground">
          كل ما تحتاج معرفته عن الشحن والتوصيل
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              طرق الشحن
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">شحن قياسي (2-5 أيام عمل)</h3>
              <p className="text-sm text-muted-foreground">
                • مجاني للطلبات فوق 500 ج.م
                <br />
                • 50 ج.م للطلبات الأقل من 500 ج.م
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">شحن سريع (1-2 يوم عمل)</h3>
              <p className="text-sm text-muted-foreground">
                • 100 ج.م لجميع الطلبات
                <br />
                • متاح في المدن الرئيسية فقط
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              مناطق التوصيل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              نوصل لجميع محافظات مصر:
            </p>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              <div>✓ القاهرة والجيزة (يوم واحد)</div>
              <div>✓ الإسكندرية (1-2 يوم)</div>
              <div>✓ دلتا مصر (2-3 أيام)</div>
              <div>✓ الصعيد (3-5 أيام)</div>
              <div>✓ الساحل الشمالي (2-4 أيام)</div>
              <div>✓ البحر الأحمر (3-5 أيام)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              أوقات التوصيل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• من السبت إلى الخميس: 10 صباحاً - 9 مساءً</p>
              <p>• الجمعة: 2 مساءً - 9 مساءً</p>
              <p>• يمكنك تحديد وقت مفضل للتوصيل عند إتمام الطلب</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              تتبع الشحنة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ستتلقى رقم تتبع عبر SMS والبريد الإلكتروني بمجرد شحن طلبك.
              يمكنك تتبع حالة الطلب من صفحة "طلباتي".
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
