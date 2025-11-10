# 🎯 ابدأ من هنا - تشغيل Vendoor Scraper

## ⚡ طريقة سريعة (أوتوماتيك)

### 1️⃣ شغل الـ VM من Azure Portal
```
1. اذهب إلى: https://portal.azure.com
2. Virtual Machines → egygo-scraper
3. اضغط "Start"
4. انتظر حتى Status = "Running"
```

### 2️⃣ شغل السكريبت الأوتوماتيك
افتح PowerShell **كـ Administrator** واكتب:

```powershell
cd C:\Users\NoteBook\Desktop\goegy-main
.\deploy-to-vm.ps1
```

**هذا السكريبت سيقوم بـ:**
- ✅ رفع جميع الملفات على الـ VM
- ✅ تثبيت جميع المتطلبات تلقائياً
- ✅ تشغيل سكريبت الـ Scraping
- ✅ إعداد PM2 للتشغيل في الخلفية

**انتظر 5-10 دقائق حتى ينتهي!** ⏳

---

## 📊 مشاهدة النتائج

### من PowerShell:
```powershell
ssh -i egygo-scraper_key.pem azureuser@20.208.131.121
```

### بعد الدخول للـ VM:
```bash
# مشاهدة اللوج مباشرة
pm2 logs vendoor-scraper

# عرض النتائج
cat ~/vendoor-scraper/vendoor-scraping-results.json | python3 -m json.tool | less
```

---

## 🔄 أوامر مفيدة

### التحكم في السكريبت:
```bash
pm2 status                    # عرض الحالة
pm2 restart vendoor-scraper  # إعادة تشغيل
pm2 stop vendoor-scraper     # إيقاف
pm2 logs vendoor-scraper     # مشاهدة اللوج
```

### عرض إحصائيات:
```bash
cd ~/vendoor-scraper
cat vendoor-scraping-results.json | grep -E "totalProducts|successCount|failCount"
```

---

## ✅ التحقق من النجاح

### 1. في Terminal الـ VM:
```bash
pm2 status
# يجب أن يظهر: vendoor-scraper | online
```

### 2. في Appwrite:
افتح: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/databases/main/collection-products

يجب أن تشاهد المنتجات الجديدة! 🎉

---

## 🛑 إيقاف الـ VM (مهم لتوفير التكلفة!)

### من Azure Portal:
```
Virtual Machines → egygo-scraper → Stop
```

**⚠️ تذكر:** أوقف الـ VM دائماً بعد الانتهاء لتوفير رصيد Azure!

---

## 🆘 مشاكل شائعة

### المشكلة: "Permission denied" عند استخدام المفتاح
**الحل:**
```powershell
icacls egygo-scraper_key.pem /inheritance:r
icacls egygo-scraper_key.pem /grant:r "%username%:R"
```

### المشكلة: السكريبت لا يعمل
**الحل:**
```bash
# أعد تشغيل الإعداد
bash ~/setup-vm.sh

# ثم أعد تشغيل السكريبت
cd ~/vendoor-scraper
pm2 restart vendoor-scraper
```

### المشكلة: نفاذ الذاكرة
**الحل:**
```bash
# تحقق من Swap
free -h
swapon --show

# إذا لم يكن موجود، شغل الإعداد مرة أخرى
bash ~/setup-vm.sh
```

---

## 📞 للمساعدة

راجع الملفات التفصيلية:
- **CONNECT_AND_RUN.md** - دليل مفصل للاتصال
- **AZURE_VM_SETUP_GUIDE.md** - دليل شامل للإعداد
- **QUICK_START_VM.md** - دليل سريع

---

## 🎉 الخلاصة

```powershell
# الخطوات الأساسية فقط:

1. شغل VM من Azure Portal
2. cd C:\Users\NoteBook\Desktop\goegy-main
3. .\deploy-to-vm.ps1
4. انتظر الانتهاء
5. تحقق من Appwrite Dashboard

✅ تم!
```

---

**💡 نصيحة:** شغل السكريبت مرة كل 6 ساعات للحصول على أحدث المنتجات من Vendoor!
