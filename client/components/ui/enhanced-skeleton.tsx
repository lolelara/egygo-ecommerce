/**
 * Enhanced Skeleton Loader Component
 * 
 * Features:
 * - Multiple variants
 * - Wave animation
 * - Pulse animation
 * - Pre-built layouts
 */

import { cn } from "@/lib/utils";

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'wave' | 'pulse';
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  count?: number;
}

function EnhancedSkeleton({
  className,
  variant = 'wave',
  width,
  height,
  circle = false,
  count = 1,
  ...props
}: EnhancedSkeletonProps) {
  const skeletonElements = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(
        "bg-muted",
        {
          "animate-pulse": variant === 'pulse',
          "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]": variant === 'wave',
          "rounded-full": circle,
          "rounded-md": !circle,
        },
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
      {...props}
    />
  ));

  return count > 1 ? (
    <div className="space-y-2">
      {skeletonElements}
    </div>
  ) : (
    <>{skeletonElements}</>
  );
}

// Pre-built skeleton layouts
function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <EnhancedSkeleton height="12rem" />
      <EnhancedSkeleton width="60%" />
      <EnhancedSkeleton width="40%" />
      <div className="flex justify-between pt-2">
        <EnhancedSkeleton width="30%" />
        <EnhancedSkeleton width="30%" />
      </div>
    </div>
  );
}

function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 rtl:space-x-reverse">
          <EnhancedSkeleton circle width="3rem" height="3rem" />
          <div className="flex-1 space-y-2">
            <EnhancedSkeleton width="70%" />
            <EnhancedSkeleton width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b">
        <EnhancedSkeleton width="30%" />
        <EnhancedSkeleton width="20%" />
        <EnhancedSkeleton width="20%" />
        <EnhancedSkeleton width="30%" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          <EnhancedSkeleton width="30%" />
          <EnhancedSkeleton width="20%" />
          <EnhancedSkeleton width="20%" />
          <EnhancedSkeleton width="30%" />
        </div>
      ))}
    </div>
  );
}

export { EnhancedSkeleton, SkeletonCard, SkeletonList, SkeletonTable };
