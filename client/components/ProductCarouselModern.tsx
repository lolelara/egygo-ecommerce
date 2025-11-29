import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';
import { ProductCardPremium } from './ProductCardPremium';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useRef, useState } from 'react';
import { Button } from './ui/button';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Product {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount?: number;
    discount?: number;
    badge?: string;
    isNew?: boolean;
    isTrending?: boolean;
}

interface ProductCarouselModernProps {
    products: Product[];
    title?: string;
    subtitle?: string;
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
    wishlistedIds?: string[];
    onToggleWishlist?: (productId: string) => void;
}

export function ProductCarouselModern({
    products,
    title = 'home.featured.title',
    subtitle = 'home.featured.subtitle',
    onProductClick,
    onAddToCart,
    onQuickView,
    wishlistedIds = [],
    onToggleWishlist,
}: ProductCarouselModernProps) {
    const { t, dir } = useI18n();

    // Translate title and subtitle if they are keys
    const displayTitle = title.startsWith('home.') ? t(title) : title;
    const displaySubtitle = subtitle && subtitle.startsWith('home.') ? t(subtitle) : subtitle;

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-block"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 
                           via-pink-600 to-orange-500 bg-clip-text text-transparent">
                            {displayTitle}
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-orange-500 
                            rounded-full mx-auto mb-4" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        {displaySubtitle}
                    </motion.p>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="relative"
                >
                    <Swiper
                        modules={[Autoplay, EffectCoverflow, Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        key={dir} // Force re-render on direction change
                        dir={dir}
                        navigation={{
                            nextEl: '.swiper-button-next-custom',
                            prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={products.length >= 6} // Ensure enough slides for loop
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                        className="pb-12"
                    >
                        {products.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => onProductClick?.(product)}
                                >
                                    <ProductCardPremium
                                        product={product}
                                        onAddToCart={onAddToCart}
                                        onQuickView={onQuickView}
                                        onToggleWishlist={onToggleWishlist}
                                        isWishlisted={wishlistedIds.includes(product.id)}
                                    />
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Buttons */}
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 end-0 
                       z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl
                       flex items-center justify-center text-purple-600 dark:text-purple-400
                       hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300
                       border-2 border-purple-200 dark:border-gray-700 hover:border-purple-600
                       -me-6 hidden md:flex"
                    >
                        <ChevronRight className="w-6 h-6 rtl:rotate-180" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 start-0 
                       z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl
                       flex items-center justify-center text-purple-600 dark:text-purple-400
                       hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white transition-all duration-300
                       border-2 border-purple-200 dark:border-gray-700 hover:border-purple-600
                       -ms-6 hidden md:flex"
                    >
                        <ChevronLeft className="w-6 h-6 rtl:rotate-180" />
                    </motion.button>
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <Button
                        variant="outline"
                        className="gap-2 group px-8 py-6 text-lg rounded-xl border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white transition-all duration-300"
                        onClick={() => window.location.href = '/products'}
                    >
                        {t('home.products.viewAll')}
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </Button>
                </motion.div>
            </div>

            {/* Custom Pagination Styles */}
            <style>{`
        .swiper-pagination-bullet {
          background: #9333EA;
          opacity: 0.3;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 5px;
          background: linear-gradient(135deg, #9333EA 0%, #F97316 100%);
        }
      `}</style>
        </section>
    );
}
