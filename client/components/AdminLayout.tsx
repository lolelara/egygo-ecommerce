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
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  {
    title: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "إدارة المنتجات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "إدارة الفئات",
    href: "/admin/categories",
    icon: FolderOpen,
  },
  {
    title: "إدارة المستخدمين",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "إدارة الطلبات",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "إدارة الشركاء",
    href: "/admin/affiliates",
    icon: UserCheck,
  },
  {
    title: "إدارة العمولات",
    href: "/admin/commissions",
    icon: DollarSign,
  },
  {
    title: "الإعدادات",
    href: "/admin/settings",
    icon: Settings,
  },
];

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate("/login");
    onLinkClick?.();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">لوحة تحكم الإدارة</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onLinkClick}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors hover:bg-accent ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
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
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
