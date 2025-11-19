import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  FolderOpen,
  DollarSign,
  UserCheck,
  Bell,
  Tag,
  BarChart3,
  Truck,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Megaphone,
  Percent,
  Wallet,
  CreditCard,
  FileText,
  Image,
  ArrowRight,
  Bot,
  Zap,
  MessageSquare,
  Gift,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { usePendingAccountsCount } from "@/hooks/usePendingAccountsCount";
import { usePendingProductsCount } from "@/hooks/usePendingProductsCount";
import { usePendingAdsCount } from "@/hooks/usePendingAdsCount";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  // 📊 Dashboard & Overview
  {
    title: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "لوحة الذكاء الاصطناعي",
    href: "/admin/ai-dashboard",
    icon: Bot,
    roles: ['admin'],
  },
  {
    title: "التحليلات المتقدمة",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ['admin'],
  },

  // 📦 Products Management
  {
    title: "إدارة المنتجات",
    href: "/admin/products",
    icon: Package,
    roles: ['admin', 'merchant'],
    separator: true,
  },
  {
    title: "المنتجات المتقدمة",
    href: "/admin/products-advanced",
    icon: Sparkles,
    roles: ['admin'],
  },
  {
    title: "منتجات Hero",
    href: "/admin/hero-products",
    icon: Image,
    roles: ['admin'],
  },
  {
    title: "موافقة المنتجات",
    href: "/admin/product-approval",
    icon: UserCheck,
    roles: ['admin'],
    badge: true,
  },
  {
    title: "حالة المنتجات",
    href: "/merchant/products-status",
    icon: CheckCircle,
    roles: ['merchant'],
  },
  {
    title: "إدارة الفئات",
    href: "/admin/categories",
    icon: FolderOpen,
    roles: ['admin'],
  },

  // 👥 Users & Accounts
  {
    title: "إدارة المستخدمين",
    href: "/admin/users",
    icon: Users,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "الحسابات المعلقة",
    href: "/admin/pending-accounts",
    icon: UserCheck,
    roles: ['admin'],
  },

  // 🛒 Orders & Sales
  {
    title: "إدارة الطلبات",
    href: "/admin/orders",
    icon: ShoppingCart,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "إدارة الشحن",
    href: "/admin/shipping",
    icon: Truck,
    roles: ['admin'],
  },

  // 💰 Financial Management
  {
    title: "النظام المالي",
    href: "/admin/financial",
    icon: Wallet,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "التقارير المالية",
    href: "/admin/reports",
    icon: FileText,
    roles: ['admin'],
  },
  {
    title: "لوحة المالية",
    href: "/admin/financial-dashboard",
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    title: "إدارة العمولات",
    href: "/admin/commissions",
    icon: DollarSign,
    roles: ['admin'],
  },
  {
    title: "طلبات السحب",
    href: "/admin/withdrawals",
    icon: CreditCard,
    roles: ['admin'],
  },
  {
    title: "مدفوعات التجار",
    href: "/admin/merchant-payments",
    icon: DollarSign,
    roles: ['admin'],
  },
  {
    title: "حسابي المالي",
    href: "/merchant/financial",
    icon: Wallet,
    roles: ['merchant'],
  },

  // 🎁 Marketing & Promotions
  {
    title: "إدارة الكوبونات",
    href: "/admin/coupons",
    icon: Tag,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "إدارة العروض",
    href: "/admin/deals",
    icon: Percent,
    roles: ['admin'],
  },
  {
    title: "العروض الخاصة",
    href: "/admin/offers",
    icon: Gift,
    roles: ['admin'],
  },
  {
    title: "إدارة الإعلانات",
    href: "/admin/advertisements",
    icon: Megaphone,
    roles: ['admin'],
    badge: true,
  },
  {
    title: "إدارة البانرات",
    href: "/admin/banners",
    icon: Image,
    roles: ['admin'],
  },
  {
    title: "الإعلانات",
    href: "/merchant/advertising",
    icon: TrendingUp,
    roles: ['merchant'],
  },

  // 🔔 Communication
  {
    title: "الإشعارات",
    href: "/admin/notifications",
    icon: Bell,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "إدارة الواتساب",
    href: "/admin/whatsapp",
    icon: MessageSquare,
    roles: ['admin'],
  },

  // 🤖 AI Tools
  {
    title: "أدوات الـ AI",
    href: "/admin/ai-tools",
    icon: Zap,
    roles: ['admin'],
    separator: true,
  },

  // ⚙️ Settings
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
    roles: ['admin'],
    separator: true,
  },
  {
    title: "الإعدادات المتقدمة",
    href: "/admin/advanced-settings",
    icon: Sparkles,
    roles: ['admin'],
  },
];

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { count: pendingCount } = usePendingAccountsCount();
  const pendingProductsCount = usePendingProductsCount();
  const pendingAdsCount = usePendingAdsCount();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/login");
    onLinkClick?.();
  };

  // تصفية القوائم حسب دور المستخدم
  const filteredNavItems = adminNavItems.filter(item =>
    item.roles.includes(user?.role || 'customer')
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">
          {user?.role === 'merchant' ? 'لوحة تحكم التاجر' : 'لوحة تحكم الإدارة'}
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const previousItem = filteredNavItems[index - 1];
          const showSeparator = item.separator && index > 0;

          return (
            <div key={item.href}>
              {showSeparator && (
                <div className="my-3 border-t border-border/50" />
              )}
              <Link
                to={item.href}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-accent ${isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                {item.href === '/admin/pending-accounts' && pendingCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5">
                    {pendingCount}
                  </Badge>
                )}
                {item.href === '/admin/product-approval' && pendingProductsCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5">
                    {pendingProductsCount}
                  </Badge>
                )}
                {item.href === '/admin/advertisements' && pendingAdsCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center px-1.5">
                    {pendingAdsCount}
                  </Badge>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>أدمن</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">المدير العام</p>
            <p className="text-xs text-muted-foreground">admin@example.com</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
};

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // إخفاء زر الرجوع في صفحة الداشبورد الرئيسية
  const showBackButton = location.pathname !== '/admin' && location.pathname !== '/admin/';

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">لوحة التحكم</h1>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </div>
        </div>

        <SheetContent side="right" className="w-[280px] p-0">
          <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:w-[280px] lg:border-r lg:bg-muted/30">
          <div className="sticky top-0 h-screen">
            <SidebarContent />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:max-w-[calc(100vw-280px)]">
          <main className="p-4 lg:p-6">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="mb-4"
              >
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة للوحة التحكم
              </Button>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
