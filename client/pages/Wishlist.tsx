import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistApi, queryKeys } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Trash2, Package, Share2, X, Star, Check, AlertCircle, Eye } from "lucide-react";
import SEO from "@/components/SEO";
import { getImageUrl } from "@/lib/storage";
import { PageLoader } from "@/components/ui/loading-screen";

export default function Wishlist() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch wishlist
  const { data: wishlistItems = [], isLoading } = useQuery({
    queryKey: queryKeys.wishlist(user?.$id || ""),
    queryFn: () => wishlistApi.getUserWishlist(user?.$id || ""),
    enabled: !!user?.$id,
  });

  // Remove from wishlist mutation
  const removeFromWishlist = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      wishlistApi.removeFromWishlist(id, user?.$id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.$id || "") });
      toast({
        title: "تم الحذف",
        description: "تم حذف المنتج من قائمة المفضلة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف المنتج",
        variant: "destructive",
      });
    },
  });

  // Add to cart handler
  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: getImageUrl(product.images?.[0]),
      quantity: 1,
      stockQuantity: product.stockQuantity || product.stock || 0,
      inStock: product.inStock ?? product.isActive ?? true,
    });
    toast({
      title: "تم الإضافة",
      description: "تم إضافة المنتج إلى السلة",
    });
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <PageLoader message="جاري تحميل قائمة المفضلة..." />;
  }

  return (
    <>
      <SEO
        title="قائمة المفضلة"
        description="عرض وإدارة المنتجات المفضلة لديك"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold">قائمة المفضلة</h1>
            </div>
            <p className="text-muted-foreground">
              لديك <span className="font-semibold text-primary">{wishlistItems.length}</span> {wishlistItems.length === 1 ? "منتج" : "منتجات"} في قائمة المفضلة
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 ml-2" />
                مشاركة
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (window.confirm(`هل تريد حذف جميع المنتجات (${wishlistItems.length}) من قائمة المفضلة؟`)) {
                    wishlistItems.forEach((item: any) => removeFromWishlist.mutate({ id: item.id }));
                  }
                }}
              >
                <X className="h-4 w-4 ml-2" />
                حذف الكل
              </Button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-20">
              <div className="text-center max-w-md mx-auto space-y-4">
                <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto flex items-center justify-center">
                  <Heart className="h-12 w-12 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">قائمة المفضلة فارغة</h3>
                  <p className="text-muted-foreground">
                    لم تضف أي منتجات إلى المفضلة بعد. ابدأ بإضافة منتجاتك المفضلة!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-600">
                    <Link to="/products">
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      ابدأ التسوق
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/deals">
                      العروض الخاصة
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item: any) => (
              <Card key={item.id} className="card-hover group">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Link to={`/products/${item.productId}`}>
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Remove Button */}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromWishlist.mutate({ id: item.id })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    {!item.product.inStock && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm">نفذت الكمية</Badge>
                      </div>
                    )}
                    {item.product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500">
                        -{Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary">
                        {item.product.name}
                      </h3>
                    </Link>

                    {/* Category */}
                    {item.product.category && (
                      <Badge variant="outline" className="text-xs">
                        {item.product.category.name}
                      </Badge>
                    )}

                    {/* Rating & Stock */}
                    <div className="flex items-center justify-between text-sm">
                      {item.product.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{item.product.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({item.product.reviewCount})</span>
                        </div>
                      )}
                      {item.product.inStock ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="font-semibold">متوفر</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-semibold">غير متوفر</span>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {item.product.price.toFixed(2)} جنيه
                      </span>
                      {item.product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {item.product.originalPrice.toFixed(2)} جنيه
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleAddToCart(item.product)}
                        disabled={!item.product.inStock}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        أضف للسلة 🛒
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/products/${item.productId}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
