import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Link2, 
  Copy, 
  Share2, 
  Gift,
  TrendingUp,
  DollarSign,
  UserPlus,
  Award,
  CheckCircle,
  Clock,
  QrCode
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import QRCode from "qrcode";

interface Referral {
  $id: string;
  referrerId: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  status: 'pending' | 'active' | 'completed';
  reward: number;
  level: number;
  createdAt: string;
  completedAt?: string;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  completedReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
}

export default function AffiliateReferralSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    thisMonthReferrals: 0,
    thisMonthEarnings: 0
  });
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    if (user) {
      loadReferralData();
      generateReferralCode();
    }
  }, [user]);

  /**
   * Generate unique referral code
   */
  const generateReferralCode = async () => {
    try {
      // Get user's affiliate code from userPreferences
      const prefs = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.userPreferences,
        user!.$id
      );

      const code = prefs.affiliateCode || `REF${user!.$id.slice(0, 8).toUpperCase()}`;
      setReferralCode(code);

      // Generate referral link
      const link = `${window.location.origin}/register?ref=${code}`;
      setReferralLink(link);

      // Generate QR code
      const qr = await QRCode.toDataURL(link, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qr);
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  /**
   * Load referral data
   */
  const loadReferralData = async () => {
    setLoading(true);
    try {
      // Load referrals
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.referrals || 'referrals',
        [
          Query.equal('referrerId', user!.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      const referralData = response.documents as unknown as Referral[];
      setReferrals(referralData);

      // Calculate stats
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const stats: ReferralStats = {
        totalReferrals: referralData.length,
        activeReferrals: referralData.filter(r => r.status === 'active').length,
        completedReferrals: referralData.filter(r => r.status === 'completed').length,
        totalEarnings: referralData
          .filter(r => r.status === 'completed')
          .reduce((sum, r) => sum + r.reward, 0),
        pendingEarnings: referralData
          .filter(r => r.status === 'active')
          .reduce((sum, r) => sum + r.reward, 0),
        thisMonthReferrals: referralData.filter(
          r => new Date(r.createdAt) >= thisMonth
        ).length,
        thisMonthEarnings: referralData
          .filter(r => r.status === 'completed' && new Date(r.completedAt!) >= thisMonth)
          .reduce((sum, r) => sum + r.reward, 0)
      };

      setStats(stats);
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل بيانات الإحالة",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copy referral link
   */
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "✅ تم النسخ",
      description: "تم نسخ رابط الإحالة"
    });
  };

  /**
   * Copy referral code
   */
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "✅ تم النسخ",
      description: "تم نسخ كود الإحالة"
    });
  };

  /**
   * Share referral link
   */
  const shareReferralLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'انضم إلى EgyGo',
          text: `استخدم كود الإحالة الخاص بي: ${referralCode}`,
          url: referralLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyReferralLink();
    }
  };

  /**
   * Download QR code
   */
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `referral-qr-${referralCode}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50"><Clock className="h-3 w-3 mr-1" />قيد الانتظار</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-50"><UserPlus className="h-3 w-3 mr-1" />نشط</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />مكتمل</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * Get level badge
   */
  const getLevelBadge = (level: number) => {
    const colors = ['bg-bronze', 'bg-silver', 'bg-gold', 'bg-platinum'];
    const labels = ['المستوى 1', 'المستوى 2', 'المستوى 3', 'المستوى 4'];
    return (
      <Badge className={colors[level - 1] || 'bg-gray-500'}>
        {labels[level - 1] || `المستوى ${level}`}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            نظام الإحالة
          </h1>
          <p className="text-muted-foreground mt-1">
            احصل على مكافآت عند دعوة أصدقائك
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الإحالات</p>
                <p className="text-3xl font-bold">{stats.totalReferrals}</p>
              </div>
              <Users className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إحالات نشطة</p>
                <p className="text-3xl font-bold text-blue-600">{stats.activeReferrals}</p>
              </div>
              <UserPlus className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأرباح</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalEarnings} ج.م</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">أرباح هذا الشهر</p>
                <p className="text-3xl font-bold text-purple-600">{stats.thisMonthEarnings} ج.م</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            أدوات الإحالة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link">
                <Link2 className="h-4 w-4 mr-1" />
                الرابط
              </TabsTrigger>
              <TabsTrigger value="code">
                <Gift className="h-4 w-4 mr-1" />
                الكود
              </TabsTrigger>
              <TabsTrigger value="qr">
                <QrCode className="h-4 w-4 mr-1" />
                QR Code
              </TabsTrigger>
            </TabsList>

            {/* Referral Link */}
            <TabsContent value="link" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">رابط الإحالة الخاص بك</label>
                <div className="flex gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button onClick={copyReferralLink} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button onClick={shareReferralLink}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  شارك هذا الرابط مع أصدقائك للحصول على مكافآت
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-blue-600" />
                  المكافآت
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>50 ج.م عند تسجيل صديقك</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>100 ج.م عند أول عملية شراء</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>5% من مشتريات صديقك مدى الحياة</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Referral Code */}
            <TabsContent value="code" className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">كود الإحالة الخاص بك</label>
                <div className="flex gap-2">
                  <Input
                    value={referralCode}
                    readOnly
                    className="font-mono text-2xl font-bold text-center"
                  />
                  <Button onClick={copyReferralCode} variant="outline">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  يمكن لأصدقائك إدخال هذا الكود عند التسجيل
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">كيفية الاستخدام:</h3>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>شارك الكود مع أصدقائك</li>
                  <li>يقوم صديقك بالتسجيل في الموقع</li>
                  <li>يدخل الكود في حقل "كود الإحالة"</li>
                  <li>تحصل على المكافأة فوراً!</li>
                </ol>
              </div>
            </TabsContent>

            {/* QR Code */}
            <TabsContent value="qr" className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="border-4 border-gray-200 rounded-lg"
                  />
                )}
                <Button onClick={downloadQRCode} className="w-full max-w-xs">
                  <QrCode className="h-4 w-4 mr-2" />
                  تحميل QR Code
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  اطبع هذا الكود أو شاركه على وسائل التواصل الاجتماعي
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            إحالاتي ({referrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground">لا توجد إحالات بعد</p>
              <p className="text-sm text-muted-foreground mt-2">
                ابدأ بمشاركة رابط الإحالة مع أصدقائك
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {referrals.map((referral) => (
                <div
                  key={referral.$id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{referral.referredUserName}</p>
                      <p className="text-sm text-muted-foreground">{referral.referredUserEmail}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(referral.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getLevelBadge(referral.level)}
                    {getStatusBadge(referral.status)}
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">المكافأة</p>
                      <p className="text-lg font-bold text-green-600">{referral.reward} ج.م</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referral Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            مستويات الإحالة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold">المستوى 1</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">الإحالة المباشرة</p>
              <p className="text-2xl font-bold text-orange-600">50 ج.م</p>
              <p className="text-xs text-muted-foreground mt-1">+ 5% من المشتريات</p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold">المستوى 2</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">إحالة الإحالة</p>
              <p className="text-2xl font-bold text-gray-600">25 ج.م</p>
              <p className="text-xs text-muted-foreground mt-1">+ 2.5% من المشتريات</p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <h3 className="font-bold">المستوى 3</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">المستوى الثالث</p>
              <p className="text-2xl font-bold text-yellow-600">10 ج.م</p>
              <p className="text-xs text-muted-foreground mt-1">+ 1% من المشتريات</p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold">المستوى 4</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">المستوى الرابع</p>
              <p className="text-2xl font-bold text-purple-600">5 ج.م</p>
              <p className="text-xs text-muted-foreground mt-1">+ 0.5% من المشتريات</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              كيف يعمل نظام المستويات؟
            </h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>المستوى 1:</strong> الأشخاص الذين تحيلهم مباشرة</li>
              <li>• <strong>المستوى 2:</strong> الأشخاص الذين يحيلهم أصدقاؤك</li>
              <li>• <strong>المستوى 3:</strong> الأشخاص الذين يحيلهم أصدقاء أصدقائك</li>
              <li>• <strong>المستوى 4:</strong> المستوى الرابع من الإحالات</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
