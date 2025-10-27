# 📋 Facebook Data Handling Questionnaire - Guide
## دليل الإجابة على أسئلة معالجة البيانات

---

## ⚠️ **تنبيه مهم:**

هذا الدليل يقدم إجابات **عامة** بناءً على تطبيق e-commerce صغير. يجب عليك:
- ✅ استشارة محامي أو خبير قانوني
- ✅ مراجعة سياسات شركتك
- ✅ التأكد من الامتثال للقوانين المحلية

---

## 📝 **الأسئلة والإجابات المقترحة:**

---

### **السؤال 1: Data Processors**

**❓ السؤال:**
```
Do you have data processors or service providers, including your own companies, 
that will have access to the Platform Data that you obtain from Meta?
```

**✅ الإجابة المقترحة:**
```
☑️ Yes
```

**📝 التفاصيل:**
```
Processor Name: Appwrite Cloud
Purpose: Backend as a Service (BaaS) - Database and Authentication
Location: Germany (Frankfurt)
Data Access: User ID, Email, Name, Profile Picture
```

**💡 التوضيح:**
- Appwrite يخزن بيانات المستخدمين
- يعتبر "data processor" لأنه يعالج البيانات نيابة عنك
- يجب ذكر جميع الخدمات التي تصل للبيانات

---

### **السؤال 2: Responsible Entity (Data Controller)**

**❓ السؤال:**
```
Who is the person or entity that will be responsible for all Platform Data 
Meta shares with you?
```

**✅ الإجابة المقترحة:**
```
[اسم شركتك أو اسمك الشخصي]

مثال:
- EgyGo E-commerce
- أو: [اسمك الكامل] (إذا كنت فرد)
```

**💡 التوضيح:**
- هذا هو "Data Controller"
- الشخص/الكيان المسؤول قانونياً عن البيانات
- يحدد كيف ولماذا تُستخدم البيانات

---

### **السؤال 3: Country Location**

**❓ السؤال:**
```
Select the country where this person or entity is located.
```

**✅ الإجابة المقترحة:**
```
☑️ Egypt (أو البلد الذي تتواجد فيه شركتك)
```

**💡 التوضيح:**
- اختر البلد الذي مسجلة فيه شركتك
- أو البلد الذي تقيم فيه (إذا كنت فرد)

---

### **السؤال 4: National Security Requests**

**❓ السؤال:**
```
Have you provided the personal data or personal information of users to 
public authorities in response to national security requests in the past 12 months?
```

**✅ الإجابة المقترحة:**
```
☑️ No
```

**💡 التوضيح:**
- إذا كنت تطبيق جديد أو صغير، الإجابة عادة "No"
- إذا لم تتلق أي طلبات من السلطات، اختر "No"
- إذا تلقيت طلبات، اختر الفئة المناسبة

---

### **السؤال 5: Policies and Processes**

**❓ السؤال:**
```
Which of the following policies or processes do you have in place regarding 
requests from public authorities for the personal data or personal information 
of users? Check all that apply.
```

**✅ الإجابة المقترحة:**
```
☑️ Required review of the legality of these requests.
☑️ Provisions for challenging these requests if they are considered unlawful.
☑️ Data minimization policy—the ability to disclose the minimum information necessary.
☑️ Documentation of these requests, including your responses to the requests and the legal reasoning and actors involved.
```

**💡 التوضيح:**
- اختر جميع السياسات التي لديك فعلاً
- إذا لم يكن لديك سياسات رسمية، يمكنك:
  - إنشاء سياسات بسيطة الآن
  - أو اختيار "None of the above" (غير موصى به)

---

## 📄 **نموذج سياسة Data Handling (مقترح):**

### **1. Legal Review Policy:**
```
EgyGo E-commerce Policy on Government Requests

1. All requests from public authorities will be reviewed by legal counsel.
2. We will verify the legality and validity of each request.
3. We will only comply with legally valid requests.
4. We reserve the right to challenge unlawful requests.
```

### **2. Data Minimization Policy:**
```
Data Minimization Policy

1. We will only disclose the minimum information necessary.
2. We will not provide more data than legally required.
3. We will redact or anonymize data when possible.
```

### **3. Documentation Policy:**
```
Request Documentation Policy

1. All government requests will be documented.
2. Documentation includes:
   - Date and time of request
   - Requesting authority
   - Legal basis for request
   - Data disclosed (if any)
   - Legal reasoning for our response
3. Records will be kept for [X] years.
```

---

## 🔐 **Data Processors - قائمة كاملة:**

### **الخدمات التي قد تصل للبيانات:**

#### **1. Appwrite Cloud:**
```
Name: Appwrite Cloud
Purpose: Backend as a Service (Database, Auth, Storage)
Location: Germany (Frankfurt)
Data Access: User ID, Email, Name, Phone, Profile Picture
Data Processing Agreement: Yes (Appwrite Terms)
```

#### **2. Email Service (إذا كنت تستخدم):**
```
Name: [مثل SendGrid, Mailgun, AWS SES]
Purpose: Sending transactional emails
Location: [حسب الخدمة]
Data Access: Email, Name
Data Processing Agreement: Yes
```

#### **3. Analytics (إذا كنت تستخدم):**
```
Name: Google Analytics / Facebook Pixel
Purpose: Website analytics and marketing
Location: USA
Data Access: User behavior, demographics
Data Processing Agreement: Yes
```

#### **4. Payment Gateway (إذا كنت تستخدم):**
```
Name: [مثل Stripe, PayPal, Paymob]
Purpose: Payment processing
Location: [حسب الخدمة]
Data Access: Email, Name, Payment info
Data Processing Agreement: Yes
```

---

## 📋 **نموذج إجابات كامل:**

### **للتطبيق الصغير/الجديد:**

```
Q1: Data Processors?
☑️ Yes
Processors:
- Appwrite Cloud (Backend/Database)

Q2: Responsible Entity?
[اسم شركتك أو اسمك]

Q3: Country?
☑️ Egypt

Q4: National Security Requests?
☑️ No

Q5: Policies in Place?
☑️ Required review of the legality of these requests
☑️ Provisions for challenging these requests if unlawful
☑️ Data minimization policy
☑️ Documentation of these requests
```

---

## 🎯 **خطوات التنفيذ:**

### **1. قبل الإجابة:**
```
✅ راجع جميع الخدمات التي تستخدمها
✅ حدد أي منها يصل لبيانات Facebook
✅ تأكد من وجود Data Processing Agreements
✅ أنشئ سياسات بسيطة (إذا لم تكن موجودة)
```

### **2. أثناء الإجابة:**
```
✅ كن صادقاً ودقيقاً
✅ لا تبالغ في الإجابات
✅ اذكر فقط ما هو موجود فعلاً
✅ احتفظ بنسخة من إجاباتك
```

### **3. بعد الإجابة:**
```
✅ احفظ نسخة من الإجابات
✅ أنشئ ملف توثيق
✅ حدّث Privacy Policy
✅ راجع السياسات دورياً
```

---

## 📚 **مستندات يجب إنشاؤها:**

### **1. Data Processing Agreement (DPA):**
```
اتفاقية مع كل processor توضح:
- نوع البيانات المعالجة
- الغرض من المعالجة
- مدة المعالجة
- التزامات الأمان
- حقوق المستخدمين
```

### **2. Privacy Policy (محدثة):**
```
يجب أن تتضمن:
- كيف تستخدم بيانات Facebook
- من يصل للبيانات (processors)
- حقوق المستخدمين
- كيفية حذف البيانات
- معلومات الاتصال
```

### **3. Data Retention Policy:**
```
- كم من الوقت تحتفظ بالبيانات
- متى يتم حذف البيانات
- كيف يتم حذف البيانات
```

### **4. Security Policy:**
```
- كيف تحمي البيانات
- التشفير المستخدم
- التحكم في الوصول
- إجراءات الطوارئ
```

---

## ⚠️ **تحذيرات مهمة:**

### **1. لا تكذب:**
```
❌ لا تقل أن لديك سياسات غير موجودة
❌ لا تخفي processors موجودين
❌ لا تعطي معلومات خاطئة
```

### **2. كن واقعياً:**
```
✅ إذا كنت تطبيق صغير، قل ذلك
✅ إذا لم تتلق طلبات حكومية، قل "No"
✅ إذا لم يكن لديك سياسات معقدة، أنشئ سياسات بسيطة
```

### **3. استشر خبير:**
```
⚠️ هذا الدليل للمساعدة فقط
⚠️ استشر محامي للإجابات النهائية
⚠️ القوانين تختلف حسب البلد
```

---

## 🌍 **اعتبارات خاصة بمصر:**

### **القوانين المحلية:**
```
✅ قانون حماية البيانات الشخصية المصري
✅ قانون مكافحة جرائم تقنية المعلومات
✅ لوائح الجهاز القومي لتنظيم الاتصالات
```

### **الجهات المختصة:**
```
📍 الجهاز القومي لتنظيم الاتصالات (NTRA)
📍 وزارة الاتصالات وتكنولوجيا المعلومات
```

---

## 📞 **جهات الاستشارة:**

### **قانونية:**
```
✅ محامي متخصص في حماية البيانات
✅ مكتب استشارات قانونية تقنية
```

### **تقنية:**
```
✅ Appwrite Support (للأسئلة عن DPA)
✅ خبير أمن معلومات
```

---

## 🎊 **الخلاصة:**

### **للتطبيق الصغير:**
```
✅ Q1: Yes (Appwrite)
✅ Q2: [اسمك/شركتك]
✅ Q3: Egypt
✅ Q4: No
✅ Q5: اختر جميع السياسات (بعد إنشائها)
```

### **المستندات المطلوبة:**
```
✅ Privacy Policy محدثة
✅ Data Processing Agreement مع Appwrite
✅ سياسات بسيطة للتعامل مع الطلبات الحكومية
✅ Data Deletion Policy
```

---

**⚠️ تذكير نهائي:**
هذا الدليل للمساعدة فقط. يجب استشارة محامي أو خبير قانوني قبل إرسال الإجابات النهائية لـ Facebook.

---

**📅 تم التوثيق:** 2025-01-19  
**✅ الحالة:** دليل إرشادي
