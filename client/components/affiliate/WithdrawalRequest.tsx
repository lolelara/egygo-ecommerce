import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wallet, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { getWithdrawalRequests } from "@/lib/affiliate-data";
import { ID } from "appwrite";

interface WithdrawalRequestProps {
  availableBalance?: number;
  pendingWithdrawals?: number;
}

export default function WithdrawalRequest({ 
  availableBalance = 0, 
  pendingWithdrawals = 0 
}: WithdrawalRequestProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const minWithdrawal = 100;
  const canWithdraw = availableBalance >= minWithdrawal;

  useEffect(() => {
    if (user?.$id) {
      loadWithdrawalHistory();
    }
  }, [user]);

  const loadWithdrawalHistory = async () => {
    if (!user?.$id) return;
    
    try {
      setLoading(true);
      const history = await getWithdrawalRequests(user.$id);
      setWithdrawalHistory(history);
    } catch (error) {
      console.error('Error loading withdrawal history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!user?.$id) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive",
      });
      return;
    }

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

    try {
      const fee = parseFloat(calculateFee(withdrawalAmount));
      const netAmount = parseFloat(calculateNet(withdrawalAmount));

      // Save to Appwrite
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.withdrawalRequests,
        ID.unique(),
        {
          affiliateId: user.$id,
          amount: withdrawalAmount,
          fee,
          netAmount,
          paymentMethod,
          accountDetails,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      );

      toast({
        title: "✅ تم إرسال الطلب",
        description: `تم إرسال طلب سحب ${withdrawalAmount} ج.م بنجاح. سيتم المعالجة خلال 2-3 أيام عمل.`,
      });

      // Reset form
      setAmount("");
      setPaymentMethod("");
      setAccountDetails("");

      // Reload history
      await loadWithdrawalHistory();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: "خطأ",
        description: "فشل في إرسال الطلب. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateFee = (amount: number) => {
    // 2% fee
    return (amount * 0.02).toFixed(2);
  };

  const calculateNet = (amount: number) => {
    return (amount - parseFloat(calculateFee(amount))).toFixed(2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" /> قيد المعالجة</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> تم التحويل</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><AlertCircle className="h-3 w-3 mr-1" /> مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-green-200 shadow-lg">
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
          {/* Balance Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <p className="text-xs text-muted-foreground">الرصيد المتاح</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {availableBalance.toLocaleString()} ج.م
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <p className="text-xs text-muted-foreground">قيد المعالجة</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {pendingWithdrawals.toLocaleString()} ج.م
              </p>
            </div>
          </div>

          {!canWithdraw && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                الحد الأدنى للسحب هو {minWithdrawal} ج.م. رصيدك الحالي: {availableBalance} ج.م
              </AlertDescription>
            </Alert>
          )}

          <Separator />

          {/* Withdrawal Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">المبلغ (ج.م)</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`الحد الأدنى ${minWithdrawal} ج.م`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!canWithdraw || isSubmitting}
                min={minWithdrawal}
                max={availableBalance}
              />
            </div>

            <div>
              <Label htmlFor="payment-method">طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={!canWithdraw || isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">تحويل بنكي</SelectItem>
                  <SelectItem value="vodafone-cash">فودافون كاش</SelectItem>
                  <SelectItem value="instapay">إنستاباي</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account-details">تفاصيل الحساب</Label>
              <Input
                id="account-details"
                placeholder="رقم الحساب أو المحفظة"
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                disabled={!canWithdraw || isSubmitting}
              />
            </div>

            {amount && parseFloat(amount) >= minWithdrawal && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المبلغ المطلوب:</span>
                  <span className="font-semibold">{parseFloat(amount).toLocaleString()} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>رسوم التحويل (2%):</span>
                  <span>-{calculateFee(parseFloat(amount))} ج.م</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>المبلغ الصافي:</span>
                  <span className="text-green-600">{calculateNet(parseFloat(amount))} ج.م</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleWithdrawal}
              disabled={!canWithdraw || isSubmitting || !amount || !paymentMethod || !accountDetails}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  إرسال طلب السحب
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">سجل طلبات السحب</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : withdrawalHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>لا توجد طلبات سحب سابقة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalHistory.map((request: any) => (
                <div key={request.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{request.amount.toLocaleString()} ج.م</span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>الطريقة: {request.paymentMethod}</p>
                    <p>الصافي: {request.netAmount.toLocaleString()} ج.م</p>
                    <p>التاريخ: {new Date(request.createdAt).toLocaleDateString('ar-EG')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
