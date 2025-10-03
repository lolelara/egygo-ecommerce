import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { productsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AppwriteAuthContext";
// import QRCode from "qrcode"; // Temporarily disabled for deployment
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Image as ImageIcon,
  Download,
  Copy,
  QrCode,
  Sparkles,
  Code,
  Share2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

// Banner sizes
const BANNER_SIZES = [
  { name: "Leaderboard", width: 728, height: 90 },
  { name: "Medium Rectangle", width: 300, height: 250 },
  { name: "Wide Skyscraper", width: 160, height: 600 },
  { name: "Mobile Banner", width: 320, height: 50 },
  { name: "Large Rectangle", width: 336, height: 280 },
  { name: "Half Page", width: 300, height: 600 },
];

export default function AffiliateCreatives() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedLinkCode, setSelectedLinkCode] = useState("");
  const [selectedSize, setSelectedSize] = useState(BANNER_SIZES[0]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch affiliate's links
  const { data: affiliateLinks = [] } = useQuery({
    queryKey: ["affiliate-links", user?.$id],
    queryFn: async () => {
      if (!user?.$id) return [];
      const response = await databases.listDocuments(
        DATABASE_ID,
        "affiliate_links",
        [Query.equal("affiliateId", user.$id)]
      );
      return response.documents;
    },
    enabled: !!user?.$id,
  });

  // Fetch products
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll(),
  });

  const products = Array.isArray(productsData)
    ? productsData
    : productsData?.products || [];

  // Generate QR Code
  useEffect(() => {
    if (selectedLinkCode) {
      const url = `${window.location.origin}/l/${selectedLinkCode}`;
      // QR Code generation temporarily disabled
      // QRCode.toDataURL(url, {
      //   width: 300,
      //   margin: 2,
      //   color: {
      //     dark: "#000000",
      //     light: "#ffffff",
      //   },
      // })
      //   .then((dataUrl) => setQrCodeUrl(dataUrl))
      //   .catch((err) => console.error(err));
      
      // Placeholder QR code
      setQrCodeUrl("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='300' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3EQR Code%3C/text%3E%3C/svg%3E");
    }
  }, [selectedLinkCode]);

  // Generate banner
  const generateBanner = () => {
    if (!canvasRef.current || !selectedLinkCode) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = selectedSize;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, "#f97316");
    gradient.addColorStop(1, "#fb923c");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";

    const link = affiliateLinks.find((l: any) => l.linkCode === selectedLinkCode);
    const product = products.find((p) => p.id === link?.productId);

    if (product) {
      ctx.fillText(
        product.name,
        width / 2,
        height / 2 - 20
      );
      ctx.font = "16px Arial";
      ctx.fillText(`احصل على خصم خاص!`, width / 2, height / 2 + 10);
      ctx.fillText(`egygo.com/l/${selectedLinkCode}`, width / 2, height / 2 + 35);
    } else {
      ctx.fillText("EGYGO", width / 2, height / 2 - 10);
      ctx.font = "16px Arial";
      ctx.fillText(`egygo.com/l/${selectedLinkCode}`, width / 2, height / 2 + 20);
    }
  };

  useEffect(() => {
    generateBanner();
  }, [selectedLinkCode, selectedSize, affiliateLinks, products]);

  const downloadBanner = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `banner-${selectedSize.width}x${selectedSize.height}.png`;
    link.href = url;
    link.click();

    toast({
      title: "تم التحميل! ✓",
      description: "تم تحميل البانر بنجاح",
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.download = `qr-code-${selectedLinkCode}.png`;
    link.href = qrCodeUrl;
    link.click();

    toast({
      title: "تم التحميل! ✓",
      description: "تم تحميل رمز QR بنجاح",
    });
  };

  const getEmbedCode = () => {
    if (!selectedLinkCode) return "";
    const url = `${window.location.origin}/l/${selectedLinkCode}`;
    return `<a href="${url}" target="_blank">
  <img src="${canvasRef.current?.toDataURL()}" alt="عرض خاص" />
</a>`;
  };

  const copyEmbedCode = () => {
    const code = getEmbedCode();
    navigator.clipboard.writeText(code);
    toast({
      title: "تم النسخ! ✓",
      description: "تم نسخ كود التضمين",
    });
  };

  if (!user?.isAffiliate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">هذه الصفحة للمسوقين فقط</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              يجب أن يكون حسابك مفعّلاً كحساب مسوق للوصول إلى البانرات والأدوات التسويقية
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <a href="/#/update-affiliate-prefs" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                تفعيل حساب المسوق
              </a>
              <a href="/#/affiliate" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                معرفة المزيد
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (affiliateLinks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              أنشئ رابط تسويقي أولاً لتتمكن من إنشاء البانرات
            </p>
            <Button onClick={() => (window.location.href = "/affiliate/dashboard")}>
              إنشاء رابط الآن
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">الأدوات التسويقية</h1>
        <p className="text-muted-foreground">
          بانرات، أكواد تضمين، ورموز QR جاهزة لحملاتك التسويقية
        </p>
      </div>

      {/* Link Selection */}
      <Card>
        <CardHeader>
          <CardTitle>اختر الرابط</CardTitle>
          <CardDescription>
            اختر الرابط التسويقي لإنشاء المواد الترويجية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedLinkCode} onValueChange={setSelectedLinkCode}>
            <SelectTrigger>
              <SelectValue placeholder="اختر رابط تسويقي..." />
            </SelectTrigger>
            <SelectContent>
              {affiliateLinks.map((link: any) => {
                const product = products.find((p) => p.id === link.productId);
                return (
                  <SelectItem key={link.$id} value={link.linkCode}>
                    {link.linkCode} - {product?.name || "منتج"}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedLinkCode && (
        <Tabs defaultValue="banners" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="banners">
              <ImageIcon className="ml-2 h-4 w-4" />
              البانرات
            </TabsTrigger>
            <TabsTrigger value="qr">
              <QrCode className="ml-2 h-4 w-4" />
              رمز QR
            </TabsTrigger>
            <TabsTrigger value="embed">
              <Code className="ml-2 h-4 w-4" />
              كود التضمين
            </TabsTrigger>
          </TabsList>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Banner Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات البانر</CardTitle>
                  <CardDescription>
                    اختر حجم البانر المناسب لمنصتك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>حجم البانر</Label>
                    <Select
                      value={selectedSize.name}
                      onValueChange={(name) => {
                        const size = BANNER_SIZES.find((s) => s.name === name);
                        if (size) setSelectedSize(size);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BANNER_SIZES.map((size) => (
                          <SelectItem key={size.name} value={size.name}>
                            {size.name} ({size.width}x{size.height})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Badge variant="outline">
                      {selectedSize.width}x{selectedSize.height} بكسل
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      مناسب لـ:{" "}
                      {selectedSize.name === "Leaderboard"
                        ? "أعلى الصفحات والمواقع"
                        : selectedSize.name === "Medium Rectangle"
                        ? "المدونات والمقالات"
                        : selectedSize.name === "Mobile Banner"
                        ? "التطبيقات والمواقع المحمولة"
                        : "الشريط الجانبي"}
                    </p>
                  </div>

                  <Button onClick={downloadBanner} className="w-full">
                    <Download className="ml-2 h-4 w-4" />
                    تحميل البانر
                  </Button>
                </CardContent>
              </Card>

              {/* Banner Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>معاينة البانر</CardTitle>
                  <CardDescription>
                    هكذا سيظهر البانر في حملتك
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-gray-50 flex items-center justify-center min-h-[300px]">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full h-auto shadow-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Banner Sizes Grid */}
            <Card>
              <CardHeader>
                <CardTitle>جميع المقاسات المتاحة</CardTitle>
                <CardDescription>
                  اختر المقاس المناسب لكل منصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {BANNER_SIZES.map((size) => (
                    <Button
                      key={size.name}
                      variant={
                        selectedSize.name === size.name ? "default" : "outline"
                      }
                      onClick={() => setSelectedSize(size)}
                      className="h-auto py-4 flex-col"
                    >
                      <span className="font-semibold">{size.name}</span>
                      <span className="text-xs mt-1">
                        {size.width}x{size.height}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* QR Code Tab */}
          <TabsContent value="qr">
            <Card>
              <CardHeader>
                <CardTitle>رمز QR</CardTitle>
                <CardDescription>
                  اطبعه على المنتجات، البروشورات، أو البطاقات
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="border rounded-lg shadow-lg"
                    />
                  )}
                  <div className="text-center">
                    <p className="text-sm font-medium mb-1">
                      egygo.com/l/{selectedLinkCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      امسح الرمز للوصول المباشر للمنتج
                    </p>
                  </div>
                  <Button onClick={downloadQRCode} size="lg">
                    <Download className="ml-2 h-4 w-4" />
                    تحميل رمز QR
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-3">طرق استخدام رمز QR:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• اطبعه على البروشورات والكتيبات التسويقية</li>
                    <li>• أضفه على بطاقات العمل الخاصة بك</li>
                    <li>• استخدمه في المعارض والفعاليات</li>
                    <li>• شاركه على وسائل التواصل الاجتماعي</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Embed Code Tab */}
          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle>كود التضمين HTML</CardTitle>
                <CardDescription>
                  انسخ هذا الكود وضعه في موقعك أو مدونتك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>كود HTML</Label>
                  <Textarea
                    value={getEmbedCode()}
                    readOnly
                    className="font-mono text-sm mt-2"
                    rows={5}
                  />
                </div>

                <Button onClick={copyEmbedCode} className="w-full">
                  <Copy className="ml-2 h-4 w-4" />
                  نسخ الكود
                </Button>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">كيفية الاستخدام:</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>انسخ الكود أعلاه</li>
                    <li>افتح محرر HTML لموقعك أو مدونتك</li>
                    <li>الصق الكود في المكان المناسب</li>
                    <li>احفظ وانشر التغييرات</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Marketing Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            نصائح للترويج الفعّال
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • استخدم البانرات في مواقع التواصل الاجتماعي لجذب الانتباه
          </p>
          <p className="text-sm">
            • ضع رموز QR في أماكن مرئية للحصول على أفضل النتائج
          </p>
          <p className="text-sm">
            • جرب أحجام مختلفة من البانرات لمعرفة أيها يحقق أفضل أداء
          </p>
          <p className="text-sm">
            • شارك المواد الترويجية على قنوات متعددة لزيادة الوصول
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
