import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, DollarSign, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WithdrawalRequestProps {
  availableBalance?: number;
  pendingWithdrawals?: number;
}

export default function WithdrawalRequest({ 
  availableBalance = 450, 
  pendingWithdrawals = 0 
}: WithdrawalRequestProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minWithdrawal = 100;
  const canWithdraw = availableBalance >= minWithdrawal;

  const handleWithdrawal = async () => {
    const withdrawalAmount = parseFloat(amount);

    if (!withdrawalAmount || withdrawalAmount < minWithdrawal) {
      toast({
        title: "خطأ",
        description: `الحد الأدنى للسحب هو ${minWithdrawal} ج.م`,
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > availableBalance) {
      toast({
        title: "خطأ",
        description: "المبلغ المطلوب أكبر من الرصيد المتاح",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار طريقة الدفع",
        variant: "destructive",
      });
      return;
    }

    if (!accountDetails) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال تفاصيل الحساب",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "✅ تم إرسال الطلب",
        description: `تم إرسال طلب سحب ${withdrawalAmount} ج.م بنجاح. سيتم المعالجة خلال 2-3 أيام عمل.`,
      });
      setAmount("");
      setPaymentMethod("");
      setAccountDetails("");
      setIsSubmitting(false);
    }, 1500);
  };

  const calculateFee = (amount: number) => {
    // 2% fee
    return (amount * 0.02).toFixed(2);
  };

  const calculateNet = (amount: number) => {
    return (amount - parseFloat(calculateFee(amount))).toFixed(2);
  };

  return (
    <Card className="border-green-200 shadow-lg bg-gradient-to-br from-white to-green-50/30 dark:from-neutral-800 dark:to-neutral-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-600" />
          طلب سحب الأرباح
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          اسحب أرباحك بسهولة وأمان
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">الرصيد المتاح</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {availableBalance.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">ج.م</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border-2 border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-muted-foreground">قيد المعالجة</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {pendingWithdrawals.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">ج.م</p>
          </div>
        </div>

        <Separator />

        {/* Withdrawal Form */}
        {canWithdraw ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ المطلوب سحبه (ج.م)</Label>
              <Input
                id="amount"
                type="number"
                min={minWithdrawal}
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`الحد الأدنى ${minWithdrawal} ج.م`}
                className="text-lg font-semibold"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>الحد الأدنى: {minWithdrawal} ج.م</span>
                <span>الحد الأقصى: {availableBalance.toFixed(2)} ج.م</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">تحويل بنكي</SelectItem>
                  <SelectItem value="vodafone">فودافون كاش</SelectItem>
                  <SelectItem value="instapay">إنستاباي</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="account-details">
                {paymentMethod === 'bank' ? 'رقم الحساب البنكي' :
                 paymentMethod === 'vodafone' ? 'رقم فودافون كاش' :
                 paymentMethod === 'instapay' ? 'رقم إنستاباي' :
                 paymentMethod === 'paypal' ? 'بريد PayPal' :
                 'تفاصيل الحساب'}
              </Label>
              <Input
                id="account-details"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder="أدخل تفاصيل الحساب"
              />
            </div>

            {/* Fee Calculation */}
            {amount && parseFloat(amount) >= minWithdrawal && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المبلغ المطلوب</span>
                  <span className="font-semibold">{parseFloat(amount).toFixed(2)} ج.م</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">رسوم المعالجة (2%)</span>
                  <span className="font-semibold text-red-600">-{calculateFee(parseFloat(amount))} ج.م</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold">المبلغ الصافي</span>
                  <span className="text-xl font-bold text-green-600">
                    {calculateNet(parseFloat(amount))} ج.م
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleWithdrawal}
              disabled={isSubmitting || !amount || parseFloat(amount) < minWithdrawal}
            >
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-5 w-5" />
                  طلب سحب
                </>
              )}
            </Button>

            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>ملاحظة:</strong> يتم معالجة طلبات السحب خلال 2-3 أيام عمل. 
                سيتم إرسال إشعار عند تحويل المبلغ.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">الرصيد غير كافٍ للسحب</p>
              <p className="text-sm text-muted-foreground mb-3">
                تحتاج إلى {(minWithdrawal - availableBalance).toFixed(2)} ج.م إضافية للوصول للحد الأدنى
              </p>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>استمر في الترويج لزيادة أرباحك!</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Withdrawal History Preview */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            آخر عمليات السحب
          </h4>
          <div className="space-y-2">
            {[
              { date: '2024-01-15', amount: 500, status: 'completed' },
              { date: '2024-01-01', amount: 300, status: 'completed' }
            ].map((withdrawal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                <div>
                  <p className="font-semibold">{withdrawal.amount} ج.م</p>
                  <p className="text-xs text-muted-foreground">{withdrawal.date}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  مكتمل
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
