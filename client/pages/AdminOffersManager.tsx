import { useState, useEffect } from "react";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Offer {
  $id?: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  targetAudience: 'all' | 'customer' | 'affiliate' | 'merchant';
  priority: number;
  createdAt?: string;
}

const BACKGROUND_COLORS = [
  { value: 'from-brand-purple via-brand-orange to-brand-purple', label: 'بنفسجي - برتقالي' },
  { value: 'from-green-500 via-emerald-500 to-teal-500', label: 'أخضر' },
  { value: 'from-blue-500 via-cyan-500 to-blue-600', label: 'أزرق' },
  { value: 'from-red-500 via-pink-500 to-red-600', label: 'أحمر' },
  { value: 'from-yellow-500 via-orange-500 to-yellow-600', label: 'أصفر - برتقالي' },
  { value: 'from-purple-500 via-pink-500 to-purple-600', label: 'بنفسجي - وردي' },
];

const TEXT_COLORS = [
  { value: 'text-white', label: 'أبيض' },
  { value: 'text-black', label: 'أسود' },
  { value: 'text-yellow-300', label: 'أصفر فاتح' },
];

export default function AdminOffersManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Offer>({
    title: '',
    description: '',
    backgroundColor: 'from-brand-purple via-brand-orange to-brand-purple',
    textColor: 'text-white',
    isActive: true,
    targetAudience: 'all',
    priority: 1,
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.offers,
        [
          Query.orderDesc('priority'),
          Query.limit(50)
        ]
      );

      setOffers(response.documents.map((doc: any) => ({
        $id: doc.$id,
        title: doc.title,
        description: doc.description,
        backgroundColor: doc.backgroundColor,
        textColor: doc.textColor,
        isActive: doc.isActive,
        targetAudience: doc.targetAudience,
        priority: doc.priority,
        createdAt: doc.$createdAt,
      })));
    } catch (error) {
      console.error('Error loading offers:', error);
      toast({
        title: "خطأ",
        description: "فشل تحميل العروض",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingOffer?.$id) {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.offers,
          editingOffer.$id,
          {
            title: formData.title,
            description: formData.description,
            backgroundColor: formData.backgroundColor,
            textColor: formData.textColor,
            isActive: formData.isActive,
            targetAudience: formData.targetAudience,
            priority: formData.priority,
          }
        );

        toast({
          title: "✅ تم التحديث",
          description: "تم تحديث العرض بنجاح",
        });
      } else {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.offers,
          ID.unique(),
          {
            title: formData.title,
            description: formData.description,
            backgroundColor: formData.backgroundColor,
            textColor: formData.textColor,
            isActive: formData.isActive,
            targetAudience: formData.targetAudience,
            priority: formData.priority,
          }
        );

        toast({
          title: "✅ تمت الإضافة",
          description: "تم إضافة العرض بنجاح",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadOffers();
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "خطأ",
        description: "فشل حفظ العرض",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.offers,
        id
      );

      toast({
        title: "✅ تم الحذف",
        description: "تم حذف العرض بنجاح",
      });

      loadOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast({
        title: "خطأ",
        description: "فشل حذف العرض",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.offers,
        offer.$id!,
        { isActive: !offer.isActive }
      );

      toast({
        title: "✅ تم التحديث",
        description: offer.isActive ? "تم إيقاف العرض" : "تم تفعيل العرض",
      });

      loadOffers();
    } catch (error) {
      console.error('Error toggling offer:', error);
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة العرض",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      backgroundColor: offer.backgroundColor,
      textColor: offer.textColor,
      isActive: offer.isActive,
      targetAudience: offer.targetAudience,
      priority: offer.priority,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: '',
      description: '',
      backgroundColor: 'from-brand-purple via-brand-orange to-brand-purple',
      textColor: 'text-white',
      isActive: true,
      targetAudience: 'all',
      priority: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">إدارة العروض</h1>
          <p className="text-muted-foreground mt-2">
            إدارة العروض الترويجية التي تظهر في شريط الإعلانات
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة عرض جديد
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>معاينة</CardTitle>
        </CardHeader>
        <CardContent>
          {offers.filter(o => o.isActive).length > 0 ? (
            <div className="space-y-2">
              {offers.filter(o => o.isActive).slice(0, 3).map((offer) => (
                <div
                  key={offer.$id}
                  className={`bg-gradient-to-r ${offer.backgroundColor} ${offer.textColor} py-2 px-4 rounded text-center text-sm font-medium`}
                >
                  <span className="font-bold">{offer.title}</span>
                  {offer.description && <> - {offer.description}</>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              لا توجد عروض نشطة حالياً
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">لا توجد عروض بعد</p>
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول عرض
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>الجمهور المستهدف</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.$id}>
                    <TableCell>
                      <Badge variant="outline">{offer.priority}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{offer.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {offer.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {offer.targetAudience === 'all'
                          ? 'الكل'
                          : offer.targetAudience === 'customer'
                          ? 'عملاء'
                          : offer.targetAudience === 'affiliate'
                          ? 'مسوقين'
                          : 'تجار'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={offer.isActive}
                          onCheckedChange={() => toggleActive(offer)}
                        />
                        {offer.isActive ? (
                          <Badge className="bg-green-500">
                            <Eye className="h-3 w-3 ml-1" />
                            نشط
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 ml-1" />
                            متوقف
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(offer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(offer.$id!)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
            </DialogTitle>
            <DialogDescription>
              العرض سيظهر في شريط الإعلانات أعلى الموقع
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">العنوان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="مثال: عروض خاصة!"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="مثال: شحن مجاني على جميع الطلبات فوق 500 ج.م"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backgroundColor">لون الخلفية</Label>
                  <Select
                    value={formData.backgroundColor}
                    onValueChange={(value) =>
                      setFormData({ ...formData, backgroundColor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BACKGROUND_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="textColor">لون النص</Label>
                  <Select
                    value={formData.textColor}
                    onValueChange={(value) =>
                      setFormData({ ...formData, textColor: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEXT_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetAudience">الجمهور المستهدف</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, targetAudience: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="customer">العملاء فقط</SelectItem>
                      <SelectItem value="affiliate">المسوقين فقط</SelectItem>
                      <SelectItem value="merchant">التجار فقط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">الأولوية (الأعلى يظهر أولاً)</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  عرض نشط
                </Label>
              </div>

              <div>
                <Label>معاينة</Label>
                <div
                  className={`bg-gradient-to-r ${formData.backgroundColor} ${formData.textColor} py-2 px-4 rounded text-center text-sm font-medium mt-2`}
                >
                  <span className="font-bold">{formData.title || 'العنوان'}</span>
                  {formData.description && <> - {formData.description}</>}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSaving}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>{editingOffer ? 'تحديث' : 'إضافة'}</>  
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
