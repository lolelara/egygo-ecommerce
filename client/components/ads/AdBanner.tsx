import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { adsManager, type Advertisement } from '@/lib/ads-manager';
import { Sparkles } from 'lucide-react';

interface AdBannerProps {
  adType?: 'homepage_banner' | 'category_top';
  category?: string;
}

export function AdBanner({ adType = 'homepage_banner', category }: AdBannerProps) {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAd();
  }, [adType, category]);

  const loadAd = async () => {
    try {
      const ads = await adsManager.getActiveAds(adType, 1);
      if (ads.length > 0) {
        setAd(ads[0]);
        // Track impression
        adsManager.trackImpression(ads[0].$id);
      }
    } catch (error) {
      console.error('Error loading ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (ad) {
      adsManager.trackClick(ad.$id);
    }
  };

  if (loading || !ad) {
    return null;
  }

  return (
    <Link
      to={`/product/${ad.productId}`}
      onClick={handleClick}
      className="block group"
    >
      <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-lg hover:shadow-xl">
        {/* Ad Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 shadow-lg">
            <Sparkles className="h-3 w-3 mr-1 inline" />
            إعلان
          </Badge>
        </div>

        {/* Banner Content */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-white space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                {ad.productName}
              </h2>
              <p className="text-lg text-white/90">
                عرض خاص ومميز
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold"
              >
                اشترِ الآن
              </Button>
            </div>

            {/* Product Image */}
            {ad.productImage && (
              <div className="flex justify-center">
                <img
                  src={ad.productImage}
                  alt={ad.productName}
                  className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Shine Effect on Hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </Link>
  );
}
