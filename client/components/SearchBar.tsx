import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular searches
  const popularSearches = [
    "ساعة ذكية",
    "سماعات",
    "لابتوب",
    "موبايل",
    "كاميرا",
  ];

  // Fetch search suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["search-suggestions", searchQuery],
    queryFn: () =>
      productsApi.getAll({
        searchQuery,
        limit: 5,
      }),
    enabled: searchQuery.length >= 2,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setIsOpen(value.length >= 2 || value.length === 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      handleSearch(searchQuery);
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="ابحث عن المنتجات..."
          value={searchQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pr-10 rtl:pr-4 rtl:pl-10"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              inputRef.current?.focus();
            }}
            className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg">
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && searchQuery.length >= 2 && (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">جاري البحث...</p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && searchQuery.length >= 2 && suggestions && (
              <div className="p-2">
                {suggestions.products && suggestions.products.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                      نتائج البحث
                    </div>
                    {suggestions.products.map((product: any) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors text-right"
                      >
                        <img
                          src={product.images?.[0]?.url || ""}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.price.toLocaleString()} ج.م
                          </p>
                        </div>
                        {product.inStock === false && (
                          <Badge variant="secondary" className="text-xs">
                            غير متوفر
                          </Badge>
                        )}
                      </button>
                    ))}
                    <button
                      onClick={() => handleSearch(searchQuery)}
                      className="w-full p-2 text-sm text-primary hover:bg-muted rounded-md transition-colors"
                    >
                      عرض جميع النتائج
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      لا توجد نتائج لـ "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Popular Searches */}
            {searchQuery.length < 2 && (
              <div className="p-2">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  عمليات البحث الشائعة
                </div>
                <div className="space-y-1">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="w-full text-right p-2 rounded-md hover:bg-muted transition-colors text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
