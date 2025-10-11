import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, Users, Target, Share2, BarChart3 } from "lucide-react";

const tips = [
  {
    id: 1,
    icon: Target,
    title: "استهدف الجمهور المناسب",
    category: "استراتيجية",
    description: "حدد جمهورك المستهدف بدقة. افهم احتياجاتهم واهتماماتهم لتقديم المنتجات المناسبة لهم.",
    tips: [
      "استخدم تحليلات وسائل التواصل لفهم جمهورك",
      "أنشئ محتوى يتناسب مع اهتماماتهم",
      "ركز على المنتجات التي تحل مشاكلهم"
    ]
  },
  {
    id: 2,
    icon: Share2,
    title: "استخدم وسائل التواصل بذكاء",
    category: "تسويق",
    description: "اختر المنصات المناسبة لجمهورك وانشر محتوى قيم بانتظام.",
    tips: [
      "انشر بانتظام (3-5 مرات أسبوعياً)",
      "استخدم الهاشتاجات ذات الصلة",
      "تفاعل مع متابعيك وأجب على تعليقاتهم",
      "استخدم القصص والفيديوهات القصيرة"
    ]
  },
  {
    id: 3,
    icon: TrendingUp,
    title: "قدم قيمة حقيقية",
    category: "محتوى",
    description: "لا تبيع فقط، بل قدم محتوى مفيد يساعد جمهورك.",
    tips: [
      "اكتب مراجعات صادقة ومفصلة",
      "شارك تجربتك الشخصية مع المنتجات",
      "قدم نصائح حول كيفية استخدام المنتجات",
      "أنشئ مقارنات بين المنتجات المختلفة"
    ]
  },
  {
    id: 4,
    icon: Users,
    title: "بناء الثقة مع جمهورك",
    category: "علاقات",
    description: "الثقة هي أساس النجاح في التسويق بالعمولة.",
    tips: [
      "كن صادقاً في توصياتك",
      "لا تروج لمنتجات لم تجربها",
      "اعترف بعيوب المنتجات إن وجدت",
      "استجب لأسئلة واستفسارات متابعيك"
    ]
  },
  {
    id: 5,
    icon: BarChart3,
    title: "تتبع وحلل أداءك",
    category: "تحليل",
    description: "راقب نتائجك وحسّن استراتيجيتك باستمرار.",
    tips: [
      "استخدم لوحة التحكم لمتابعة الإحصائيات",
      "حدد المنتجات الأكثر مبيعاً",
      "اختبر أوقات النشر المختلفة",
      "تعلم من المنشورات الناجحة"
    ]
  },
  {
    id: 6,
    icon: Lightbulb,
    title: "كن مبدعاً في المحتوى",
    category: "إبداع",
    description: "تميز عن المنافسين بمحتوى فريد وجذاب.",
    tips: [
      "استخدم الصور والفيديوهات عالية الجودة",
      "أنشئ محتوى تعليمي (How-to)",
      "شارك قصص نجاح العملاء",
      "استخدم الإنفوجرافيك لتبسيط المعلومات"
    ]
  }
];

const quickTips = [
  "استخدم روابط قصيرة وسهلة التذكر",
  "أضف دعوة واضحة للإجراء (Call to Action)",
  "استفد من المناسبات والعروض الموسمية",
  "تعاون مع مسوقين آخرين",
  "استثمر في تعلم مهارات التسويق الرقمي",
  "كن صبوراً - النجاح يحتاج وقت"
];

export default function AffiliateMarketingTips() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">نصائح التسويق</h1>
        <p className="text-muted-foreground">
          اكتشف أفضل الاستراتيجيات والنصائح لزيادة مبيعاتك وأرباحك
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <Card key={tip.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{tip.title}</CardTitle>
                    <Badge variant="secondary">{tip.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{tip.description}</p>
                <div>
                  <h4 className="font-semibold text-sm mb-2">نصائح عملية:</h4>
                  <ul className="space-y-1">
                    {tip.tips.map((t, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>نصائح سريعة للنجاح</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <span className="text-primary font-bold">✓</span>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">💡 تذكر دائماً</h3>
          <p className="text-sm">
            النجاح في التسويق بالعمولة يعتمد على بناء علاقات طويلة الأمد مع جمهورك. 
            كن صادقاً، قدم قيمة حقيقية، وكن صبوراً. النتائج ستأتي مع الوقت والجهد المستمر.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
