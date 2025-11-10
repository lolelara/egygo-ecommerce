import { Link } from "react-router-dom";

interface Props {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function EgyGoLogoCreative({ size = "md", animated = true, className = "" }: Props) {
  const iconSizes = { sm: "w-10 h-10", md: "w-12 h-12", lg: "w-16 h-16" } as const;
  const textSizes = { sm: "text-2xl", md: "text-3xl", lg: "text-4xl" } as const;

  return (
    <Link to="/" aria-label="EgyGo" className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${iconSizes[size]} rounded-xl overflow-visible`}> 
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id="egygoGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
            <linearGradient id="sunset" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="14" r="6" fill="url(#sunset)" opacity="0.9" />

          <path d="M10 44 Q 22 26, 32 26 Q 42 26, 54 44" fill="url(#egygoGradient)" opacity="0.15" />
          <path d="M10 44 Q 22 26, 32 26 Q 42 26, 54 44" stroke="url(#egygoGradient)" strokeWidth="2" fill="none" />

          <path d="M10 48 C 22 52, 42 52, 54 48" stroke="url(#egygoGradient)" strokeWidth="3" fill="none" strokeLinecap="round" style={{ strokeDasharray: 80, strokeDashoffset: animated ? 80 : 0, animation: animated ? "waveMotion 3s ease-in-out infinite" : undefined }} />

          <path d="M12 50 C 30 58, 42 58, 58 52" stroke="url(#egygoGradient)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" />

          <path d="M14 38 L 32 14 L 50 38 Z" fill="url(#egygoGradient)" opacity="0.85" />
          <path d="M14 38 L 32 14 L 50 38 Z" stroke="white" strokeOpacity="0.2" />

          <path d="M8 56 C 30 56, 38 56, 58 56" stroke="url(#egygoGradient)" strokeWidth="4" fill="none" strokeLinecap="round" style={{ strokeDasharray: 120, strokeDashoffset: animated ? 120 : 0, animation: animated ? "drawArrow 1.8s ease-out forwards 0.2s" : undefined }} />
          <path d="M58 56 L 50 52 L 50 60 Z" fill="url(#egygoGradient)" />
        </svg>
      </div>

      <div className={`font-extrabold tracking-tight leading-none ${textSizes[size]}`}>
        <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Egy</span>
        <span className="text-foreground">Go</span>
        <span className="text-brand-orange">.me</span>
      </div>

      <style>{`
        @keyframes drawArrow { to { stroke-dashoffset: 0; } }
        @keyframes waveMotion { 0%, 100% { stroke-dashoffset: 80; } 50% { stroke-dashoffset: 0; } }
      `}</style>
    </Link>
  );
}
