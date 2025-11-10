# 🤖 دليل Telegram Bot للإشعارات

## 📱 معلومات البوت

- **Bot Username**: @egygo_bot
- **Bot Token**: `8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo`
- **Bot URL**: https://t.me/egygo_bot

---

## ⚙️ الإعداد السريع

### 1️⃣ تفعيل البوت:

1. افتح Telegram
2. ابحث عن: **@egygo_bot**
3. اضغط **Start** أو أرسل `/start`

✅ الآن البوت جاهز لإرسال الإشعارات!

---

### 2️⃣ اختبار البوت (على جهازك المحلي):

```bash
cd c:\Users\NoteBook\Desktop\goegy-main
node scripts/telegram-notifier.mjs
```

**ستحصل على:**
- ✅ رسالة اختبار على Telegram
- ✅ تأكيد أن البوت يعمل

---

### 3️⃣ على Azure VM:

السكريبت الجديد `vendoor-with-telegram.mjs` يتضمن كل شيء!

```bash
# على الـ VM
cd ~/vendoor-scraper
node vendoor-with-telegram.mjs
```

---

## 📊 ما ستحصل عليه

### عند بدء السكريبت:
```
🚀 بدء Vendoor Scraper

📦 عدد المنتجات: 36
⏳ جاري المعالجة...
```

### عند الانتهاء:
```
🎉 تقرير Vendoor Scraper
━━━━━━━━━━━━━━━━━━━━━━

📊 الإحصائيات:
✅ نجح: 20 منتج
❌ فشل: 16 منتج
📦 إجمالي: 36 منتج
📈 نسبة النجاح: 55.6%

⏱️ المدة: 15د 30ث
🕐 10/11/2025, 7:30:00 م

🏆 أمثلة:
1. Desire for a Man Alfred Dunhill...
   VN2526263871 - 399 ج
2. Joud fragrance...
   VN3532503466 - 399 ج
3. 212 Sexy Carolina Herrera...
   VN5540776108 - 450 ج

━━━━━━━━━━━━━━━━━━━━━━
✅ اكتمل!
```

---

## 🔧 الملفات

### على جهازك المحلي:
- `scripts/telegram-notifier.mjs` - مكتبة Telegram

### على Azure VM:
- `vendoor-with-telegram.mjs` - السكريبت المحدث مع Telegram

---

## 🚀 التشغيل التلقائي

### على VM (مع إرسال تقرير):

```bash
# تشغيل تلقائي عند بدء VM
cd ~/vendoor-scraper
cat > auto-scrape-telegram.sh << 'EOF'
#!/bin/bash
cd /home/azureuser/vendoor-scraper
echo "Started: $(date)" >> scrape.log
node vendoor-with-telegram.mjs >> scrape.log 2>&1
echo "Completed: $(date)" >> scrape.log
sudo shutdown -h now
EOF

chmod +x auto-scrape-telegram.sh

# إعداد systemd service
sudo cat > /etc/systemd/system/vendoor-telegram.service << 'EOF'
[Unit]
Description=Vendoor Scraper with Telegram
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
User=azureuser
WorkingDirectory=/home/azureuser/vendoor-scraper
ExecStart=/home/azureuser/vendoor-scraper/auto-scrape-telegram.sh
RemainAfterExit=no

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable vendoor-telegram.service

echo "✅ جاهز للتشغيل التلقائي!"
```

---

## 🎯 المميزات

✅ **إشعار البداية**: عند بدء السكريبت  
✅ **تقرير كامل**: عند الانتهاء  
✅ **إشعارات الأخطاء**: في حالة حدوث مشاكل  
✅ **إحصائيات مفصلة**: نجاح/فشل/مدة  
✅ **أمثلة من المنتجات**: أول 3-5 منتجات  
✅ **رابط Appwrite**: فتح المنتجات مباشرة  

---

## 🔒 الأمان

⚠️ **مهم**: Bot Token حساس! لا تشاركه مع أحد.

في `.env` (اختياري):
```bash
TELEGRAM_BOT_TOKEN=8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo
TELEGRAM_CHAT_ID=your_chat_id_here
```

---

## 🧪 الاختبار

### اختبار سريع:

```bash
# على جهازك
cd c:\Users\NoteBook\Desktop\goegy-main
node scripts/telegram-notifier.mjs
```

### اختبار على VM:

```bash
# على VM
cd ~/vendoor-scraper
# إضافة هذا في نهاية السكريبت للاختبار
node -e "
const https = require('https');
const data = JSON.stringify({
  chat_id: 'CHAT_ID',
  text: '🧪 Test from VM'
});
const options = {
  hostname: 'api.telegram.org',
  port: 443,
  path: '/bot8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo/sendMessage',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
};
const req = https.request(options, res => {
  res.on('data', d => process.stdout.write(d));
});
req.write(data);
req.end();
"
```

---

## ✅ قائمة التحقق

قبل التشغيل:
- [ ] أرسلت `/start` للبوت على Telegram
- [ ] اختبرت البوت من جهازك المحلي
- [ ] نسخت السكريبت الجديد على VM
- [ ] السكريبت يعمل بدون أخطاء

---

## 🎉 كل شيء جاهز!

**الآن ستحصل على:**
- 📱 إشعار فوري عند بدء السكريبت
- 📊 تقرير كامل ومفصل عند الانتهاء
- ❌ تنبيهات فورية في حالة الأخطاء

**استمتع بالنظام! 🚀**
