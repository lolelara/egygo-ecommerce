import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Bell, Globe, CreditCard, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    siteName: "إيجي جو",
    siteDescription: "منصة التسوق الإلكتروني الأولى في مصر",
    currency: "EGP",
    shippingFee: 50,
    freeShippingThreshold: 500,
    taxRate: 0,
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات بنجاح"
    });
  };

  if (user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            هذه الصفحة متاحة للمسؤولين فقط
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">إعدادات النظام</h1>
          <p className="text-muted-foreground">
            إدارة إعدادات الموقع العامة
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="payment">الدفع والشحن</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                الإعدادات العامة
              </CardTitle>
              <CardDescription>
                معلومات الموقع الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">اسم الموقع</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="currency">العملة</Label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="EGP">جنيه مصري (ج.م)</option>
                  <option value="USD">دولار أمريكي ($)</option>
                  <option value="EUR">يورو (€)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">وضع الصيانة</Label>
                  <p className="text-sm text-muted-foreground">تعطيل الموقع مؤقتاً</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
              <Button onClick={handleSave} className="w-full">
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                إعدادات الدفع والشحن
              </CardTitle>
              <CardDescription>
                إدارة رسوم الشحن والضرائب
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shippingFee">رسوم الشحن (ج.م)</Label>
                <Input
                  id="shippingFee"
                  type="number"
                  value={settings.shippingFee}
                  onChange={(e) => setSettings({...settings, shippingFee: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="freeShipping">حد الشحن المجاني (ج.م)</Label>
                <Input
                  id="freeShipping"
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({...settings, freeShippingThreshold: parseFloat(e.target.value)})}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  شحن مجاني للطلبات فوق هذا المبلغ
                </p>
              </div>
              <div>
                <Label htmlFor="taxRate">نسبة الضريبة (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  طرق الدفع النشطة: الدفع عند الاستلام، بطاقة الائتمان
                </AlertDescription>
              </Alert>
              <Button onClick={handleSave} className="w-full">
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>
                إدارة الإشعارات والتنبيهات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">إشعارات الموقع</Label>
                  <p className="text-sm text-muted-foreground">إشعارات داخل المنصة</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableEmailAlerts">تنبيهات البريد</Label>
                  <p className="text-sm text-muted-foreground">إرسال تنبيهات عبر البريد الإلكتروني</p>
                </div>
                <Switch
                  id="enableEmailAlerts"
                  checked={settings.enableEmailAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, enableEmailAlerts: checked})}
                />
              </div>
              <Alert>
                <AlertDescription className="text-sm">
                  الإشعارات تشمل: طلبات جديدة، تحديثات المنتجات، رسائل العملاء
                </AlertDescription>
              </Alert>
              <Button onClick={handleSave} className="w-full">
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                إعدادات الأمان
              </CardTitle>
              <CardDescription>
                إدارة أمان الموقع والحسابات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <div className="space-y-2 text-sm">
                    <p>✓ المصادقة الثنائية: نشطة</p>
                    <p>✓ تشفير SSL: نشط</p>
                    <p>✓ جدار الحماية: نشط</p>
                    <p>✓ النسخ الاحتياطي: يومي</p>
                  </div>
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="w-full">
                عرض سجل الأمان
              </Button>
              <Button variant="outline" className="w-full">
                تصدير النسخة الاحتياطية
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
