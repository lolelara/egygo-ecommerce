/**
 * AI Smart Recommendations Component
 * ML-powered product recommendations
 */

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Heart, Eye } from 'lucide-react';
import { ProductCardPremium } from '@/components/ProductCardPremium';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  $id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  soldCount?: number;
}

interface SmartRecommendationsProps {
  userId?: string;
  currentProductId?: string;
  onProductClick: (productId: string) => void;
  className?: string;
}

export function SmartRecommendations({
  userId,
  currentProductId,
  onProductClick,
  className,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{
    personalized: Product[];
    similar: Product[];
    trending: Product[];
    frequentlyBought: Product[];
  }>({
    personalized: [],
    similar: [],
    trending: [],
    frequentlyBought: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId, currentProductId]);

  const loadRecommendations = async () => {
    setLoading(true);

    // Simulate AI recommendations (replace with actual API call)
    setTimeout(() => {
      setRecommendations({
        personalized: generateMockProducts(4, 'personalized'),
        similar: generateMockProducts(4, 'similar'),
        trending: generateMockProducts(4, 'trending'),
        frequentlyBought: generateMockProducts(4, 'frequently'),
      });
      setLoading(false);
    }, 1000);
  };

  const generateMockProducts = (count: number, type: string): Product[] => {
    return Array.from({ length: count }, (_, i) => ({
      $id: `${type}-${i}`,
      name: `منتج ${type} ${i + 1}`,
      price: Math.random() * 1000 + 100,
      image: '/placeholder.png',
      rating: Math.random() * 2 + 3,
      soldCount: Math.floor(Math.random() * 1000),
    }));
  };

  const renderProductCard = (product: Product, badge?: string) => {
    // Map local product to ProductCardPremium expected format
    const mappedProduct = {
      id: product.$id,
      name: product.name,
      nameAr: product.name, // Fallback
      price: product.price,
      images: [product.image],
      image: product.image, // Required by type
      rating: product.rating || 0,
      reviews: 0,
      inStock: true,
      isNew: badge === 'جديد',
      description: '',
      category: { name: 'عام', slug: 'general' }
    };

    return (
      <div key={product.$id} onClick={() => onProductClick(product.$id)}>
        <ProductCardPremium
          product={mappedProduct}
          hideActions={true} // Optional: hide add to cart etc if just for recommendation
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Sparkles className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">جاري تحليل تفضيلاتك...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">توصيات ذكية لك</h2>
      </div>

      <Tabs defaultValue="personalized" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personalized" className="text-xs sm:text-sm">
            <Heart className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">لك</span>
          </TabsTrigger>
          <TabsTrigger value="similar" className="text-xs sm:text-sm">
            <Eye className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">مشابه</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="text-xs sm:text-sm">
            <TrendingUp className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">رائج</span>
          </TabsTrigger>
          <TabsTrigger value="frequently" className="text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 sm:ml-2" />
            <span className="hidden sm:inline">معاً</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personalized" className="mt-4">
          <div className="mb-3 text-sm text-muted-foreground">
            بناءً على تفضيلاتك وعمليات الشراء السابقة
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.personalized.map(product =>
              renderProductCard(product, 'مخصص لك')
            )}
          </div>
        </TabsContent>

        <TabsContent value="similar" className="mt-4">
          <div className="mb-3 text-sm text-muted-foreground">
            منتجات مشابهة للمنتج الحالي
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.similar.map(product =>
              renderProductCard(product, 'مشابه')
            )}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-4">
          <div className="mb-3 text-sm text-muted-foreground">
            الأكثر طلباً هذا الأسبوع
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.trending.map(product =>
              renderProductCard(product, '🔥 رائج')
            )}
          </div>
        </TabsContent>

        <TabsContent value="frequently" className="mt-4">
          <div className="mb-3 text-sm text-muted-foreground">
            العملاء اشتروا معاً
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendations.frequentlyBought.map(product =>
              renderProductCard(product, 'مع بعض')
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Info Banner */}
      <div className="mt-6 p-4 bg-primary/10 rounded-lg flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium mb-1">كيف نختار لك؟</p>
          <p className="text-muted-foreground text-xs">
            نستخدم الذكاء الاصطناعي لتحليل سلوك الشراء، التفضيلات، والتقييمات لنقدم لك أفضل التوصيات المناسبة لك.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SmartRecommendations;
