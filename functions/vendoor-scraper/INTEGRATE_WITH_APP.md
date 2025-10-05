# 🔌 دمج Appwrite Function مع التطبيق

## 📋 الخطوات

### 1️⃣ إضافة Function ID في .env

افتح `.env` في جذر المشروع وأضف:

```env
# Vendoor Scraper Function
VITE_APPWRITE_VENDOOR_FUNCTION_ID=your_function_id_here
```

**كيف تحصل على Function ID؟**

```powershell
appwrite functions list
```

ابحث عن `vendoor-scraper` وانسخ الـ `$id`

---

### 2️⃣ إنشاء Appwrite Helper

أنشئ ملف جديد: `client/lib/appwrite-functions.ts`

```typescript
import { Client, Functions } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const functions = new Functions(client);

export interface VendoorProduct {
  id: string;
  title: string;
  supplier: string;
  price: string;
  commission: string;
  stock: string;
  image: string;
}

export interface ScrapeResult {
  success: boolean;
  totalProducts?: number;
  totalPages?: number;
  page?: number;
  products: VendoorProduct[];
  error?: string;
}

/**
 * جلب جميع المنتجات من Ven-door
 */
export async function scrapeAllVendoorProducts(): Promise<ScrapeResult> {
  const functionId = import.meta.env.VITE_APPWRITE_VENDOOR_FUNCTION_ID;
  
  if (!functionId) {
    throw new Error('VITE_APPWRITE_VENDOOR_FUNCTION_ID not set in .env');
  }

  try {
    // تنفيذ Function
    const execution = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'scrape-all' }),
      false, // async = false (انتظر النتيجة)
      '/', // path
      'POST' // method
    );

    // تحليل النتيجة
    const result: ScrapeResult = JSON.parse(execution.responseBody);
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.error || 'Failed to scrape products');
    }
  } catch (error: any) {
    console.error('Error scraping products:', error);
    throw error;
  }
}

/**
 * جلب صفحة واحدة من المنتجات
 */
export async function scrapeVendoorPage(page: number): Promise<ScrapeResult> {
  const functionId = import.meta.env.VITE_APPWRITE_VENDOOR_FUNCTION_ID;
  
  if (!functionId) {
    throw new Error('VITE_APPWRITE_VENDOOR_FUNCTION_ID not set in .env');
  }

  try {
    const execution = await functions.createExecution(
      functionId,
      JSON.stringify({ action: 'scrape-page', page }),
      false,
      '/',
      'POST'
    );

    const result: ScrapeResult = JSON.parse(execution.responseBody);
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.error || 'Failed to scrape page');
    }
  } catch (error: any) {
    console.error('Error scraping page:', error);
    throw error;
  }
}

/**
 * جلب المنتجات مع polling (للـ async executions)
 */
export async function scrapeWithPolling(
  action: 'scrape-all' | 'scrape-page',
  page?: number,
  onProgress?: (status: string) => void
): Promise<ScrapeResult> {
  const functionId = import.meta.env.VITE_APPWRITE_VENDOOR_FUNCTION_ID;
  
  if (!functionId) {
    throw new Error('VITE_APPWRITE_VENDOOR_FUNCTION_ID not set in .env');
  }

  try {
    // تنفيذ Function بشكل async
    const execution = await functions.createExecution(
      functionId,
      JSON.stringify({ action, page }),
      true, // async = true
      '/',
      'POST'
    );

    const executionId = execution.$id;
    onProgress?.('processing');

    // Polling للتحقق من الحالة
    let status = 'processing';
    let attempts = 0;
    const maxAttempts = 180; // 15 دقيقة (180 × 5 ثواني)

    while (status === 'processing' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // انتظر 5 ثواني
      
      const result = await functions.getExecution(functionId, executionId);
      status = result.status;
      
      onProgress?.(status);

      if (status === 'completed') {
        const data: ScrapeResult = JSON.parse(result.responseBody);
        return data;
      } else if (status === 'failed') {
        throw new Error(result.errors || 'Execution failed');
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Execution timeout');
    }

    throw new Error('Unknown execution status');
  } catch (error: any) {
    console.error('Error in scrapeWithPolling:', error);
    throw error;
  }
}
```

---

### 3️⃣ تحديث VendoorImport.tsx

استبدل دالة `handleScrapeAll` في `client/pages/VendoorImport.tsx`:

```typescript
import { scrapeAllVendoorProducts, scrapeWithPolling } from '@/lib/appwrite-functions';

// ... باقي الكود

const handleScrapeAll = async () => {
  setIsScrapingAll(true);
  setScrapingProgress({ current: 0, total: 41 });

  try {
    // الطريقة الأولى: مع انتظار النتيجة (15 دقيقة)
    const result = await scrapeAllVendoorProducts();
    
    // أو الطريقة الثانية: مع polling
    // const result = await scrapeWithPolling('scrape-all', undefined, (status) => {
    //   console.log('Status:', status);
    //   // يمكنك تحديث progress هنا
    // });

    if (result.success && result.products) {
      setProducts(result.products);
      
      toast({
        title: 'نجح! 🎉',
        description: `تم جلب ${result.totalProducts} منتج من ${result.totalPages} صفحة`,
      });
    } else {
      throw new Error(result.error || 'فشل في جلب المنتجات');
    }

  } catch (error: any) {
    console.error('خطأ في جلب المنتجات:', error);
    toast({
      variant: 'destructive',
      title: 'خطأ',
      description: error.message || 'فشل جلب المنتجات',
    });
  } finally {
    setIsScrapingAll(false);
    setScrapingProgress({ current: 0, total: 0 });
  }
};
```

---

### 4️⃣ تحديث الـ Imports في VendoorImport.tsx

في أعلى الملف، أضف:

```typescript
import { scrapeAllVendoorProducts } from '@/lib/appwrite-functions';
```

وأزل:
```typescript
const WORKER_URL = import.meta.env.VITE_VENDOOR_WORKER_URL || '';
```

---

### 5️⃣ تحديث نص الزر

استبدل:

```typescript
<Button
  onClick={handleScrapeAll}
  disabled={isScrapingAll}
  className="flex-1"
  size="lg"
>
  {isScrapingAll ? (
    <>
      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      جاري جلب المنتجات...
    </>
  ) : (
    <>
      <Download className="ml-2 h-4 w-4" />
      جلب جميع المنتجات
    </>
  )}
</Button>
```

---

### 6️⃣ اختبار التطبيق

```powershell
# تأكد من إضافة Function ID في .env
# ثم أعد تشغيل dev server
pnpm dev
```

افتح: http://localhost:8080/intermediary/import

اضغط **"جلب جميع المنتجات"**

---

## 🎯 الفروقات الرئيسية

### قبل (Localhost only):
```typescript
const response = await fetch('/api/vendoor/scrape-all', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### بعد (Appwrite Function):
```typescript
const result = await scrapeAllVendoorProducts();
```

---

## 📊 مزايا الحل الجديد

✅ **يعمل في Production** - لا حاجة لـ localhost
✅ **مجاني** - ضمن حد Appwrite المجاني
✅ **آمن** - Credentials في Environment Variables
✅ **متكامل** - نفس نظام Appwrite
✅ **Timeout طويل** - 15 دقيقة

---

## 🐛 استكشاف الأخطاء

### ❌ "Function ID not set"

**الحل:** تأكد من إضافة `VITE_APPWRITE_VENDOOR_FUNCTION_ID` في `.env`

### ❌ "Missing required parameter: functionId"

**الحل:** أعد تشغيل dev server بعد تحديث `.env`

### ❌ "Execution timeout"

**الحل:** 
- استخدم `scrapeWithPolling` بدلاً من `scrapeAllVendoorProducts`
- أو زد الـ timeout في Function settings

---

## ✅ الخطوة التالية

**نشر التطبيق على Production:**

1. أضف `VITE_APPWRITE_VENDOOR_FUNCTION_ID` في Netlify/Cloudflare Environment Variables
2. Push التحديثات إلى GitHub
3. انتظر auto-deployment
4. اختبر في Production!

---

**🎉 مبروك! التكامل مكتمل!**
