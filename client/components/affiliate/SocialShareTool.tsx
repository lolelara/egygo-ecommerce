import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Facebook, Twitter, Linkedin, MessageSquare, Send, Mail, Sparkles, TrendingUp } from 'lucide-react';

export function SocialShareTool() {
  const [shareUrl, setShareUrl] = useState('https://egygo.me/landing/example');
  const [shareText, setShareText] = useState('✨ عرض حصري! خصم 50% لفترة محدودة 🔥');

  const getSocialShareUrl = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      email: `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${encodedUrl}`
    };

    return urls[platform] || '';
  };

  const handleShare = (platform: string) => {
    window.open(getSocialShareUrl(platform), '_blank', 'width=600,height=400');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-6 w-6" />
          أدوات المشاركة الاجتماعية
        </CardTitle>
        <CardDescription>
          شارك منتجاتك على جميع منصات التواصل الاجتماعي
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>الرابط للمشاركة</Label>
            <Input
              placeholder="https://egygo.me/landing/..."
              value={shareUrl}
              onChange={(e) => setShareUrl(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label>النص المصاحب</Label>
            <Textarea
              placeholder="شاهد هذا المنتج الرائع..."
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-8 w-8 text-blue-600" />
            <span>Facebook</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-sky-50 hover:border-sky-300"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-8 w-8 text-sky-500" />
            <span>Twitter</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-blue-50 hover:border-blue-400"
            onClick={() => handleShare('linkedin')}
          >
            <Linkedin className="h-8 w-8 text-blue-700" />
            <span>LinkedIn</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-green-50 hover:border-green-300"
            onClick={() => handleShare('whatsapp')}
          >
            <MessageSquare className="h-8 w-8 text-green-600" />
            <span>WhatsApp</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
            onClick={() => handleShare('telegram')}
          >
            <Send className="h-8 w-8 text-blue-500" />
            <span>Telegram</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 hover:bg-red-50 hover:border-red-300"
            onClick={() => handleShare('email')}
          >
            <Mail className="h-8 w-8 text-red-600" />
            <span>Email</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                نصائح للمشاركة الفعالة:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ استخدم صور جذابة عالية الجودة</li>
                <li>✓ اكتب وصف مختصر وجذاب</li>
                <li>✓ أضف هاشتاجات ذات صلة</li>
                <li>✓ شارك في الأوقات المناسبة</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                أفضل الممارسات:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ شارك بانتظام (3-5 مرات يومياً)</li>
                <li>✓ تفاعل مع التعليقات</li>
                <li>✓ استخدم استراتيجية متنوعة</li>
                <li>✓ راقب النتائج وحللها</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
