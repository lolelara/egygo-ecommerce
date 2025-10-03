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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  Star,
  Settings,
  Lock,
  Bell,
  CreditCard,
  ShoppingBag,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";

export default function CustomerAccount() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const customerStats = {
    totalOrders: 24,
    activeOrders: 3,
    completedOrders: 21,
    totalSpent: 2850,
    savedItems: 12,
    reviews: 8,
  };

  const recentOrders = [
    {
      id: "#12456",
      date: "2025-10-01",
      items: 3,
      total: 450,
      status: "delivered",
    },
    {
      id: "#12445",
      date: "2025-09-28",
      items: 2,
      total: 180,
      status: "in_transit",
    },
    {
      id: "#12434",
      date: "2025-09-25",
      items: 1,
      total: 299,
      status: "delivered",
    },
  ];

  const wishlistItems = [
    {
      id: "1",
      name: "سماعات بلوتوث",
      price: 299,
      image: "/placeholder.svg",
      inStock: true,
    },
    {
      id: "2",
      name: "ساعة ذكية",
      price: 899,
      image: "/placeholder.svg",
      inStock: false,
    },
  ];

  const addresses = [
    {
      id: "1",
      label: "المنزل",
      address: "شارع الجامعة، المعادي، القاهرة",
      phone: "+20 123 456 7890",
      isDefault: true,
    },
    {
      id: "2",
      label: "العمل",
      address: "برج النيل، وسط البلد، القاهرة",
      phone: "+20 123 456 7891",
      isDefault: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">حسابي</h1>
          <p className="text-muted-foreground">
            إدارة معلوماتك وطلباتك ومفضلاتك
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{customerStats.totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">طلبات نشطة</p>
                  <p className="text-2xl font-bold">{customerStats.activeOrders}</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المشتريات</p>
                  <p className="text-2xl font-bold">
                    ${customerStats.totalSpent}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">المفضلة</p>
                  <p className="text-2xl font-bold">{customerStats.savedItems}</p>
                </div>
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 ml-2" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="h-4 w-4 ml-2" />
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="h-4 w-4 ml-2" />
              المفضلة
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="h-4 w-4 ml-2" />
              العناوين
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 ml-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>
                  قم بتحديث معلوماتك الشخصية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={user?.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" defaultValue={user?.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">تاريخ الميلاد</Label>
                    <Input id="birthdate" type="date" />
                  </div>
                </div>
                <Button>حفظ التغييرات</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>إحصائيات حسابك</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        طلبات مكتملة
                      </p>
                      <p className="text-xl font-bold">
                        {customerStats.completedOrders}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Star className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        تقييماتي
                      </p>
                      <p className="text-xl font-bold">
                        {customerStats.reviews}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        المفضلة
                      </p>
                      <p className="text-xl font-bold">
                        {customerStats.savedItems}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>طلباتي</CardTitle>
                <CardDescription>
                  تتبع وإدارة طلباتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items} منتجات - {order.date}
                          </p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : "secondary"
                            }
                            className="mt-1"
                          >
                            {order.status === "delivered"
                              ? "تم التوصيل"
                              : "قيد الشحن"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-bold">${order.total}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Eye className="h-4 w-4 ml-1" />
                          التفاصيل
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المفضلة</CardTitle>
                <CardDescription>
                  المنتجات التي قمت بحفظها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wishlistItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover rounded mb-3"
                        />
                        <h4 className="font-semibold mb-2">{item.name}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">${item.price}</p>
                          <Badge
                            variant={item.inStock ? "default" : "secondary"}
                          >
                            {item.inStock ? "متوفر" : "نفذ"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <Button size="sm" disabled={!item.inStock}>
                            أضف للسلة
                          </Button>
                          <Button variant="outline" size="sm">
                            إزالة
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>عناويني</CardTitle>
                    <CardDescription>إدارة عناوين الشحن</CardDescription>
                  </div>
                  <Button>
                    <MapPin className="h-4 w-4 ml-2" />
                    إضافة عنوان
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <Card key={address.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">{address.label}</p>
                            {address.isDefault && (
                              <Badge variant="secondary" className="mt-1">
                                العنوان الافتراضي
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {address.address}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">
                          {address.phone}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            تعديل
                          </Button>
                          <Button variant="outline" size="sm">
                            حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>الأمان</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">تغيير كلمة المرور</p>
                    <p className="text-sm text-muted-foreground">
                      آخر تغيير منذ 3 أشهر
                    </p>
                  </div>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 ml-2" />
                    تغيير
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">المصادقة الثنائية</p>
                    <p className="text-sm text-muted-foreground">
                      أضف طبقة حماية إضافية
                    </p>
                  </div>
                  <Button variant="outline">تفعيل</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الإشعارات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">إشعارات البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">
                      استلم تحديثات عن طلباتك
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">عروض خاصة</p>
                    <p className="text-sm text-muted-foreground">
                      اطلع على آخر العروض والخصومات
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
