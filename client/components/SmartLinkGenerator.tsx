import { useState } from "react";
import { Link2, Target, Users, TrendingUp, Copy, Check, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface SmartLinkSuggestion {
  url: string;
  type: "product" | "category" | "landing";
  reason: string;
  expectedCTR: number;
  expectedConversion: number;
}

export function SmartLinkGenerator() {
  const [productId, setProductId] = useState("");
  const [audience, setAudience] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SmartLinkSuggestion[]>([]);
  const [customParams, setCustomParams] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    // TODO: Replace with actual AI-powered API call
    const mockSuggestions: SmartLinkSuggestion[] = [
      {
        url: `https://egygo.me/l/ABC123?utm_source=${platform}&utm_campaign=smart&audience=${audience}`,
        type: "landing",
        reason: "صفحة هبوط مخصصة لجمهور ${audience} على ${platform} مع عرض خاص",
        expectedCTR: 8.5,
        expectedConversion: 3.2
      },
      {
        url: `https://egygo.me/product/${productId}?ref=affiliate&promo=special`,
        type: "product",
        reason: "رابط مباشر للمنتج مع كود خصم حصري",
        expectedCTR: 6.2,
        expectedConversion: 4.1
      },
      {
        url: `https://egygo.me/category/electronics?featured=${productId}`,
        type: "category",
        reason: "صفحة الفئة مع تسليط الضوء على المنتج المستهدف",
        expectedCTR: 7.8,
        expectedConversion: 2.9
      }
    ];

    setSuggestions(mockSuggestions);
    toast({
      title: "تم إنشاء الروابط الذكية",
      description: `تم اقتراح ${mockSuggestions.length} روابط بناءً على تحليل الجمهور`
    });
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرابط إلى الحافظة"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>مولّد الروابط الذكي</CardTitle>
          </div>
          <CardDescription>
            احصل على أفضل روابط الهبوط بناءً على جمهورك المستهدف ومنصة النشر
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product">المنتج</Label>
              <Input
                id="product"
                placeholder="أدخل ID المنتج أو اسمه"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">الجمهور المستهدف</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue placeholder="اختر الجمهور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youth">شباب (18-24)</SelectItem>
                  <SelectItem value="professionals">محترفون (25-40)</SelectItem>
                  <SelectItem value="families">عائلات</SelectItem>
                  <SelectItem value="students">طلاب</SelectItem>
                  <SelectItem value="seniors">كبار السن (+50)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">منصة النشر</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="اختر المنصة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">فيسبوك</SelectItem>
                  <SelectItem value="instagram">إنستجرام</SelectItem>
                  <SelectItem value="tiktok">تيك توك</SelectItem>
                  <SelectItem value="twitter">تويتر (X)</SelectItem>
                  <SelectItem value="whatsapp">واتساب</SelectItem>
                  <SelectItem value="email">البريد الإلكتروني</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="params">معاملات مخصصة (اختياري)</Label>
              <Input
                id="params"
                placeholder="utm_content=banner1"
                value={customParams}
                onChange={(e) => setCustomParams(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!productId || !audience || !platform}
            className="w-full"
          >
            <Sparkles className="ml-2 h-4 w-4" />
            إنشاء روابط ذكية
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">الروابط المقترحة</h3>
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {suggestion.type === "landing" && "صفحة هبوط"}
                          {suggestion.type === "product" && "صفحة منتج"}
                          {suggestion.type === "category" && "صفحة فئة"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">
                        {suggestion.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">CTR متوقع</div>
                        <div className="text-sm font-semibold">{suggestion.expectedCTR}%</div>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-xs text-muted-foreground">تحويل متوقع</div>
                        <div className="text-sm font-semibold">{suggestion.expectedConversion}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border bg-background p-2">
                    <code className="flex-1 overflow-x-auto text-xs">
                      {suggestion.url}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(suggestion.url)}
                    >
                      {copied === suggestion.url ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
