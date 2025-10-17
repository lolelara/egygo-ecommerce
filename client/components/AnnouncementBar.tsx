import { useEffect, useState } from "react";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Button } from "@/components/ui/button";

interface Offer {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
  isActive: boolean;
  targetAudience: 'all' | 'customer' | 'affiliate' | 'merchant';
  priority: number;
}

export function AnnouncementBar() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  // Load offers from Appwrite
  useEffect(() => {
    loadOffers();
  }, [user]);

  const loadOffers = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.offers,
        [
          Query.equal('isActive', true),
          Query.orderDesc('priority'),
          Query.limit(10)
        ]
      );

      // Filter by user role
      const userRole = user?.isAffiliate ? 'affiliate' : 
                       user?.role === 'merchant' ? 'merchant' : 
                       user ? 'customer' : 'all';

      const filteredOffers = response.documents.filter((doc: any) => 
        doc.targetAudience === 'all' || doc.targetAudience === userRole
      );

      setOffers(filteredOffers.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        backgroundColor: doc.backgroundColor || 'from-brand-purple via-brand-orange to-brand-purple',
        textColor: doc.textColor || 'text-white',
        icon: doc.icon,
        isActive: doc.isActive,
        targetAudience: doc.targetAudience,
        priority: doc.priority || 0
      })));
    } catch (error) {
      // Silently fall back to default offer if collection doesn't exist
      // This is expected behavior until the offers collection is created
      const lang = document.documentElement.lang || 'ar';
      const isArabic = lang === 'ar';
      
      setOffers([{
        id: 'default',
        title: isArabic ? '💼 انضم لفريق الشركاء!' : '💼 Join Our Partners Team!',
        description: isArabic 
          ? 'سجّل الآن كتاجر أو مسوق واحصل على عمولات مميزة وأرباح مستمرة'
          : 'Register now as a merchant or affiliate and get exclusive commissions and continuous earnings',
        backgroundColor: 'from-brand-purple via-brand-orange to-brand-purple',
        textColor: 'text-white',
        isActive: true,
        targetAudience: 'all',
        priority: 1
      }]);
    }
  };

  // Auto-hide after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 6000); // 6 seconds

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  // Auto-rotate offers every 5 seconds
  useEffect(() => {
    if (offers.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
  };

  if (!isVisible || offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <div className={`bg-gradient-to-r ${currentOffer.backgroundColor} ${currentOffer.textColor} py-2.5 text-center text-sm font-medium animate-gradient-x relative`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          {offers.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20 flex-shrink-0"
              onClick={prevOffer}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Offer Content */}
          <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              <span className="font-bold">{currentOffer.title}</span>
              {currentOffer.description && (
                <> - {currentOffer.description}</>
              )}
            </span>
            <Sparkles className="h-4 w-4 flex-shrink-0" />
          </div>

          {/* Next Button */}
          {offers.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/20 flex-shrink-0"
              onClick={nextOffer}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20 flex-shrink-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots Indicator */}
        {offers.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
