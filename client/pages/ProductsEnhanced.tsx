import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  Loader2,
  Heart,
  Eye,
  TrendingUp,
  Sparkles
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
import { ProductGridSkeleton } from "@/components/LoadingSkeletons";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

type SortOption = "featured" | "price_asc" | "price_desc" | "rating" | "newest";

export default function ProductsEnhanced() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [showOnSale, setShowOnSale] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { addItem } = useCart();
  const productsRef = useRef<HTMLDivElement>(null);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoriesApi.getAll,
  });

  // Build filters
  const filters: ProductFilters = useMemo(() => {
    const f: ProductFilters = {
      page,
      limit: 12,
    };

    if (slug) {
      const category = categories.find((c) => c.slug === slug);
      if (category) {
        f.categoryId = category.id;
      }
    }

    if (searchQuery) f.search = searchQuery;
    if (selectedCategories.length > 0) f.categoryId = selectedCategories[0];
    if (priceRange.min > 0) f.minPrice = priceRange.min;
    if (priceRange.max < 10000) f.maxPrice = priceRange.max;
    if (showOnSale) f.onSale = true;

    // Sort
    switch (sortBy) {
      case "price_asc":
        f.sortBy = "price";
        f.sortOrder = "asc";
        break;
      case "price_desc":
        f.sortBy = "price";
        f.sortOrder = "desc";
        break;
      case "rating":
        f.sortBy = "rating";
        f.sortOrder = "desc";
        break;
      case "newest":
        f.sortBy = "createdAt";
        f.sortOrder = "desc";
        break;
    }

    return f;
  }, [slug, searchQuery, selectedCategories, priceRange, showOnSale, sortBy, page, categories]);

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKeys.products.list(filters)],
    queryFn: () => productsApi.getAll(filters),
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  // GSAP Animations
  useEffect(() => {
    if (products.length > 0 && productsRef.current) {
      const cards = productsRef.current.querySelectorAll('.product-card');
      
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, [products]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.price,
      quantity: 1,
      image: getImageUrl(product.images?.[0]),
      stockQuantity: product.stock || 0,
    });
    toast.success(`تمت إضافة ${product.name} إلى السلة`);
  };

  const currentCategory = slug
    ? categories.find((c) => c.slug === slug)
    : null;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">حدث خطأ في تحميل المنتجات</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section with GSAP */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {currentCategory ? currentCategory.name : "جميع المنتجات"}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                اكتشف أفضل المنتجات بأسعار مميزة
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {products.length} منتج
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    البحث
                  </Label>
                  <Input
                    placeholder="ابحث عن منتج..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Separator />

                {/* Categories */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">الفئات</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([category.id]);
                            } else {
                              setSelectedCategories([]);
                            }
                          }}
                        />
                        <Label
                          htmlFor={category.id}
                          className="text-sm cursor-pointer hover:text-primary transition-colors"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">نطاق السعر</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="من"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: Number(e.target.value) })
                      }
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="إلى"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: Number(e.target.value) })
                      }
                      className="text-sm"
                    />
                  </div>
                </div>

                <Separator />

                {/* On Sale */}
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="onSale"
                    checked={showOnSale}
                    onCheckedChange={(checked) => setShowOnSale(checked as boolean)}
                  />
                  <Label htmlFor="onSale" className="cursor-pointer flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    العروض فقط
                  </Label>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-card p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4 ml-2" />
                      فلترة
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <SheetHeader>
                      <SheetTitle>الفلاتر</SheetTitle>
                    </SheetHeader>
                    {/* Mobile filters - same as sidebar */}
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">مميز</SelectItem>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price_asc">السعر: من الأقل</SelectItem>
                    <SelectItem value="price_desc">السعر: من الأعلى</SelectItem>
                    <SelectItem value="rating">الأعلى تقييماً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  شبكة
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  قائمة
                </Button>
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <ProductGridSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">لا توجد منتجات</p>
              </div>
            ) : (
              <div
                ref={productsRef}
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product: any) => (
                  <Card
                    key={product.id}
                    className="product-card group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.salePrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            خصم {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                          <Button size="icon" variant="secondary" className="rounded-full">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Link>

                    <CardContent className="p-4 space-y-3">
                      <Link to={`/product/${product.id}`}>
                        <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating || 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground mr-2">
                          ({product.reviewCount || 0})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {product.salePrice ? (
                            <>
                              <p className="text-2xl font-bold text-primary">
                                {product.salePrice} ج.م
                              </p>
                              <p className="text-sm text-muted-foreground line-through">
                                {product.price} ج.م
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold">{product.price} ج.م</p>
                          )}
                        </div>

                        <Button
                          size="icon"
                          className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-all"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  السابق
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  التالي
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
