import { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { ID } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

interface BackInStockNotificationProps {
  productId: string;
  productName: string;
  inStock: boolean;
}

export default function BackInStockNotification({
  productId,
  productName,
  inStock
}: BackInStockNotificationProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  if (inStock) return null;

  const handleSubscribe = async () => {
    if (!email) {
      toast({
        title: 'خطأ',
        description: 'الرجاء إدخال البريد الإلكتروني',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      await databases.createDocument(
        DATABASE_ID,
        'stock_notifications',
        ID.unique(),
        {
          productId,
          productName,
          email,
          userId: user?.$id || null,
          notified: false,
          createdAt: new Date().toISOString()
        }
      );

      setSubscribed(true);
      toast({
        title: 'تم الاشتراك بنجاح',
        description: 'سنرسل لك إشعار عندما يتوفر المنتج',
      });

      setTimeout(() => {
        setOpen(false);
        setSubscribed(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'خطأ',
        description: 'فشل الاشتراك، حاول مرة أخرى',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
        >
          <Bell className="h-4 w-4 ml-2" />
          أخبرني عند التوفر
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إشعار عند التوفر</DialogTitle>
          <DialogDescription>
            سنرسل لك بريد إلكتروني عندما يتوفر "{productName}"
          </DialogDescription>
        </DialogHeader>
        
        {!subscribed ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <Button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري الاشتراك...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 ml-2" />
                  اشترك في الإشعارات
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-600">
              تم الاشتراك بنجاح!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
