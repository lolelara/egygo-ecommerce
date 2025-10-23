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
      <div className="relative flex items-center pt-8 pb-1 min-h-[3.5rem]" style={{ overflow: 'visible' }}>
        {/* Enhanced Arrow - positioned above text */}
        {showArrow && (
          <svg 
            className={`absolute top-0 left-1/2 -translate-x-1/2 ${arrowSizes[size]} pointer-events-none animate-pulse`}
            viewBox="0 0 140 60" 
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            style={{ 
              overflow: 'visible',
              filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))'
            }}
          >
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 0.9 }} />
              </linearGradient>
            </defs>

            {/* Smooth curved arrow with better bezier curve */}
            <path
              d="M 10 48 Q 30 12, 60 15 Q 90 18, 115 25"
              stroke="url(#arrowGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ 
                strokeDasharray: '200',
                strokeDashoffset: '200',
                animation: 'drawArrow 2s ease-out forwards'
              }}
            />
            
            {/* Enhanced arrow head - sleek triangle */}
            <path
              d="M 115 25 L 105 20 L 108 32 Z"
              fill={currentColors.arrow}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
              }}
            />
            
            {/* Subtle glow effect */}
            <path
              d="M 10 48 Q 30 12, 60 15 Q 90 18, 115 25"
              stroke={currentColors.arrow}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity="0.4"
              style={{ filter: 'blur(2px)' }}
            />
          </svg>
        )}
        
        {/* Text Logo */}
        <div className={`font-bold ${textSizes[size]} ${currentColors.text} tracking-tight`}>
          <span className="font-extrabold">Egygo</span>
          <span className="text-red-600">.me</span>
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes drawArrow {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
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
