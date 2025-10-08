import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">شروط الاستخدام</h1>
          <p className="text-muted-foreground">
            آخر تحديث: 1 أكتوبر 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. مقدمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                مرحباً بك في إيجي جو (EgyGo). باستخدامك لموقعنا، فإنك توافق على الالتزام بشروط
                الاستخدام التالية. يرجى قراءتها بعناية قبل استخدام خدماتنا.
              </p>
              <p>
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات
                جوهرية عبر البريد الإلكتروني أو من خلال إشعار على الموقع.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. استخدام الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  2.1 الأهلية
                </h3>
                <p>
                  يجب أن يكون عمرك 18 عاماً على الأقل لاستخدام خدماتنا. باستخدامك
                  للموقع، فإنك تقر بأنك تستوفي هذا الشرط.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  2.2 حسابك
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>أنت مسؤول عن الحفاظ على سرية بيانات حسابك</li>
                  <li>يجب عليك إخطارنا فوراً بأي استخدام غير مصرح به لحسابك</li>
                  <li>نحن غير مسؤولين عن أي خسارة ناتجة عن عدم الامتثال لهذا البند</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  2.3 الاستخدام المقبول
                </h3>
                <p>يُمنع استخدام الموقع في:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>أي غرض غير قانوني أو احتيالي</li>
                  <li>التحرش أو الإساءة لمستخدمين آخرين</li>
                  <li>نشر محتوى مسيء أو ضار أو غير لائق</li>
                  <li>محاولة اختراق أو إلحاق الضرر بالموقع</li>
                  <li>جمع معلومات المستخدمين الآخرين دون إذن</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. المنتجات والطلبات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.1 معلومات المنتج
                </h3>
                <p>
                  نبذل قصارى جهدنا لعرض المنتجات بدقة، لكن لا يمكننا ضمان أن عرض
                  الألوان على شاشتك دقيق تماماً.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.2 التسعير
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>جميع الأسعار معروضة بالجنيه المصري</li>
                  <li>نحتفظ بالحق في تغيير الأسعار في أي وقت</li>
                  <li>في حالة وجود خطأ في السعر، سنخطرك ونعطيك خيار إلغاء الطلب</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.3 تأكيد الطلب
                </h3>
                <p>
                  استلامك لرسالة تأكيد الطلب لا يعني قبولنا للطلب. نحتفظ بالحق في
                  رفض أو إلغاء أي طلب لأي سبب.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. الشحن والتوصيل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4.1 مناطق التوصيل
                </h3>
                <p>
                  نقوم بالتوصيل لجميع أنحاء جمهورية مصر العربية. قد تختلف أوقات
                  التوصيل حسب الموقع.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4.2 مدة التوصيل
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>القاهرة والجيزة: 2-3 أيام عمل</li>
                  <li>باقي المحافظات: 3-5 أيام عمل</li>
                  <li>قد تزيد المدة في المواسم والأعياد</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  4.3 رسوم الشحن
                </h3>
                <p>
                  الشحن مجاني للطلبات فوق 500 جنيه. تطبق رسوم شحن بقيمة 50 جنيه
                  للطلبات الأقل من ذلك.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. الإرجاع والاسترداد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  5.1 حق الإرجاع
                </h3>
                <p>
                  يمكنك إرجاع المنتج خلال 14 يوم من تاريخ الاستلام، بشرط أن يكون
                  المنتج في حالته الأصلية مع التغليف والملحقات.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  5.2 المنتجات غير القابلة للإرجاع
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>المنتجات المخصصة أو المصنوعة حسب الطلب</li>
                  <li>المنتجات سريعة التلف</li>
                  <li>المنتجات الرقمية التي تم تنزيلها</li>
                  <li>منتجات النظافة الشخصية المفتوحة</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  5.3 طريقة الاسترداد
                </h3>
                <p>
                  سيتم استرداد المبلغ بنفس طريقة الدفع الأصلية خلال 7-14 يوم عمل من
                  استلام المنتج المرتجع.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. برنامج الشراكة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  6.1 العضوية
                </h3>
                <p>
                  للانضمام إلى برنامج الشراكة، يجب أن تكون لديك حساب نشط وأن توافق على
                  شروط البرنامج الإضافية.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  6.2 العمولات
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>تختلف نسب العمولة حسب المنتج (5-25%)</li>
                  <li>يتم احتساب العمولة بعد إتمام عملية البيع وتأكيد الاستلام</li>
                  <li>لا تطبق العمولات على الطلبات الملغاة أو المرتجعة</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  6.3 سحب الأرباح
                </h3>
                <p>
                  يمكن سحب الأرباح عند الوصول للحد الأدنى (500 جنيه) خلال 3-7 أيام
                  عمل.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. الملكية الفكرية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                جميع المحتويات على الموقع، بما في ذلك النصوص والصور والشعارات
                والتصميمات، محمية بحقوق الملكية الفكرية. يُمنع استخدامها دون إذن
                كتابي مسبق.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. إخلاء المسؤولية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                نقدم الموقع "كما هو" دون أي ضمانات. لا نتحمل المسؤولية عن:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع</li>
                <li>انقطاع الخدمة أو الأخطاء التقنية</li>
                <li>دقة أو اكتمال المعلومات المقدمة</li>
                <li>محتوى أو سلوك أطراف ثالثة</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. القانون الحاكم</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                تخضع هذه الشروط للقوانين المصرية. أي نزاع ينشأ عن هذه الشروط يخضع
                للاختصاص القضائي للمحاكم المصرية.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. الاتصال بنا</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                إذا كان لديك أي أسئلة حول شروط الاستخدام، يرجى التواصل معنا:
              </p>
              <ul className="space-y-2 mt-2">
                <li>📧 البريد الإلكتروني: support@shopko.com</li>
                <li>📱 الهاتف: +20 123 456 7890</li>
                <li>📍 العنوان: القاهرة، مصر</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
