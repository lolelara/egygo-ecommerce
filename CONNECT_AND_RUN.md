# 🚀 دليل الاتصال والتشغيل على Azure VM

## 🔑 الاتصال بالـ VM باستخدام المفتاح

### من PowerShell على Windows:

```powershell
# الانتقال لمجلد المشروع
cd C:\Users\NoteBook\Desktop\goegy-main

# الاتصال بالـ VM
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121
```

**ملاحظة:** إذا واجهت مشكلة في الصلاحيات:
```powershell
# تعيين صلاحيات المفتاح (على Windows)
icacls egygo-scraper_key.pem /inheritance:r
icacls egygo-scraper_key.pem /grant:r "%username%:R"
```

---

## 📦 الخطوة 1: رفع الملفات على الـ VM

### من PowerShell على جهازك:

```powershell
# الانتقال لمجلد المشروع
cd C:\Users\NoteBook\Desktop\goegy-main

# رفع سكريبت الإعداد
scp -i egygo-scraper_key.pem scripts\setup-vm.sh azureuser@20.208.131.121:~/

# رفع سكريبت الـ Scraping
scp -i egygo-scraper_key.pem scripts\vendoor-to-appwrite.mjs azureuser@20.208.131.121:~/
```

---

## ⚙️ الخطوة 2: تشغيل الإعداد على الـ VM

### اتصل بالـ VM:
```powershell
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121
```

### بعد الدخول للـ VM:
```bash
# إعطاء صلاحية التنفيذ
chmod +x ~/setup-vm.sh

# تشغيل سكريبت الإعداد (سيستغرق 3-5 دقائق)
bash ~/setup-vm.sh
```

**انتظر حتى ينتهي الإعداد!** ✅

---

## 🚀 الخطوة 3: نقل وتشغيل السكريبت

```bash
# نقل السكريبت للمجلد الصحيح
mv ~/vendoor-to-appwrite.mjs ~/vendoor-scraper/

# الانتقال للمجلد
cd ~/vendoor-scraper

# تشغيل السكريبت
node vendoor-to-appwrite.mjs
```

---

## 🔄 الطريقة الأفضل: استخدام PM2

### تشغيل في الخلفية:
```bash
cd ~/vendoor-scraper

# تشغيل مع PM2
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper

# مشاهدة اللوج مباشرة
pm2 logs vendoor-scraper
```

### أوامر PM2 المفيدة:
```bash
# عرض الحالة
pm2 status

# إيقاف
pm2 stop vendoor-scraper

# إعادة تشغيل
pm2 restart vendoor-scraper

# عرض اللوج
pm2 logs vendoor-scraper --lines 100

# حذف
pm2 delete vendoor-scraper
```

---

## 📊 مراقبة النتائج

### عرض ملف النتائج:
```bash
# بصيغة خام
cat ~/vendoor-scraper/vendoor-scraping-results.json

# بصيغة منسقة
cat ~/vendoor-scraper/vendoor-scraping-results.json | python3 -m json.tool | less
```

### عرض آخر 50 منتج:
```bash
cat ~/vendoor-scraper/vendoor-scraping-results.json | python3 -c "import sys, json; data = json.load(sys.stdin); print(f\"عدد المنتجات: {data['totalProducts']}\"); print(f\"نجح: {data['successCount']}\"); print(f\"فشل: {data['failCount']}\")"
```

---

## ⏰ جدولة تلقائية (اختياري)

### تشغيل كل 6 ساعات:
```bash
# فتح Crontab
crontab -e

# اختر محرر (nano أسهل - اختر رقم 1)
# أضف هذا السطر في النهاية:
0 */6 * * * cd ~/vendoor-scraper && /usr/bin/node vendoor-to-appwrite.mjs >> ~/scraper-cron.log 2>&1

# حفظ: Ctrl+X ثم Y ثم Enter
```

### مشاهدة لوج Cron:
```bash
tail -f ~/scraper-cron.log
```

---

## 🛑 الخروج وإيقاف الـ VM

### الخروج من SSH:
```bash
exit
```

### إيقاف الـ VM (من جهازك):
```powershell
# من Azure Portal
# Virtual Machines → egygo-scraper → Stop

# أو من PowerShell (إذا عندك Azure CLI)
az vm deallocate --resource-group egygo-scraper --name egygo-scraper
```

---

## 🔍 استكشاف الأخطاء

### المتصفح لا يعمل (Puppeteer)?
```bash
# تثبيت Chrome يدوياً
cd ~
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb -y
```

### نفاذ الذاكرة?
```bash
# التحقق من الذاكرة
free -h

# التحقق من Swap
swapon --show

# إذا لم يكن Swap موجود
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### السكريبت يتوقف؟
```bash
# استخدم PM2 بدلاً من node مباشرة
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper
pm2 save  # حفظ القائمة
pm2 startup  # تشغيل تلقائي عند إعادة التشغيل
```

---

## 📝 سكريبت سريع شامل

نسخ ولصق مباشرة في PowerShell على جهازك:

```powershell
# الجزء 1: رفع الملفات
cd C:\Users\NoteBook\Desktop\goegy-main
scp -i egygo-scraper_key.pem scripts\setup-vm.sh azureuser@20.208.131.121:~/
scp -i egygo-scraper_key.pem scripts\vendoor-to-appwrite.mjs azureuser@20.208.131.121:~/

# الجزء 2: الاتصال والتنفيذ
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121
```

بعد الاتصال، نسخ ولصق في Terminal الـ VM:

```bash
# إعداد البيئة
chmod +x ~/setup-vm.sh
bash ~/setup-vm.sh

# بعد انتهاء الإعداد
mv ~/vendoor-to-appwrite.mjs ~/vendoor-scraper/
cd ~/vendoor-scraper

# تشغيل
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper
pm2 logs vendoor-scraper
```

---

## ✅ تحقق من النجاح

### 1. في Terminal الـ VM:
```bash
# عرض حالة PM2
pm2 status

# يجب أن يظهر:
# vendoor-scraper | online | ...
```

### 2. في ملف النتائج:
```bash
cat ~/vendoor-scraper/vendoor-scraping-results.json | grep successCount
# يجب أن يظهر: "successCount": [رقم أكبر من 0]
```

### 3. في Appwrite Dashboard:
افتح: `https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/databases/main/collection-products`

يجب أن تشاهد المنتجات الجديدة! 🎉

---

## 🎯 ملخص الأوامر السريعة

```bash
# رفع (من جهازك)
scp -i egygo-scraper_key.pem scripts/* azureuser@20.208.131.121:~/

# اتصال
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121

# إعداد (مرة واحدة)
chmod +x ~/setup-vm.sh && bash ~/setup-vm.sh

# تشغيل
cd ~/vendoor-scraper
mv ~/vendoor-to-appwrite.mjs ./
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper

# مراقبة
pm2 logs vendoor-scraper

# عرض النتائج
cat vendoor-scraping-results.json | python3 -m json.tool
```

---

**🚀 جاهز للانطلاق!**

**ملاحظة:** احفظ هذا الملف - ستحتاجه في كل مرة تريد تشغيل السكريبت! 📝
