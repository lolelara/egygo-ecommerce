import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package, ShoppingCart, Users, FileText, TrendingUp } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { productsApi, queryKeys } from "@/lib/api";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category: "products" | "orders" | "users" | "pages" | "analytics";
  url: string;
  icon: React.ReactNode;
}

export function UniversalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Keyboard shortcut: Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch products for search
  const { data: productsData } = useQuery({
    queryKey: [...queryKeys.products, "search", search],
    queryFn: () => productsApi.getAll({ limit: 5 }),
    enabled: search.length > 2,
  });

  // Static pages and common actions
  const staticResults: SearchResult[] = [
    {
      id: "products-page",
      title: "المنتجات",
      subtitle: "عرض جميع المنتجات",
      category: "pages",
      url: "/products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "orders-page",
      title: "طلباتي",
      subtitle: "تتبع الطلبات",
      category: "pages",
      url: "/orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      id: "affiliate-dashboard",
      title: "لوحة المسوق",
      subtitle: "إحصائيات وروابط",
      category: "pages",
      url: "/affiliate/dashboard",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: "admin-dashboard",
      title: "لوحة الإدارة",
      subtitle: "إدارة الموقع",
      category: "pages",
      url: "/admin/dashboard",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: "docs",
      title: "المساعدة والدعم",
      subtitle: "مركز المساعدة",
      category: "pages",
      url: "/faq",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  // Combine all results
  const allResults: SearchResult[] = [
    ...staticResults.filter((r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subtitle?.toLowerCase().includes(search.toLowerCase())
    ),
    ...(productsData?.products || []).map((product) => ({
      id: product.id,
      title: product.name,
      subtitle: `${product.price} جنيه`,
      category: "products" as const,
      url: `/product/${product.id}`,
      icon: <Package className="h-4 w-4" />,
    })),
  ];

  const handleSelect = useCallback((result: SearchResult) => {
    setOpen(false);
    setSearch("");
    navigate(result.url);
  }, [navigate]);

  const getCategoryLabel = (category: string) => {
    const labels = {
      products: "المنتجات",
      orders: "الطلبات",
      users: "المستخدمين",
      pages: "الصفحات",
      analytics: "التحليلات",
    };
    return labels[category as keyof typeof labels] || category;
  };

  // Group results by category
  const groupedResults = allResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2",
          "text-sm text-muted-foreground transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">بحث سريع...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="ابحث عن منتجات، طلبات، صفحات..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandEmpty>لا توجد نتائج</CommandEmpty>
          
          {Object.entries(groupedResults).map(([category, results]) => (
            <CommandGroup key={category} heading={getCategoryLabel(category)}>
              {results.map((result) => (
                <CommandItem
                  key={result.id}
                  value={result.title}
                  onSelect={() => handleSelect(result)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {result.icon}
                    <div className="flex flex-col">
                      <span className="font-medium">{result.title}</span>
                      {result.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {result.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
