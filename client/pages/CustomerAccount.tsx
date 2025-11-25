import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Package, Heart, Settings, Lock, CreditCard, ShoppingBag, Eye, Loader2, AlertCircle, Plus, X } from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { customerApi } from "@/lib/customer-api";
import { account } from "@/lib/appwrite-client";
import { placeholder } from "@/lib/placeholder";

export default function CustomerAccount() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Data states
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    savedItems: 0,
    reviews: 0,
  });

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    birthdate: "",
  });

  // Load all data on mount
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load profile
      const profile = await customerApi.getUserProfile(user.email);
      if (profile) {
        setUserData(profile);
        setProfileForm({
          name: profile.name || user.name || "",
          phone: profile.phone || "",
          birthdate: profile.birthdate || "",
        });
      }

      // Load orders
      const userOrders = await customerApi.getUserOrders(user.$id);
      setOrders(userOrders);

      // Load wishlist
      const userWishlist = await customerApi.getUserWishlist(user.$id);
      setWishlist(userWishlist);

      // Load addresses
      const userAddresses = await customerApi.getUserAddresses(user.$id);
      setAddresses(userAddresses);

      // Load stats
      const userStats = await customerApi.getUserStats(user.$id);
      setStats(userStats);

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userData?.$id) return;

    setUpdating(true);
    try {
      // Update name in Appwrite Auth
      if (profileForm.name !== user?.name) {
        await account.updateName(profileForm.name);
      }

      // Update profile in database
      await customerApi.updateUserProfile(userData.$id, {
        name: profileForm.name,
        phone: profileForm.phone,
        birthdate: profileForm.birthdate,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "تم التحديث",
        description: "تم تحديث معلوماتك بنجاح",
      });

      // Reload data
      await loadAllData();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في تحديث المعلومات",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    try {
      await customerApi.removeFromWishlist(itemId);
      toast({
        title: "تم الحذف",
        description: "تم إزالة المنتج من المفضلة",
      });
      // Reload wishlist
      const newWishlist = await customerApi.getUserWishlist(user?.$id || "");
      setWishlist(newWishlist);
      setStats(prev => ({ ...prev, savedItems: newWishlist.length }));
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في إزالة المنتج",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await customerApi.deleteAddress(addressId);
      toast({
        title: "تم الحذف",
        description: "تم حذف العنوان بنجاح",
      });
      // Reload addresses
      const newAddresses = await customerApi.getUserAddresses(user?.$id || "");
      setAddresses(newAddresses);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ في حذف العنوان",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(price || 0);
  };

  const getOrderStatusBadge = (status: string) => {
    const statusMap: any = {
      pending: { label: "قيد الانتظار", variant: "secondary" },
      processing: { label: "قيد المعالجة", variant: "default" },
      shipped: { label: "تم الشحن", variant: "default" },
      delivered: { label: "تم التوصيل", variant: "success" },
      cancelled: { label: "ملغي", variant: "destructive" },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || {
      label: status || "غير محدد",
      variant: "secondary"
    };

    return (
      <Badge variant={statusInfo.variant as any}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">يرجى تسجيل الدخول</h2>
              <p className="text-muted-foreground mb-4">
                يجب عليك تسجيل الدخول للوصول إلى حسابك
              </p>
              <Button onClick={() => navigate("/login")}>
                تسجيل الدخول
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">حسابي</h1>
          <p className="text-muted-foreground">
            مرحباً {user?.name || user?.email} - إدارة معلوماتك وطلباتك
          </p>
        </div>

        {/* Stats Cards - Animated */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[
            { label: "إجمالي الطلبات", value: stats.totalOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
            { label: "طلبات نشطة", value: stats.activeOrders, icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/20" },
            { label: "إجمالي المشتريات", value: formatPrice(stats.totalSpent), icon: CreditCard, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
            { label: "المفضلة", value: stats.savedItems, icon: Heart, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20" },
          ].map((stat, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4" style={{ borderLeftColor: stat.color.replace('text-', 'bg-').split('-')[1] }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">طلباتي</TabsTrigger>
            <TabsTrigger value="wishlist" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">المفضلة</TabsTrigger>
            <TabsTrigger value="addresses" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">العناوين</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">تاريخ الميلاد</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      value={profileForm.birthdate}
                      onChange={(e) => setProfileForm({ ...profileForm, birthdate: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} disabled={updating} className="w-full md:w-auto">
                  {updating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>طلباتي</CardTitle>
                <CardDescription>تتبع وإدارة طلباتك</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 animate-bounce">
                      <Package className="h-10 w-10 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">لا توجد طلبات حتى الآن</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      لم تقم بأي طلبات بعد. تصفح منتجاتنا وابدأ التسوق الآن!
                    </p>
                    <Button size="lg" onClick={() => navigate("/products")} className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      تسوق الآن
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.$id} className="flex items-center justify-between p-4 rounded-xl border hover:border-primary/50 transition-colors bg-card hover:shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Package className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">#{order.orderNumber || order.$id.slice(-6)}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{order.items?.length || 0} منتجات</span>
                              <span className="h-1 w-1 rounded-full bg-gray-300" />
                              <span>{formatDate(order.$createdAt)}</span>
                            </p>
                            <div className="mt-2">
                              {getOrderStatusBadge(order.status)}
                            </div>
                          </div>
                        </div>
                        <div className="text-left flex flex-col items-end gap-2">
                          <p className="text-xl font-bold text-primary">{formatPrice(order.total || order.totalAmount || 0)}</p>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            التفاصيل
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المفضلة</CardTitle>
                <CardDescription>المنتجات التي قمت بحفظها</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <Heart className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">قائمة المفضلة فارغة</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      احفظ المنتجات التي تعجبك هنا للرجوع إليها لاحقاً.
                    </p>
                    <Button size="lg" onClick={() => navigate("/products")} className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      اكتشف المنتجات
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => (
                      <Card key={item.$id} className="group overflow-hidden hover:shadow-md transition-all">
                        <CardContent className="p-0">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={item.productImage || placeholder.product(item.productName)}
                              alt={item.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveFromWishlist(item.$id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold mb-2 line-clamp-1">{item.productName}</h4>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-lg font-bold text-primary">{formatPrice(item.productPrice)}</p>
                              <Badge variant={item.inStock ? "default" : "secondary"}>
                                {item.inStock ? "متوفر" : "نفذ"}
                              </Badge>
                            </div>
                            <Button className="w-full" disabled={!item.inStock}>
                              <ShoppingBag className="h-4 w-4 ml-2" />
                              أضف للسلة
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>عناويني</CardTitle>
                    <CardDescription>إدارة عناوين الشحن</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    إضافة عنوان
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">لا توجد عناوين محفوظة</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">
                      أضف عنوان شحن لتسهيل عملية الشراء في المرة القادمة.
                    </p>
                    <Button variant="outline" onClick={() => { }}>
                      إضافة عنوان جديد
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <Card key={address.$id} className="relative group hover:border-primary transition-colors">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-primary" />
                              <p className="font-bold text-lg">{address.label}</p>
                            </div>
                            {address.isDefault && (
                              <Badge variant="secondary">
                                الافتراضي
                              </Badge>
                            )}
                          </div>
                          <div className="pl-7 space-y-1 text-muted-foreground">
                            <p>{address.street}</p>
                            <p>{address.city}, {address.country}</p>
                            <p className="text-sm mt-2 flex items-center gap-2">
                              <Phone className="h-3 w-3" />
                              {address.phone}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-4 pl-7 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="h-8">تعديل</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteAddress(address.$id)}>
                              حذف
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                    <p className="text-sm text-muted-foreground">قم بتحديث كلمة المرور الخاصة بك</p>
                  </div>
                  <Button variant="outline">
                    <Lock className="h-4 w-4 ml-2" />
                    تغيير
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
