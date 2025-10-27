# 🗑️ Facebook Data Deletion - Setup Guide
## دليل إعداد حذف البيانات لـ Facebook

---

## 📋 **المتطلب من Facebook:**

Facebook يتطلب من جميع التطبيقات التي تستخدم OAuth توفير طريقة للمستخدمين لحذف بياناتهم.

---

## ✅ **ما تم إنجازه:**

### **1. صفحة Data Deletion:**
```
✅ client/pages/DataDeletion.tsx
   - نموذج طلب حذف البيانات
   - واجهة مستخدم احترافية
   - معلومات واضحة عن البيانات المحذوفة
   - طرق تواصل بديلة
```

### **2. API Endpoint:**
```
✅ server/api/data-deletion.ts
   - معالجة طلبات الحذف
   - دعم Facebook callback
   - حفظ الطلبات في قاعدة البيانات
   - إنشاء confirmation code
```

### **3. Routes:**
```
✅ /data-deletion - صفحة طلب الحذف
✅ /data-deletion-status - حالة الطلب
```

---

## 🔗 **الروابط المطلوبة في Facebook:**

### **Data Deletion Callback URL:**

#### **للتطوير (Development):**
```
http://localhost:5173/#/data-deletion
```

#### **للإنتاج (Production):**
```
https://yourdomain.com/#/data-deletion
```

**📍 أين تضعه:**
```
Facebook App Dashboard → App Review → User Data Deletion → Data deletion callback URL
```

---

## 🎯 **خطوات الإعداد في Facebook:**

### **1. اذهب إلى App Review:**
```
1. Facebook App Dashboard
2. App Review (في القائمة اليسرى)
3. User Data Deletion
```

### **2. اختر نوع الحذف:**
```
✅ Data deletion callback URL
```

### **3. أضف الرابط:**
```
للتطوير:
http://localhost:5173/#/data-deletion

للإنتاج:
https://yourdomain.com/#/data-deletion
```

### **4. احفظ التغييرات:**
```
✅ Save Changes
```

---

## 🗄️ **إعداد قاعدة البيانات:**

### **إنشاء Collection في Appwrite:**

```
Collection Name: dataDeletionRequests

Attributes:
1. email (string, required)
2. reason (string, optional)
3. requestedAt (datetime, required)
4. status (string, required) - Values: pending, processing, completed
5. source (string, required) - Values: facebook, web
6. facebookSignedRequest (string, optional)
7. confirmationCode (string, optional)
8. processedAt (datetime, optional)

Indexes:
- email (key)
- status (key)
- requestedAt (key)

Permissions:
- Create: Any
- Read: Admin only
- Update: Admin only
- Delete: Admin only
```

---

## 📝 **كيف يعمل النظام:**

### **1. المستخدم يطلب الحذف:**
```
المستخدم → يفتح /data-deletion
         → يدخل البريد الإلكتروني
         → يضغط "إرسال طلب الحذف"
```

### **2. النظام يعالج الطلب:**
```
النظام → يحفظ الطلب في قاعدة البيانات
       → ينشئ confirmation code
       → يرسل رسالة تأكيد (اختياري)
       → يرد بنجاح
```

### **3. Facebook Callback:**
```
Facebook → يرسل signed_request
         → النظام يعالج الطلب
         → يرد بـ:
           {
             "url": "https://yourdomain.com/#/data-deletion-status",
             "confirmation_code": "ABC123XYZ456"
           }
```

### **4. معالجة الحذف (يدوياً أو تلقائياً):**
```
Admin → يراجع الطلبات
      → يحذف البيانات من:
        - userPreferences
        - notifications
        - orders
        - addresses
        - favorites
        - Auth
      → يحدث status إلى "completed"
```

---

## 🔧 **إعداد Express Server (اختياري):**

إذا كنت تريد استخدام API endpoint حقيقي:

### **1. إنشاء Express Route:**

```typescript
// server/index.ts أو server/app.ts
import express from 'express';
import { handleDataDeletion, showDeletionInstructions } from './api/data-deletion';

const app = express();
app.use(express.json());

// Data deletion endpoints
app.post('/api/data-deletion', handleDataDeletion);
app.get('/api/data-deletion', showDeletionInstructions);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### **2. تحديث Facebook Callback URL:**
```
إذا كان لديك server:
http://localhost:3000/api/data-deletion

أو استخدم الصفحة مباشرة:
http://localhost:5173/#/data-deletion
```

---

## 📊 **ما يتم حذفه:**

### **بيانات المستخدم:**
```
✅ userPreferences (الملف الشخصي)
✅ notifications (الإشعارات)
✅ orders (الطلبات)
✅ addresses (العناوين)
✅ favorites (المفضلة)
✅ cart (السلة)
✅ Auth account (حساب المصادقة)
```

### **البيانات المحفوظة (للأغراض القانونية):**
```
⚠️ سجلات المعاملات المالية (لمدة محدودة)
⚠️ سجلات الفواتير (للمحاسبة)
⚠️ البيانات المطلوبة قانونياً
```

---

## 🧪 **الاختبار:**

### **1. اختبار الصفحة:**
```bash
# افتح في المتصفح:
http://localhost:5173/#/data-deletion

# يجب أن تظهر:
✅ نموذج طلب الحذف
✅ معلومات عن البيانات المحذوفة
✅ زر "إرسال طلب الحذف"
```

### **2. اختبار الإرسال:**
```
1. أدخل بريد إلكتروني
2. اضغط "إرسال طلب الحذف"
3. يجب أن تظهر رسالة نجاح
4. تحقق من Console للـ logs
```

### **3. اختبار Facebook Callback:**
```
1. في Facebook App Dashboard
2. App Review → User Data Deletion
3. اضغط "Test Callback"
4. يجب أن يرد النظام بـ:
   {
     "url": "...",
     "confirmation_code": "..."
   }
```

---

## 🔒 **الأمان والخصوصية:**

### **1. التحقق من الهوية:**
```
✅ التحقق من البريد الإلكتروني
✅ إرسال رسالة تأكيد
✅ Confirmation code فريد
```

### **2. الحذف النهائي:**
```
✅ حذف جميع البيانات الشخصية
✅ لا يمكن استرجاع البيانات
✅ إشعار المستخدم بالإكمال
```

### **3. الامتثال للقوانين:**
```
✅ GDPR compliance
✅ CCPA compliance
✅ Facebook policies
```

---

## 📝 **نموذج رسالة التأكيد:**

```
الموضوع: تأكيد طلب حذف البيانات - EgyGo

عزيزي المستخدم،

تم استلام طلبك لحذف بياناتك من EgyGo.

رقم التأكيد: ABC123XYZ456

سيتم حذف جميع بياناتك الشخصية خلال 30 يوماً من تاريخ هذا الطلب.

البيانات التي سيتم حذفها:
- معلومات الحساب
- سجل الطلبات
- العناوين المحفوظة
- قائمة المفضلة
- بيانات تسجيل الدخول

إذا كان لديك أي استفسار، يرجى التواصل معنا:
📧 privacy@egygo.com
📱 +20 123 456 7890

مع تحياتنا،
فريق EgyGo
```

---

## ⚠️ **مشاكل شائعة وحلولها:**

### **1. "This URL contains an invalid domain":**
```
✅ تأكد من إضافة Domain في App Domains
✅ تأكد من صحة الرابط (http:// أو https://)
✅ تأكد من عدم وجود مسافات في الرابط
```

### **2. "Callback failed":**
```
✅ تأكد من أن الصفحة تعمل
✅ تأكد من أن Server يرد بالـ format الصحيح
✅ تحقق من Console للأخطاء
```

### **3. "Invalid response format":**
```
Facebook يتوقع:
{
  "url": "https://...",
  "confirmation_code": "..."
}

تأكد من إرجاع هذا الـ format بالضبط
```

---

## 🎯 **Checklist - قبل النشر:**

```
✅ صفحة Data Deletion تعمل
✅ API endpoint يرد بشكل صحيح
✅ Collection في Appwrite جاهزة
✅ Callback URL مضاف في Facebook
✅ Domain مضاف في App Domains
✅ اختبار كامل للنظام
✅ رسائل التأكيد جاهزة
✅ Privacy Policy محدثة
```

---

## 📚 **روابط مفيدة:**

### **Facebook Documentation:**
```
https://developers.facebook.com/docs/app-review/data-deletion-callback
```

### **GDPR Guidelines:**
```
https://gdpr.eu/right-to-be-forgotten/
```

---

## 🎊 **الخلاصة:**

```
✅ صفحة Data Deletion جاهزة
✅ API endpoint جاهز
✅ Routes مضافة
✅ دليل شامل للإعداد
✅ نموذج رسالة تأكيد
✅ حل المشاكل الشائعة
```

---

**📅 تم التوثيق:** 2025-01-19  
**✅ الحالة:** جاهز للتطبيق

---

## 🚀 **الخطوة التالية:**

```
1. ✅ أنشئ Collection في Appwrite
2. ✅ أضف Callback URL في Facebook
3. ✅ اختبر الصفحة
4. ✅ اختبر Facebook Callback
5. ✅ جاهز للنشر!
```
