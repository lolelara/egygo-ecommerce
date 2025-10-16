/**
 * Product AI Demo Page
 * Demonstrates AI-powered product enhancement features
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AIProductEnhancer } from '@/components/AIProductEnhancer';
import { AIMarketingSuggestions } from '@/components/AIMarketingSuggestions';
import { AIProductChat } from '@/components/AIProductChat';
import { AIImageGenerator } from '@/components/AIImageGenerator';
import { AICompetitorAnalysis } from '@/components/AICompetitorAnalysis';
import { Sparkles, Package, TrendingUp, MessageCircle, Image, Target } from 'lucide-react';
import type { ProductData, EnhancedDescription } from '@/lib/product-ai-service';

export default function ProductAIDemo() {
  const [product, setProduct] = useState<ProductData>({
    name: '',
    description: '',
    category: '',
    price: 0,
  });

  const handleApplyEnhancement = (enhanced: EnhancedDescription) => {
    setProduct(prev => ({
      ...prev,
      description: enhanced.enhanced
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            تحسين المنتجات بالذكاء الاصطناعي
          </h1>
        </div>
        <p className="text-muted-foreground">
          استخدم الذكاء الاصطناعي لتحسين أوصاف المنتجات والحصول على اقتراحات تسويقية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Product Input */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                معلومات المنتج
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">اسم المنتج *</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: ساعة ذكية رياضية"
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف الحالي</Label>
                <Textarea
                  id="description"
                  value={product.description}
                  onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="اكتب وصفاً مختصراً للمنتج..."
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة</Label>
                  <Input
                    id="category"
                    value={product.category}
                    onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="مثال: إلكترونيات"
                  />
                </div>

                <div>
                  <Label htmlFor="price">السعر (جنيه)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={product.price || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Enhancement */}
          <AIProductEnhancer
            product={product}
            onApply={handleApplyEnhancement}
          />
        </div>

        {/* Right Column - AI Features Tabs */}
        <div className="space-y-6">
          <Tabs defaultValue="marketing" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="marketing" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                تسويق
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                محادثة
              </TabsTrigger>
              <TabsTrigger value="images" className="text-xs">
                <Image className="h-3 w-3 mr-1" />
                صور
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                تحليل
              </TabsTrigger>
            </TabsList>

            <TabsContent value="marketing" className="space-y-4">
              <AIMarketingSuggestions product={product} />
            </TabsContent>

            <TabsContent value="chat" className="space-y-4">
              <AIProductChat
                productName={product.name}
                productDescription={product.description}
                productPrice={product.price}
                productCategory={product.category}
              />
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <AIImageGenerator
                productName={product.name}
                productDescription={product.description}
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <AICompetitorAnalysis
                productName={product.name}
                productPrice={product.price}
                productCategory={product.category}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">📚 كيفية الاستخدام</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>1. تحسين الوصف:</strong>
            <p>أدخل اسم المنتج ووصف مختصر، ثم اضغط "تحسين الوصف بالذكاء الاصطناعي" للحصول على وصف محسّن وكلمات SEO</p>
          </div>
          <div>
            <strong>2. الاقتراحات التسويقية:</strong>
            <p>اضغط "احصل على اقتراحات تسويقية" للحصول على استراتيجيات تسويق مخصصة لكل منصة</p>
          </div>
          <div>
            <strong>3. التطبيق:</strong>
            <p>راجع النتائج واضغط "تطبيق" لاستخدام الوصف المحسّن في منتجك</p>
          </div>
          <div className="pt-2 border-t border-blue-200">
            <strong>💡 نصيحة:</strong> كلما كانت معلومات المنتج أكثر تفصيلاً، كانت النتائج أفضل!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
