import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ArrowLeft, Sparkles, TrendingUp, Package, Zap, Star } from 'lucide-react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    if (featuredProducts.length <= 3) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const getVisibleProducts = () => {
    if (featuredProducts.length === 0) return [];
    const products = [];
    // We want 5 products visible
    const count = 5;
    for (let i = 0; i < count; i++) {
      // Calculate index wrapping around the array
      const index = (activeIndex + i) % featuredProducts.length;
      products.push(featuredProducts[index]);
    }
    return products;
  };

  const visibleProducts = getVisibleProducts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Helper to get card styles based on position (0-4)
  // 0: Far Left, 1: Left, 2: Center (Active), 3: Right, 4: Far Right
  const getCardStyle = (index: number) => {
    const isCenter = index === 2;
    const isLeft = index < 2;
    const isRight = index > 2;
    const dist = Math.abs(index - 2); // Distance from center

    return {
      zIndex: 30 - (dist * 10),
      scale: isCenter ? 1.1 : 1 - (dist * 0.15),
      x: isCenter ? 0 : (index - 2) * (window.innerWidth < 1024 ? 60 : 140), // Responsive spacing
      y: isCenter ? 0 : dist * 20,
      rotateY: isCenter ? 0 : (index - 2) * -15,
      opacity: isCenter ? 1 : 1 - (dist * 0.2),
      blur: isCenter ? 0 : dist * 2,
    };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[svh] lg:min-h-[700px] overflow-hidden flex items-center perspective-1000"
    >
      {/* ... (Background remains same) ... */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-800 overflow-hidden">
        <div className="absolute inset-0 egygo-pattern-pharaonic opacity-10" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Text Content (Same as before) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-right order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white mb-6 border border-white/20 shadow-lg">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold tracking-wide">عروض حصرية تصل إلى 50%</span>
            </motion.div>

            <h1 className="font-black text-white mb-6 leading-tight relative">
              <motion.span variants={itemVariants} className="block text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80 filter drop-shadow-lg">
                إيجي جو
              </motion.span>
              <motion.span variants={itemVariants} className="block text-3xl lg:text-5xl mt-2 text-white/90 font-bold">
                تجربة تسوق <span className="text-yellow-300 relative inline-block">
                  استثنائية
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>
              </motion.span>
            </h1>

            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-white/90 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              اكتشف آلاف المنتجات المميزة بأفضل الأسعار مع شحن سريع ومجاني على جميع الطلبات. الجودة التي تستحقها، بالسعر الذي تحبه.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onShopNow}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-yellow-500/30 flex items-center gap-3 font-bold transition-all"
              >
                <ShoppingBag className="w-6 h-6" />
                تسوق الآن
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onExploreDeals}
                className="px-8 py-4 text-lg rounded-2xl border-2 border-white/30 text-white hover:border-white transition-all flex items-center gap-3 font-bold backdrop-blur-sm bg-white/5"
              >
                استكشف العروض
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 grid grid-cols-3 gap-4 lg:gap-8 border-t border-white/10 pt-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center group cursor-default">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl mb-3 border border-white/20 group-hover:bg-white/20 transition-colors shadow-lg">
                      <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* 3D Visual Content - Updated for 5 items */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative h-[400px] lg:h-[600px] order-1 lg:order-2 mb-8 lg:mb-0 perspective-1000 flex items-center justify-center"
          >
            {featuredProducts.length > 0 ? (
              <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                {visibleProducts.map((product, index) => {
                  const style = getCardStyle(index);
                  return (
                    <Link
                      to={`/product/${product.id}`}
                      key={`${product.id}-${index}`}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ zIndex: style.zIndex }}
                    >
                      <motion.div
                        animate={{
                          scale: style.scale,
                          x: style.x,
                          y: style.y,
                          rotateY: style.rotateY,
                          opacity: style.opacity,
                          filter: `blur(${style.blur}px)`,
                          zIndex: style.zIndex,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className={`w-48 lg:w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-800 cursor-pointer hover:shadow-orange-500/20 transition-shadow`}
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div className="aspect-[4/5] relative overflow-hidden group">
                          <img
                            src={product.images?.[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="font-bold text-lg truncate mb-1">{product.name}</h3>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-yellow-400 text-xl">{product.price} ج.م</span>
                              <div className="flex items-center gap-1 text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{product.rating || 4.5}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              // Fallback 3D Cards
              <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                <motion.div
                  style={{ z: 50 }}
                  className="w-64 h-80 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl flex items-center justify-center"
                >
                  <Package className="w-20 h-20 text-white/50" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
