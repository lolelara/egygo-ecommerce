# 🎯 دليل البدء السريع: Appwrite Functions

## ⚡ الخطوات (اتبعها بالترتيب)

### ✅ الخطوة 1: تسجيل الدخول

افتح PowerShell في المجلد الحالي واكتب:

```powershell
appwrite login
```

**أدخل:**
- ✅ Endpoint: `https://fra.cloud.appwrite.io/v1` (اضغط Enter)
- ✅ Email: بريدك الإلكتروني في Appwrite
- ✅ Password: كلمة المرور

**النتيجة المتوقعة:**
```
✓ Success
```

---

### ✅ الخطوة 2: إنشاء Function في Appwrite Console

1. افتح الرابط: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/functions

2. اضغط الزر الأزرق **"Create function"**

3. املأ النموذج:

| الحقل | القيمة |
|------|--------|
| **Name** | `Vendoor Scraper` |
| **Function ID** | `vendoor-scraper` |
| **Runtime** | `Node (18.0)` |
| **Execute Access** | `Any` |
| **Timeout (seconds)** | `900` |

4. اضغط **"Create"**

5. **⚠️ انسخ Function ID** من الصفحة (ستحتاجه لاحقاً)

---

### ✅ الخطوة 3: إضافة Environment Variables

في صفحة Function الجديدة:

1. اضغط تبويب **"Settings"**
2. مرر لأسفل إلى **"Variables"**
3. اضغط **"Add Variable"**

أضف المتغيرات التالية:

**المتغير الأول:**
```
Key: VENDOOR_EMAIL
Value: almlmibrahym574@gmail.com
```
اضغط **"Add"**

**المتغير الثاني:**
```
Key: VENDOOR_PASSWORD
Value: hema2004
```
✅ **فعّل "Encrypt"** لكلمة المرور!
اضغط **"Add"**

---

### ✅ الخطوة 4: نشر Function

في PowerShell:

```powershell
cd functions/vendoor-scraper
appwrite deploy function
```

**أجب على الأسئلة:**

```
? Which function would you like to deploy?
> vendoor-scraper  (اختر هذا)

? Would you like to proceed with the deployment?
> Yes  (اختر نعم)
```

**انتظر...** (قد يستغرق 2-3 دقائق)

**النتيجة المتوقعة:**
```
✓ Function vendoor-scraper deployed successfully
```

---

### ✅ الخطوة 5: اختبار Function

#### اختبار من Console:

1. ارجع لصفحة Function في Console
2. اضغط تبويب **"Execute"**
3. في حقل **"Body"** أدخل:

```json
{
  "action": "scrape-page",
  "page": 1
}
```

4. اضغط **"Execute now"**
5. انتظر النتيجة (30 ثانية تقريباً)

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "page": 1,
  "totalProducts": 15,
  "products": [...]
}
```

#### اختبار من Terminal:

```powershell
# استبدل FUNCTION_ID بالـ ID الحقيقي
appwrite functions createExecution `
  --functionId vendoor-scraper `
  --body "{\"action\":\"scrape-page\",\"page\":1}" `
  --async false
```

---

### ✅ الخطوة 6: الحصول على Function URL

Function ID ستحتاجه في التطبيق:

```powershell
appwrite functions list
```

ابحث عن `vendoor-scraper` واحفظ الـ `$id`

**مثال:**
```
$id: 67623abc123def456
```

---

## 📱 تحديث التطبيق

الآن سأحدث `VendoorImport.tsx` لاستخدام Function...

افتح ملف `.env` وأضف:

```env
VITE_APPWRITE_VENDOOR_FUNCTION_ID=67623abc123def456
```

(استبدل بالـ ID الحقيقي من الخطوة 6)

---

## 🐛 حل المشاكل الشائعة

### ❌ "Error: Invalid credentials"

**السبب:** بيانات تسجيل الدخول خاطئة

**الحل:**
```powershell
appwrite logout
appwrite login
```

---

### ❌ "Function not found"

**السبب:** Function غير موجودة أو ID خاطئ

**الحل:**
```powershell
appwrite functions list
```
تأكد من وجود `vendoor-scraper`

---

### ❌ "Execution timeout"

**السبب:** Timeout قصير أو الموقع بطيء

**الحل:**
1. تأكد أن Timeout = 900 ثانية
2. جرب صفحة واحدة أولاً: `"action": "scrape-page", "page": 1`

---

### ❌ "Puppeteer error: Failed to launch browser"

**السبب:** Puppeteer يحتاج dependencies إضافية

**الحل:** ✅ Appwrite Cloud يوفر كل المتطلبات تلقائياً!
إذا استمرت المشكلة، تواصل مع دعم Appwrite.

---

## 📊 مراقبة Function

### من Console:

1. افتح Function في Console
2. **Executions** → شاهد كل execution
3. اضغط على execution معين لرؤية:
   - Status (completed/failed)
   - Response
   - Logs
   - Duration

### من Terminal:

```powershell
# عرض آخر Executions
appwrite functions listExecutions --functionId vendoor-scraper

# عرض تفاصيل execution معين
appwrite functions getExecution `
  --functionId vendoor-scraper `
  --executionId EXECUTION_ID
```

---

## ✅ الخطوات التالية

1. ✅ نشر Function (أكملناها!)
2. ⏭️ اختبار scrape-page (صفحة واحدة)
3. ⏭️ اختبار scrape-all (كل الصفحات)  
4. ⏭️ تحديث VendoorImport.tsx
5. ⏭️ نشر التطبيق على Production

---

## 💡 نصائح

### ✅ افعل:
- اختبر `scrape-page` أولاً (أسرع)
- راقب الـ Logs في Console
- استخدم Variables للـ credentials

### ❌ لا تفعل:
- لا تضع credentials في الكود
- لا تنشر بدون اختبار محلي
- لا تنسى Encrypt للـ password

---

## 🎉 مبروك!

الآن Function جاهزة!

**الخطوة القادمة:** تحديث VendoorImport.tsx

راجع: `INTEGRATE_WITH_APP.md`
