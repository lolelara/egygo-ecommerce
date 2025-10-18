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
        "fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden",
        "safe-area-inset-bottom",
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
                "relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                "active:scale-95 active:bg-accent rounded-lg",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 min-w-4 px-1 flex items-center justify-center text-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span
                className={cn(
                  "text-xs transition-all",
                  active ? "font-medium" : "font-normal"
                )}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
