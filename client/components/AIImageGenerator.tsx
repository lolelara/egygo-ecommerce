/**
 * AI Image Generator for Products
 * Generate product images using DALL-E
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Image as ImageIcon, 
  Loader2, 
  Sparkles,
  Download,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AIImageGeneratorProps {
  productName: string;
  productDescription?: string;
  onImageGenerated?: (imageUrl: string) => void;
}

const imageStyles = [
  { value: 'realistic', label: 'واقعي', prompt: 'photorealistic, high quality, professional product photography' },
  { value: 'minimalist', label: 'بسيط', prompt: 'minimalist, clean background, modern, simple' },
  { value: 'lifestyle', label: 'نمط حياة', prompt: 'lifestyle photography, in use, natural setting' },
  { value: 'studio', label: 'استوديو', prompt: 'studio lighting, white background, professional' },
  { value: 'artistic', label: 'فني', prompt: 'artistic, creative, colorful, eye-catching' },
];

const imageSizes = [
  { value: '1024x1024', label: 'مربع (1024×1024)' },
  { value: '1792x1024', label: 'عريض (1792×1024)' },
  { value: '1024x1792', label: 'طويل (1024×1792)' },
];

export function AIImageGenerator({ 
  productName, 
  productDescription,
  onImageGenerated 
}: AIImageGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('1024x1024');
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  const generateImage = async () => {
    setLoading(true);
    try {
      const selectedStyle = imageStyles.find(s => s.value === style);
      const basePrompt = `${productName}${productDescription ? `, ${productDescription}` : ''}`;
      const stylePrompt = selectedStyle?.prompt || '';
      const finalPrompt = customPrompt || `${basePrompt}, ${stylePrompt}`;

      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          productDescription,
          stylePrompt,
          size,
          customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;
      
      setGeneratedImage(imageUrl);
      if (onImageGenerated) {
        onImageGenerated(imageUrl);
      }

      toast({
        title: '✨ تم إنشاء الصورة بنجاح',
        description: 'يمكنك الآن تحميل الصورة أو إعادة التوليد',
      });
    } catch (error: any) {
      toast({
        title: '❌ خطأ',
        description: error.message || 'فشل إنشاء الصورة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productName.replace(/\s+/g, '-')}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: '✅ تم التحميل',
        description: 'تم تحميل الصورة بنجاح',
      });
    } catch (error) {
      toast({
        title: '❌ خطأ',
        description: 'فشل تحميل الصورة',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-2 border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          توليد صور بالذكاء الاصطناعي
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Style Selection */}
        <div>
          <Label htmlFor="style">نمط الصورة</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger id="style">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {imageStyles.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size Selection */}
        <div>
          <Label htmlFor="size">حجم الصورة</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {imageSizes.map(s => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Prompt */}
        <div>
          <Label htmlFor="customPrompt">وصف مخصص (اختياري)</Label>
          <Input
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="اكتب وصفاً مخصصاً للصورة..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            اترك فارغاً لاستخدام الوصف التلقائي
          </p>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateImage}
          disabled={loading || !productName}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري إنشاء الصورة...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              توليد صورة بالذكاء الاصطناعي
            </>
          )}
        </Button>

        {/* Generated Image */}
        {generatedImage && (
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden border-2 border-purple-200">
              <img
                src={generatedImage}
                alt={productName}
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={downloadImage}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                تحميل الصورة
              </Button>
              <Button
                onClick={generateImage}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                إعادة التوليد
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              💡 الصورة متاحة لمدة ساعة واحدة. قم بتحميلها الآن!
            </p>
          </div>
        )}

        {/* Cost Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>💰 التكلفة:</strong> ~$0.04 لكل صورة (DALL-E 3)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
