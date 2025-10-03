import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <HelpCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold mb-2">الأسئلة الشائعة</h1>
        <p className="text-muted-foreground">
          إجابات للأسئلة الأكثر شيوعاً
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>عن الطلبات والشراء</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>كيف أقوم بتقديم طلب؟</AccordionTrigger>
              <AccordionContent>
                اختر المنتج، أضفه للسلة، ثم اذهب للسلة وأكمل بيانات الشحن والدفع. ستتلقى رسالة تأكيد فوراً.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>هل يمكنني تعديل طلبي بعد تقديمه؟</AccordionTrigger>
              <AccordionContent>
                نعم، يمكنك التواصل معنا خلال ساعة من تقديم الطلب لتعديله. بعد ذلك قد يكون الطلب قيد التجهيز.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>كيف ألغي طلبي؟</AccordionTrigger>
              <AccordionContent>
                يمكنك إلغاء الطلب من صفحة "طلباتي" قبل شحنه. بعد الشحن يمكنك رفض الاستلام أو طلب الإرجاع.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>عن الدفع</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-4">
              <AccordionTrigger>ما طرق الدفع المتاحة؟</AccordionTrigger>
              <AccordionContent>
                نقبل الدفع عند الاستلام (نقداً) أو الدفع الإلكتروني ببطاقة الائتمان/الفيزا.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>هل الدفع الإلكتروني آمن؟</AccordionTrigger>
              <AccordionContent>
                نعم، نستخدم بوابات دفع معتمدة وآمنة 100% مع تشفير SSL لحماية بياناتك المالية.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>هل يوجد رسوم إضافية؟</AccordionTrigger>
              <AccordionContent>
                لا توجد رسوم مخفية. السعر الظاهر + رسوم الشحن فقط. قد تطبق رسوم إضافية على المناطق النائية.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>عن الشحن والإرجاع</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-7">
              <AccordionTrigger>كم تستغرق مدة التوصيل؟</AccordionTrigger>
              <AccordionContent>
                الشحن القياسي 2-5 أيام عمل، والشحن السريع 1-2 يوم في المدن الرئيسية.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>ما سياسة الإرجاع والاستبدال؟</AccordionTrigger>
              <AccordionContent>
                يمكنك الإرجاع خلال 14 يوم من الاستلام إذا كان المنتج بحالته الأصلية. نتحمل تكلفة الإرجاع في حالة العيوب.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger>كيف أتتبع طلبي؟</AccordionTrigger>
              <AccordionContent>
                ستتلقى رقم تتبع عبر SMS والبريد. يمكنك أيضاً متابعة الطلب من صفحة "طلباتي" في حسابك.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>عن الحساب والأمان</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-10">
              <AccordionTrigger>هل أحتاج حساب للشراء؟</AccordionTrigger>
              <AccordionContent>
                الحساب غير إلزامي لكنه يوفر مزايا: تتبع الطلبات، حفظ العناوين، قائمة الأمنيات، والعروض الخاصة.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-11">
              <AccordionTrigger>كيف أغير كلمة المرور؟</AccordionTrigger>
              <AccordionContent>
                اذهب لصفحة "حسابي" ثم "الإعدادات" واضغط على "تغيير كلمة المرور". ستتلقى رابط تأكيد عبر البريد.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-12">
              <AccordionTrigger>هل بياناتي آمنة؟</AccordionTrigger>
              <AccordionContent>
                نلتزم بحماية خصوصيتك. بياناتك مشفرة ولا نشاركها مع أي جهة خارجية. راجع سياسة الخصوصية للمزيد.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
