/**
 * Affiliate Sidebar Navigation
 * قائمة جانبية للمسوق مثل الأدمن
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';
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
  Award,
  Download,
  Megaphone,
  Globe,
  Image,
  Ticket,
  MousePointerClick,
} from 'lucide-react';

// Organized sections with logical grouping
const navigationSections = [
  {
    title: 'الأساسيات',
    items: [
      {
        name: 'لوحة التحكم',
        href: '/affiliate/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'أدوات الترويج',
    items: [
      {
        name: 'روابط الشراكة',
        href: '/affiliate/links',
        icon: Link2,
      },
      {
        name: 'صفحات الهبوط',
        href: '/affiliate/landing-pages',
        icon: Globe,
        badge: '🔥',
      },
      {
        name: 'البانرات الإعلانية',
        href: '/affiliate/banners',
        icon: Image,
      },
      {
        name: 'أكواد الخصم',
        href: '/affiliate/coupons',
        icon: Ticket,
      },
    ],
  },
  {
    title: 'الأداء والأرباح',
    items: [
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
        name: 'التقارير',
        href: '/affiliate/reports',
        icon: FileText,
      },
    ],
  },
  {
    title: 'الإحالات والمنافسة',
    items: [
      {
        name: 'الإحالات',
        href: '/affiliate/referrals',
        icon: Users,
      },
      {
        name: 'المتصدرين',
        href: '/affiliate/leaderboard',
        icon: Award,
      },
    ],
  },
  {
    title: 'التعليم والدعم',
    items: [
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
    ],
  },
  {
    title: 'الإعدادات',
    items: [
      {
        name: 'الإعدادات',
        href: '/affiliate/settings',
        icon: Settings,
      },
    ],
  },
];

export function AffiliateSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    todayClicks: 0,
    activeLinks: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadQuickStats();
    }
  }, [user]);

  const loadQuickStats = async () => {
    try {
      setLoading(true);
      
      // Get total earnings
      const earningsResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'affiliate_earnings',
        [Query.equal('affiliateId', user.$id)]
      );
      
      const totalEarnings = earningsResponse.documents.reduce(
        (sum, doc) => sum + (doc.amount || 0),
        0
      );

      // Get today's clicks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const clicksResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'affiliate_clicks',
        [
          Query.equal('affiliateId', user.$id),
          Query.greaterThanEqual('$createdAt', today.toISOString()),
        ]
      );

      // Get active links count
      const linksResponse = await databases.listDocuments(
        appwriteConfig.databaseId,
        'affiliate_links',
        [
          Query.equal('affiliateId', user.$id),
          Query.equal('isActive', true),
        ]
      );

      setStats({
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        todayClicks: clicksResponse.total || 0,
        activeLinks: linksResponse.total || 0,
        conversionRate: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/affiliate/dashboard" className="flex items-center gap-2 font-semibold">
          <Target className="h-6 w-6 text-primary" />
          <span className="text-lg">لوحة المسوق</span>
        </Link>
      </div>

      {/* Quick Stats Card */}
      <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border-b">
        {loading ? (
          <div className="grid grid-cols-2 gap-2 animate-pulse">
            <div className="bg-white rounded-lg p-3 h-16" />
            <div className="bg-white rounded-lg p-3 h-16" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <DollarSign className="h-3 w-3" />
                <span>الأرباح</span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {stats.totalEarnings} ج.م
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <MousePointerClick className="h-3 w-3" />
                <span>النقرات اليوم</span>
              </div>
              <div className="text-lg font-bold text-blue-600">
                {stats.todayClicks}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation with Sections */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
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
            </div>
          </div>
        ))}
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
