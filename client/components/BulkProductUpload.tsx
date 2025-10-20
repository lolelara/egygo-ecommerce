import { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { ID } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import * as XLSX from 'xlsx';

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function BulkProductUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = [
      {
        'اسم المنتج': 'مثال: هاتف ذكي',
        'الوصف': 'وصف تفصيلي للمنتج',
        'السعر': '1000',
        'الكمية': '50',
        'التصنيف': 'إلكترونيات',
        'SKU': 'PROD-001',
        'الوزن (كجم)': '0.5',
        'الأبعاد': '15x7x1',
        'الألوان': 'أسود,أبيض,أزرق',
        'المقاسات': 'صغير,متوسط,كبير',
        'الصور (URLs)': 'https://example.com/image1.jpg,https://example.com/image2.jpg'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجات');
    XLSX.writeFile(wb, 'egygo_products_template.xlsx');

    toast({
      title: 'تم التحميل',
      description: 'تم تحميل ملف القالب بنجاح'
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'خطأ',
        description: 'الرجاء اختيار ملف Excel أو CSV',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const results: UploadResult = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        
        try {
          // Validate required fields
          if (!row['اسم المنتج'] || !row['السعر']) {
            throw new Error('اسم المنتج والسعر مطلوبان');
          }

          // Parse colors and sizes
          const colors = row['الألوان'] ? row['الألوان'].split(',').map((c: string) => c.trim()) : [];
          const sizes = row['المقاسات'] ? row['المقاسات'].split(',').map((s: string) => s.trim()) : [];
          const images = row['الصور (URLs)'] ? row['الصور (URLs)'].split(',').map((img: string) => img.trim()) : [];

          // Create product
          await databases.createDocument(
            DATABASE_ID,
            'products',
            ID.unique(),
            {
              name: row['اسم المنتج'],
              description: row['الوصف'] || '',
              price: parseFloat(row['السعر']),
              stock: parseInt(row['الكمية']) || 0,
              category: row['التصنيف'] || 'عام',
              sku: row['SKU'] || `SKU-${Date.now()}-${i}`,
              weight: parseFloat(row['الوزن (كجم)']) || 0,
              dimensions: row['الأبعاد'] || '',
              colors: colors,
              sizes: sizes,
              images: images,
              merchantId: user?.$id,
              merchantName: user?.name,
              status: 'pending',
              featured: false,
              createdAt: new Date().toISOString()
            }
          );

          results.success++;
        } catch (error: any) {
          results.failed++;
          results.errors.push(`السطر ${i + 2}: ${error.message}`);
        }

        // Update progress
        setProgress(((i + 1) / jsonData.length) * 100);
      }

      setResult(results);
      
      if (results.success > 0) {
        toast({
          title: 'اكتمل الرفع',
          description: `تم رفع ${results.success} منتج بنجاح`
        });
      }

      if (results.failed > 0) {
        toast({
          title: 'تحذير',
          description: `فشل رفع ${results.failed} منتج`,
          variant: 'destructive'
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل قراءة الملف',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          رفع منتجات متعددة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">كيفية الاستخدام:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>قم بتحميل ملف القالب</li>
            <li>املأ بيانات المنتجات في الملف</li>
            <li>احفظ الملف بصيغة Excel أو CSV</li>
            <li>ارفع الملف هنا</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex-1"
          >
            <Download className="h-4 w-4 ml-2" />
            تحميل القالب
          </Button>

          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الرفع...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 ml-2" />
                رفع الملف
              </>
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>جاري المعالجة...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="text-2xl font-bold">{result.success}</p>
                    <p className="text-sm">نجح</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <div>
                    <p className="text-2xl font-bold">{result.failed}</p>
                    <p className="text-sm">فشل</p>
                  </div>
                </div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                <h4 className="font-semibold text-red-900 mb-2">الأخطاء:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {result.errors.slice(0, 10).map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                  {result.errors.length > 10 && (
                    <li>... و {result.errors.length - 10} أخطاء أخرى</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
