import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Download, Copy, Sparkles, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function QRCodeGenerator() {
  const { toast } = useToast();
  const [qrLink, setQrLink] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState('#000000');

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qr-code.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    toast({ title: 'تم!', description: 'جاري تحميل رمز QR' });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(qrLink);
    toast({ title: 'تم النسخ', description: 'تم نسخ الرابط بنجاح' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          مولد رمز QR
        </CardTitle>
        <CardDescription>
          أنشئ رموز QR لصفحات الهبوط والمنتجات
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>الرابط</Label>
              <Input
                placeholder="https://egygo.me/landing/..."
                value={qrLink}
                onChange={(e) => setQrLink(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الحجم</Label>
                <Input 
                  type="number" 
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>اللون</Label>
                <Input 
                  type="color" 
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="mt-2" 
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                نصائح الاستخدام:
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• استخدم رموز QR في المطبوعات</li>
                <li>• ضعها على البطاقات الشخصية</li>
                <li>• أضفها على المنتجات</li>
                <li>• شاركها في المعارض</li>
              </ul>
            </div>
          </div>

          <div>
            {qrLink ? (
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <div className="flex justify-center mb-4">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={qrLink}
                    size={qrSize}
                    fgColor={qrColor}
                    level="H"
                    includeMargin
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={downloadQRCode}
                  >
                    <Download className="h-4 w-4 ml-2" />
                    تحميل PNG
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={copyLink}
                  >
                    <Copy className="h-4 w-4 ml-2" />
                    نسخ الرابط
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>أدخل رابطاً لإنشاء رمز QR</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
