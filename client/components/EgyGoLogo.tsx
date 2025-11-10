import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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
    sm: 'h-4',
    md: 'h-5',
    lg: 'h-7'
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
  const textRef = useRef<HTMLDivElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (textRef.current) {
        setTextWidth(textRef.current.getBoundingClientRect().width);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-center pt-1 pb-6 min-h-[3.5rem]" style={{ overflow: 'visible', width: textWidth ? `${textWidth}px` : undefined }}>
        {/* Enhanced Arrow - positioned at bottom of text (underline style) */}
        {showArrow && (
          <svg 
            className={`absolute bottom-0 left-0 right-0 ${arrowSizes[size]} pointer-events-none`}
            viewBox="0 0 100 30" 
            fill="none"
            preserveAspectRatio="none"
            style={{ 
              overflow: 'visible',
              filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
              width: '100%'
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

            {/* Smooth arrow - curved arc under the text */}
            <path
              d="M 0 22 C 30 30, 70 30, 100 22"
              stroke="url(#arrowGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ 
                strokeDasharray: '150',
                strokeDashoffset: '150',
                animation: 'drawArrow 2s ease-out forwards'
              }}
            />
            
            {/* Arrow head at the END - proper triangle */}
            <path
              d="M 100 22 L 92 18 L 92 26 Z"
              fill={currentColors.arrow}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
              }}
            />
            
            {/* Subtle glow effect */}
            <path
              d="M 0 22 C 30 30, 70 30, 100 22"
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
        <div ref={textRef} className={`font-bold ${textSizes[size]} ${currentColors.text} tracking-tight`}>
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
