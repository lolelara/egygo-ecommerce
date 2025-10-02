# دليل التثبيت

دليل شامل لتثبيت وتشغيل شوب كو على نظامك.

## 📋 المتطلبات

### البرامج المطلوبة:

- **Node.js**: الإصدار 18.0.0 أو أحدث
- **npm**: الإصدار 8.0.0 أو أحدث
- **Git**: لاستنساخ المشروع
- **قاعدة بيانات PostgreSQL**: محلية أو سحابية

### التحقق من الإصدارات:

```bash
node --version    # يجب أن يكون 18.0.0+
npm --version     # يجب أن يكون 8.0.0+
git --version     # أي إصدار حديث
```

## 🚀 التثبيت السريع

### 1. استنساخ المشروع

```bash
git clone https://github.com/lolelara/egygo.git
cd egygo
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد قاعدة البيانات

#### أ) قاعدة بيانات محلية:

```bash
# تثبيت PostgreSQL على Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# تثبيت PostgreSQL على macOS
brew install postgresql
brew services start postgresql

# إنشاء قاعدة بيانات
sudo -u postgres createdb egygo_db

# إنشاء مستخدم
sudo -u postgres createuser --interactive
```

#### ب) قاعدة بيانات سحابية:

- استخدم خدمات مثل Supabase، Neon، أو PlanetScale
- احصل على connection string

### 4. إعداد متغيرات البيئة

```bash
# نسخ ملف الإعدادات
cp .env.example .env

# تحرير الملف
nano .env
```

أضف البيانات التالية في `.env`:

```env
# قاعدة البيانات
DATABASE_URL="postgresql://username:password@localhost:5432/egygo_db"

# بيئة التشغيل
NODE_ENV="development"

# مفاتيح الأمان (اختياري للتطوير)
JWT_SECRET="your-secret-key-here"
```

### 5. إعداد قاعدة البيانات

```bash
# تشغيل المايجريشن
npx prisma migrate dev --name init

# إضافة البيانات التجريبية
npx prisma db seed
```

### 6. تشغيل المشروع

```bash
npm run dev
```

🎉 **انتهى!** الموقع يعمل الآن على: `http://localhost:8080`

## 🔐 بيانات تسجيل الدخول

### مديري النظام:

- **المدير**: `admin@example.com` / `admin123`
- **المدير العام**: `superadmin@example.com` / `superadmin123`

## 🛠️ أوامر مفيدة

```bash
# تشغيل التطوير
npm run dev

# بناء الإنتاج
npm run build

# تشغيل الإنتاج
npm start

# اختبار الكود
npm test

# تنسيق الكود
npm run format.fix

# فحص الأنواع
npm run typecheck

# فتح Prisma Studio
npx prisma studio

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset
```

## 🔧 حل المشاكل الشائعة

### مشكلة: خطأ في الاتصال بقاعدة البيانات

```bash
# تحقق من تشغيل PostgreSQL
sudo service postgresql status

# تحقق من connection string
echo $DATABASE_URL
```

### مشكلة: Port 8080 مستخدم

```bash
# البحث عن العملية
lsof -i :8080

# إيقاف العملية
kill -9 PID_NUMBER

# أو استخدام port مختلف
PORT=3000 npm run dev
```

### مشكلة: خطأ في التبعيات

```bash
# مسح node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install

# تنظيف cache
npm cache clean --force
```

### مشكلة: خطأ في Prisma

```bash
# إعادة إنشاء Prisma Client
npx prisma generate

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset --force
npx prisma db seed
```

## 🌐 النشر

### Netlify:

1. ربط GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist/spa`
4. إضافة Environment Variables

### Vercel:

1. استيراد من GitHub
2. Framework: React
3. Build command: `npm run build`
4. Output directory: `dist/spa`

## 📚 مصادر إضافية

- [دليل Prisma](https://www.prisma.io/docs/)
- [دليل React](https://react.dev/)
- [دليل Tailwind CSS](https://tailwindcss.com/docs)
- [دليل Netlify](https://docs.netlify.com/)

## 🆘 الحصول على المساعدة

إذا واجهت مشاكل:

1. تحقق من [الأسئلة الشائعة](FAQ.md)
2. ابحث في [Issues](https://github.com/lolelara/egygo/issues)
3. أنشئ Issue جديد مع وصف المشكلة
4. انضم إلى مجتمعنا للحصول على المساعدة

---

**نتمنى لك تجربة ممتعة مع شوب كو! 🚀**
