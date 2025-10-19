# 🔐 Facebook Login Integration Guide
## دليل تفعيل تسجيل الدخول بـ Facebook

---

## 📋 **المتطلبات:**

### **1. معلومات من Facebook App Dashboard:**
```
✅ App ID
✅ App Secret
✅ OAuth Redirect URI
```

---

## 🎯 **خطوات الإعداد في Facebook:**

### **الخطوة 1: إعدادات Facebook App**

#### **أ. Basic Settings:**
```
1. اذهب إلى: https://developers.facebook.com/apps/
2. اختر تطبيقك
3. Settings → Basic
4. احفظ:
   - App ID: xxxxxxxxxxxx
   - App Secret: xxxxxxxxxxxxxxxxxxxx
```

#### **ب. App Domains:**
```
1. في Basic Settings
2. App Domains: أضف:
   - localhost (للتطوير)
   - yourdomain.com (للإنتاج)
```

#### **ج. Privacy Policy URL:**
```
1. في Basic Settings
2. Privacy Policy URL: https://yourdomain.com/privacy
3. Terms of Service URL: https://yourdomain.com/terms
```

---

### **الخطوة 2: إعداد Facebook Login**

#### **أ. تفعيل Facebook Login:**
```
1. Products → Facebook Login → Settings
2. Valid OAuth Redirect URIs:
   
   للتطوير:
   http://localhost:5173/auth/facebook/callback
   http://localhost:5173
   
   للإنتاج:
   https://yourdomain.com/auth/facebook/callback
   https://yourdomain.com
   
3. احفظ التغييرات
```

#### **ب. الصلاحيات المطلوبة:**
```
✅ email (البريد الإلكتروني)
✅ public_profile (الاسم والصورة)
```

---

### **الخطوة 3: إعداد Appwrite OAuth**

#### **أ. في Appwrite Console:**
```
1. اذهب إلى: Auth → Settings
2. OAuth2 Providers
3. Facebook:
   - App ID: [ضع App ID من Facebook]
   - App Secret: [ضع App Secret من Facebook]
   - Enable: ✅
4. احفظ
```

#### **ب. Redirect URL من Appwrite:**
```
انسخ Redirect URL من Appwrite:
https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/facebook/68d8b9db00134c41e7c8

ضعه في Facebook App:
Products → Facebook Login → Settings → Valid OAuth Redirect URIs
```

---

## 💻 **الكود - التكامل:**

### **1. تحديث .env:**

```env
# Facebook OAuth
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
VITE_FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# Appwrite (موجود مسبقاً)
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
```

---

### **2. إنشاء Facebook Login Button:**

```typescript
// client/components/FacebookLoginButton.tsx
import { useState } from 'react';
import { account } from '@/lib/appwrite';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook } from 'lucide-react';

export function FacebookLoginButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      
      // Create OAuth2 session with Facebook
      account.createOAuth2Session(
        'facebook',
        `${window.location.origin}/auth/callback`, // Success redirect
        `${window.location.origin}/login?error=facebook_failed` // Failure redirect
      );
    } catch (error) {
      console.error('Facebook login error:', error);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleFacebookLogin}
      disabled={loading}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white border-0"
    >
      <Facebook className="w-5 h-5" />
      {loading ? 'جاري الاتصال...' : 'تسجيل الدخول بـ Facebook'}
    </Button>
  );
}
```

---

### **3. صفحة Callback:**

```typescript
// client/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('جاري معالجة تسجيل الدخول...');

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get current user
      const user = await account.get();
      console.log('✅ User logged in:', user);

      // Check if user preferences exist
      const userPrefs = await databases.listDocuments(
        DATABASE_ID,
        'userPreferences',
        [Query.equal('userId', user.$id)]
      );

      if (userPrefs.documents.length === 0) {
        // Create user preferences for new Facebook user
        await databases.createDocument(
          DATABASE_ID,
          'userPreferences',
          ID.unique(),
          {
            userId: user.$id,
            name: user.name || 'مستخدم Facebook',
            email: user.email || '',
            phone: user.phone || '',
            role: 'customer',
            isAffiliate: false,
            isMerchant: false,
            isIntermediary: false,
            isAdmin: false,
            isPending: false,
            isApproved: true,
            createdAt: new Date().toISOString(),
          }
        );
        console.log('✅ User preferences created');

        // Send welcome notification
        try {
          await databases.createDocument(
            DATABASE_ID,
            'notifications',
            ID.unique(),
            {
              userId: user.$id,
              title: '🎉 مرحباً بك في EgyGo!',
              message: `أهلاً ${user.name}! تم تسجيل دخولك بنجاح عبر Facebook.`,
              type: 'success',
              read: false,
              relatedId: user.$id,
              metadata: JSON.stringify({
                source: 'facebook_login',
                userName: user.name
              })
            }
          );
        } catch (notifError) {
          console.error('Error creating notification:', notifError);
        }
      }

      setStatus('success');
      setMessage('تم تسجيل الدخول بنجاح! جاري التحويل...');
      
      // Redirect based on role
      setTimeout(() => {
        const userPref = userPrefs.documents[0];
        if (userPref?.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userPref?.role === 'merchant') {
          navigate('/merchant/dashboard');
        } else if (userPref?.role === 'affiliate') {
          navigate('/affiliate/dashboard');
        } else {
          navigate('/');
        }
      }, 1500);

    } catch (error: any) {
      console.error('Callback error:', error);
      setStatus('error');
      setMessage('حدث خطأ في تسجيل الدخول. جاري التحويل...');
      
      setTimeout(() => {
        navigate('/login?error=callback_failed');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              جاري المعالجة...
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              نجح! ✅
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              خطأ ❌
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
```

---

### **4. تحديث صفحة Login:**

```typescript
// في client/pages/Login.tsx
import { FacebookLoginButton } from '@/components/FacebookLoginButton';

// أضف في الـ JSX:
<div className="space-y-4">
  {/* زر تسجيل الدخول العادي */}
  <Button type="submit" className="w-full">
    تسجيل الدخول
  </Button>

  {/* فاصل */}
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-background px-2 text-muted-foreground">
        أو
      </span>
    </div>
  </div>

  {/* زر Facebook */}
  <FacebookLoginButton />
</div>
```

---

### **5. إضافة Route للـ Callback:**

```typescript
// في client/App.tsx أو router config
import AuthCallback from '@/pages/AuthCallback';

// أضف في Routes:
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

## 🧪 **الاختبار:**

### **1. اختبار محلي (Development):**

```bash
# 1. شغّل المشروع
npm run dev

# 2. افتح المتصفح
http://localhost:5173/login

# 3. اضغط "تسجيل الدخول بـ Facebook"

# 4. سيفتح نافذة Facebook
# 5. سجل الدخول بحساب Facebook
# 6. وافق على الصلاحيات
# 7. سيتم التحويل إلى /auth/callback
# 8. ثم إلى الصفحة الرئيسية
```

---

### **2. التحقق من النجاح:**

```javascript
// في Console:
✅ User logged in: { $id: '...', name: '...', email: '...' }
✅ User preferences created
✅ Notification created

// في Appwrite Console:
✅ Auth → Users → يظهر المستخدم الجديد
✅ Database → userPreferences → يظهر السجل
✅ Database → notifications → يظهر الإشعار
```

---

## 🔒 **الأمان:**

### **1. HTTPS في Production:**
```
⚠️ Facebook يتطلب HTTPS في Production
⚠️ لا يعمل على HTTP إلا في localhost
```

### **2. App Review:**
```
للاستخدام العام، تحتاج:
1. Business Verification
2. App Review من Facebook
3. موافقة على صلاحيات email و public_profile
```

### **3. Test Users:**
```
أثناء التطوير، استخدم:
- Roles → Test Users
- أضف test users للاختبار
- لا تحتاج App Review للـ test users
```

---

## 📊 **App Review Requirements:**

### **ما تحتاجه للنشر:**

#### **1. Business Verification:**
```
✅ معلومات الشركة
✅ وثائق رسمية
✅ عنوان فعلي
✅ رقم هاتف للتواصل
```

#### **2. Privacy Policy:**
```
✅ صفحة Privacy Policy على موقعك
✅ توضح كيف تستخدم بيانات Facebook
✅ رابط في Facebook App Settings
```

#### **3. Terms of Service:**
```
✅ شروط الاستخدام
✅ رابط في Facebook App Settings
```

#### **4. App Icon:**
```
✅ 1024x1024 pixels
✅ بدون شفافية
✅ يمثل التطبيق
```

#### **5. Use Case:**
```
في App Review:
1. اختر: "Authenticate and request data from users with Facebook Login"
2. اشرح كيف تستخدم البيانات
3. أرفق screenshots
4. أرفق فيديو توضيحي (اختياري)
```

---

## 🎯 **خطوات النشر:**

### **1. أكمل المتطلبات:**
```
✅ Privacy Policy URL
✅ Terms of Service URL
✅ App Icon
✅ Business Verification
✅ اختبار كامل مع Test Users
```

### **2. اطلب المراجعة:**
```
1. App Review → Request Review
2. اختر Permissions: email, public_profile
3. اشرح الاستخدام
4. أرفق Screenshots
5. أرسل
```

### **3. انتظر الموافقة:**
```
⏱️ عادة 1-3 أيام
📧 ستصلك رسالة بالنتيجة
✅ بعد الموافقة، غيّر App Mode إلى "Live"
```

---

## 🐛 **حل المشاكل الشائعة:**

### **1. "URL Blocked: This redirect failed":**
```
✅ تأكد من إضافة Redirect URI في Facebook App
✅ تأكد من مطابقة URL بالضبط
✅ تأكد من إضافة Domain في App Domains
```

### **2. "App Not Setup: This app is still in development mode":**
```
✅ أضف نفسك كـ Test User أو Admin
✅ أو انشر التطبيق بعد App Review
```

### **3. "Invalid OAuth Redirect URI":**
```
✅ تأكد من Appwrite Redirect URL في Facebook
✅ انسخه من Appwrite Console بالضبط
```

### **4. "Missing email permission":**
```
✅ تأكد من طلب email في Permissions
✅ في App Review، اطلب موافقة على email
```

---

## 📝 **ملاحظات مهمة:**

### **للتطوير (الآن):**
```
✅ يمكنك الاختبار مباشرة
✅ استخدم Test Users
✅ لا تحتاج App Review
✅ يعمل على localhost
```

### **للإنتاج (لاحقاً):**
```
⚠️ تحتاج Business Verification
⚠️ تحتاج App Review
⚠️ تحتاج HTTPS
⚠️ تحتاج Privacy Policy
```

---

## 🎊 **الخلاصة:**

### **الخطوات:**
```
1. ✅ احصل على App ID و App Secret من Facebook
2. ✅ أضفهم في Appwrite Console
3. ✅ أضف Appwrite Redirect URL في Facebook
4. ✅ أضف الكود (FacebookLoginButton + AuthCallback)
5. ✅ أضف Route للـ callback
6. ✅ اختبر مع Test User
7. ⏳ أكمل Business Verification
8. ⏳ اطلب App Review
9. ⏳ انتظر الموافقة
10. ✅ انشر التطبيق (Live Mode)
```

---

**📅 تم التوثيق:** 2025-01-19  
**✅ الحالة:** جاهز للتطبيق
