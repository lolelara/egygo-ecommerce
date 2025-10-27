/**
 * Rotating Banner Component
 * بانر دعائي متحرك قابل للتخصيص
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Banner {
  $id?: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive?: boolean;
  order?: number;
}

interface RotatingBannerProps {
  banners: Banner[];
  autoPlayInterval?: number; // بالثواني
  showControls?: boolean;
  height?: string;
  location: 'offers' | 'products' | 'affiliate';
}

export default function RotatingBanner({
  banners,
  autoPlayInterval = 5,
  showControls = true,
  height = '300px',
  location
}: RotatingBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const activeBanners = banners
    .filter(b => b.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || activeBanners.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, autoPlayInterval * 1000);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, activeBanners.length, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleBannerClick = (link?: string) => {
    if (link) {
      if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.location.href = link;
      }
    }
  };

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex];

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-lg group"
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="rtl"
    >
      {/* البانر الحالي */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          currentBanner.link ? 'cursor-pointer' : ''
        }`}
        onClick={() => handleBannerClick(currentBanner.link)}
      >
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Overlay gradient للنص */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* عنوان البانر */}
        {currentBanner.title && (
          <div className="absolute bottom-4 right-4 left-4">
            <h3 className="text-white text-2xl font-bold drop-shadow-lg">
              {currentBanner.title}
            </h3>
          </div>
        )}
      </div>

      {/* أزرار التحكم */}
      {showControls && activeBanners.length > 1 && (
        <>
          {/* سهم السابق */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* سهم التالي */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* زر تشغيل/إيقاف */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </>
      )}

      {/* مؤشرات النقاط */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`انتقل إلى البانر ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* عداد البانرات */}
      {activeBanners.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {activeBanners.length}
        </div>
      )}
    </div>
  );
}
