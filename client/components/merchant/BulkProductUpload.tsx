import { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AppwriteAuthContext';

interface ParsedProduct {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  status: 'valid' | 'error';
  errors?: string[];
}

export default function BulkProductUpload() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Download CSV template
  const downloadTemplate = () => {
    const template = [
      ['الاسم', 'SKU', 'السعر', 'المخزون', 'الفئة', 'الوصف'],
      ['منتج تجريبي', 'PROD-001', '299.99', '50', 'إلكترونيات', 'وصف المنتج هنا'],
      ['منتج آخر', 'PROD-002', '149.99', '30', 'أزياء', 'وصف آخر']
    ];

    const csv = template.map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('تم تنزيل القالب بنجاح');
  };

  // Parse CSV file
  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const products: ParsedProduct[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length < 5) continue;

      const [name, sku, priceStr, stockStr, category, description] = values;
      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr);

      const errors: string[] = [];
      
      if (!name) errors.push('الاسم مطلوب');
      if (!sku) errors.push('SKU مطلوب');
      if (isNaN(price) || price <= 0) errors.push('السعر غير صحيح');
      if (isNaN(stock) || stock < 0) errors.push('المخزون غير صحيح');
      if (!category) errors.push('الفئة مطلوبة');

      products.push({
        name,
        sku,
        price,
        stock,
        category,
        description,
        status: errors.length > 0 ? 'error' : 'valid',
        errors
      });
    }

    return products;
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('يرجى رفع ملف CSV فقط');
      return;
    }

    try {
      const text = await file.text();
      const products = parseCSV(text);
      
      if (products.length === 0) {
        toast.error('الملف فارغ أو بصيغة غير صحيحة');
        return;
      }

      setParsedProducts(products);
      setShowPreview(true);
      
      const validCount = products.filter(p => p.status === 'valid').length;
      const errorCount = products.filter(p => p.status === 'error').length;
      
      toast.success(`تم تحليل ${products.length} منتج (${validCount} صحيح، ${errorCount} خطأ)`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('فشل قراءة الملف');
    }
  };

  // Upload products to database
  const uploadProducts = async () => {
    if (!user?.$id) {
      toast.error('يجب تسجيل الدخول');
      return;
    }

    const validProducts = parsedProducts.filter(p => p.status === 'valid');
    
    if (validProducts.length === 0) {
      toast.error('لا توجد منتجات صحيحة للرفع');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < validProducts.length; i++) {
        const product = validProducts[i];
        
        try {
          // TODO: Replace with actual API call
          // await productsAPI.createProduct({
          //   ...product,
          //   merchantId: user.$id
          // });
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 100));
          successCount++;
        } catch (error) {
          console.error(`Error uploading product ${product.sku}:`, error);
          failCount++;
        }

        setProgress(((i + 1) / validProducts.length) * 100);
      }

      toast.success(`تم رفع ${successCount} منتج بنجاح${failCount > 0 ? ` (${failCount} فشل)` : ''}`);
      
      if (successCount > 0) {
        setParsedProducts([]);
        setShowPreview(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading products:', error);
      toast.error('فشل رفع المنتجات');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const validCount = parsedProducts.filter(p => p.status === 'valid').length;
  const errorCount = parsedProducts.filter(p => p.status === 'error').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          رفع جماعي للمنتجات
        </CardTitle>
        <CardDescription>
          رفع عدة منتجات دفعة واحدة باستخدام ملف CSV
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Download Template */}
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">تنزيل قالب CSV</p>
              <p className="text-sm text-blue-700">ابدأ بتنزيل القالب وملء البيانات</p>
            </div>
          </div>
          <Button onClick={downloadTemplate} variant="outline" className="border-blue-300">
            <Download className="h-4 w-4 ml-2" />
            تنزيل القالب
          </Button>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">اسحب ملف CSV هنا أو انقر للرفع</p>
              <p className="text-sm text-muted-foreground">CSV فقط، حجم أقصى 5MB</p>
            </label>
          </div>

          {/* Preview */}
          {showPreview && parsedProducts.length > 0 && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="flex gap-4">
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 ml-1" />
                  {validCount} صحيح
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 ml-1" />
                    {errorCount} خطأ
                  </Badge>
                )}
              </div>

              {/* Products List */}
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="p-2 text-right">الحالة</th>
                      <th className="p-2 text-right">الاسم</th>
                      <th className="p-2 text-right">SKU</th>
                      <th className="p-2 text-right">السعر</th>
                      <th className="p-2 text-right">المخزون</th>
                      <th className="p-2 text-right">الفئة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedProducts.map((product, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">
                          {product.status === 'valid' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="group relative">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <div className="absolute right-0 top-6 hidden group-hover:block bg-black text-white text-xs p-2 rounded shadow-lg z-10 w-48">
                                {product.errors?.join(', ')}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2 font-mono text-xs">{product.sku}</td>
                        <td className="p-2">{product.price} ج.م</td>
                        <td className="p-2">{product.stock}</td>
                        <td className="p-2">{product.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>جاري الرفع...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={uploadProducts}
                  disabled={uploading || validCount === 0}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 ml-2" />
                      رفع {validCount} منتج
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedProducts([]);
                    setShowPreview(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  disabled={uploading}
                >
                  إلغاء
                </Button>
              </div>

              {/* Warnings */}
              {errorCount > 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">تحذير: يوجد {errorCount} منتج بها أخطاء</p>
                    <p>سيتم رفع المنتجات الصحيحة فقط. يرجى مراجعة الأخطاء وإصلاحها.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
          <p className="font-medium">📋 تعليمات الاستخدام:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground mr-4">
            <li>قم بتنزيل قالب CSV</li>
            <li>املأ بيانات المنتجات في القالب</li>
            <li>احفظ الملف بصيغة CSV</li>
            <li>ارفع الملف هنا</li>
            <li>راجع المعاينة وتأكد من البيانات</li>
            <li>اضغط "رفع" لإضافة المنتجات</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
