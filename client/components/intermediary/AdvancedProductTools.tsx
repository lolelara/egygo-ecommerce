import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Languages, 
  Image as ImageIcon, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Wand2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface AdvancedProductToolsProps {
  product: any;
  onUpdate: (updatedProduct: any) => void;
}

export default function AdvancedProductTools({ product, onUpdate }: AdvancedProductToolsProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [aiEnhanced, setAiEnhanced] = useState<string>("");
  const [translated, setTranslated] = useState<string>("");
  const [reviewResult, setReviewResult] = useState<any>(null);

  /**
   * AI Enhancement
   */
  const handleAIEnhancement = async () => {
    if (!product.description) {
      toast({
        title: "خطأ",
        description: "لا يوجد وصف لتحسينه",
        variant: "destructive"
      });
      return;
    }

    setLoading('ai');
    try {
      const response = await fetch('/api/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: product.description,
          language: 'ar'
        })
      });

      if (!response.ok) throw new Error('فشل التحسين');

      const data = await response.json();
      setAiEnhanced(data.enhanced);

      toast({
        title: "✨ تم التحسين",
        description: "تم تحسين الوصف بواسطة AI"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحسين الوصف",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * Translation
   */
  const handleTranslation = async () => {
    if (!product.description) {
      toast({
        title: "خطأ",
        description: "لا يوجد نص للترجمة",
        variant: "destructive"
      });
      return;
    }

    setLoading('translate');
    try {
      const response = await fetch('/api/translate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: product.description,
          from: 'en',
          to: 'ar'
        })
      });

      if (!response.ok) throw new Error('فشلت الترجمة');

      const data = await response.json();
      setTranslated(data.translated);

      toast({
        title: "✅ تمت الترجمة",
        description: "تم ترجمة النص للعربية"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الترجمة",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * Image Optimization
   */
  const handleImageOptimization = async () => {
    if (!product.images || product.images.length === 0) {
      toast({
        title: "خطأ",
        description: "لا توجد صور لتحسينها",
        variant: "destructive"
      });
      return;
    }

    setLoading('images');
    try {
      const response = await fetch('/api/optimize-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          images: product.images,
          quality: 80,
          maxWidth: 1200
        })
      });

      if (!response.ok) throw new Error('فشل التحسين');

      const data = await response.json();

      toast({
        title: "✅ تم التحسين",
        description: `تم تحسين ${data.images.length} صورة`
      });

      onUpdate({
        ...product,
        images: data.images.map((img: any) => img.optimized)
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحسين الصور",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * Product Review
   */
  const handleReview = async () => {
    setLoading('review');
    try {
      const response = await fetch('/api/review-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });

      if (!response.ok) throw new Error('فشلت المراجعة');

      const data = await response.json();
      setReviewResult(data);

      if (data.approved) {
        toast({
          title: "✅ جاهز للنشر",
          description: `درجة الجودة: ${data.score.toFixed(0)}%`
        });
      } else {
        toast({
          title: "⚠️ يحتاج تحسين",
          description: `درجة الجودة: ${data.score.toFixed(0)}%`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في مراجعة المنتج",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * Apply Enhancement
   */
  const applyEnhancement = () => {
    if (aiEnhanced) {
      onUpdate({
        ...product,
        description: aiEnhanced
      });
      setAiEnhanced("");
      toast({
        title: "✅ تم التطبيق",
        description: "تم تحديث الوصف"
      });
    }
  };

  /**
   * Apply Translation
   */
  const applyTranslation = () => {
    if (translated) {
      onUpdate({
        ...product,
        description: translated
      });
      setTranslated("");
      toast({
        title: "✅ تم التطبيق",
        description: "تم تحديث الترجمة"
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Enhancement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-600" />
            تحسين بالذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            استخدم AI لتحسين وصف المنتج وإضافة كلمات مفتاحية
          </p>
          
          <Button 
            onClick={handleAIEnhancement} 
            disabled={loading === 'ai'}
            className="w-full"
          >
            {loading === 'ai' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري التحسين...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                تحسين الوصف
              </>
            )}
          </Button>

          {aiEnhanced && (
            <div className="space-y-2">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">الوصف المحسّن:</p>
                <Textarea
                  value={aiEnhanced}
                  onChange={(e) => setAiEnhanced(e.target.value)}
                  rows={6}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
              <Button onClick={applyEnhancement} className="w-full">
                تطبيق التحسين
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Translation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Languages className="h-5 w-5 text-blue-600" />
            ترجمة تلقائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ترجم الوصف من الإنجليزية للعربية تلقائياً
          </p>
          
          <Button 
            onClick={handleTranslation} 
            disabled={loading === 'translate'}
            className="w-full"
          >
            {loading === 'translate' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري الترجمة...
              </>
            ) : (
              <>
                <Languages className="h-4 w-4 mr-2" />
                ترجمة للعربية
              </>
            )}
          </Button>

          {translated && (
            <div className="space-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">النص المترجم:</p>
                <Textarea
                  value={translated}
                  onChange={(e) => setTranslated(e.target.value)}
                  rows={6}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
              <Button onClick={applyTranslation} className="w-full">
                تطبيق الترجمة
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="h-5 w-5 text-green-600" />
            تحسين الصور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ضغط وتحسين صور المنتج لتحميل أسرع
          </p>
          
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">
              {product.images?.length || 0} صورة
            </Badge>
            <span className="text-muted-foreground">
              سيتم تحسينها لـ WebP
            </span>
          </div>

          <Button 
            onClick={handleImageOptimization} 
            disabled={loading === 'images'}
            className="w-full"
          >
            {loading === 'images' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري التحسين...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                تحسين الصور
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Product Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-orange-600" />
            مراجعة قبل النشر
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            تحقق من جودة المنتج قبل نشره
          </p>
          
          <Button 
            onClick={handleReview} 
            disabled={loading === 'review'}
            className="w-full"
          >
            {loading === 'review' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                جاري المراجعة...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                مراجعة المنتج
              </>
            )}
          </Button>

          {reviewResult && (
            <div className="space-y-3">
              {/* Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>درجة الجودة</span>
                  <span className="font-bold">{reviewResult.score.toFixed(0)}%</span>
                </div>
                <Progress value={reviewResult.score} />
              </div>

              {/* Status */}
              <div className={`p-3 rounded-lg ${
                reviewResult.approved 
                  ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200' 
                  : 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200'
              }`}>
                <div className="flex items-center gap-2">
                  {reviewResult.approved ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800 dark:text-green-200">
                        جاهز للنشر
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800 dark:text-orange-200">
                        يحتاج تحسين
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              {reviewResult.recommendations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">التوصيات:</p>
                  <ul className="space-y-1">
                    {reviewResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Checks */}
              <div className="space-y-2">
                <p className="text-sm font-semibold">الفحوصات:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(reviewResult.checks).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className={value ? 'text-green-700' : 'text-red-700'}>
                        {key === 'hasName' && 'الاسم'}
                        {key === 'hasDescription' && 'الوصف'}
                        {key === 'hasPrice' && 'السعر'}
                        {key === 'hasImages' && 'الصور'}
                        {key === 'hasCategory' && 'الفئة'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
