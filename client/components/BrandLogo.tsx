import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ariaLabel?: string;
}

const textSizes: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl'
};

const pillPadding: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-0.5',
  lg: 'px-3 py-0.5',
  xl: 'px-3.5 py-1',
};

const tagPadding: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'px-1.5 py-0.5',
  md: 'px-2 py-0.5',
  lg: 'px-2.5 py-0.5',
  xl: 'px-3 py-1',
};

/**
 * BrandLogo
 * egy (red text) + go (red pill, white text) + .me (badge black/white per theme)
 */
export function BrandLogo({ className, size = 'md', ariaLabel = 'EgyGo' }: BrandLogoProps) {
  return (
    <div
      className={cn(
        'select-none inline-flex items-center font-extrabold tracking-tight gap-1',
        textSizes[size],
        className
      )}
      aria-label={ariaLabel}
      role="img"
    >
      {/* egy - red text */}
      <span className="text-red-600">egy</span>

      {/* go - red rounded pill with white text */}
      <span
        className={cn(
          'rounded-full text-white shadow-sm',
          'bg-gradient-to-r from-red-600 to-red-700',
          pillPadding[size]
        )}
      >
        go
      </span>

      {/* .me - small badge: black in light, white in dark (text color only) */}
      <span
        className={cn(
          'text-xs align-middle font-black',
          tagPadding[size],
          'text-black dark:text-white'
        )}
      >
        .me
      </span>
    </div>
  );
}
