import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, FreeMode } from 'swiper/modules';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { toast } from 'sonner';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  discount?: number;
  badge?: string;
  description?: string;
}

interface SwiperProductSliderProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'coverflow' | 'cards' | 'thumbs';
  autoplay?: boolean;
  slidesPerView?: number;
}

export default function SwiperProductSlider({
  products,
  title,
  subtitle,
  variant = 'default',
  autoplay = true,
  slidesPerView = 4
}: SwiperProductSliderProps) {
  const thumbsSwiper = useRef<any>(null);

  const getSwiperConfig = () => {
    const baseConfig = {
      modules: [Navigation, Pagination, Autoplay, EffectCoverflow, Thumbs, FreeMode],
      spaceBetween: 20,
      navigation: true,
      pagination: {
        clickable: true,
        dynamicBullets: true
      },
      autoplay: autoplay ? {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      } : false,
      breakpoints: {
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: slidesPerView }
      }
    };

    switch (variant) {
      case 'coverflow':
        return {
          ...baseConfig,
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto' as const,
          coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }
        } as any;
      
      case 'cards':
        return {
          ...baseConfig,
          effect: 'cards',
          grabCursor: true,
          cardsEffect: {
            slideShadows: true
          }
        };
      
      case 'thumbs':
        return {
          ...baseConfig,
          thumbs: {
            swiper: thumbsSwiper.current
          }
        };
      
      default:
        return baseConfig;
    }
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  const handleAddToWishlist = (product: Product) => {
    toast.success(`تمت إضافة ${product.name} إلى المفضلة`);
  };

  const handleQuickView = (product: Product) => {
    toast.info(`عرض سريع لـ ${product.name}`);
  };

  return (
    <div className="swiper-product-slider py-8">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* Thumbs Gallery for variant="thumbs" */}
      {variant === 'thumbs' && products[0]?.images && (
        <div className="mb-4">
          <Swiper
            onSwiper={(swiper) => { thumbsSwiper.current = swiper; }}
            spaceBetween={10}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="thumbs-swiper h-24"
          >
            {products[0].images.map((image, index) => (
              <SwiperSlide key={index}>
                <img 
                  src={image} 
                  alt={`Thumb ${index}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Main Swiper */}
      <Swiper {...getSwiperConfig()} className="product-swiper">
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Badge */}
              {product.badge && (
                <Badge className="absolute top-2 right-2 z-10 animate-pulse">
                  {product.badge}
                </Badge>
              )}
              
              {/* Discount Badge */}
              {product.discount && (
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                  -{product.discount}%
                </Badge>
              )}

              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    onClick={() => handleQuickView(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                    onClick={() => handleAddToWishlist(product)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Product Name */}
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{product.price} ج.م</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice} ج.م
                    </span>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Styles */}
      <style>{`
        .product-swiper .swiper-button-next,
        .product-swiper .swiper-button-prev {
          background: rgba(255, 255, 255, 0.9);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .product-swiper .swiper-button-next:after,
        .product-swiper .swiper-button-prev:after {
          font-size: 20px;
          color: #333;
        }
        
        .product-swiper .swiper-pagination-bullet {
          background: #8b5cf6;
        }
        
        .product-swiper .swiper-pagination-bullet-active {
          background: #7c3aed;
          width: 24px;
          border-radius: 4px;
        }

        .thumbs-swiper .swiper-slide-thumb-active {
          border: 2px solid #8b5cf6;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
