import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { wishlistApi, queryKeys } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Trash2, Package } from "lucide-react";
import SEO from "@/components/SEO";
import { getImageUrl } from "@/lib/storage";
import { PageLoader } from "@/components/ui/loading-screen";

export default function Wishlist() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      window.location.href = "/login";
    }
  }, [user]);

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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-accent fill-accent" />
            <h1 className="text-3xl font-bold">قائمة المفضلة</h1>
          </div>
          <p className="text-muted-foreground">
            لديك {wishlistItems.length} {wishlistItems.length === 1 ? "منتج" : "منتجات"} في قائمة المفضلة
          </p>
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <Heart className="mx-auto h-16 w-16 text-muted" />
                <h3 className="mt-4 text-xl font-semibold">قائمة المفضلة فارغة</h3>
                <p className="mt-2 text-muted-foreground">
                  لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد
                </p>
                <Link to="/products">
                  <Button className="mt-6">
                    تصفح المنتجات
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item: any) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.productId}`}>
                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(item.product.images?.[0])}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {!item.product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge variant="destructive">غير متوفر</Badge>
                        </div>
                      )}
                      {item.product.originalPrice && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          خصم {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </Link>

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

                    {/* Rating */}
                    {item.product.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{item.product.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({item.product.reviewCount})</span>
                      </div>
                    )}

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
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 ml-2" />
                        أضف للسلة
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeFromWishlist.mutate({ id: item.id })}
                        disabled={removeFromWishlist.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
