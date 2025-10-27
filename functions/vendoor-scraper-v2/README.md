# 🚀 Vendoor Scraper V2 - Appwrite Function

## 📋 نظرة عامة

Appwrite Serverless Function لسكرابينج منتجات Vendoor وحفظها تلقائياً في Storage.

### المميزات:
- ✅ **بناء مستقل** - لا ضغط على السيرفر الرئيسي
- ✅ **Chromium Optimized** - استخدام @sparticuz/chromium للأداء
- ✅ **Auto-Save** - حفظ تلقائي في Appwrite Storage
- ✅ **Serverless** - لا حاجة لصيانة سيرفر
- ✅ **Scalable** - يتوسع تلقائياً حسب الحاجة
- ✅ **15 دقيقة timeout** - وقت كافٍ لـ 41 صفحة

---

## 🔧 التثبيت

### 1. المتطلبات:
```bash
npm install -g appwrite-cli
```

### 2. Login to Appwrite:
```bash
appwrite login
```

### 3. إنشاء Bucket للتخزين:

في Appwrite Console:
1. افتح **Storage**
2. اضغط **Create Bucket**
3. Bucket ID: `vendoor-exports`
4. Name: `Vendoor Exports`
5. Permissions: 
   - Read: `any` (للقراءة العامة)
   - Create: `users` (فقط المستخدمين المسجلين)

### 4. تحديث appwrite.json:

عدّل `appwrite.json`:
```json
{
  "projectId": "YOUR_ACTUAL_PROJECT_ID",
  "vars": {
    "APPWRITE_ENDPOINT": "https://cloud.appwrite.io/v1",
    "APPWRITE_API_KEY": "YOUR_API_KEY_HERE",
    "VENDOOR_BUCKET_ID": "vendoor-exports"
  }
}
```

### 5. Deploy Function:

```bash
cd functions/vendoor-scraper-v2
appwrite deploy function
```

---

## 📡 الاستخدام

### **1. بدء السكرابينج:**

```bash
POST https://cloud.appwrite.io/v1/functions/vendoor-scraper-v2/executions
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "your_password",
  "maxPages": 10,
  "operation": "scrape"
}
```

### **2. عرض الملفات:**

```bash
POST https://cloud.appwrite.io/v1/functions/vendoor-scraper-v2/executions
Content-Type: application/json

{
  "operation": "files"
}
```

---

## 🔗 الربط مع Express API

### في `server/index.ts`:

```typescript
import { Client, Functions } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const functions = new Functions(client);

// Route للسكرابينج
app.post('/api/vendoor/scrape-serverless', async (req, res) => {
  try {
    const { email, password, maxPages } = req.body;
    
    const execution = await functions.createExecution(
      'vendoor-scraper-v2',
      JSON.stringify({
        email,
        password,
        maxPages,
        operation: 'scrape'
      })
    );
    
    res.json({
      success: true,
      executionId: execution.$id,
      message: 'Scraping started in background'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route لعرض الملفات
app.get('/api/vendoor/files-serverless', async (req, res) => {
  try {
    const execution = await functions.createExecution(
      'vendoor-scraper-v2',
      JSON.stringify({ operation: 'files' })
    );
    
    // انتظر حتى تنتهي
    let result = execution;
    while (result.status === 'waiting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await functions.getExecution('vendoor-scraper-v2', result.$id);
    }
    
    const data = JSON.parse(result.response);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📊 المراقبة

### عبر Appwrite Console:
1. افتح **Functions**
2. اختر `Vendoor Scraper V2`
3. تبويب **Executions**
4. شاهد:
   - الحالة (Success/Failed)
   - الوقت المستغرق
   - Logs
   - النتائج

### عبر API:
```bash
GET https://cloud.appwrite.io/v1/functions/vendoor-scraper-v2/executions/{executionId}
```

---

## 🐛 استكشاف الأخطاء

### خطأ: "Chromium failed to start"
```bash
# زد الذاكرة في appwrite.json:
"timeout": 900,
"memory": 4096
```

### خطأ: "Login failed"
- تحقق من البريد وكلمة المرور
- جرّب تسجيل الدخول يدوياً على vendoor.com

### خطأ: "Storage permission denied"
- تحقق من صلاحيات الـ Bucket
- تأكد من `VENDOOR_BUCKET_ID` صحيح

### Timeout:
```json
{
  "maxPages": 5,  // قلل عدد الصفحات
  "timeout": 900  // 15 دقيقة
}
```

---

## 🔒 الأمان

### Environment Variables (مطلوبة):
```bash
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_API_KEY=your_api_key_here
VENDOOR_BUCKET_ID=vendoor-exports
```

### صلاحيات Function:
- `functions.write` - لتشغيل Function
- `storage.write` - للحفظ في Storage

### Best Practices:
1. ✅ لا تحفظ credentials في الكود
2. ✅ استخدم Environment Variables
3. ✅ قيّد الصلاحيات حسب الحاجة
4. ✅ مراقبة Logs بانتظام

---

## ⚡ الأداء

### الموارد المطلوبة:
```json
{
  "timeout": 900,      // 15 دقيقة
  "memory": 2048,      // 2GB RAM
  "runtime": "node-18.0"
}
```

### السرعة المتوقعة:
| الصفحات | الوقت | المنتجات |
|---------|-------|-----------|
| 10 صفحات | ~2 دقيقة | ~150 منتج |
| 20 صفحة | ~4 دقائق | ~300 منتج |
| 41 صفحة | ~8 دقائق | ~600 منتج |

### التكلفة (Appwrite Cloud):
- Free Tier: 750,000 executions/month
- Pro: $0.0000015 per execution

---

## 📝 مثال شامل

### Client Side (React):

```typescript
// في صفحة Admin
const handleScrape = async () => {
  setLoading(true);
  
  try {
    const response = await fetch('/api/vendoor/scrape-serverless', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: vendoorEmail,
        password: vendoorPassword,
        maxPages: 10
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('بدأ السكرابينج في الخلفية!');
      
      // راقب التقدم
      checkProgress(data.executionId);
    }
  } catch (error) {
    toast.error('فشل السكرابينج');
  } finally {
    setLoading(false);
  }
};

const checkProgress = async (executionId) => {
  const interval = setInterval(async () => {
    const response = await fetch(`/api/vendoor/execution/${executionId}`);
    const data = await response.json();
    
    if (data.status === 'completed') {
      clearInterval(interval);
      toast.success(`تم جلب ${data.totalProducts} منتج!`);
      
      // عرض ملفات النتائج
      fetchFiles();
    } else if (data.status === 'failed') {
      clearInterval(interval);
      toast.error('فشل السكرابينج');
    }
  }, 3000);
};
```

---

## 🎯 الخلاصة

### ✅ المزايا:
1. **لا ضغط على السيرفر** - يعمل بشكل مستقل
2. **Scalable** - يتوسع تلقائياً
3. **Serverless** - لا صيانة
4. **Cost-effective** - تدفع فقط عند الاستخدام
5. **Reliable** - Appwrite تدير كل شيء

### 📦 الملفات:
```
functions/vendoor-scraper-v2/
├── package.json           # Dependencies
├── appwrite.json          # Configuration
├── src/
│   └── main.js           # Function code
└── README.md             # هذا الملف
```

### 🚀 Deploy:
```bash
cd functions/vendoor-scraper-v2
npm install
appwrite deploy function
```

**جاهز للاستخدام! 🎉**
