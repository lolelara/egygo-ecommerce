import { useState } from 'react';
import { Zap, Plus, Calendar, Clock, Percent, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { ID } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

export default function FlashSaleCreator() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    discount: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    productIds: [] as string[]
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!formData.title || !formData.discount || !formData.startDate || !formData.endDate) {
      toast({
        title: 'خطأ',
        description: 'الرجاء ملء جميع الحقول المطلوبة',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime || '00:00'}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime || '23:59'}`);

      await databases.createDocument(
        DATABASE_ID,
        'flash_sales',
        ID.unique(),
        {
          title: formData.title,
          discount: parseFloat(formData.discount),
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          merchantId: user?.$id,
          merchantName: user?.name,
          status: 'scheduled',
          productIds: formData.productIds,
          createdAt: new Date().toISOString()
        }
      );

      toast({
        title: 'تم الإنشاء بنجاح',
        description: 'تم إنشاء عرض الفلاش سيل'
      });

      // Reset form
      setFormData({
        title: '',
        discount: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        productIds: []
      });
    } catch (error) {
      console.error('Error creating flash sale:', error);
      toast({
        title: 'خطأ',
        description: 'فشل إنشاء العرض',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          إنشاء عرض فلاش سيل
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>عنوان العرض</Label>
          <Input
            placeholder="مثال: تخفيضات نهاية الأسبوع"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <Label>نسبة الخصم (%)</Label>
          <div className="relative">
            <Input
              type="number"
              min="1"
              max="99"
              placeholder="50"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            />
            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>تاريخ البداية</Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <Label>وقت البداية</Label>
            <div className="relative">
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>تاريخ النهاية</Label>
            <div className="relative">
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <Label>وقت النهاية</Label>
            <div className="relative">
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">معلومات:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• سيتم تطبيق الخصم تلقائياً على المنتجات المحددة</li>
            <li>• يمكنك تحديد المنتجات بعد إنشاء العرض</li>
            <li>• سيظهر مؤقت العد التنازلي للعملاء</li>
          </ul>
        </div>

        <Button
          onClick={handleCreate}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري الإنشاء...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء العرض
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
