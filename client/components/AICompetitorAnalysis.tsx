/**
 * AI Competitor Analysis
 * Analyze competitors and get insights
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Loader2, 
  Target,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Users,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { env } from '@/lib/env';

interface CompetitorInsight {
  category: string;
  icon: string;
  title: string;
  content: string;
  type: 'strength' | 'weakness' | 'opportunity' | 'threat';
}

interface AICompetitorAnalysisProps {
  productName: string;
  productPrice?: number;
  productCategory?: string;
}

export function AICompetitorAnalysis({ 
  productName, 
  productPrice,
  productCategory 
}: AICompetitorAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<CompetitorInsight[]>([]);
  const { toast } = useToast();

  const analyzeCompetitors = async () => {
    setLoading(true);
    try {
      const apiKey = env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = `أنت محلل منافسة خبير في السوق المصري.

المنتج:
- الاسم: ${productName}
- السعر: ${productPrice ? `${productPrice} جنيه` : 'غير محدد'}
- الفئة: ${productCategory || 'غير محدد'}

قم بتحليل SWOT (نقاط القوة، الضعف، الفرص، التهديدات) للمنتج في السوق المصري.

أرجع النتيجة بصيغة JSON array:
[
  {
    "category": "strength|weakness|opportunity|threat",
    "title": "عنوان قصير",
    "content": "شرح تفصيلي"
  }
]

قدم 3-4 نقاط لكل فئة.`;

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
              content: 'أنت محلل منافسة خبير في السوق المصري والعربي.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const parsedInsights = JSON.parse(jsonMatch[0]);
      setInsights(parsedInsights.map((insight: any) => ({
        ...insight,
        type: insight.category as 'strength' | 'weakness' | 'opportunity' | 'threat',
        icon: getIconForCategory(insight.category)
      })));

      toast({
        title: '✨ تم التحليل بنجاح',
        description: `تم تحليل ${parsedInsights.length} نقطة`,
      });
    } catch (error: any) {
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل التحليل',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'strength': return 'CheckCircle';
      case 'weakness': return 'AlertCircle';
      case 'opportunity': return 'TrendingUp';
      case 'threat': return 'Target';
      default: return 'Zap';
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'strength': return 'نقاط القوة';
      case 'weakness': return 'نقاط الضعف';
      case 'opportunity': return 'الفرص';
      case 'threat': return 'التهديدات';
      default: return type;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-green-100 text-green-800 border-green-200';
      case 'weakness': return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'threat': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CheckCircle': return CheckCircle;
      case 'AlertCircle': return AlertCircle;
      case 'TrendingUp': return TrendingUp;
      case 'Target': return Target;
      default: return Zap;
    }
  };

  const groupedInsights = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) {
      acc[insight.type] = [];
    }
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, CompetitorInsight[]>);

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" />
          تحليل المنافسة (SWOT)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {insights.length === 0 ? (
          <div className="text-center space-y-4 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-purple-100 rounded-full">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                تحليل شامل للمنافسة
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                احصل على تحليل SWOT كامل لمنتجك في السوق المصري
              </p>
            </div>
            <Button
              onClick={analyzeCompetitors}
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
                  تحليل المنافسة
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* Refresh Button */}
            <Button
              onClick={analyzeCompetitors}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  تحديث التحليل
                </>
              )}
            </Button>

            {/* Insights by Category */}
            <div className="space-y-6">
              {Object.entries(groupedInsights).map(([type, categoryInsights]) => {
                const colorClass = getCategoryColor(type);
                const label = getCategoryLabel(type);

                return (
                  <div key={type} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${colorClass} border`}>
                        {label}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({categoryInsights.length})
                      </span>
                    </div>
                    <div className="space-y-2">
                      {categoryInsights.map((insight, index) => {
                        const Icon = getIconComponent(insight.icon);
                        return (
                          <Card key={index} className={`border-2 ${colorClass.replace('bg-', 'border-').replace('text-', 'bg-').replace('800', '50')}`}>
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm mb-1">
                                    {insight.title}
                                  </h4>
                                  <p className="text-sm text-gray-700">
                                    {insight.content}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
