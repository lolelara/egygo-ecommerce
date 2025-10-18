/**
 * Product 360° Viewer Component
 * Interactive 360-degree product view with drag controls
 */

import { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Product360ViewerProps {
  images: string[];
  alt?: string;
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export function Product360Viewer({
  images,
  alt = 'Product 360 view',
  className,
  autoRotate = false,
  autoRotateSpeed = 50,
}: Product360ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const totalImages = images.length;

  // Auto-rotate effect
  useEffect(() => {
    if (!isAutoRotating || isDragging) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, autoRotateSpeed);

    return () => clearInterval(interval);
  }, [isAutoRotating, isDragging, totalImages, autoRotateSpeed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 5;

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1;
      setCurrentIndex((prev) => {
        let newIndex = prev + direction;
        if (newIndex < 0) newIndex = totalImages - 1;
        if (newIndex >= totalImages) newIndex = 0;
        return newIndex;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoRotating(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 5;

    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? -1 : 1;
      setCurrentIndex((prev) => {
        let newIndex = prev + direction;
        if (newIndex < 0) newIndex = totalImages - 1;
        if (newIndex >= totalImages) newIndex = 0;
        return newIndex;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-background rounded-lg overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 rounded-none",
        className
      )}
    >
      {/* Image Container */}
      <div
        className="relative aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imageRef}
          src={images[currentIndex]}
          alt={`${alt} - ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
          draggable={false}
        />

        {/* Drag Hint */}
        {!isDragging && currentIndex === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm animate-pulse">
              اسحب للدوران
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleAutoRotate}
          className={cn(isAutoRotating && "bg-primary text-primary-foreground")}
        >
          <RotateCw className={cn("h-4 w-4", isAutoRotating && "animate-spin-slow")} />
        </Button>

        <div className="h-6 w-px bg-border" />

        <Button size="icon" variant="ghost" onClick={handleZoomOut} disabled={zoom <= 1}>
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium px-2">{Math.round(zoom * 100)}%</span>

        <Button size="icon" variant="ghost" onClick={handleZoomIn} disabled={zoom >= 3}>
          <ZoomIn className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border" />

        <Button size="icon" variant="ghost" onClick={toggleFullscreen}>
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
        {currentIndex + 1} / {totalImages}
      </div>

      {/* Thumbnail Strip */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-1 px-4">
        <div className="flex gap-1 bg-background/80 backdrop-blur-sm rounded-full p-1 max-w-xs overflow-x-auto">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product360Viewer;
