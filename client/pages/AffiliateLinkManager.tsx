import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { productsApi } from "@/lib/api";
import { useAuth } from "@/contexts/AppwriteAuthContext";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LinkIcon,
  Copy,
  ExternalLink,
  TrendingUp,
  Eye,
  ShoppingCart,
  DollarSign,
  Plus,
  Trash2,
} from "lucide-react";
import LinkGenerator from "@/components/affiliate/LinkGenerator";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

// Generate random 8-character code
const generateLinkCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function AffiliateLinkManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch all products
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.getAll(),
  });

  const products = Array.isArray(productsData) ? productsData : productsData?.products || [];

  // Fetch affiliate's links
  const { data: affiliateLinks = [], isLoading: linksLoading } = useQuery({
    queryKey: ["affiliate-links", user?.$id],
    queryFn: async () => {
      if (!user?.$id) return [];
      const response = await databases.listDocuments(
        DATABASE_ID,
        "affiliate_links",
        [Query.equal("affiliateId", user.$id), Query.orderDesc("$createdAt")]
      );
      return response.documents;
    },
    enabled: !!user?.$id,
  });

  // Create link mutation
  const createLink = useMutation({
    mutationFn: async ({
      productId,
      linkCode,
    }: {
      productId: string;
      linkCode: string;
    }) => {
      if (!user?.$id) throw new Error("User not authenticated");

      // Check if code already exists
      const existing = await databases.listDocuments(
        DATABASE_ID,
        "affiliate_links",
        [Query.equal("linkCode", linkCode)]
      );

      if (existing.documents.length > 0) {
        throw new Error("رمز الرابط مستخدم بالفعل. جرب رمز آخر.");
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        "affiliate_links",
        ID.unique(),
        {
          affiliateId: user.$id,
          productId,
          linkCode,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
          lastClickAt: null,
        }
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-links"] });
      toast({
        title: "تم إنشاء الرابط! 🎉",
        description: "يمكنك الآن مشاركة الرابط مع عملائك",
      });
      setSelectedProductId("");
      setCustomCode("");
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete link mutation
  const deleteLink = useMutation({
    mutationFn: async (linkId: string) => {
      await databases.deleteDocument(DATABASE_ID, "affiliate_links", linkId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-links"] });
      toast({
        title: "تم حذف الرابط",
        description: "تم حذف الرابط بنجاح",
      });
    },
  });

  const handleCreateLink = () => {
    if (!selectedProductId) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار منتج",
        variant: "destructive",
      });
      return;
    }

    const linkCode = customCode.trim() || generateLinkCode();
    createLink.mutate({ productId: selectedProductId, linkCode });
  };

  const copyLink = (linkCode: string) => {
    const fullLink = `${window.location.origin}/l/${linkCode}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedCode(linkCode);
    toast({
      title: "تم النسخ! ✓",
      description: "تم نسخ الرابط إلى الحافظة",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openLink = (linkCode: string) => {
    window.open(`/l/${linkCode}`, "_blank");
  };

  if (!user?.isAffiliate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <LinkIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold">هذه الصفحة للمسوقين فقط</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              يجب أن يكون حسابك مفعّلاً كحساب مسوق للوصول إلى أدوات إنشاء الروابط التسويقية
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button onClick={() => navigate("/update-affiliate-prefs")}>
                تفعيل حساب المسوق
              </Button>
              <Button variant="outline" onClick={() => navigate("/affiliate")}>
                معرفة المزيد عن التسويق بالعمولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">إدارة روابط التسويق</h1>
        <p className="text-muted-foreground">
          أنشئ روابط تتبع خاصة لكل منتج وتابع أداء حملاتك
        </p>
      </div>

      {/* Smart Link Generator Component */}
      <LinkGenerator />

      {/* Create New Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إنشاء رابط جديد
          </CardTitle>
          <CardDescription>
            اختر منتجاً وأنشئ رابط تسويقي خاص به
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label>اختر المنتج</Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
                disabled={productsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر منتج..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.price.toFixed(2)} جنيه
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Custom Code (Optional) */}
            <div className="space-y-2">
              <Label>رمز مخصص (اختياري)</Label>
              <Input
                placeholder="اتركه فارغاً للتوليد التلقائي"
                value={customCode}
                onChange={(e) =>
                  setCustomCode(e.target.value.toUpperCase().slice(0, 12))
                }
                maxLength={12}
              />
              <p className="text-xs text-muted-foreground">
                سيتم توليد رمز عشوائي إذا تركت هذا الحقل فارغاً
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreateLink}
            disabled={!selectedProductId || createLink.isPending}
            className="w-full md:w-auto"
          >
            <LinkIcon className="ml-2 h-4 w-4" />
            إنشاء الرابط
          </Button>
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>روابطك التسويقية ({affiliateLinks.length})</CardTitle>
          <CardDescription>
            جميع الروابط التي أنشأتها مع إحصائيات الأداء
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linksLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              جاري التحميل...
            </div>
          ) : affiliateLinks.length === 0 ? (
            <div className="text-center py-8">
              <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">
                لم تنشئ أي روابط بعد
              </p>
              <p className="text-sm text-muted-foreground">
                ابدأ بإنشاء أول رابط تسويقي لك من الأعلى
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المنتج</TableHead>
                    <TableHead>رمز الرابط</TableHead>
                    <TableHead className="text-center">
                      <Eye className="h-4 w-4 inline ml-1" />
                      نقرات
                    </TableHead>
                    <TableHead className="text-center">
                      <ShoppingCart className="h-4 w-4 inline ml-1" />
                      تحويلات
                    </TableHead>
                    <TableHead className="text-center">
                      <TrendingUp className="h-4 w-4 inline ml-1" />
                      معدل التحويل
                    </TableHead>
                    <TableHead className="text-center">
                      <DollarSign className="h-4 w-4 inline ml-1" />
                      العمولة
                    </TableHead>
                    <TableHead className="text-left">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliateLinks.map((link: any) => {
                    const product = products.find(
                      (p) => p.id === link.productId
                    );
                    const conversionRate =
                      link.clicks > 0
                        ? ((link.conversions / link.clicks) * 100).toFixed(1)
                        : "0.0";

                    return (
                      <TableRow key={link.$id}>
                        <TableCell className="font-medium">
                          {product?.name || "منتج غير معروف"}
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {link.linkCode}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{link.clicks || 0}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {link.conversions || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              parseFloat(conversionRate) > 5
                                ? "default"
                                : "secondary"
                            }
                          >
                            {conversionRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-green-600">
                          {(link.revenue || 0).toFixed(2)} جنيه
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyLink(link.linkCode)}
                            >
                              {copiedCode === link.linkCode ? (
                                <Badge variant="default" className="h-4 w-4 p-0">
                                  ✓
                                </Badge>
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openLink(link.linkCode)}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteLink.mutate(link.$id)}
                              disabled={deleteLink.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-orange-500/10 border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 نصائح لزيادة أرباحك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • شارك الروابط على وسائل التواصل الاجتماعي للوصول لجمهور أكبر
          </p>
          <p className="text-sm">
            • أنشئ محتوى قيم حول المنتجات التي تسوق لها
          </p>
          <p className="text-sm">
            • استخدم الكوبونات الخاصة بك لتحفيز العملاء على الشراء
          </p>
          <p className="text-sm">
            • راقب الإحصائيات بانتظام لمعرفة أي المنتجات تحقق أفضل أداء
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
