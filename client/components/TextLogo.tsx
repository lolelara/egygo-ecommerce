import { cn } from '@/lib/utils';

interface TextLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl'
};

export function TextLogo({ className, size = 'md' }: TextLogoProps) {
  return (
    <div className={cn('font-black tracking-tight select-none', sizeClasses[size], className)}>
      <span className="text-red-600">egy</span>
      <span className="text-white dark:text-white">go</span>
      <span className="text-black dark:text-white">.me</span>
    </div>
  );
}

// Variant with background for better visibility
export function TextLogoWithBg({ className, size = 'md' }: TextLogoProps) {
  return (
    <div className={cn(
      'font-black tracking-tight select-none px-3 py-1.5 rounded-lg inline-flex items-center',
      'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900',
      'dark:from-gray-800 dark:via-gray-700 dark:to-gray-800',
      'shadow-lg',
      sizeClasses[size],
      className
    )}>
      <span className="text-red-600">egy</span>
      <span className="text-white">go</span>
      <span className="text-gray-200">.me</span>
    </div>
  );
}
