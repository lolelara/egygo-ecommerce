# 🚀 تشغيل Vendoor Scraper على Azure VM

## 📋 معلومات الـ VM

```
VM Name: egygo-scraper
IP Address: 20.208.131.121
OS: Ubuntu 24.04 LTS
Size: Standard D2s v3 (2 vCPUs, 8 GiB RAM)
Location: Switzerland North
Status: Stopped (يحتاج تشغيل)
```

## 1️⃣ تشغيل الـ VM من Azure Portal

### خيار أ: من الموقع
1. اذهب إلى: https://portal.azure.com
2. ابحث عن "egygo-scraper"
3. اضغط **Start**
4. انتظر حتى يصبح Status: **Running**

### خيار ب: من Azure CLI
```bash
az vm start --resource-group egygo-scraper --name egygo-scraper
```

## 2️⃣ تجهيز SSH Key على جهازك المحلي

### على Windows (PowerShell):
```powershell
# الانتقال إلى مجلد المشروع
cd C:\Users\NoteBook\Desktop\goegy-main

# تعيين permissions للـ SSH key
icacls egygo-scraper_key.pem /inheritance:r
icacls egygo-scraper_key.pem /grant:r "%USERNAME%:R"
```

### على Linux/Mac:
```bash
cd /path/to/goegy-main
chmod 400 egygo-scraper_key.pem
```

## 3️⃣ الاتصال بالـ VM

### الأمر الأساسي:
```bash
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121
```

> **ملاحظة**: إذا كان اسم المستخدم مختلف، جرّب:
> - `ubuntu@20.208.131.121`
> - `administrator@20.208.131.121`

### إذا واجهت خطأ "Host key verification":
```bash
ssh -i egygo-scraper_key.pem -o StrictHostKeyChecking=no azureuser@20.208.131.121
```

## 4️⃣ تثبيت Node.js على VM

بعد الاتصال، نفّذ الأوامر التالية:

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# التحقق من التثبيت
node --version  # يجب أن يظهر v20.x.x
npm --version
```

## 5️⃣ رفع ملفات السكريبت إلى VM

### من جهازك المحلي (PowerShell أو Terminal جديد):

```bash
# إنشاء المجلد على VM
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121 "mkdir -p ~/vendoor-scraper"

# رفع السكريبت
scp -i egygo-scraper_key.pem scripts/vendoor-scraper-with-live-updates.mjs azureuser@20.208.131.121:~/vendoor-scraper/

# التحقق من الرفع
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121 "ls -lh ~/vendoor-scraper/"
```

## 6️⃣ تثبيت Dependencies على VM

```bash
# الاتصال بالـ VM
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121

# الدخول إلى مجلد السكريبت
cd ~/vendoor-scraper

# تثبيت المكتبات المطلوبة
npm install puppeteer node-appwrite

# تثبيت dependencies إضافية لـ Puppeteer على Ubuntu
sudo apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
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

## 7️⃣ تشغيل السكريبت

### تشغيل عادي:
```bash
cd ~/vendoor-scraper
node vendoor-scraper-with-live-updates.mjs
```

### تشغيل في الخلفية (Background):
```bash
# تشغيل مع nohup (يستمر حتى بعد قطع الاتصال)
nohup node vendoor-scraper-with-live-updates.mjs > scraper.log 2>&1 &

# الحصول على Process ID
echo $!

# متابعة الـ logs في الوقت الفعلي
tail -f scraper.log
```

### تشغيل مع screen (recommended):
```bash
# تثبيت screen
sudo apt-get install -y screen

# إنشاء session جديد
screen -S vendoor-scraper

# تشغيل السكريبت
node vendoor-scraper-with-live-updates.mjs

# للخروج من screen (السكريبت يستمر): اضغط Ctrl+A ثم D

# للعودة إلى screen:
screen -r vendoor-scraper

# لعرض جميع sessions:
screen -ls

# لإيقاف screen:
screen -X -S vendoor-scraper quit
```

## 8️⃣ جدولة تلقائية (Cron Job)

### تشغيل يومياً الساعة 2 صباحاً:

```bash
# فتح crontab
crontab -e

# إضافة السطر التالي:
0 2 * * * cd ~/vendoor-scraper && /usr/bin/node vendoor-scraper-with-live-updates.mjs >> ~/scraper-cron.log 2>&1

# حفظ والخروج (Ctrl+X ثم Y ثم Enter)

# التحقق من الـ cron job:
crontab -l
```

### شرح Cron:
- `0 2 * * *` = كل يوم الساعة 2:00 صباحاً
- `cd ~/vendoor-scraper` = الدخول للمجلد
- `/usr/bin/node` = مسار Node.js
- `>> ~/scraper-cron.log` = حفظ الـ logs

## 9️⃣ مراقبة السكريبت

### التحقق من running processes:
```bash
ps aux | grep node
```

### إيقاف السكريبت:
```bash
# العثور على Process ID
ps aux | grep vendoor-scraper

# إيقاف
kill -9 <PID>
```

### مشاهدة الـ logs:
```bash
# آخر 100 سطر
tail -100 scraper.log

# مشاهدة مباشرة
tail -f scraper.log

# البحث في الـ logs
grep "✅" scraper.log
grep "❌" scraper.log
```

## 🔟 أوامر مفيدة

### التحقق من استخدام الموارد:
```bash
# CPU & Memory
htop
# أو
top

# Disk usage
df -h

# Memory usage
free -h
```

### تنظيف بعد الانتهاء:
```bash
# حذف logs قديمة
rm ~/vendoor-scraper/*.log

# حذف JSON files قديمة
rm ~/vendoor-scraper/*.json
```

## 🛑 إيقاف VM (توفير تكاليف)

### بعد انتهاء السكريبت:
```bash
# من Azure Portal
# اضغط "Stop" على egygo-scraper

# أو من Azure CLI
az vm deallocate --resource-group egygo-scraper --name egygo-scraper
```

> **مهم**: VM متوقف (Deallocated) = لا يتم احتساب تكاليف compute

## 📱 متابعة التقدم

### على Telegram:
- ستصلك رسالة عند البداية ✅
- تحديثات كل 5 منتجات ⚡
- تقرير نهائي عند الانتهاء 🎉

### على VM:
```bash
# مشاهدة الـ logs
tail -f scraper.log
# أو
tail -f ~/scraper-cron.log  # إذا كان من cron
```

## 🚨 استكشاف الأخطاء

### خطأ: "Permission denied (publickey)"
```bash
# تحقق من permissions
ls -l egygo-scraper_key.pem

# يجب أن يكون: -r--------

# على Windows:
icacls egygo-scraper_key.pem
```

### خطأ: "Connection timed out"
- تأكد أن VM في حالة **Running**
- تحقق من IP: `20.208.131.121`
- تأكد من فتح Port 22 في NSG (Network Security Group)

### خطأ: Puppeteer launch failed
```bash
# تثبيت dependencies الناقصة
sudo apt-get update
sudo apt-get install -y \
  chromium-browser \
  libgbm-dev
```

### خطأ: npm install failed
```bash
# تنظيف cache
npm cache clean --force

# إعادة المحاولة
npm install puppeteer node-appwrite
```

## 📝 ملاحظات مهمة

1. **VM متوقف حالياً** - يجب تشغيله أولاً من Azure Portal
2. **اسم المستخدم الافتراضي**: `azureuser` (قد يكون `ubuntu`)
3. **SSH Port**: 22 (افتراضي)
4. **Telegram Bot**: سيرسل تحديثات تلقائياً
5. **هامش الربح**: +10 ج.م على كل منتج

## 🔗 روابط سريعة

- **Azure Portal**: https://portal.azure.com
- **VM Dashboard**: https://portal.azure.com/#@/resource/subscriptions/c9d521e1-eae7-48c9-91cb-ca2b72d83c02/resourceGroups/egygo-scraper/providers/Microsoft.Compute/virtualMachines/egygo-scraper/overview
- **Admin Panel**: https://egygo.me/#/admin/vendoor-products

---

## ✅ الخطوات السريعة (TL;DR)

```bash
# 1. تشغيل VM من Azure Portal (Start button)

# 2. الاتصال
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121

# 3. تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. من جهازك: رفع السكريبت
scp -i egygo-scraper_key.pem scripts/vendoor-scraper-with-live-updates.mjs azureuser@20.208.131.121:~/vendoor-scraper/

# 5. على VM: تثبيت dependencies
cd ~/vendoor-scraper
npm install puppeteer node-appwrite
sudo apt-get install -y chromium-browser

# 6. تشغيل
screen -S vendoor-scraper
node vendoor-scraper-with-live-updates.mjs
# اضغط Ctrl+A ثم D للخروج

# 7. متابعة على Telegram! 📱
```

**جاهز للتشغيل! 🚀**
