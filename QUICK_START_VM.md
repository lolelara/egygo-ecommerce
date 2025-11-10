# 🚀 دليل سريع: تشغيل Vendoor Scraper على Azure VM

## ⚡ الخطوات السريعة (5 دقائق)

### 1️⃣ تشغيل الـ VM
```bash
# من Azure Portal
Virtual Machines → egygo-scraper → Start
```

### 2️⃣ الاتصال بالـ VM
```powershell
# من PowerShell على جهازك
ssh azureuser@20.208.131.121
```

### 3️⃣ رفع الملفات

#### من PowerShell على جهازك المحلي:
```powershell
# نقل سكريبت Setup
scp C:\Users\NoteBook\Desktop\goegy-main\scripts\setup-vm.sh azureuser@20.208.131.121:~/

# نقل سكريبت الـ Scraping
scp C:\Users\NoteBook\Desktop\goegy-main\scripts\vendoor-to-appwrite.mjs azureuser@20.208.121:~/
```

### 4️⃣ تشغيل Setup (مرة واحدة فقط)
```bash
# على الـ VM
chmod +x ~/setup-vm.sh
bash ~/setup-vm.sh
```

### 5️⃣ نقل السكريبت للمجلد الصحيح
```bash
mv ~/vendoor-to-appwrite.mjs ~/vendoor-scraper/
cd ~/vendoor-scraper
```

### 6️⃣ تشغيل السكريبت
```bash
# تشغيل مباشر
node vendoor-to-appwrite.mjs

# أو تشغيل في الخلفية مع PM2
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper
pm2 logs vendoor-scraper
```

---

## 🔄 أوامر سريعة

### مراقبة السكريبت
```bash
# عرض اللوج
pm2 logs vendoor-scraper

# عرض الحالة
pm2 status

# عرض استهلاك الموارد
pm2 monit
```

### التحكم في السكريبت
```bash
# إيقاف
pm2 stop vendoor-scraper

# إعادة تشغيل
pm2 restart vendoor-scraper

# حذف
pm2 delete vendoor-scraper
```

### عرض النتائج
```bash
# ملف JSON
cat ~/vendoor-scraper/vendoor-scraping-results.json

# بتنسيق
python3 -m json.tool ~/vendoor-scraper/vendoor-scraping-results.json
```

---

## ⏰ جدولة تلقائية

### إعداد Cron لتشغيل كل 6 ساعات
```bash
crontab -e
```

أضف هذا السطر:
```bash
0 */6 * * * cd ~/vendoor-scraper && /usr/bin/node vendoor-to-appwrite.mjs >> ~/scraper-cron.log 2>&1
```

---

## 🛑 إيقاف الـ VM (لتوفير التكلفة)

### من Azure Portal:
```
Virtual Machines → egygo-scraper → Stop
```

### من Azure CLI:
```bash
az vm deallocate --resource-group egygo-scraper --name egygo-scraper
```

---

## 🆘 حل المشاكل السريع

### السكريبت لا يعمل؟
```bash
# تحقق من Node.js
node --version  # يجب v20.x.x

# تحقق من المكتبات
cd ~/vendoor-scraper
npm list

# إعادة تثبيت
npm install
```

### نفاذ الذاكرة؟
```bash
# عرض الذاكرة
free -h

# Swap موجود؟
swapon --show

# إضافة Swap
sudo bash ~/setup-vm.sh
```

### Timeout في Puppeteer؟
```bash
# تعديل السكريبت وزيادة timeout
nano ~/vendoor-scraper/vendoor-to-appwrite.mjs
# غير timeout: 60000 إلى timeout: 120000
```

---

## 📊 معلومات مفيدة

### استهلاك الموارد
```bash
# CPU & Memory
top

# مساحة القرص
df -h

# العمليات الجارية
ps aux | grep node
```

### اللوجات
```bash
# PM2 logs
pm2 logs vendoor-scraper --lines 100

# Cron logs
tail -100 ~/scraper-cron.log

# System logs
sudo journalctl -u cron -f
```

---

## ✅ تحقق من النجاح

### الـ Scraping نجح إذا:
1. ✅ ظهرت رسالة "✅ تمت العملية بنجاح!"
2. ✅ تم إنشاء ملف `vendoor-scraping-results.json`
3. ✅ `successCount` > 0 في الملف
4. ✅ ظهرت المنتجات في Appwrite Dashboard

### تحقق من Appwrite:
```
https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/databases/main/collection-products
```

---

## 🎯 الخلاصة

```bash
# الأوامر الأساسية فقط:

# 1. رفع الملفات
scp setup-vm.sh vendoor-to-appwrite.mjs azureuser@20.208.131.121:~/

# 2. تشغيل Setup
ssh azureuser@20.208.131.121
bash ~/setup-vm.sh

# 3. تشغيل السكريبت
cd ~/vendoor-scraper
mv ~/vendoor-to-appwrite.mjs ./
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper

# 4. مراقبة
pm2 logs vendoor-scraper

# 5. إيقاف VM (عند الانتهاء)
# من Azure Portal: Stop VM
```

---

**🎉 جاهز للانطلاق!**
