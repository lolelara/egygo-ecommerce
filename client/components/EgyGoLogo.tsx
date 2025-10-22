import { Link } from "react-router-dom";

interface EgyGoLogoProps {
  variant?: 'default' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
}

export function EgyGoLogo({ 
  variant = 'default', 
  size = 'md',
  showArrow = true,
  className = '' 
}: EgyGoLogoProps) {
  
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const arrowSizes = {
    sm: 'w-12 h-6',
    md: 'w-16 h-8',
    lg: 'w-24 h-12'
  };

  // Colors based on variant
  const colors = {
    default: {
      text: 'text-foreground',
      arrow: '#3B82F6' // Blue
    },
    white: {
      text: 'text-white',
      arrow: '#60A5FA' // Light blue
    },
    dark: {
      text: 'text-gray-900',
      arrow: '#2563EB' // Dark blue
    }
  };

  const currentColors = colors[variant];

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center pt-6 pb-1 min-h-[3rem]" style={{ overflow: 'visible' }}>
        {/* Arrow - positioned above text */}
        {showArrow && (
          <svg 
            className={`absolute top-0 left-1/2 -translate-x-1/2 ${arrowSizes[size]} pointer-events-none`}
            viewBox="0 0 100 45" 
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            style={{ overflow: 'visible' }}
          >
            {/* Curved arrow path - smooth arc like in reference */}
            <path
              d="M 10 35 Q 35 5, 60 10 T 95 22"
              stroke={currentColors.arrow}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Arrow head - clear triangular pointer */}
            <path
              d="M 95 22 L 88 15 L 90 27 Z"
              fill={currentColors.arrow}
              stroke={currentColors.arrow}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        )}
        
        {/* Text Logo */}
        <div className={`font-bold ${textSizes[size]} ${currentColors.text} tracking-tight`}>
          <span className="font-extrabold">Egygo</span>
          <span className="text-red-600">.me</span>
        </div>
      </div>
    </Link>
  );
}

// Alternative: Full logo with icon (for hero sections)
export function EgyGoLogoFull({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Icon: E + Cart + Dollar + Arrow */}
      <div className="relative w-24 h-24">
        {/* Background E */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-black text-white opacity-90">E</div>
        </div>
        
        {/* Shopping Cart */}
        <svg 
          className="absolute bottom-2 right-2 w-12 h-12 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 2L7 6H2L5 20H19L22 6H17L15 2H9Z" />
          <circle cx="9" cy="21" r="1" fill="currentColor" />
          <circle cx="18" cy="21" r="1" fill="currentColor" />
        </svg>

        {/* Dollar Sign */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">$</span>
        </div>

        {/* Growth Arrow */}
        <svg 
          className="absolute top-0 left-0 w-16 h-12 text-blue-400"
          viewBox="0 0 60 40"
          fill="none"
        >
          <path
            d="M 5 35 Q 30 10, 50 15"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 50 15 L 42 12 L 45 20 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="text-4xl font-bold text-white tracking-tight">
        <span className="font-extrabold">Egygo</span>
        <span className="text-white/90">.me</span>
      </div>
    </Link>
  );
}
