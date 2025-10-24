/**
 * Custom Landing Page Display
 * عرض صفحات الهبوط المخصصة حسب التصميم المختار
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Star, 
  ShoppingCart, 
  CheckCircle,
  Loader2,
  AlertCircle 
} from 'lucide-react';

export default function CustomLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [landingPage, setLandingPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLandingPage();
  }, [slug]);

  const loadLandingPage = async () => {
    if (!slug) {
      setError('رابط غير صالح');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load landing page by slug
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.landing_pages,
        [
          Query.equal('slug', slug),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) {
        setError('الصفحة غير موجودة');
        setLoading(false);
        return;
      }

      const page = response.documents[0];
      setLandingPage(page);

      // Update views count
      try {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.landing_pages,
          page.$id,
          {
            views: (page.views || 0) + 1
          }
        );
      } catch (error) {
        console.error('Error updating views:', error);
      }

    } catch (error) {
      console.error('Error loading landing page:', error);
      setError('فشل في تحميل الصفحة');
    } finally {
      setLoading(false);
    }
  };

  const handleCTAClick = async () => {
    if (!landingPage) return;

    // Update clicks count
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.landing_pages,
        landingPage.$id,
        {
          clicks: (landingPage.clicks || 0) + 1
        }
      );
    } catch (error) {
      console.error('Error updating clicks:', error);
    }

    // Extract productId from productUrl and redirect with affiliate reference
    const productId = landingPage.productUrl?.split('/').pop()?.split('?')[0] || '';
    const affiliateRef = landingPage.affiliateId || '';
    
    if (productId) {
      window.location.href = `${window.location.origin}/#/product/${productId}?ref=${affiliateRef}`;
    }
  };

  // Color schemes
  const colorSchemes: Record<string, { primary: string; secondary: string; gradient: string }> = {
    blue: { 
      primary: '#3B82F6', 
      secondary: '#1E40AF',
      gradient: 'from-blue-500 to-blue-700'
    },
    green: { 
      primary: '#10B981', 
      secondary: '#059669',
      gradient: 'from-green-500 to-green-700'
    },
    purple: { 
      primary: '#8B5CF6', 
      secondary: '#7C3AED',
      gradient: 'from-purple-500 to-purple-700'
    },
    orange: { 
      primary: '#F97316', 
      secondary: '#EA580C',
      gradient: 'from-orange-500 to-orange-700'
    },
    red: { 
      primary: '#EF4444', 
      secondary: '#DC2626',
      gradient: 'from-red-500 to-red-700'
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'الصفحة غير موجودة'}
          </h1>
          <p className="text-gray-600 mb-6">
            عذراً، لم نتمكن من العثور على هذه الصفحة
          </p>
          <Button onClick={() => navigate('/')}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const colors = colorSchemes[landingPage.colorScheme] || colorSchemes.blue;
  const template = landingPage.template || 'modern';
  const features = landingPage.features || [];

  // Modern Template
  if (template === 'modern') {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        {/* Hero Section */}
        <div
          className={`p-12 md:p-20 text-white bg-gradient-to-br ${colors.gradient}`}
        >
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {landingPage.title}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              {landingPage.subtitle}
            </p>
            
            {landingPage.countdown && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block">
                <div className="flex gap-6 text-2xl font-bold">
                  <div className="text-center">
                    <div className="text-4xl">23</div>
                    <div className="text-sm opacity-75">ساعة</div>
                  </div>
                  <div className="text-3xl">:</div>
                  <div className="text-center">
                    <div className="text-4xl">45</div>
                    <div className="text-sm opacity-75">دقيقة</div>
                  </div>
                  <div className="text-3xl">:</div>
                  <div className="text-center">
                    <div className="text-4xl">12</div>
                    <div className="text-sm opacity-75">ثانية</div>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="text-2xl px-12 py-8 h-auto bg-white hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all text-primary font-bold"
            >
              {landingPage.ctaText}
            </Button>
          </div>
        </div>

        {/* Description Section */}
        <div className="container mx-auto max-w-4xl p-8 md:p-12">
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed text-center mb-12">
            {landingPage.description}
          </p>
        </div>

        {/* Features Section */}
        {features.length > 0 && (
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto max-w-4xl px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                المميزات
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature: string, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg">
                    <CheckCircle 
                      className="h-12 w-12 mx-auto mb-4" 
                      style={{ color: colors.primary }} 
                    />
                    <p className="text-lg font-semibold">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Testimonials Section */}
        {landingPage.testimonials && (
          <div className="container mx-auto max-w-4xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              آراء العملاء
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2" style={{ borderColor: colors.primary }}>
              <div className="flex gap-2 justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xl text-gray-700 mb-4 text-center">
                "منتج رائع! أنصح به بشدة. تجربة ممتازة وخدمة عملاء رائعة"
              </p>
              <p className="text-lg text-gray-500 text-center">- عميل سعيد</p>
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className={`py-16 bg-gradient-to-br ${colors.gradient} text-white text-center`}>
          <div className="container mx-auto max-w-4xl px-8">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              لا تفوت هذا العرض!
            </h2>
            <p className="text-xl md:text-2xl mb-8">
              احصل على أفضل سعر الآن
            </p>
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="text-2xl px-12 py-8 h-auto bg-white hover:bg-gray-100 shadow-2xl text-primary font-bold"
            >
              {landingPage.ctaText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Minimal Template
  if (template === 'minimal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8" dir="rtl">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div
            className="w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-2xl"
            style={{ backgroundColor: colors.primary }}
          >
            <ShoppingCart className="h-12 w-12 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            {landingPage.title}
          </h1>
          
          <p className="text-2xl text-gray-600">
            {landingPage.subtitle}
          </p>
          
          <div className="py-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              {landingPage.description}
            </p>
          </div>

          {features.length > 0 && (
            <div className="space-y-4 py-8">
              {features.map((feature: string, index: number) => (
                <div key={index} className="text-xl text-gray-700 flex items-center justify-center gap-3">
                  <CheckCircle className="h-6 w-6" style={{ color: colors.primary }} />
                  {feature}
                </div>
              ))}
            </div>
          )}
          
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="text-2xl px-12 py-8 h-auto shadow-2xl"
            style={{ backgroundColor: colors.primary }}
          >
            {landingPage.ctaText}
          </Button>
        </div>
      </div>
    );
  }

  // E-commerce Template
  if (template === 'ecommerce') {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="container mx-auto max-w-5xl p-8">
          <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Product Image */}
            <div className="aspect-square bg-gray-200 flex items-center justify-center">
              <ShoppingCart className="h-32 w-32 text-gray-400" />
            </div>
            
            {/* Product Info */}
            <div className="p-8 md:p-12 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                {landingPage.title}
              </h1>
              
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-500">(127 تقييم)</span>
              </div>
              
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-bold" style={{ color: colors.primary }}>
                  299 ج.م
                </span>
                <span className="text-2xl text-gray-400 line-through">599 ج.م</span>
                <span className="text-xl bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold">
                  -50%
                </span>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {landingPage.description}
              </p>

              {features.length > 0 && (
                <div className="space-y-3">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-lg">
                      <CheckCircle className="h-6 w-6" style={{ color: colors.primary }} />
                      {feature}
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="w-full text-2xl py-8 h-auto flex items-center justify-center gap-3"
                style={{ backgroundColor: colors.primary }}
              >
                <ShoppingCart className="h-6 w-6" />
                {landingPage.ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Video Template
  if (template === 'video') {
    return (
      <div className="min-h-screen bg-black relative" dir="rtl">
        {/* Video Background Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <div className="w-0 h-0 border-t-16 border-t-transparent border-l-24 border-l-white border-b-16 border-b-transparent mr-2"></div>
            </div>
            <p className="text-2xl opacity-75">فيديو ترويجي</p>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="container mx-auto max-w-4xl p-12 md:p-20 text-white text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {landingPage.title}
            </h1>
            <p className="text-2xl md:text-3xl opacity-90 mb-8">
              {landingPage.subtitle}
            </p>
            
            <Button
              onClick={handleCTAClick}
              size="lg"
              className="text-2xl px-12 py-8 h-auto bg-white hover:bg-gray-100 shadow-2xl text-black font-bold"
            >
              {landingPage.ctaText}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
      <div className="text-center p-12">
        <Globe className="h-24 w-24 mx-auto text-primary mb-6" />
        <h1 className="text-3xl font-bold mb-4">{landingPage.title}</h1>
        <p className="text-xl text-muted-foreground mb-8">{landingPage.description}</p>
        <Button
          onClick={handleCTAClick}
          size="lg"
          className="text-xl px-8 py-6"
        >
          {landingPage.ctaText}
        </Button>
      </div>
    </div>
  );
}
