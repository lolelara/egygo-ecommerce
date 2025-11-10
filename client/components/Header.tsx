import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, Heart, Users, LogOut, Shield, TrendingUp, Briefcase, ChevronDown, Grid3x3 } from "lucide-react";
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
import { categoriesApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useI18n } from "@/lib/i18n";
import SearchBar from "./SearchBar";
import { NotificationDropdown } from "./NotificationDropdown";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import type { CategoryWithCount } from "@shared/prisma-types";

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount }: HeaderProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { items, itemCount } = useCart();
  const { favorites } = useFavorites();
  const { t } = useI18n();
  const totalItems = cartItemCount ?? itemCount;
  const wishlistCount = favorites.length;

  useEffect(() => {
    // Load categories from Appwrite
    categoriesApi
      .getAll()
      .then((data) => {
        setCategories(data.categories);
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 ${isScrolled ? 'shadow-xl' : 'shadow-lg'} transition-all duration-300`}>
      {/* Top Bar - Compact */}
      <div className="border-b border-border/40 bg-gradient-to-r from-red-600/5 via-red-700/5 to-red-600/5">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground hidden sm:inline">💼 {t('marketing.registerEarn')}</span>
            </div>
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <div className="h-4 w-px bg-border hidden sm:block" />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={`container mx-auto flex items-center justify-between gap-4 px-4 ${isScrolled ? 'h-14' : 'h-16'} transition-all duration-300`}>
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
                    className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900 dark:to-purple-800 text-primary rounded-lg font-semibold hover:shadow-md transition-all"
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
                    className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-orange-100 to-yellow-50 dark:from-orange-900 dark:to-yellow-800 text-orange-600 dark:text-orange-300 rounded-lg font-semibold hover:shadow-md transition-all"
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
                    className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-purple-100 to-pink-50 dark:from-purple-900 dark:to-pink-800 text-purple-600 dark:text-purple-300 rounded-lg font-semibold hover:shadow-md transition-all"
                  >
                    <Briefcase className="h-5 w-5" />
                    لوحة تحكم التاجر
                  </Link>
                </div>
              )}
              
              {/* Intermediary Panel */}
              {user?.isIntermediary && (
                <div className="space-y-2 mb-4">
                  <Link
                    to="/intermediary/dashboard"
                    className="flex items-center gap-2 py-2 px-3 bg-gradient-to-r from-indigo-100 to-blue-50 dark:from-indigo-900 dark:to-blue-800 text-indigo-600 dark:text-indigo-300 rounded-lg font-semibold hover:shadow-md transition-all"
                  >
                    <Users className="h-5 w-5" />
                    لوحة تحكم الوسيط
                  </Link>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Grid3x3 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm text-muted-foreground">
                    الفئات
                  </h3>
                </div>
                {categories.filter(cat => cat.slug).map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="flex items-center justify-between py-2 px-3 text-sm hover:bg-muted rounded-md hover:text-primary transition-all"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.productCount}
                    </Badge>
                  </Link>
                ))}
                <Link
                  to="/categories"
                  className="flex items-center justify-center py-2 px-3 mt-2 text-sm font-semibold text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-all"
                >
                  عرض جميع الفئات
                </Link>
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
        <Link to="/" aria-label="EgyGo" className="shrink-0 inline-flex items-center">
          <img src="https://cloud.appwrite.io/v1/storage/buckets/public-assets/files/logo.png/view?project=68d8b9db00134c41e7c8" alt="EgyGo" className="h-14 md:h-16 w-auto transition-all duration-300 hover:scale-105" />
        </Link>

        {/* Desktop Navigation - Streamlined */}
        <nav className="hidden lg:flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 font-medium">
                <Grid3x3 className="h-4 w-4" />
                <span>الفئات</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                تصفح حسب الفئة
              </div>
              <DropdownMenuSeparator />
              {categories.filter(cat => cat.slug).map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link
                    to={`/category/${category.slug}`}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.productCount}
                    </Badge>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/categories"
                  className="flex items-center justify-center w-full font-semibold text-primary cursor-pointer"
                >
                  عرض جميع الفئات
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" asChild>
            <Link to="/deals" className="gap-1">
              <TrendingUp className="h-4 w-4" />
              العروض
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 hover:from-orange-500/20 hover:to-yellow-500/20">
            <Link to="/affiliate" className="gap-1">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent font-semibold">كن شريكاً</span>
            </Link>
          </Button>
        </nav>

        {/* Search Bar - Full Width on Desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-xl">
          <UniversalSearch />
        </div>

        {/* Actions - Organized */}
        <div className="flex items-center gap-1">
          {/* Mobile Search */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="h-auto">
              <div className="p-4">
                <UniversalSearch />
              </div>
            </SheetContent>
          </Sheet>

          {/* Dashboard Quick Access */}
          {user && (user.role === 'admin' || user.isAffiliate || user.role === 'merchant' || user.isIntermediary) && (
            <Button 
              variant="gradient" 
              size="sm"
              className="hidden md:inline-flex gap-2"
              asChild
            >
              <Link to={
                user.role === 'admin' ? '/admin' :
                user.role === 'merchant' ? '/merchant/dashboard' :
                user.isIntermediary ? '/intermediary/dashboard' :
                '/affiliate/dashboard'
              }>
                {user.role === 'admin' && <Shield className="h-4 w-4" />}
                {user.role === 'merchant' && <Briefcase className="h-4 w-4" />}
                {user.isIntermediary && <Users className="h-4 w-4" />}
                {user.isAffiliate && user.role !== 'admin' && user.role !== 'merchant' && user.role !== 'intermediary' && <TrendingUp className="h-4 w-4" />}
                <span className="hidden xl:inline">لوحة التحكم</span>
              </Link>
            </Button>
          )}

          {/* Dashboard Dropdown - Mobile Replacement */}
          {user && (user.role === 'admin' || user.isAffiliate || user.role === 'merchant' || user.isIntermediary) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                >
                  {user.role === 'admin' && <Shield className="h-5 w-5" />}
                  {user.role === 'merchant' && <Briefcase className="h-5 w-5" />}
                  {user.isIntermediary && <Users className="h-5 w-5" />}
                  {user.isAffiliate && user.role !== 'admin' && user.role !== 'merchant' && user.role !== 'intermediary' && <TrendingUp className="h-5 w-5" />}
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
                {user.isIntermediary && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/intermediary/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <Users className="h-4 w-4" />
                        لوحة الوسيط
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/intermediary/products" className="flex items-center gap-2 cursor-pointer">
                        منتجاتي
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/intermediary/links" className="flex items-center gap-2 cursor-pointer">
                        روابطي
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    طلباتي
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    المفضلة
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications - Enhanced */}
          {user && <NotificationDropdown />}

          {/* Wishlist - Enhanced Badge */}
          <Button variant="ghost" size="icon" className="relative group" asChild>
            <Link to="/wishlist">
              <Heart className="h-5 w-5 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
              {wishlistCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 to-red-500 border-2 border-background"
                >
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Cart - Enhanced Badge with Live Count */}
          <Button 
            variant="default" 
            size="icon" 
            className="relative bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all" 
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-[11px] font-bold bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 border-2 border-background shadow-lg animate-bounce"
                  style={{
                    animation: 'bounce 0.5s ease-in-out',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                  }}
                >
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu - Enhanced */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-full">
                {user ? (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-3 border-b">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
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
