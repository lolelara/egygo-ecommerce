import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Star,
  AlertCircle,
  Plus,
  Edit,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Link } from "react-router-dom";

export default function MerchantDashboard() {
  const { user } = useAuth();

  // Mock data للتاجر
  const merchantStats = {
    totalProducts: 45,
    activeProducts: 42,
    outOfStock: 3,
    totalSales: 234,
    totalRevenue: 18560,
    revenueChange: 15.3,
    pendingOrders: 8,
    completedOrders: 226,
    avgRating: 4.6,
    totalReviews: 189,
  };

  const myProducts = [
    {
      id: "1",
      name: "سماعات بلوتوث لاسلكية",
      image: "/placeholder.svg",
      price: 299,
      stock: 45,
      sales: 67,
      revenue: 20033,
      views: 1234,
      rating: 4.8,
      status: "active",
    },
    {
      id: "2",
      name: "شاحن لاسلكي سريع",
      image: "/placeholder.svg",
      price: 89,
      stock: 0,
      sales: 123,
      revenue: 10947,
      views: 2156,
      rating: 4.5,
      status: "out_of_stock",
    },
    {
      id: "3",
      name: "حامل هاتف للسيارة",
      image: "/placeholder.svg",
      price: 45,
      stock: 89,
      sales: 234,
      revenue: 10530,
      views: 3421,
      rating: 4.7,
      status: "active",
    },
  ];

  const recentOrders = [
    {
      id: "#12456",
      product: "سماعات بلوتوث",
      customer: "أحمد محمد",
      amount: 299,
      status: "pending",
      date: "2025-10-02",
    },
    {
      id: "#12455",
      product: "شاحن لاسلكي",
      customer: "سارة علي",
      amount: 89,
      status: "completed",
      date: "2025-10-01",
    },
    {
      id: "#12454",
      product: "حامل هاتف",
      customer: "محمد حسن",
      amount: 45,
      status: "completed",
      date: "2025-10-01",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              لوحة تحكم التاجر
            </h2>
            <p className="text-muted-foreground">
              مرحباً {user?.name}، إليك ملخص منتجاتك ومبيعاتك
            </p>
          </div>
          <Link to="/admin/products">
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {merchantStats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {merchantStats.activeProducts} نشط، {merchantStats.outOfStock}{" "}
                نفذت من المخزون
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المبيعات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {merchantStats.totalSales}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {merchantStats.pendingOrders} قيد التنفيذ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${merchantStats.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-xs mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                <span className="text-green-500">
                  +{merchantStats.revenueChange}%
                </span>
                <span className="text-muted-foreground mr-1">
                  عن الشهر الماضي
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">التقييم</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {merchantStats.avgRating}/5.0
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {merchantStats.totalReviews} تقييم
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products Performance */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>أداء المنتجات</CardTitle>
                <CardDescription>
                  أفضل منتجاتك أداءً هذا الشهر
                </CardDescription>
              </div>
              <Link to="/admin/products">
                <Button variant="outline" size="sm">
                  عرض الكل <ArrowUpRight className="h-4 w-4 mr-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{product.name}</h4>
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "destructive"
                        }
                      >
                        {product.status === "active" ? "نشط" : "نفذ من المخزون"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">السعر</p>
                        <p className="font-medium">${product.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">المبيعات</p>
                        <p className="font-medium">{product.sales}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">الإيرادات</p>
                        <p className="font-medium">
                          ${product.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">المشاهدات</p>
                        <p className="font-medium">{product.views}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={product.stock > 0 ? 80 : 0}
                        className="flex-1"
                      />
                      <span className="text-xs text-muted-foreground">
                        {product.stock} في المخزون
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 ml-1" />
                      تعديل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 ml-1" />
                      معاينة
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders & Alerts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>الطلبات الأخيرة</CardTitle>
              <CardDescription>
                آخر طلبات منتجاتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.id}</span>
                        <Badge
                          variant={
                            order.status === "pending" ? "secondary" : "default"
                          }
                        >
                          {order.status === "pending" ? "قيد التنفيذ" : "مكتمل"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.product} - {order.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.date}
                      </p>
                    </div>
                    <div className="text-lg font-bold">${order.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Tips */}
          <Card>
            <CardHeader>
              <CardTitle>تنبيهات ونصائح</CardTitle>
              <CardDescription>تحسينات مقترحة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">منتجات نفذت من المخزون</p>
                    <p className="text-xs text-muted-foreground">
                      لديك 3 منتجات نفذت من المخزون. قم بتحديث الكميات.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50">
                  <BarChart3 className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">أداء ممتاز</p>
                    <p className="text-xs text-muted-foreground">
                      مبيعاتك زادت بنسبة 15% هذا الشهر!
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-lg border border-green-200 bg-green-50">
                  <Star className="h-5 w-5 text-green-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">تقييمات جديدة</p>
                    <p className="text-xs text-muted-foreground">
                      لديك 5 تقييمات جديدة لمنتجاتك
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/admin/products">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-6 w-6" />
                    <span>إضافة منتج</span>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/products">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-6 w-6" />
                    <span>إدارة المنتجات</span>
                  </div>
                </Button>
              </Link>
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    <span>إدارة الفئات</span>
                  </div>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="flex flex-col items-center gap-2">
                  <Star className="h-6 w-6" />
                  <span>عرض التقييمات</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
