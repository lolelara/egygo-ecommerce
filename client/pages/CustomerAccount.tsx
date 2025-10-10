import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Package, Heart, Settings, Lock, CreditCard, ShoppingBag, Eye, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { customerApi } from "@/lib/customer-api";
import { account } from "@/lib/appwrite-client";

export default function CustomerAccount() {
  const { user } = useAuth();
  const { toast } = useToast();
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
              <Button onClick={() => window.location.href = "/login"}>
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

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
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
                  <p className="text-2xl font-bold">{stats.activeOrders}</p>
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
                  <p className="text-2xl font-bold">{formatPrice(stats.totalSpent)}</p>
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
                  <p className="text-2xl font-bold">{stats.savedItems}</p>
                </div>
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="orders">طلباتي</TabsTrigger>
            <TabsTrigger value="wishlist">المفضلة</TabsTrigger>
            <TabsTrigger value="addresses">العناوين</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
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
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" value={user?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input 
                      id="phone" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">تاريخ الميلاد</Label>
                    <Input 
                      id="birthdate" 
                      type="date"
                      value={profileForm.birthdate}
                      onChange={(e) => setProfileForm({...profileForm, birthdate: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateProfile} disabled={updating}>
                  {updating && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  حفظ التغييرات
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>طلباتي</CardTitle>
                <CardDescription>تتبع وإدارة طلباتك</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد طلبات حتى الآن</p>
                    <Button className="mt-4" onClick={() => window.location.href = "/products"}>
                      تسوق الآن
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.$id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold">#{order.orderNumber || order.$id.slice(-6)}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.items?.length || 0} منتجات - {formatDate(order.$createdAt)}
                            </p>
                            {getOrderStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold">{formatPrice(order.total || order.totalAmount || 0)}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Eye className="h-4 w-4 ml-1" />
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
          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>قائمة المفضلة</CardTitle>
                <CardDescription>المنتجات التي قمت بحفظها</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">قائمة المفضلة فارغة</p>
                    <Button className="mt-4" onClick={() => window.location.href = "/products"}>
                      اكتشف المنتجات
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => (
                      <Card key={item.$id}>
                        <CardContent className="p-4">
                          <img
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-full h-40 object-cover rounded mb-3"
                          />
                          <h4 className="font-semibold mb-2">{item.productName}</h4>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold">{formatPrice(item.productPrice)}</p>
                            <Badge variant={item.inStock ? "default" : "secondary"}>
                              {item.inStock ? "متوفر" : "نفذ"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <Button size="sm" disabled={!item.inStock}>أضف للسلة</Button>
                            <Button variant="outline" size="sm" onClick={() => handleRemoveFromWishlist(item.$id)}>
                              إزالة
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
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد عناوين محفوظة</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => (
                      <Card key={address.$id}>
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
                            {address.street}, {address.city}, {address.country}
                          </p>
                          <p className="text-sm text-muted-foreground mb-3">{address.phone}</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">تعديل</Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteAddress(address.$id)}>
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
