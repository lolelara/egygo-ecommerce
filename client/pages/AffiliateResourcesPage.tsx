import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, BookOpen, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AffiliateResourcesPage() {
  const { user } = useAuth();

  const resources = [
    {
      title: "دليل المسوق الشامل",
      description: "كل ما تحتاج معرفته للبدء في التسويق بالعمولة",
      type: "pdf",
      icon: FileText,
      size: "2.5 MB"
    },
    {
      title: "فيديو تعليمي: كيف تبدأ",
      description: "شرح مفصل بالفيديو لاستخدام المنصة",
      type: "video",
      icon: Video,
      duration: "15 دقيقة"
    },
    {
      title: "استراتيجيات التسويق",
      description: "أفضل الطرق لزيادة مبيعاتك وعمولاتك",
      type: "guide",
      icon: BookOpen,
      size: "1.8 MB"
    }
  ];

  const externalLinks = [
    { title: "مدونة التسويق", url: "#" },
    { title: "قناة اليوتيوب", url: "#" },
    { title: "مجموعة الفيسبوك", url: "#" },
  ];

  if (!user?.isAffiliate && user?.role !== "affiliate") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            هذه الصفحة متاحة للمسوقين فقط
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">مصادر ومراجع</h1>
        <p className="text-muted-foreground">
          أدوات ومواد تعليمية لمساعدتك على النجاح
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg mt-4">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {resource.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{resource.type.toUpperCase()}</span>
                  <span>{resource.size || resource.duration}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>روابط مفيدة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <span className="font-medium">{link.title}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-500/10 to-purple-500/10">
        <CardContent className="p-6">
          <h3 className="font-bold mb-2">نصائح للنجاح</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ استخدم روابط التتبع في جميع منشوراتك</li>
            <li>✓ شارك محتوى قيم لجمهورك بانتظام</li>
            <li>✓ اختر منتجات تناسب اهتمامات متابعيك</li>
            <li>✓ راقب تحليلاتك باستمرار لتحسين الأداء</li>
            <li>✓ تواصل مع فريق الدعم عند الحاجة</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
