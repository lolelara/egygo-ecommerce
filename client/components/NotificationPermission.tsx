import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, Bell, BellOff, Gift, Zap, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NotificationPermission() {
  const [isVisible, setIsVisible] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      return;
    }

    const currentPermission = Notification.permission;
    setPermission(currentPermission);

    // Check if user has already been asked
    const hasAsked = localStorage.getItem("notificationPermissionAsked");
    const dismissedAt = localStorage.getItem("notificationPermissionDismissed");

    if (currentPermission === "default" && !hasAsked) {
      // Show prompt after 3 seconds
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    } else if (currentPermission === "default" && dismissedAt) {
      // If dismissed, show again after 7 days
      const dismissedDate = new Date(dismissedAt);
      const daysSinceDismissed = Math.floor(
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceDismissed >= 7) {
        setTimeout(() => {
          setIsVisible(true);
        }, 5000);
      }
    }
  }, []);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      localStorage.setItem("notificationPermissionAsked", "true");
      
      if (result === "granted") {
        toast({
          title: "✅ تم تفعيل الإشعارات",
          description: "سنرسل لك إشعارات بأحدث العروض والخصومات",
        });

        // Send a test notification
        setTimeout(() => {
          new Notification("مرحباً بك في إيجي جو! 🎉", {
            body: "ستصلك إشعارات بأفضل العروض والخصومات الحصرية",
            icon: "/logo.png",
            badge: "/badge.png",
            tag: "welcome",
          });
        }, 1000);

        setIsVisible(false);
      } else if (result === "denied") {
        toast({
          title: "تم رفض الإشعارات",
          description: "يمكنك تفعيل الإشعارات لاحقاً من إعدادات المتصفح",
          variant: "destructive",
        });
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من طلب إذن الإشعارات",
        variant: "destructive",
      });
    }
  };

  const dismiss = () => {
    localStorage.setItem("notificationPermissionDismissed", new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible || permission !== "default") return null;

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-6 z-[99] animate-in slide-in-from-top duration-500">
      <Card className="max-w-md ml-auto border-2 shadow-2xl bg-background/95 backdrop-blur-xl overflow-hidden">
        {/* Gradient Header */}
        <div className="h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500" />
        
        <div className="p-4">
          <div className="flex items-start gap-4">
            {/* Bell Icon */}
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg animate-pulse">
              <Bell className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  🔔 فعّل الإشعارات
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  احصل على إشعارات فورية بـ:
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="h-3 w-3 text-green-600" />
                  </div>
                  <span>أحدث العروض والخصومات الحصرية</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>عروض البرق والتخفيضات السريعة</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="h-3 w-3 text-purple-600" />
                  </div>
                  <span>كوبونات خصم خاصة لك فقط</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={requestPermission}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                >
                  <Bell className="h-4 w-4 ml-2" />
                  تفعيل الإشعارات
                </Button>

                <Button
                  onClick={dismiss}
                  variant="ghost"
                  size="sm"
                  className="px-3"
                >
                  <BellOff className="h-4 w-4 ml-1" />
                  ليس الآن
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                💡 يمكنك إلغاء الإشعارات في أي وقت من إعدادات المتصفح
              </p>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-8 w-8"
              onClick={dismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
