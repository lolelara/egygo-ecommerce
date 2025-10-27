import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link2, Copy, ExternalLink, Eye, Users, Target, Zap } from 'lucide-react';

export function LinkShortener() {
  const { toast } = useToast();
  const [linkToShorten, setLinkToShorten] = useState('');
  const [shortenedLink, setShortenedLink] = useState('');

  const handleShortenLink = () => {
    if (!linkToShorten) {
      toast({ title: 'خطأ', description: 'الرجاء إدخال رابط', variant: 'destructive' });
      return;
    }
    
    const shortCode = Math.random().toString(36).substring(7);
    const shortened = `https://egygo.me/${shortCode}`;
    setShortenedLink(shortened);
    
    toast({ title: 'تم!', description: 'تم اختصار الرابط بنجاح' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرابط بنجاح' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          اختصار الروابط
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>الرابط الطويل</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="https://example.com/very/long/url/here"
              value={linkToShorten}
              onChange={(e) => setLinkToShorten(e.target.value)}
            />
            <Button onClick={handleShortenLink}>
              <Zap className="h-4 w-4 ml-2" />
              اختصار
            </Button>
          </div>
        </div>

        {shortenedLink && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <Label className="text-green-800 mb-2 block">الرابط المختصر</Label>
            <div className="flex items-center gap-2">
              <Input value={shortenedLink} readOnly className="bg-white" />
              <Button variant="outline" onClick={() => copyToClipboard(shortenedLink)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => window.open(shortenedLink, '_blank')}>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <p className="font-semibold">247</p>
                <p className="text-gray-600">مشاهدة</p>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <p className="font-semibold">189</p>
                <p className="text-gray-600">زائر فريد</p>
              </div>
              <div className="text-center">
                <Target className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <p className="font-semibold">12</p>
                <p className="text-gray-600">تحويل</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
