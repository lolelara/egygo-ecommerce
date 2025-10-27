/**
 * SEO Tools for Affiliates
 * أدوات تحسين محركات البحث للمسوقين
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Hash, FileText, Copy, Check, Sparkles, 
  TrendingUp, AlertCircle, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SEOTools() {
  const { toast } = useToast();
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // State for generated content
  const [titles, setTitles] = useState<string[]>([]);
  const [metaDescriptions, setMetaDescriptions] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  const generateTitles = () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يرجى إدخال اسم المنتج'
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const generatedTitles = [
        `احصل على ${productName} بأفضل سعر في مصر 2024 | توصيل مجاني`,
        `${productName} أصلي - جودة عالية وضمان | اطلب الآن`,
        `عرض خاص: ${productName} بخصم حصري | شحن سريع`,
        `تسوق ${productName} اونلاين | أفضل الأسعار والعروض`,
        `${productName} - مراجعات حقيقية ومميزات كاملة | دليل الشراء`,
        `وفر على ${productName} الآن | عروض محدودة المدة`
      ];
      setTitles(generatedTitles);
      setLoading(false);
      toast({
        title: 'تم التوليد! ✨',
        description: 'تم إنشاء العناوين بنجاح'
      });
    }, 1000);
  };

  const generateMetaDescriptions = () => {
    if (!productName) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يرجى إدخال اسم المنتج'
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const descriptions = [
        `اشتري ${productName} بأفضل سعر في مصر. جودة مضمونة، توصيل سريع، وإمكانية الدفع عند الاستلام. احصل على خصم حصري عند الطلب اليوم!`,
        `${productName} أصلي 100% مع ضمان. مراجعات حقيقية من عملاء سابقين. اطلب الآن واحصل على شحن مجاني لجميع المحافظات. عروض لفترة محدودة!`,
        `تسوق ${productName} اونلاين بأمان. أفضل الأسعار، أسرع توصيل، وخدمة عملاء متميزة. احصل على خصم 15% على أول طلب. اطلب الآن!`,
        `${productName} - دليلك الشامل للشراء. مقارنة أسعار، مواصفات كاملة، ومراجعات المستخدمين. اختر الأفضل بثقة. توصيل لباب المنزل!`,
        `عرض خاص على ${productName}! وفر حتى 30% الآن. جودة ممتازة، أسعار تنافسية، وضمان استرجاع المال. لا تفوت الفرصة!`
      ];
      setMetaDescriptions(descriptions);
      setLoading(false);
      toast({
        title: 'تم التوليد! ✨',
        description: 'تم إنشاء الوصف بنجاح'
      });
    }, 1000);
  };

  const generateKeywords = () => {
    if (!productName || !productCategory) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يرجى إدخال اسم المنتج والفئة'
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const keywordsList = [
        // Primary Keywords
        productName,
        `شراء ${productName}`,
        `${productName} اونلاين`,
        `${productName} مصر`,
        
        // Secondary Keywords
        `${productName} بأفضل سعر`,
        `${productName} توصيل مجاني`,
        `${productName} أصلي`,
        `${productName} 2024`,
        
        // Category Keywords
        `تسوق ${productCategory}`,
        `${productCategory} اونلاين`,
        `${productCategory} مصر`,
        
        // Location Keywords
        `${productName} القاهرة`,
        `${productName} الاسكندرية`,
        `${productName} الجيزة`,
        
        // Action Keywords
        `اطلب ${productName}`,
        `احصل على ${productName}`,
        `عروض ${productName}`,
        `خصم ${productName}`,
        
        // Long-tail Keywords
        `أفضل ${productName} في مصر`,
        `سعر ${productName} في مصر`,
        `مراجعة ${productName}`,
        `${productName} دفع عند الاستلام`
      ];
      setKeywords(keywordsList);
      setLoading(false);
      toast({
        title: 'تم التوليد! ✨',
        description: 'تم إنشاء الكلمات المفتاحية بنجاح'
      });
    }, 1000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: 'تم النسخ!',
      description: 'تم نسخ النص للحافظة'
    });
  };

  const copyAllKeywords = () => {
    const allKeywords = keywords.join(', ');
    navigator.clipboard.writeText(allKeywords);
    toast({
      title: 'تم النسخ!',
      description: 'تم نسخ جميع الكلمات المفتاحية'
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-6 w-6 text-blue-600" />
            أدوات تحسين محركات البحث (SEO)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            حسّن ظهور محتواك في نتائج البحث وزد من عدد زوارك
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم المنتج</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="مثال: تيشيرت قطن"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">الفئة</label>
              <select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الفئة</option>
                <option value="ملابس">ملابس</option>
                <option value="إلكترونيات">إلكترونيات</option>
                <option value="أحذية">أحذية</option>
                <option value="إكسسوارات">إكسسوارات</option>
                <option value="منزل ومطبخ">منزل ومطبخ</option>
                <option value="رياضة">رياضة</option>
              </select>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <strong>نصيحة:</strong> استخدم عناوين ووصف جذاب يحتوي على الكلمات المفتاحية الرئيسية لزيادة فرص الظهور في نتائج البحث.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="titles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="titles">
            <Sparkles className="h-4 w-4 ml-2" />
            العناوين
          </TabsTrigger>
          <TabsTrigger value="meta">
            <FileText className="h-4 w-4 ml-2" />
            الوصف
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Hash className="h-4 w-4 ml-2" />
            الكلمات المفتاحية
          </TabsTrigger>
        </TabsList>

        {/* Titles Tab */}
        <TabsContent value="titles">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>مولد العناوين الجذابة</CardTitle>
                <Button onClick={generateTitles} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      توليد العناوين
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {titles.length > 0 ? (
                <div className="space-y-3">
                  {titles.map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{title}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {title.length} حرف
                          </Badge>
                          {title.length <= 60 && (
                            <Badge className="bg-green-500 text-xs">طول مثالي</Badge>
                          )}
                          {title.length > 60 && title.length <= 70 && (
                            <Badge className="bg-yellow-500 text-xs">مقبول</Badge>
                          )}
                          {title.length > 70 && (
                            <Badge className="bg-red-500 text-xs">طويل جداً</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(title, `title-${index}`)}
                      >
                        {copied === `title-${index}` ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لم يتم توليد أي عناوين بعد</p>
                  <p className="text-sm mt-2">اضغط على "توليد العناوين" للبدء</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meta Description Tab */}
        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>مولد وصف ميتا (Meta Description)</CardTitle>
                <Button onClick={generateMetaDescriptions} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      جاري التوليد...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      توليد الوصف
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {metaDescriptions.length > 0 ? (
                <div className="space-y-3">
                  {metaDescriptions.map((desc, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted transition-colors">
                      <div className="flex-1">
                        <p className="text-sm">{desc}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {desc.length} حرف
                          </Badge>
                          {desc.length >= 120 && desc.length <= 160 && (
                            <Badge className="bg-green-500 text-xs">طول مثالي</Badge>
                          )}
                          {(desc.length < 120 || desc.length > 160) && desc.length <= 180 && (
                            <Badge className="bg-yellow-500 text-xs">مقبول</Badge>
                          )}
                          {desc.length > 180 && (
                            <Badge className="bg-red-500 text-xs">طويل جداً</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(desc, `meta-${index}`)}
                      >
                        {copied === `meta-${index}` ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لم يتم توليد أي وصف بعد</p>
                  <p className="text-sm mt-2">اضغط على "توليد الوصف" للبدء</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>مولد الكلمات المفتاحية</CardTitle>
                <div className="flex gap-2">
                  {keywords.length > 0 && (
                    <Button variant="outline" size="sm" onClick={copyAllKeywords}>
                      <Copy className="h-4 w-4 mr-2" />
                      نسخ الكل
                    </Button>
                  )}
                  <Button onClick={generateKeywords} disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        جاري التوليد...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        توليد الكلمات
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {keywords.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => copyToClipboard(keyword, `keyword-${index}`)}
                      >
                        {keyword}
                        {copied === `keyword-${index}` ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <strong>تم توليد {keywords.length} كلمة مفتاحية</strong>
                        <p className="mt-1">استخدم هذه الكلمات في المحتوى الخاص بك لتحسين ترتيبك في محركات البحث</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لم يتم توليد أي كلمات مفتاحية بعد</p>
                  <p className="text-sm mt-2">اضغط على "توليد الكلمات" للبدء</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
