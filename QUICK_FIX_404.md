# 🎯 الحل السريع - صفحات المسوق 404

## المشكلة:
```
https://egygo-ecommerce.appwrite.network/#/affiliate/links → 404
https://egygo-ecommerce.appwrite.network/#/affiliate/analytics → 404
https://egygo-ecommerce.appwrite.network/#/affiliate/creatives → 404
```

## السبب:
النسخة على Appwrite قديمة ولا تحتوي على الصفحات الجديدة!

## الحل (خطوتين فقط):

### 1. تأكد من البناء (تم ✅)
```bash
pnpm build
```
**النتيجة:** مجلد `dist` يحتوي على آخر نسخة

### 2. ارفع على Appwrite

#### الطريقة الأسهل:
1. اذهب إلى: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8
2. ابحث عن قسم Deploy/Static Sites
3. اضغط "New Deployment"
4. افتح مجلد `dist` في Windows
5. حدد كل الملفات (Ctrl+A)
6. اسحبها إلى Appwrite
7. اضغط Deploy
8. انتظر 2-5 دقائق

---

## ✅ بعد الرفع ستعمل:
```
✅ https://egygo-ecommerce.appwrite.network/#/
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/dashboard
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/links
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/analytics
✅ https://egygo-ecommerce.appwrite.network/#/affiliate/creatives
✅ https://egygo-ecommerce.appwrite.network/#/update-affiliate-prefs
```

---

## 🔄 إذا استمرت المشكلة:
1. امسح Cache: `Ctrl + Shift + Delete`
2. أعد تحميل: `Ctrl + F5`
3. جرب Incognito Mode

---

**للمزيد من التفاصيل: راجع `DEPLOYMENT_GUIDE.md`**
