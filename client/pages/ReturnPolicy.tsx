import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">سياسة الإرجاع والاستبدال</h1>
          <p className="text-muted-foreground">
            نحن نهتم برضاك التام عن مشترياتك
          </p>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">ضمان الرضا 100%</h3>
                  <p className="text-muted-foreground">
                    إذا لم تكن راضياً عن مشترياتك، يمكنك إرجاعها خلال 14 يوماً من
                    تاريخ الاستلام واسترداد كامل المبلغ أو استبدال المنتج.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. فترة الإرجاع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                لديك 14 يوماً من تاريخ استلام المنتج لبدء عملية الإرجاع. بعد انتهاء
                هذه الفترة، لن نتمكن للأسف من قبول الإرجاع.
              </p>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">مثال:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• تاريخ الاستلام: 1 أكتوبر 2025</li>
                  <li>• آخر موعد للإرجاع: 15 أكتوبر 2025</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. شروط الإرجاع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>لكي يتم قبول الإرجاع، يجب أن:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>يكون المنتج في حالته الأصلية دون استخدام</li>
                <li>يكون في العبوة والتغليف الأصلي</li>
                <li>تكون جميع الملحقات والأدلة موجودة</li>
                <li>لا توجد علامات تلف أو خدوش</li>
                <li>لم يتم غسله أو تعديله (للملابس)</li>
                <li>تكون الملصقات والعلامات متصلة</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. المنتجات غير القابلة للإرجاع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>الأصناف التالية غير قابلة للإرجاع لأسباب صحية أو عملية:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>منتجات النظافة الشخصية المفتوحة أو المستخدمة</li>
                <li>المنتجات القابلة للتلف (الطعام، الزهور)</li>
                <li>المنتجات المخصصة أو المصنوعة حسب الطلب</li>
                <li>البرمجيات أو المحتوى الرقمي الذي تم تنزيله</li>
                <li>بطاقات الهدايا</li>
                <li>الملابس الداخلية والجوارب المفتوحة</li>
                <li>العناصر المخفضة في التصفية النهائية (حسب التوضيح)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. خطوات الإرجاع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      تواصل معنا
                    </h4>
                    <p className="text-sm">
                      اتصل بفريق الدعم عبر البريد الإلكتروني أو الهاتف لبدء عملية
                      الإرجاع. ستحتاج إلى رقم الطلب.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      احصل على رقم الإرجاع
                    </h4>
                    <p className="text-sm">
                      سنزودك برقم إرجاع (RMA) وتعليمات الشحن. لا ترسل المنتج دون
                      الحصول على رقم الإرجاع.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      قم بتغليف المنتج
                    </h4>
                    <p className="text-sm">
                      أعد تغليف المنتج بعناية في عبوته الأصلية مع جميع الملحقات.
                      أضف رقم الإرجاع داخل الطرد.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      شحن المنتج
                    </h4>
                    <p className="text-sm">
                      أرسل المنتج إلى العنوان المحدد. احتفظ برقم التتبع للمتابعة.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      استلم الاسترداد
                    </h4>
                    <p className="text-sm">
                      بعد فحص المنتج (3-5 أيام عمل)، سنقوم بمعالجة الاسترداد.
                      سيظهر في حسابك خلال 7-14 يوم عمل.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. تكاليف الشحن</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  5.1 في حالة العيوب أو الأخطاء
                </h3>
                <p>
                  إذا كان المنتج معيباً أو وصلك منتج خاطئ، سنتحمل نحن تكاليف
                  الإرجاع بالكامل. سنرسل لك ملصق شحن مدفوع مسبقاً.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  5.2 في حالة تغيير الرأي
                </h3>
                <p>
                  إذا كنت ترغب في إرجاع منتج لأي سبب آخر (تغيير الرأي، لا يناسبك،
                  إلخ)، ستكون تكاليف الشحن على عاتقك.
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-foreground mb-2">ملاحظة:</h4>
                <p className="text-sm">
                  تكاليف الشحن الأصلية غير قابلة للاسترداد إلا في حالة العيوب أو
                  الأخطاء من جانبنا.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. الاستبدال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                يمكنك استبدال المنتج بمقاس أو لون أو موديل مختلف في نفس الفترة
                (14 يوم). الاستبدال مجاني إذا كان المنتج معيباً أو خاطئاً من
                جانبنا.
              </p>
              <p className="mt-2">
                في حالة الاختلاف في السعر عند الاستبدال، سنقوم بتسوية الفرق معك.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. المنتجات المعيبة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                إذا وصلك منتج تالف أو معيب، يرجى:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>التواصل معنا خلال 48 ساعة من الاستلام</li>
                <li>تقديم صور واضحة للعيب أو التلف</li>
                <li>عدم استخدام المنتج إذا كان ذلك آمناً</li>
              </ul>
              <p className="mt-4">
                سنقوم باستبدال المنتج فوراً أو استرداد كامل المبلغ حسب رغبتك، على
                نفقتنا الخاصة.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. الاسترداد المتأخر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                إذا لم تستلم الاسترداد بعد 14 يوم عمل من تأكيد الإرجاع:
              </p>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>تحقق من حسابك البنكي مرة أخرى</li>
                <li>تواصل مع مصرفك أو شركة بطاقة الائتمان</li>
                <li>اتصل بنا على support@shopko.com</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. الاتصال بنا</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>لبدء عملية الإرجاع أو الاستبدال أو لأي استفسارات:</p>
              <ul className="space-y-2 mt-2">
                <li>📧 البريد الإلكتروني: support@egygo.me</li>
                <li>📱 الهاتف: <span dir="ltr">01034324951</span> (من 9 صباحاً - 6 مساءً)</li>
                <li>💬 الدردشة المباشرة على الموقع</li>
              </ul>

              <div className="mt-6 pt-4 border-t">
                <Button size="lg" asChild>
                  <Link to="/contact">تواصل مع الدعم</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
