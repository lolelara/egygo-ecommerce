import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Home, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-' + Date.now();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">تم إتمام الطلب بنجاح!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg mb-2">شكراً لك على طلبك</p>
              <p className="text-muted-foreground">
                رقم الطلب: <span className="font-mono font-bold">{orderId}</span>
              </p>
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">ماذا يحدث بعد ذلك؟</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-medium">تأكيد الطلب</p>
                    <p className="text-sm text-muted-foreground">
                      ستتلقى رسالة بريد إلكتروني تحتوي على تفاصيل طلبك
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-medium">معالجة الطلب</p>
                    <p className="text-sm text-muted-foreground">
                      سنبدأ في تجهيز طلبك للشحن خلال 24 ساعة
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-medium">الشحن والتوصيل</p>
                    <p className="text-sm text-muted-foreground">
                      سيتم شحن طلبك وتوصيله خلال 3-5 أيام عمل
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => navigate('/account/orders')}
                variant="outline"
                className="w-full"
              >
                <Package className="h-4 w-4 ml-2" />
                تتبع الطلب
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                <Home className="h-4 w-4 ml-2" />
                العودة للرئيسية
              </Button>
            </div>

            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => window.print()}
                className="text-muted-foreground"
              >
                <FileText className="h-4 w-4 ml-2" />
                طباعة تفاصيل الطلب
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>إذا كان لديك أي استفسار، يرجى التواصل معنا</p>
          <p className="mt-1">
            البريد الإلكتروني: support@egygo.me | الهاتف: 01234567890
          </p>
        </div>
      </div>
    </div>
  );
}
