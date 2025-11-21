/**
 * AI Content Generator for Affiliates
 * مولد محتوى تسويقي ذكي للمسوقين
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, Copy, Download, RefreshCw, Facebook, Instagram,
  MessageCircle, Wand2, Check, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateAIContent } from '@/lib/ai-helper';
import { getAdminOpenAIKeys } from '@/lib/admin-api';

export default function AIContentGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('professional');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Fetch API key on mount
    const fetchKey = async () => {
      try {
        const keys = await getAdminOpenAIKeys();
        const activeKey = keys.find(k => k.isActive && k.provider === 'gemini');
        if (activeKey) {
          setApiKey(activeKey.key);
        }
      } catch (error) {
        console.error("Failed to fetch API keys", error);
      }
    };
    fetchKey();
  }, []);

  const generateContent = async () => {
    if (!productName || !productPrice) {
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'يرجى إدخال اسم المنتج والسعر'
      });
      return;
    }

    if (!apiKey) {
      toast({
        variant: 'destructive',
        title: 'خطأ في الإعدادات',
        description: 'لم يتم العثور على مفتاح Gemini API نشط. يرجى التواصل مع الإدارة.'
      });
      return;
    }

    setLoading(true);

    try {
      const systemPrompt = `
        أنت خبير تسويق إلكتروني محترف متخصص في السوق المصري.
        مهمتك هي كتابة محتوى إعلاني جذاب لمنصات التواصل الاجتماعي.
        
        المنتج: ${productName}
        السعر: ${productPrice} جنيه مصري
        المنصة المستهدفة: ${platform}
        نبرة الصوت: ${tone}
        
        القواعد:
        1. استخدم اللهجة المصرية البيضاء والجذابة.
        2. استخدم الإيموجي بشكل مناسب لجذب الانتباه.
        3. ركز على القيمة مقابل السعر.
        4. أضف دعوة لاتخاذ إجراء (CTA) واضحة.
        5. أضف هاشتاجات مناسبة ورائجة في مصر.
        6. تنسيق النص يجب أن يكون سهل القراءة (فقرات قصيرة).
      `;

      const userPrompt = `اكتب إعلان لمنتج "${productName}" بسعر ${productPrice} على منصة ${platform} بنبرة ${tone}.`;

      const content = await generateAIContent({
        apiKey,
        provider: 'gemini',
        systemPrompt,
        userPrompt,
        temperature: 0.8
      });

      setGeneratedContent(content);

      toast({
        title: 'تم التوليد بنجاح! ✨',
        description: 'المحتوى جاهز للنسخ والاستخدام'
      });

    } catch (error: any) {
      console.error("Generation Error:", error);
      toast({
        variant: 'destructive',
        title: 'فشل التوليد',
        description: error.message || 'حدث خطأ أثناء توليد المحتوى'
      });
    } finally {
      setLoading(false);
    }
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
          {!apiKey && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">تنبيه: لم يتم تفعيل مفتاح الذكاء الاصطناعي (Gemini). يرجى تفعيله من لوحة التحكم.</p>
            </div>
          )}

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
            disabled={loading || !apiKey}
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
