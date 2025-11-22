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
import { Checkbox } from "@/components/ui/checkbox";
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
import { AdminOpenAIKey, openAIKeysApi } from "@/lib/admin-api";
import env from "@/lib/env";
import { databases, appwriteConfig, ID } from "@/lib/appwrite";
import { Query } from "appwrite";

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
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { toast } = useToast();
  const [openAIKeys, setOpenAIKeys] = useState<AdminOpenAIKey[]>([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [testKeyId, setTestKeyId] = useState<string | null>(null);
  const [activateKeyId, setActivateKeyId] = useState<string | null>(null);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyProvider, setNewKeyProvider] = useState<"openai" | "gemini" | "sambanova">("openai");
  const [newKeyPriority, setNewKeyPriority] = useState<number>(100);
  const [newKeyIsDefault, setNewKeyIsDefault] = useState(false);
  const [newKeyModel, setNewKeyModel] = useState("");
  const [newKeyCapabilities, setNewKeyCapabilities] = useState<string[]>(['text']);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const fetchModels = async (key: string) => {
    if (!key || newKeyProvider !== 'sambanova') return;

    setIsLoadingModels(true);
    try {
      const models = await openAIKeysApi.getModels(key, 'sambanova');
      setAvailableModels(models);
      if (models.length > 0) {
        setNewKeyModel(models[0]);
      }
    } catch (error) {
      console.error("Failed to fetch models", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب قائمة النماذج",
        variant: "destructive",
      });
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    if (newKeyProvider === 'sambanova' && newKeyValue.length > 20) {
      const timer = setTimeout(() => {
        fetchModels(newKeyValue);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newKeyValue, newKeyProvider]);

  useEffect(() => {
    loadSettings();
    loadOpenAIKeys();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.site_settings,
        [Query.limit(1)]
      );

      if (response.documents.length > 0) {
        const doc = response.documents[0];
        setSettingsId(doc.$id);

        // Helper to safely parse JSON
        const safeParse = (val: any, fallback: any) => {
          if (typeof val === 'string') {
            try {
              return JSON.parse(val);
            } catch (e) {
              return fallback;
            }
          }
          return val || fallback;
        };

        // Parse config if it exists
        const config = safeParse(doc.config, {});

        setSettings({
          siteName: doc.siteName || 'إيجي جو',
          siteDescription: doc.siteDescription || 'منصة التجارة الإلكترونية الرائدة',
          logo: doc.logo || '',
          favicon: doc.favicon || '',
          primaryColor: doc.primaryColor || '#3b82f6',
          secondaryColor: doc.secondaryColor || '#f59e0b',
          accentColor: doc.accentColor || '#10b981',
          contactEmail: doc.contactEmail || 'info@egygo.com',
          contactPhone: doc.contactPhone || '+201234567890',
          address: doc.address || 'القاهرة، مصر',
          socialMedia: config.socialMedia || {},
          currency: doc.currency || 'EGP',
          timezone: doc.timezone || 'Africa/Cairo',
          language: doc.language || 'ar',
          taxRate: doc.taxRate || 14,
          shippingCost: doc.shippingCost || 50,
          freeShippingThreshold: doc.freeShippingThreshold || 500,
          features: config.features || {
            enableReviews: true,
            enableWishlist: true,
            enableCompare: true,
            enableNewsletter: true,
            enableAffiliate: true,
            enableMultiCurrency: false,
            enableGuestCheckout: true,
          },
          security: config.security || {
            enableTwoFactor: false,
            enableBruteForceProtection: true,
            sessionTimeout: 30,
            passwordMinLength: 8,
            requireStrongPassword: true,
          },
          notifications: config.notifications || {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            orderNotifications: true,
            marketingEmails: false,
          },
          seo: config.seo || {
            metaTitle: 'إيجي جو - منصة التجارة الإلكترونية',
            metaDescription: 'تسوق آمن وسريع مع إيجي جو',
            metaKeywords: 'تسوق، إلكتروني، مصر',
            googleAnalyticsId: '',
            facebookPixelId: '',
            enableSitemap: true,
          }
        });
      }

      setHasChanges(false);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      // Don't show error if it's just that the collection is empty/missing on first run
      if (error.code !== 404) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل الإعدادات",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const config = {
        features: settings.features,
        security: settings.security,
        notifications: settings.notifications,
        seo: settings.seo,
        socialMedia: settings.socialMedia
      };

      const payload = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        logo: settings.logo,
        favicon: settings.favicon,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        currency: settings.currency,
        timezone: settings.timezone,
        language: settings.language,
        taxRate: settings.taxRate,
        shippingCost: settings.shippingCost,
        freeShippingThreshold: settings.freeShippingThreshold,
        config: JSON.stringify(config)
      };

      if (settingsId) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.site_settings,
          settingsId,
          payload
        );
      } else {
        const newDoc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.site_settings,
          ID.unique(),
          payload
        );
        setSettingsId(newDoc.$id);
      }

      setHasChanges(false);
      toast({
        title: "نجح",
        description: "تم حفظ الإعدادات بنجاح"
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ",
        description: error.message || "فشل في حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadOpenAIKeys = async () => {
    try {
      setKeysLoading(true);
      const keys = await openAIKeysApi.list();
      setOpenAIKeys(keys);
      setKeysLoading(false);
    } catch (error: any) {
      setKeysLoading(false);
      toast({
        title: "خطأ",
        description: error.message || "فشل في تحميل مفاتيح OpenAI",
        variant: "destructive",
      });
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyLabel || !newKeyValue) {
      toast({
        title: "تنبيه",
        description: "الاسم والمفتاح مطلوبان",
        variant: "destructive",
      });
      return;
    }

    try {
      await openAIKeysApi.create({
        label: newKeyLabel,
        provider: newKeyProvider as any,
        key: newKeyValue,
        isDefault: newKeyIsDefault,
        model: newKeyProvider === 'sambanova' ? newKeyModel : undefined,
        capabilities: newKeyCapabilities as any
      });

      setNewKeyLabel("");
      setNewKeyValue("");
      setNewKeyIsDefault(false);
      setNewKeyCapabilities(['text']);
      setIsCreatingKey(false);
      fetchKeys();

      toast({
        title: "تم الحفظ",
        description: "تم إضافة المفتاح بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة المفتاح",
        variant: "destructive",
      });
    }
  };

  const handleTestKey = async (id: string) => {
    try {
      setTestKeyId(id);
      const result = await openAIKeysApi.test(id);
      setTestKeyId(null);
      toast({
        title: result.ok ? "ناجح" : "فشل الاختبار",
        description: result.ok ? "المفتاح يعمل بشكل سليم" : result.error || "حدث خطأ أثناء الاختبار",
        variant: result.ok ? "default" : "destructive",
      });
      loadOpenAIKeys();
    } catch (error: any) {
      setTestKeyId(null);
      toast({
        title: "خطأ",
        description: error.message || "فشل في اختبار المفتاح",
        variant: "destructive",
      });
    }
  };

  const handleActivateKey = async (id: string) => {
    try {
      setActivateKeyId(id);
      const activated = await openAIKeysApi.activate(id);
      setActivateKeyId(null);
      setOpenAIKeys((prev) =>
        prev.map((k) => (k.id === activated.id ? activated : { ...k, isDefault: false })),
      );
      toast({
        title: "تم التفعيل",
        description: "تم تعيين المفتاح كمفتاح افتراضي",
      });
    } catch (error: any) {
      setActivateKeyId(null);
      toast({
        title: "خطأ",
        description: error.message || "فشل في تفعيل المفتاح",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      setDeleteKeyId(id);
      await openAIKeysApi.remove(id);
      setDeleteKeyId(null);
      setOpenAIKeys((prev) => prev.filter((k) => k.id !== id));
      toast({
        title: "تم الحذف",
        description: "تم حذف المفتاح بنجاح",
      });
    } catch (error: any) {
      setDeleteKeyId(null);
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف المفتاح",
        variant: "destructive",
      });
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="branding" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>الهوية البصرية</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>إعدادات الأعمال</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>تفعيل الميزات</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>إعدادات الأمان</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>إعدادات الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>إعدادات SEO</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>مفاتيح OpenAI</span>
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

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>مفاتيح API</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">إدارة المفاتيح</h3>
                  <p className="text-sm text-muted-foreground">
                    إدارة مفاتيح OpenAI و Google Gemini و SambaNova. سيتم استخدام المفتاح الافتراضي أولاً.
                  </p>
                </div>
                <Button onClick={() => setIsCreatingKey(true)}>
                  <Zap className="w-4 h-4 mr-2" />
                  إضافة مفتاح جديد
                </Button>
              </div>

              {isCreatingKey && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم المفتاح (للتوضيح)</Label>
                        <Input
                          placeholder="مثال: مفتاح SambaNova الأساسي"
                          value={newKeyLabel}
                          onChange={(e) => setNewKeyLabel(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>المزود</Label>
                        <Select value={newKeyProvider} onValueChange={(v: any) => setNewKeyProvider(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI (GPT-3.5)</SelectItem>
                            <SelectItem value="gemini">Google Gemini (Flash)</SelectItem>
                            <SelectItem value="sambanova">SambaNova (Llama 3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newKeyProvider === 'sambanova' && (
                        <div className="space-y-2">
                          <Label>النموذج (Model)</Label>
                          {isLoadingModels ? (
                            <div className="text-sm text-muted-foreground">جاري جلب النماذج...</div>
                          ) : (
                            <Select value={newKeyModel} onValueChange={setNewKeyModel}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر النموذج" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.length > 0 ? (
                                  availableModels.map(model => (
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="Meta-Llama-3.3-70B-Instruct">Meta-Llama-3.3-70B-Instruct (Default)</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 md:col-span-2">
                        <Label>القدرات (Capabilities)</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cap-text"
                              checked={newKeyCapabilities.includes('text')}
                              onCheckedChange={(checked) => {
                                if (checked) setNewKeyCapabilities([...newKeyCapabilities, 'text']);
                                else setNewKeyCapabilities(newKeyCapabilities.filter(c => c !== 'text'));
                              }}
                            />
                            <Label htmlFor="cap-text">توليد نصوص (Text)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cap-image"
                              checked={newKeyCapabilities.includes('image')}
                              disabled={newKeyProvider === 'sambanova'}
                              onCheckedChange={(checked) => {
                                if (checked) setNewKeyCapabilities([...newKeyCapabilities, 'image']);
                                else setNewKeyCapabilities(newKeyCapabilities.filter(c => c !== 'image'));
                              }}
                            />
                            <Label htmlFor="cap-image" className={newKeyProvider === 'sambanova' ? 'text-muted-foreground' : ''}>
                              توليد صور (Image)
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>مفتاح API</Label>
                        <Input
                          type="password"
                          placeholder={newKeyProvider === 'sambanova' ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "sk-..."}
                          value={newKeyValue}
                          onChange={(e) => setNewKeyValue(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 md:col-span-2">
                        <Switch
                          id="default-key"
                          checked={newKeyIsDefault}
                          onCheckedChange={setNewKeyIsDefault}
                        />
                        <Label htmlFor="default-key">تعيين كمفتاح افتراضي</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatingKey(false)}>إلغاء</Button>
                      <Button onClick={handleCreateKey}>حفظ المفتاح</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {keysLoading ? (
                  <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
                ) : openAIKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    لا توجد مفاتيح مضافة حالياً
                  </div>
                ) : (
                  openAIKeys.map((key) => (
                    <Card key={key.id} className={cn(
                      "transition-all",
                      key.isDefault ? "border-primary/50 bg-primary/5" : "",
                      key.status === 'quota_exceeded' ? "border-yellow-500/50 bg-yellow-500/5" : "",
                      key.status === 'error' ? "border-red-500/50 bg-red-500/5" : ""
                    )}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "p-2 rounded-full",
                            key.provider === 'openai' ? "bg-green-100 text-green-600" :
                              key.provider === 'sambanova' ? "bg-purple-100 text-purple-600" :
                                "bg-blue-100 text-blue-600"
                          )}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{key.label}</h4>
                              {key.isDefault && (
                                <Badge variant="default" className="bg-primary">افتراضي</Badge>
                              )}
                              {!key.isDefault && (
                                <Badge variant="secondary">احتياطي</Badge>
                              )}

                              {key.status === 'active' && (
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                  نشط
                                </Badge>
                              )}
                              {key.status === 'quota_exceeded' && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                                  ⚠️ رصيد غير كافي
                                </Badge>
                              )}
                              {key.status === 'error' && (
                                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                  ❌ خطأ
                                </Badge>
                              )}
                              {key.capabilities?.includes('text') && <Badge variant="secondary" className="text-xs">Text</Badge>}
                              {key.capabilities?.includes('image') && <Badge variant="secondary" className="text-xs">Image</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                              <span>{key.provider === 'openai' ? 'OpenAI' : key.provider === 'sambanova' ? 'SambaNova' : 'Google Gemini'}</span>
                              {key.model && <span>({key.model})</span>}
                              <span>•</span>
                              <span className="font-mono">
                                {key.key ? `${key.key.substring(0, 8)}...` : '••••••••'}
                              </span>
                              {key.lastTestedAt && (
                                <>
                                  <span>•</span>
                                  <span>آخر اختبار: {new Date(key.lastTestedAt).toLocaleDateString('ar-EG')}</span>
                                </>
                              )}
                            </div>
                            {key.lastError && (
                              <div className="text-xs text-red-500 mt-1">
                                {key.lastError}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!key.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivateKey(key.id)}
                              disabled={activateKeyId === key.id}
                            >
                              تعيين كافتراضي
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestKey(key.id)}
                            disabled={testKeyId === key.id}
                          >
                            {testKeyId === key.id ? "جاري الاختبار..." : "اختبار"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteKey(key.id)}
                            disabled={deleteKeyId === key.id}
                          >
                            حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        < TabsContent value="features" className="space-y-6" >
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
        </TabsContent >

        {/* Security Tab */}
        < TabsContent value="security" className="space-y-6" >
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
        </TabsContent >

        {/* Notifications Tab */}
        < TabsContent value="notifications" className="space-y-6" >
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
        </TabsContent >

        {/* SEO Tab */}
        < TabsContent value="seo" className="space-y-6" >
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
        </TabsContent >

        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>مفاتيح API</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">إدارة المفاتيح</h3>
                  <p className="text-sm text-muted-foreground">
                    إدارة مفاتيح OpenAI و Google Gemini و SambaNova. سيتم استخدام المفتاح الافتراضي أولاً.
                  </p>
                </div>
                <Button onClick={() => setIsCreatingKey(true)}>
                  <Zap className="w-4 h-4 mr-2" />
                  إضافة مفتاح جديد
                </Button>
              </div>

              {isCreatingKey && (
                <Card className="border-dashed">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>اسم المفتاح (للتوضيح)</Label>
                        <Input
                          placeholder="مثال: مفتاح SambaNova الأساسي"
                          value={newKeyLabel}
                          onChange={(e) => setNewKeyLabel(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>المزود</Label>
                        <Select value={newKeyProvider} onValueChange={(v: any) => setNewKeyProvider(v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="openai">OpenAI (GPT-3.5)</SelectItem>
                            <SelectItem value="gemini">Google Gemini (Flash)</SelectItem>
                            <SelectItem value="sambanova">SambaNova (Llama 3)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newKeyProvider === 'sambanova' && (
                        <div className="space-y-2">
                          <Label>النموذج (Model)</Label>
                          {isLoadingModels ? (
                            <div className="text-sm text-muted-foreground">جاري جلب النماذج...</div>
                          ) : (
                            <Select value={newKeyModel} onValueChange={setNewKeyModel}>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر النموذج" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.length > 0 ? (
                                  availableModels.map(model => (
                                    <SelectItem key={model} value={model}>{model}</SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="Meta-Llama-3.3-70B-Instruct">Meta-Llama-3.3-70B-Instruct (Default)</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 md:col-span-2">
                        <Label>القدرات (Capabilities)</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cap-text"
                              checked={newKeyCapabilities.includes('text')}
                              onCheckedChange={(checked) => {
                                if (checked) setNewKeyCapabilities([...newKeyCapabilities, 'text']);
                                else setNewKeyCapabilities(newKeyCapabilities.filter(c => c !== 'text'));
                              }}
                            />
                            <Label htmlFor="cap-text">توليد نصوص (Text)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="cap-image"
                              checked={newKeyCapabilities.includes('image')}
                              disabled={newKeyProvider === 'sambanova'}
                              onCheckedChange={(checked) => {
                                if (checked) setNewKeyCapabilities([...newKeyCapabilities, 'image']);
                                else setNewKeyCapabilities(newKeyCapabilities.filter(c => c !== 'image'));
                              }}
                            />
                            <Label htmlFor="cap-image" className={newKeyProvider === 'sambanova' ? 'text-muted-foreground' : ''}>
                              توليد صور (Image)
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>مفتاح API</Label>
                        <Input
                          type="password"
                          placeholder={newKeyProvider === 'sambanova' ? "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" : "sk-..."}
                          value={newKeyValue}
                          onChange={(e) => setNewKeyValue(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center space-x-2 md:col-span-2">
                        <Switch
                          id="default-key"
                          checked={newKeyIsDefault}
                          onCheckedChange={setNewKeyIsDefault}
                        />
                        <Label htmlFor="default-key">تعيين كمفتاح افتراضي</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreatingKey(false)}>إلغاء</Button>
                      <Button onClick={handleCreateKey}>حفظ المفتاح</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {keysLoading ? (
                  <div className="text-center py-8 text-muted-foreground">جاري التحميل...</div>
                ) : openAIKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    لا توجد مفاتيح مضافة حالياً
                  </div>
                ) : (
                  openAIKeys.map((key) => (
                    <Card key={key.id} className={cn(
                      "transition-all",
                      key.isDefault ? "border-primary/50 bg-primary/5" : "",
                      key.status === 'quota_exceeded' ? "border-yellow-500/50 bg-yellow-500/5" : "",
                      key.status === 'error' ? "border-red-500/50 bg-red-500/5" : ""
                    )}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={cn(
                            "p-2 rounded-full",
                            key.provider === 'openai' ? "bg-green-100 text-green-600" :
                              key.provider === 'sambanova' ? "bg-purple-100 text-purple-600" :
                                "bg-blue-100 text-blue-600"
                          )}>
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{key.label}</h4>
                              {key.isDefault && (
                                <Badge variant="default" className="bg-primary">افتراضي</Badge>
                              )}
                              {!key.isDefault && (
                                <Badge variant="secondary">احتياطي</Badge>
                              )}

                              {key.status === 'active' && (
                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                  نشط
                                </Badge>
                              )}
                              {key.status === 'quota_exceeded' && (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                                  ⚠️ رصيد غير كافي
                                </Badge>
                              )}
                              {key.status === 'error' && (
                                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                  ❌ خطأ
                                </Badge>
                              )}
                              {key.capabilities?.includes('text') && <Badge variant="secondary" className="text-xs">Text</Badge>}
                              {key.capabilities?.includes('image') && <Badge variant="secondary" className="text-xs">Image</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                              <span>{key.provider === 'openai' ? 'OpenAI' : key.provider === 'sambanova' ? 'SambaNova' : 'Google Gemini'}</span>
                              {key.model && <span>({key.model})</span>}
                              <span>•</span>
                              <span className="font-mono">
                                {key.key ? `${key.key.substring(0, 8)}...` : '••••••••'}
                              </span>
                              {key.lastTestedAt && (
                                <>
                                  <span>•</span>
                                  <span>آخر اختبار: {new Date(key.lastTestedAt).toLocaleDateString('ar-EG')}</span>
                                </>
                              )}
                            </div>
                            {key.lastError && (
                              <div className="text-xs text-red-500 mt-1">
                                {key.lastError}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!key.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivateKey(key.id)}
                              disabled={activateKeyId === key.id}
                            >
                              تعيين كافتراضي
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestKey(key.id)}
                            disabled={testKeyId === key.id}
                          >
                            {testKeyId === key.id ? "جاري الاختبار..." : "اختبار"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteKey(key.id)}
                            disabled={deleteKeyId === key.id}
                          >
                            حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent >
      </Tabs >
    </div >
  );
}
