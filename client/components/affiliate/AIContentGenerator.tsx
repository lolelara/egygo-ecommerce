/**
 * AI Content Generator for Affiliates
 * مولد محتوى تسويقي ذكي للمسوقين
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Copy, Download, RefreshCw, Facebook, Instagram, 
  MessageCircle, Wand2, Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AIContentGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!productName || !productPrice) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يرجى إدخال اسم المنتج والسعر'
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const contents: Record<string, Record<string, string>> = {
        facebook: {
          professional: `🌟 عرض احترافي لا يُفوّت!\n\n📦 ${productName}\n\n🎯 لماذا هذا المنتج؟\n✅ جودة مضمونة ومُختبرة\n✅ سعر تنافسي: ${productPrice} ج.م فقط\n✅ توصيل سريع لجميع المحافظات\n✅ ضمان الاسترجاع خلال 14 يوم\n\n💰 خصم خاص: وفّر 15% عند الطلب اليوم!\n\n🛒 اطلب الآن من الرابط في التعليق الأول ⬇️\n\n#تسوق_اونلاين #عروض_مصر #${productName.replace(/\s/g, '_')}`,
          
          friendly: `مرحبااا يا جماعة! 👋✨\n\nلقيت حاجة خطيرة لازم أشاركها معاكم! 🤩\n\n${productName} ده تحفة فنية! 💎\n\nالسعر: ${productPrice} ج.م بس 😍\nوده سعر خيالي للجودة دي!\n\nلو مهتم، الرابط تحت في أول كومنت 👇\nمتضيعش الفرصة! ⚡\n\n#شوبينج #تسوق #مصر #عروض`,

          urgent: `⚠️ عرض ينتهي خلال 24 ساعة فقط! ⏰\n\n🔥 ${productName} 🔥\n\n💸 السعر الآن: ${productPrice} ج.م\n💸 السعر الأصلي: ${(parseFloat(productPrice) * 1.3).toFixed(0)} ج.م\n\n🎁 مكافأة خاصة:\n✅ شحن مجاني\n✅ هدية مع كل طلب\n✅ خصم 10% على الطلب التالي\n\n⏳ الكمية محدودة جداً!\n\n🛒 اطلب فوراً: [الرابط في التعليق]\n\n#عرض_اليوم #تخفيضات #مصر`
        },
        instagram: {
          professional: `✨ ${productName} ✨\n\nسعر مميز: ${productPrice} ج.م 💰\n\n📦 مميزات المنتج:\n⚡ جودة عالية\n⚡ توصيل سريع\n⚡ ضمان شامل\n\nالرابط في البايو 👆\nأو راسلني مباشرة 💬\n\n#تسوق #مصر #القاهرة #عروض #شوبينج\n#اونلاين #توصيل #${productName.replace(/\s/g, '')}`,

          friendly: `حبيت أشارككم هذا الاكتشاف! 🌟\n\n${productName} 💖\n\nالسعر خيالي: ${productPrice} ج.م فقط! 😱\n\nجربته وكان رووووعة! ✨\nالجودة عالية والسعر مناسب جداً 👌\n\nاحصل عليه من الرابط في البايو 🔗\nأو راسلني للتفاصيل 📱\n\n#اكسبلور #فولو #لايك #تسوق_اونلاين\n#مصر #cairo #egypt #shopping`,

          urgent: `🚨 آخر فرصة! 🚨\n\n${productName}\n\n💥 ${productPrice} ج.م فقط\n⏰ العرض ينتهي الليلة!\n\nاطلب الآن 👇\nالرابط في البايو\n\n#عرض_محدود #sale #تخفيضات`
        },
        whatsapp: {
          professional: `السلام عليكم ورحمة الله 👋\n\nأتشرف بتقديم منتج مميز لك:\n\n📦 *${productName}*\n\n💰 السعر: *${productPrice} ج.م*\n\n🎯 المميزات:\n✅ جودة عالية ومضمونة\n✅ توصيل لجميع المحافظات\n✅ إمكانية الدفع عند الاستلام\n✅ ضمان وخدمة عملاء ممتازة\n\n🔗 رابط المنتج:\n[ضع رابطك هنا]\n\nللاستفسار أو الطلب، أنا في الخدمة 😊`,

          friendly: `هلا! 👋\n\nشفت ${productName}؟ \nتحفة والله! 😍\n\nالسعر: ${productPrice} ج.م بس\nخيالي صح؟ 🤩\n\nلو حابب تطلبه بعتلك الرابط:\n[الرابط]\n\nوأي سؤال أنا موجود! 💬`,

          urgent: `⚠️ عرض ينتهي اليوم! ⚠️\n\n${productName}\n${productPrice} ج.م فقط! 🔥\n\n⏰ باقي ساعات قليلة\n📦 الكمية محدودة جداً\n\nاطلب الآن:\n[الرابط]\n\nمتضيعش الفرصة! 🚀`
        }
      };

      const content = contents[platform]?.[tone] || 'لم يتم العثور على محتوى';
      setGeneratedContent(content);
      setLoading(false);
      
      toast({
        title: 'تم التوليد بنجاح! ✨',
        description: 'المحتوى جاهز للنسخ والاستخدام'
      });
    }, 1500);
  };

  const copyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'تم النسخ!',
      description: 'المحتوى منسوخ للحافظة'
    });
  };

  const downloadContent = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `content-${platform}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: 'تم التحميل!',
      description: 'الملف محفوظ على جهازك'
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            مولد المحتوى التسويقي بالذكاء الاصطناعي
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            اصنع محتوى تسويقي احترافي في ثوانٍ لجميع منصات التواصل
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم المنتج</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="مثال: تيشيرت قطن 100%"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">السعر (ج.م)</label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="مثال: 299"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">المنصة</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">
                    <div className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" />
                      فيسبوك
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram">
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" />
                      إنستجرام
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      واتساب
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">نبرة المحتوى</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">احترافي 💼</SelectItem>
                  <SelectItem value="friendly">ودود 😊</SelectItem>
                  <SelectItem value="urgent">عاجل ⚡</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateContent} 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                جاري التوليد...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                توليد المحتوى
              </>
            )}
          </Button>

          {generatedContent && (
            <div className="space-y-4 animate-in fade-in-50 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">المحتوى المُولّد:</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyContent}>
                    {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadContent}>
                    <Download className="h-4 w-4 mr-2" />
                    تحميل
                  </Button>
                </div>
              </div>
              
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={12}
                className="font-arabic text-base leading-relaxed"
              />

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 <strong>نصيحة:</strong> يمكنك تعديل المحتوى يدوياً قبل النسخ لإضافة لمستك الشخصية
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
