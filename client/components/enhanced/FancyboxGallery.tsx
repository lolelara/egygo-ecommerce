import { useEffect, useRef } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Expand, Download, Share2, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryImage {
  id: string;
  src: string;
  thumb?: string;
  caption?: string;
  alt?: string;
  category?: string;
  width?: number;
  height?: number;
}

interface FancyboxGalleryProps {
  images: GalleryImage[];
  variant?: 'grid' | 'masonry' | 'carousel' | 'single';
  columns?: number;
  showCaptions?: boolean;
  enableZoom?: boolean;
  enableDownload?: boolean;
  enableShare?: boolean;
}

export default function FancyboxGallery({
  images,
  variant = 'grid',
  columns = 3,
  showCaptions = true,
  enableZoom = true,
  enableDownload = true,
  enableShare = true
}: FancyboxGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Fancybox with type assertion
    Fancybox.bind('[data-fancybox="gallery"]', {
      infinite: true,
      animated: true,
      showClass: 'fancybox-fadeIn',
      hideClass: 'fancybox-fadeOut',
    } as any);

    return () => {
      Fancybox.destroy();
    };
  }, [enableZoom]);

  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.alt || 'image';
    link.click();
    toast.success('بدأ التحميل');
  };

  const handleShare = (image: GalleryImage) => {
    if (navigator.share) {
      navigator.share({
        title: image.caption || 'صورة',
        url: image.src,
      });
    } else {
      navigator.clipboard.writeText(image.src);
      toast.success('تم نسخ الرابط');
    }
  };

  const handleFavorite = (image: GalleryImage) => {
    toast.success('تمت الإضافة إلى المفضلة');
  };

  const getGridClass = () => {
    switch (variant) {
      case 'masonry':
        return 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4';
      case 'carousel':
        return 'flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory';
      case 'single':
        return 'max-w-4xl mx-auto';
      default:
        return `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-4`;
    }
  };

  const getImageClass = () => {
    switch (variant) {
      case 'masonry':
        return 'break-inside-avoid mb-4';
      case 'carousel':
        return 'flex-shrink-0 w-80 snap-center';
      default:
        return '';
    }
  };

  return (
    <div ref={galleryRef} className="fancybox-gallery">
      {/* Gallery Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">معرض الصور</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <span className="text-sm">عرض الكل</span>
          </Button>
        </div>
      </div>

      {/* Categories Filter */}
      {images.some(img => img.category) && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Badge variant="default" className="cursor-pointer">الكل</Badge>
          {[...new Set(images.map(img => img.category).filter(Boolean))].map(category => (
            <Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
              {category}
            </Badge>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className={getGridClass()}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`group relative overflow-hidden rounded-lg ${getImageClass()}`}
          >
            {/* Image */}
            <a
              href={image.src}
              data-fancybox="gallery"
              data-caption={image.caption}
              className="block relative"
            >
              <img
                src={image.thumb || image.src}
                alt={image.alt || image.caption}
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFavorite(image);
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  {enableShare && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        handleShare(image);
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  {enableDownload && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(image);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Expand Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Expand className="h-8 w-8 text-white transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                </div>

                {/* Caption */}
                {showCaptions && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-medium line-clamp-2">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </a>

            {/* Category Badge */}
            {image.category && (
              <Badge className="absolute top-2 left-2 z-10">
                {image.category}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Custom Styles */}
      <style>{`
        .fancybox__container {
          --fancybox-bg: rgba(0, 0, 0, 0.95);
        }

        .fancybox__slide {
          padding: 2rem;
        }

        .fancybox__caption {
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 1.5rem;
        }

        .fancybox__toolbar {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .fancybox__thumbs {
          background: rgba(0, 0, 0, 0.8);
        }

        .fancybox__thumb {
          border: 2px solid transparent;
          transition: border-color 0.3s;
        }

        .fancybox__thumb.is-selected {
          border-color: #8b5cf6;
        }

        /* Masonry specific styles */
        .columns-1 { column-count: 1; }
        .columns-2 { column-count: 2; }
        .columns-3 { column-count: 3; }
        .columns-4 { column-count: 4; }
        
        @media (max-width: 640px) {
          .columns-2, .columns-3, .columns-4 { column-count: 1; }
        }
        
        @media (min-width: 640px) and (max-width: 768px) {
          .columns-3, .columns-4 { column-count: 2; }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .columns-4 { column-count: 3; }
        }
      `}</style>
    </div>
  );
}
