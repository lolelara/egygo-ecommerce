# 🛒 إعداد Vendoor Scraper Function

## ✅ تم النشر بنجاح!

تم نشر Vendoor Scraper Function على Appwrite بنجاح:

- **Function ID**: `vendoor-scraper`
- **Deployment ID**: `68ee96495fe1484e2f1e`
- **Domain**: `68e1f6240030405882c5.fra.appwrite.run`
- **Runtime**: Node.js 18.0
- **Build Duration**: 2m 56s
- **Total Size**: 452 MB
- **Status**: ✅ Active

## 📝 إضافة رابط الـ Function إلى المشروع

### 1. تحديث ملف `.env`

أضف الرابط التالي إلى ملف `.env`:

```env
# Vendoor Scraper Function
VITE_VENDOOR_FUNCTION_URL=https://68e1f6240030405882c5.fra.appwrite.run
VENDOOR_FUNCTION_URL=https://68e1f6240030405882c5.fra.appwrite.run
```

### 2. الملفات المُحدّثة

تم إنشاء/تحديث الملفات التالية:

#### ✅ `client/lib/vendoor-function-api.ts` (جديد)
يحتوي على:
- `fetchAllVendoorProducts()` - جلب جميع المنتجات
- `fetchSingleVendoorProduct(productId)` - جلب منتج واحد
- `manualVendoorSync()` - مزامنة يدوية
- `importVendoorProduct(productId, markup)` - استيراد منتج
- `importMultipleVendoorProducts(productIds, markup)` - استيراد متعدد
- `checkVendoorFunctionStatus()` - التحقق من الحالة

#### ✅ `client/pages/VendoorImport.tsx` (محدّث)
تم إضافة imports للـ API الجديد

#### ✅ `env.example.txt` (جديد)
نموذج لملف `.env` مع جميع المتغيرات المطلوبة

## 🚀 كيفية الاستخدام

### تشغيل Warmup Service (موصى به)

لإبقاء Function نشط ومنع Cold Starts:

```bash
pnpm run warmup-vendoor
```

هذا سيستدعي Function كل 5 دقائق للحفاظ عليه نشط.

### من واجهة المستخدم

1. سجّل الدخول كوسيط: `intermediary@egygo.com`
2. اذهب إلى: `/#/intermediary/import`
3. استخدم إحدى الطرق:
   - **جلب جميع المنتجات**: يستدعي Function لجلب كل المنتجات
   - **جلب منتج واحد**: أدخل Product ID
   - **مزامنة يدوية**: تحديث الأسعار والمخزون

### من الكود

```typescript
import { 
  fetchAllVendoorProducts,
  importVendoorProduct 
} from '@/lib/vendoor-function-api';

// جلب جميع المنتجات
const result = await fetchAllVendoorProducts();
console.log(`تم جلب ${result.products.length} منتج`);

// استيراد منتج مع هامش ربح 20%
const imported = await importVendoorProduct('product-id', 20);
if (imported.success) {
  console.log('تم الاستيراد بنجاح!');
}
```

## 🔄 المزامنة التلقائية

تم إعداد Cron Job يعمل **كل ساعة** لمزامنة:
- الأسعار
- المخزون
- العمولات
- حالة المنتجات

### التحكم في المزامنة

من صفحة الإعدادات في VendoorImport:
- ✅ المزامنة التلقائية نشطة
- 🕐 تعمل كل ساعة
- 🔄 يمكن تشغيل مزامنة يدوية في أي وقت

## 📊 الـ Endpoints المتاحة

| Endpoint | Method | الوصف |
|----------|--------|-------|
| `/vendoor/fetch-all` | POST | جلب جميع المنتجات |
| `/vendoor/fetch-single` | POST | جلب منتج واحد |
| `/vendoor/sync-manual` | POST | مزامنة يدوية |
| `/vendoor/import-product` | POST | استيراد منتج |
| `/vendoor/import-multiple` | POST | استيراد متعدد |
| `/health` | GET | التحقق من الحالة |

## 🔐 الأمان

- ✅ بيانات Vendoor محفوظة في Environment Variables
- ✅ الـ Function يعمل على Appwrite Cloud
- ✅ Global CDN متصل
- ✅ DDoS Protection مفعّل

## 🐛 استكشاف الأخطاء

### Function لا يستجيب

```bash
# تحقق من الحالة
curl https://68e1f6240030405882c5.fra.appwrite.run/health
```

### خطأ في الاستيراد

1. تأكد من إضافة `VITE_VENDOOR_FUNCTION_URL` في `.env`
2. أعد تشغيل dev server
3. تحقق من Console للأخطاء

### بطء في الاستجابة

- الـ Function يستخدم Puppeteer للـ scraping
- أول استدعاء قد يأخذ 10-15 ثانية (cold start)
- الاستدعاءات التالية أسرع

## 📈 الأداء

- **Build Time**: 2m 56s
- **Cold Start**: ~10-15s
- **Warm Start**: ~2-3s
- **Memory**: 512MB
- **Timeout**: 900s (15 دقيقة)

## 🎯 الخطوات التالية

1. ✅ أضف `VITE_VENDOOR_FUNCTION_URL` إلى `.env`
2. ✅ أعد تشغيل dev server
3. ✅ جرّب استيراد منتج
4. ✅ راقب الـ logs في Appwrite Console

---

**تم الإنشاء**: 2025-01-14  
**آخر تحديث**: 2025-01-14  
**الحالة**: ✅ Active & Running
