/**
 * 🎭 Animated Components with Framer Motion
 */

import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

// ========================================
// 1. PAGE TRANSITIONS
// ========================================

export const PageTransition = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {children}
    </motion.div>
  );
};

export const SlidePageTransition = ({ children, direction = 'right' }: { 
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}) => {
  const variants = {
    left: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    up: { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } }
  };

  return (
    <motion.div
      initial={variants[direction].initial}
      animate={variants[direction].animate}
      exit={variants[direction].initial}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

// ========================================
// 2. SCROLL ANIMATIONS
// ========================================

export const ParallaxSection = ({ 
  children, 
  speed = 0.5 
}: { 
  children: ReactNode;
  speed?: number;
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
};

export const ScrollReveal = ({ 
  children,
  delay = 0,
  duration = 0.5
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay, duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// ========================================
// 3. GESTURE ANIMATIONS
// ========================================

export const DraggableCard = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-move"
    >
      {children}
    </motion.div>
  );
};

export const SwipeCard = ({ 
  children,
  onSwipeLeft,
  onSwipeRight
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) => {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(offset.x) * velocity.x;
        if (swipe < -10000 && onSwipeLeft) {
          onSwipeLeft();
        } else if (swipe > 10000 && onSwipeRight) {
          onSwipeRight();
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const TiltCard = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      whileHover={{
        rotateX: -10,
        rotateY: 10,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: "preserve-3d" }}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

// ========================================
// 4. PHYSICS-BASED ANIMATIONS
// ========================================

export const SpringButton = ({ 
  children,
  onClick
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      onClick={onClick}
      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold"
    >
      {children}
    </motion.button>
  );
};

export const ElasticBox = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1.2, 1, 1],
        rotate: [0, 0, 270, 270, 0],
        borderRadius: ["20%", "20%", "50%", "50%", "20%"]
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 1
      }}
    >
      {children}
    </motion.div>
  );
};

// ========================================
// 5. STAGGER ANIMATIONS
// ========================================

export const StaggerContainer = ({ 
  children,
  staggerChildren = 0.1
}: {
  children: ReactNode;
  staggerChildren?: number;
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children }: { children: ReactNode }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={item}>
      {children}
    </motion.div>
  );
};

// ========================================
// 6. MORPHING ANIMATIONS
// ========================================

export const MorphingText = ({ 
  text,
  className = ""
}: {
  text: string;
  className?: string;
}) => {
  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

// ========================================
// 7. FLOATING ANIMATIONS
// ========================================

export const FloatingElement = ({ 
  children,
  duration = 3
}: {
  children: ReactNode;
  duration?: number;
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// ========================================
// 8. PRODUCT ANIMATIONS
// ========================================

export const ProductCard3D = ({ 
  image,
  title,
  price
}: {
  image: string;
  title: string;
  price: string;
}) => {
  return (
    <motion.div
      className="relative w-64 h-80 cursor-pointer"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div
        className="absolute inset-0 bg-white rounded-xl shadow-lg overflow-hidden"
        variants={{
          rest: { rotateY: 0 },
          hover: { rotateY: 180 }
        }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-lg text-purple-600">{price}</p>
        </div>
      </motion.div>
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white"
        variants={{
          rest: { rotateY: -180 },
          hover: { rotateY: 0 }
        }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
      >
        <h3 className="text-xl font-bold mb-4">تفاصيل المنتج</h3>
        <p className="mb-4">معلومات إضافية عن المنتج...</p>
        <button className="w-full py-2 bg-white text-purple-600 rounded-lg font-semibold">
          أضف للسلة
        </button>
      </motion.div>
    </motion.div>
  );
};

// ========================================
// 9. LOADING ANIMATIONS
// ========================================

export const PulseLoader = () => {
  return (
    <div className="flex space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-3 h-3 bg-purple-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonLoader = () => {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-20 bg-gray-200 rounded-lg"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// ========================================
// 10. NOTIFICATION ANIMATIONS
// ========================================

export const NotificationToast = ({ 
  message,
  type = 'info'
}: {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}) => {
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`fixed top-4 right-4 p-4 rounded-lg text-white ${colors[type]} shadow-lg`}
    >
      {message}
    </motion.div>
  );
};
