# دليل استخدام الألوان الجديدة 🎨

## 🚀 البداية السريعة

### 1. استخدام التدرجات الأساسية

```tsx
// تدرج بنفسجي-برتقالي (ألوان العلامة التجارية)
<div className="bg-gradient-to-r from-primary to-secondary">
  محتوى
</div>

// تدرج ثلاثي
<div className="bg-gradient-to-br from-primary via-purple-600 to-secondary">
  محتوى
</div>

// تدرج للنص
<h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
  عنوان متدرج
</h1>
```

### 2. استخدام ألوان Accent

```tsx
// أزرق
<Badge className="bg-accent-blue">جديد</Badge>

// أخضر
<Button className="bg-accent-green">نجاح</Button>

// وردي
<Card className="border-accent-pink">بطاقة</Card>

// تركواز
<div className="text-accent-teal">نص</div>
```

### 3. استخدام ألوان الحالات

```tsx
// نجاح
<Alert className="bg-success text-success-foreground">
  تم بنجاح
</Alert>

// تحذير
<Alert className="bg-warning text-warning-foreground">
  تحذير
</Alert>

// معلومات
<Alert className="bg-info text-info-foreground">
  معلومة
</Alert>

// خطأ
<Alert className="bg-destructive text-destructive-foreground">
  خطأ
</Alert>
```

## 🎨 التأثيرات الخاصة

### تأثيرات النصوص

```tsx
// نص قوس قزح متحرك
<h1 className="text-rainbow">نص ملون</h1>

// نص نيون متوهج
<h1 className="text-neon">نص متوهج</h1>

// نص بتدرج متحرك
<h1 className="text-gradient-animated">نص متحرك</h1>
```

### خلفيات متحركة

```tsx
// خلفية قوس قزح
<div className="bg-rainbow p-8">محتوى</div>

// خلفية نيون
<div className="bg-neon p-8">محتوى</div>

// خلفية شفق قطبي
<div className="bg-aurora p-8">محتوى</div>

// تدرج نابض
<div className="bg-vibrant-gradient p-8">محتوى</div>
```

### حدود ملونة

```tsx
// حدود قوس قزح متحركة
<Card className="border-rainbow p-4">
  محتوى
</Card>

// حدود نيون متوهجة
<Card className="border-neon p-4">
  محتوى
</Card>
```

### ظلال ملونة

```tsx
// ظل متعدد الألوان
<Card className="shadow-colorful">بطاقة</Card>

// ظل نيون
<Card className="shadow-neon">بطاقة</Card>

// ظل قوس قزح
<Card className="shadow-rainbow">بطاقة</Card>
```

## 🎯 تأثيرات Hover

```tsx
// تغيير اللون عند التمرير
<Button className="hover-color-shift">
  زر تفاعلي
</Button>

// توهج قوس قزح
<Card className="hover-rainbow-glow">
  بطاقة متوهجة
</Card>

// توهج نيون
<Card className="hover-neon-glow">
  بطاقة نيون
</Card>
```

## 🃏 مكونات جاهزة

### أزرار ملونة

```tsx
// زر بتدرج
<button className="btn-colorful">
  انقر هنا
</button>

// زر نيون
<button className="btn-neon">
  زر نيون
</button>
```

### بطاقات مميزة

```tsx
// بطاقة هولوغرافية
<div className="card-holographic p-6">
  محتوى البطاقة
</div>

// بطاقة بحدود متدرجة
<div className="card-gradient-border">
  <div>محتوى البطاقة</div>
</div>
```

### شارات ملونة

```tsx
// شارة بتدرج
<span className="badge-gradient">جديد</span>

// شارة نيون
<span className="badge-neon">مميز</span>
```

## 📐 أنماط الخلفيات

### خلفيات بتدرجات خفيفة

```tsx
// للصفحات
<div className="bg-gradient-to-br from-purple-50 via-white to-orange-50">
  محتوى الصفحة
</div>

// للبطاقات
<Card className="bg-gradient-to-br from-white to-purple-50/30">
  محتوى البطاقة
</Card>
```

### خلفيات بأنماط

```tsx
// نقاط
<div className="bg-pattern-dots">محتوى</div>

// شبكة
<div className="bg-pattern-grid">محتوى</div>
```

## 🎨 أمثلة عملية

### بطاقة إحصائيات ملونة

```tsx
<Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50/30">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Eye className="h-5 w-5 text-blue-600" />
      النقرات
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-blue-600">
      1,234
    </div>
  </CardContent>
</Card>
```

### عنوان صفحة جذاب

```tsx
<div className="text-center space-y-4">
  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
    مرحباً بك في إيجي جو
  </h1>
  <p className="text-lg text-muted-foreground">
    تسوق بذكاء واربح أكثر
  </p>
</div>
```

### زر Call-to-Action

```tsx
<Button 
  size="lg"
  className="bg-gradient-to-r from-primary to-secondary hover:from-purple-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
>
  ابدأ الآن
  <ArrowRight className="mr-2 h-5 w-5" />
</Button>
```

### بطاقة منتج محسّنة

```tsx
<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-purple-100">
  <div className="relative">
    <img src={product.image} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-yellow-500">
      جديد
    </Badge>
  </div>
  <CardContent className="p-4">
    <h3 className="font-bold text-lg">{product.name}</h3>
    <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
      ${product.price}
    </p>
  </CardContent>
</Card>
```

## 🌓 الوضع الداكن

جميع الألوان تدعم الوضع الداكن تلقائياً:

```tsx
// سيتغير تلقائياً في الوضع الداكن
<div className="bg-gradient-to-br from-purple-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-900">
  محتوى
</div>

// ألوان النصوص
<p className="text-gray-700 dark:text-gray-200">
  نص
</p>
```

## 💡 نصائح مهمة

### 1. استخدام التدرجات بحكمة
```tsx
// ✅ جيد - للعناوين والأزرار المهمة
<h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">

// ❌ تجنب - استخدام مفرط
<p className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
```

### 2. التباين والوضوح
```tsx
// ✅ جيد - تباين واضح
<div className="bg-primary text-primary-foreground">

// ❌ تجنب - تباين ضعيف
<div className="bg-primary text-primary">
```

### 3. الاتساق
```tsx
// ✅ جيد - استخدام متسق
<Badge className="bg-success">نجاح</Badge>
<Badge className="bg-warning">تحذير</Badge>

// ❌ تجنب - ألوان عشوائية
<Badge className="bg-pink-500">نجاح</Badge>
<Badge className="bg-blue-300">تحذير</Badge>
```

## 🎯 حالات استخدام شائعة

### Dashboard Stats Cards
```tsx
// بطاقة الأرباح
<Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50/30">
  <DollarSign className="h-5 w-5 text-orange-600" />
  <div className="text-2xl font-bold text-orange-600">$1,234</div>
</Card>

// بطاقة المبيعات
<Card className="border-green-200 bg-gradient-to-br from-white to-green-50/30">
  <TrendingUp className="h-5 w-5 text-green-600" />
  <div className="text-2xl font-bold text-green-600">567</div>
</Card>
```

### Alert Messages
```tsx
// نجاح
<Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
  <CheckCircle className="h-4 w-4 text-green-600" />
  تم بنجاح!
</Alert>

// خطأ
<Alert className="bg-gradient-to-r from-red-50 to-red-100 border-red-300">
  <AlertCircle className="h-4 w-4 text-red-600" />
  حدث خطأ!
</Alert>
```

### Navigation Links
```tsx
// رابط نشط
<Link className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">
  الصفحة الحالية
</Link>

// رابط عادي
<Link className="text-muted-foreground hover:text-primary transition-colors">
  صفحة أخرى
</Link>
```

## 📚 مراجع إضافية

- راجع `COLOR_ENHANCEMENTS.md` للتفاصيل الكاملة
- راجع `COLORS_SUMMARY_AR.md` للملخص السريع
- راجع `client/styles/color-effects.css` لجميع التأثيرات المتاحة

---

**استمتع بالألوان الجديدة! 🎨✨**
