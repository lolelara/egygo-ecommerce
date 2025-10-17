import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesApi, queryKeys } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Package, Search, Grid3x3, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/storage";
import { CategoryCardSkeleton } from "@/components/LoadingSkeletons";
import { placeholder } from "@/lib/placeholder";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
  });

  const categories = categoriesData?.categories || [];
  
  const filteredCategories = categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-orange-50 dark:from-primary/5 dark:via-purple-950/20 dark:to-orange-950/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary to-purple-600 mb-4">
              <Grid3x3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold">تصفح الفئات</h1>
            <p className="text-lg text-muted-foreground">
              استكشف مجموعتنا الواسعة من المنتجات عبر {categories.length} فئة مختلفة
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="ابحث عن فئة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              تم العثور على <span className="font-semibold text-primary">{filteredCategories.length}</span> فئة
            </p>
          </div>
        )}

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="py-20">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {searchQuery ? "لا توجد نتائج" : "لا توجد تصنيفات"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "جرب كلمات بحث مختلفة" : "سيتم إضافة التصنيفات قريباً"}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    مسح البحث
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredCategories.map((category: any) => (
            <Link
              key={category.id}
              to={category.slug ? `/category/${category.slug}` : '#'}
              className={`group ${!category.slug ? 'pointer-events-none' : ''}`}
            >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(category.image) || placeholder.category(category.name)}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex items-center justify-center gap-2 text-white font-semibold">
                        <span>تصفح الآن</span>
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                      {category.name}
                    </h3>
                    {category.productCount > 0 && (
                      <Badge className="bg-gradient-to-r from-primary to-purple-600">
                        {category.productCount} منتج
                      </Badge>
                    )}
                  </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      )}

        {/* View All Products */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-primary/10 via-purple-50 to-orange-50 dark:from-primary/5 dark:via-purple-950/10 dark:to-orange-950/10 border-2">
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">استكشف جميع المنتجات</h3>
              <p className="text-muted-foreground mb-6">
                تصفح آلاف المنتجات عبر جميع الفئات
              </p>
              <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-600">
                <Link to="/products">
                  <Package className="h-5 w-5 ml-2" />
                  عرض جميع المنتجات
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
