import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, DollarSign, CreditCard, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AffiliateWithdrawPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "wallet">("bank");

  // Mock data - replace with real API
  const balance = 1250.00;
  const minWithdraw = 100;
  const pendingWithdrawals = [
    { id: 1, amount: 500, date: "2024-01-15", status: "pending" },
  ];

  const handleWithdraw = () => {
    console.log("Withdraw request:", { amount, method });
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
            {pendingWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{withdrawal.amount} ج.م</p>
                  <p className="text-sm text-muted-foreground">{withdrawal.date}</p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-yellow-500/10 text-yellow-700 rounded-full">
                  قيد المراجعة
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
