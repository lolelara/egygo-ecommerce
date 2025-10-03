import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Trash2, Package, ShoppingCart, AlertCircle, Info } from "lucide-react";
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

// Mock notifications API - replace with real API later
const mockNotifications = [
  {
    id: "1",
    type: "order",
    title: "تم تأكيد طلبك",
    message: "تم تأكيد طلبك #12345 وجاري التجهيز للشحن",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    type: "shipping",
    title: "تم شحن طلبك",
    message: "طلبك #12344 في الطريق إليك",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    type: "delivery",
    title: "تم تسليم طلبك",
    message: "تم تسليم طلبك #12343 بنجاح",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

const notificationIcons = {
  order: Package,
  shipping: ShoppingCart,
  delivery: Check,
  alert: AlertCircle,
  info: Info,
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
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  // Mock query - replace with real API
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockNotifications;
    },
    enabled: !!user?.id,
  });

  // Mark as read mutation
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark all as read mutation
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Delete notification mutation
  const deleteNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200));
      return notificationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

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
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 md:w-96">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
            >
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500">لا توجد إشعارات</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="p-2">
              {notifications.map((notification: any) => {
                const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Info;

                return (
                  <div
                    key={notification.id}
                    className={`group flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer mb-1 ${
                      !notification.read ? "bg-blue-50 hover:bg-blue-100" : ""
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead.mutate(notification.id);
                      }
                    }}
                  >
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === "order"
                          ? "bg-blue-100 text-blue-600"
                          : notification.type === "shipping"
                          ? "bg-purple-100 text-purple-600"
                          : notification.type === "delivery"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-sm">{notification.title}</p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification.mutate(notification.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full" size="sm">
                عرض كل الإشعارات
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
