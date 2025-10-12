import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Package, ShoppingCart, AlertTriangle, TrendingUp, X } from "lucide-react";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useAuth } from "@/contexts/AppwriteAuthContext";

interface Notification {
  id: string;
  type: 'order' | 'stock' | 'review' | 'alert' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MerchantNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.$id) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user?.$id) return;
    
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.notifications,
        [
          Query.equal('userId', user.$id),
          Query.equal('userRole', 'merchant'),
          Query.orderDesc('$createdAt'),
          Query.limit(5)
        ]
      );

      setNotifications(response.documents.map((doc: any) => ({
        id: doc.$id,
        type: doc.type || 'info',
        title: doc.title,
        message: doc.message,
        isRead: doc.isRead || false,
        createdAt: doc.$createdAt
      })));
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to sample notifications
      setNotifications(getSampleNotifications());
    } finally {
      setLoading(false);
    }
  };

  const getSampleNotifications = (): Notification[] => [
    {
      id: '1',
      type: 'order',
      title: 'طلب جديد',
      message: 'لديك 3 طلبات جديدة تحتاج للمعالجة',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      type: 'stock',
      title: 'تنبيه مخزون',
      message: 'منتج "ساعة ذكية" أوشك على النفاد (5 قطع متبقية)',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: '3',
      type: 'info',
      title: 'تحديث النظام',
      message: 'تم إضافة ميزات جديدة لتحسين تجربة التاجر',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const markAsRead = async (notificationId: string) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.notifications,
        notificationId,
        { isRead: true } as any
      );
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'stock':
        return <Package className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'stock':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'alert':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            الإشعارات
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {unreadCount} جديد
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border-2 ${getColor(notification.type)} ${
                  notification.isRead ? 'opacity-60' : ''
                } transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleString('ar-EG')}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
