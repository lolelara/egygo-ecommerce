# 🚀 Facebook Login - دليل البدء السريع

## ✅ **ما تم إنجازه:**

```
✅ FacebookLoginButton.tsx - زر تسجيل الدخول
✅ AuthCallback.tsx - صفحة معالجة الـ callback
✅ تحديث App.tsx - إضافة route
✅ تحديث Login.tsx - إضافة الزر
✅ FACEBOOK_LOGIN_SETUP.md - دليل شامل
```

---

## 📋 **الخطوات التالية (يجب عليك القيام بها):**

### **1. في Facebook App Dashboard:**

#### **أ. احصل على App ID و App Secret:**
```
1. اذهب إلى: https://developers.facebook.com/apps/
2. اختر تطبيقك
3. Settings → Basic
4. انسخ:
   - App ID
   - App Secret (اضغط "Show" لإظهاره)
```

#### **ب. أضف Redirect URIs:**
```
1. Products → Facebook Login → Settings
2. Valid OAuth Redirect URIs:
   
   أضف هذه الـ URLs:
   ✅ http://localhost:5173/auth/callback
   ✅ http://localhost:5173
   ✅ https://yourdomain.com/auth/callback (للإنتاج)
   
3. احفظ التغييرات
```

#### **ج. أضف App Domains:**
```
1. Settings → Basic
2. App Domains:
   ✅ localhost
   ✅ yourdomain.com (للإنتاج)
```

---

### **2. في Appwrite Console:**

```
1. اذهب إلى: https://cloud.appwrite.io/console
2. اختر مشروعك
3. Auth → Settings
4. OAuth2 Providers → Facebook
5. أدخل:
   - App ID: [من Facebook]
   - App Secret: [من Facebook]
6. Enable: ✅
7. احفظ
```

#### **انسخ Appwrite Redirect URL:**
```
من Appwrite Console:
https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/facebook/68d8b9db00134c41e7c8

ضعه في Facebook App:
Products → Facebook Login → Settings → Valid OAuth Redirect URIs
```

---

### **3. تحديث .env:**

```env
# أضف هذه السطور في ملف .env
VITE_FACEBOOK_APP_ID=your_app_id_here
VITE_FACEBOOK_APP_SECRET=your_app_secret_here
```

---

## 🧪 **اختبار التكامل:**

### **1. شغّل المشروع:**
```bash
npm run dev
```

### **2. افتح المتصفح:**
```
http://localhost:5173/login
```

### **3. اضغط زر "تسجيل الدخول بـ Facebook":**
```
✅ سيفتح نافذة Facebook
✅ سجل الدخول بحساب Facebook
✅ وافق على الصلاحيات
✅ سيتم التحويل إلى /auth/callback
✅ ثم إلى الصفحة الرئيسية
```

---

## 🔍 **التحقق من النجاح:**

### **في Console (F12):**
```javascript
✅ User logged in: { $id: '...', name: '...', email: '...' }
✅ User preferences created
✅ Notification created
```

### **في Appwrite Console:**
```
✅ Auth → Users → يظهر المستخدم الجديد
✅ Database → userPreferences → يظهر السجل
✅ Database → notifications → يظهر الإشعار
```

---

## ⚠️ **مشاكل شائعة وحلولها:**

### **1. "URL Blocked: This redirect failed":**
```
✅ تأكد من إضافة Redirect URI في Facebook App
✅ تأكد من مطابقة URL بالضبط
✅ تأكد من إضافة Domain في App Domains
```

### **2. "App Not Setup: This app is still in development mode":**
```
✅ أضف نفسك كـ Test User:
   Roles → Test Users → Add Test Users
✅ أو انشر التطبيق (يتطلب App Review)
```

### **3. "Invalid OAuth Redirect URI":**
```
✅ تأكد من إضافة Appwrite Redirect URL في Facebook
✅ انسخه من Appwrite Console بالضبط
```

---

## 📚 **للمزيد من التفاصيل:**

اقرأ الدليل الشامل:
```
FACEBOOK_LOGIN_SETUP.md
```

يحتوي على:
- ✅ شرح مفصل لكل خطوة
- ✅ أمثلة كود كاملة
- ✅ متطلبات App Review
- ✅ Business Verification
- ✅ حل جميع المشاكل المحتملة

---

## 🎯 **الخلاصة:**

### **ما تم:**
```
✅ الكود جاهز 100%
✅ الزر موجود في صفحة Login
✅ صفحة Callback جاهزة
✅ Route مضاف
```

### **ما تحتاجه:**
```
1. ⏳ App ID و App Secret من Facebook
2. ⏳ إضافة Redirect URIs في Facebook
3. ⏳ إعداد OAuth في Appwrite
4. ⏳ تحديث .env
5. ✅ اختبار!
```

---

**🎊 بعد إكمال الخطوات أعلاه، سيعمل تسجيل الدخول بـ Facebook بشكل كامل!**
