import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

interface Commission {
  $id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  paidAt?: string;
  orderDetails?: any;
}

interface WithdrawalRequest {
  $id: string;
  amount: number;
  method: 'vodafone' | 'instapay';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
  rejectionReason?: string;
}

export default function AffiliateEarningsHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  
  // Data
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  
  // Withdrawal Dialog
  const [withdrawalDialog, setWithdrawalDialog] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState<'vodafone' | 'instapay'>('vodafone');
  const [accountDetails, setAccountDetails] = useState("");

  useEffect(() => {
    if (user) {
      fetchEarningsData();
    }
  }, [user]);

  const fetchEarningsData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch commissions
      const commissionsData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'commissions',
        [
          Query.equal('affiliateId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      // Fetch withdrawal requests
      const withdrawalsData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'withdrawalRequests',
        [
          Query.equal('userId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      setCommissions(commissionsData.documents as any);
      setWithdrawals(withdrawalsData.documents as any);

      // Calculate stats
      calculateStats(commissionsData.documents, withdrawalsData.documents);
      
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      toast({
        title: "خطأ",
        description: "فشل تحميل بيانات الأرباح",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (commissions: any[], withdrawals: any[]) => {
    // Total earnings (all paid commissions)
    const total = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
    setTotalEarnings(total);

    // Pending earnings (approved but not paid)
    const pending = commissions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.amount, 0);
    setPendingEarnings(pending);

    // Withdrawn amount (completed withdrawals)
    const withdrawn = withdrawals
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0);
    setWithdrawnAmount(withdrawn);

    // Available balance
    const available = total - withdrawn;
    setAvailableBalance(available);
  };

  const handleWithdrawalRequest = async () => {
    if (!user) return;

    const amount = parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال مبلغ صحيح",
        variant: "destructive",
      });
      return;
    }

    if (amount > availableBalance) {
      toast({
        title: "خطأ",
        description: "المبلغ المطلوب أكبر من الرصيد المتاح",
        variant: "destructive",
      });
      return;
    }

    if (!accountDetails) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال تفاصيل الحساب",
        variant: "destructive",
      });
      return;
    }

    try {
      await databases.createDocument(
        '68d8b9db00134c41e7c8',
        'withdrawalRequests',
        'unique()',
        {
          userId: user.$id,
          userName: user.name,
          userType: 'affiliate',
          amount,
          method: withdrawalMethod,
          accountDetails,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      );

      toast({
        title: "تم الإرسال",
        description: "تم إرسال طلب السحب بنجاح. سيتم المراجعة قريباً.",
      });

      setWithdrawalDialog(false);
      setWithdrawalAmount("");
      setAccountDetails("");
      fetchEarningsData();
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل إرسال طلب السحب",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">سجل الأرباح والعمولات</h1>
        <p className="text-muted-foreground">تتبع أرباحك وطلبات السحب</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الأرباح</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalEarnings.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              جميع العمولات المدفوعة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرصيد المتاح</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {availableBalance.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              متاح للسحب
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingEarnings.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              في انتظار الدفع
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم السحب</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {withdrawnAmount.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              المبالغ المسحوبة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Button */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">سحب الأرباح</h3>
              <p className="text-sm text-muted-foreground">
                الرصيد المتاح: <span className="font-bold text-green-600">{availableBalance.toFixed(2)} ج.م</span>
              </p>
            </div>
            <Dialog open={withdrawalDialog} onOpenChange={setWithdrawalDialog}>
              <DialogTrigger asChild>
                <Button size="lg" disabled={availableBalance <= 0}>
                  <Download className="h-4 w-4 mr-2" />
                  طلب سحب
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>طلب سحب الأرباح</DialogTitle>
                  <DialogDescription>
                    اختر طريقة السحب وأدخل التفاصيل
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>المبلغ</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      الحد الأقصى: {availableBalance.toFixed(2)} ج.م
                    </p>
                  </div>
                  <div>
                    <Label>طريقة السحب</Label>
                    <Select value={withdrawalMethod} onValueChange={(v: any) => setWithdrawalMethod(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vodafone">فودافون كاش</SelectItem>
                        <SelectItem value="instapay">إنستا باي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      {withdrawalMethod === 'vodafone' ? 'رقم الهاتف' : 'عنوان إنستا باي'}
                    </Label>
                    <Input
                      placeholder={withdrawalMethod === 'vodafone' ? '01xxxxxxxxx' : 'username@instapay'}
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setWithdrawalDialog(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleWithdrawalRequest}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    إرسال الطلب
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commissions">سجل العمولات</TabsTrigger>
          <TabsTrigger value="withdrawals">طلبات السحب</TabsTrigger>
        </TabsList>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل العمولات</CardTitle>
              <CardDescription>
                جميع العمولات المكتسبة من الطلبات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>تاريخ الدفع</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        لا توجد عمولات بعد
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissions.map((commission) => (
                      <TableRow key={commission.$id}>
                        <TableCell className="font-mono">
                          {commission.orderId}
                        </TableCell>
                        <TableCell className="font-bold text-green-600">
                          {commission.amount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            commission.status === 'paid' ? 'default' :
                            commission.status === 'approved' ? 'secondary' :
                            'outline'
                          }>
                            {commission.status === 'paid' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> مدفوعة</>
                            ) : commission.status === 'approved' ? (
                              <><Clock className="h-3 w-3 mr-1" /> موافق عليها</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> قيد الانتظار</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(commission.createdAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          {commission.paidAt ? (
                            new Date(commission.paidAt).toLocaleDateString('ar-EG')
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>طلبات السحب</CardTitle>
              <CardDescription>
                سجل طلبات سحب الأرباح
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>الطريقة</TableHead>
                    <TableHead>تفاصيل الحساب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>تاريخ الطلب</TableHead>
                    <TableHead>تاريخ المعالجة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        لا توجد طلبات سحب
                      </TableCell>
                    </TableRow>
                  ) : (
                    withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.$id}>
                        <TableCell className="font-bold">
                          {withdrawal.amount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          {withdrawal.method === 'vodafone' ? 'فودافون كاش' : 'إنستا باي'}
                        </TableCell>
                        <TableCell className="font-mono">
                          {withdrawal.accountDetails}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            withdrawal.status === 'completed' ? 'default' :
                            withdrawal.status === 'processing' ? 'secondary' :
                            withdrawal.status === 'rejected' ? 'destructive' :
                            'outline'
                          }>
                            {withdrawal.status === 'completed' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> مكتمل</>
                            ) : withdrawal.status === 'processing' ? (
                              <><Clock className="h-3 w-3 mr-1" /> قيد المعالجة</>
                            ) : withdrawal.status === 'rejected' ? (
                              <><XCircle className="h-3 w-3 mr-1" /> مرفوض</>
                            ) : (
                              <><Clock className="h-3 w-3 mr-1" /> قيد الانتظار</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(withdrawal.createdAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          {withdrawal.processedAt ? (
                            new Date(withdrawal.processedAt).toLocaleDateString('ar-EG')
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
