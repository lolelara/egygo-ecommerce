import { useState } from 'react';
import { Copy, Download, QrCode, Link as LinkIcon, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import QRCode from 'qrcode';
import { toast } from 'sonner';

interface LinkGeneratorProps {
  productId?: string;
  productName?: string;
}

export default function LinkGenerator({ productId, productName }: LinkGeneratorProps) {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [linkType, setLinkType] = useState<'product' | 'general'>('general');

  // Generate affiliate link
  const generateLink = async () => {
    if (!user?.affiliateCode) {
      toast.error('كود المسوق غير متوفر');
      return;
    }

    let baseUrl = url || window.location.origin;
    
    // Add product ID if specified
    if (productId && linkType === 'product') {
      baseUrl = `${window.location.origin}/product/${productId}`;
    }

    // Add affiliate code as query parameter
    const affiliateLink = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}ref=${user.affiliateCode}`;
    setGeneratedLink(affiliateLink);

    // Generate QR Code
    try {
      const qrUrl = await QRCode.toDataURL(affiliateLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#8b5cf6',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
      toast.success('تم إنشاء الرابط بنجاح!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('فشل إنشاء رمز QR');
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success('تم نسخ الرابط!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('فشل نسخ الرابط');
    }
  };

  // Download QR Code
  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${user?.affiliateCode}.png`;
    link.href = qrCodeUrl;
    link.click();
    toast.success('تم تحميل رمز QR!');
  };

  // Share link
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName || 'تسوق من EgyGo',
          text: `اكتشف هذا المنتج الرائع على EgyGo!`,
          url: generatedLink
        });
        toast.success('تم المشاركة بنجاح!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyLink();
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-purple-600" />
          مولد الروابط التسويقية
        </CardTitle>
        <CardDescription>
          أنشئ روابط تسويقية مخصصة مع رمز QR لمشاركتها مع عملائك
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={linkType} onValueChange={(v) => setLinkType(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="general">رابط عام</TabsTrigger>
            <TabsTrigger value="product" disabled={!productId}>رابط منتج</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div>
              <Label htmlFor="url">رابط الصفحة (اختياري)</Label>
              <Input
                id="url"
                placeholder="https://egygo.me/products"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                اتركه فارغاً لإنشاء رابط للصفحة الرئيسية
              </p>
            </div>
          </TabsContent>

          <TabsContent value="product" className="space-y-4">
            {productName && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-900">المنتج المحدد:</p>
                <p className="text-lg font-bold text-purple-700">{productName}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={generateLink} 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            <LinkIcon className="w-5 h-5 ml-2" />
            إنشاء الرابط
          </Button>
        </div>

        {generatedLink && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {/* Generated Link */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <Label className="text-green-900 font-semibold mb-2 block">
                الرابط التسويقي الخاص بك:
              </Label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="bg-white font-mono text-sm"
                />
                <Button
                  onClick={copyLink}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={shareLink}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="p-6 bg-white rounded-lg border-2 border-purple-200 text-center">
                <Label className="text-purple-900 font-semibold mb-4 block">
                  رمز QR للمشاركة:
                </Label>
                <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
                <Button
                  onClick={downloadQR}
                  variant="outline"
                  className="mt-4"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تحميل رمز QR
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-xs text-blue-900">نقرات</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-xs text-green-900">تحويلات</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">0%</p>
                <p className="text-xs text-purple-900">معدل التحويل</p>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900 mb-2">💡 نصائح للنجاح:</p>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• شارك الرابط على وسائل التواصل الاجتماعي</li>
                <li>• استخدم رمز QR في المطبوعات والإعلانات</li>
                <li>• أضف وصف جذاب عند المشاركة</li>
                <li>• تابع الإحصائيات لتحسين أدائك</li>
              </ul>
            </div>
          </div>
        )}

        {/* Affiliate Code Badge */}
        <div className="mt-6 flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <span className="text-sm text-purple-900">كود المسوق الخاص بك:</span>
          <Badge variant="secondary" className="bg-purple-600 text-white text-lg px-4 py-1">
            {user?.affiliateCode || 'غير متوفر'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
