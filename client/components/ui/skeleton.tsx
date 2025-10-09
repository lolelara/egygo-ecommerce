import { cn } from "@/lib/utils";


type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  shimmer?: boolean;
};

function Skeleton({ className, shimmer = false, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        shimmer ? "shimmer bg-muted rounded-md" : "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
