import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Upload, 
  Globe, 
  Shield, 
  Bell, 
  Mail, 
  CreditCard,
  Database,
  Save,
  RefreshCw,
  Eye,
  Download,
  Settings,
  Image as ImageIcon,
  FileText,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SiteSettings {
  // Branding
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Business
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  shippingCost: number;
  freeShippingThreshold: number;
  
  // Features
  features: {
    enableReviews: boolean;
    enableWishlist: boolean;
    enableCompare: boolean;
    enableNewsletter: boolean;
    enableAffiliate: boolean;
    enableMultiCurrency: boolean;
    enableGuestCheckout: boolean;
  };
  
  // Security
  security: {
    enableTwoFactor: boolean;
    enableBruteForceProtection: boolean;
    sessionTimeout: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
  };
  
  // Notifications
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderNotifications: boolean;
    marketingEmails: boolean;
  };
  
  // SEO
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
    facebookPixelId: string;
    enableSitemap: boolean;
  };
}

export default function AdminAdvancedSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'إيجي جو',
    siteDescription: 'منصة التجارة الإلكترونية الرائدة',
    logo: '',
    favicon: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#f59e0b',
    accentColor: '#10b981',
    contactEmail: 'info@egygo.com',
    contactPhone: '+201234567890',
    address: 'القاهرة، مصر',
    socialMedia: {},
    currency: 'EGP',
    timezone: 'Africa/Cairo',
    language: 'ar',
    taxRate: 14,
    shippingCost: 50,
    freeShippingThreshold: 500,
    features: {
      enableReviews: true,
      enableWishlist: true,
      enableCompare: true,
      enableNewsletter: true,
      enableAffiliate: true,
      enableMultiCurrency: false,
      enableGuestCheckout: true,
    },
    security: {
      enableTwoFactor: false,
      enableBruteForceProtection: true,
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireStrongPassword: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderNotifications: true,
      marketingEmails: false,
    },
    seo: {
      metaTitle: 'إيجي جو - منصة التجارة الإلكترونية',
      metaDescription: 'تسوق آمن وسريع مع إيجي جو',
      metaKeywords: 'تسوق، إلكتروني، مصر',
      googleAnalyticsId: '',
      facebookPixelId: '',
      enableSitemap: true,
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Mock data - replace with actual API call
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحميل الإعدادات",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast({
        title: "نجح",
        description: "تم حفظ الإعدادات بنجاح"
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    loadSettings();
    setHasChanges(false);
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateNestedSettings = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setHasChanges(true);
      return newSettings;
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الإعدادات المتقدمة</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            إعادة تعيين
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 text-sm">
              لديك تغييرات غير محفوظة. لا تنس حفظ التغييرات.
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="branding" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>الهوية البصرية</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>الأعمال</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>الميزات</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>الأمان</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>SEO</span>
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>الهوية البصرية</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSettings({ siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">وصف الموقع</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="primaryColor">اللون الأساسي</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => updateSettings({ primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">اللون الثانوي</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => updateSettings({ secondaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">لون التمييز</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => updateSettings({ accentColor: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.accentColor}
                      onChange={(e) => updateSettings({ accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>الشعار</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      رفع الشعار
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG حتى 2MB
                    </p>
                  </div>
                </div>
                <div>
                  <Label>الأيقونة</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      رفع الأيقونة
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      ICO, PNG حتى 1MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>إعدادات الأعمال</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSettings({ currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
                      <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                      <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">المنطقة الزمنية</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSettings({ timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                      <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                      <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="taxRate">معدل الضريبة (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => updateSettings({ taxRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="shippingCost">تكلفة الشحن (جنيه)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    value={settings.shippingCost}
                    onChange={(e) => updateSettings({ shippingCost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="freeShippingThreshold">حد الشحن المجاني (جنيه)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => updateSettings({ freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">معلومات الاتصال</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">رقم الهاتف</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => updateSettings({ contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>تفعيل الميزات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(settings.features).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key}>
                        {key === 'enableReviews' && 'تفعيل التقييمات'}
                        {key === 'enableWishlist' && 'تفعيل قائمة الأمنيات'}
                        {key === 'enableCompare' && 'تفعيل مقارنة المنتجات'}
                        {key === 'enableNewsletter' && 'تفعيل النشرة الإخبارية'}
                        {key === 'enableAffiliate' && 'تفعيل برنامج الشراكة'}
                        {key === 'enableMultiCurrency' && 'تفعيل العملات المتعددة'}
                        {key === 'enableGuestCheckout' && 'تفعيل الطلب كضيف'}
                      </Label>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateNestedSettings(`features.${key}`, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>إعدادات الأمان</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(settings.security).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key}>
                        {key === 'enableTwoFactor' && 'تفعيل المصادقة الثنائية'}
                        {key === 'enableBruteForceProtection' && 'حماية من الهجمات'}
                        {key === 'sessionTimeout' && 'انتهاء الجلسة (دقيقة)'}
                        {key === 'passwordMinLength' && 'الحد الأدنى لكلمة المرور'}
                        {key === 'requireStrongPassword' && 'طلب كلمة مرور قوية'}
                      </Label>
                    </div>
                    {typeof value === 'boolean' ? (
                      <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) => updateNestedSettings(`security.${key}`, checked)}
                      />
                    ) : (
                      <Input
                        id={key}
                        type="number"
                        value={value}
                        onChange={(e) => updateNestedSettings(`security.${key}`, parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>إعدادات الإشعارات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key}>
                        {key === 'emailNotifications' && 'الإشعارات عبر البريد الإلكتروني'}
                        {key === 'smsNotifications' && 'الإشعارات عبر الرسائل النصية'}
                        {key === 'pushNotifications' && 'الإشعارات الفورية'}
                        {key === 'orderNotifications' && 'إشعارات الطلبات'}
                        {key === 'marketingEmails' && 'رسائل التسويق'}
                      </Label>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateNestedSettings(`notifications.${key}`, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>إعدادات SEO</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">عنوان الموقع</Label>
                  <Input
                    id="metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={(e) => updateNestedSettings('seo.metaTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">وصف الموقع</Label>
                  <Input
                    id="metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={(e) => updateNestedSettings('seo.metaDescription', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="metaKeywords">الكلمات المفتاحية</Label>
                  <Input
                    id="metaKeywords"
                    value={settings.seo.metaKeywords}
                    onChange={(e) => updateNestedSettings('seo.metaKeywords', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      value={settings.seo.googleAnalyticsId}
                      onChange={(e) => updateNestedSettings('seo.googleAnalyticsId', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixelId"
                      value={settings.seo.facebookPixelId}
                      onChange={(e) => updateNestedSettings('seo.facebookPixelId', e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableSitemap">تفعيل خريطة الموقع</Label>
                  <Switch
                    id="enableSitemap"
                    checked={settings.seo.enableSitemap}
                    onCheckedChange={(checked) => updateNestedSettings('seo.enableSitemap', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
