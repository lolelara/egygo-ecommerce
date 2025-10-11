import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const banners = [
  {
    id: 1,
    name: "بانر رئيسي - 1200x628",
    size: "1200x628",
    type: "Facebook/LinkedIn",
    url: "https://placehold.co/1200x628/6366f1/ffffff?text=EgyGo+Banner+1200x628",
    code: `<a href="https://egygo.me?ref=YOUR_CODE"><img src="https://egygo.me/banners/main-1200x628.jpg" alt="EgyGo"></a>`
  },
  {
    id: 2,
    name: "بانر مربع - 1080x1080",
    size: "1080x1080",
    type: "Instagram",
    url: "https://placehold.co/1080x1080/6366f1/ffffff?text=EgyGo+Square+1080x1080",
    code: `<a href="https://egygo.me?ref=YOUR_CODE"><img src="https://egygo.me/banners/square-1080x1080.jpg" alt="EgyGo"></a>`
  },
  {
    id: 3,
    name: "بانر عمودي - 1080x1920",
    size: "1080x1920",
    type: "Instagram Story",
    url: "https://placehold.co/1080x1920/6366f1/ffffff?text=EgyGo+Story+1080x1920",
    code: `<a href="https://egygo.me?ref=YOUR_CODE"><img src="https://egygo.me/banners/story-1080x1920.jpg" alt="EgyGo"></a>`
  },
  {
    id: 4,
    name: "بانر أفقي - 728x90",
    size: "728x90",
    type: "Website Header",
    url: "https://placehold.co/728x90/6366f1/ffffff?text=EgyGo+Header+728x90",
    code: `<a href="https://egygo.me?ref=YOUR_CODE"><img src="https://egygo.me/banners/header-728x90.jpg" alt="EgyGo"></a>`
  },
  {
    id: 5,
    name: "بانر جانبي - 300x600",
    size: "300x600",
    type: "Website Sidebar",
    url: "https://placehold.co/300x600/6366f1/ffffff?text=EgyGo+Sidebar+300x600",
    code: `<a href="https://egygo.me?ref=YOUR_CODE"><img src="https://egygo.me/banners/sidebar-300x600.jpg" alt="EgyGo"></a>`
  },
  {
    id: 6,
    name: "بانر صغير - 300x250",
    size: "300x250",
    type: "Website Widget",
    url: "https://placehold.co/300x250/6366f1/ffffff?text=EgyGo+Widget+300x250",
    code: `<a href="https://egygo.me?ref=YOUR_CODE"><img src="https://egygo.me/banners/widget-300x250.jpg" alt="EgyGo"></a>`
  }
];

export default function AffiliateBanners() {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const downloadBanner = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "تم التحميل!",
      description: "تم تحميل البانر بنجاح",
    });
  };

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ كود البانر إلى الحافظة",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">بانرات إعلانية</h1>
        <p className="text-muted-foreground">
          قم بتحميل بانرات جاهزة لاستخدامها في موقعك أو وسائل التواصل الاجتماعي
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <CardHeader>
              <CardTitle className="text-lg">{banner.name}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{banner.size}</Badge>
                <Badge variant="outline">{banner.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={banner.url}
                  alt={banner.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => downloadBanner(banner.url, banner.name)}
                  className="flex-1"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  تحميل
                </Button>
                <Button
                  onClick={() => copyCode(banner.code, banner.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedId === banner.id ? "تم النسخ!" : "نسخ الكود"}
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <p className="font-semibold mb-1">كود HTML:</p>
                <code className="block p-2 bg-muted rounded text-xs break-all">
                  {banner.code}
                </code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>كيفية الاستخدام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">📱 لوسائل التواصل الاجتماعي:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>اضغط على "تحميل" لتحميل البانر</li>
              <li>ارفع الصورة على حسابك في وسائل التواصل</li>
              <li>أضف رابط الشراكة الخاص بك في المنشور</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">🌐 للمواقع الإلكترونية:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>اضغط على "نسخ الكود" لنسخ كود HTML</li>
              <li>استبدل YOUR_CODE برمز الشراكة الخاص بك</li>
              <li>الصق الكود في موقعك حيث تريد ظهور البانر</li>
            </ol>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm">
              <strong>💡 نصيحة:</strong> استخدم البانرات المناسبة لكل منصة للحصول على أفضل النتائج
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
