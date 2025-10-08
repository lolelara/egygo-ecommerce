import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, DollarSign, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { affiliateApi } from "@/lib/affiliate-api";
import { useToast } from "@/hooks/use-toast";

export default function AffiliateWithdrawPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "wallet">("bank");
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.$id) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user?.$id) return;
    try {
      setLoading(true);
      const [statsData, withdrawalsData] = await Promise.all([
        affiliateApi.getStats(user.$id),
        affiliateApi.getWithdrawals(user.$id),
      ]);
      setStats(statsData);
      setWithdrawals(withdrawalsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const balance = stats?.totalEarnings || 0;
  const minWithdraw = 100;

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < minWithdraw) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: `الحد الأدنى للسحب ${minWithdraw} ج.م`,
      });
      return;
    }

    if (withdrawAmount > balance) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "المبلغ أكبر من رصيدك المتاح",
      });
      return;
    }

    try {
      await affiliateApi.requestWithdrawal(user!.$id, withdrawAmount, method, {});
      toast({
        title: "تم إرسال الطلب",
        description: "سيتم مراجعة طلبك والدفع خلال 7 أيام عمل",
      });
      setAmount("");
      loadData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل في إرسال طلب السحب",
      });
    }
  };

  if (!user?.isAffiliate && user?.role !== "affiliate") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            هذه الصفحة متاحة للمسوقين فقط
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">سحب الأرباح</h1>
        <p className="text-muted-foreground">
          اسحب عمولاتك بسهولة وأمان
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الرصيد المتاح</p>
                <p className="text-2xl font-bold">{balance.toFixed(2)} ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">قيد المراجعة</p>
                <p className="text-2xl font-bold">500.00 ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المسحوبات</p>
                <p className="text-2xl font-bold">5,000 ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>طلب سحب جديد</CardTitle>
          <CardDescription>
            الحد الأدنى للسحب: {minWithdraw} ج.م
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">المبلغ (ج.م)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`أدخل المبلغ (الحد الأدنى ${minWithdraw} ج.م)`}
              min={minWithdraw}
              max={balance}
            />
          </div>

          <div>
            <Label>طريقة الاستلام</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                variant={method === "bank" ? "default" : "outline"}
                onClick={() => setMethod("bank")}
                className="w-full"
              >
                حساب بنكي
              </Button>
              <Button
                variant={method === "wallet" ? "default" : "outline"}
                onClick={() => setMethod("wallet")}
                className="w-full"
              >
                محفظة إلكترونية
              </Button>
            </div>
          </div>

          {method === "bank" && (
            <Alert>
              <AlertDescription>
                سيتم التحويل للحساب البنكي المسجل في ملفك الشخصي
              </AlertDescription>
            </Alert>
          )}

          {method === "wallet" && (
            <Alert>
              <AlertDescription>
                متاح قريباً: فودافون كاش، إنستاباي، فوري
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleWithdraw}
            disabled={!amount || parseFloat(amount) < minWithdraw || parseFloat(amount) > balance}
            className="w-full"
          >
            طلب السحب
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>طلبات السحب السابقة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawals && withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{withdrawal.amount} ج.م</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(withdrawal.createdAt).toLocaleDateString("ar")}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    withdrawal.status === 'completed' ? 'bg-green-500/10 text-green-700' :
                    withdrawal.status === 'rejected' ? 'bg-red-500/10 text-red-700' :
                    'bg-yellow-500/10 text-yellow-700'
                  }`}>
                    {withdrawal.status === 'completed' ? 'مكتمل' :
                     withdrawal.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                لا توجد طلبات سحب سابقة
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
