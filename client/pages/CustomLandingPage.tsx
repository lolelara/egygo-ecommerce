/**
 * Custom Landing Page Display
 * عرض صفحات الهبوط المخصصة حسب التصميم المختار
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { databases, appwriteConfig, ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Star, 
  ShoppingCart, 
  CheckCircle,
  Loader2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Mail,
  ChevronDown,
  Facebook,
  Instagram,
  MessageCircle as WhatsAppIcon,
  Award,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function CustomLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [landingPage, setLandingPage] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [advancedSettings, setAdvancedSettings] = useState<any>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });

  // Scroll detection for sticky CTA
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (!advancedSettings?.showTimer || !advancedSettings?.timerEndDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endDate = new Date(advancedSettings.timerEndDate).getTime();
      const distance = endDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [advancedSettings]);

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
      
      // Parse advanced settings if exists
      if (page.advancedSettings) {
        try {
          const settings = JSON.parse(page.advancedSettings);
          setAdvancedSettings(settings);
          console.log('✅ Advanced settings loaded:', settings);
        } catch (e) {
          console.error('Error parsing advanced settings:', e);
          setAdvancedSettings(null);
        }
      }

      // Load product data
      const productId = page.productUrl?.split('/').pop()?.split('?')[0] || '';
      console.log('🔍 Extracting productId from:', page.productUrl);
      console.log('📦 ProductId:', productId);
      
      if (productId) {
        try {
          const productDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.products,
            productId
          );
          setProduct(productDoc);
          console.log('✅ Product loaded:', productDoc);
          console.log('📸 Product image:', productDoc.imageUrl);
          console.log('💰 Product price:', productDoc.price);
        } catch (error: any) {
          console.error('❌ Error loading product:', error);
          console.error('Product ID that failed:', productId);
          console.error('Collection:', appwriteConfig.collections.products);
          // Don't set error, just log it - page can still work without product details
        }
      } else {
        console.warn('⚠️ No productId found in productUrl:', page.productUrl);
      }

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

    // Show order form instead of redirecting
    setShowOrderForm(true);
    
    // Scroll to form
    setTimeout(() => {
      document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingPage || !product) return;

    try {
      setSubmitting(true);

      // Calculate price (use advanced settings price if available, otherwise product price)
      const price = advancedSettings?.price 
        ? parseFloat(advancedSettings.price) 
        : product.price;

      // Create order
      const orderId = ID.unique();
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        orderId,
        {
          userId: 'guest_' + orderId,
          merchantId: product.merchantId,
          status: 'pending',
          totalAmount: price,
          shippingAddress: `${orderData.address}, ${orderData.city}`,
          customerName: orderData.name,
          customerPhone: orderData.phone,
          customerEmail: orderData.email || '',
          notes: orderData.notes || '',
          // Affiliate tracking
          affiliateId: landingPage.affiliateId,
          landingPageId: landingPage.$id,
          source: 'landing_page',
        }
      );

      // Create order item
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orderItems,
        ID.unique(),
        {
          orderId: orderId,
          productId: product.$id,
          quantity: 1,
          price: price,
        }
      );

      // Update landing page conversions
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.landing_pages,
        landingPage.$id,
        {
          conversions: (landingPage.conversions || 0) + 1
        }
      );

      // Track affiliate commission
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          'affiliate_earnings',
          ID.unique(),
          {
            affiliateId: landingPage.affiliateId,
            orderId: orderId,
            productId: product.$id,
            amount: price * 0.1, // 10% commission
            status: 'pending',
            source: 'landing_page',
          }
        );
      } catch (error) {
        console.error('Error tracking commission:', error);
      }

      toast({
        title: '✅ تم تسجيل الطلب بنجاح!',
        description: 'سيتم التواصل معك قريباً لتأكيد الطلب',
      });

      // Reset form
      setOrderData({
        name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        notes: '',
      });
      setShowOrderForm(false);

      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل في تسجيل الطلب. حاول مرة أخرى',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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

  // Apply advanced settings or defaults
  const customColor = advancedSettings?.customColor || colorSchemes[landingPage.colorScheme]?.primary || '#3B82F6';
  const colors = advancedSettings?.customColor 
    ? { primary: customColor, secondary: customColor, gradient: 'bg-gradient-to-br' }
    : colorSchemes[landingPage.colorScheme] || colorSchemes.blue;
  
  const template = landingPage.template || 'modern';
  const features = landingPage.features || [];
  
  // Advanced styling options
  const fontFamily = advancedSettings?.fontFamily || 'cairo';
  const fontSize = advancedSettings?.fontSize || 'medium';
  const buttonStyle = advancedSettings?.buttonStyle || 'rounded';
  
  const fontClasses: Record<string, string> = {
    cairo: 'font-cairo',
    tajawal: 'font-[Tajawal]',
    almarai: 'font-[Almarai]',
    'ibm-plex-arabic': 'font-[IBM_Plex_Arabic]'
  };
  
  const sizeClasses: Record<string, { text: string; heading: string; cta: string }> = {
    small: { text: 'text-base', heading: 'text-3xl md:text-4xl', cta: 'text-lg' },
    medium: { text: 'text-lg', heading: 'text-4xl md:text-5xl', cta: 'text-xl' },
    large: { text: 'text-xl', heading: 'text-5xl md:text-6xl', cta: 'text-2xl' }
  };
  
  const buttonClasses: Record<string, string> = {
    rounded: 'rounded-lg',
    square: 'rounded-none',
    pill: 'rounded-full'
  };
  
  const textSize = sizeClasses[fontSize] || sizeClasses.medium;
  const btnRounding = buttonClasses[buttonStyle] || buttonClasses.rounded;
  const fontClass = fontClasses[fontFamily] || fontClasses.cairo;

  // Modern Template
  if (template === 'modern') {
    return (
      <div className={`min-h-screen bg-white ${fontClass}`} dir="rtl">
        {/* Header */}
        {advancedSettings?.showHeader !== false && (
          <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {advancedSettings?.headerLogo ? (
                  <img src={advancedSettings.headerLogo} alt="Logo" className="h-10 w-auto" />
                ) : (
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {advancedSettings?.headerSiteName || 'EgyGo'}
                  </div>
                )}
              </div>
              {advancedSettings?.headerPhone && (
                <a 
                  href={`tel:${advancedSettings.headerPhone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="h-5 w-5" style={{ color: colors.primary }} />
                  <span className="font-semibold">{advancedSettings.headerPhone}</span>
                </a>
              )}
            </div>
          </header>
        )}

        {/* Hero Section */}
        <div
          className="p-12 md:p-20 text-white"
          style={{ background: advancedSettings?.customColor ? `linear-gradient(to bottom right, ${customColor}, ${customColor}dd)` : undefined }}
        >
          {/* Product/Custom Image */}
          {(advancedSettings?.imageUrl || (product?.images && product.images.length > 0)) && (
            <div className="container mx-auto max-w-4xl mb-8">
              <img 
                src={advancedSettings?.imageUrl || product?.images?.[0]} 
                alt={product?.name || landingPage.title} 
                className="w-full max-w-2xl mx-auto rounded-2xl shadow-2xl" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          {/* Custom Video */}
          {advancedSettings?.videoUrl && (
            <div className="container mx-auto max-w-4xl mb-8">
              <iframe 
                src={advancedSettings.videoUrl.includes('youtube.com') ? advancedSettings.videoUrl.replace('watch?v=', 'embed/') : advancedSettings.videoUrl} 
                className="w-full aspect-video rounded-2xl shadow-2xl"
                allowFullScreen
                title="Video"
              />
            </div>
          )}
          
          <div className="container mx-auto max-w-4xl text-center">
            {/* Badge */}
            {advancedSettings?.badge && (
              <div className="mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-lg font-bold inline-block animate-pulse">
                  {advancedSettings.badge}
                </span>
              </div>
            )}
            
            <h1 className={`${textSize.heading} font-bold mb-4`}>
              {landingPage.title}
            </h1>
            <p className={`${textSize.text} opacity-90 mb-4`}>
              {landingPage.subtitle}
            </p>
            
            {/* Social Proof */}
            {advancedSettings?.socialProof && (
              <p className="text-lg opacity-90 mb-8 flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                {advancedSettings.socialProof}
              </p>
            )}
            
            {/* Price Display */}
            {((advancedSettings?.showPrice && advancedSettings?.price) || product?.price) && (
              <div className="mb-8 bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span className="text-5xl font-bold">
                    {advancedSettings?.price || product?.price} ج.م
                  </span>
                  {advancedSettings?.originalPrice && (
                    <>
                      <span className="text-2xl line-through opacity-60">{advancedSettings.originalPrice} ج.م</span>
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                        -{Math.round(((advancedSettings.originalPrice - (advancedSettings?.price || product?.price || 0)) / advancedSettings.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                {product && (
                  <div className="mt-4 text-sm opacity-90">
                    <p>{product.name}</p>
                  </div>
                )}
              </div>
            )}
            
            {(landingPage.countdown || advancedSettings?.showTimer) && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 inline-block animate-pulse-slow">
                <p className="text-xl mb-4 text-center font-semibold">⏰ العرض ينتهي خلال:</p>
                <div className="flex gap-4 justify-center">
                  {countdown.days > 0 && (
                    <>
                      <div className="text-center bg-white/30 rounded-xl p-3 min-w-[80px]">
                        <div className="text-4xl md:text-5xl font-bold">{String(countdown.days).padStart(2, '0')}</div>
                        <div className="text-sm opacity-75 mt-1">يوم</div>
                      </div>
                      <div className="text-3xl self-center">:</div>
                    </>
                  )}
                  <div className="text-center bg-white/30 rounded-xl p-3 min-w-[80px]">
                    <div className="text-4xl md:text-5xl font-bold">{String(countdown.hours).padStart(2, '0')}</div>
                    <div className="text-sm opacity-75 mt-1">ساعة</div>
                  </div>
                  <div className="text-3xl self-center">:</div>
                  <div className="text-center bg-white/30 rounded-xl p-3 min-w-[80px]">
                    <div className="text-4xl md:text-5xl font-bold">{String(countdown.minutes).padStart(2, '0')}</div>
                    <div className="text-sm opacity-75 mt-1">دقيقة</div>
                  </div>
                  <div className="text-3xl self-center">:</div>
                  <div className="text-center bg-white/30 rounded-xl p-3 min-w-[80px]">
                    <div className="text-4xl md:text-5xl font-bold">{String(countdown.seconds).padStart(2, '0')}</div>
                    <div className="text-sm opacity-75 mt-1">ثانية</div>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleCTAClick}
              size="lg"
              className={`${textSize.cta} px-12 py-8 h-auto bg-white hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all font-bold ${btnRounding}`}
              style={{ color: customColor }}
            >
              {landingPage.ctaText}
            </Button>
          </div>
        </div>

        {/* Video Section */}
        {advancedSettings?.showVideo && advancedSettings?.videoUrl && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
            <div className="container mx-auto max-w-4xl px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: colors.primary }}>
                {advancedSettings.videoTitle || 'شاهد المنتج'}
              </h2>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={advancedSettings.videoUrl.replace('watch?v=', 'embed/')}
                  title="Product Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery */}
        {advancedSettings?.showGallery && advancedSettings?.galleryImages?.length > 0 && (
          <div className="py-16 bg-white">
            <div className="container mx-auto max-w-6xl px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: colors.primary }}>
                معرض الصور
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {advancedSettings.galleryImages.map((img: string, index: number) => (
                  <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
                    <img
                      src={img}
                      alt={`صورة ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="container mx-auto max-w-4xl p-8 md:p-12">
          {product && (
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-4" style={{ color: colors.primary }}>
                {product.name}
              </h2>
              {product.description && (
                <p className="text-lg text-gray-600 text-center">
                  {product.description}
                </p>
              )}
            </div>
          )}
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
                {[...Array(advancedSettings?.testimonialRating || 5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xl text-gray-700 mb-4 text-center">
                "{advancedSettings?.testimonialText || 'منتج رائع! أنصح به بشدة. تجربة ممتازة وخدمة عملاء رائعة'}"
              </p>
              <p className="text-lg text-gray-500 text-center">- {advancedSettings?.testimonialAuthor || 'عميل سعيد'}</p>
            </div>
          </div>
        )}

        {/* Guarantee Section */}
        {advancedSettings?.showGuarantee && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
            <div className="container mx-auto max-w-4xl px-8 text-center">
              <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-lg">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-800">
                {advancedSettings.guaranteeText}
              </h3>
              <p className="text-lg text-gray-600">
                إذا لم تكن راضياً عن المنتج، سنسترجع أموالك بالكامل
              </p>
            </div>
          </div>
        )}

        {/* Why Us Section */}
        {advancedSettings?.showWhyUs && advancedSettings.whyUsItems?.length > 0 && (
          <div className="py-16 bg-white">
            <div className="container mx-auto max-w-6xl px-8">
              <h2 className="text-4xl font-bold text-center mb-12" style={{ color: colors.primary }}>
                {advancedSettings.whyUsTitle || 'لماذا تختارنا؟'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {advancedSettings.whyUsItems.map((item: any, index: number) => (
                  <div key={index} className="text-center p-6 rounded-2xl hover:shadow-xl transition-shadow">
                    <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: `${colors.primary}15` }}>
                      {item.icon === 'shield' && <Shield className="h-12 w-12" style={{ color: colors.primary }} />}
                      {item.icon === 'zap' && <Zap className="h-12 w-12" style={{ color: colors.primary }} />}
                      {item.icon === 'award' && <Award className="h-12 w-12" style={{ color: colors.primary }} />}
                      {item.icon === 'trending' && <TrendingUp className="h-12 w-12" style={{ color: colors.primary }} />}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {advancedSettings?.showStats && advancedSettings.statsItems?.length > 0 && (
          <div className="py-12" style={{ background: `linear-gradient(to bottom right, ${colors.primary}15, ${colors.primary}05)` }}>
            <div className="container mx-auto max-w-6xl px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {advancedSettings.statsItems.map((stat: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-5xl font-bold mb-2" style={{ color: colors.primary }}>
                      {stat.number}
                    </div>
                    <div className="text-gray-600 text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {advancedSettings?.showFAQ && advancedSettings.faqItems?.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="container mx-auto max-w-3xl px-8">
              <h2 className="text-4xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
              <div className="space-y-4">
                {advancedSettings.faqItems.map((faq: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-6 py-4 text-right flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-lg">{faq.question}</span>
                      <ChevronDown 
                        className={`h-5 w-5 transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                        style={{ color: colors.primary }}
                      />
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 py-4 border-t bg-gray-50">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Order Form */}
        {showOrderForm && (
          <div id="order-form" className="bg-white py-16 border-t-4" style={{ borderTopColor: colors.primary }}>
            <div className="container mx-auto max-w-2xl px-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border" style={{ borderColor: colors.primary }}>
                <h2 className="text-3xl font-bold text-center mb-2" style={{ color: colors.primary }}>
                  تسجيل الطلب
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  املأ البيانات التالية وسنتواصل معك فوراً
                </p>
                
                {product && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{product.name}</p>
                        <p className="text-gray-600">{product.description?.substring(0, 50)}...</p>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                          {advancedSettings?.price || product.price} ج.م
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name"
                      value={orderData.name}
                      onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                      required
                      placeholder="أدخل اسمك الكامل"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                      required
                      placeholder="01XXXXXXXXX"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني (اختياري)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={orderData.email}
                      onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                      placeholder="example@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      العنوان *
                    </Label>
                    <Input
                      id="address"
                      value={orderData.address}
                      onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                      required
                      placeholder="الشارع، رقم المبنى، الحي"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Input
                      id="city"
                      value={orderData.city}
                      onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                      required
                      placeholder="القاهرة، الإسكندرية، إلخ..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes"
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                      placeholder="أي تفاصيل إضافية..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-6 text-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin ml-2" />
                          جاري التسجيل...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 ml-2" />
                          تأكيد الطلب
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOrderForm(false)}
                      disabled={submitting}
                      className="px-6"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Final CTA */}
        {!showOrderForm && (
          <div 
            className={`py-16 text-white text-center ${advancedSettings?.customColor ? '' : `bg-gradient-to-br ${colors.gradient}`}`}
            style={advancedSettings?.customColor ? { 
              background: `linear-gradient(to bottom right, ${customColor}, ${customColor}cc)` 
            } : undefined}
          >
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
                className={`${textSize.cta} px-12 py-8 h-auto bg-white hover:bg-gray-100 shadow-2xl font-bold ${btnRounding}`}
                style={{ color: customColor }}
              >
                {landingPage.ctaText}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        {advancedSettings?.showFooter !== false && (
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto max-w-6xl px-8">
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    {advancedSettings?.footerCompany || 'EgyGo'}
                  </h3>
                  {advancedSettings?.footerAddress && (
                    <p className="text-gray-400 mb-2 flex items-start gap-2">
                      <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                      {advancedSettings.footerAddress}
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
                  {advancedSettings?.footerPhone && (
                    <a href={`tel:${advancedSettings.footerPhone}`} className="text-gray-400 hover:text-white mb-2 flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {advancedSettings.footerPhone}
                    </a>
                  )}
                  {advancedSettings?.footerEmail && (
                    <a href={`mailto:${advancedSettings.footerEmail}`} className="text-gray-400 hover:text-white mb-2 flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      {advancedSettings.footerEmail}
                    </a>
                  )}
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">تابعنا</h4>
                  <div className="flex gap-4">
                    {advancedSettings?.footerFacebook && (
                      <a 
                        href={advancedSettings.footerFacebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {advancedSettings?.footerInstagram && (
                      <a 
                        href={advancedSettings.footerInstagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {advancedSettings?.footerWhatsapp && (
                      <a 
                        href={`https://wa.me/${advancedSettings.footerWhatsapp}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                <p>© {new Date().getFullYear()} {advancedSettings?.footerCompany || 'EgyGo'}. جميع الحقوق محفوظة.</p>
              </div>
            </div>
          </footer>
        )}

        {/* Sticky Bottom CTA */}
        {!showOrderForm && showStickyCTA && (
          <div 
            className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl border-t-4 animate-slide-up"
            style={{ borderTopColor: colors.primary }}
          >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
              <div className="flex-1">
                {product && (
                  <div className="flex items-center gap-3">
                    {product.images?.[0] && (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-lg font-bold" style={{ color: colors.primary }}>
                        {advancedSettings?.price || product.price} ج.م
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleCTAClick}
                size="lg"
                className="px-8 py-6 text-lg font-bold shadow-lg hover:scale-105 transition-transform"
                style={{ backgroundColor: colors.primary }}
              >
                {landingPage.ctaText}
              </Button>
            </div>
          </div>
        )}
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
                  {advancedSettings?.price || product?.price || '299'} ج.م
                </span>
                {advancedSettings?.originalPrice && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">{advancedSettings.originalPrice} ج.م</span>
                    <span className="text-xl bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold">
                      -{Math.round(((advancedSettings.originalPrice - (advancedSettings?.price || product?.price || 0)) / advancedSettings.originalPrice) * 100)}%
                    </span>
                  </>
                )}
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
          
          {/* Order Form */}
          {showOrderForm && (
            <div id="order-form" className="p-8">
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border-2" style={{ borderColor: colors.primary }}>
                <h2 className="text-3xl font-bold text-center mb-2" style={{ color: colors.primary }}>
                  تسجيل الطلب
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  املأ البيانات التالية وسنتواصل معك فوراً
                </p>

                {product && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-lg">{product.name}</p>
                        <p className="text-gray-600">{product.description?.substring(0, 50)}...</p>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                          {advancedSettings?.price || product.price} ج.م
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name2" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      الاسم الكامل *
                    </Label>
                    <Input
                      id="name2"
                      value={orderData.name}
                      onChange={(e) => setOrderData({ ...orderData, name: e.target.value })}
                      required
                      placeholder="أدخل اسمك الكامل"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone2" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      رقم الهاتف *
                    </Label>
                    <Input
                      id="phone2"
                      type="tel"
                      value={orderData.phone}
                      onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                      required
                      placeholder="01XXXXXXXXX"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email2" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      البريد الإلكتروني (اختياري)
                    </Label>
                    <Input
                      id="email2"
                      type="email"
                      value={orderData.email}
                      onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                      placeholder="example@email.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address2" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      العنوان *
                    </Label>
                    <Input
                      id="address2"
                      value={orderData.address}
                      onChange={(e) => setOrderData({ ...orderData, address: e.target.value })}
                      required
                      placeholder="الشارع، رقم المبنى، الحي"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city2">المدينة *</Label>
                    <Input
                      id="city2"
                      value={orderData.city}
                      onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                      required
                      placeholder="القاهرة، الإسكندرية، إلخ..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes2">ملاحظات إضافية (اختياري)</Label>
                    <Textarea
                      id="notes2"
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                      placeholder="أي تفاصيل إضافية..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-6 text-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin ml-2" />
                          جاري التسجيل...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 ml-2" />
                          تأكيد الطلب
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOrderForm(false)}
                      disabled={submitting}
                      className="px-6"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
