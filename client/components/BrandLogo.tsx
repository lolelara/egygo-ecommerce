import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ariaLabel?: string;
}

const sizeClasses: Record<NonNullable<BrandLogoProps['size']>, string> = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-16'
};

/**
 * BrandLogo
 * Modern SVG Logo for EgyGo
 */
export function BrandLogo({ className, size = 'md', ariaLabel = 'EgyGo' }: BrandLogoProps) {
  return (
    <div
      dir="ltr"
      className={cn(
        'select-none inline-flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        viewBox="0 0 200 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Symbol: Stylized 'G' with arrow/play button feel */}
        <path
          d="M30 10C18.9543 10 10 18.9543 10 30C10 41.0457 18.9543 50 30 50H45C47.7614 50 50 47.7614 50 45V30H35"
          stroke="url(#logo-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M45 30L55 30L50 25"
          stroke="url(#logo-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Text: EgyGo */}
        <text
          x="70"
          y="42"
          fontFamily="Arial, sans-serif"
          fontWeight="900"
          fontSize="36"
          fill="currentColor"
          className="text-foreground"
        >
          Egy
          <tspan fill="url(#logo-gradient)">Go</tspan>
        </text>

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DC2626" /> {/* Red-600 */}
            <stop offset="50%" stopColor="#F97316" /> {/* Orange-500 */}
            <stop offset="100%" stopColor="#9333EA" /> {/* Purple-600 */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
