# 🚀 ابدأ الآن: Appwrite Functions للمبتدئين

## ⚡ الخطوات الأساسية (3 خطوات فقط!)

### 📍 **أنت هنا الآن:**
```
C:\Users\NoteBook\Desktop\goegy-main\functions\vendoor-scraper
```

---

## 🎯 الخطوة 1: تسجيل الدخول (دقيقة واحدة)

افتح PowerShell واكتب:

```powershell
appwrite login
```

**ستظهر لك أسئلة - أجب عليها:**

```
? Enter your email: 
> اكتب بريدك الإلكتروني في Appwrite

? Enter your password:
> اكتب كلمة المرور (لن تظهر أثناء الكتابة - هذا طبيعي!)

✓ Success
```

**✅ تمت بنجاح؟** انتقل للخطوة التالية!

---

## 🎯 الخطوة 2: إنشاء Function (3 دقائق)

### افتح الرابط:
https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/functions

### اضغط الزر الأزرق: **"Create function"**

### املأ النموذج:

```
┌─────────────────────────────────────────────┐
│ Name: Vendoor Scraper                       │
│ Function ID: vendoor-scraper                │
│ Runtime: Node (18.0) ▼                      │
│ Execute Access: Any ▼                       │
│ Timeout (seconds): 900                      │
│                                             │
│         [Create]  [Cancel]                  │
└─────────────────────────────────────────────┘
```

### اضغط **"Create"**

### أضف المتغيرات:

في صفحة Function → **Settings** → **Variables**:

```
Variable 1:
Key: VENDOOR_EMAIL
Value: almlmibrahym574@gmail.com
[Add]

Variable 2:
Key: VENDOOR_PASSWORD
Value: hema2004
☑ Encrypt (مهم!)
[Add]
```

**✅ تمت بنجاح؟** انتقل للخطوة النهائية!

---

## 🎯 الخطوة 3: نشر Function (2 دقيقة)

في PowerShell:

```powershell
cd functions/vendoor-scraper
appwrite deploy function
```

**ستظهر أسئلة:**

```
? Which function would you like to deploy?
> vendoor-scraper ← اختر هذا

? Would you like to proceed with the deployment?
> Yes ← اختر نعم
```

**انتظر... (دقيقتين)**

```
Deploying function...
✓ Function deployed successfully
```

**🎉 مبروك! Function جاهزة!**

---

## 🧪 اختبار Function

### من Console:

1. ارجع لصفحة Function
2. تبويب **"Execute"**
3. في Body أدخل:

```json
{
  "action": "scrape-page",
  "page": 1
}
```

4. اضغط **"Execute now"**
5. انتظر النتيجة (30 ثانية)

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "page": 1,
  "totalProducts": 15,
  "products": [...]
}
```

**✅ عمل بنجاح؟** Function جاهزة للاستخدام!

---

## 📱 دمج مع التطبيق

### 1. احصل على Function ID:

```powershell
appwrite functions list
```

ابحث عن `vendoor-scraper` وانسخ الـ `$id`

### 2. أضفه في `.env`:

```env
VITE_APPWRITE_VENDOOR_FUNCTION_ID=your_function_id_here
```

### 3. راجع الدليل الكامل:
`INTEGRATE_WITH_APP.md`

---

## 🐛 مشاكل شائعة؟

### ❌ "Error: Invalid credentials"

**الحل:**
```powershell
appwrite logout
appwrite login
```

---

### ❌ "Function not found"

**السبب:** لم تنشئ Function في Console

**الحل:** ارجع للخطوة 2

---

### ❌ "Deploy failed"

**الحل:**
```powershell
# تأكد أنك في المجلد الصحيح
cd functions/vendoor-scraper

# أعد المحاولة
appwrite deploy function
```

---

## 📚 الأدلة المتاحة

| الملف | الموضوع |
|------|---------|
| **QUICK_START.md** | دليل مفصل مع صور |
| **DEPLOYMENT.md** | شرح النشر |
| **INTEGRATE_WITH_APP.md** | دمج مع React |
| **README.md** | نظرة عامة |

---

## 💡 نصائح

✅ **افعل:**
- اختبر في Console أولاً
- راقب الـ Logs
- استخدم Variables للـ credentials

❌ **لا تفعل:**
- لا تضع password في الكود
- لا تنسى Encrypt للـ password
- لا تنشر بدون اختبار

---

## ✅ الخطوات التالية

1. ✅ نشر Function (أكملت!)
2. ⏭️ اختبار Function
3. ⏭️ دمج مع التطبيق
4. ⏭️ نشر Production

---

## 🆘 تحتاج مساعدة؟

**راجع:**
- `QUICK_START.md` - دليل مفصل
- [Appwrite Docs](https://appwrite.io/docs/functions)
- [Appwrite Discord](https://discord.gg/GSeTUeA)

---

**🚀 ابدأ الآن من الخطوة 1!**
