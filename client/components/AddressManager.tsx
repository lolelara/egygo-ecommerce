import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Home, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { ID, Query } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

interface Address {
  $id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  governorate: string;
  postalCode?: string;
  isDefault: boolean;
}

export default function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: 'home',
    name: '',
    phone: '',
    street: '',
    city: '',
    governorate: '',
    postalCode: '',
    isDefault: false
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        'addresses',
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );
      setAddresses(response.documents as any);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const data = {
        ...formData,
        userId: user.$id
      };

      if (editingId) {
        await databases.updateDocument(
          DATABASE_ID,
          'addresses',
          editingId,
          data
        );
        toast({ title: 'تم تحديث العنوان بنجاح' });
      } else {
        await databases.createDocument(
          DATABASE_ID,
          'addresses',
          ID.unique(),
          data
        );
        toast({ title: 'تم إضافة العنوان بنجاح' });
      }

      loadAddresses();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حفظ العنوان',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنوان؟')) return;

    try {
      await databases.deleteDocument(DATABASE_ID, 'addresses', id);
      toast({ title: 'تم حذف العنوان بنجاح' });
      loadAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف العنوان',
        variant: 'destructive'
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // Remove default from all
      await Promise.all(
        addresses.map(addr =>
          databases.updateDocument(DATABASE_ID, 'addresses', addr.$id, {
            isDefault: false
          })
        )
      );

      // Set new default
      await databases.updateDocument(DATABASE_ID, 'addresses', id, {
        isDefault: true
      });

      toast({ title: 'تم تعيين العنوان الافتراضي' });
      loadAddresses();
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      label: 'home',
      name: '',
      phone: '',
      street: '',
      city: '',
      governorate: '',
      postalCode: '',
      isDefault: false
    });
    setEditingId(null);
  };

  const openEditDialog = (address: Address) => {
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      governorate: address.governorate,
      postalCode: address.postalCode || '',
      isDefault: address.isDefault
    });
    setEditingId(address.$id);
    setOpen(true);
  };

  const getLabelIcon = (label: string) => {
    switch (label) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Briefcase className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getLabelText = (label: string) => {
    switch (label) {
      case 'home': return 'المنزل';
      case 'work': return 'العمل';
      default: return 'أخرى';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">عناويني</h3>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة عنوان
        </Button>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.$id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getLabelIcon(address.label)}
                    <span className="font-semibold">{getLabelText(address.label)}</span>
                    {address.isDefault && (
                      <Badge variant="secondary">افتراضي</Badge>
                    )}
                  </div>
                  <p className="font-medium">{address.name}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {address.street}, {address.city}, {address.governorate}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditDialog(address)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(address.$id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {!address.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => handleSetDefault(address.$id)}
                >
                  تعيين كافتراضي
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>نوع العنوان</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              >
                <option value="home">المنزل</option>
                <option value="work">العمل</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <Label>الاسم الكامل</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label>رقم الهاتف</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label>الشارع والعنوان التفصيلي</Label>
              <Textarea
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>المدينة</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <Label>المحافظة</Label>
                <Input
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>الرمز البريدي (اختياري)</Label>
              <Input
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} className="flex-1">
                {editingId ? 'تحديث' : 'إضافة'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
