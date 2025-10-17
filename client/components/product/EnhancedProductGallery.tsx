import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EnhancedProductGalleryProps {
  images: Array<{ url: string; alt: string }>;
}

export function EnhancedProductGallery({ images }: EnhancedProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 group">
          <img
            src={images[selectedImage]?.url}
            alt={images[selectedImage]?.alt}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={prevImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={nextImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Zoom & Fullscreen Buttons */}
          <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <ZoomIn className="h-4 w-4 ml-1" />
              {isZoomed ? "تصغير" : "تكبير"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Maximize2 className="h-4 w-4 ml-1" />
              شاشة كاملة
            </Button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 left-4 text-white hover:bg-white/20 z-10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <img
              src={images[selectedImage]?.url}
              alt={images[selectedImage]?.alt}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
