import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Zap, Copy, ExternalLink } from 'lucide-react';

export function UTMBuilder() {
  const { toast } = useToast();
  const [utmParams, setUtmParams] = useState({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedUTM, setGeneratedUTM] = useState('');

  const buildUTM = () => {
    if (!utmParams.url || !utmParams.source || !utmParams.medium || !utmParams.campaign) {
      toast({ title: 'خطأ', description: 'الرجاء ملء جميع الحقول المطلوبة', variant: 'destructive' });
      return;
    }

    let utm = `${utmParams.url}?utm_source=${encodeURIComponent(utmParams.source)}&utm_medium=${encodeURIComponent(utmParams.medium)}&utm_campaign=${encodeURIComponent(utmParams.campaign)}`;
    
    if (utmParams.term) utm += `&utm_term=${encodeURIComponent(utmParams.term)}`;
    if (utmParams.content) utm += `&utm_content=${encodeURIComponent(utmParams.content)}`;
    
    setGeneratedUTM(utm);
    toast({ title: 'تم!', description: 'تم إنشاء رابط UTM بنجاح' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرابط بنجاح' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          بناء روابط UTM
        </CardTitle>
        <CardDescription>
          أنشئ روابط بمعاملات UTM لتتبع الحملات التسويقية
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>الرابط الأساسي *</Label>
            <Input
              placeholder="https://egygo.me/product/123"
              value={utmParams.url}
              onChange={(e) => setUtmParams({ ...utmParams, url: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>المصدر (Source) *</Label>
            <Input
              placeholder="facebook"
              value={utmParams.source}
              onChange={(e) => setUtmParams({ ...utmParams, source: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>الوسيط (Medium) *</Label>
            <Input
              placeholder="social"
              value={utmParams.medium}
              onChange={(e) => setUtmParams({ ...utmParams, medium: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>الحملة (Campaign) *</Label>
            <Input
              placeholder="summer_sale"
              value={utmParams.campaign}
              onChange={(e) => setUtmParams({ ...utmParams, campaign: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>الكلمة المفتاحية (Term)</Label>
            <Input
              placeholder="shoes"
              value={utmParams.term}
              onChange={(e) => setUtmParams({ ...utmParams, term: e.target.value })}
              className="mt-2"
            />
          </div>
          <div>
            <Label>المحتوى (Content)</Label>
            <Input
              placeholder="banner_ad"
              value={utmParams.content}
              onChange={(e) => setUtmParams({ ...utmParams, content: e.target.value })}
              className="mt-2"
            />
          </div>
        </div>

        <Button onClick={buildUTM} className="w-full">
          <Zap className="h-4 w-4 ml-2" />
          إنشاء رابط UTM
        </Button>

        {generatedUTM && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <Label className="text-green-800 mb-2 block">رابط UTM الكامل</Label>
            <Textarea
              value={generatedUTM}
              readOnly
              className="bg-white min-h-[100px] mb-2"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => copyToClipboard(generatedUTM)}
              >
                <Copy className="h-4 w-4 ml-2" />
                نسخ
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(generatedUTM, '_blank')}
              >
                <ExternalLink className="h-4 w-4 ml-2" />
                فتح
              </Button>
            </div>
          </div>
        )}

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold mb-2">📊 أمثلة شائعة:</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Source:</strong> facebook, google, instagram, email</p>
            <p><strong>Medium:</strong> social, cpc, email, banner</p>
            <p><strong>Campaign:</strong> summer_sale, black_friday, launch</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
