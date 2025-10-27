# 🚀 Appwrite Function Setup - Vendoor Scraper

## 📋 دليل الإعداد السريع

### الخطوة 1: تثبيت Appwrite CLI

```bash
npm install -g appwrite-cli
```

### الخطوة 2: تسجيل الدخول

```bash
appwrite login
```

سيفتح متصفح لتسجيل الدخول. اختر:
- ✅ Appwrite Cloud (cloud.appwrite.io)
- أو Self-hosted (إذا كان لديك سيرفر خاص)

### الخطوة 3: إنشاء Storage Bucket

#### عبر Console:
1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اختر مشروعك (EgyGo)
3. Storage → Create Bucket
4. املأ:
   - **Bucket ID**: `vendoor-exports`
   - **Name**: `Vendoor Exports`
   - **Max File Size**: `50MB`
   - **Allowed Extensions**: `json`
   - **Compression**: `gzip`
   - **Encryption**: `enabled`
   - **Antivirus**: `enabled`

5. Permissions:
   ```
   Read:   Role: any
   Create: Role: users
   Update: Role: users
   Delete: Role: admins
   ```

#### عبر CLI:
```bash
appwrite storage createBucket \
  --bucketId vendoor-exports \
  --name "Vendoor Exports" \
  --fileSecurity true \
  --enabled true \
  --maximumFileSize 52428800 \
  --allowedFileExtensions "json" \
  --compression "gzip" \
  --encryption true \
  --antivirus true
```

### الخطوة 4: إنشاء API Key

1. في Appwrite Console → Settings → API Keys
2. Create API Key:
   - **Name**: `Vendoor Scraper Function`
   - **Expiration**: Never (or 1 year)
   - **Scopes**:
     ```
     ✅ functions.read
     ✅ functions.write
     ✅ storage.read
     ✅ storage.write
     ✅ files.read
     ✅ files.write
     ```

3. **احفظ الـ API Key** - لن تراه مرة أخرى!

### الخطوة 5: تحديث Configuration

عدّل `functions/vendoor-scraper-v2/appwrite.json`:

```json
{
  "projectId": "65abc123def456",  // من Console
  "projectName": "EgyGo",
  "functions": [
    {
      "$id": "vendoor-scraper-v2",
      "name": "Vendoor Scraper V2",
      "runtime": "node-18.0",
      "execute": ["any"],
      "events": [],
      "schedule": "",
      "timeout": 900,
      "enabled": true,
      "logging": true,
      "entrypoint": "src/main.js",
      "commands": "npm install",
      "path": "functions/vendoor-scraper-v2",
      "vars": {
        "APPWRITE_ENDPOINT": "https://cloud.appwrite.io/v1",
        "APPWRITE_API_KEY": "your_api_key_here",
        "VENDOOR_BUCKET_ID": "vendoor-exports"
      }
    }
  ]
}
```

### الخطوة 6: Deploy Function

```bash
cd functions/vendoor-scraper-v2
npm install
appwrite deploy function
```

انتظر حتى ترى:
```
✅ Function deployed successfully
✅ Function ID: vendoor-scraper-v2
```

---

## 🧪 الاختبار

### Test 1: عبر Appwrite Console

1. افتح Functions → Vendoor Scraper V2
2. تبويب **Execute**
3. Body:
   ```json
   {
     "email": "your@email.com",
     "password": "your_password",
     "maxPages": 2,
     "operation": "scrape"
   }
   ```
4. اضغط **Execute**
5. شاهد النتائج في **Executions**

### Test 2: عبر cURL

```bash
curl -X POST \
  'https://cloud.appwrite.io/v1/functions/vendoor-scraper-v2/executions' \
  -H 'Content-Type: application/json' \
  -H 'X-Appwrite-Project: YOUR_PROJECT_ID' \
  -H 'X-Appwrite-Key: YOUR_API_KEY' \
  -d '{
    "email": "your@email.com",
    "password": "your_password",
    "maxPages": 2,
    "operation": "scrape"
  }'
```

### Test 3: عبر Express API

أضف في `server/index.ts`:

```typescript
import { Client, Functions } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const functions = new Functions(client);

app.post('/api/vendoor/scrape-function', async (req, res) => {
  try {
    const { email, password, maxPages } = req.body;
    
    const execution = await functions.createExecution(
      'vendoor-scraper-v2',
      JSON.stringify({
        email,
        password,
        maxPages: maxPages || 10,
        operation: 'scrape'
      })
    );
    
    res.json({
      success: true,
      executionId: execution.$id,
      status: execution.status,
      message: 'Scraping started'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Check execution status
app.get('/api/vendoor/execution/:id', async (req, res) => {
  try {
    const execution = await functions.getExecution(
      'vendoor-scraper-v2',
      req.params.id
    );
    
    res.json({
      status: execution.status,
      response: execution.response ? JSON.parse(execution.response) : null,
      logs: execution.logs,
      errors: execution.errors
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

ثم اختبر:

```bash
curl -X POST http://localhost:5000/api/vendoor/scrape-function \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "your@email.com",
    "password": "your_password",
    "maxPages": 2
  }'
```

---

## 📊 المراقبة والصيانة

### عرض Logs:

```bash
appwrite functions listExecutions \
  --functionId vendoor-scraper-v2
```

### عرض execution محدد:

```bash
appwrite functions getExecution \
  --functionId vendoor-scraper-v2 \
  --executionId EXECUTION_ID
```

### تحديث Function:

بعد تعديل الكود:

```bash
cd functions/vendoor-scraper-v2
appwrite deploy function
```

---

## 🔧 Troubleshooting

### خطأ: "Function not found"
```bash
# تأكد من الـ Function ID
appwrite functions list
```

### خطأ: "Permission denied"
```bash
# تحقق من API Key scopes
# يجب أن يحتوي على: functions.write, storage.write
```

### خطأ: "Bucket not found"
```bash
# تحقق من Bucket ID
appwrite storage listBuckets
```

### خطأ: "Timeout"
```bash
# زد الـ timeout في appwrite.json:
"timeout": 900  # 15 minutes
```

### خطأ: "Out of memory"
```bash
# زد الذاكرة:
"memory": 4096  # 4GB
```

---

## 💰 التكلفة (Appwrite Cloud)

### Free Tier:
- ✅ 750,000 executions/month
- ✅ 2GB storage
- ✅ 10GB bandwidth

### Pro Plan ($15/month):
- ✅ 3,750,000 executions/month
- ✅ 150GB storage
- ✅ 300GB bandwidth

### لمشروع EgyGo:
إذا كنت تسكرب **مرة واحدة يومياً**:
- Executions: 30/month
- Storage: ~50MB/month
- Bandwidth: ~50MB/month

**النتيجة**: Free Tier أكثر من كافٍ! ✅

---

## 🎯 الخطوات التالية

### 1. إنشاء صفحة Admin UI

```typescript
// client/pages/admin/VendoorScraperPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VendoorScraperPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vendoor/scrape-function', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'your@email.com',
          password: 'password',
          maxPages: 10
        })
      });
      const data = await response.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1>Vendoor Scraper</h1>
      <Button onClick={handleScrape} disabled={loading}>
        {loading ? 'Scraping...' : 'Start Scraping'}
      </Button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

### 2. جدولة تلقائية (Cron)

في `appwrite.json`:
```json
{
  "schedule": "0 2 * * *",  // كل يوم الساعة 2 صباحاً
  "vars": {
    "AUTO_SCRAPE_EMAIL": "your@email.com",
    "AUTO_SCRAPE_PASSWORD": "encrypted_password"
  }
}
```

### 3. Webhooks للإشعارات

```typescript
// في الـ function
if (allProducts.length > 0) {
  // أرسل webhook
  await fetch('https://egygo.me/api/webhooks/scraping-complete', {
    method: 'POST',
    body: JSON.stringify({
      totalProducts: allProducts.length,
      fileId: file.$id
    })
  });
}
```

---

## ✅ Checklist

- [ ] تثبيت Appwrite CLI
- [ ] تسجيل الدخول
- [ ] إنشاء Storage Bucket (`vendoor-exports`)
- [ ] إنشاء API Key
- [ ] تحديث `appwrite.json`
- [ ] Deploy Function
- [ ] اختبار عبر Console
- [ ] اختبار عبر API
- [ ] إنشاء Admin UI
- [ ] مراقبة Logs

---

## 🎊 النجاح!

إذا رأيت في Logs:
```
✅ Login successful
✅ Found 15 products on page 1
✅ Found 15 products on page 2
📦 Total products scraped: 30
💾 Saving to storage: vendoor_products_2025-10-27.json
✅ File saved: 65xyz...
```

**تهانينا! Function تعمل بنجاح! 🎉**

---

## 📞 الدعم

### مشاكل؟
1. راجع Logs في Console
2. تحقق من Environment Variables
3. تأكد من Permissions
4. راجع [Appwrite Docs](https://appwrite.io/docs)

### تحسينات مستقبلية:
- [ ] إضافة تقدم حي (WebSocket)
- [ ] جدولة تلقائية
- [ ] إشعارات Email/SMS
- [ ] تحليلات وإحصائيات
- [ ] Rate limiting ذكي

**جاهز للإنتاج! 🚀**
