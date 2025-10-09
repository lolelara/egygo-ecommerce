# 🔐 دليل ضبط Permissions في Appwrite

## لماذا Permissions مهمة؟
Permissions تحدد من يمكنه القراءة/الكتابة/التعديل/الحذف للبيانات في كل collection.

---

## 📍 الوصول لإعدادات Permissions

### الخطوة 1: افتح Appwrite Console
1. اذهب إلى: https://cloud.appwrite.io/console
2. اختر مشروعك: `egygo-ecommerce`
3. من القائمة الجانبية: **Databases**
4. اختر Database: `main` (ID: 68de037e003bd03c4d45)

### الخطوة 2: اختر Collection
اختر أي collection تريد ضبط permissions لها (مثل: `notification_templates`)

### الخطوة 3: اذهب لـ Settings
- اضغط على **Settings** (⚙️) في أعلى يمين الصفحة
- أو اضغط على tab "Settings"

---

## 🔧 ضبط Permissions للـ Collections الجديدة

### Collection: notification_templates

#### في Settings → Permissions:

1. **اضغط على "Add a role"**

2. **أضف Permission للقراءة (Read):**
   - Role: `Any`
   - Permission: `read`
   - هذا يسمح لأي شخص بقراءة القوالب

3. **أضف Permission للكتابة (Create):**
   - Role: `Users` (أو `role:admin` للمديرين فقط)
   - Permission: `create`
   - هذا يسمح للمسجلين بإنشاء قوالب

4. **أضف Permission للتحديث:**
   - Role: `Users` (أو `role:admin`)
   - Permission: `update`

5. **أضف Permission للحذف:**
   - Role: `role:admin` (المديرين فقط)
   - Permission: `delete`

**النتيجة النهائية:**
```
Permissions:
- read("any")                    // أي شخص يمكنه القراءة
- create("users")                // المستخدمين المسجلين يمكنهم الإضافة
- update("users")                // المستخدمين المسجلين يمكنهم التعديل
- delete("role:admin")           // المديرين فقط يمكنهم الحذف
```

---

### Collection: scheduled_notifications

#### Permissions الموصى بها:
```
- read("role:admin")             // المديرين فقط يمكنهم القراءة
- create("role:admin")           // المديرين فقط يمكنهم الجدولة
- update("role:admin")           // المديرين فقط يمكنهم التعديل
- delete("role:admin")           // المديرين فقط يمكنهم الإلغاء
```

**كيفية الإضافة:**
1. Settings → Permissions
2. Add role → اختر `role:admin`
3. اختر Permissions: read, create, update, delete

---

### Collection: notifications

#### Permissions الموصى بها:
```
- read("user:{userId}")          // كل مستخدم يقرأ إشعاراته فقط
- create("role:admin")           // المديرين فقط يرسلون إشعارات
- update("user:{userId}")        // المستخدم يعدل إشعاراته (مثل: وضع علامة مقروء)
- delete("role:admin")           // المديرين فقط يحذفون
```

**ملاحظة**: هذا يتطلب Document-level security

**للتفعيل:**
1. Settings → Document Security
2. فعّل: `Enable Document Security`
3. الآن يمكنك ضبط permissions لكل إشعار على حدة

---

### Collection: commissions

#### Permissions الموصى بها:
```
- read("user:{affiliateId}")     // المسوق يقرأ عمولاته فقط
- create("role:admin")           // المديرين/النظام فقط يضيف عمولات
- update("role:admin")           // المديرين فقط يعدلون
- delete("role:admin")           // المديرين فقط يحذفون
```

---

### Collection: users

#### Permissions الموصى بها:
```
- read("any")                    // أي شخص يقرأ البيانات العامة
- create("users")                // التسجيل متاح للجميع
- update("user:{$id}")           // كل مستخدم يعدل بياناته فقط
- delete("role:admin")           // المديرين فقط يحذفون
```

---

## 📖 شرح أنواع Roles

### 1. `any`
- أي شخص (حتى لو غير مسجل)
- استخدمه للقراءة العامة فقط

### 2. `users`
- أي مستخدم مسجل (logged in)
- استخدمه للعمليات التي تتطلب تسجيل دخول

### 3. `role:admin` (أو أي role مخصص)
- مستخدمين بدور محدد
- يجب إنشاء Role في Appwrite أولاً
- استخدمه للعمليات الحساسة

### 4. `user:{userId}`
- مستخدم محدد بالـ ID
- استخدمه مع Document Security
- كل مستخدم يصل لبياناته فقط

### 5. `team:{teamId}`
- أعضاء فريق محدد
- مفيد للشركات/المنظمات

---

## 🎯 Permissions حسب الأولوية

### الأكثر أماناً (للبيانات الحساسة):
```
- read("role:admin")
- create("role:admin")
- update("role:admin")
- delete("role:admin")
```
**مثال**: commissions, scheduled_notifications

### متوسط (للبيانات الشخصية):
```
- read("user:{userId}")
- create("users")
- update("user:{userId}")
- delete("role:admin")
```
**مثال**: notifications, user profiles

### عام (للبيانات العامة):
```
- read("any")
- create("users")
- update("users")
- delete("role:admin")
```
**مثال**: notification_templates, products

---

## ⚡ Quick Setup (نسخ ولصق)

### للتنفيذ السريع من CLI:

```bash
# notification_templates
appwrite databases update-collection \
  --database-id 68de037e003bd03c4d45 \
  --collection-id notification_templates \
  --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("role:admin")'

# scheduled_notifications  
appwrite databases update-collection \
  --database-id 68de037e003bd03c4d45 \
  --collection-id scheduled_notifications \
  --permissions 'read("role:admin")' 'create("role:admin")' 'update("role:admin")' 'delete("role:admin")'
```

---

## ✅ التحقق من الضبط الصحيح

### اختبار 1: القراءة
- افتح صفحة المشروع بدون تسجيل دخول
- يجب أن تظهر البيانات التي لها `read("any")`

### اختبار 2: الكتابة
- سجل دخول كمستخدم عادي
- حاول إضافة بيانات
- يجب أن تنجح العملية إذا كان `create("users")`

### اختبار 3: الحذف
- سجل دخول كمستخدم عادي
- حاول حذف بيانات
- يجب أن تفشل إذا كان `delete("role:admin")`

---

## 🔒 نصائح الأمان

### ✅ افعل:
1. استخدم `role:admin` للعمليات الحساسة
2. فعّل Document Security للبيانات الشخصية
3. اجعل القراءة عامة فقط للبيانات غير الحساسة
4. راجع Permissions بانتظام

### ❌ لا تفعل:
1. لا تستخدم `any` للكتابة/الحذف
2. لا تعطي `delete("any")` أبداً
3. لا تسمح بـ `update("any")` للبيانات المهمة
4. لا تنسى تفعيل Document Security عند الحاجة

---

## 📱 الواجهة البصرية (GUI)

### في Appwrite Console:

1. **Collection Settings**:
   ```
   Settings → Permissions → Add a role
   ```

2. **اختر Role**:
   - Any
   - Users  
   - Role (مثل: admin)
   - User (محدد بـ ID)

3. **اختر Permissions**:
   - ☑️ Read
   - ☑️ Create
   - ☑️ Update
   - ☑️ Delete

4. **احفظ**:
   اضغط "Update" أو "Save"

---

## 🆘 حل المشاكل

### المشكلة: "Permission denied"
**الحل**: تأكد من:
- المستخدم مسجل دخول
- له الـ role المطلوب
- Permissions مضبوطة صح

### المشكلة: "لا تظهر البيانات"
**الحل**:
- تأكد من وجود `read("any")` أو `read("users")`
- تأكد من وجود بيانات في الـ collection

### المشكلة: "Cannot create document"
**الحل**:
- تأكد من وجود `create("users")` أو `create("role:admin")`
- تأكد من تسجيل الدخول

---

**🎉 بعد ضبط Permissions، سيعمل النظام بأمان كامل!**
