import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { storage, databases, appwriteConfig } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Upload, Loader2, CheckCircle, CreditCard, Smartphone, Building } from 'lucide-react';

export default function AdPaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Get ad details from URL params
  const adId = searchParams.get('adId');
  const productName = searchParams.get('productName');
  const price = parseFloat(searchParams.get('price') || '0');
  const duration = parseInt(searchParams.get('duration') || '0');
  const adType = searchParams.get('adType');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!paymentProof || !adId) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار ملف',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      // Upload to Appwrite Storage
      const file = await storage.createFile(
        'payment-proofs',
        ID.unique(),
        paymentProof
      );

      // Update ad with payment proof
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'advertisements',
        adId,
        { 
          paymentProof: file.$id,
          status: 'pending' // Keep as pending until admin approves
        }
      );

      toast({
        title: 'تم الرفع بنجاح',
        description: 'تم رفع إثبات الدفع. سيتم مراجعته من قبل الإدارة.',
      });

      // Redirect back to merchant advertising page
      setTimeout(() => {
        navigate('/merchant/advertising');
      }, 2000);
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في رفع الملف. حاول مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const getAdTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      homepage_banner: 'بانر الصفحة الرئيسية',
      homepage_featured: 'منتج مميز - الرئيسية',
      category_top: 'أعلى التصنيف',
      search_sponsored: 'نتائج البحث',
    };
    return type ? labels[type] || type : '';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">دفع الإعلان</h1>
        <p className="text-muted-foreground">
          اتبع التعليمات أدناه لإتمام الدفع
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل الإعلان</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">المنتج</p>
                <p className="font-bold text-lg">{productName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع الإعلان</p>
                <Badge variant="outline">{getAdTypeLabel(adType)}</Badge>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-muted-foreground">المدة:</span>
                <span className="font-semibold">{duration} يوم</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-muted-foreground">المبلغ:</span>
                <span className="text-2xl font-bold text-primary">{price.toFixed(2)} ج.م</span>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="space-y-4 pt-4">
              <h4 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                طرق الدفع المتاحة:
              </h4>
              
              <div className="space-y-3">
                {/* Vodafone Cash */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-900">Vodafone Cash</span>
                  </div>
                  <p className="text-sm text-red-800 font-mono">01034324551</p>
                </div>

                {/* InstaPay */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">InstaPay</span>
                  </div>
                  <p className="text-sm text-blue-800 font-mono">ebank_hema@instapay</p>
                </div>

                {/* Bank Transfer */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">تحويل بنكي</span>
                  </div>
                  <p className="text-sm text-green-800">للحصول على تفاصيل الحساب البنكي، تواصل مع الدعم</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <p className="text-yellow-800">
                  💡 <strong>ملاحظة:</strong> بعد إتمام الدفع، قم برفع إثبات التحويل (صورة أو PDF) في القسم المجاور.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Payment Proof */}
        <Card>
          <CardHeader>
            <CardTitle>رفع إثبات الدفع</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="payment-proof">اختر الملف</Label>
              <Input
                id="payment-proof"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                صورة (JPG, PNG) أو PDF (حد أقصى 5MB)
              </p>
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium mb-2">معاينة:</p>
                {paymentProof?.type.startsWith('image/') ? (
                  <img 
                    src={previewUrl} 
                    alt="Payment Proof Preview" 
                    className="w-full h-auto rounded border"
                  />
                ) : (
                  <div className="bg-muted p-8 rounded text-center">
                    <CreditCard className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{paymentProof?.name}</p>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!paymentProof || uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  جاري الرفع...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  رفع إثبات الدفع
                </>
              )}
            </Button>

            {/* Success Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                الخطوات التالية:
              </h4>
              <ol className="text-sm text-green-800 space-y-2 mr-6 list-decimal">
                <li>قم بالدفع باستخدام إحدى الطرق المذكورة</li>
                <li>احتفظ بإثبات التحويل (صورة أو إيصال)</li>
                <li>ارفع الإثبات هنا</li>
                <li>انتظر موافقة الإدارة (عادةً خلال 24 ساعة)</li>
                <li>سيتم تفعيل إعلانك تلقائياً بعد الموافقة</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card className="border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="font-semibold mb-1">تفعيل سريع</h4>
            <p className="text-xs text-muted-foreground">
              يتم مراجعة الدفعات خلال 24 ساعة
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold mb-1">دفع آمن</h4>
            <p className="text-xs text-muted-foreground">
              جميع المعاملات مشفرة ومؤمنة
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-semibold mb-1">تتبع الأداء</h4>
            <p className="text-xs text-muted-foreground">
              شاهد إحصائيات إعلانك في الوقت الفعلي
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
