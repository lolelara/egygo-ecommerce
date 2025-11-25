/**
 * Mobile Bottom Navigation Component
 * Fixed bottom navigation for mobile devices
 */

import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

interface MobileBottomNavProps {
  cartCount?: number;
  favoritesCount?: number;
  className?: string;
}

export function MobileBottomNav({
  cartCount = 0,
  favoritesCount = 0,
  className,
}: MobileBottomNavProps) {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: <Home className="h-5 w-5" />,
      path: '/',
    },
    {
      id: 'search',
      label: 'بحث',
      icon: <Search className="h-5 w-5" />,
      path: '/search',
    },
    {
      id: 'cart',
      label: 'السلة',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/cart',
      badge: cartCount,
    },
    {
      id: 'favorites',
      label: 'المفضلة',
      icon: <Heart className="h-5 w-5" />,
      path: '/favorites',
      badge: favoritesCount,
    },
    {
      id: 'profile',
      label: 'حسابي',
      icon: <User className="h-5 w-5" />,
      path: '/profile',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 md:hidden shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]",
        "safe-area-inset-bottom pb-safe",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300",
                "active:scale-90 rounded-xl mx-1",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div className={cn("relative p-1 rounded-full transition-all duration-300", active && "bg-primary/10 -translate-y-1")}>
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    className={cn(
                      "absolute -top-1 -right-1 h-4 w-4 min-w-[16px] rounded-full p-0 flex items-center justify-center text-[9px] font-bold border-[1.5px] border-background shadow-sm",
                      item.id === 'cart'
                        ? "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 animate-pulse"
                        : "bg-gradient-to-r from-pink-500 to-red-500"
                    )}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] transition-all duration-300",
                  active ? "font-bold translate-y-0 opacity-100" : "font-medium translate-y-1 opacity-80"
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
