/**
 * AI Product Enhancer Component
 * Enhances product descriptions using AI
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Check, Copy, RefreshCw } from 'lucide-react';
import { productAIService, type ProductData, type EnhancedDescription } from '@/lib/product-ai-service';
import { useToast } from '@/components/ui/use-toast';

interface AIProductEnhancerProps {
  product: ProductData;
  onApply: (enhanced: EnhancedDescription) => void;
}

export function AIProductEnhancer({ product, onApply }: AIProductEnhancerProps) {
  const [loading, setLoading] = useState(false);
  const [enhanced, setEnhanced] = useState<EnhancedDescription | null>(null);
  const { toast } = useToast();

  const handleEnhance = async () => {
    setLoading(true);
    try {
      const result = await productAIService.enhanceProductDescription(product);
      setEnhanced(result);
      toast({
        title: '✨ تم تحسين الوصف بنجاح',
        description: 'يمكنك الآن مراجعة الوصف المحسّن وتطبيقه',
      });
    } catch (error: any) {
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل تحسين الوصف',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (enhanced) {
      onApply(enhanced);
      toast({
        title: '✅ تم التطبيق',
        description: 'تم تطبيق الوصف المحسّن',
      });
    }
  };

  const handleCopy = () => {
    if (enhanced) {
      navigator.clipboard.writeText(enhanced.enhanced);
      toast({
        title: '📋 تم النسخ',
        description: 'تم نسخ الوصف المحسّن',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Enhance Button */}
      <Button
        onClick={handleEnhance}
        disabled={loading || !product.name}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري التحسين بالذكاء الاصطناعي...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            تحسين الوصف بالذكاء الاصطناعي
          </>
        )}
      </Button>

      {/* Enhanced Description */}
      {enhanced && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                الوصف المحسّن
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  نسخ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEnhance}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  إعادة التوليد
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Enhanced Description */}
            <div>
              <h4 className="font-semibold mb-2 text-purple-900">📝 الوصف:</h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {enhanced.enhanced}
              </p>
            </div>

            {/* SEO Keywords */}
            {enhanced.seoKeywords.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-purple-900">🔍 كلمات SEO:</h4>
                <div className="flex flex-wrap gap-2">
                  {enhanced.seoKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {enhanced.highlights.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-purple-900">✨ النقاط البارزة:</h4>
                <ul className="space-y-1">
                  {enhanced.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Apply Button */}
            <Button
              onClick={handleApply}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Check className="mr-2 h-4 w-4" />
              تطبيق الوصف المحسّن
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
