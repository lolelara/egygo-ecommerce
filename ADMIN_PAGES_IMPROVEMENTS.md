# 🎨 تحسينات صفحات الأدمن - دليل التطبيق

## 📋 المكونات المشتركة المنشأة

1. ✅ `StatCard.tsx` - بطاقات الإحصائيات
2. ✅ `AlertCard.tsx` - بطاقات التنبيهات

---

## 1️⃣ AdminDashboard.tsx - لوحة تحكم الأدمن

### **الهيكل المحسّن:**

```tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
          <p className="text-muted-foreground mt-1">نظرة شاملة على أداء الموقع</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">آخر تحديث</p>
          <p className="font-semibold">{new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المبيعات اليوم"
          value="12,450 ج.م"
          change="+18%"
          trend="up"
          icon={DollarSign}
          color="green"
        />
        
        <StatCard
          title="الطلبات الجديدة"
          value={45}
          badge="5 تحتاج مراجعة"
          icon={ShoppingCart}
          color="blue"
          actionLink="/admin/orders"
        />
        
        <StatCard
          title="المنتجات قيد المراجعة"
          value={12}
          badge="عاجل"
          icon={Package}
          color="orange"
          actionLink="/admin/product-approval"
        />
        
        <StatCard
          title="المستخدمين النشطين"
          value="1,234"
          change="+5%"
          trend="up"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AlertCard
          variant="warning"
          title="منتجات تحتاج مراجعة"
          message="هناك 12 منتج ينتظر موافقتك"
          actionLabel="مراجعة الآن"
          actionLink="/admin/product-approval"
        />
        
        <AlertCard
          variant="error"
          title="منتجات نفذت من المخزون"
          message="5 منتجات نفذت من المخزون"
          actionLabel="عرض المنتجات"
          actionLink="/admin/products?filter=out-of-stock"
        />
        
        <AlertCard
          variant="info"
          title="حسابات تجار جديدة"
          message="15 حساب تاجر ينتظر الموافقة"
          actionLabel="مراجعة الحسابات"
          actionLink="/admin/pending-accounts"
        />
        
        <AlertCard
          variant="success"
          title="أداء ممتاز"
          message="زيادة في المبيعات بنسبة 25% هذا الأسبوع"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المبيعات - آخر 30 يوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Add Chart Component */}
              <p className="text-muted-foreground text-center py-20">
                الرسم البياني قيد التطوير
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>الطلبات حسب الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {/* Add Pie Chart */}
              <p className="text-muted-foreground text-center py-20">
                الرسم البياني قيد التطوير
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: ShoppingCart, text: "طلب جديد #12345", time: "منذ دقيقتين", color: "text-blue-500" },
              { icon: Package, text: 'منتج جديد من "محمد أحمد"', time: "منذ 5 دقائق", color: "text-green-500" },
              { icon: Users, text: "تاجر جديد سجل", time: "منذ 10 دقائق", color: "text-purple-500" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 pb-3 border-b last:border-0">
                <div className={`h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.text}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <Link to="/admin/products">إضافة منتج</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/coupons">إضافة كوبون</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/notifications">إرسال إشعار</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/analytics">عرض التقارير</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 2️⃣ AdminProductApproval.tsx - مراجعة المنتجات

### **التحسينات الرئيسية:**

```tsx
export default function AdminProductApproval() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">مراجعة المنتجات</h1>
        <div className="flex gap-3">
          <div className="text-center px-4 py-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-xs text-muted-foreground">قيد المراجعة</div>
          </div>
          <div className="text-center px-4 py-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-xs text-muted-foreground">موافق عليها اليوم</div>
          </div>
          <div className="text-center px-4 py-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-xs text-muted-foreground">مرفوضة</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              الكل
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              قيد المراجعة
              <Badge className="mr-2 bg-orange-500">12</Badge>
            </Button>
            <Button
              variant={filter === "approved" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("approved")}
            >
              موافق عليها
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
            >
              مرفوضة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge
                className={`absolute top-2 right-2 ${
                  product.status === "pending"
                    ? "bg-orange-500"
                    : product.status === "approved"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {product.status === "pending"
                  ? "قيد المراجعة"
                  : product.status === "approved"
                  ? "موافق عليه"
                  : "مرفوض"}
              </Badge>
            </div>
            
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-bold line-clamp-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  التاجر: {product.merchantName}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-primary">
                    {product.price} ج.م
                  </div>
                  <div className="text-sm text-muted-foreground">
                    الكمية: {product.stock}
                  </div>
                </div>
                {product.verificationVideo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openVideoModal(product.verificationVideo)}
                  >
                    <PlayCircle className="h-4 w-4 ml-1" />
                    الفيديو
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => approveProduct(product.id)}
                >
                  <Check className="h-4 w-4 ml-1" />
                  الموافقة
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => rejectProduct(product.id)}
                >
                  <X className="h-4 w-4 ml-1" />
                  الرفض
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => viewProductDetails(product.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 3️⃣ AdminOrders.tsx - إدارة الطلبات

### **التحسينات:**

```tsx
export default function AdminOrders() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="طلبات جديدة"
          value={15}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="قيد التجهيز"
          value={23}
          icon={Package}
          color="orange"
        />
        <StatCard
          title="في الشحن"
          value={18}
          icon={Truck}
          color="purple"
        />
        <StatCard
          title="مكتملة"
          value={156}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="ابحث برقم الطلب، اسم العميل..."
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">جديدة</SelectItem>
                <SelectItem value="processing">قيد التجهيز</SelectItem>
                <SelectItem value="shipped">في الشحن</SelectItem>
                <SelectItem value="delivered">مكتملة</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="cod">الدفع عند الاستلام</SelectItem>
                <SelectItem value="vodafone">فودافون كاش</SelectItem>
                <SelectItem value="card">بطاقة ائتمان</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم الطلب</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>طريقة الدفع</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono font-semibold">
                  #{order.id}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-2"
                    onClick={() => copyToClipboard(order.id)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={order.customer.avatar} />
                      <AvatarFallback>
                        {order.customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{order.customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer.phone}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-lg font-bold text-primary">
                    {order.total} ج.م
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "shipped"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {statusLabels[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {paymentMethodLabels[order.paymentMethod]}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewOrder(order.id)}>
                        <Eye className="h-4 w-4 ml-2" />
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(order.id)}>
                        <Edit className="h-4 w-4 ml-2" />
                        تحديث الحالة
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => printInvoice(order.id)}>
                        <Printer className="h-4 w-4 ml-2" />
                        طباعة الفاتورة
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
```

---

## 💾 **كيفية التطبيق:**

### **1. انسخ المكونات المشتركة:**
- `StatCard.tsx` ← موجود
- `AlertCard.tsx` ← موجود

### **2. استخدم الأمثلة أعلاه:**
- افتح كل صفحة
- انسخ الكود المناسب
- عدّل حسب احتياجاتك

### **3. استورد المكونات:**
```tsx
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
```

---

**سأكمل باقي الصفحات في الملف التالي...**
