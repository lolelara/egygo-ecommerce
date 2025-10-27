import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  Copy,
  ExternalLink,
  AlertTriangle,
  Calendar,
  Download,
  Award,
  Target,
  BarChart3,
  LinkIcon,
  Share2,
  Menu,
  X,
  Bell,
  User as UserIcon,
} from "lucide-react";
import { AffiliateSidebar } from "@/components/AffiliateSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardStatsSkeleton } from "@/components/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAffiliateStats, getActiveProducts, getAffiliateActivities } from "@/lib/affiliate-data";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithRelations } from "@shared/prisma-types";
import RotatingBanner from "@/components/banners/RotatingBanner";
import { getBannersByLocation, getBannerSettings } from "@/lib/banners-api";
import { useQuery } from "@tanstack/react-query";
import AffiliateStats from "@/components/charts/AffiliateStats";
import AffiliateProductLinks from "./AffiliateProductLinks";
import QuickActionsPanel from "@/components/affiliate/QuickActionsPanel";
import QuickShareButtons from "@/components/affiliate/QuickShareButtons";
import EarningsCalculator from "@/components/affiliate/EarningsCalculator";
import TopProductsWidget from "@/components/affiliate/TopProductsWidget";
import PerformanceInsights from "@/components/affiliate/PerformanceInsights";
import RecentActivityTimeline from "@/components/affiliate/RecentActivityTimeline";
import LeaderboardWidget from "@/components/affiliate/LeaderboardWidget";
import SmartNotifications from "@/components/affiliate/SmartNotifications";
import ProductComparison from "@/components/affiliate/ProductComparison";
import WithdrawalRequest from "@/components/affiliate/WithdrawalRequest";

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch banners
  const { data: bannersData } = useQuery({
    queryKey: ['banners', 'affiliate'],
    queryFn: () => getBannersByLocation('affiliate'),
  });

  const { data: bannerSettings } = useQuery({
    queryKey: ['bannerSettings', 'affiliate'],
    queryFn: () => getBannerSettings('affiliate'),
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in and has affiliate role
      if (!user) {
        setError("يجب تسجيل الدخول أولاً");
        return;
      }
      
      if (!user.isAffiliate && user.role !== 'affiliate' && user.role !== 'admin') {
        setError("ليس لديك صلاحية الوصول لهذه الصفحة. يجب أن تكون مسوق بالعمولة.");
        return;
      }
      
      // Load products for link generation from Appwrite
      const productsData = await getActiveProducts(6);
      setProducts(productsData as any || []);

      // Load affiliate stats if user is logged in
      if (user?.$id) {
        try {
          const statsData = await getAffiliateStats(user.$id);
          setStats(statsData);
        } catch (statsError) {
          console.error("Error loading stats:", statsError);
          // Set default stats if API fails
          setStats({
            totalClicks: 0,
            totalOrders: 0,
            totalEarnings: 0,
            pendingEarnings: 0,
            thisMonthEarnings: 0,
            affiliateCode: user.affiliateCode || `AFF${user.$id.slice(0, 6).toUpperCase()}`,
            conversionRate: 0,
            clicks: 0,
            conversions: 0,
            referralCount: 0,
            commissionRate: 15
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("فشل في تحميل البيانات. حاول مرة أخرى.");
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في تحميل البيانات",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateLink = (productId: string) => {
    const baseUrl = window.location.origin;
    const code = stats?.affiliateCode || "NOCODE";
    return `${baseUrl}/products/${productId}?ref=${code}`;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(id);
      setTimeout(() => setCopiedLink(null), 2000);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الرابط بنجاح",
      });
    } catch (err) {
      console.error("فشل في نسخ الرابط:", err);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في نسخ الرابط",
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "bg-yellow-500";
      case "Silver":
        return "bg-gray-400";
      case "Bronze":
        return "bg-orange-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <AffiliateSidebar />
      </div>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full">
            <AffiliateSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h2 className="text-lg font-semibold">مرحباً، {user?.name}</h2>
              <p className="text-sm text-muted-foreground">
                كود الإحالة: {user?.affiliateCode || `AFF${user?.$id?.slice(0, 6).toUpperCase()}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/logout')}>تسجيل الخروج</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/40">
          <div className="container mx-auto px-4 py-8 space-y-8">
            {loading ? (
        <div className="py-8">
          <DashboardStatsSkeleton count={4} />
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">
                {error}
              </h2>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/login')} variant="outline">
                  تسجيل الدخول
                </Button>
                <Button onClick={() => navigate('/affiliate')}>
                  التسجيل كمسوق
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : stats ? (
        <>
          {/* Header with Referral Code */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
                  مرحباً، {user?.name || "الشريك"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  إليك نظرة عامة على أداء شراكتك
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  شريك نشط
                </Badge>
              </div>
            </div>
            
            {/* Referral Code Card */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-orange-50/50 dark:from-primary/10 dark:to-neutral-800">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <LinkIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        كود الإحالة الخاص بك
                      </Label>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {user?.affiliateCode || `AFF${user?.$id?.slice(0, 6).toUpperCase()}`}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const code = user?.affiliateCode || `AFF${user?.$id?.slice(0, 6).toUpperCase()}`;
                      navigator.clipboard.writeText(code);
                      toast({
                        title: "تم النسخ!",
                        description: "تم نسخ كود الإحالة بنجاح",
                      });
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    نسخ الكود
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Banners Section */}
          {bannersData && bannersData.length > 0 && (
            <RotatingBanner
              banners={bannersData}
              autoPlayInterval={bannerSettings?.autoPlayInterval || 5}
              showControls={bannerSettings?.showControls ?? true}
              height={bannerSettings?.height || '300px'}
              location="affiliate"
            />
          )}

          {/* Stats Cards - الأهم أولاً */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-orange-200 dark:border-orange-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-800 dark:to-neutral-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الأرباح
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(stats.totalEarnings || 0).toFixed(2)} ج.م
                </div>
                <p className="text-xs text-muted-foreground">
              +12.5% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-800 dark:to-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              أرباح هذا الشهر
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.thisMonthEarnings || 0).toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              +8.2% من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50/30 dark:from-neutral-800 dark:to-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              النقرات هذا الشهر
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.clicks?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي النقرات
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-800 dark:to-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل التحويل</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.conversionRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              +0.8% من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Simplified */}
      <div className="space-y-6">
        {/* Recent Activity & Withdrawal */}
        <div className="grid lg:grid-cols-2 gap-6">
          <RecentActivityTimeline />
          <WithdrawalRequest 
            availableBalance={stats?.totalEarnings || 0}
            pendingWithdrawals={stats?.pendingEarnings || 0}
          />
        </div>

        {/* Performance Insights & Top Products */}
        <div className="grid lg:grid-cols-2 gap-6">
          <PerformanceInsights stats={stats} />
          <TopProductsWidget />
        </div>

        {/* Tabs for Additional Content */}
        <Tabs defaultValue="links" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="links">روابط الشراكة</TabsTrigger>
            <TabsTrigger value="leaderboard">المتصدرين</TabsTrigger>
          </TabsList>

          {/* Links Tab */}
          <TabsContent value="links" className="space-y-6">
            <AffiliateProductLinks />
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <LeaderboardWidget 
              currentUserRank={3} 
              currentUserEarnings={stats?.totalEarnings || 0} 
            />
          </TabsContent>
        </Tabs>
      </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-muted-foreground mb-4">لم يتم العثور على بيانات الشريك</p>
          <Button asChild>
            <Link to="/">العودة للرئيسية</Link>
          </Button>
        </div>
      )}
          </div>
        </main>
      </div>
    </div>
  );
}
