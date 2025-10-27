# 🎨 تحسينات صفحات المسوق والمصادقة

## صفحات المسوق (Affiliate Pages)

### 7️⃣ AffiliateDashboard.tsx - لوحة المسوق

```tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, MousePointerClick, ShoppingCart, TrendingUp } from "lucide-react";

export default function AffiliateDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-2">مرحباً، أحمد! 👋</h1>
          <p className="text-white/90">
            إجمالي أرباحك هذا الشهر: <span className="font-bold text-2xl">2,450 ج.م</span>
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الأرباح"
          value="2,450 ج.م"
          change="+15%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title="المبيعات اليوم"
          value={12}
          change="+3"
          trend="up"
          icon={ShoppingCart}
          color="blue"
        />
        
        <StatCard
          title="النقرات"
          value="856"
          change="+22%"
          trend="up"
          icon={MousePointerClick}
          color="purple"
        />
        
        <StatCard
          title="معدل التحويل"
          value="3.5%"
          change="+0.5%"
          trend="up"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الأرباح - آخر 30 يوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Add Chart */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                رسم بياني للأرباح
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معدل التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Add Chart */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                رسم بياني للتحويلات
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Links */}
      <Card>
        <CardHeader>
          <CardTitle>أفضل الروابط أداءً</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <img
                  src={link.productImage}
                  alt={link.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{link.productName}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>النقرات: {link.clicks}</span>
                    <span>المبيعات: {link.sales}</span>
                    <span className="text-green-600 font-semibold">
                      العمولة: {link.commission} ج.م
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 ml-1" />
                    نسخ
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 ml-1" />
                    مشاركة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" asChild>
          <Link to="/affiliate/links">
            <Link2 className="h-4 w-4 ml-2" />
            إنشاء رابط
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/affiliate/analytics">
            <BarChart className="h-4 w-4 ml-2" />
            التحليلات
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/affiliate/withdraw">
            <Wallet className="h-4 w-4 ml-2" />
            سحب الأرباح
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/affiliate/resources">
            <FileText className="h-4 w-4 ml-2" />
            الموارد
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

---

### 8️⃣ AffiliateAnalytics.tsx - تحليلات المسوق

```tsx
export default function AffiliateAnalytics() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">تحليلات الأداء</h1>

      {/* Date Range Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button variant={period === "today" ? "default" : "outline"} size="sm">
              اليوم
            </Button>
            <Button variant={period === "week" ? "default" : "outline"} size="sm">
              آخر 7 أيام
            </Button>
            <Button variant={period === "month" ? "default" : "outline"} size="sm">
              آخر 30 يوم
            </Button>
            <Button variant={period === "custom" ? "default" : "outline"} size="sm">
              مخصص
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90 mb-2">إجمالي الأرباح</div>
            <div className="text-4xl font-bold">2,450 ج.م</div>
            <div className="text-sm opacity-90 mt-2">+15% عن الشهر الماضي</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90 mb-2">أرباح معلقة</div>
            <div className="text-4xl font-bold">350 ج.م</div>
            <div className="text-sm opacity-90 mt-2">سيتم توفيرها خلال 7 أيام</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="text-sm opacity-90 mb-2">متاح للسحب</div>
            <div className="text-4xl font-bold">2,100 ج.م</div>
            <Button variant="secondary" size="sm" className="mt-2">
              سحب الآن
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>مقاييس الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المقياس</TableHead>
                <TableHead>القيمة</TableHead>
                <TableHead>التغيير</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>النقرات</TableCell>
                <TableCell className="font-semibold">856</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    +22%
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>المبيعات</TableCell>
                <TableCell className="font-semibold">24</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    +15%
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>معدل التحويل</TableCell>
                <TableCell className="font-semibold">2.8%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    +0.5%
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>متوسط العمولة</TableCell>
                <TableCell className="font-semibold">102 ج.م</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    +8%
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 9️⃣ AffiliateWithdrawPage.tsx - سحب الأرباح

```tsx
export default function AffiliateWithdrawPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">سحب الأرباح</h1>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm opacity-90">الرصيد المتاح</div>
              <div className="text-4xl font-bold mt-2">2,100 ج.م</div>
            </div>
            <div>
              <div className="text-sm opacity-90">أرباح معلقة</div>
              <div className="text-2xl font-bold mt-2">350 ج.م</div>
            </div>
            <div>
              <div className="text-sm opacity-90">الحد الأدنى للسحب</div>
              <div className="text-2xl font-bold mt-2">100 ج.م</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdraw Form */}
      <Card>
        <CardHeader>
          <CardTitle>طلب سحب جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">المبلغ (ج.م)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="أدخل المبلغ"
              min={100}
              max={2100}
            />
            <p className="text-sm text-muted-foreground mt-1">
              الحد الأدنى: 100 ج.م | الحد الأقصى: 2,100 ج.م
            </p>
          </div>

          <div>
            <Label>طريقة الدفع</Label>
            <div className="space-y-2 mt-2">
              <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" />
                  <div className="flex-1">
                    <div className="font-semibold">حوالة بنكية</div>
                    <div className="text-sm text-muted-foreground">
                      التحويل يستغرق 3-5 أيام عمل
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" />
                  <div className="flex-1">
                    <div className="font-semibold">فودافون كاش</div>
                    <div className="text-sm text-muted-foreground">
                      تحويل فوري خلال دقائق
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 rounded-lg p-4 cursor-pointer hover:border-primary">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" />
                  <div className="flex-1">
                    <div className="font-semibold">Instapay</div>
                    <div className="text-sm text-muted-foreground">
                      تحويل فوري عبر Instapay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="account">رقم الحساب / المحفظة</Label>
            <Input id="account" placeholder="أدخل رقم الحساب" />
          </div>

          <div>
            <Label htmlFor="name">اسم المستفيد</Label>
            <Input id="name" placeholder="الاسم كما يظهر في الحساب" />
          </div>

          <Button size="lg" className="w-full">
            <Wallet className="h-5 w-5 ml-2" />
            طلب السحب
          </Button>
        </CardContent>
      </Card>

      {/* Withdraw History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل السحب</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الطريقة</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2025-10-15</TableCell>
                <TableCell className="font-semibold">500 ج.م</TableCell>
                <TableCell>فودافون كاش</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600">
                    مكتمل
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>الأسئلة الشائعة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h4 className="font-semibold mb-1">ما هو الحد الأدنى للسحب؟</h4>
            <p className="text-sm text-muted-foreground">
              الحد الأدنى للسحب هو 100 ج.م
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">متى يتم تحويل المبلغ؟</h4>
            <p className="text-sm text-muted-foreground">
              فودافون كاش وInstapay فوري، الحوالة البنكية 3-5 أيام عمل
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">هل هناك رسوم على السحب؟</h4>
            <p className="text-sm text-muted-foreground">
              لا توجد رسوم على السحب
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## صفحات المصادقة (Auth Pages)

### 11️⃣ Login.tsx / Register.tsx - تسجيل الدخول/إنشاء حساب

```tsx
export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary to-purple-600 text-white">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6">إيجي جو</h1>
          <p className="text-xl mb-8 opacity-90">
            التسوق الذكي يبدأ هنا
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div>آلاف المنتجات المميزة</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div>شحن مجاني فوق 500 ج.م</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div>استرجاع سهل خلال 14 يوم</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div>دفع آمن 100%</div>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm mb-1">
                    "أفضل موقع تسوق استخدمته! المنتجات عالية الجودة والشحن سريع"
                  </p>
                  <p className="text-xs opacity-75">- أحمد محمد، القاهرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Mobile */}
          <div className="text-center lg:hidden">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              إيجي جو
            </h1>
            <p className="text-muted-foreground mt-2">التسوق الذكي</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">مرحباً بعودتك</h2>
            <p className="text-muted-foreground mt-2">
              سجل دخولك للمتابعة
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button variant="outline" className="w-full" size="lg">
              <img src="/google.svg" className="h-5 w-5 ml-2" />
              تسجيل الدخول بجوجل
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              <img src="/facebook.svg" className="h-5 w-5 ml-2" />
              تسجيل الدخول بفيسبوك
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">
                أو
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4"
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                تذكرني
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-purple-600"
            >
              تسجيل الدخول
            </Button>
          </form>

          <div className="text-center text-sm">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              سجل الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

**هذا ملف شامل لصفحات المسوق والمصادقة. سأكمل باقي الصفحات في الملف التالي...**
