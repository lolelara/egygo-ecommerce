# 🔧 إصلاح Gemini API Error (403)

## المشكلة
```
[403] Method doesn't allow unregistered callers (callers without established identity)
```

## السبب
الـ API Key موجود في `.env` لكن **غير مفعّل** في Google Cloud Console.

## ✅ الحل - خطوات التفعيل

### 1. افتح Google AI Studio
🔗 https://aistudio.google.com/app/apikey

### 2. تحقق من الـ API Key
- افتح API Key: `AIzaSyAf5Ie5bq9snBYY4xG_AwKLiaRHN8tQx7A`
- أو **أنشئ API Key جديد** إذا كان القديم مش شغال

### 3. Enable Gemini API
🔗 https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com

**خطوات التفعيل:**
1. اختار المشروع الخاص بيك
2. اضغط **"Enable"** أو **"تمكين"**
3. استنى شوية لحد ما يخلص التفعيل

### 4. تحقق من API Restrictions
في Google Cloud Console:
1. اذهب إلى **APIs & Services** → **Credentials**
2. اختار الـ API Key بتاعك
3. تأكد إن **"API restrictions"** تحتوي على:
   - ✅ Generative Language API

### 5. بدل الـ API Key (إذا لزم الأمر)
إذا استمرت المشكلة، أنشئ API Key جديد:

```bash
# افتح .env
notepad .env
```

غير السطر ده:
```env
VITE_GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

### 6. أعد تشغيل المشروع
```powershell
# أوقف السيرفر الحالي
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# ابدأ من جديد
pnpm dev
```

## 📝 ملاحظات مهمة

### حدود الـ Free Tier
- **60 requests per minute**
- **1,500 requests per day**
- مجاني تماماً!

### إذا فشل التفعيل
1. تأكد إن عندك Google Account مفعّل
2. تأكد إن المشروع في Google Cloud مش معلّق
3. جرب تعمل API Key جديد

### اختبار الـ API
بعد التفعيل، جرب الشات في الموقع:
1. افتح https://egygo-ecommerce.appwrite.network
2. اضغط على أيقونة الشات (💬)
3. اكتب رسالة واستنى الرد

## ✅ علامات النجاح
- ✅ لا توجد أخطاء 403 في Console
- ✅ الـ AI Assistant يرد على رسائلك
- ✅ الردود تكون باللهجة المصرية

---

**التحديث:** يناير 2025  
**الحالة:** جاهز للتطبيق
