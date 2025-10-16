# 🔑 تحديث OpenAI API Key

## الخطوات

### 1️⃣ تحديث ملف `.env`

افتح ملف `.env` في المجلد الرئيسي وأضف/حدث المفتاح:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 2️⃣ تحديث Appwrite Function (إذا كنت تستخدم OpenAI Chat Function)

في Appwrite Console:

1. اذهب إلى **Functions → openai-chat → Settings**
2. في قسم **Environment variables**
3. أضف/حدث:
   - Key: `OPENAI_API_KEY`
   - Value: `your_openai_api_key_here`
4. اضغط **Update**

### 3️⃣ إعادة تشغيل السيرفر

إذا كان السيرفر يعمل:

```bash
# أوقف السيرفر (Ctrl+C)
# ثم شغله مرة أخرى
npm run dev
```

---

## 📁 الملفات التي تستخدم OpenAI API

### Client Side
- `client/lib/openai-client.ts` - OpenAI client wrapper
- `client/components/AIAssistant.tsx` - AI Assistant component
- `client/components/AIAssistant/AIAssistantCore.tsx` - AI logic

### Server Side
- `server/lib/external-apis.ts` - External APIs including OpenAI
- `server/routes/chat.ts` - Chat routes
- `server/routes/customer-experience.ts` - Customer experience AI
- `server/routes/advanced-scraper.ts` - AI-powered scraping

### Functions
- `functions/openai-chat/src/main.js` - Appwrite Function for OpenAI

---

## ⚠️ ملاحظات مهمة

1. **لا ترفع المفتاح على GitHub**
   - ملف `.env` مُستثنى في `.gitignore`
   - استخدم `env.example.txt` كمرجع فقط

2. **أمان المفتاح**
   - لا تشارك المفتاح مع أحد
   - استخدم environment variables في الإنتاج
   - راقب استخدام API في OpenAI Dashboard

3. **اختبار المفتاح**
   ```bash
   # اختبر أن المفتاح يعمل
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

---

## ✅ التحقق من التحديث

بعد التحديث، جرّب:

1. افتح AI Assistant في الموقع
2. اكتب رسالة
3. يجب أن يرد ChatGPT بشكل طبيعي

إذا ظهر خطأ:
- تأكد من صحة المفتاح
- تأكد من إعادة تشغيل السيرفر
- تحقق من Console للأخطاء

---

**المفتاح الجديد تم حفظه! 🎉**
