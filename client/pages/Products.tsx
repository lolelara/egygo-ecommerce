import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  Loader2,
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

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.getAll,
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
        onClick={() => {
          setSelectedCategories([]);
          setPriceRange({ min: 0, max: 1000 });
          setShowOnSale(false);
          setSearchQuery("");
          setPage(1);
        }}
        className="w-full"
      >
        مسح جميع المرشحات
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">حدث خطأ</h2>
        <p className="text-muted-foreground mb-4">فشل في تحميل المنتجات</p>
        <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          {currentCategory ? currentCategory.name : "جميع المنتجات"}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory
            ? `اكتشف منتجات ${currentCategory.name} المذهلة`
            : "اكتشف مجموعتنا الكاملة من المنتجات عالية الجودة"}
        </p>
      </div>

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
              <Button variant="outline" className="lg:hidden">
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
            <Card className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">
                لم يتم العثور على منتجات
              </h3>
              <p className="text-muted-foreground mb-4">
                جرب تعديل البحث أو معايير التصفية
              </p>
              <Button
                variant="outline"
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
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={getImageUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                            وفر $
                            {(product.originalPrice - product.price).toFixed(0)}
                          </Badge>
                        )}
                      <div className="absolute top-2 right-2 bg-brand-orange text-white text-xs px-2 py-1 rounded">
                        {product.affiliateCommission}% عمولة
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 mb-2">
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
                          ({product.reviewCount})
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              ${product.price}
                            </span>
                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                          </div>
                        </div>
                        <Button size="sm">
                          <ShoppingCart className="h-4 w-4 ml-1 rtl:ml-0 rtl:mr-1" />
                          إضافة للسلة
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalProducts > limit && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    السابق
                  </Button>
                  <span className="px-4 py-2">
                    صفحة {page} من {Math.ceil(totalProducts / limit)}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= Math.ceil(totalProducts / limit)}
                    onClick={() => setPage(page + 1)}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
