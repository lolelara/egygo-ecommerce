# 📝 الأقسام الجديدة للصفحة الرئيسية

## 🎯 نسخ ولصق هذا الكود بعد Hero Section مباشرة

### 1. Platform Statistics (بعد السطر 240 - بعد Hero Section)

```tsx
{/* Platform Statistics - إحصائيات المنصة */}
<section className="container mx-auto px-4 py-16">
  <div className="text-center mb-12">
    <Badge className="mb-4">📊 إحصائيات المنصة</Badge>
    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
      منصة موثوقة يستخدمها الآلاف
    </h2>
    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
      انضم لمجتمع متنامي من التجار والمسوقين والعملاء الراضين
    </p>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
      <div className="text-4xl font-bold text-primary mb-2">+10,000</div>
      <div className="text-muted-foreground">عميل نشط</div>
    </Card>
    <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
      <div className="text-4xl font-bold text-brand-purple mb-2">+500</div>
      <div className="text-muted-foreground">تاجر ناجح</div>
    </Card>
    <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
      <div className="text-4xl font-bold text-brand-orange mb-2">+2,000</div>
      <div className="text-muted-foreground">مسوق نشط</div>
    </Card>
    <Card className="text-center p-6 feature-card hover:shadow-xl transition-all">
      <div className="text-4xl font-bold text-success mb-2">5M+</div>
      <div className="text-muted-foreground">جنيه مبيعات</div>
    </Card>
  </div>
</section>
```

---

### 2. How It Works (بعد Platform Stats)

```tsx
{/* How It Works - كيف تعمل المنصة */}
<section className="bg-muted/40 py-16">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <Badge className="mb-4">⚙️ كيف تعمل</Badge>
      <h2 className="text-3xl lg:text-4xl font-bold mb-4">
        ابدأ رحلتك في 3 خطوات بسيطة
      </h2>
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        سواء كنت تاجر، مسوق، أو عميل - نحن نسهل عليك البداية
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* للعملاء */}
      <Card className="p-6 hover:shadow-xl transition-all">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">للعملاء</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">تصفح المنتجات</h4>
              <p className="text-sm text-muted-foreground">اكتشف آلاف المنتجات عالية الجودة</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">أضف للسلة</h4>
              <p className="text-sm text-muted-foreground">اختر ما يعجبك وأضفه لسلة المشتريات</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">اطلب واستلم</h4>
              <p className="text-sm text-muted-foreground">ادفع واستلم طلبك في 2-4 أيام</p>
            </div>
          </div>
        </div>
      </Card>

      {/* للتجار */}
      <Card className="p-6 border-brand-purple hover:shadow-xl transition-all">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-full mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">للتجار</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">سجل حساب</h4>
              <p className="text-sm text-muted-foreground">انشئ حساب تاجر مجاناً</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">أضف منتجاتك</h4>
              <p className="text-sm text-muted-foreground">ارفع منتجاتك وحدد الأسعار والعمولات</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-purple text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">ابدأ البيع</h4>
              <p className="text-sm text-muted-foreground">راقب مبيعاتك واستلم أرباحك أسبوعياً</p>
            </div>
          </div>
        </div>
      </Card>

      {/* للمسوقين */}
      <Card className="p-6 border-brand-orange hover:shadow-xl transition-all">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-full mb-4">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">للمسوقين</h3>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-semibold">انضم مجاناً</h4>
              <p className="text-sm text-muted-foreground">سجل كمسوق بدون أي رسوم</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-semibold">احصل على روابطك</h4>
              <p className="text-sm text-muted-foreground">اختر المنتجات وخذ روابط التسويق</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-semibold">سوّق واربح</h4>
              <p className="text-sm text-muted-foreground">اربح عمولة لحد 25% على كل بيعة</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</section>
```

---

### 3. Final CTA (في نهاية الملف قبل `</div>`)

```tsx
{/* Final CTA - دعوة نهائية */}
<section className="bg-gradient-to-r from-primary via-purple-600 to-secondary text-white py-20">
  <div className="container mx-auto px-4 text-center">
    <div className="max-w-3xl mx-auto space-y-8">
      <Badge variant="secondary" className="text-primary bg-white/90 mb-4">
        🚀 ابدأ الآن
      </Badge>
      <h2 className="text-4xl lg:text-5xl font-bold mb-6">
        جاهز للبدء؟
      </h2>
      <p className="text-xl text-white/90 mb-8">
        انضم الآن لآلاف المستخدمين الناجحين واستمتع بتجربة فريدة
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          variant="secondary"
          className="text-primary font-semibold"
          asChild
        >
          <Link to="/products">
            <ShoppingCart className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
            تسوق الآن
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          asChild
        >
          <Link to="/register?type=merchant">
            <Sparkles className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
            سجل كتاجر
          </Link>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          asChild
        >
          <Link to="/affiliate">
            <TrendingUp className="ml-2 h-5 w-5 rtl:ml-0 rtl:mr-2" />
            انضم كمسوق
          </Link>
        </Button>
      </div>
    </div>
  </div>
</section>
```

---

## 📝 تعليمات التطبيق:

1. **افتح** `client/pages/Index.tsx`
2. **ابحث عن** السطر 240 (نهاية Hero Section)
3. **الصق** كود Platform Statistics
4. **الصق** كود How It Works بعده
5. **انتقل** لنهاية الملف (قبل `</div>` الأخيرة)
6. **الصق** كود Final CTA
7. **احفظ** الملف

---

## ✅ الترتيب النهائي سيكون:

1. ✅ Hero Section
2. ✅ Platform Statistics (جديد)
3. ✅ How It Works (جديد)
4. ✅ Categories
5. ✅ Featured Products
6. ✅ Affiliate Program
7. ✅ Best Sellers
8. ✅ Trust Signals
9. ✅ Testimonials
10. ✅ Merchant CTA
11. ✅ Final CTA (جديد)

---

**جاهز للنسخ!** 📋
