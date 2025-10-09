import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

/**
 * Product Card Skeleton for loading states
 */
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Image Skeleton with shimmer */}
        <Skeleton className="aspect-square w-full" shimmer />
        <div className="p-4 space-y-3">
          {/* Category Badge */}
          <Skeleton className="h-5 w-20" />
          {/* Title */}
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          {/* Rating */}
          <Skeleton className="h-4 w-24" />
          {/* Price with shimmer */}
          <Skeleton className="h-8 w-32" shimmer />
          {/* Button */}
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Product Grid Skeleton - shows multiple product cards
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Category Card Skeleton
 */
export function CategoryCardSkeleton() {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <Skeleton className="aspect-video w-full" />
        <div className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Order Card Skeleton
 */
export function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Table Row Skeleton for admin tables
 */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, index) => (
        <td key={index} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Table Skeleton - full table with multiple rows
 */
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRowSkeleton key={index} cols={cols} />
      ))}
    </>
  );
}

/**
 * Stats Card Skeleton for dashboards
 */
export function StatsCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Dashboard Stats Grid Skeleton
 */
export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * Page Header Skeleton
 */
export function PageHeaderSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full max-w-2xl" />
    </div>
  );
}

/**
 * Full Page Skeleton - combines header + content
 */
export function PageSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      {children}
    </div>
  );
}
