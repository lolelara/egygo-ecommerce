import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  ShoppingCart, 
  Eye, 
  Star,
  Share2
} from "lucide-react";
import { getImageUrl } from "@/lib/storage";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query } from "appwrite";
import type { ProductWithRelations } from "@shared/prisma-types";

interface EnhancedProductCardProps {
  product: ProductWithRelations;
}

export default function EnhancedProductCard({ product }: EnhancedProductCardProps) {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Check if user is affiliate
  const isAffiliate = user?.isAffiliate;

  // Load real view count from database
  useEffect(() => {
    loadViewCount();
  }, [product.id]);

  const isFav = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    try {
      const imageUrl = typeof product.images?.[0] === 'string' 
        ? product.images[0] 
        : product.images?.[0]?.url || '';
      
      addItem({
        productId: product.id,
        name: product.name,
        image: imageUrl,
        quantity: 1,
        price: product.price,
        inStock: true,
        stockQuantity: product.stockQuantity || 999
      });
      
      // Toast is already shown in CartContext
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة المنتج للسلة",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFav) {
        await removeFavorite(product.id);
        toast({
          title: "✅ تمت الإزالة من المفضلة",
          description: `تم إزالة ${product.name} من المفضلة`,
        });
      } else {
        await addFavorite(product.id);
        toast({
          title: "✅ تمت الإضافة للمفضلة",
          description: `تم إضافة ${product.name} إلى المفضلة`,
        });
      }
    } catch (error) {
      console.error('Favorite error:', error);
      toast({
        title: "❌ خطأ",
        description: "فشل في تحديث المفضلة. تحقق من تسجيل الدخول.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: product.name,
      text: `تحقق من ${product.name} على إيجي جو!`,
      url: `${window.location.origin}/#/product/${product.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "✅ تم النسخ",
          description: "تم نسخ رابط المنتج",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const loadViewCount = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.productViews,
        [
          Query.equal('productId', product.id)
        ]
      );

      if (response.documents.length > 0) {
        const viewDoc = response.documents[0] as any;
        setViews(viewDoc.viewCount || 0);
      }
    } catch (error) {
      console.error('Error loading view count:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async () => {
    try {
      // Increment view count
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.productViews,
        [
          Query.equal('productId', product.id)
        ]
      );

      if (response.documents.length > 0) {
        // Update existing
        const viewDoc = response.documents[0] as any;
        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.productViews,
          viewDoc.$id,
          {
            viewCount: (viewDoc.viewCount || 0) + 1,
            lastViewedAt: new Date().toISOString()
          }
        );
        setViews((viewDoc.viewCount || 0) + 1);
      } else {
        // Create new
        const newView = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.productViews,
          'unique()',
          {
            productId: product.id,
            viewCount: 1,
            lastViewedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }
        );
        setViews(1);
      }
    } catch (error) {
      console.error('Error updating view count:', error);
      // Fallback to local increment
      setViews(prev => prev + 1);
    }
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="card-hover group overflow-hidden h-full border-2 relative">
      <Link
        to={`/product/${product.id}`}
        className="block absolute inset-0 z-[1]"
        onClick={handleView}
      />
        {/* Image Container */}
        <div className="relative overflow-hidden pointer-events-none">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-red-500 text-white shadow-lg">
                خصم {discount}%
              </Badge>
            )}
            {product.affiliateCommission && product.affiliateCommission > 0 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg">
                {product.affiliateCommission}% عمولة
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[20] pointer-events-auto">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg hover:scale-110 transition-transform"
              onClick={handleToggleFavorite}
              type="button"
            >
              <Heart 
                className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg hover:scale-110 transition-transform"
              onClick={handleShare}
              type="button"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Views Counter */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {views}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-3 relative pointer-events-none">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {product.price.toFixed(2)} ج.م
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice.toFixed(2)} ج.م
                  </span>
                )}
              </div>
              
              {/* Affiliate Commission Display */}
              {isAffiliate && product.affiliateCommission && product.affiliateCommission > 0 && (
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-md px-2 py-1 border border-orange-200 dark:border-orange-800">
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    عمولتك:
                  </span>
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    {((product.price * product.affiliateCommission) / 100).toFixed(2)} ج.م
                  </span>
                  <span className="text-xs text-orange-500">
                    ({product.affiliateCommission}%)
                  </span>
                </div>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="btn-hover-lift relative z-[20] pointer-events-auto"
              type="button"
            >
              {isAddingToCart ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
                  أضف
                </>
              )}
            </Button>
          </div>
        </CardContent>
    </Card>
  );
}
