/**
 * AI Price Analysis Component
 * Dynamic pricing suggestions using AI
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Loader2, 
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Target,
  Users
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';

interface PriceRecommendation {
  currentPrice?: number;
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  optimalPrice: number;
  reasoning: string;
  marketPosition: 'low' | 'medium' | 'high';
  expectedDemand: 'low' | 'medium' | 'high';
  competitorAverage: number;
  profitMargin: number;
}

interface AIPriceAnalysisProps {
  productName: string;
  currentPrice?: number;
  productCategory?: string;
  productCost?: number;
}

export function AIPriceAnalysis({ 
  productName,
  currentPrice,
  productCategory,
  productCost
}: AIPriceAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PriceRecommendation | null>(null);
  const { toast } = useToast();

  const analyzePricing = async () => {
    setLoading(true);
    try {
      const apiKey = env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `أنت خبير تسعير منتجات في السوق المصري.

المنتج:
- الاسم: ${productName}
- السعر الحالي: ${currentPrice ? `${currentPrice} جنيه` : 'غير محدد'}
- الفئة: ${productCategory || 'غير محدد'}
- التكلفة: ${productCost ? `${productCost} جنيه` : 'غير معروف'}

قم بتحليل السعر واقترح:
1. السعر المثالي
2. نطاق السعر (الحد الأدنى والأقصى)
3. متوسط أسعار المنافسين
4. هامش الربح المقترح
5. موقع السعر في السوق (منخفض/متوسط/مرتفع)
6. الطلب المتوقع (منخفض/متوسط/مرتفع)
7. التبرير والتوصيات

أرجع النتيجة بصيغة JSON:
{
  "suggestedPrice": رقم,
  "minPrice": رقم,
  "maxPrice": رقم,
  "optimalPrice": رقم,
  "reasoning": "نص",
  "marketPosition": "low|medium|high",
  "expectedDemand": "low|medium|high",
  "competitorAverage": رقم,
  "profitMargin": رقم (نسبة مئوية)
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'أنت خبير تسعير منتجات في السوق المصري والعربي.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const result = JSON.parse(jsonMatch[0]);
      setRecommendation({
        ...result,
        currentPrice
      });

      toast({
        title: '✨ تم التحليل بنجاح',
        description: 'تم تحليل السعر وإنشاء التوصيات',
      });
    } catch (error: any) {
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل تحليل السعر',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriceChange = () => {
    if (!recommendation || !currentPrice) return null;
    const change = ((recommendation.suggestedPrice - currentPrice) / currentPrice) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isIncrease: change > 0
    };
  };

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'low': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const priceChange = getPriceChange();

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-purple-600" />
          تحليل السعر الديناميكي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {!recommendation ? (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-100 rounded-full">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                تحليل ذكي للأسعار
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                احصل على توصيات تسعير مبنية على تحليل السوق والمنافسين
              </p>
            </div>
            <Button
              onClick={analyzePricing}
              disabled={loading || !productName}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  تحليل السعر
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Suggested Price */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">السعر المقترح</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-4xl font-bold text-purple-900">
                    {recommendation.suggestedPrice} جنيه
                  </p>
                  {priceChange && (
                    <Badge variant={priceChange.isIncrease ? 'default' : 'destructive'}>
                      {priceChange.isIncrease ? '↑' : '↓'} {priceChange.value}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">الحد الأدنى</p>
                <p className="text-lg font-bold text-red-600">
                  {recommendation.minPrice} ج
                </p>
              </div>
              <div className="p-4 border-2 border-purple-200 rounded-lg text-center bg-purple-50">
                <p className="text-xs text-muted-foreground mb-1">السعر الأمثل</p>
                <p className="text-lg font-bold text-purple-600">
                  {recommendation.optimalPrice} ج
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">الحد الأقصى</p>
                <p className="text-lg font-bold text-green-600">
                  {recommendation.maxPrice} ج
                </p>
              </div>
            </div>

            {/* Market Position & Demand */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-lg border-2 ${getMarketPositionColor(recommendation.marketPosition)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4" />
                  <p className="text-sm font-semibold">موقع السعر</p>
                </div>
                <p className="text-lg font-bold">
                  {recommendation.marketPosition === 'low' ? 'منخفض' :
                   recommendation.marketPosition === 'medium' ? 'متوسط' : 'مرتفع'}
                </p>
              </div>
              <div className={`p-4 rounded-lg border-2 ${getDemandColor(recommendation.expectedDemand)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4" />
                  <p className="text-sm font-semibold">الطلب المتوقع</p>
                </div>
                <p className="text-lg font-bold">
                  {recommendation.expectedDemand === 'low' ? 'منخفض' :
                   recommendation.expectedDemand === 'medium' ? 'متوسط' : 'مرتفع'}
                </p>
              </div>
            </div>

            {/* Competitor Average */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    متوسط أسعار المنافسين
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-900">
                  {recommendation.competitorAverage} جنيه
                </span>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    هامش الربح المقترح
                  </span>
                </div>
                <span className="text-lg font-bold text-green-900">
                  {recommendation.profitMargin}%
                </span>
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-4 bg-gray-50 border rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                التحليل والتوصيات
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {recommendation.reasoning}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={analyzePricing}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    إعادة التحليل
                  </>
                )}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                onClick={() => {
                  toast({
                    title: '✅ تم تطبيق السعر',
                    description: `السعر الجديد: ${recommendation.suggestedPrice} جنيه`,
                  });
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                تطبيق السعر المقترح
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
