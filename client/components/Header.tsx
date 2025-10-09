import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart, Users, LogOut, Shield, TrendingUp, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UniversalSearch } from "./UniversalSearch";
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
import SearchBar from "./SearchBar";
import { NotificationDropdown } from "./NotificationDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeSelector } from "./ThemeSelector";
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
              {/* Admin Panel */}
              {user?.role === 'admin' && (
                <div className="space-y-2 mb-4">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 py-2 px-3 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                  >
                    <Shield className="h-5 w-5" />
                    لوحة تحكم الإدارة
                  </Link>
                </div>
              )}
              
              {/* Affiliate Panel */}
              {user?.isAffiliate && (
                <div className="space-y-2 mb-4">
                  <Link
                    to="/affiliate/dashboard"
                    className="flex items-center gap-2 py-2 px-3 bg-orange-50 text-orange-600 rounded-lg font-semibold hover:bg-orange-100 transition-colors"
                  >
                    <TrendingUp className="h-5 w-5" />
                    لوحة تحكم المسوق
                  </Link>
                </div>
              )}
              
              {/* Merchant Panel */}
              {user?.isMerchant && (
                <div className="space-y-2 mb-4">
                  <Link
                    to="/merchant/dashboard"
                    className="flex items-center gap-2 py-2 px-3 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition-colors"
                  >
                    <Briefcase className="h-5 w-5" />
                    لوحة تحكم التاجر
                  </Link>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  الفئات
                </h3>
                {categories.filter(cat => cat.slug).map((category) => (
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
              {categories.filter(cat => cat.slug).map((category) => (
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
        {/* Desktop Search */}
        <div className="hidden lg:flex items-center max-w-sm flex-1 mx-6">
          <UniversalSearch />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {/* Search for mobile */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Control Panel Button - For Affiliates, Merchants & Admins */}
          {user && (user.role === 'admin' || user.isAffiliate || user.role === 'merchant') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:flex items-center gap-2 font-semibold border-2"
                >
                  {user.role === 'admin' && (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>لوحة التحكم</span>
                    </>
                  )}
                  {user.role === 'merchant' && (
                    <>
                      <Briefcase className="h-4 w-4" />
                      <span>لوحة التاجر</span>
                    </>
                  )}
                  {user.isAffiliate && user.role !== 'admin' && user.role !== 'merchant' && (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      <span>لوحة المسوق</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="h-4 w-4" />
                        لوحة الإدارة
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/products" className="flex items-center gap-2 cursor-pointer">
                        إدارة المنتجات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/orders" className="flex items-center gap-2 cursor-pointer">
                        إدارة الطلبات
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user.role === 'merchant' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/merchant/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <Briefcase className="h-4 w-4" />
                        لوحة التاجر
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/products" className="flex items-center gap-2 cursor-pointer">
                        منتجاتي
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user.isAffiliate && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/affiliate/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <TrendingUp className="h-4 w-4" />
                        لوحة المسوق
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/affiliate/analytics" className="flex items-center gap-2 cursor-pointer">
                        التحليلات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/affiliate/withdraw" className="flex items-center gap-2 cursor-pointer">
                        سحب الأرباح
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          {user && <NotificationDropdown />}

          {/* Theme Selector (Color Themes) */}
          <ThemeSelector />

          {/* Theme Toggle (Dark/Light) */}
          <ThemeToggle />

          {/* Wishlist */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
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
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="text-primary font-semibold">
                          <Shield className="ml-2 h-4 w-4" />
                          لوحة تحكم الإدارة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {user.isAffiliate && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/affiliate/dashboard" className="text-orange-600 font-semibold">
                          <TrendingUp className="ml-2 h-4 w-4" />
                          لوحة تحكم المسوق
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {user.isMerchant && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/merchant/dashboard" className="text-purple-600 font-semibold">
                          <Briefcase className="ml-2 h-4 w-4" />
                          لوحة تحكم التاجر
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
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
