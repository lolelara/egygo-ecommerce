# 🔧 استكشاف أخطاء Vendoor Function

## ⏱️ المشكلة: Function يستغرق وقتاً طويلاً (Timeout)

### السبب
Vendoor Function يستخدم **Puppeteer** لـ web scraping، وهذا يتطلب:
1. تشغيل Node.js runtime
2. تحميل Chromium browser (141 MB)
3. فتح صفحة Vendoor
4. تسجيل الدخول
5. استخراج البيانات

**أول استدعاء (Cold Start)** يستغرق **30-60 ثانية** أو أكثر.

### ✅ الحلول

#### 1. زيادة Timeout في Appwrite Function

في Appwrite Console:
```
Settings → Configuration → Timeout
غيّر من 15 seconds إلى 900 seconds (15 دقيقة)
```

#### 2. استخدام Warm-up Request

أضف endpoint بسيط للـ warm-up:

```typescript
// في server/routes/vendoor-new.ts
app.get('/warmup', (req, res) => {
  res.json({ status: 'warm', timestamp: new Date().toISOString() });
});
```

ثم استدعيه دورياً:
```bash
# كل 5 دقائق
curl https://68e1f6240030405882c5.fra.appwrite.run/warmup
```

#### 3. استخدام Appwrite Cron Job

بدلاً من استدعاء Function مباشرة، استخدم Cron Job:
- Function يعمل تلقائياً كل ساعة
- لا حاجة لانتظار الاستجابة
- النتائج تُحفظ مباشرة في Database

## 🎯 الحل الموصى به

### استخدم الـ Cron Job الموجود

الـ Function **يعمل بالفعل تلقائياً كل ساعة**:

```typescript
// server/cron/vendoor-sync.ts
cron.schedule('0 * * * *', async () => {
  console.log('⏰ [CRON] Vendoor sync job triggered (hourly)');
  await syncVendoorProducts();
});
```

**لا تحتاج لاستدعاء Function يدوياً!**

### للاستخدام اليدوي

إذا أردت استيراد منتجات يدوياً:

1. **من الواجهة**:
   - اذهب إلى `/#/intermediary/import`
   - اضغط "تحديث يدوي الآن"
   - انتظر 30-60 ثانية

2. **من API**:
```typescript
// استخدم endpoint محلي بدلاً من Function
const response = await fetch('/api/vendoor/sync-manual', {
  method: 'POST'
});
```

## 🔍 التحقق من عمل Function

### 1. من Appwrite Console

```
Functions → vendoor-scraper → Executions
```

شاهد آخر executions وتحقق من:
- ✅ Status: Completed
- ⏱️ Duration
- 📄 Logs

### 2. من Database

تحقق من Products Collection:
```sql
-- هل توجد منتجات من Vendoor؟
SELECT * FROM products 
WHERE sourceUrl LIKE '%vendoor%'
ORDER BY createdAt DESC
LIMIT 10;
```

### 3. من Logs

```bash
# في server logs
✅ [CRON] Vendoor sync job triggered (hourly)
📦 Processing product: [product name]
✅ Saved product to Appwrite
```

## 🚀 الإعداد الصحيح

### 1. Environment Variables

تأكد من وجود هذه المتغيرات في `.env`:

```env
# Vendoor Credentials
VENDOOR_EMAIL=almlmibrahym574@gmail.com
VENDOOR_PASSWORD=hema2004

# Appwrite
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
VITE_APPWRITE_API_KEY=your_api_key
```

### 2. Function Configuration

في `appwrite.json`:

```json
{
  "functions": [
    {
      "$id": "vendoor-scraper",
      "name": "Vendoor Scraper",
      "runtime": "node-18.0",
      "execute": ["any"],
      "timeout": 900,
      "enabled": true,
      "schedule": "0 * * * *"
    }
  ]
}
```

### 3. Server Configuration

في `server/index.ts`:

```typescript
// Start Vendoor Sync Cron Job
startVendoorSyncCron();
console.log('✅ Vendoor auto-sync cron job initialized');
```

## 📊 الأداء المتوقع

| العملية | الوقت المتوقع |
|---------|---------------|
| Cold Start | 30-60 ثانية |
| Warm Start | 5-10 ثوان |
| جلب منتج واحد | 3-5 ثوان |
| جلب جميع المنتجات | 30-120 ثانية |
| المزامنة التلقائية | تعمل في الخلفية |

## ⚡ نصائح للأداء

### 1. استخدم Cache
```typescript
// في vendoor-processor.ts
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### 2. Batch Processing
```typescript
// معالجة 10 منتجات في كل مرة
const BATCH_SIZE = 10;
```

### 3. Error Handling
```typescript
try {
  await processProduct(product);
} catch (error) {
  console.error('Failed:', error);
  // استمر في المعالجة
  continue;
}
```

## 🎯 الخلاصة

**لا تستخدم Function URL مباشرة!**

بدلاً من ذلك:
1. ✅ اعتمد على Cron Job التلقائي (كل ساعة)
2. ✅ استخدم `/api/vendoor/sync-manual` للمزامنة اليدوية
3. ✅ راقب النتائج من Database مباشرة

**Function يعمل بشكل صحيح، لكنه يحتاج وقتاً للتشغيل!**

---

**آخر تحديث**: 2025-01-14  
**الحالة**: ✅ Function Active (يعمل تلقائياً كل ساعة)
