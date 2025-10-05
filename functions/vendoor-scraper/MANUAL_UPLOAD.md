# 📦 رفع Function يدوياً إلى Appwrite

بما أن `appwrite push` لا يعمل، استخدم الطريقة اليدوية:

## الخطوات:

### 1️⃣ تم إنشاء ملف ZIP ✅
الملف موجود في: `functions/vendoor-scraper/vendoor-scraper.zip`

### 2️⃣ افتح Appwrite Console
```
https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/functions/function-vendoor-scraper
```

### 3️⃣ اذهب إلى تبويب "Deployments"

### 4️⃣ اضغط "Create deployment"

### 5️⃣ املأ البيانات:
- **Entrypoint**: `src/main.js`
- **Build commands**: `npm install`
- **رفع الملف**: اختر `vendoor-scraper.zip`

### 6️⃣ اضغط "Create"

### 7️⃣ انتظر Build يكتمل (2-3 دقائق)

---

## ✅ بعد رفع الكود:

### اختبر Function من Console:
اذهب لتبويب **Execute** وجرب:

```json
{
  "action": "scrape-page",
  "page": 1
}
```

يجب أن تحصل على:
```json
{
  "success": true,
  "products": [...]
}
```

---

## 🔧 إذا فشل:

تحقق من Logs في تبويب **Logs** للتأكد من:
- ✅ npm install نجح
- ✅ Puppeteer تم تثبيته
- ✅ Environment Variables موجودة (VENDOOR_EMAIL, VENDOOR_PASSWORD)

---

## 📝 ملاحظات:
- حجم الملف: ~2KB (فقط الكود، بدون node_modules)
- Puppeteer سيتم تحميله أثناء Build (~300MB)
- Build يستغرق 2-3 دقائق
