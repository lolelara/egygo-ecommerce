import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart, Users, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { fallbackCategoriesApi } from "../lib/api-fallback";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useCart } from "@/contexts/CartContext";
import type { CategoryWithCount } from "@shared/prisma-types";

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const totalItems = cartItemCount ?? items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // Load categories
    fallbackCategoriesApi
      .getAll()
      .then((data) => {
        setCategories(data.categories);
      })
      .catch(() => {
        // Fallback to empty array if something goes wrong
        setCategories([]);
      });
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top banner */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm">
        <span>🎉 انضم إلى برنامج الشراكة واكسب عمولة تصل إلى 25%! </span>
        <Link
          to="/affiliate"
          className="underline hover:no-underline font-medium"
        >
          اعرف المزيد
        </Link>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>
                <Link to="/" className="text-2xl font-bold text-primary">
                  إيجي جو
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  الفئات
                </h3>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="block py-2 text-sm hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t space-y-2">
                <Link
                  to="/affiliate"
                  className="flex items-center gap-2 py-2 text-sm hover:text-primary transition-colors"
                >
                  <Users className="h-4 w-4" />
                  برنامج الشراكة
                </Link>
                <Link
                  to="/deals"
                  className="block py-2 text-sm hover:text-primary transition-colors"
                >
                  العروض الخاصة
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
          إيجي جو
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-sm font-medium hover:text-primary transition-colors">
              الفئات
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center justify-between w-full"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.productCount}
                    </Badge>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/deals"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            العروض
          </Link>

          <Link
            to="/affiliate"
            className="flex items-center gap-1 text-sm font-medium text-brand-orange hover:text-brand-orange/80 transition-colors"
          >
            <Users className="h-4 w-4" />
            برنامج الشراكة
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center max-w-sm flex-1 mx-6">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 rtl:right-3 rtl:left-auto" />
            <Input
              type="search"
              placeholder="البحث عن المنتجات..."
              className="pr-10 pl-4 w-full rtl:pr-10 rtl:pl-4"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Search for mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-sm font-medium">
                    مرحباً، {user.name}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders">طلباتي</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account">حسابي</Link>
                  </DropdownMenuItem>
                  {user.isAffiliate && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/affiliate/dashboard" className="text-brand-orange">
                          لوحة تحكم الشراكة
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="ml-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">تسجيل الدخول</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">إنشاء حساب</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/affiliate" className="text-brand-orange">
                      برنامج الشراكة
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
