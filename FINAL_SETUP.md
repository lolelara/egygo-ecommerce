# ✅ دليل الإعداد النهائي - إيجي جو

## 🎯 ملخص: كل شيء جاهز تقريباً!

تم الانتهاء من:
- ✅ تطوير الموقع الكامل
- ✅ ربط Appwrite Cloud
- ✅ إنشاء 7 Collections
- ✅ إنشاء Storage Bucket
- ✅ رفع على GitHub
- ✅ نشر على Appwrite Static Hosting
- ✅ تغيير اسم الموقع لـ "إيجي جو"
- ✅ تحسين الثيمات والألوان
- ✅ إضافة دعم OAuth (Google & Facebook)
- ✅ إنشاء سكريبت البيانات التجريبية

**يتبقى فقط**: الإعدادات النهائية في Appwrite Console

---

## 📋 الخطوات المتبقية (15 دقيقة)

### الخطوة 1: تفعيل Google OAuth (5 دقائق)

#### في Appwrite Console:
1. اذهب إلى [Appwrite Console](https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/auth)
2. **Auth** → **Settings** → ابحث عن **Google**
3. اضغط على Google وفعّله:
   - Status: ✅ **Enabled**
   - انسخ الـ **Redirect URI**

#### في Google Cloud Console:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Create Credentials** → **OAuth 2.0 Client ID**
3. **Application Type**: Web application
4. **Name**: Egygo Ecommerce
5. **Authorized redirect URIs**: الصق الـ URI من Appwrite
6. انسخ **Client ID** و **Client Secret**
7. ارجع لـ Appwrite والصقهم
8. اضغط **Update**

---

### الخطوة 2: تفعيل Facebook OAuth (5 دقائق)

#### في Appwrite Console:
1. في نفس الصفحة **Auth** → **Settings**
2. ابحث عن **Facebook** وفعّله
3. انسخ الـ **Redirect URI**

#### في Facebook Developers:
1. اذهب إلى [Facebook Developers](https://developers.facebook.com/apps)
2. **Create App** → **Consumer** → **Next**
3. **App Name**: Egygo Ecommerce
4. بعد الإنشاء: **Products** → أضف **Facebook Login**
5. **Settings** → **Basic**:
   - انسخ **App ID** و **App Secret**
   - **App Domains**: `egygo-ecommerce.appwrite.network`
6. **Facebook Login** → **Settings**:
   - **Valid OAuth Redirect URIs**: الصق URI من Appwrite
7. ارجع لـ Appwrite والصق البيانات
8. اضغط **Update**

---

### الخطوة 3: إنشاء حساب مدير (دقيقة واحدة)

#### في Appwrite Console:
1. اذهب إلى [Auth → Users](https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/auth/user)
2. اضغط **Create User**
3. املأ:
   ```
   Email: admin@egygo.com
   Password: Admin@Egygo2025!
   Name: مدير الموقع
   ```
4. اضغط **Create**
5. **اختياري**: أضف Label للصلاحيات:
   - Key: `role`
   - Value: `admin`

---

### الخطوة 4: إضافة البيانات التجريبية (3 دقائق)

#### الطريقة 1: يدوياً (سهلة)
في Appwrite Console → Databases → egygo:

**أضف 2-3 فئات في `categories`**:
```
الفئة 1: إلكترونيات
- name: إلكترونيات
- description: أجهزة إلكترونية وتقنية
- isActive: true

الفئة 2: ملابس
- name: ملابس  
- description: أزياء رجالية ونسائية
- isActive: true
```

**أضف 3-5 منتجات في `products`**:
```
المنتج 1:
- name: لابتوب Dell XPS 13
- description: لابتوب قوي للمحترفين
- price: 25000
- stock: 15
- categoryId: [انسخ ID فئة إلكترونيات]
- isActive: true
- isFeatured: true
- rating: 4.5
- reviewCount: 12
```

#### الطريقة 2: بالسكريبت (أسرع - 15 منتج)
1. افتح ملف `scripts/add-sample-data.mjs`
2. سطر 9: استبدل `YOUR_API_KEY_HERE` بـ API Key من Appwrite:
   - اذهب إلى [Settings → API Keys](https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/settings/keys)
   - أنشئ API Key جديد مع صلاحيات `databases.write`
3. في Terminal:
   ```powershell
   cd scripts
   node add-sample-data.mjs
   ```

---

### الخطوة 5: اختبار الموقع (دقيقة واحدة)

1. افتح الموقع: https://egygo-ecommerce.appwrite.network/
2. اضغط **Ctrl+Shift+R** لمسح الكاش
3. جرب:
   - ✅ التسجيل بالبريد
   - ✅ تسجيل الدخول بـ Google
   - ✅ تصفح المنتجات
   - ✅ إضافة منتج للسلة
   - ✅ تسجيل الدخول كمدير (admin@egygo.com)

---

## 🎉 انتهى!

بعد تنفيذ الخطوات أعلاه، موقعك **جاهز بالكامل** مع:
- 🔐 مصادقة متعددة (Email, Google, Facebook)
- 🛍️ متجر إلكتروني متكامل
- 📦 منتجات وفئات تجريبية
- 👤 حساب مدير للتحكم
- 💼 نظام أفلييت
- 🎨 تصميم احترافي بالعربية

---

## 📚 ملفات مرجعية

- **دليل OAuth الكامل**: `OAUTH_SETUP_GUIDE.md`
- **سكريبت البيانات**: `scripts/add-sample-data.mjs`
- **معلومات المشروع**: `README.md`

---

## 🆘 مشاكل شائعة

### المشكلة: OAuth لا يعمل
**الحل**: تأكد من:
- Redirect URI مطابق تماماً في Appwrite و Google/Facebook
- Facebook App في وضع "Development" للاختبار
- تفعيل OAuth Provider في Appwrite Console

### المشكلة: لا تظهر المنتجات
**الحل**: 
- تأكد من إضافة منتجات في Collection `products`
- تأكد من `isActive: true` في المنتجات
- افتح Developer Tools → Console لرؤية الأخطاء

### المشكلة: لا أستطيع تسجيل الدخول كمدير
**الحل**:
- تأكد من إنشاء المستخدم في Appwrite Console
- استخدم البريد والباسورد الصحيحين
- يمكنك إضافة Label `role=admin` للصلاحيات الكاملة

---

## 🚀 الخطوات القادمة (اختياري)

1. **إضافة المزيد من المنتجات** في Appwrite Console
2. **تخصيص الألوان** في `client/global.css`
3. **إضافة طرق دفع حقيقية** (Stripe, PayPal)
4. **ربط دومين خاص** بدلاً من .appwrite.network
5. **إضافة تحليلات** (Google Analytics)

---

**موقعك**: https://egygo-ecommerce.appwrite.network/  
**GitHub**: https://github.com/lolelara/egygo-ecommerce  
**Appwrite Console**: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8

---

## ✅ Checklist النهائي

- [ ] تفعيل Google OAuth
- [ ] تفعيل Facebook OAuth  
- [ ] إنشاء حساب مدير (admin@egygo.com)
- [ ] إضافة 2-3 فئات
- [ ] إضافة 3-5 منتجات على الأقل
- [ ] اختبار التسجيل والدخول
- [ ] اختبار إضافة منتج للسلة
- [ ] اختبار تسجيل الدخول كمدير
- [ ] اختبار إضافة منتج من لوحة التحكم

بالتوفيق! 🎊
