/**
 * Affiliate Sidebar Navigation
 * قائمة جانبية للمسوق مثل الأدمن
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Link2,
  TrendingUp,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  Users,
  Target,
  Zap,
  Gift,
  Award,
  Download,
  Share2,
  Megaphone,
  Globe,
} from 'lucide-react';

const navigation = [
  {
    name: 'لوحة التحكم',
    href: '/affiliate/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'روابط الشراكة',
    href: '/affiliate/links',
    icon: Link2,
  },
  {
    name: 'صفحات الهبوط',
    href: '/affiliate/landing-pages',
    icon: Globe,
    badge: 'جديد',
  },
  {
    name: 'الأداء والتحليلات',
    href: '/affiliate/analytics',
    icon: BarChart3,
  },
  {
    name: 'الأرباح',
    href: '/affiliate/earnings',
    icon: DollarSign,
  },
  {
    name: 'طلبات السحب',
    href: '/affiliate/withdrawals',
    icon: TrendingUp,
  },
  {
    name: 'المتصدرين',
    href: '/affiliate/leaderboard',
    icon: Award,
  },
  {
    name: 'الإحالات',
    href: '/affiliate/referrals',
    icon: Users,
  },
  {
    name: 'الحملات التسويقية',
    href: '/affiliate/campaigns',
    icon: Megaphone,
  },
  {
    name: 'مواد التسويق',
    href: '/affiliate/resources',
    icon: Download,
  },
  {
    name: 'التقارير',
    href: '/affiliate/reports',
    icon: FileText,
  },
  {
    name: 'الإعدادات',
    href: '/affiliate/settings',
    icon: Settings,
  },
];

export function AffiliateSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/affiliate/dashboard" className="flex items-center gap-2 font-semibold">
          <Target className="h-6 w-6 text-primary" />
          <span className="text-lg">لوحة المسوق</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Zap className="h-4 w-4 text-primary" />
            <span>نصيحة سريعة</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            استخدم صفحات الهبوط لزيادة معدل التحويل بنسبة تصل إلى 300%!
          </p>
        </div>
      </div>
    </div>
  );
}
