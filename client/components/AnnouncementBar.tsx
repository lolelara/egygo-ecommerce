import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "announcement-dismissed-v1";

interface AnnouncementBarProps {
  className?: string;
}

export function AnnouncementBar({ className }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setIsVisible(true);
      }
    } catch (error) {
      setIsVisible(true);
    }
  }, []);

  if (!isHydrated || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch (error) {
      // ignore storage errors (private mode etc.)
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-r from-brand-orange via-brand-yellow to-brand-purple text-white",
        "border-b border-white/20",
        className
      )}
    >
      <div className="container mx-auto flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <Volume2 className="h-3.5 w-3.5" />
          </span>
          <span>
            🚀 لفترة محدودة: شحن مجاني على الطلبات فوق <strong>999 جنيه</strong> + مكافأة ترحيب للمسوقين الجدد.
          </span>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <Link
            to="/deals"
            className="text-xs font-semibold uppercase tracking-wide underline-offset-4 hover:underline"
          >
            تسوق العروض الآن
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 rounded-full text-white hover:bg-white/20"
            onClick={handleDismiss}
            aria-label="إغلاق الإعلان"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
