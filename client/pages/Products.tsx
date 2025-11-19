import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  Loader2,
  Grid3x3,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { productsApi, categoriesApi, queryKeys } from "@/lib/api";
import { ProductFilters } from "@shared/prisma-types";
import { getImageUrl } from "@/lib/storage";
import { SkeletonProductGrid } from "@/components/LoadingStates";
import { ProductCardPremium } from "@/components/ProductCardPremium";
import { SEOHead } from "@/components/SEOHead";
import { analytics } from "@/lib/enhanced-analytics";
import RotatingBanner from "@/components/banners/RotatingBanner";
import { getBannersByLocation, getBannerSettings } from "@/lib/banners-api";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useQuickView } from "@/contexts/QuickViewContext";

type SortOption = "featured" | "price_asc" | "price_desc" | "rating" | "newest";

export default function Products() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [showOnSale, setShowOnSale] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { addItem } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { openQuickView } = useQuickView();

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
  });

  // Fetch banners
  const { data: bannersData } = useQuery({
    queryKey: ['banners', 'products'],
    queryFn: () => getBannersByLocation('products'),
  });

  const { data: bannerSettings } = useQuery({
    queryKey: ['bannerSettings', 'products'],
    queryFn: () => getBannerSettings('products'),
  });

  // Build filters
  const filters: ProductFilters & { page: number; limit: number } =
    useMemo(() => {
      const baseFilters: ProductFilters & { page: number; limit: number } = {
        page,
        limit,
        sortBy,
      };

      if (searchQuery) {
        baseFilters.searchQuery = searchQuery;
      }

      if (!slug && selectedCategories.length > 0) {
        // For general products page, filter by selected categories
        // Note: API doesn't support multiple categories yet, so we'll use the first one
        if (selectedCategories[0]) {
          const category = categoriesData?.categories.find(
            (c) => c.id === selectedCategories[0],
          );
          if (category) {
            baseFilters.categoryId = category.id;
          }
        }
      }

      if (priceRange.min > 0) {
        baseFilters.minPrice = priceRange.min;
      }
      if (priceRange.max < 1000) {
        baseFilters.maxPrice = priceRange.max;
      }

      if (showOnSale) {
        // API will need to be updated to support this filter
        // For now, we'll filter on the client side
      }

      return baseFilters;
    }, [
      slug,
      searchQuery,
      sortBy,
      selectedCategories,
      priceRange,
      showOnSale,
      page,
      categoriesData,
    ]);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: slug
      ? [...queryKeys.categoryProducts(slug), filters]
      : [...queryKeys.products, filters],
    queryFn: () =>
      slug
        ? productsApi.getByCategory(slug, filters)
        : productsApi.getAll(filters),
  });

  // Get current category if viewing by category
  const currentCategory = slug
    ? categoriesData?.categories.find((cat) => cat.slug === slug)
    : null;

  const categories = categoriesData?.categories || [];
  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  // Client-side filter for on-sale products if needed
  const filteredProducts = useMemo(() => {
    if (!showOnSale) return products;
    return products.filter(
      (product) =>
        product.originalPrice && product.originalPrice > product.price,
    );
  }, [products, showOnSale]);

  // Handlers
  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image,
      quantity: 1,
      stockQuantity: product.stock || 100, // Fallback if stock not available
      inStock: product.inStock ?? true,
    });
  };

  const handleToggleWishlist = async (productId: string) => {
    if (isFavorite(productId)) {
      await removeFavorite(productId);
    } else {
      await addFavorite(productId);
    }
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories (only show when not on category page) */}
      {!slug && (
        <div>
          <h3 className="font-semibold mb-3">الفئات</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([
                        ...selectedCategories,
                        category.id,
                      ]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category.id),
                      );
                    }
                    setPage(1); // Reset to first page when filters change
                  }}
                />
                <Label htmlFor={category.id} className="text-sm cursor-pointer">
                  {category.name} ({category.productCount})
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">نطاق السعر</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="الحد الأدنى"
              value={priceRange.min}
              onChange={(e) => {
                setPriceRange({
                  ...priceRange,
                  min: Number(e.target.value) || 0,
                });
                setPage(1);
              }}
              className="w-24"
            />
            <span className="self-center">-</span>
            <Input
              type="number"
              placeholder="الحد الأقصى"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange({
                  ...priceRange,
                  max: Number(e.target.value) || 1000,
                });
                setPage(1);
              }}
              className="w-24"
            />
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div>
        <h3 className="font-semibold mb-3">العروض الخاصة</h3>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Checkbox
            id="on-sale"
            checked={showOnSale}
            onCheckedChange={(checked) => {
              setShowOnSale(!!checked);
              setPage(1);
            }}
          />
          <Label htmlFor="on-sale" className="text-sm cursor-pointer">
            المنتجات المخفضة فقط
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="btn-hover-lift w-full"
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange({ min: 0, max: 1000 });
          setShowOnSale(false);
          setSearchQuery("");
          setPage(1);
        }}
      >
        مسح جميع المرشحات
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SkeletonProductGrid count={limit} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">حدث خطأ</h2>
        <p className="text-muted-foreground mb-4">فشل في تحميل المنتجات</p>
        <Button
          variant="outline"
          className="btn-hover-lift"
          onClick={() => window.location.reload()}
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={currentCategory ? currentCategory.name : "جميع المنتجات"}
        description={currentCategory ? `تصفح منتجات ${currentCategory.name} عالية الجودة` : "اكتشف مجموعتنا الكاملة من المنتجات"}
        keywords={['منتجات', 'تسوق', 'مصر', currentCategory?.name || '']}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-50 to-orange-50 dark:from-primary/5 dark:via-purple-950/20 dark:to-orange-950/20 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-600 mb-2">
                <Grid3x3 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold">
                {currentCategory ? currentCategory.name : "جميع المنتجات"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {currentCategory
                  ? `اكتشف منتجات ${currentCategory.name} المذهلة 🌟`
                  : "اكتشف مجموعتنا الكاملة من المنتجات عالية الجودة 🛒"}
              </p>
              {totalProducts > 0 && (
                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white text-base px-4 py-2">
                  {totalProducts} منتج متاح
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Banners Section */}
        {bannersData && bannersData.length > 0 && (
          <div className="container mx-auto px-4 py-4">
            <RotatingBanner
              banners={bannersData}
              autoPlayInterval={bannerSettings?.autoPlayInterval || 5}
              showControls={bannerSettings?.showControls ?? true}
              height={bannerSettings?.height || '300px'}
              location="products"
            />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 rtl:right-3 rtl:left-auto" />
              <Input
                type="search"
                placeholder="البحث عن المنتجات..."
                className="pr-10 rtl:pr-10 rtl:pl-4"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex gap-2">
              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => {
                  setSortBy(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">مميز</SelectItem>
                  <SelectItem value="price_asc">
                    السعر: من الأقل إلى الأعلى
                  </SelectItem>
                  <SelectItem value="price_desc">
                    السعر: من الأعلى إلى الأقل
                  </SelectItem>
                  <SelectItem value="rating">الأعلى تقييمًا</SelectItem>
                  <SelectItem value="newest">الأحدث</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="btn-hover-lift lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                    المرشحات
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>المرشحات</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block">
              <Card className="p-6 sticky top-24">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  المرشحات
                </h2>
                <Separator className="mb-4" />
                <FilterPanel />
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  عرض {filteredProducts.length} من {totalProducts} منتج
                </p>
              </div>

              {filteredProducts.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-20">
                    <div className="text-center space-y-6">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 mx-auto flex items-center justify-center">
                        <Package className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          لا توجد منتجات 🔍
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          جرّب تعديل معايير البحث أو التصفية
                        </p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <Button
                          size="lg"
                          variant="gradient"
                          onClick={() => {
                            setSelectedCategories([]);
                            setPriceRange({ min: 0, max: 1000 });
                            setShowOnSale(false);
                            setSearchQuery("");
                            setPage(1);
                          }}
                        >
                          مسح المرشحات
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                          <Link to="/categories">عرض الفئات</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCardPremium
                        key={product.id}
                        product={product}
                        onAddToCart={() => handleAddToCart(product)}
                        onQuickView={() => openQuickView(product)}
                        onToggleWishlist={() => handleToggleWishlist(product.id)}
                        isWishlisted={isFavorite(product.id)}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalProducts > limit && (
                    <div className="flex justify-center items-center gap-3 mt-8">
                      <Button
                        variant="outline"
                        size="lg"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="gap-2"
                      >
                        <ChevronRight className="h-4 w-4" />
                        السابق
                      </Button>
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(5, Math.ceil(totalProducts / limit)) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "gradient" : "outline"}
                              size="icon"
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {Math.ceil(totalProducts / limit) > 5 && (
                          <span className="text-muted-foreground">...</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="lg"
                        disabled={page >= Math.ceil(totalProducts / limit)}
                        onClick={() => setPage(page + 1)}
                        className="gap-2"
                      >
                        التالي
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
