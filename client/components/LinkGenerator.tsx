import { useState } from 'react';
import { Link as LinkIcon, Copy, Check, QrCode, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import QRCode from 'qrcode';

export default function LinkGenerator() {
  const [productUrl, setProductUrl] = useState('');
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const generateLink = () => {
    if (!productUrl) {
      toast({ title: 'خطأ', description: 'الرجاء إدخال رابط المنتج', variant: 'destructive' });
      return;
    }

    try {
      const url = new URL(productUrl.startsWith('http') ? productUrl : `https://${productUrl}`);
      
      // Add affiliate code
      url.searchParams.set('ref', user?.affiliateCode || user?.$id || '');
      
      // Add UTM parameters
      if (utmParams.source) url.searchParams.set('utm_source', utmParams.source);
      if (utmParams.medium) url.searchParams.set('utm_medium', utmParams.medium);
      if (utmParams.campaign) url.searchParams.set('utm_campaign', utmParams.campaign);
      if (utmParams.term) url.searchParams.set('utm_term', utmParams.term);
      if (utmParams.content) url.searchParams.set('utm_content', utmParams.content);

      const finalLink = url.toString();
      setGeneratedLink(finalLink);

      // Generate QR Code
      QRCode.toDataURL(finalLink, { width: 300 }).then(setQrCode);

      toast({ title: 'تم الإنشاء', description: 'تم إنشاء الرابط بنجاح' });
    } catch (error) {
      toast({ title: 'خطأ', description: 'رابط غير صالح', variant: 'destructive' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرابط' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'رابط المنتج',
          url: generatedLink
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          مولد الروابط مع UTM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>رابط المنتج</Label>
          <Input
            placeholder="https://egygo.com/product/123"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>المصدر (Source)</Label>
            <Input
              placeholder="facebook"
              value={utmParams.source}
              onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">مثال: facebook, instagram, twitter</p>
          </div>

          <div>
            <Label>الوسيط (Medium)</Label>
            <Input
              placeholder="social"
              value={utmParams.medium}
              onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">مثال: social, email, cpc</p>
          </div>
        </div>

        <div>
          <Label>الحملة (Campaign)</Label>
          <Input
            placeholder="summer_sale"
            value={utmParams.campaign}
            onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
            />
          <p className="text-xs text-muted-foreground mt-1">مثال: summer_sale, black_friday</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>الكلمة المفتاحية (Term)</Label>
            <Input
              placeholder="اختياري"
              value={utmParams.term}
              onChange={(e) => setUtmParams({ ...utmParams, term: e.target.value })}
            />
          </div>

          <div>
            <Label>المحتوى (Content)</Label>
            <Input
              placeholder="اختياري"
              value={utmParams.content}
              onChange={(e) => setUtmParams({ ...utmParams, content: e.target.value })}
            />
          </div>
        </div>

        <Button onClick={generateLink} className="w-full">
          <LinkIcon className="h-4 w-4 ml-2" />
          إنشاء الرابط
        </Button>

        {generatedLink && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label>الرابط المولد</Label>
              <div className="flex gap-2">
                <Input value={generatedLink} readOnly className="font-mono text-sm" />
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button onClick={shareLink} variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {qrCode && (
              <div className="text-center">
                <Label>رمز QR</Label>
                <div className="mt-2 inline-block p-4 bg-white border rounded-lg">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  امسح الكود للوصول للرابط
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">معلومات UTM:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Source:</strong> من أين يأتي الزوار (فيسبوك، إنستجرام)</li>
            <li>• <strong>Medium:</strong> نوع الوسيط (سوشيال، إيميل)</li>
            <li>• <strong>Campaign:</strong> اسم الحملة التسويقية</li>
            <li>• <strong>Term:</strong> الكلمات المفتاحية (للإعلانات)</li>
            <li>• <strong>Content:</strong> نوع المحتوى (للتمييز بين الإعلانات)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
