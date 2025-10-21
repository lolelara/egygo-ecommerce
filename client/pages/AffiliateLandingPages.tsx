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
  CheckCircle2,
  ExternalLink,
  Code,
  Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { databases, appwriteConfig, ID } from '@/lib/appwrite';
import { Query } from 'appwrite';

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
        [Query.limit(100), Query.equal('isActive', true)]
      );
      setProducts(response.documents);
    } catch (error) {
      console.error('Error loading products:', error);
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
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
      const pageId = ID.unique();
      
      // Extract product ID from URL
      const productId = formData.productUrl.split('/').pop()?.split('?')[0] || '';
      
      // Generate affiliate link (without hash)
      const affiliateLink = `https://egygo.me/product/${productId}?ref=${user.affiliateCode || user.$id}`;
      
      // Save to database
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
          slug: slug,
          views: 0,
          clicks: 0,
          conversions: 0,
          isActive: true,
        }
      );
      
      const url = `https://egygo.me/lp/${slug}`;
      setGeneratedUrl(affiliateLink); // Use affiliate link instead
      
      // Reload landing pages
      await loadLandingPages();
      
      toast({
        title: '✅ تم إنشاء الصفحة!',
        description: 'الرابط التسويقي جاهز للاستخدام',
      });
    } catch (error: any) {
      console.error('Error creating landing page:', error);
      
      // Fallback: generate link without saving
      const productId = formData.productUrl.split('/').pop()?.split('?')[0] || '';
      const affiliateLink = `https://egygo.me/product/${productId}?ref=${user.affiliateCode || user.$id}`;
      setGeneratedUrl(affiliateLink);
      
      toast({
        title: '⚠️ تم إنشاء الرابط',
        description: 'الرابط جاهز لكن لم يتم حفظه في قاعدة البيانات',
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
                        {products.map((product: any) => (
                          <SelectItem key={product.$id} value={`https://egygo.me/product/${product.$id}`}>
                            {product.name} - {product.price} ج.م
                          </SelectItem>
                        ))}
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
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            selectedTemplate === template.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                            <Layout className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h4 className="font-semibold">{template.name}</h4>
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
                          onClick={() => setSelectedColor(scheme.id)}
                          className={`relative h-12 rounded-lg transition-all ${
                            selectedColor === scheme.id ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: scheme.primary }}
                        >
                          {selectedColor === scheme.id && (
                            <CheckCircle2 className="absolute inset-0 m-auto h-5 w-5 text-white" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    إعدادات متقدمة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>نطاق مخصص</Label>
                      <p className="text-sm text-muted-foreground">استخدم نطاقك الخاص</p>
                    </div>
                    <Switch
                      checked={formData.customDomain}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, customDomain: checked })
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
              <div className="aspect-[9/16] bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                <div className="text-center p-6">
                  <Globe className="h-12 w-12 mx-auto text-primary mb-3" />
                  <p className="text-sm text-muted-foreground">
                    معاينة الصفحة ستظهر هنا
                  </p>
                </div>
              </div>
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
                      onClick={() => {
                        navigator.clipboard.writeText(page.affiliateLink);
                        toast({
                          title: 'تم النسخ!',
                          description: 'تم نسخ الرابط التسويقي',
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
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
