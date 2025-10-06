import { useState } from "react";
import { Edit, Image, Layout, Wand2, Eye, Save, RotateCcw, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductTemplate {
  id: string;
  name: string;
  conversionRate: number;
  layout: "single-column" | "grid" | "story";
  description: string;
  preview: string;
}

const TEMPLATES: ProductTemplate[] = [
  {
    id: "classic",
    name: "الكلاسيكي",
    conversionRate: 3.2,
    layout: "single-column",
    description: "تصميم بسيط ومباشر للمنتجات العامة",
    preview: "/templates/classic.jpg",
  },
  {
    id: "ecommerce",
    name: "المتجر الإلكتروني",
    conversionRate: 4.5,
    layout: "grid",
    description: "مثالي للملابس والإكسسوارات مع معرض صور",
    preview: "/templates/ecommerce.jpg",
  },
  {
    id: "story",
    name: "الصفحة الطويلة",
    conversionRate: 5.1,
    layout: "story",
    description: "سرد قصصي يزيد التفاعل والمبيعات",
    preview: "/templates/story.jpg",
  },
  {
    id: "minimal",
    name: "الحديث البسيط",
    conversionRate: 4.0,
    layout: "single-column",
    description: "تصميم عصري نظيف للمنتجات الفاخرة",
    preview: "/templates/minimal.jpg",
  },
];

interface AIsuggestion {
  type: "title" | "description" | "tags" | "pricing";
  suggestion: string;
  reason: string;
}

interface EnhancedProductEditorProps {
  productId?: string;
  onSave?: (data: any) => void;
}

export function EnhancedProductEditor({ productId, onSave }: EnhancedProductEditorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    images: [] as string[],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIsuggestion[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { toast } = useToast();

  const template = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  const handleGenerateAISuggestions = async () => {
    setIsGeneratingAI(true);
    try {
      // Simulate AI generation - replace with real AI API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockSuggestions: AIsuggestion[] = [
        {
          type: "title",
          suggestion: "حذاء رياضي فاخر - تصميم عصري مريح للاستخدام اليومي",
          reason: "عنوان أطول بكلمات مفتاحية يزيد معدل النقر بنسبة 23%",
        },
        {
          type: "description",
          suggestion:
            "استمتع بالراحة القصوى مع حذائنا الرياضي المصمم بأحدث التقنيات. مثالي للرياضة والاستخدام اليومي، مع نعل مرن يوفر دعماً مثالياً للقدم.",
          reason: "وصف يركز على الفوائد يزيد التحويل بنسبة 15%",
        },
        {
          type: "tags",
          suggestion: "أحذية رياضية, رياضة, راحة, عصري, جودة عالية",
          reason: "كلمات مفتاحية محسّنة لمحركات البحث",
        },
        {
          type: "pricing",
          suggestion: "1299 جنيه (بدلاً من 1499 جنيه)",
          reason: "سعر نهايته بـ 99 يزيد المبيعات بنسبة 8%",
        },
      ];

      setAiSuggestions(mockSuggestions);
      toast({
        title: "✨ تم توليد الاقتراحات",
        description: "اختر الاقتراحات المناسبة لتطبيقها",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في توليد الاقتراحات. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const applySuggestion = (suggestion: AIsuggestion) => {
    switch (suggestion.type) {
      case "title":
        setProductData((prev) => ({ ...prev, name: suggestion.suggestion }));
        break;
      case "description":
        setProductData((prev) => ({ ...prev, description: suggestion.suggestion }));
        break;
      case "tags":
        setProductData((prev) => ({ ...prev, tags: suggestion.suggestion }));
        break;
      case "pricing":
        const priceMatch = suggestion.suggestion.match(/(\d+)/);
        if (priceMatch) {
          setProductData((prev) => ({ ...prev, price: priceMatch[1] }));
        }
        break;
    }
    toast({
      title: "✅ تم التطبيق",
      description: "تم تطبيق الاقتراح بنجاح",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSave?.(productData);
      toast({
        title: "✅ تم الحفظ",
        description: "تم حفظ المنتج بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ المنتج. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">محرر المنتج المتقدم</CardTitle>
              <CardDescription>
                استخدم القوالب المحسّنة والذكاء الاصطناعي لإنشاء صفحات منتج عالية التحويل
              </CardDescription>
            </div>
            <Button onClick={handleGenerateAISuggestions} disabled={isGeneratingAI}>
              {isGeneratingAI ? (
                <>
                  <Wand2 className="ml-2 h-4 w-4 animate-spin" />
                  جارٍ التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="ml-2 h-4 w-4" />
                  اقتراحات AI
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layout className="h-5 w-5" />
                اختر القالب
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={cn(
                      "relative rounded-lg border-2 p-3 text-right transition-all hover:border-primary",
                      selectedTemplate === t.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{t.name}</p>
                        <Badge variant="secondary" className="text-xs">
                          {t.conversionRate}% CVR
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                    {selectedTemplate === t.id && (
                      <div className="absolute top-2 left-2">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit className="h-5 w-5" />
                تفاصيل المنتج
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">الأساسيات</TabsTrigger>
                  <TabsTrigger value="media">الوسائط</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم المنتج</Label>
                    <Input
                      placeholder="مثال: حذاء رياضي نايك"
                      value={productData.name}
                      onChange={(e) =>
                        setProductData((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>الوصف</Label>
                    <Textarea
                      placeholder="اكتب وصفاً جذاباً للمنتج..."
                      rows={4}
                      value={productData.description}
                      onChange={(e) =>
                        setProductData((prev) => ({ ...prev, description: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>السعر (جنيه)</Label>
                      <Input
                        type="number"
                        placeholder="1299"
                        value={productData.price}
                        onChange={(e) =>
                          setProductData((prev) => ({ ...prev, price: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الفئة</Label>
                      <Select
                        value={productData.category}
                        onValueChange={(v) =>
                          setProductData((prev) => ({ ...prev, category: v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shoes">أحذية</SelectItem>
                          <SelectItem value="clothing">ملابس</SelectItem>
                          <SelectItem value="accessories">إكسسوارات</SelectItem>
                          <SelectItem value="electronics">إلكترونيات</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <div className="space-y-2">
                    <Label>صور المنتج</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <Image className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        اسحب الصور هنا أو انقر للتحميل
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, WEBP (حتى 5MB)
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <div className="space-y-2">
                    <Label>الكلمات المفتاحية</Label>
                    <Input
                      placeholder="أحذية رياضية, نايك, راحة, جودة..."
                      value={productData.tags}
                      onChange={(e) =>
                        setProductData((prev) => ({ ...prev, tags: e.target.value }))
                      }
                    />
                  </div>
                  <div className="rounded-lg border p-4 space-y-2 bg-muted/30">
                    <p className="text-sm font-medium">نصائح SEO:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• استخدم كلمات مفتاحية واضحة في العنوان</li>
                      <li>• اكتب وصفاً فريداً لكل منتج</li>
                      <li>• أضف نصاً بديلاً للصور (Alt text)</li>
                      <li>• استخدم عناوين H1, H2 بشكل صحيح</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  اقتراحات الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-3 space-y-2 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="mb-2">
                          {suggestion.type === "title" && "العنوان"}
                          {suggestion.type === "description" && "الوصف"}
                          {suggestion.type === "tags" && "الكلمات المفتاحية"}
                          {suggestion.type === "pricing" && "التسعير"}
                        </Badge>
                        <p className="text-sm font-medium mb-1">{suggestion.suggestion}</p>
                        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => applySuggestion(suggestion)}>
                        تطبيق
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Save className="ml-2 h-4 w-4 animate-pulse" />
                  جارٍ الحفظ...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  حفظ المنتج
                </>
              )}
            </Button>
            <Button variant="outline">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                معاينة مباشرة
              </CardTitle>
              <CardDescription>قالب: {template.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-6 min-h-[600px]">
                <div className="space-y-4">
                  {/* Mock Preview */}
                  <div className="aspect-square bg-white rounded-lg border flex items-center justify-center">
                    <Image className="h-16 w-16 text-muted-foreground" />
                  </div>
                  {productData.name && (
                    <h3 className="text-2xl font-bold">{productData.name}</h3>
                  )}
                  {productData.price && (
                    <p className="text-3xl font-bold text-primary">
                      {productData.price} جنيه
                    </p>
                  )}
                  {productData.description && (
                    <p className="text-sm text-muted-foreground">{productData.description}</p>
                  )}
                  {productData.tags && (
                    <div className="flex flex-wrap gap-2">
                      {productData.tags.split(",").map((tag, i) => (
                        <Badge key={i} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button className="w-full" size="lg">
                    أضف إلى السلة
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
