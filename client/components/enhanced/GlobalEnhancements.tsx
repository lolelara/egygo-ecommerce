import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Lottie from 'lottie-react';
import { Helmet } from 'react-helmet-async';
import { useInView } from 'react-intersection-observer';
import { Parallax } from 'react-scroll-parallax';
import CountUp from 'react-countup';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Tilt from 'react-parallax-tilt';
import { colord } from 'colord';
import chroma from 'chroma-js';

// Import fonts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/cairo/400.css';
import '@fontsource/cairo/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

// Initialize AOS
export function initializeEnhancements() {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false,
    offset: 100
  });
}

// Enhanced Image Component
export function EnhancedImage({
  src,
  alt,
  className = '',
  effect = 'blur',
  threshold = 100,
  placeholder,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  effect?: 'blur' | 'opacity' | 'black-and-white';
  threshold?: number;
  placeholder?: string;
  [key: string]: any;
}) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect={effect}
      threshold={threshold}
      placeholderSrc={placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmM2Y0ZjYiLz48L3N2Zz4='}
      className={className}
      {...props}
    />
  );
}

// Enhanced Card with Tilt
export function EnhancedCard({
  children,
  className = '',
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  scale = 1.05,
  transitionSpeed = 1000,
  glareEnable = true,
  glareMaxOpacity = 0.3,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  scale?: number;
  transitionSpeed?: number;
  glareEnable?: boolean;
  glareMaxOpacity?: number;
  [key: string]: any;
}) {
  return (
    <Tilt
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
      scale={scale}
      transitionSpeed={transitionSpeed}
      glareEnable={glareEnable}
      glareMaxOpacity={glareMaxOpacity}
      className={className}
      {...props}
    >
      {children}
    </Tilt>
  );
}

// Animated Counter
export function AnimatedCounter({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  enableScrollSpy = true
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  enableScrollSpy?: boolean;
}) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <div ref={ref} className={className}>
      {(enableScrollSpy ? inView : true) && (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          enableScrollSpy={enableScrollSpy}
        />
      )}
    </div>
  );
}

// Skeleton Loader
export function EnhancedSkeleton({
  count = 1,
  height,
  width,
  circle = false,
  className = '',
  baseColor = '#f3f4f6',
  highlightColor = '#e5e7eb'
}: {
  count?: number;
  height?: number | string;
  width?: number | string;
  circle?: boolean;
  className?: string;
  baseColor?: string;
  highlightColor?: string;
}) {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <Skeleton
        count={count}
        height={height}
        width={width}
        circle={circle}
        className={className}
      />
    </SkeletonTheme>
  );
}

// Parallax Section
export function ParallaxSection({
  children,
  speed = -10,
  className = '',
  opacity = [1, 0],
  scale = [1, 0.8],
  translateY = [0, 100]
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  opacity?: [number, number];
  scale?: [number, number];
  translateY?: [number, number];
}) {
  return (
    <Parallax
      speed={speed}
      opacity={opacity}
      scale={scale}
      translateY={translateY}
      className={className}
    >
      {children}
    </Parallax>
  );
}

// Page Transition Wrapper
export function PageTransition({
  children,
  variant = 'fade'
}: {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate';
}) {
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: -100, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 100, opacity: 0 }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    },
    rotate: {
      initial: { rotate: -180, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      exit: { rotate: 180, opacity: 0 }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={variants[variant].initial}
        animate={variants[variant].animate}
        exit={variants[variant].exit}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// SEO Component
export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  locale = 'ar_EG'
}: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  locale?: string;
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url || window.location.href} />
    </Helmet>
  );
}

// Color Utilities
export const ColorUtils = {
  // Generate color palette from base color
  generatePalette: (baseColor: string) => {
    const color = chroma(baseColor);
    return {
      50: color.brighten(3).hex(),
      100: color.brighten(2.5).hex(),
      200: color.brighten(2).hex(),
      300: color.brighten(1.5).hex(),
      400: color.brighten(1).hex(),
      500: baseColor,
      600: color.darken(1).hex(),
      700: color.darken(1.5).hex(),
      800: color.darken(2).hex(),
      900: color.darken(2.5).hex()
    };
  },

  // Get contrasting text color
  getContrastColor: (bgColor: string) => {
    return colord(bgColor).isDark() ? '#ffffff' : '#000000';
  },

  // Generate gradient
  generateGradient: (color1: string, color2: string, angle = 135) => {
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  },

  // Mix colors
  mixColors: (color1: string, color2: string, ratio = 0.5) => {
    return chroma.mix(color1, color2, ratio).hex();
  },

  // Get complementary color
  getComplementary: (color: string) => {
    return colord(color).rotate(180).toHex();
  },

  // Get triadic colors
  getTriadic: (color: string) => {
    const base = colord(color);
    return [
      base.toHex(),
      base.rotate(120).toHex(),
      base.rotate(240).toHex()
    ];
  },

  // Get analogous colors
  getAnalogous: (color: string) => {
    const base = colord(color);
    return [
      base.rotate(-30).toHex(),
      base.toHex(),
      base.rotate(30).toHex()
    ];
  }
};

// Animation Variants for Framer Motion
export const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideDown: {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideLeft: {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  slideRight: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  zoomIn: {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  zoomOut: {
    hidden: { scale: 1.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  rotate: {
    hidden: { rotate: 180, opacity: 0 },
    visible: { rotate: 0, opacity: 1 }
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
};

// Lottie Animation Wrapper
export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  style = {}
}: {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
    />
  );
}

// Animated Text
export function AnimatedText({
  text,
  variant = 'fadeIn',
  className = '',
  delay = 0,
  duration = 0.5,
  splitByWord = false
}: {
  text: string;
  variant?: keyof typeof animationVariants;
  className?: string;
  delay?: number;
  duration?: number;
  splitByWord?: boolean;
}) {
  const elements = splitByWord ? text.split(' ') : text.split('');
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={className}
    >
      {elements.map((el, i) => (
        <motion.span
          key={i}
          variants={animationVariants[variant]}
          transition={{
            delay: delay + (i * 0.05),
            duration
          }}
          className="inline-block"
        >
          {el}{splitByWord ? ' ' : ''}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Gradient Text
export function GradientText({
  children,
  gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  className = ''
}: {
  children: React.ReactNode;
  gradient?: string;
  className?: string;
}) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: gradient
      }}
    >
      {children}
    </span>
  );
}
