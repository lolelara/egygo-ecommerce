import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X, Cookie, Settings, Shield, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always enabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      // Show banner after 1 second
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    } else {
      // Load saved preferences
      const saved = localStorage.getItem("cookiePreferences");
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
    setIsVisible(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(necessaryOnly);
    setIsVisible(false);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowSettings(false);
    setIsVisible(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookieConsent", "true");
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());

    // Apply preferences
    if (prefs.analytics) {
      // Enable analytics
      console.log("Analytics enabled");
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log("Marketing cookies enabled");
    }
    if (prefs.preferences) {
      // Enable preference cookies
      console.log("Preference cookies enabled");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
        <Card className="max-w-6xl mx-auto border-2 shadow-2xl bg-background/95 backdrop-blur-xl">
          <div className="p-4 md:p-6">
            <div className="flex items-start gap-4">
              {/* Cookie Icon */}
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <Cookie className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    🍪 نستخدم الكوكيز لتحسين تجربتك
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    نستخدم ملفات تعريف الارتباط (الكوكيز) لتحسين تجربتك على موقعنا، وتحليل حركة المرور، 
                    وتخصيص المحتوى والإعلانات. من خلال النقر على "قبول الكل"، فإنك توافق على استخدامنا 
                    لجميع ملفات تعريف الارتباط.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    onClick={acceptAll}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    <CheckCircle className="h-4 w-4 ml-2" />
                    قبول الكل
                  </Button>

                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    size="sm"
                  >
                    الضرورية فقط
                  </Button>

                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    size="sm"
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    إعدادات الكوكيز
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    asChild
                  >
                    <a href="/privacy" target="_blank">
                      <Shield className="h-3 w-3 ml-1" />
                      سياسة الخصوصية
                    </a>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-auto"
                    onClick={() => setIsVisible(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              إعدادات الكوكيز
            </DialogTitle>
            <DialogDescription>
              اختر أنواع ملفات تعريف الارتباط التي تريد السماح بها. يمكنك تغيير هذه الإعدادات في أي وقت.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    الكوكيز الضرورية
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      مطلوبة
                    </span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    ضرورية لتشغيل الموقع بشكل صحيح. لا يمكن تعطيلها.
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                مثال: تسجيل الدخول، السلة، اللغة، الأمان
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="text-base font-semibold">
                    كوكيز التحليلات
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    تساعدنا في فهم كيفية تفاعل الزوار مع الموقع من خلال جمع معلومات مجهولة المصدر.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, analytics: checked })
                  }
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                مثال: Google Analytics، عدد الزوار، الصفحات الأكثر زيارة
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="marketing" className="text-base font-semibold">
                    كوكيز التسويق
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    تُستخدم لتتبع الزوار عبر المواقع وعرض إعلانات ملائمة وجذابة للمستخدم الفردي.
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, marketing: checked })
                  }
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                مثال: Facebook Pixel، Google Ads، إعلانات مخصصة
              </div>
            </div>

            {/* Preference Cookies */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="preferences" className="text-base font-semibold">
                    كوكيز التفضيلات
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    تمكن الموقع من تذكر المعلومات التي تغير طريقة تصرف أو مظهر الموقع.
                  </p>
                </div>
                <Switch
                  id="preferences"
                  checked={preferences.preferences}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, preferences: checked })
                  }
                />
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                مثال: اللغة المفضلة، الثيم (فاتح/داكن)، المنطقة الزمنية
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={saveCustomPreferences}
              className="bg-gradient-to-r from-primary to-purple-600"
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              حفظ التفضيلات
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
