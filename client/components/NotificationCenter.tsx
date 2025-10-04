import { useState, useEffect } from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  type Notification
} from '@/lib/notifications-api';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { client } from '@/lib/appwrite';
import { useToast } from '@/components/ui/use-toast';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    
    // Subscribe to real-time notifications
    const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
    const NOTIFICATIONS_COLLECTION_ID = 'notifications';
    
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${NOTIFICATIONS_COLLECTION_ID}.documents`,
      (response) => {
        // Handle real-time events
        if (response.events.includes('databases.*.collections.*.documents.*.create')) {
          // New notification created
          loadNotifications();
          
          // Show toast for new notification
          const payload = response.payload as any;
          toast({
            title: "إشعار جديد",
            description: payload.message || "لديك إشعار جديد",
          });
        } else if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          // Notification updated (e.g., marked as read)
          loadNotifications();
        } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
          // Notification deleted
          loadNotifications();
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, [toast]);

  const loadNotifications = async () => {
    try {
      const [notifs, count] = await Promise.all([
        getUserNotifications(20),
        getUnreadCount()
      ]);
      
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-96">
        <div dir="rtl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={loading}
            >
              <Check className="w-4 h-4 ml-2" />
              قراءة الكل
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-12 h-12 mb-3 opacity-50" />
              <p>لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.$id}
                  className={`p-4 hover:bg-accent transition-colors ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(notification.type)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{notification.title}</h4>
                        {!notification.isRead && (
                          <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.$createdAt), {
                            addSuffix: true,
                            locale: ar
                          })}
                        </span>
                        
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => handleMarkAsRead(notification.$id)}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                            onClick={() => handleDelete(notification.$id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {notification.link && (
                        <a
                          href={notification.link}
                          className="text-xs text-primary hover:underline mt-2 inline-block"
                        >
                          عرض التفاصيل ←
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t text-center">
            <Button variant="ghost" size="sm" className="w-full">
              عرض جميع الإشعارات
            </Button>
          </div>
        )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
