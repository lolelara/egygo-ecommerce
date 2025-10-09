import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface Notification {
  $id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'account_approved' | 'account_rejected';
  isRead: boolean;
  link?: string;
  $createdAt: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'notifications',
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(10)
        ]
      );

      const notifs = response.documents as any[];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        'notifications',
        notificationId,
        { isRead: true }
      );

      setNotifications(prev =>
        prev.map(n => n.$id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.$id);
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    setIsOpen(false);
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    for (const notif of unreadNotifications) {
      try {
        await databases.updateDocument(
          appwriteConfig.databaseId,
          'notifications',
          notif.$id,
          { isRead: true }
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
      case 'account_approved':
        return '✅';
      case 'error':
      case 'account_rejected':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
      case 'account_approved':
        return 'text-green-600';
      case 'error':
      case 'account_rejected':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
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
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>الإشعارات</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={markAllAsRead}
            >
              تعليم الكل كمقروء
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد إشعارات</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.$id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${
                  !notification.isRead ? 'bg-muted/50' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-2 w-full">
                  <span className="text-lg flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.$createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
