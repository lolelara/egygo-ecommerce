/**
 * Admin Banners Management Page
 * صفحة إدارة البانرات للأدمن
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon,
  ArrowUp, ArrowDown, Save, X, Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databases, storage, appwriteConfig } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';

interface Banner {
  $id?: string;
  title: string;
  imageUrl: string;
  link?: string;
  location: 'offers' | 'products' | 'affiliate';
  isActive: boolean;
  order: number;
  createdAt?: string;
}

interface BannerSettings {
  $id?: string;
  location: string;
  autoPlayInterval: number;
  showControls: boolean;
  height: string;
}

const STORAGE_BUCKET_ID = appwriteConfig.buckets?.banners || 'banners';

export default function BannersManagement() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<Record<string, BannerSettings>>({
    offers: { location: 'offers', autoPlayInterval: 5, showControls: true, height: '300px' },
    products: { location: 'products', autoPlayInterval: 5, showControls: true, height: '300px' },
    affiliate: { location: 'affiliate', autoPlayInterval: 5, showControls: true, height: '300px' }
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<'offers' | 'products' | 'affiliate'>('offers');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState<Banner>({
    title: '',
    imageUrl: '',
    link: '',
    location: 'offers',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    loadBanners();
    loadSettings();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.banners || 'banners',
        [Query.orderAsc('order')]
      );
      setBanners(response.documents as any);
    } catch (error) {
      console.error('Error loading banners:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'فشل تحميل البانرات'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.bannerSettings || 'bannerSettings'
      );
      
      const settingsMap: Record<string, BannerSettings> = {};
      response.documents.forEach((doc: any) => {
        settingsMap[doc.location] = doc;
      });
      
      setSettings(prev => ({ ...prev, ...settingsMap }));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const response = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        file
      );
      
      return storage.getFileView(STORAGE_BUCKET_ID, response.$id).href;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const bannerData = {
        ...formData,
        imageUrl,
        location: selectedLocation
      };

      if (editingBanner?.$id) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.banners || 'banners',
          editingBanner.$id,
          bannerData
        );
        toast({
          title: 'تم التحديث',
          description: 'تم تحديث البانر بنجاح'
        });
      } else {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.banners || 'banners',
          ID.unique(),
          {
            ...bannerData,
            createdAt: new Date().toISOString()
          }
        );
        toast({
          title: 'تم الإضافة',
          description: 'تم إضافة البانر بنجاح'
        });
      }

      loadBanners();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'فشل حفظ البانر'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البانر؟')) return;

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.banners || 'banners',
        id
      );
      toast({
        title: 'تم الحذف',
        description: 'تم حذف البانر بنجاح'
      });
      loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'فشل حذف البانر'
      });
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.banners || 'banners',
        banner.$id!,
        { isActive: !banner.isActive }
      );
      loadBanners();
      toast({
        title: 'تم التحديث',
        description: `تم ${!banner.isActive ? 'تفعيل' : 'إيقاف'} البانر`
      });
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const moveOrder = async (banner: Banner, direction: 'up' | 'down') => {
    const locationBanners = banners
      .filter(b => b.location === banner.location)
      .sort((a, b) => a.order - b.order);
    
    const currentIndex = locationBanners.findIndex(b => b.$id === banner.$id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === locationBanners.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetBanner = locationBanners[targetIndex];

    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.banners || 'banners',
        banner.$id!,
        { order: targetBanner.order }
      );
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.banners || 'banners',
        targetBanner.$id!,
        { order: banner.order }
      );
      loadBanners();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const saveSettings = async (location: string) => {
    try {
      const settingData = settings[location];
      
      if (settingData.$id) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.bannerSettings || 'bannerSettings',
          settingData.$id,
          settingData
        );
      } else {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.bannerSettings || 'bannerSettings',
          ID.unique(),
          settingData
        );
      }

      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ الإعدادات بنجاح'
      });
      loadSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: 'destructive',
        title: 'خطأ',
        description: 'فشل حفظ الإعدادات'
      });
    }
  };

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData(banner);
      setImagePreview(banner.imageUrl);
      setSelectedLocation(banner.location);
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        imageUrl: '',
        link: '',
        location: selectedLocation,
        isActive: true,
        order: banners.filter(b => b.location === selectedLocation).length
      });
      setImagePreview('');
    }
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBanner(null);
    setImageFile(null);
    setImagePreview('');
  };

  const locationBanners = banners.filter(b => b.location === selectedLocation);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة البانرات الإعلانية</h1>
          <p className="text-muted-foreground mt-1">
            تحكم في البانرات الظاهرة في صفحات الموقع
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة بانر جديد
        </Button>
      </div>

      <Tabs value={selectedLocation} onValueChange={(v: any) => setSelectedLocation(v)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="offers">صفحة العروض</TabsTrigger>
          <TabsTrigger value="products">صفحة المنتجات</TabsTrigger>
          <TabsTrigger value="affiliate">صفحة المسوقين</TabsTrigger>
        </TabsList>

        {(['offers', 'products', 'affiliate'] as const).map((location) => (
          <TabsContent key={location} value={location} className="space-y-6">
            {/* إعدادات البانرات */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  إعدادات العرض
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>الوقت بين كل بانر (ثانية)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={settings[location]?.autoPlayInterval || 5}
                      onChange={(e) => setSettings({
                        ...settings,
                        [location]: {
                          ...settings[location],
                          autoPlayInterval: parseInt(e.target.value) || 5
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ارتفاع البانر</Label>
                    <Input
                      value={settings[location]?.height || '300px'}
                      onChange={(e) => setSettings({
                        ...settings,
                        [location]: {
                          ...settings[location],
                          height: e.target.value
                        }
                      })}
                      placeholder="مثال: 300px"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>إظهار أزرار التحكم</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={settings[location]?.showControls ?? true}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          [location]: {
                            ...settings[location],
                            showControls: checked
                          }
                        })}
                      />
                      <span className="text-sm">
                        {settings[location]?.showControls ? 'نعم' : 'لا'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="mt-4"
                  onClick={() => saveSettings(location)}
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ الإعدادات
                </Button>
              </CardContent>
            </Card>

            {/* جدول البانرات */}
            <Card>
              <CardHeader>
                <CardTitle>
                  البانرات ({locationBanners.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {locationBanners.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد بانرات في هذا القسم</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => handleOpenDialog()}
                    >
                      <Plus className="h-4 w-4 ml-2" />
                      أضف أول بانر
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>الصورة</TableHead>
                        <TableHead>العنوان</TableHead>
                        <TableHead>الرابط</TableHead>
                        <TableHead>الترتيب</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locationBanners.map((banner) => (
                        <TableRow key={banner.$id}>
                          <TableCell>
                            <img 
                              src={banner.imageUrl} 
                              alt={banner.title}
                              className="w-20 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {banner.title}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {banner.link ? (
                              <a 
                                href={banner.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {banner.link.substring(0, 30)}...
                              </a>
                            ) : (
                              'لا يوجد'
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveOrder(banner, 'up')}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => moveOrder(banner, 'down')}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActive(banner)}
                            >
                              {banner.isActive ? (
                                <Eye className="h-4 w-4 text-green-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDialog(banner)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(banner.$id!)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialog لإضافة/تعديل البانر */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'تعديل البانر' : 'إضافة بانر جديد'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>العنوان</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="عنوان البانر"
              />
            </div>

            <div className="space-y-2">
              <Label>الرابط (اختياري)</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>صورة البانر</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="معاينة" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label>مفعّل</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              <X className="h-4 w-4 ml-2" />
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 ml-2" />
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
