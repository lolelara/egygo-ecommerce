import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Trash2, Package, ShoppingCart, AlertCircle, Info, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService, type Notification } from "@/lib/notification-service";

const notificationIcons = {
  order: Package,
  shipping: ShoppingCart,
  delivery: Check,
  alert: AlertCircle,
  info: Info,
  commission: DollarSign,
  affiliate: DollarSign,
};

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "الآن";
  if (seconds < 3600) return `منذ ${Math.floor(seconds / 60)} دقيقة`;
  if (seconds < 86400) return `منذ ${Math.floor(seconds / 3600)} ساعة`;
  if (seconds < 604800) return `منذ ${Math.floor(seconds / 86400)} يوم`;
  return date.toLocaleDateString("ar-EG");
}

export function NotificationDropdown() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch notifications from Appwrite
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.$id],
    queryFn: () => notificationService.getUserNotifications(user!.$id),
    enabled: !!user?.$id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.$id) return;

    const unsubscribe = notificationService.subscribeToNotifications(
      user.$id,
      (newNotification) => {
        // Add new notification to the list
        queryClient.setQueryData<Notification[]>(
          ["notifications", user.$id],
          (old = []) => [newNotification, ...old]
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.$id, queryClient]);

  // Mark as read mutation
  const markAsRead = useMutation({
    mutationFn: (notificationId: string) => 
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.$id] });
    },
  });

  // Mark all as read mutation
  const markAllAsRead = useMutation({
    mutationFn: () => notificationService.markAllAsRead(user!.$id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user?.$id] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead.mutate(notification.$id);
    }
    setIsOpen(false);

    // Navigate to related page if needed
    if (notification.relatedId && notification.type === 'order') {
      navigate(`/my-orders/${notification.relatedId}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-2">
          <h3 className="font-semibold">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="px-4 py-8 text-center text-muted-foreground">
            جاري التحميل...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-1">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                return (
                  <DropdownMenuItem
                    key={notification.$id}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer ${
                      !notification.read ? "bg-accent/50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className={`mt-1 p-2 rounded-full ${
                        !notification.read
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm leading-tight">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-tight">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.$createdAt)}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
