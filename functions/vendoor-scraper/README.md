# Vendoor Scraper - Appwrite Function

Appwrite Function لجلب منتجات Ven-door باستخدام Puppeteer.

## 🚀 الإعداد السريع

### 1. إنشاء Function في Appwrite Console

1. اذهب إلى [Appwrite Console](https://cloud.appwrite.io)
2. افتح مشروعك: `egygo-ecommerce`
3. Functions → Create Function
4. املأ:
   - Name: `vendoor-scraper`
   - Runtime: `Node.js 18.0`
   - Timeout: `900` (15 دقيقة)
   - Execute Access: `Any`

### 2. تثبيت Appwrite CLI

```powershell
npm install -g appwrite
```

### 3. تسجيل الدخول

```powershell
appwrite login
```

### 4. ربط Function

```powershell
cd functions/vendoor-scraper
appwrite init function
```

### 5. نشر Function

```powershell
appwrite deploy function
```

---

## 📡 الاستخدام

### من Client (React):

```typescript
// استدعاء Function
const response = await fetch(
  `${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID
    },
    body: JSON.stringify({
      action: 'scrape-all' // أو 'scrape-page'
    })
  }
);

const execution = await response.json();

// انتظار النتيجة (polling)
while (true) {
  await new Promise(r => setTimeout(r, 5000));
  
  const result = await fetch(
    `${APPWRITE_ENDPOINT}/functions/${FUNCTION_ID}/executions/${execution.$id}`,
    {
      headers: { 'X-Appwrite-Project': PROJECT_ID }
    }
  );
  
  const data = await result.json();
  
  if (data.status === 'completed') {
    const products = JSON.parse(data.responseBody);
    break;
  }
}
```

---

## 🧪 الاختبار المحلي

```powershell
cd functions/vendoor-scraper
node test.js
```

---

## ⚙️ Environment Variables

أضف في Appwrite Console → Functions → vendoor-scraper → Settings → Variables:

```
VENDOOR_EMAIL=almlmibrahym574@gmail.com
VENDOOR_PASSWORD=hema2004
```

---

## 📊 Actions المدعومة

### 1. scrape-all
جلب جميع المنتجات (41 صفحة)

```json
{
  "action": "scrape-all"
}
```

### 2. scrape-page
جلب صفحة واحدة

```json
{
  "action": "scrape-page",
  "page": 5
}
```

---

## 💰 التكلفة

**مجاني تماماً!**
- 3M executions/شهر مجاناً
- مشروعك يحتاج ~300 execution/شهر

---

## 📞 الدعم

راجع `APPWRITE_FUNCTIONS_SOLUTION.md` للتفاصيل الكاملة.
