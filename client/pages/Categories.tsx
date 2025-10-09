import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, queryKeys } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/storage";
import { CategoryCardSkeleton } from "@/components/LoadingSkeletons";

export default function Categories() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
  });

  const categories = categoriesData?.categories || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">جميع التصنيفات</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          استكشف مجموعتنا الواسعة من المنتجات عبر فئات مختلفة
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">لا توجد تصنيفات متاحة</h3>
          <p className="text-muted-foreground">
            سيتم إضافة التصنيفات قريباً
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.slug ? `/category/${category.slug}` : '#'}
              className={`group ${!category.slug ? 'pointer-events-none' : ''}`}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="relative aspect-square">
                  <img
                    src={getImageUrl(category.image) || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-center mb-2 line-clamp-2">
                    {category.name}
                  </h3>
                  {category.productCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="w-full justify-center"
                    >
                      {category.productCount} منتج
                    </Badge>
                  )}
                  {category.description && (
                    <p className="text-xs text-muted-foreground text-center mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* View All Products Link */}
      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <Package className="h-5 w-5" />
          عرض جميع المنتجات
        </Link>
      </div>
    </div>
  );
}
