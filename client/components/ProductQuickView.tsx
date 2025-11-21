import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ShoppingCart, Heart, Share2, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithRelations } from "@shared/prisma-types";

interface ProductQuickViewProps {
  product: ProductWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const images = product.images || [];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Placeholder for getImageUrl if not imported.
  // In a real application, this function would be properly defined or imported.
  const getImageUrl = (image: any) => {
    // Assuming image is an object with a 'url' property or similar
    // If image is already a string, it would just return image
    return typeof image === 'string' ? image : (image?.url || '');
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.$id,
      name: product.name,
      price: product.price,
      image: getImageUrl(images[0]),
      quantity: quantity,
      stockQuantity: product.stockQuantity || 100,
      inStock: product.inStock ?? true,
    });

    toast({
      title: "✅ تمت الإضافة",
      description: `تم إضافة ${quantity} من ${product.name} إلى السلة`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">معاينة سريعة للمنتج</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Title & Category */}
            <div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              {product.category && (
                <Badge variant="outline">{product.category.name}</Badge>
              )}
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount || 0} تقييم)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  {product.price.toFixed(2)} ج.م
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      {product.originalPrice.toFixed(2)} ج.م
                    </span>
                    <Badge className="bg-red-500">خصم {discount}%</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">الوصف:</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">الكمية:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <Button
                size="lg"
                className="w-full btn-hover-lift btn-gradient"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 ml-2 rtl:ml-0 rtl:mr-2" />
                أضف إلى السلة
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="lg" asChild>
                  <Link to={`/product/${product.id}`}>
                    عرض التفاصيل الكاملة
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            {product.inStock ? (
              <p className="text-sm text-green-600">✅ متوفر في المخزون</p>
            ) : (
              <p className="text-sm text-red-600">❌ غير متوفر حالياً</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
