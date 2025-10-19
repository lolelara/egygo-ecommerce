# 🔗 Facebook App - مرجع الروابط السريع

## 📋 **الروابط المطلوبة في Facebook App Dashboard:**

---

## 1️⃣ **Privacy Policy URL**

### **للتطوير (Development):**
```
http://localhost:5173/#/privacy
```

### **للإنتاج (Production):**
```
https://yourdomain.com/#/privacy
```

**📍 أين تضعه:**
```
Facebook App Dashboard → Settings → Basic → Privacy Policy URL
```

---

## 2️⃣ **Terms of Service URL**

### **للتطوير (Development):**
```
http://localhost:5173/#/terms
```

### **للإنتاج (Production):**
```
https://yourdomain.com/#/terms
```

**📍 أين تضعه:**
```
Facebook App Dashboard → Settings → Basic → Terms of Service URL
```

---

## 3️⃣ **Valid OAuth Redirect URIs**

### **للتطوير (Development):**
```
http://localhost:5173/auth/callback
http://localhost:5173
```

### **Appwrite Redirect (مهم جداً!):**
```
https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/facebook/68d8b9db00134c41e7c8
```

### **للإنتاج (Production):**
```
https://yourdomain.com/auth/callback
https://yourdomain.com
```

**📍 أين تضعه:**
```
Facebook App Dashboard → Products → Facebook Login → Settings → Valid OAuth Redirect URIs
```

---

## 4️⃣ **App Domains**

### **للتطوير:**
```
localhost
```

### **للإنتاج:**
```
yourdomain.com
```

**📍 أين تضعه:**
```
Facebook App Dashboard → Settings → Basic → App Domains
```

---

## 📝 **نموذج إعداد Facebook App:**

### **Settings → Basic:**
```
App Name: EgyGo E-commerce
App Domains: localhost, yourdomain.com
Privacy Policy URL: http://localhost:5173/#/privacy
Terms of Service URL: http://localhost:5173/#/terms
```

### **Products → Facebook Login → Settings:**
```
Valid OAuth Redirect URIs:
  ✅ http://localhost:5173/auth/callback
  ✅ http://localhost:5173
  ✅ https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/facebook/68d8b9db00134c41e7c8
  ✅ https://yourdomain.com/auth/callback (للإنتاج)
  ✅ https://yourdomain.com (للإنتاج)
```

---

## 🎯 **Checklist - تأكد من إضافة:**

```
✅ Privacy Policy URL في Basic Settings
✅ Terms of Service URL في Basic Settings
✅ App Domains (localhost)
✅ OAuth Redirect URIs (3 روابط على الأقل)
✅ Appwrite Redirect URL (الأهم!)
```

---

## 🔍 **التحقق من الإعداد:**

### **1. Privacy Policy:**
```bash
# افتح في المتصفح:
http://localhost:5173/#/privacy

# يجب أن تظهر صفحة Privacy Policy
```

### **2. Terms of Service:**
```bash
# افتح في المتصفح:
http://localhost:5173/#/terms

# يجب أن تظهر صفحة Terms of Service
```

### **3. OAuth Callback:**
```bash
# بعد تسجيل الدخول بـ Facebook:
# يجب أن يحول إلى:
http://localhost:5173/auth/callback

# ثم إلى الصفحة الرئيسية
```

---

## 📌 **ملاحظات مهمة:**

### **1. HashRouter (#):**
```
⚠️ المشروع يستخدم HashRouter
⚠️ لذلك الروابط تحتوي على #
⚠️ مثال: /#/privacy بدلاً من /privacy
```

### **2. Appwrite Redirect:**
```
✅ هذا الرابط الأهم!
✅ بدونه لن يعمل Facebook Login
✅ انسخه بالضبط من Appwrite Console
```

### **3. للإنتاج:**
```
⚠️ غيّر localhost إلى domain الحقيقي
⚠️ استخدم HTTPS (مطلوب من Facebook)
⚠️ مثال: https://egygo.com/#/privacy
```

---

## 🚀 **خطوات سريعة:**

```
1. ✅ افتح Facebook App Dashboard
2. ✅ Settings → Basic
3. ✅ أضف Privacy Policy URL: http://localhost:5173/#/privacy
4. ✅ أضف Terms of Service URL: http://localhost:5173/#/terms
5. ✅ أضف App Domains: localhost
6. ✅ احفظ التغييرات
7. ✅ Products → Facebook Login → Settings
8. ✅ أضف OAuth Redirect URIs (3 روابط)
9. ✅ احفظ التغييرات
10. ✅ اختبر!
```

---

## 📚 **روابط مفيدة:**

### **Facebook:**
```
Dashboard: https://developers.facebook.com/apps/
Docs: https://developers.facebook.com/docs/facebook-login
```

### **Appwrite:**
```
Console: https://cloud.appwrite.io/console
Docs: https://appwrite.io/docs/products/auth/oauth2
```

### **موقعك:**
```
Privacy: http://localhost:5173/#/privacy
Terms: http://localhost:5173/#/terms
Login: http://localhost:5173/#/login
```

---

**✅ بعد إضافة هذه الروابط، سيكون Facebook App جاهزاً للاختبار!**
