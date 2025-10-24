/**
 * Affiliate Landing Pages Generator
 * أداة توليد صفحات الهبوط للمسوقين
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Globe,
  Eye,
  Copy,
  Download,
  Sparkles,
  Palette,
  Layout,
  Zap,
  Type,
  Image,
  DollarSign,
  Users,
  CheckCircle2,
  ExternalLink,
  Code,
  Image as ImageIcon,
  Edit,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { databases, appwriteConfig, ID } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { LandingPagePreview } from '@/components/affiliate/LandingPagePreview';

const templates = [
  {
    id: 'modern',
    name: 'عصري',
    description: 'تصميم عصري وجذاب',
    preview: '/templates/modern.jpg',
    features: ['Hero Section', 'Features Grid', 'Testimonials', 'CTA'],
  },
  {
    id: 'minimal',
    name: 'بسيط',
    description: 'تصميم بسيط وواضح',
    preview: '/templates/minimal.jpg',
    features: ['Clean Design', 'Fast Loading', 'Mobile First'],
  },
  {
    id: 'ecommerce',
    name: 'متجر إلكتروني',
    description: 'مثالي للمنتجات',
    preview: '/templates/ecommerce.jpg',
    features: ['Product Showcase', 'Pricing Table', 'Reviews'],
  },
  {
    id: 'video',
    name: 'فيديو',
    description: 'مع فيديو ترويجي',
    preview: '/templates/video.jpg',
    features: ['Video Background', 'Auto-play', 'Full Screen'],
  },
];

const colorSchemes = [
  { id: 'blue', name: 'أزرق', primary: '#3B82F6', secondary: '#1E40AF' },
  { id: 'green', name: 'أخضر', primary: '#10B981', secondary: '#059669' },
  { id: 'purple', name: 'بنفسجي', primary: '#8B5CF6', secondary: '#7C3AED' },
  { id: 'orange', name: 'برتقالي', primary: '#F97316', secondary: '#EA580C' },
  { id: 'red', name: 'أحمر', primary: '#EF4444', secondary: '#DC2626' },
];

export default function AffiliateLandingPages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [formData, setFormData] = useState({
    title: 'عرض حصري - خصم 50%',
    subtitle: 'لفترة محدودة فقط',
    description: 'احصل على أفضل المنتجات بأقل الأسعار',
    ctaText: 'اشترِ الآن',
    productUrl: '',
    features: ['شحن مجاني', 'ضمان سنة', 'دعم 24/7'],
    testimonials: true,
    countdown: false,
    customDomain: false,
  });
  
  // Advanced customization options
  const [advancedSettings, setAdvancedSettings] = useState({
    customColor: '#3B82F6',
    fontSize: 'medium', // small, medium, large
    fontFamily: 'cairo', // cairo, tajawal, almarai
    buttonStyle: 'rounded', // rounded, square, pill
    imageUrl: '',
    videoUrl: '',
    showPrice: false,
    price: '',
    originalPrice: '',
    badge: '',
    socialProof: '',
  });

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  // Load products for selection
  useEffect(() => {
    loadProducts();
    loadLandingPages();
  }, [user]);

  const loadProducts = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        [
          Query.equal('isActive', true),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      // Filter approved products on client side (in case isApproved attribute doesn't exist)
      const approvedProducts = response.documents.filter((doc: any) => doc.isApproved !== false);
      setProducts(approvedProducts);
      
      console.log('Loaded products:', approvedProducts.length);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: '⚠️ تحذير',
        description: 'لم نتمكن من تحميل المنتجات. حاول مرة أخرى',
        variant: 'default',
      });
    }
  };

  const loadLandingPages = async () => {
    if (!user?.$id) return;
    
    try {
      setIsLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'landing_pages',
        [Query.equal('affiliateId', user.$id), Query.orderDesc('$createdAt')]
      );
      setLandingPages(response.documents);
    } catch (error) {
      console.error('Error loading landing pages:', error);
      // Collection might not exist yet
      setLandingPages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!user?.$id) {
      toast({
        title: '❌ خطأ',
        description: 'يجب تسجيل الدخول أولاً',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.productUrl) {
      toast({
        title: '❌ خطأ',
        description: 'يرجى إدخال رابط المنتج',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Extract product ID from URL
      const productId = formData.productUrl.split('/').pop()?.split('?')[0] || '';
      
      // Create unique slug with timestamp to avoid duplicates
      const baseSlug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now()}`;
      
      // Generate landing page link (not direct product link)
      const affiliateLink = `https://egygo.me/#/landing/${uniqueSlug}`;
      const pageId = ID.unique();
      
      // Save to database with advanced settings
      const landingPage = await databases.createDocument(
        appwriteConfig.databaseId,
        'landing_pages',
        pageId,
        {
          affiliateId: user.$id,
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          ctaText: formData.ctaText,
          productUrl: formData.productUrl,
          affiliateLink: affiliateLink,
          template: selectedTemplate,
          colorScheme: selectedColor,
          features: formData.features,
          testimonials: formData.testimonials,
          countdown: formData.countdown,
          slug: uniqueSlug,
          views: 0,
          clicks: 0,
          conversions: 0,
          isActive: true,
          // Advanced settings as JSON string
          advancedSettings: JSON.stringify(advancedSettings),
        }
      );
      
      // Set the new generated URL
      setGeneratedUrl(affiliateLink);
      
      // Reset form for next link
      setFormData({
        title: 'عرض حصري - خصم 50%',
        subtitle: 'لفترة محدودة فقط',
        description: 'احصل على أفضل المنتجات بأقل الأسعار',
        ctaText: 'اشترِ الآن',
        productUrl: '',
        features: ['شحن مجاني', 'ضمان سنة', 'دعم 24/7'],
        testimonials: true,
        countdown: false,
        customDomain: false,
      });
      
      // Reload landing pages
      await loadLandingPages();
      
      toast({
        title: '✅ تم إنشاء الصفحة!',
        description: 'الرابط التسويقي جاهز للاستخدام. يمكنك إنشاء رابط جديد الآن',
      });
    } catch (error: any) {
      console.error('Error creating landing page:', error);
      
      // Fallback: generate link without saving
      const productId = formData.productUrl.split('/').pop()?.split('?')[0] || '';
      const affiliateLink = `https://egygo.me/#/product/${productId}?ref=${user.affiliateCode || user.$id}`;
      setGeneratedUrl(affiliateLink);
      
      toast({
        title: '⚠️ تم إنشاء الرابط',
        description: 'الرابط جاهز لكن لم يتم حفظه في قاعدة البيانات',
        variant: 'default',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    toast({
      title: 'تم النسخ!',
      description: 'تم نسخ رابط الصفحة',
    });
  };

  const loadSavedPage = (page: any) => {
    // Load saved page data into form
    setFormData({
      title: page.title || 'عرض حصري - خصم 50%',
      subtitle: page.subtitle || 'لفترة محدودة فقط',
      description: page.description || 'احصل على أفضل المنتجات بأقل الأسعار',
      ctaText: page.ctaText || 'اشترِ الآن',
      productUrl: page.productUrl || '',
      features: page.features || ['شحن مجاني', 'ضمان سنة', 'دعم 24/7'],
      testimonials: page.testimonials !== undefined ? page.testimonials : true,
      countdown: page.countdown !== undefined ? page.countdown : false,
      customDomain: page.customDomain !== undefined ? page.customDomain : false,
    });
    
    setSelectedTemplate(page.template || 'modern');
    setSelectedColor(page.colorScheme || 'blue');
    setGeneratedUrl(page.affiliateLink || '');
    
    toast({
      title: '✅ تم التحميل!',
      description: 'تم تحميل بيانات الصفحة المحفوظة',
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            مولد صفحات الهبوط
          </h1>
          <p className="text-muted-foreground mt-1">
            أنشئ صفحات هبوط احترافية في دقائق
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">المحتوى</TabsTrigger>
              <TabsTrigger value="design">التصميم</TabsTrigger>
              <TabsTrigger value="advanced">متقدم</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    محتوى الصفحة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>العنوان الرئيسي</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="عنوان جذاب للصفحة"
                    />
                  </div>

                  <div>
                    <Label>العنوان الفرعي</Label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="نص توضيحي قصير"
                    />
                  </div>

                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="وصف تفصيلي للعرض"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label>نص الزر</Label>
                    <Input
                      value={formData.ctaText}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      placeholder="اشترِ الآن"
                    />
                  </div>

                  <div>
                    <Label>اختر المنتج</Label>
                    <Select
                      value={formData.productUrl}
                      onValueChange={(value) => setFormData({ ...formData, productUrl: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر منتج للترويج له" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            لا توجد منتجات متاحة
                          </div>
                        ) : (
                          products.map((product: any) => (
                            <SelectItem key={product.$id} value={`https://egygo.me/#/product/${product.$id}`}>
                              {product.name} - {product.price} ج.م
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      أو أدخل رابط المنتج يدوياً
                    </p>
                    <Input
                      value={formData.productUrl}
                      onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
                      placeholder="https://egygo.me/product/..."
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Design Tab */}
            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    القالب والألوان
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Template Selection */}
                  <div>
                    <Label className="mb-3 block">اختر القالب</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            toast({
                              title: `✅ تم اختيار قالب ${template.name}`,
                              description: 'شاهد التغيير في المعاينة على اليمين',
                            });
                          }}
                          className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                            selectedTemplate === template.id
                              ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center relative overflow-hidden">
                            {selectedTemplate === template.id && (
                              <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                            )}
                            <Layout className="h-8 w-8 text-muted-foreground relative z-10" />
                          </div>
                          <h4 className="font-semibold flex items-center gap-2">
                            {template.name}
                            {selectedTemplate === template.id && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Color Scheme */}
                  <div>
                    <Label className="mb-3 block">نظام الألوان</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {colorSchemes.map((scheme) => (
                        <button
                          key={scheme.id}
                          onClick={() => {
                            setSelectedColor(scheme.id);
                            toast({
                              title: `🎨 تم اختيار لون ${scheme.name}`,
                              description: 'شاهد التغيير في المعاينة',
                            });
                          }}
                          className={`relative h-12 rounded-lg transition-all hover:scale-105 ${
                            selectedColor === scheme.id ? 'ring-4 ring-primary ring-offset-2 scale-105' : 'hover:ring-2 hover:ring-gray-300'
                          }`}
                          style={{ backgroundColor: scheme.primary }}
                          title={scheme.name}
                        >
                          {selectedColor === scheme.id && (
                            <CheckCircle2 className="absolute inset-0 m-auto h-6 w-6 text-white drop-shadow-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-4">
              {/* Typography & Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    الخطوط والنصوص
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>نوع الخط</Label>
                    <Select
                      value={advancedSettings.fontFamily}
                      onValueChange={(value) =>
                        setAdvancedSettings({ ...advancedSettings, fontFamily: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cairo">Cairo - القاهرة (افتراضي)</SelectItem>
                        <SelectItem value="tajawal">Tajawal - تجوال (عصري)</SelectItem>
                        <SelectItem value="almarai">Almarai - المرعي (واضح)</SelectItem>
                        <SelectItem value="ibm-plex-arabic">IBM Plex Arabic (احترافي)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>حجم النص</Label>
                    <Select
                      value={advancedSettings.fontSize}
                      onValueChange={(value) =>
                        setAdvancedSettings({ ...advancedSettings, fontSize: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">صغير - للنصوص الطويلة</SelectItem>
                        <SelectItem value="medium">متوسط - متوازن</SelectItem>
                        <SelectItem value="large">كبير - للعناوين البارزة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>شكل الأزرار</Label>
                    <Select
                      value={advancedSettings.buttonStyle}
                      onValueChange={(value) =>
                        setAdvancedSettings({ ...advancedSettings, buttonStyle: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded">مستدير - Rounded</SelectItem>
                        <SelectItem value="square">مربع - Square</SelectItem>
                        <SelectItem value="pill">حبة دواء - Pill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>لون مخصص (Hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={advancedSettings.customColor}
                        onChange={(e) =>
                          setAdvancedSettings({ ...advancedSettings, customColor: e.target.value })
                        }
                        placeholder="#3B82F6"
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={advancedSettings.customColor}
                        onChange={(e) =>
                          setAdvancedSettings({ ...advancedSettings, customColor: e.target.value })
                        }
                        className="w-16"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      استخدم لون مخصص بدلاً من القوالب الجاهزة
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Media */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    الوسائط
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>رابط صورة مخصصة</Label>
                    <Input
                      value={advancedSettings.imageUrl}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, imageUrl: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      سيتم عرضها كصورة رئيسية للمنتج
                    </p>
                  </div>

                  <div>
                    <Label>رابط فيديو (YouTube/Vimeo)</Label>
                    <Input
                      value={advancedSettings.videoUrl}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, videoUrl: e.target.value })
                      }
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      سيتم تضمين الفيديو في الصفحة
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    التسعير
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>عرض السعر</Label>
                      <p className="text-sm text-muted-foreground">إظهار قسم التسعير</p>
                    </div>
                    <Switch
                      checked={advancedSettings.showPrice}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings({ ...advancedSettings, showPrice: checked })
                      }
                    />
                  </div>

                  {advancedSettings.showPrice && (
                    <>
                      <div>
                        <Label>السعر الحالي (ج.م)</Label>
                        <Input
                          type="number"
                          value={advancedSettings.price}
                          onChange={(e) =>
                            setAdvancedSettings({ ...advancedSettings, price: e.target.value })
                          }
                          placeholder="299"
                        />
                      </div>

                      <div>
                        <Label>السعر الأصلي (ج.م)</Label>
                        <Input
                          type="number"
                          value={advancedSettings.originalPrice}
                          onChange={(e) =>
                            setAdvancedSettings({ ...advancedSettings, originalPrice: e.target.value })
                          }
                          placeholder="599"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          لإظهار الخصم
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Social Proof */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    إثبات اجتماعي
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>شارة مخصصة</Label>
                    <Input
                      value={advancedSettings.badge}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, badge: e.target.value })
                      }
                      placeholder="🔥 الأكثر مبيعاً"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      مثل: "الأكثر مبيعاً" أو "خصم محدود"
                    </p>
                  </div>

                  <div>
                    <Label>إحصائية اجتماعية</Label>
                    <Input
                      value={advancedSettings.socialProof}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, socialProof: e.target.value })
                      }
                      placeholder="انضم إلى 10,000+ عميل راضٍ"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      رقم أو إحصائية تزيد الثقة
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>عرض التقييمات</Label>
                      <p className="text-sm text-muted-foreground">إضافة قسم آراء العملاء</p>
                    </div>
                    <Switch
                      checked={formData.testimonials}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, testimonials: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>عداد تنازلي</Label>
                      <p className="text-sm text-muted-foreground">لخلق شعور بالإلحاح</p>
                    </div>
                    <Switch
                      checked={formData.countdown}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, countdown: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                جاري الإنشاء...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                إنشاء الصفحة
              </>
            )}
          </Button>
        </div>

        {/* Right Panel - Preview & Actions */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                معاينة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] bg-muted rounded-lg overflow-hidden">
                <LandingPagePreview
                  title={formData.title}
                  subtitle={formData.subtitle}
                  description={formData.description}
                  ctaText={formData.ctaText}
                  template={selectedTemplate}
                  colorScheme={selectedColor}
                  features={formData.features}
                  testimonials={formData.testimonials}
                  countdown={formData.countdown}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                المعاينة تحدث تلقائياً عند تغيير المحتوى
              </p>
            </CardContent>
          </Card>

          {/* Generated URL */}
          {generatedUrl && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  تم الإنشاء!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted rounded-lg break-all text-sm">
                  {generatedUrl}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={copyUrl} className="gap-2">
                    <Copy className="h-4 w-4" />
                    نسخ
                  </Button>
                  <Button variant="outline" asChild className="gap-2">
                    <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      فتح
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">إحصائيات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">صفحات منشأة</span>
                <span className="font-semibold">{landingPages.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي الزيارات</span>
                <span className="font-semibold">
                  {landingPages.reduce((sum, page) => sum + (page.views || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي النقرات</span>
                <span className="font-semibold text-green-600">
                  {landingPages.reduce((sum, page) => sum + (page.clicks || 0), 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Saved Landing Pages */}
      {landingPages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>صفحاتك المحفوظة</CardTitle>
            <CardDescription>جميع الروابط التسويقية التي أنشأتها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {landingPages.map((page: any) => (
                <div
                  key={page.$id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{page.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {page.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>👁 {page.views || 0} مشاهدة</span>
                      <span>🖱 {page.clicks || 0} نقرة</span>
                      <span>✅ {page.conversions || 0} تحويل</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedPage(page)}
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(page.affiliateLink);
                        toast({
                          title: 'تم النسخ!',
                          description: 'تم نسخ الرابط التسويقي',
                        });
                      }}
                      title="نسخ"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      title="فتح"
                    >
                      <a href={page.affiliateLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
