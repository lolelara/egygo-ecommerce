import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { databases, DATABASE_ID, account } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';

export default function AccountDeletion() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [understood, setUnderstood] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmText !== 'حذف حسابي' || !understood) {
      toast({
        title: 'خطأ',
        description: 'يرجى تأكيد الحذف بشكل صحيح',
        variant: 'destructive'
      });
      return;
    }

    setDeleting(true);
    try {
      if (!user) return;

      // 1. Delete user data from all collections
      const collections = [
        'orders',
        'addresses',
        'wishlist',
        'reviews',
        'loyalty_points',
        'loyalty_history',
        'commissions',
        'referrals',
        'stock_notifications',
        'user_preferences'
      ];

      for (const collection of collections) {
        try {
          const docs = await databases.listDocuments(
            DATABASE_ID,
            collection,
            [Query.equal('userId', user.$id)]
          );

          for (const doc of docs.documents) {
            await databases.deleteDocument(DATABASE_ID, collection, doc.$id);
          }
        } catch (error) {
          console.log(`Collection ${collection} might not exist or no data`);
        }
      }

      // 2. Delete products if merchant
      if (user.isMerchant) {
        try {
          const products = await databases.listDocuments(
            DATABASE_ID,
            'products',
            [Query.equal('merchantId', user.$id)]
          );

          for (const product of products.documents) {
            await databases.deleteDocument(DATABASE_ID, 'products', product.$id);
          }
        } catch (error) {
          console.log('Error deleting products');
        }
      }

      // 3. Delete from users collection
      try {
        const userDocs = await databases.listDocuments(
          DATABASE_ID,
          'users',
          [Query.equal('userId', user.$id)]
        );

        for (const doc of userDocs.documents) {
          await databases.deleteDocument(DATABASE_ID, 'users', doc.$id);
        }
      } catch (error) {
        console.log('Error deleting user document');
      }

      // 4. Delete Appwrite Auth account
      try {
        await account.deleteSession('current');
      } catch (error) {
        console.log('Session already deleted');
      }

      toast({
        title: 'تم حذف الحساب',
        description: 'تم حذف حسابك وجميع بياناتك بنجاح'
      });

      // Logout and redirect
      await logout();
      navigate('/');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'خطأ',
        description: 'فشل حذف الحساب، حاول مرة أخرى',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="h-4 w-4 ml-2" />
          حذف الحساب نهائياً
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            حذف الحساب نهائياً
          </DialogTitle>
          <DialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك نهائياً.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">سيتم حذف:</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• جميع معلوماتك الشخصية</li>
              <li>• سجل الطلبات والمشتريات</li>
              <li>• العناوين المحفوظة</li>
              <li>• قائمة الأمنيات</li>
              <li>• نقاط الولاء</li>
              <li>• التقييمات والمراجعات</li>
              {user?.isMerchant && <li>• جميع منتجاتك</li>}
              {user?.isAffiliate && <li>• سجل العمولات</li>}
            </ul>
          </div>

          <div className="space-y-2">
            <Label>اكتب "حذف حسابي" للتأكيد</Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="حذف حسابي"
              disabled={deleting}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="understand"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked as boolean)}
              disabled={deleting}
            />
            <label
              htmlFor="understand"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              أفهم أن هذا الإجراء نهائي ولا يمكن التراجع عنه
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || confirmText !== 'حذف حسابي' || !understood}
              className="flex-1"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف نهائي
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleting}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
