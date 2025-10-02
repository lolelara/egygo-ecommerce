# دليل تفعيل OAuth وإعداد المشروع

## 🔐 1. تفعيل Google OAuth

### الخطوات في Appwrite Console:
1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اذهب إلى Project: **egygo** (68d8b9db00134c41e7c8)
3. من القائمة الجانبية: **Auth** → **Settings**
4. ابحث عن **Google** في قائمة OAuth2 Providers
5. اضغط على **Google**

### إعدادات Google OAuth:
```
Status: ✅ Enabled

Redirect URI (انسخها):
https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/68d8b9db00134c41e7c8

Client ID: (سنحصل عليه من Google Cloud Console)
Client Secret: (سنحصل عليه من Google Cloud Console)
```

### الحصول على Google Client ID & Secret:
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. اذهب إلى **APIs & Services** → **Credentials**
4. اضغط **Create Credentials** → **OAuth 2.0 Client ID**
5. اختر **Web application**
6. املأ البيانات:
   - **Name**: Egygo Ecommerce
   - **Authorized redirect URIs**: 
     - `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/68d8b9db00134c41e7c8`
     - `https://egygo-ecommerce.appwrite.network/login` (optional)
7. انسخ **Client ID** و **Client Secret**
8. ارجع لـ Appwrite Console والصقهم في إعدادات Google OAuth
9. اضغط **Update**

---

## 📘 2. تفعيل Facebook OAuth

### الخطوات في Appwrite Console:
1. في نفس صفحة **Auth** → **Settings**
2. ابحث عن **Facebook** في قائمة OAuth2 Providers
3. اضغط على **Facebook**

### إعدادات Facebook OAuth:
```
Status: ✅ Enabled

Redirect URI (انسخها):
https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/facebook/68d8b9db00134c41e7c8

App ID: (سنحصل عليه من Facebook Developers)
App Secret: (سنحصل عليه من Facebook Developers)
```

### الحصول على Facebook App ID & Secret:
1. اذهب إلى [Facebook Developers](https://developers.facebook.com)
2. اضغط **My Apps** → **Create App**
3. اختر **Consumer** ثم **Next**
4. املأ البيانات:
   - **App Name**: Egygo Ecommerce
   - **App Contact Email**: بريدك الإلكتروني
5. بعد إنشاء التطبيق، اذهب إلى **Settings** → **Basic**
6. انسخ **App ID** و **App Secret**
7. في قسم **App Domains**، أضف:
   - `egygo-ecommerce.appwrite.network`
   - `fra.cloud.appwrite.io`
8. اذهب إلى **Products** → أضف **Facebook Login**
9. في إعدادات **Facebook Login**:
   - **Valid OAuth Redirect URIs**: 
     - `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/facebook/68d8b9db00134c41e7c8`
10. ارجع لـ Appwrite Console والصق **App ID** و **App Secret**
11. اضغط **Update**

---

## 👤 3. إنشاء حساب مدير (Admin Account)

### الطريقة 1: من Appwrite Console (موصى بها)
1. اذهب إلى **Auth** → **Users**
2. اضغط **Create User**
3. املأ البيانات:
   ```
   Email: admin@egygo.com
   Password: Admin@Egygo2025!
   Name: مدير الموقع
   ```
4. اضغط **Create**
5. انسخ **User ID** من صفحة المستخدم

### الطريقة 2: إضافة Labels للصلاحيات
1. افتح المستخدم الذي أنشأته
2. اذهب إلى **Labels**
3. أضف Label جديد:
   ```
   Key: role
   Value: admin
   ```
4. احفظ التغييرات

### تحديث كود المشروع للتحقق من صلاحيات Admin:
سنحتاج تحديث AuthContext ليتحقق من label "admin"

---

## 🛍️ 4. إضافة فئات ومنتجات تجريبية

### إضافة فئات (Categories):

#### الطريقة: من Appwrite Console
1. اذهب إلى **Databases** → **egygo** → **categories**
2. اضغط **Add Document** لكل فئة:

**الفئة 1: إلكترونيات**
```json
{
  "name": "إلكترونيات",
  "description": "أجهزة إلكترونية وتقنية حديثة",
  "image": "",
  "isActive": true
}
```

**الفئة 2: ملابس**
```json
{
  "name": "ملابس",
  "description": "أزياء وملابس رجالية ونسائية",
  "image": "",
  "isActive": true
}
```

**الفئة 3: منزل وديكور**
```json
{
  "name": "منزل وديكور",
  "description": "أثاث ومستلزمات منزلية",
  "image": "",
  "isActive": true
}
```

**الفئة 4: رياضة**
```json
{
  "name": "رياضة",
  "description": "معدات وملابس رياضية",
  "image": "",
  "isActive": true
}
```

### إضافة منتجات (Products):

سنضيف 5 منتجات تجريبية لكل فئة (انسخ categoryId من الفئة المُنشأة)

**منتج 1: لابتوب Dell XPS**
```json
{
  "name": "لابتوب Dell XPS 13",
  "description": "لابتوب قوي للمحترفين بشاشة 13 بوصة FHD، معالج Intel Core i7، 16GB RAM، 512GB SSD",
  "price": 25000,
  "comparePrice": 30000,
  "stock": 15,
  "images": ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45"],
  "categoryId": "[انسخ ID فئة إلكترونيات]",
  "tags": ["لابتوب", "dell", "كمبيوتر"],
  "isActive": true,
  "isFeatured": true,
  "rating": 4.5,
  "reviewCount": 12
}
```

**منتج 2: سماعات AirPods**
```json
{
  "name": "سماعات AirPods Pro 2",
  "description": "سماعات لاسلكية مع إلغاء ضوضاء نشط وجودة صوت استثنائية",
  "price": 1200,
  "comparePrice": 1500,
  "stock": 50,
  "images": ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7"],
  "categoryId": "[انسخ ID فئة إلكترونيات]",
  "tags": ["سماعات", "apple", "لاسلكي"],
  "isActive": true,
  "isFeatured": true,
  "rating": 4.8,
  "reviewCount": 45
}
```

**منتج 3: تيشيرت قطن**
```json
{
  "name": "تيشيرت قطن بيور رجالي",
  "description": "تيشيرت قطن 100% بألوان متعددة، مقاس M/L/XL",
  "price": 150,
  "comparePrice": 200,
  "stock": 100,
  "images": ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
  "categoryId": "[انسخ ID فئة ملابس]",
  "tags": ["تيشيرت", "ملابس", "رجالي"],
  "isActive": true,
  "isFeatured": false,
  "rating": 4.2,
  "reviewCount": 28
}
```

**منتج 4: كرسي مكتب**
```json
{
  "name": "كرسي مكتب ergonomic",
  "description": "كرسي مكتب مريح مع دعم للظهر وارتفاع قابل للتعديل",
  "price": 1800,
  "comparePrice": 2500,
  "stock": 20,
  "images": ["https://images.unsplash.com/photo-1592078615290-033ee584e267"],
  "categoryId": "[انسخ ID فئة منزل وديكور]",
  "tags": ["كرسي", "مكتب", "أثاث"],
  "isActive": true,
  "isFeatured": true,
  "rating": 4.6,
  "reviewCount": 15
}
```

**منتج 5: حذاء رياضي**
```json
{
  "name": "حذاء رياضي Nike Air Max",
  "description": "حذاء رياضي خفيف ومريح للجري والتدريب",
  "price": 800,
  "comparePrice": 1000,
  "stock": 35,
  "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
  "categoryId": "[انسخ ID فئة رياضة]",
  "tags": ["حذاء", "رياضي", "nike"],
  "isActive": true,
  "isFeatured": true,
  "rating": 4.7,
  "reviewCount": 67
}
```

---

## ✅ 5. اختبار الوظائف

### قائمة الاختبارات:
- [ ] التسجيل بالبريد الإلكتروني والباسورد
- [ ] تسجيل الدخول بالبريد الإلكتروني
- [ ] تسجيل الدخول بـ Google OAuth
- [ ] تسجيل الدخول بـ Facebook OAuth
- [ ] تصفح المنتجات والفئات
- [ ] البحث عن منتجات
- [ ] إضافة منتج للسلة
- [ ] إتمام عملية شراء
- [ ] عرض طلباتي
- [ ] تسجيل الدخول كمدير
- [ ] إدارة المنتجات (إضافة، تعديل، حذف)
- [ ] إدارة الطلبات (عرض، تحديث حالة)
- [ ] إدارة المستخدمين
- [ ] نظام الأفلييت والعمولات

---

## 🔧 التحديثات المطلوبة في الكود

### 1. إضافة أزرار OAuth في صفحة Login:

سنحتاج تحديث `client/pages/Login.tsx` لإضافة أزرار Google و Facebook

### 2. تحديث AuthContext للتحقق من Admin:

سنحتاج تحديث `client/contexts/AppwriteAuthContext.tsx` لجلب labels والتحقق من role=admin

### 3. إضافة صفحات الإدارة:

تأكد من وجود:
- AdminDashboard.tsx ✅
- AdminProducts.tsx ✅
- AdminOrders.tsx ✅
- AdminUsers.tsx ✅
- AdminCategories.tsx ✅

---

## 📝 ملاحظات مهمة:

1. **OAuth Redirect URIs** يجب أن تكون مطابقة تماماً
2. **Facebook App** يجب أن يكون في وضع "Development" للاختبار
3. للنشر النهائي، حوّل Facebook App إلى "Live"
4. Google OAuth يعمل مباشرة بدون موافقة إضافية للاختبار
5. تأكد من تفعيل **Email/Password** في Appwrite Auth Settings

---

## 🚀 البدء بالاختبار

بعد إكمال جميع الخطوات أعلاه:

1. افتح الموقع: https://egygo-ecommerce.appwrite.network/
2. جرب التسجيل بالبريد الإلكتروني
3. جرب تسجيل الدخول بـ Google
4. جرب تسجيل الدخول بـ Facebook
5. تصفح المنتجات واشترِ منتج
6. سجل دخول كمدير وجرب لوحة التحكم
