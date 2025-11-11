import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Home,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AppwriteAuthContext";

interface OrdersLayoutProps {
  children: React.ReactNode;
}

const ordersNavItems = [
  {
    title: "لوحة الأوردرات",
    href: "/orders",
    icon: Truck,
  },
  {
    title: "Vendoor",
    href: "/orders/vendoor",
    icon: ShoppingCart,
  },
  {
    title: "Jumia",
    href: "/orders/jumia",
    icon: Package,
    badge: "قريباً",
    disabled: true,
  },
  {
    title: "Amazon",
    href: "/orders/amazon",
    icon: Package,
    badge: "قريباً",
    disabled: true,
  },
  {
    title: "إحصائيات",
    href: "/orders/analytics",
    icon: BarChart3,
  },
  {
    title: "الإعدادات",
    href: "/orders/settings",
    icon: Settings,
  },
];

export function OrdersLayout({ children }: OrdersLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo & Title */}
      <div className="flex h-16 items-center border-b px-6">
        <Truck className="h-8 w-8 text-blue-600" />
        <div className="mr-3">
          <h2 className="text-xl font-bold">نظام الأوردرات</h2>
          <p className="text-xs text-muted-foreground">إدارة المستوردات</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {ordersNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              to={item.disabled ? "#" : item.href}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                setSidebarOpen(false);
              }}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="border-t p-4 space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2"
          onClick={() => navigate("/admin")}
        >
          <Home className="h-4 w-4" />
          لوحة تحكم الموقع
        </Button>
      </div>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => logout()}
            title="تسجيل الخروج"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-l bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-600" />
            <span className="font-bold">نظام الأوردرات</span>
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
