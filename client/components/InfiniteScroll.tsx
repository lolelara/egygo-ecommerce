import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
  threshold?: number;
}

export default function InfiniteScroll({
  loadMore,
  hasMore,
  loading,
  children,
  threshold = 200
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [threshold]);

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore().then(() => setIsIntersecting(false));
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  return (
    <>
      {children}
      
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>جاري التحميل...</span>
            </div>
          )}
        </div>
      )}
      
      {!hasMore && (
        <div className="text-center py-8 text-muted-foreground">
          <p>لا توجد منتجات أخرى</p>
        </div>
      )}
    </>
  );
}
