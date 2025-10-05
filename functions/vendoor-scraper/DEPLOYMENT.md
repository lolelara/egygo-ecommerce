# 🚀 دليل نشر Vendoor Scraper على Appwrite Functions

## ✅ الخطوات (10 دقائق)

### 1️⃣ تسجيل الدخول إلى Appwrite CLI

```powershell
appwrite login
```

**ستحتاج:**
- Endpoint: `https://fra.cloud.appwrite.io/v1`
- Email: بريدك الإلكتروني في Appwrite
- Password: كلمة المرور

---

### 2️⃣ إنشاء Function في Appwrite Console

1. افتح [Appwrite Console](https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/functions)
2. اضغط **Create Function**
3. املأ البيانات:

```
Name: Vendoor Scraper
Function ID: vendoor-scraper
Runtime: Node.js 18.0
Execute Access: Any (أو Users إذا تريد Auth)
Events: (اتركها فارغة)
Schedule: (اتركها فارغة)
Timeout: 900 (15 دقيقة)
```

4. اضغط **Create**

---

### 3️⃣ إضافة Environment Variables

في صفحة Function → **Settings** → **Variables**:

```
VENDOOR_EMAIL = almlmibrahym574@gmail.com
VENDOOR_PASSWORD = hema2004
```

**⚠️ مهم:** استخدم Encrypt لكلمة المرور!

---

### 4️⃣ نشر Function

```powershell
cd functions/vendoor-scraper
appwrite deploy function
```

**اختر:**
- Which function?: `vendoor-scraper`
- Confirm?: `Yes`

---

### 5️⃣ اختبار Function

#### من Appwrite Console:

1. افتح Function في Console
2. اضغط **Execute**
3. أدخل في Body:

```json
{
  "action": "scrape-page",
  "page": 1
}
```

4. اضغط **Execute Now**
5. انتظر النتيجة (قد يستغرق 30 ثانية)

#### من Terminal:

```powershell
# جلب صفحة واحدة
appwrite functions createExecution `
  --functionId vendoor-scraper `
  --body '{\"action\":\"scrape-page\",\"page\":1}' `
  --async false
```

---

### 6️⃣ الحصول على Function ID

```powershell
appwrite functions list
```

ابحث عن `vendoor-scraper` واحفظ الـ `$id`

---

## 📡 الاستخدام من التطبيق

### تحديث VendoorImport.tsx

سأحدث الملف الآن لاستخدام Appwrite Function...

---

## 🐛 استكشاف الأخطاء

### خطأ: "Function not found"

**الحل:**
```powershell
appwrite functions list
```
تأكد أن Function موجودة.

### خطأ: "Authentication failed"

**الحل:**
```powershell
appwrite logout
appwrite login
```

### خطأ: "Timeout"

**الحل:**
- تأكد أن Timeout = 900 ثانية
- جرب `scrape-page` أولاً (أسرع)

---

## 📊 مراقبة Function

### من Console:
1. افتح Function
2. **Executions** → شاهد كل execution
3. **Logs** → شاهد console.log

### من CLI:
```powershell
# عرض آخر 25 execution
appwrite functions listExecutions --functionId vendoor-scraper

# عرض logs لـ execution معين
appwrite functions getExecution --functionId vendoor-scraper --executionId EXECUTION_ID
```

---

## ✅ الخطوات التالية

1. ✅ نشر Function
2. ✅ اختبار `scrape-page` (صفحة واحدة)
3. ✅ اختبار `scrape-all` (كل الصفحات)
4. ✅ تحديث VendoorImport.tsx
5. ✅ نشر التطبيق

---

**🎉 مبروك! Function جاهزة الآن!**
