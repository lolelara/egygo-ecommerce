import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Zap, Gift, AlertCircle, Target, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAffiliateNotifications } from "@/lib/affiliate-data";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";

interface Notification {
  id: string;
  type: 'opportunity' | 'achievement' | 'tip' | 'warning' | 'promotion';
  title: string;
  message: string;
  actionLabel?: string;
  actionLink?: string;
  isNew?: boolean;
}

export default function SmartNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.$id) {
      loadNotifications();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user?.$id) return;
    
    try {
      setLoading(true);
      const data = await getAffiliateNotifications(user.$id, 10);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.notifications,
        notificationId,
        { read: true }
      );
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isNew: false } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return Zap;
      case 'achievement':
        return Award;
      case 'tip':
        return Target;
      case 'warning':
        return AlertCircle;
      case 'promotion':
        return Gift;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200', icon: 'text-blue-600' };
      case 'achievement':
        return { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200', icon: 'text-green-600' };
      case 'tip':
        return { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200', icon: 'text-purple-600' };
      case 'warning':
        return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200', icon: 'text-orange-600' };
      case 'promotion':
        return { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200', icon: 'text-pink-600' };
      default:
        return { bg: 'bg-gray-50 dark:bg-gray-900/20', border: 'border-gray-200', icon: 'text-gray-600' };
    }
  };

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            تنبيهات ذكية
          </CardTitle>
          <Badge variant="destructive" className="animate-pulse">
            {notifications.filter(n => n.isNew).length} جديد
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          إشعارات مخصصة لتحسين أدائك
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>لا توجد إشعارات جديدة</p>
            <p className="text-xs mt-1">سنبقيك على اطلاع بكل جديد</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colors = getNotificationColor(notification.type);

            return (
              <Alert
                key={notification.id}
                className={`${colors.bg} ${colors.border} border-2 transition-all hover:shadow-md relative`}
              >
                {notification.isNew && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5">
                    جديد
                  </Badge>
                )}
                
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  
                  <div className="flex-1">
                    <AlertDescription>
                      <p className="font-semibold text-sm mb-1">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      
                      {notification.actionLabel && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 h-8 text-xs"
                          onClick={() => {
                            // Mark as read
                            if (notification.isNew) {
                              markAsRead(notification.id);
                            }
                            // Handle action
                            if (notification.actionLink) {
                              if (notification.actionLink.startsWith('#')) {
                                const element = document.querySelector(notification.actionLink);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth' });
                                }
                              } else {
                                window.location.href = notification.actionLink;
                              }
                            }
                          }}
                        >
                          {notification.actionLabel}
                        </Button>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
