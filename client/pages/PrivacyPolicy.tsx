import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">سياسة الخصوصية</h1>
          <p className="text-muted-foreground">
            آخر تحديث: 1 أكتوبر 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. المعلومات التي نجمعها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  1.1 المعلومات الشخصية
                </h3>
                <p>نقوم بجمع المعلومات التالية عند تسجيلك أو إجراء عملية شراء:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>الاسم الكامل</li>
                  <li>البريد الإلكتروني</li>
                  <li>رقم الهاتف</li>
                  <li>عنوان الشحن والفواتير</li>
                  <li>معلومات الدفع (يتم تشفيرها)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  1.2 المعلومات التقنية
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>عنوان IP</li>
                  <li>نوع المتصفح والجهاز</li>
                  <li>نظام التشغيل</li>
                  <li>ملفات تعريف الارتباط (Cookies)</li>
                  <li>سجل التصفح على موقعنا</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. كيفية استخدام معلوماتك</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>نستخدم معلوماتك للأغراض التالية:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>معالجة وإتمام طلباتك</li>
                <li>التواصل معك بخصوص طلباتك وحسابك</li>
                <li>تحسين خدماتنا وتجربة المستخدم</li>
                <li>إرسال العروض والتحديثات (يمكنك إلغاء الاشتراك)</li>
                <li>منع الاحتيال وتعزيز الأمان</li>
                <li>الامتثال للمتطلبات القانونية</li>
                <li>تحليل الأداء والإحصائيات</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. مشاركة المعلومات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>نحن لا نبيع معلوماتك الشخصية. قد نشارك معلوماتك مع:</p>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.1 مقدمي الخدمات
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>شركات الشحن والتوصيل</li>
                  <li>معالجي الدفع (Stripe، PayPal)</li>
                  <li>مزودي الاستضافة والبنية التحتية</li>
                  <li>أدوات التحليل (Google Analytics)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3.2 المتطلبات القانونية
                </h3>
                <p>
                  قد نفصح عن معلوماتك إذا كان ذلك مطلوباً بموجب القانون أو لحماية
                  حقوقنا وسلامة مستخدمينا.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. حماية المعلومات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>نتخذ إجراءات أمنية لحماية معلوماتك، بما في ذلك:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>التشفير باستخدام SSL/TLS</li>
                <li>جدران الحماية والأنظمة الأمنية</li>
                <li>الوصول المحدود للبيانات الحساسة</li>
                <li>المراجعة الدورية للأمن</li>
                <li>النسخ الاحتياطي المنتظم</li>
              </ul>
              <p className="mt-4">
                ومع ذلك، لا يمكن ضمان أمان الإنترنت بنسبة 100%. نحثك على حماية كلمة
                المرور الخاصة بك.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. ملفات تعريف الارتباط (Cookies)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>نستخدم ملفات تعريف الارتباط لـ:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>تذكر تفضيلاتك وإعداداتك</li>
                <li>الحفاظ على سلة التسوق</li>
                <li>تحليل حركة المرور على الموقع</li>
                <li>تحسين تجربة المستخدم</li>
              </ul>
              <p className="mt-4">
                يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. حقوقك</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>لديك الحقوق التالية فيما يتعلق بمعلوماتك:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>الوصول إلى معلوماتك الشخصية</li>
                <li>تصحيح المعلومات غير الدقيقة</li>
                <li>حذف معلوماتك (بشرط عدم وجود التزامات قانونية)</li>
                <li>إلغاء الاشتراك في النشرات الإخبارية</li>
                <li>تقييد معالجة معلوماتك</li>
                <li>نقل بياناتك</li>
              </ul>
              <p className="mt-4">
                للمطالبة بأي من هذه الحقوق، يرجى التواصل معنا.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. الأطفال</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                خدماتنا غير موجهة للأطفال دون سن 18 عاماً. لا نجمع معلومات عن قصد
                من الأطفال. إذا علمنا أننا جمعنا معلومات من طفل، سنحذفها فوراً.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. الروابط الخارجية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                قد يحتوي موقعنا على روابط لمواقع خارجية. لسنا مسؤولين عن ممارسات
                الخصوصية لهذه المواقع. ننصحك بمراجعة سياسات الخصوصية الخاصة بهم.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. التغييرات على السياسة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات
                جوهرية عبر البريد الإلكتروني أو من خلال إشعار بارز على الموقع.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. الاتصال بنا</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية:
              </p>
              <ul className="space-y-2 mt-2">
                <li>📧 البريد الإلكتروني: privacy@shopko.com</li>
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
