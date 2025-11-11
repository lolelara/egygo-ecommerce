import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'default' | 'minimal' | 'branded' | 'dots' | 'pulse';
}

/**
 * شاشة تحميل محسّنة مع شعار EgyGo
 */
export function LoadingScreen({ 
  message = 'جاري التحميل...', 
  fullScreen = true,
  variant = 'branded'
}: LoadingScreenProps) {
  
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center space-y-6">
        {/* Logo Animations */}
        {variant === 'branded' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 200
            }}
            className="flex justify-center mb-4"
          >
            <BrandLogo size="xl" />
          </motion.div>
        )}

        {variant === 'pulse' && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
          />
        )}

        {variant === 'dots' && (
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -20, 0]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
              />
            ))}
          </div>
        )}

        {variant === 'minimal' && (
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        )}

        {variant === 'default' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
          />
        )}

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full max-w-xs mx-auto"
        />

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-lg font-medium"
        >
          {message}
        </motion.p>

        {/* Loading Dots Animation */}
        <motion.div
          className="flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
              className="text-2xl text-primary"
            >
              .
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Inline Loader - للاستخدام داخل الأزرار والكومبوننتات
 */
export function InlineLoader({ 
  size = 'default',
  message 
}: { 
  size?: 'sm' | 'default' | 'lg';
  message?: string;
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center gap-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}

/**
 * Skeleton Loader مع Animation محسّن
 */
export function SkeletonLoader({ 
  variant = 'product',
  count = 1 
}: { 
  variant?: 'product' | 'card' | 'text' | 'avatar';
  count?: number;
}) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'product':
        return (
          <div className="space-y-3">
            <motion.div
              animate={{
                backgroundPosition: ['200% 0', '-200% 0']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="h-64 w-full rounded-lg bg-gradient-to-r from-muted via-muted-foreground/20 to-muted"
              style={{ backgroundSize: '200% 100%' }}
            />
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div className="p-6 border rounded-lg space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-5/6 bg-muted rounded" />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-11/12 bg-muted rounded" />
            <div className="h-4 w-4/5 bg-muted rounded" />
          </div>
        );
      
      case 'avatar':
        return (
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-muted rounded" />
              <div className="h-3 w-1/4 bg-muted rounded" />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  );
}

/**
 * Page Loader - يظهر عند تحميل صفحة كاملة
 */
export function PageLoader({ message }: { message?: string }) {
  return <LoadingScreen message={message} fullScreen variant="branded" />;
}

/**
 * Button Loader - للاستخدام في الأزرار
 */
export function ButtonLoader() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}

export default LoadingScreen;
