/**
 * Landing Page Preview Component
 * معاينة حية لصفحة الهبوط
 */

import { Globe, Star, ShoppingCart, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  template: string;
  colorScheme: string;
  features: string[];
  testimonials: boolean;
  countdown: boolean;
}

const colorSchemes: Record<string, { primary: string; secondary: string }> = {
  blue: { primary: '#3B82F6', secondary: '#1E40AF' },
  green: { primary: '#10B981', secondary: '#059669' },
  purple: { primary: '#8B5CF6', secondary: '#7C3AED' },
  orange: { primary: '#F97316', secondary: '#EA580C' },
  red: { primary: '#EF4444', secondary: '#DC2626' },
};

export function LandingPagePreview({
  title,
  subtitle,
  description,
  ctaText,
  template,
  colorScheme,
  features,
  testimonials,
  countdown,
}: PreviewProps) {
  const colors = colorSchemes[colorScheme] || colorSchemes.blue;

  // Modern Template
  if (template === 'modern') {
    return (
      <div className="w-full h-full bg-white rounded-lg overflow-hidden text-right" dir="rtl">
        {/* Hero Section */}
        <div
          className="p-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          }}
        >
          <h1 className="text-2xl font-bold mb-2">{title || 'عنوان الصفحة'}</h1>
          <p className="text-sm opacity-90 mb-3">{subtitle || 'نص فرعي'}</p>
          
          {countdown && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mb-3 inline-block">
              <div className="flex gap-2 text-xs">
                <div className="text-center">
                  <div className="font-bold">23</div>
                  <div className="opacity-75">ساعة</div>
                </div>
                <div>:</div>
                <div className="text-center">
                  <div className="font-bold">45</div>
                  <div className="opacity-75">دقيقة</div>
                </div>
                <div>:</div>
                <div className="text-center">
                  <div className="font-bold">12</div>
                  <div className="opacity-75">ثانية</div>
                </div>
              </div>
            </div>
          )}
          
          <button
            className="w-full bg-white text-sm py-2 px-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            style={{ color: colors.primary }}
          >
            {ctaText || 'اشترِ الآن'}
          </button>
        </div>

        {/* Description */}
        <div className="p-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            {description || 'وصف المنتج أو العرض سيظهر هنا...'}
          </p>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-semibold mb-2">المميزات:</h3>
            <div className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3" style={{ color: colors.primary }} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {testimonials && (
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-gray-600 mb-1">
                "منتج رائع! أنصح به بشدة"
              </p>
              <p className="text-xs text-gray-400">- عميل سعيد</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Minimal Template
  if (template === 'minimal') {
    return (
      <div className="w-full h-full bg-white rounded-lg overflow-hidden text-right p-6" dir="rtl">
        <div className="text-center space-y-4">
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold">{title || 'عنوان بسيط'}</h1>
          <p className="text-sm text-gray-600">{subtitle || 'نص فرعي'}</p>
          
          <div className="py-4">
            <p className="text-xs text-gray-500 leading-relaxed">
              {description || 'وصف مختصر وواضح'}
            </p>
          </div>

          {features && features.length > 0 && (
            <div className="space-y-2 py-2">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="text-xs text-gray-600">
                  ✓ {feature}
                </div>
              ))}
            </div>
          )}
          
          <button
            className="w-full text-white text-sm py-2 px-4 rounded-lg font-semibold"
            style={{ backgroundColor: colors.primary }}
          >
            {ctaText || 'ابدأ الآن'}
          </button>
        </div>
      </div>
    );
  }

  // E-commerce Template
  if (template === 'ecommerce') {
    return (
      <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden text-right" dir="rtl">
        <div className="bg-white p-4">
          <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          
          <h2 className="text-lg font-bold mb-1">{title || 'اسم المنتج'}</h2>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs text-gray-500">(127 تقييم)</span>
          </div>
          
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold" style={{ color: colors.primary }}>
              299 ج.م
            </span>
            <span className="text-sm text-gray-400 line-through">599 ج.م</span>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
              -50%
            </span>
          </div>
          
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {description || 'وصف المنتج...'}
          </p>

          {features && features.length > 0 && (
            <div className="space-y-1 mb-3">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3" style={{ color: colors.primary }} />
                  {feature}
                </div>
              ))}
            </div>
          )}
          
          <button
            className="w-full text-white text-sm py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <ShoppingCart className="h-4 w-4" />
            {ctaText || 'أضف للسلة'}
          </button>
        </div>
      </div>
    );
  }

  // Video Template
  if (template === 'video') {
    return (
      <div className="w-full h-full bg-black rounded-lg overflow-hidden text-right relative" dir="rtl">
        {/* Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent mr-1"></div>
            </div>
            <p className="text-xs opacity-75">فيديو ترويجي</p>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">{title || 'عرض فيديو'}</h1>
          <p className="text-sm opacity-90 mb-3">{subtitle || 'شاهد الفيديو'}</p>
          
          <button
            className="bg-white text-sm py-2 px-6 rounded-lg font-semibold"
            style={{ color: colors.primary }}
          >
            {ctaText || 'شاهد الآن'}
          </button>
        </div>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
      <div className="text-center p-6">
        <Globe className="h-12 w-12 mx-auto text-primary mb-3" />
        <p className="text-sm text-muted-foreground">
          معاينة الصفحة ستظهر هنا
        </p>
      </div>
    </div>
  );
}
