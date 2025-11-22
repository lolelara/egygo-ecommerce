import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Sparkles, TrendingUp, Package, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductWithRelations } from '@shared/prisma-types';

interface HeroSectionEnhancedProps {
  onShopNow?: () => void;
  onExploreDeals?: () => void;
  featuredProducts?: ProductWithRelations[];
}

export function HeroSectionEnhanced({ onShopNow, onExploreDeals, featuredProducts = [] }: HeroSectionEnhancedProps) {
  const stats = [
    { icon: Package, value: '10,000+', label: 'منتج متاح' },
    { icon: TrendingUp, value: '50K+', label: 'عميل سعيد' },
    { icon: Zap, value: '24/7', label: 'دعم فوري' },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (featuredProducts.length <= 3) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const getVisibleProducts = () => {
    if (featuredProducts.length === 0) return [];
    // Always show 3 items if possible, wrapping around
    const products = [];
    const count = Math.min(featuredProducts.length, 3);

    for (let i = 0; i < 3; i++) {
      // If we have fewer than 3 products, just cycle through what we have
      if (featuredProducts.length < 3) {
        products.push(featuredProducts[i % featuredProducts.length]);
      } else {
        products.push(featuredProducts[(activeIndex + i) % featuredProducts.length]);
      }
    }
    return products;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <div className="relative min-h-[600px] overflow-hidden">
      {/* Gradient Background with Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700">
        {/* Egyptian Pattern Overlay */}
        <div className="absolute inset-0 egygo-pattern-pharaonic opacity-20" />

        {/* Animated Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.4) 0%, transparent 50%)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            {/* Special Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md 
                         px-4 py-2 rounded-full text-white mb-6 border border-white/30"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-semibold">عروض حصرية تصل إلى 50%</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                إيجي جو
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="block text-4xl md:text-5xl mt-2 text-white/90 font-bold"
              >
                تجربة تسوق استثنائية
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              اكتشف آلاف المنتجات المميزة بأفضل الأسعار مع شحن سريع ومجاني على جميع الطلبات
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={onShopNow}
                className="btn-modern btn-gradient-orange px-8 py-4 text-lg rounded-xl
                           shadow-2xl hover:shadow-white/30 flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                تسوق الآن
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onExploreDeals}
                className="px-8 py-4 text-lg rounded-xl border-2 border-white text-white 
                           hover:bg-white hover:text-red-600 transition-all duration-300
                           flex items-center gap-2 font-semibold backdrop-blur-sm bg-white/10"
              >
                استكشف العروض
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 
                                    bg-white/20 backdrop-blur-md rounded-full mb-2 border border-white/30">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Visual Content - Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:block relative h-[500px]"
          >
            {featuredProducts.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {visibleProducts.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`} // Use index in key to force animation when position changes
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: index === 0 ? -5 : index === 1 ? 5 : 0,
                      scale: index === 2 ? 1.1 : 0.9,
                      zIndex: index === 2 ? 10 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-700
                                ${index === 0 ? 'left-0 top-10' : index === 1 ? 'right-0 bottom-10' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'}`}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={product.images?.[0]?.url || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h3>
                      <p className="text-red-600 dark:text-red-400 font-bold">{product.price} ج.م</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <>
                {/* Decorative Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-10 right-10 w-64 h-80 bg-white/10 backdrop-blur-lg 
                         rounded-2xl border border-white/20 p-6 shadow-2xl"
                >
                  <div className="w-full h-48 bg-white/20 rounded-xl mb-4" />
                  <div className="h-4 bg-white/30 rounded mb-2" />
                  <div className="h-4 bg-white/20 rounded w-2/3" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute bottom-10 left-10 w-56 h-72 bg-white/10 backdrop-blur-lg 
                         rounded-2xl border border-white/20 p-6 shadow-2xl"
                >
                  <div className="w-full h-40 bg-white/20 rounded-xl mb-4" />
                  <div className="h-4 bg-white/30 rounded mb-2" />
                  <div className="h-4 bg-white/20 rounded w-3/4" />
                </motion.div>

                {/* Center spotlight card */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                         w-60 h-76 bg-gradient-to-br from-white/30 to-white/10 
                         backdrop-blur-xl rounded-2xl border-2 border-white/40 p-6 
                         shadow-2xl z-10"
                >
                  <div className="w-full h-44 bg-white rounded-xl mb-4 shadow-lg" />
                  <div className="h-5 bg-white rounded mb-2" />
                  <div className="h-5 bg-white/70 rounded w-2/3 mb-3" />
                  <div className="h-10 bg-gradient-to-r from-red-500 to-red-700 
                              rounded-lg flex items-center justify-center text-white font-bold">
                    اشترِ الآن
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
            fillOpacity="0.1"
          />
          <path
            d="M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
