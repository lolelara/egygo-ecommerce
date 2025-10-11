import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, Award, BookOpen, CheckCircle } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "أساسيات التسويق بالعمولة",
    description: "تعلم المبادئ الأساسية للتسويق بالعمولة وكيفية البدء بنجاح",
    level: "مبتدئ",
    duration: "2 ساعة",
    lessons: 8,
    progress: 0,
    thumbnail: "https://placehold.co/400x225/6366f1/ffffff?text=Affiliate+Marketing+Basics",
    topics: [
      "ما هو التسويق بالعمولة",
      "كيفية اختيار المنتجات المناسبة",
      "إنشاء روابط الشراكة",
      "تتبع الأداء والإحصائيات"
    ]
  },
  {
    id: 2,
    title: "استراتيجيات وسائل التواصل الاجتماعي",
    description: "احترف التسويق عبر فيسبوك، إنستجرام، تيك توك وتويتر",
    level: "متوسط",
    duration: "3 ساعات",
    lessons: 12,
    progress: 0,
    thumbnail: "https://placehold.co/400x225/8b5cf6/ffffff?text=Social+Media+Marketing",
    topics: [
      "إنشاء محتوى جذاب",
      "استخدام الهاشتاجات بفعالية",
      "بناء جمهور مستهدف",
      "الإعلانات المدفوعة"
    ]
  },
  {
    id: 3,
    title: "كتابة المحتوى التسويقي",
    description: "تعلم كتابة محتوى مقنع يزيد من معدلات التحويل",
    level: "متوسط",
    duration: "2.5 ساعة",
    lessons: 10,
    progress: 0,
    thumbnail: "https://placehold.co/400x225/ec4899/ffffff?text=Content+Writing",
    topics: [
      "أساسيات الكتابة الإقناعية",
      "كتابة مراجعات المنتجات",
      "إنشاء عناوين جذابة",
      "دعوات الإجراء الفعالة"
    ]
  },
  {
    id: 4,
    title: "تحسين محركات البحث (SEO)",
    description: "احصل على زيارات مجانية من جوجل لزيادة مبيعاتك",
    level: "متقدم",
    duration: "4 ساعات",
    lessons: 15,
    progress: 0,
    thumbnail: "https://placehold.co/400x225/10b981/ffffff?text=SEO+Mastery",
    topics: [
      "البحث عن الكلمات المفتاحية",
      "تحسين المحتوى للسيو",
      "بناء الروابط الخلفية",
      "تحليل المنافسين"
    ]
  },
  {
    id: 5,
    title: "التسويق عبر البريد الإلكتروني",
    description: "بناء قائمة بريدية وزيادة المبيعات من خلال الإيميل ماركتنج",
    level: "متوسط",
    duration: "2 ساعة",
    lessons: 9,
    progress: 0,
    thumbnail: "https://placehold.co/400x225/f59e0b/ffffff?text=Email+Marketing",
    topics: [
      "بناء قائمة بريدية",
      "كتابة رسائل فعالة",
      "أتمتة الحملات البريدية",
      "تحليل النتائج"
    ]
  },
  {
    id: 6,
    title: "تحليل البيانات والإحصائيات",
    description: "استخدم البيانات لتحسين استراتيجيتك وزيادة أرباحك",
    level: "متقدم",
    duration: "3 ساعات",
    lessons: 11,
    progress: 0,
    thumbnail: "https://placehold.co/400x225/3b82f6/ffffff?text=Data+Analytics",
    topics: [
      "فهم مؤشرات الأداء الرئيسية",
      "استخدام Google Analytics",
      "تتبع التحويلات",
      "اتخاذ قرارات مبنية على البيانات"
    ]
  }
];

const getLevelColor = (level: string) => {
  switch (level) {
    case "مبتدئ":
      return "bg-green-500";
    case "متوسط":
      return "bg-yellow-500";
    case "متقدم":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function AffiliateCourses() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">الكورسات التسويقية</h1>
        <p className="text-muted-foreground">
          تعلم استراتيجيات التسويق الاحترافية لزيادة مبيعاتك وأرباحك
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">🎓 مسار التعلم الشامل</h3>
              <p className="text-sm mb-3">
                ابدأ من الأساسيات وتقدم حتى تصبح خبيراً في التسويق بالعمولة. 
                جميع الكورسات مجانية لشركائنا!
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>6 كورسات</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>16.5 ساعة</span>
                </div>
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" />
                  <span>65 درس</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video bg-muted">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  <span>{course.lessons} دروس</span>
                </div>
              </div>

              {course.progress > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>التقدم</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
              )}

              <div>
                <h4 className="font-semibold text-sm mb-2">ما ستتعلمه:</h4>
                <ul className="space-y-1">
                  {course.topics.slice(0, 3).map((topic, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" disabled>
                <PlayCircle className="h-4 w-4 mr-2" />
                قريباً
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>💡 نصائح للاستفادة القصوى</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">📚 تعلم بالترتيب</h4>
              <p className="text-sm text-muted-foreground">
                ابدأ بالكورسات الأساسية ثم انتقل للمتقدمة للحصول على أفضل فهم
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">✍️ طبق ما تتعلمه</h4>
              <p className="text-sm text-muted-foreground">
                لا تكتفي بالمشاهدة، طبق الاستراتيجيات على حملاتك التسويقية
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">📝 دون الملاحظات</h4>
              <p className="text-sm text-muted-foreground">
                احتفظ بملاحظاتك وراجعها بانتظام لتعزيز التعلم
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">🤝 شارك مع الآخرين</h4>
              <p className="text-sm text-muted-foreground">
                تبادل الخبرات مع مسوقين آخرين لتسريع تطورك
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
