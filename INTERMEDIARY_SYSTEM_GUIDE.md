# نظام الوسيط (Intermediary System) - دليل التنفيذ الكامل

## 📋 نظرة عامة

تم إضافة دور "الوسيط" الذي يسمح باستيراد المنتجات من مواقع خارجية مع إضافة هامش ربح وإدارة الطلبات.

---

## ✅ ما تم إنجازه

### 1. إضافة حقل الهاتف لنموذج التسجيل ✅
**الملفات المعدلة:**
- `client/pages/Register.tsx` - إضافة حقل phone
- `client/contexts/AppwriteAuthContext.tsx` - تحديث دالة register لقبول phone

**التغييرات:**
```typescript
// إضافة phone في formData
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",  // ✅ جديد
  password: "",
  confirmPassword: "",
});

// تحديث دالة register
const register = async (
  email: string, 
  password: string, 
  name: string, 
  accountType: 'customer' | 'affiliate' | 'merchant' | 'intermediary' = 'customer',
  phone?: string  // ✅ جديد
)
```

### 2. Product Scraper API ✅
**الملف:** `client/lib/intermediary-api.ts`

**الوظائف المتاحة:**
- `scrapeProductFromUrl(url)` - استخراج بيانات المنتج من الرابط
- `importProductFromUrl(url, markup, categoryId)` - استيراد منتج واحد
- `bulkImportProducts(urls, markup, categoryId)` - استيراد متعدد
- `getIntermediaryProducts(intermediaryId)` - جلب منتجات الوسيط
- `updateProductMarkup(productId, markup)` - تحديث هامش الربح

**المميزات:**
- ✅ استخراج البيانات من Open Graph meta tags
- ✅ تحميل الصور تلقائياً إلى Appwrite Storage
- ✅ حساب السعر النهائي (نسبة أو مبلغ ثابت)
- ✅ حفظ الرابط الأصلي مع كل منتج
- ✅ دعم الاستيراد الجماعي

---

## 🚧 ما يحتاج إلى إكمال

### 3. لوحة تحكم الوسيط (Intermediary Dashboard)

**الملف المطلوب:** `client/pages/IntermediaryDashboard.tsx`

**المحتوى المطلوب:**

```tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { 
  importProductFromUrl, 
  bulkImportProducts, 
  getIntermediaryProducts,
  updateProductMarkup 
} from '@/lib/intermediary-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, ExternalLink, Plus, RefreshCw, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function IntermediaryDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Import Single Product State
  const [importUrl, setImportUrl] = useState('');
  const [markupType, setMarkupType] = useState<'percentage' | 'fixed'>('percentage');
  const [markupValue, setMarkupValue] = useState('20');
  const [importing, setImporting] = useState(false);
  
  // Bulk Import State
  const [bulkUrls, setBulkUrls] = useState('');
  const [bulkMarkupType, setBulkMarkupType] = useState<'percentage' | 'fixed'>('percentage');
  const [bulkMarkupValue, setBulkMarkupValue] = useState('20');
  const [bulkImporting, setBulkImporting] = useState(false);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getIntermediaryProducts(user.$id);
      setProducts(data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تحميل المنتجات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportSingle = async () => {
    if (!importUrl) {
      toast({
        title: "تحذير",
        description: "الرجاء إدخال رابط المنتج",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      const markup = markupType === 'percentage' 
        ? { type: 'percentage', value: parseFloat(markupValue) }
        : { type: 'fixed', value: parseFloat(markupValue) };
        
      const result = await importProductFromUrl(importUrl, markup);
      
      if (result.success) {
        toast({
          title: "نجح!",
          description: "تم استيراد المنتج بنجاح"
        });
        setImportUrl('');
        loadProducts();
      } else {
        toast({
          title: "فشل",
          description: result.error || "فشل استيراد المنتج",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الاستيراد",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const handleBulkImport = async () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim());
    
    if (urls.length === 0) {
      toast({
        title: "تحذير",
        description: "الرجاء إدخال روابط المنتجات",
        variant: "destructive"
      });
      return;
    }

    setBulkImporting(true);
    try {
      const markup = bulkMarkupType === 'percentage' 
        ? { type: 'percentage', value: parseFloat(bulkMarkupValue) }
        : { type: 'fixed', value: parseFloat(bulkMarkupValue) };
        
      const result = await bulkImportProducts(urls, markup);
      
      toast({
        title: "اكتمل الاستيراد",
        description: `نجح: ${result.success} | فشل: ${result.failed}`
      });
      
      setBulkUrls('');
      loadProducts();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الاستيراد الجماعي",
        variant: "destructive"
      });
    } finally {
      setBulkImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم الوسيط</h1>
          <p className="text-muted-foreground">
            استورد منتجات من مواقع أخرى وحدد هامش الربح
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط الهامش
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الطلبات النشطة
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Import Tabs */}
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">استيراد منتج واحد</TabsTrigger>
            <TabsTrigger value="bulk">استيراد جماعي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            <Card>
              <CardHeader>
                <CardTitle>استيراد منتج من رابط</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>رابط المنتج</Label>
                  <Input
                    placeholder="https://example.com/product/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نوع الهامش</Label>
                    <Select value={markupType} onValueChange={(v: any) => setMarkupType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت (جنيه)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>قيمة الهامش</Label>
                    <Input
                      type="number"
                      value={markupValue}
                      onChange={(e) => setMarkupValue(e.target.value)}
                      placeholder={markupType === 'percentage' ? '20' : '50'}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleImportSingle} 
                  disabled={importing}
                  className="w-full"
                >
                  {importing ? 'جاري الاستيراد...' : 'استيراد المنتج'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bulk">
            <Card>
              <CardHeader>
                <CardTitle>استيراد عدة منتجات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>روابط المنتجات (رابط لكل سطر)</Label>
                  <textarea
                    className="w-full min-h-[200px] p-3 border rounded-md"
                    placeholder="https://example.com/product1&#10;https://example.com/product2&#10;https://example.com/product3"
                    value={bulkUrls}
                    onChange={(e) => setBulkUrls(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>نوع الهامش</Label>
                    <Select value={bulkMarkupType} onValueChange={(v: any) => setBulkMarkupType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                        <SelectItem value="fixed">مبلغ ثابت (جنيه)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>قيمة الهامش</Label>
                    <Input
                      type="number"
                      value={bulkMarkupValue}
                      onChange={(e) => setBulkMarkupValue(e.target.value)}
                      placeholder={bulkMarkupType === 'percentage' ? '20' : '50'}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleBulkImport} 
                  disabled={bulkImporting}
                  className="w-full"
                >
                  {bulkImporting ? 'جاري الاستيراد...' : 'استيراد المنتجات'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>منتجاتي المستوردة</CardTitle>
              <Button onClick={loadProducts} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 ml-2" />
                تحديث
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لا توجد منتجات مستوردة بعد
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الصورة</TableHead>
                    <TableHead>الاسم</TableHead>
                    <TableHead>السعر الأصلي</TableHead>
                    <TableHead>الهامش</TableHead>
                    <TableHead>السعر النهائي</TableHead>
                    <TableHead>الرابط الأصلي</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: any) => (
                    <TableRow key={product.$id}>
                      <TableCell>
                        <img 
                          src={product.images?.[0] || '/placeholder.png'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.originalPrice} جنيه</TableCell>
                      <TableCell>
                        {product.priceMarkup} {product.priceMarkupType === 'percentage' ? '%' : 'جنيه'}
                      </TableCell>
                      <TableCell className="font-bold">{product.price} جنيه</TableCell>
                      <TableCell>
                        {product.sourceUrl && (
                          <a 
                            href={product.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-4 w-4" />
                            عرض
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          تعديل السعر
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

### 4. صفحة إدارة المستخدمين للأدمن

**الملف المطلوب:** `client/pages/AdminUserManagement.tsx`

**المحتوى المطلوب:**
```tsx
// صفحة لإضافة وإدارة جميع المستخدمين بما فيهم الوسطاء
// يجب أن تحتوي على:
// 1. جدول بجميع المستخدمين مع الأدوار
// 2. نموذج لإضافة مستخدم جديد (بما فيهم الوسطاء)
// 3. تفعيل/تعطيل المستخدمين
// 4. تعديل بيانات المستخدمين
// 5. حذف المستخدمين
```

---

### 5. تحديث Products Collection في Appwrite

**الحقول الجديدة المطلوبة:**

```javascript
// يجب إضافة هذه الحقول في Appwrite Console
{
  sourceUrl: string,           // الرابط الأصلي للمنتج
  originalPrice: number,       // السعر الأصلي قبل الهامش
  priceMarkup: number,         // قيمة الهامش
  priceMarkupType: string,     // نوع الهامش (percentage أو fixed)
  intermediaryId: string,      // معرف الوسيط
  intermediaryName: string     // اسم الوسيط
}
```

**خطوات التحديث في Appwrite Console:**
1. افتح Appwrite Console
2. اذهب إلى Database > Collections > products
3. أضف الحقول التالية:
   - `sourceUrl` (string, 2048)
   - `originalPrice` (float)
   - `priceMarkup` (float)
   - `priceMarkupType` (string, 20)
   - `intermediaryId` (string, 100)
   - `intermediaryName` (string, 255)

---

### 6. صفحة طلبات الوسيط

**الملف المطلوب:** `client/pages/IntermediaryOrders.tsx`

**المحتوى المطلوب:**
```tsx
// صفحة لعرض الطلبات التي تحتوي على منتجات الوسيط
// يجب أن تحتوي على:
// 1. جدول بالطلبات النشطة
// 2. تفاصيل المنتجات في كل طلب
// 3. الرابط الأصلي لسهولة الشراء
// 4. حالة الطلب (جديد، قيد الشراء، تم الشراء، تم التسليم)
// 5. حساب الربح من كل طلب
```

---

## 📱 تحديث التوجيه (Routing)

**الملف:** `client/App.tsx`

```tsx
// إضافة المسارات التالية:
<Route path="/intermediary/dashboard" element={<IntermediaryDashboard />} />
<Route path="/intermediary/orders" element={<IntermediaryOrders />} />
<Route path="/admin/users" element={<AdminUserManagement />} />
```

---

## 🔐 تحديث الصلاحيات

**الملف:** `client/lib/auth-utils.ts` (إنشاء جديد)

```tsx
export const hasIntermediaryAccess = (user: User | null): boolean => {
  if (!user) return false;
  return user.prefs?.role === 'intermediary' || user.prefs?.isIntermediary === true;
};

export const hasAdminAccess = (user: User | null): boolean => {
  if (!user) return false;
  return user.prefs?.role === 'admin';
};
```

---

## 🎨 تحديث الهيدر

**الملف:** `client/components/Header.tsx`

```tsx
// إضافة رابط لوحة تحكم الوسيط في القائمة
{hasIntermediaryAccess(user) && (
  <Link to="/intermediary/dashboard">
    لوحة تحكم الوسيط
  </Link>
)}
```

---

## 📝 API Endpoints إضافية مطلوبة

### في `client/lib/intermediary-api.ts`:

```tsx
// إضافة:
export async function getIntermediaryOrders(intermediaryId: string) {
  // جلب الطلبات التي تحتوي على منتجات الوسيط
}

export async function updateOrderStatus(orderId: string, status: string) {
  // تحديث حالة الطلب
}

export async function calculateIntermediaryProfit(intermediaryId: string) {
  // حساب إجمالي الأرباح
}
```

---

## 🔧 خطوات الإكمال

### 1. إنشاء الملفات المطلوبة:
- [ ] `client/pages/IntermediaryDashboard.tsx`
- [ ] `client/pages/IntermediaryOrders.tsx`
- [ ] `client/pages/AdminUserManagement.tsx`
- [ ] `client/lib/auth-utils.ts`

### 2. تحديث Appwrite:
- [ ] إضافة الحقول الجديدة لـ products collection
- [ ] تحديث الصلاحيات للسماح للوسطاء بإضافة المنتجات

### 3. تحديث الملفات الموجودة:
- [ ] `client/App.tsx` - إضافة المسارات
- [ ] `client/components/Header.tsx` - إضافة روابط الوسيط

### 4. الاختبار:
- [ ] اختبار استيراد منتج واحد
- [ ] اختبار الاستيراد الجماعي
- [ ] اختبار تحديث الأسعار
- [ ] اختبار عرض الطلبات

---

## 💡 ملاحظات مهمة

### حول استخراج البيانات:
- الـ API الحالي يستخدم CORS proxy (`allorigins.win`)
- في الإنتاج، يفضل استخدام server-side scraping
- يمكن إنشاء Appwrite Function للاستخراج من الخادم

### حول الصور:
- يتم تحميل الصور تلقائياً إلى Appwrite Storage
- يمكن تحديد حد أقصى لعدد الصور (حالياً 5)
- في حالة فشل التحميل، يتم استخدام صورة placeholder

### حول الأسعار:
- يدعم النظام نوعين من الهوامش: نسبة مئوية أو مبلغ ثابت
- يتم حفظ السعر الأصلي والهامش بشكل منفصل
- يمكن تعديل الهامش لاحقاً دون الحاجة لإعادة الاستيراد

---

## 🚀 للبدء:

```bash
# تشغيل المشروع
pnpm dev

# الوصول للوحة تحكم الوسيط (بعد التسجيل كوسيط)
http://localhost:8080/#/intermediary/dashboard
```

---

## 📞 الدعم

في حالة وجود أي مشاكل أو أسئلة:
1. تحقق من console للأخطاء
2. تأكد من إعدادات Appwrite
3. تحقق من الصلاحيات

---

**تاريخ الإنشاء:** 4 أكتوبر 2025  
**الحالة:** 🟡 قيد التطوير (50% مكتمل)

**المكتمل:**
- ✅ حقل الهاتف في التسجيل
- ✅ Product Scraper API
- ✅ دعم دور الوسيط في AuthContext

**المتبقي:**
- 🔄 لوحة تحكم الوسيط
- 🔄 صفحة الطلبات
- 🔄 إدارة المستخدمين للأدمن
- 🔄 تحديث Products Collection
- 🔄 التوجيه والصلاحيات
