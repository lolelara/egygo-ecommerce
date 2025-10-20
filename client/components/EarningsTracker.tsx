import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { useAuth } from '@/contexts/AppwriteAuthContext';

export default function EarningsTracker() {
  const [earnings, setEarnings] = useState({
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    pending: 0
  });
  const [calculator, setCalculator] = useState({
    price: '',
    commission: '',
    quantity: '1'
  });
  const { user } = useAuth();

  useEffect(() => {
    loadEarnings();
    const interval = setInterval(loadEarnings, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const loadEarnings = async () => {
    if (!user?.isAffiliate) return;

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all commissions
      const response = await databases.listDocuments(
        DATABASE_ID,
        'commissions',
        [
          Query.equal('affiliateId', user.$id),
          Query.orderDesc('$createdAt')
        ]
      );

      const commissions = response.documents;

      // Calculate earnings
      const todayEarnings = commissions
        .filter(c => new Date(c.$createdAt) >= today && c.status === 'paid')
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      const yesterdayEarnings = commissions
        .filter(c => {
          const date = new Date(c.$createdAt);
          return date >= yesterday && date < today && c.status === 'paid';
        })
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      const weekEarnings = commissions
        .filter(c => new Date(c.$createdAt) >= weekStart && c.status === 'paid')
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      const monthEarnings = commissions
        .filter(c => new Date(c.$createdAt) >= monthStart && c.status === 'paid')
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      const totalEarnings = commissions
        .filter(c => c.status === 'paid')
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      const pendingEarnings = commissions
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + (c.amount || 0), 0);

      setEarnings({
        today: todayEarnings,
        yesterday: yesterdayEarnings,
        thisWeek: weekEarnings,
        thisMonth: monthEarnings,
        total: totalEarnings,
        pending: pendingEarnings
      });
    } catch (error) {
      console.error('Error loading earnings:', error);
    }
  };

  const calculateCommission = () => {
    const price = parseFloat(calculator.price) || 0;
    const commission = parseFloat(calculator.commission) || 0;
    const quantity = parseInt(calculator.quantity) || 1;
    return (price * (commission / 100) * quantity).toFixed(2);
  };

  const todayChange = earnings.yesterday > 0
    ? ((earnings.today - earnings.yesterday) / earnings.yesterday) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">اليوم</span>
              {todayChange !== 0 && (
                <Badge variant={todayChange > 0 ? 'default' : 'destructive'} className="text-xs">
                  {todayChange > 0 ? <TrendingUp className="h-3 w-3 ml-1" /> : <TrendingDown className="h-3 w-3 ml-1" />}
                  {Math.abs(todayChange).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-2xl font-bold text-green-600">{earnings.today.toFixed(2)} ج.م</p>
            <p className="text-xs text-muted-foreground mt-1">
              الأمس: {earnings.yesterday.toFixed(2)} ج.م
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-sm text-muted-foreground">هذا الأسبوع</span>
            <p className="text-2xl font-bold text-blue-600">{earnings.thisWeek.toFixed(2)} ج.م</p>
            <p className="text-xs text-muted-foreground mt-1">آخر 7 أيام</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-sm text-muted-foreground">هذا الشهر</span>
            <p className="text-2xl font-bold text-purple-600">{earnings.thisMonth.toFixed(2)} ج.م</p>
            <p className="text-xs text-muted-foreground mt-1">
              <Calendar className="h-3 w-3 inline ml-1" />
              {new Date().toLocaleDateString('ar-EG', { month: 'long' })}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <span className="text-sm text-muted-foreground">إجمالي الأرباح</span>
            <p className="text-3xl font-bold text-green-600">{earnings.total.toFixed(2)} ج.م</p>
            <p className="text-xs text-muted-foreground mt-1">منذ البداية</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <span className="text-sm text-muted-foreground">قيد الانتظار</span>
            <p className="text-2xl font-bold text-yellow-600">{earnings.pending.toFixed(2)} ج.م</p>
            <p className="text-xs text-muted-foreground mt-1">سيتم الدفع قريباً</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            حاسبة العمولة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>سعر المنتج (ج.م)</Label>
              <Input
                type="number"
                placeholder="1000"
                value={calculator.price}
                onChange={(e) => setCalculator({ ...calculator, price: e.target.value })}
              />
            </div>
            <div>
              <Label>نسبة العمولة (%)</Label>
              <Input
                type="number"
                placeholder="10"
                value={calculator.commission}
                onChange={(e) => setCalculator({ ...calculator, commission: e.target.value })}
              />
            </div>
            <div>
              <Label>الكمية</Label>
              <Input
                type="number"
                placeholder="1"
                value={calculator.quantity}
                onChange={(e) => setCalculator({ ...calculator, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">عمولتك المتوقعة</p>
                <p className="text-3xl font-bold text-green-600">
                  {calculateCommission()} ج.م
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              <strong>مثال:</strong> إذا بعت منتج بسعر 1000 ج.م بعمولة 10%، ستحصل على 100 ج.م
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">متوسط العمولة</p>
                <p className="text-xl font-bold">
                  {earnings.total > 0 ? (earnings.total / 30).toFixed(2) : '0.00'} ج.م/يوم
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الهدف الشهري</p>
                <p className="text-xl font-bold">5,000 ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Update Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>يتم التحديث كل 30 ثانية</span>
      </div>
    </div>
  );
}
