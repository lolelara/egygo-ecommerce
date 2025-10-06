import { useState } from "react";
import { Bell, CheckCheck, Filter, X, Package, TrendingUp, AlertTriangle, Gift, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "order" | "affiliate" | "inventory" | "promotion" | "message";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationsCenterProps {
  userId: string;
  userRole: "customer" | "affiliate" | "merchant" | "admin";
}

export function NotificationsCenter({ userId, userRole }: NotificationsCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");
  
  // Mock notifications data - replace with real API call
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "order",
      priority: "high",
      title: "طلب جديد #4521",
      message: "تم تأكيد طلبك وجاري التجهيز للشحن",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      read: false,
      actionUrl: "/orders/4521"
    },
    {
      id: "2",
      type: "affiliate",
      priority: "medium",
      title: "عمولة جديدة",
      message: "حصلت على عمولة 45 جنيه من عملية بيع",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      actionUrl: "/affiliate/earnings"
    },
    {
      id: "3",
      type: "inventory",
      priority: "high",
      title: "تنبيه مخزون منخفض",
      message: "منتج 'حذاء رياضي' أوشك على النفاد (5 قطع متبقية)",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      actionUrl: "/products/12345"
    },
    {
      id: "4",
      type: "promotion",
      priority: "medium",
      title: "عرض حصري",
      message: "خصم 20% على جميع المنتجات - صالح لمدة 24 ساعة",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      read: true,
      actionUrl: "/promotions"
    },
    {
      id: "5",
      type: "message",
      priority: "low",
      title: "رسالة جديدة من الدعم",
      message: "تم الرد على استفسارك رقم #782",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
      actionUrl: "/support/782"
    }
  ];

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return !notif.read;
    if (filter === "important") return notif.priority === "high";
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const icons = {
      order: Package,
      affiliate: TrendingUp,
      inventory: AlertTriangle,
      promotion: Gift,
      message: MessageSquare
    };
    return icons[type];
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    const colors = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
      low: "text-blue-600 bg-blue-50 border-blue-200"
    };
    return colors[priority];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white font-semibold animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">الإشعارات</h4>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 text-xs"
                >
                  <CheckCheck className="h-3.5 w-3.5 ml-1.5" />
                  تحديد الكل كمقروء
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="flex-1 h-8 text-xs"
              >
                الكل ({notifications.length})
              </Button>
              <Button
                size="sm"
                variant={filter === "unread" ? "default" : "outline"}
                onClick={() => setFilter("unread")}
                className="flex-1 h-8 text-xs"
              >
                غير المقروءة ({unreadCount})
              </Button>
              <Button
                size="sm"
                variant={filter === "important" ? "default" : "outline"}
                onClick={() => setFilter("important")}
                className="flex-1 h-8 text-xs"
              >
                مهمة ({notifications.filter(n => n.priority === "high").length})
              </Button>
            </div>
          </div>

          <Separator />

          {/* Notifications List */}
          <ScrollArea className="flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground font-medium">لا توجد إشعارات</p>
                <p className="text-xs text-muted-foreground mt-1">ستظهر الإشعارات الجديدة هنا</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-muted/50 transition-colors relative group",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div
                          className={cn(
                            "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border",
                            getPriorityColor(notification.priority)
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h5
                              className={cn(
                                "text-sm font-medium leading-tight",
                                !notification.read && "font-semibold"
                              )}
                            >
                              {notification.title}
                            </h5>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </button>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Badge variant="secondary" className="h-5 text-[10px] px-1.5">
                                جديد
                              </Badge>
                            )}
                          </div>

                          {/* Action Button */}
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => {
                                markAsRead(notification.id);
                                // Navigate to actionUrl
                                window.location.href = notification.actionUrl;
                              }}
                            >
                              عرض التفاصيل ←
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <>
              <Separator />
              <div className="p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-9 text-sm"
                  onClick={() => window.location.href = "/notifications"}
                >
                  عرض جميع الإشعارات
                </Button>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
