/**
 * AI Marketing Suggestions Component
 * Shows AI-powered marketing suggestions for affiliates
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Loader2, 
  TrendingUp, 
  Users, 
  Target,
  Lightbulb,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Send,
  Twitter,
  Linkedin,
  Share2
} from 'lucide-react';
import { productAIService, type ProductData, type MarketingSuggestion } from '@/lib/product-ai-service';
import { useToast } from '@/components/ui/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AIMarketingSuggestionsProps {
  product: ProductData;
}

const platformIcons: Record<string, any> = {
  'Facebook': Facebook,
  'فيسبوك': Facebook,
  'Instagram': Instagram,
  'إنستجرام': Instagram,
  'TikTok': Share2,
  'تيك توك': Share2,
  'YouTube': Youtube,
  'يوتيوب': Youtube,
  'WhatsApp': MessageCircle,
  'واتساب': MessageCircle,
  'Telegram': Send,
  'تليجرام': Send,
  'Twitter': Twitter,
  'X': Twitter,
  'تويتر': Twitter,
  'LinkedIn': Linkedin,
  'لينكد إن': Linkedin,
  'Snapchat': Share2,
  'سناب شات': Share2,
};

const platformColors: Record<string, string> = {
  'Facebook': 'bg-blue-100 text-blue-800 border-blue-200',
  'فيسبوك': 'bg-blue-100 text-blue-800 border-blue-200',
  'Instagram': 'bg-pink-100 text-pink-800 border-pink-200',
  'إنستجرام': 'bg-pink-100 text-pink-800 border-pink-200',
  'TikTok': 'bg-purple-100 text-purple-800 border-purple-200',
  'تيك توك': 'bg-purple-100 text-purple-800 border-purple-200',
  'YouTube': 'bg-red-100 text-red-800 border-red-200',
  'يوتيوب': 'bg-red-100 text-red-800 border-red-200',
  'WhatsApp': 'bg-green-100 text-green-800 border-green-200',
  'واتساب': 'bg-green-100 text-green-800 border-green-200',
  'Telegram': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'تليجرام': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Twitter': 'bg-sky-100 text-sky-800 border-sky-200',
  'X': 'bg-sky-100 text-sky-800 border-sky-200',
  'تويتر': 'bg-sky-100 text-sky-800 border-sky-200',
  'LinkedIn': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'لينكد إن': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Snapchat': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'سناب شات': 'bg-yellow-100 text-yellow-800 border-yellow-200',
};

function getPlatformIcon(platform: string) {
  for (const [key, Icon] of Object.entries(platformIcons)) {
    if (platform.includes(key)) {
      return Icon;
    }
  }
  return Share2;
}

function getPlatformColor(platform: string): string {
  for (const [key, color] of Object.entries(platformColors)) {
    if (platform.includes(key)) {
      return color;
    }
  }
  return 'bg-gray-100 text-gray-800 border-gray-200';
}

export function AIMarketingSuggestions({ product }: AIMarketingSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<MarketingSuggestion[]>([]);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setLoading(true);
    try {
      const result = await productAIService.getMarketingSuggestions(product);
      setSuggestions(result);
      toast({
        title: '✨ تم إنشاء الاقتراحات بنجاح',
        description: `تم إنشاء ${result.length} اقتراح تسويقي`,
      });
    } catch (error: any) {
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل إنشاء الاقتراحات',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Get Suggestions Button */}
      {suggestions.length === 0 && (
        <Card className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-purple-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  اقتراحات تسويقية ذكية
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  احصل على اقتراحات تسويقية مخصصة لهذا المنتج باستخدام الذكاء الاصطناعي
                </p>
              </div>
              <Button
                onClick={handleGetSuggestions}
                disabled={loading || !product.name}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الاقتراحات...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    احصل على اقتراحات تسويقية
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                اقتراحات تسويقية ({suggestions.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetSuggestions}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    تحديث
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {suggestions.map((suggestion, index) => {
                const Icon = getPlatformIcon(suggestion.platform);
                const colorClass = getPlatformColor(suggestion.platform);
                
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-right">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-right">{suggestion.platform}</h4>
                          <p className="text-xs text-muted-foreground text-right">
                            {suggestion.targetAudience}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4 pr-14">
                        {/* Strategy */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-purple-600" />
                            <h5 className="font-semibold text-sm">الاستراتيجية:</h5>
                          </div>
                          <p className="text-sm text-gray-700 pr-6">
                            {suggestion.strategy}
                          </p>
                        </div>

                        {/* Target Audience */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <h5 className="font-semibold text-sm">الجمهور المستهدف:</h5>
                          </div>
                          <p className="text-sm text-gray-700 pr-6">
                            {suggestion.targetAudience}
                          </p>
                        </div>

                        {/* Estimated Reach */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <h5 className="font-semibold text-sm">الوصول المتوقع:</h5>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {suggestion.estimatedReach}
                          </Badge>
                        </div>

                        {/* Tips */}
                        {suggestion.tips && suggestion.tips.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-yellow-600" />
                              <h5 className="font-semibold text-sm">نصائح عملية:</h5>
                            </div>
                            <ul className="space-y-2 pr-6">
                              {suggestion.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start gap-2 text-sm text-gray-700">
                                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
