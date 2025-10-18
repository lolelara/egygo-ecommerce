/**
 * Progress Indicator Component
 * 
 * Features:
 * - Circular and linear variants
 * - Animated progress
 * - Color coding
 * - Labels
 */

import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
  label?: string;
}

export function ProgressIndicator({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  color = 'default',
  showLabel = true,
  className,
  label,
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colorClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const sizeClasses = {
    linear: {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    },
    circular: {
      sm: 'w-12 h-12',
      md: 'w-16 h-16',
      lg: 'w-24 h-24',
    },
  };

  if (variant === 'circular') {
    const radius = size === 'sm' ? 20 : size === 'md' ? 28 : 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const svgSize = size === 'sm' ? 48 : size === 'md' ? 64 : 96;

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg
          className={cn('transform -rotate-90', sizeClasses.circular[size])}
          width={svgSize}
          height={svgSize}
        >
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={size === 'sm' ? 3 : size === 'md' ? 4 : 6}
            fill="none"
            className="text-muted opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={size === 'sm' ? 3 : size === 'md' ? 4 : 6}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              'transition-all duration-500 ease-out',
              {
                'text-primary': color === 'default',
                'text-green-500': color === 'success',
                'text-yellow-500': color === 'warning',
                'text-red-500': color === 'error',
              }
            )}
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              'font-bold',
              {
                'text-xs': size === 'sm',
                'text-sm': size === 'md',
                'text-lg': size === 'lg',
              }
            )}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          {showLabel && (
            <span className="text-sm font-medium">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn(
        'w-full bg-muted rounded-full overflow-hidden',
        sizeClasses.linear[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressIndicator;
