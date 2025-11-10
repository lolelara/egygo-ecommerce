# 🚀 دليل تشغيل سكريبت Vendoor على Azure VM

## 📋 معلومات الـ VM

```
Server: egygo-scraper
IP: 20.208.131.121
OS: Ubuntu 24.04 LTS
Size: Standard D2s v3 (2 vcpus, 8 GiB RAM)
Location: Switzerland North
```

---

## 🔧 الخطوة 1: تشغيل الـ VM وربطه بالـ SSH

### 1. تشغيل الـ VM من Azure Portal
```bash
# في Azure Portal:
1. اذهب إلى Virtual Machines
2. اختر "egygo-scraper"
3. اضغط "Start"
4. انتظر حتى يصبح Status = "Running"
```

### 2. الاتصال بالـ VM عبر SSH
```bash
# من PowerShell أو CMD على جهازك المحلي
ssh azureuser@20.208.131.121

# أو إذا كنت تستخدم مفتاح SSH
ssh -i path/to/your/key.pem azureuser@20.208.131.121
```

---

## 📦 الخطوة 2: تثبيت المتطلبات على Ubuntu

### 1. تحديث النظام
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. تثبيت Node.js 20.x
```bash
# تحميل وإضافة NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# تثبيت Node.js
sudo apt install -y nodejs

# التحقق من الإصدار
node --version  # يجب أن يظهر v20.x.x
npm --version
```

### 3. تثبيت المتطلبات الضرورية لـ Puppeteer
```bash
# تثبيت Chrome dependencies
sudo apt install -y \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils
```

### 4. تثبيت Git (اختياري)
```bash
sudo apt install -y git
```

---

## 📂 الخطوة 3: نقل الملفات إلى الـ VM

### الطريقة 1: استخدام SCP (من جهازك المحلي)
```bash
# نقل السكريبت
scp C:\Users\NoteBook\Desktop\goegy-main\scripts\vendoor-to-appwrite.mjs azureuser@20.208.131.121:~/

# نقل package.json (اختياري)
scp C:\Users\NoteBook\Desktop\goegy-main\package.json azureuser@20.208.131.121:~/
```

### الطريقة 2: استخدام WinSCP
1. تحميل WinSCP من https://winscp.net
2. اتصل بالـ VM:
   - Host: `20.208.131.121`
   - Username: `azureuser`
   - Password: (أو استخدم SSH key)
3. اسحب الملفات من جهازك إلى الـ VM

### الطريقة 3: نسخ مباشر (الأسهل)
```bash
# على الـ VM، إنشاء الملف مباشرة
nano ~/vendoor-to-appwrite.mjs
# ثم الصق محتوى السكريبت
# اضغط Ctrl+X ثم Y ثم Enter للحفظ
```

---

## 🔨 الخطوة 4: إعداد المشروع على الـ VM

### 1. إنشاء مجلد المشروع
```bash
mkdir -p ~/vendoor-scraper
cd ~/vendoor-scraper
```

### 2. نقل السكريبت
```bash
mv ~/vendoor-to-appwrite.mjs ./
```

### 3. تهيئة مشروع Node.js وتثبيت المكتبات
```bash
# تهيئة package.json
npm init -y

# تثبيت المكتبات المطلوبة
npm install puppeteer node-appwrite

# تثبيت dependencies إضافية
npm install
```

---

## ▶️ الخطوة 5: تشغيل السكريبت

### 1. تشغيل مباشر
```bash
cd ~/vendoor-scraper
node vendoor-to-appwrite.mjs
```

### 2. تشغيل في الخلفية (Background)
```bash
# استخدام nohup للتشغيل في الخلفية
nohup node vendoor-to-appwrite.mjs > scraper.log 2>&1 &

# مشاهدة اللوج
tail -f scraper.log

# للتوقف: اضغط Ctrl+C
```

### 3. تشغيل باستخدام PM2 (الأفضل)
```bash
# تثبيت PM2
sudo npm install -g pm2

# تشغيل السكريبت
pm2 start vendoor-to-appwrite.mjs --name "vendoor-scraper"

# مراقبة السكريبت
pm2 logs vendoor-scraper

# إيقاف السكريبت
pm2 stop vendoor-scraper

# إعادة تشغيله
pm2 restart vendoor-scraper

# حذف من PM2
pm2 delete vendoor-scraper

# عرض جميع العمليات
pm2 list
```

---

## ⏰ الخطوة 6: جدولة تلقائية (Cron Job)

### إعداد Cron للتشغيل التلقائي

```bash
# فتح crontab
crontab -e

# إضافة سطر جديد لتشغيل السكريبت كل 6 ساعات
0 */6 * * * cd ~/vendoor-scraper && /usr/bin/node vendoor-to-appwrite.mjs >> ~/scraper-cron.log 2>&1

# حفظ والخروج (Ctrl+X ثم Y ثم Enter)
```

### جداول مقترحة:
```bash
# كل 6 ساعات
0 */6 * * * cd ~/vendoor-scraper && node vendoor-to-appwrite.mjs

# كل يوم عند الساعة 3 صباحاً
0 3 * * * cd ~/vendoor-scraper && node vendoor-to-appwrite.mjs

# كل 12 ساعة (منتصف الليل والظهر)
0 0,12 * * * cd ~/vendoor-scraper && node vendoor-to-appwrite.mjs
```

---

## 📊 الخطوة 7: مراقبة النتائج

### 1. عرض اللوجات
```bash
# لوج السكريبت
cat ~/vendoor-scraper/scraper.log

# لوج PM2
pm2 logs vendoor-scraper

# لوج Cron
cat ~/scraper-cron.log
```

### 2. عرض النتائج
```bash
# ملف النتائج JSON
cat ~/vendoor-scraper/vendoor-scraping-results.json

# أو بشكل منسق
cat ~/vendoor-scraper/vendoor-scraping-results.json | python3 -m json.tool
```

---

## 🔒 الخطوة 8: الأمان (Security Best Practices)

### 1. إنشاء ملف .env للمتغيرات الحساسة
```bash
cd ~/vendoor-scraper
nano .env
```

### محتوى .env:
```bash
VENDOOR_EMAIL=almlmibrahym574@gmail.com
VENDOOR_PASSWORD=hema2004
APPWRITE_API_KEY=standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5
```

### 2. حماية الملف
```bash
chmod 600 .env
```

### 3. تعديل السكريبت لقراءة .env
```bash
npm install dotenv
```

ثم أضف في أول السكريبت:
```javascript
import dotenv from 'dotenv';
dotenv.config();

const VENDOOR_EMAIL = process.env.VENDOOR_EMAIL;
const VENDOOR_PASSWORD = process.env.VENDOOR_PASSWORD;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
```

---

## 🐛 استكشاف الأخطاء (Troubleshooting)

### مشكلة: Puppeteer لا يعمل
```bash
# تثبيت Chrome يدوياً
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
```

### مشكلة: نفاذ الذاكرة (Out of Memory)
```bash
# إضافة Swap Space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# للتفعيل الدائم
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### مشكلة: Timeout في Puppeteer
```javascript
// في السكريبت، زيادة timeout
await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 }); // 120 ثانية
```

---

## 🧹 الخطوة 9: تنظيف وإيقاف الـ VM

### إيقاف السكريبت
```bash
# إيقاف PM2
pm2 stop all

# أو إيقاف process معين
pkill -f "vendoor-to-appwrite"
```

### إيقاف الـ VM لتوفير التكلفة
```bash
# من Azure Portal:
Virtual Machines > egygo-scraper > Stop

# أو من Azure CLI
az vm deallocate --resource-group egygo-scraper --name egygo-scraper
```

---

## 📝 ملاحظات مهمة

1. **التكلفة**: تذكر إيقاف الـ VM عندما لا تحتاجه لتوفير رصيد Azure
2. **النسخ الاحتياطي**: احفظ نسخة من النتائج قبل إيقاف الـ VM
3. **المراقبة**: راقب استهلاك الذاكرة والـ CPU
4. **الأمان**: لا تشارك API Keys أو كلمات المرور

---

## ✅ قائمة مرجعية سريعة

- [ ] تشغيل الـ VM من Azure Portal
- [ ] الاتصال بالـ VM عبر SSH
- [ ] تثبيت Node.js و dependencies
- [ ] نقل السكريبت إلى الـ VM
- [ ] تثبيت Puppeteer و node-appwrite
- [ ] تشغيل السكريبت
- [ ] إعداد جدولة تلقائية (Cron أو PM2)
- [ ] مراقبة النتائج
- [ ] إيقاف الـ VM عند الانتهاء

---

## 🆘 الدعم

إذا واجهت أي مشكلة:
1. تحقق من اللوجات
2. تأكد من تثبيت جميع المكتبات
3. تأكد من صحة API Keys
4. راجع الأخطاء في Console

---

**🎉 بالتوفيق في تشغيل السكريبت!**
