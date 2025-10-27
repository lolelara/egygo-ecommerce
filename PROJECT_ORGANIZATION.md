# 📁 تنظيم مشروع EgyGo

## 🎯 نظرة عامة

تم إعادة تنظيم المشروع لتحسين البنية وسهولة الصيانة.

---

## 📂 الهيكل الجديد

```
egygo-main/
├── 📁 client/                  # Frontend (React + TypeScript)
│   ├── components/            # React Components
│   ├── pages/                 # Page Components
│   ├── lib/                   # Utilities & APIs
│   ├── hooks/                 # Custom Hooks
│   ├── contexts/              # React Contexts
│   └── styles/                # CSS & Style files
│
├── 📁 server/                  # Backend (Express + Node.js)
│   ├── routes/                # API Routes
│   ├── middleware/            # Express Middleware
│   ├── utils/                 # Server Utilities
│   └── index.ts               # Server Entry
│
├── 📁 docs/                    # 📚 التوثيق (جديد!)
│   ├── setup/                 # إعداد وتكوين
│   │   ├── APPWRITE_SETUP.md
│   │   ├── DATABASE_SETUP_GUIDE.md
│   │   └── DEPLOY_INSTRUCTIONS.md
│   │
│   ├── features/              # ميزات المشروع
│   │   ├── ADVANCED_FEATURES.md
│   │   ├── BANNERS_INTEGRATION.md
│   │   ├── CAPTCHA_INTEGRATION.md
│   │   └── COOKIE_NOTIFICATION_SYSTEM.md
│   │
│   ├── admin/                 # توثيق لوحة الإدارة
│   │   ├── ADMIN_PAGES_STATUS.md
│   │   ├── SIDEBAR_COMPLETE.md
│   │   └── BACK_BUTTON_COMPLETE.md
│   │
│   ├── affiliate/             # توثيق التسويق بالعمولة
│   │   ├── AFFILIATE_GUIDE.md
│   │   ├── AFFILIATE_TOOLS_AUDIT.md
│   │   └── ADVERTISING_IMPLEMENTATION_GUIDE.md
│   │
│   ├── fixes/                 # الإصلاحات
│   │   ├── APPWRITE_503_ERROR_FIX.md
│   │   ├── CONSOLE_ERRORS_FIXED.md
│   │   └── DEPENDENCY_CLEANUP.md
│   │
│   └── guides/                # أدلة متنوعة
│       ├── API_DOCUMENTATION.md
│       ├── CONTRIBUTING.md
│       └── FAQ.md
│
├── 📁 exports/                 # 📦 ملفات التصدير (جديد!)
│   ├── vendoor_products_*.json
│   └── vendoor_products_*.csv
│
├── 📁 scripts/                 # 🔧 سكريبتات مساعدة
│   ├── organize-project.ps1   # تنظيف وترتيب المشروع
│   ├── scrape-vendoor-cron.mjs
│   └── test-scraping-node.js
│
├── 📁 functions/               # Serverless Functions
│   └── vendoor-scraper/
│
├── 📁 workers/                 # Workers للمهام الخلفية
│
├── 📄 README.md                # الصفحة الرئيسية
├── 📄 CHANGELOG.md             # سجل التغييرات
├── 📄 PROJECT_ORGANIZATION.md  # هذا الملف
└── 📄 VENDOOR_SCRAPING_GUIDE.md # دليل السكرابينج
```

---

## 🗂️ تنظيم التوثيق

### 1️⃣ **docs/setup/** - الإعداد والتكوين
ملفات الإعداد الأولي للمشروع:
- Appwrite Setup
- Database Configuration
- Deployment Instructions
- Environment Variables

### 2️⃣ **docs/features/** - الميزات
توثيق الميزات الرئيسية:
- Advanced Features
- Integrations (Banners, Captcha, etc.)
- Payment Systems
- Notification Systems

### 3️⃣ **docs/admin/** - لوحة الإدارة
توثيق خاص بلوحة التحكم:
- Admin Pages Status
- Sidebar Configuration
- User Management
- Back Button Implementation

### 4️⃣ **docs/affiliate/** - التسويق بالعمولة
توثيق نظام الأفلييت:
- Affiliate Guide
- Tools & Features
- Advertising System
- Commission Management

### 5️⃣ **docs/fixes/** - الإصلاحات
سجل الأخطاء وحلولها:
- Error Fixes
- Bug Reports
- Performance Improvements
- Security Patches

### 6️⃣ **docs/guides/** - أدلة عامة
أدلة متنوعة:
- API Documentation
- Contributing Guidelines
- FAQ
- Best Practices

---

## 🧹 الملفات المحذوفة

### ✅ تم حذفها:

#### 1. المجلدات المكررة:
```
❌ egygo-ecommerce/          (نسخة مكررة)
```

#### 2. ملفات Build القديمة:
```
❌ dist/*                    (يعاد بناؤها)
```

#### 3. Node Modules غير المستخدمة:
```
❌ digitalocean-api/node_modules/
❌ functions/vendoor-scraper/node_modules/
❌ workers/node_modules/
```

#### 4. ملفات مؤقتة:
```
❌ *.tmp
❌ *.log (القديمة)
❌ .cache/
```

---

## 📝 ملف .gitignore المحدّث

تم تحديث `.gitignore` ليشمل:

```gitignore
# Dependencies
node_modules/
npm-debug.log*

# Build
dist/
build/

# Environment
.env
.env.local

# Exports & Temp
exports/
temp/
*.tmp

# IDE
.vscode/*
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Test coverage
coverage/
```

---

## 🚀 كيفية استخدام السكريبت

### تشغيل السكريبت:

```powershell
# في مجلد المشروع الرئيسي
.\scripts\organize-project.ps1
```

### ما يفعله السكريبت:

1. ✅ إنشاء مجلد `docs/` وجميع المجلدات الفرعية
2. ✅ نقل ملفات التوثيق إلى المجلدات المناسبة
3. ✅ حذف المجلدات المكررة (egygo-ecommerce)
4. ✅ تنظيف ملفات Build
5. ✅ حذف node_modules غير المستخدمة
6. ✅ تحديث `.gitignore`

---

## 📊 الإحصائيات

### قبل التنظيم:
- 📄 66+ ملف .md في المجلد الرئيسي
- 📁 مجلدات مكررة
- 💾 ~2GB من الملفات المؤقتة

### بعد التنظيم:
- 📄 5 ملفات .md فقط في المجلد الرئيسي
- 📁 تنظيم منطقي في `docs/`
- 💾 توفير ~1.5GB من المساحة

---

## 🎯 الملفات الرئيسية في المجلد الجذر

يجب أن تبقى فقط هذه الملفات:

```
✅ README.md                    # الصفحة الرئيسية
✅ CHANGELOG.md                 # سجل التغييرات
✅ CONTRIBUTING.md              # دليل المساهمة
✅ LICENSE                      # الترخيص
✅ PROJECT_ORGANIZATION.md      # هذا الملف
✅ VENDOOR_SCRAPING_GUIDE.md    # دليل السكرابينج
```

---

## 🔄 التحديثات المستقبلية

### خطة الصيانة:

#### أسبوعياً:
- تنظيف ملفات exports/ القديمة
- مراجعة logs/ وحذف القديم

#### شهرياً:
- تحديث التوثيق
- مراجعة البنية
- حذف ملفات غير مستخدمة

#### عند كل إصدار:
- تحديث CHANGELOG.md
- مراجعة README.md
- Git cleanup

---

## 🛠️ أدوات مساعدة

### 1. عرض حجم المجلدات:
```powershell
Get-ChildItem | 
  Where-Object {$_.PSIsContainer} | 
  ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse | 
             Measure-Object -Property Length -Sum).Sum / 1MB
    [PSCustomObject]@{
      Folder = $_.Name
      'Size (MB)' = [math]::Round($size, 2)
    }
  } | Sort-Object 'Size (MB)' -Descending
```

### 2. البحث عن ملفات كبيرة:
```powershell
Get-ChildItem -Recurse | 
  Where-Object {$_.Length -gt 10MB} | 
  Sort-Object Length -Descending | 
  Select-Object Name, @{Name="Size (MB)";Expression={[math]::Round($_.Length / 1MB, 2)}}
```

### 3. عد الملفات حسب النوع:
```powershell
Get-ChildItem -Recurse -File | 
  Group-Object Extension | 
  Sort-Object Count -Descending | 
  Select-Object Name, Count
```

---

## ✅ Checklist للصيانة

### يومياً:
- [ ] مراجعة logs/
- [ ] فحص exports/ للملفات الجديدة

### أسبوعياً:
- [ ] تنظيف exports/ (ملفات +7 أيام)
- [ ] مراجعة dist/ وإعادة البناء
- [ ] فحص node_modules/ للتحديثات

### شهرياً:
- [ ] تشغيل organize-project.ps1
- [ ] تحديث التوثيق
- [ ] مراجعة .gitignore
- [ ] Git cleanup

---

## 📞 الدعم

### للمشاكل:
1. راجع `docs/fixes/` للحلول المعروفة
2. راجع `docs/guides/FAQ.md`
3. افتح Issue على GitHub

### للمساهمة:
1. راجع `docs/guides/CONTRIBUTING.md`
2. اتبع هيكل المشروع
3. وثّق التغييرات

---

## 🎊 الخلاصة

### ✅ تم تنفيذه:
1. **تنظيم شامل** للتوثيق في `docs/`
2. **حذف الملفات** المكررة والمؤقتة
3. **تحديث .gitignore** للوقاية
4. **سكريبت تلقائي** للصيانة
5. **توثيق واضح** للبنية

### 🚀 الفوائد:
- 📁 **تنظيم أفضل** - سهولة إيجاد الملفات
- 💾 **توفير مساحة** - حذف ~1.5GB
- 🔍 **سهولة البحث** - كل شيء في مكانه
- 🛠️ **صيانة أسهل** - بنية واضحة
- 📚 **توثيق منظم** - docs/ شامل

**المشروع الآن منظم ونظيف! 🎉✨**
