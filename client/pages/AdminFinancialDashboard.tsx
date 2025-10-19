import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  TrendingUp,
  Users,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Image as ImageIcon,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

interface Commission {
  $id: string;
  affiliateId: string;
  affiliateName: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
  paidAt?: string;
}

interface MerchantPayment {
  $id: string;
  merchantId: string;
  merchantName: string;
  orderId: string;
  totalAmount: number;
  commissionAmount: number;
  platformFee: number;
  transferProof?: string;
  status: 'pending' | 'verified' | 'completed';
  createdAt: string;
}

interface WithdrawalRequest {
  $id: string;
  userId: string;
  userName: string;
  userType: 'affiliate' | 'merchant';
  amount: number;
  method: 'vodafone' | 'instapay';
  accountDetails: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
}

export default function AdminFinancialDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Financial Stats
  const [platformEarnings, setPlatformEarnings] = useState(0);
  const [pendingAffiliatePayments, setPendingAffiliatePayments] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [totalMerchantPayments, setTotalMerchantPayments] = useState(0);
  
  // Data
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [merchantPayments, setMerchantPayments] = useState<MerchantPayment[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  
  // Dialog States
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [paymentProof, setPaymentProof] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Fetch commissions
      const commissionsData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'commissions',
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      
      // Fetch merchant payments
      const paymentsData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'merchantPayments',
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      
      // Fetch withdrawal requests
      const withdrawalsData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'withdrawalRequests',
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );

      setCommissions(commissionsData.documents as any);
      setMerchantPayments(paymentsData.documents as any);
      setWithdrawalRequests(withdrawalsData.documents as any);

      // Calculate stats
      calculateStats(commissionsData.documents, paymentsData.documents);
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast({
        title: "خطأ",
        description: "فشل تحميل البيانات المالية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (commissions: any[], payments: any[]) => {
    // Platform earnings (from merchant payments)
    const platformTotal = payments
      .filter(p => p.status === 'verified' || p.status === 'completed')
      .reduce((sum, p) => sum + (p.platformFee || 0), 0);
    setPlatformEarnings(platformTotal);

    // Pending affiliate payments
    const pendingAffiliate = commissions
      .filter(c => c.status === 'approved')
      .reduce((sum, c) => sum + c.amount, 0);
    setPendingAffiliatePayments(pendingAffiliate);

    // Total commissions
    const totalComm = commissions.reduce((sum, c) => sum + c.amount, 0);
    setTotalCommissions(totalComm);

    // Total merchant payments
    const totalMerch = payments.reduce((sum, p) => sum + p.totalAmount, 0);
    setTotalMerchantPayments(totalMerch);
  };

  const handlePayCommission = async () => {
    if (!selectedCommission) return;

    try {
      await databases.updateDocument(
        '68d8b9db00134c41e7c8',
        'commissions',
        selectedCommission.$id,
        {
          status: 'paid',
          paidAt: new Date().toISOString(),
          paymentProof,
          paymentNotes,
        }
      );

      toast({
        title: "تم الدفع",
        description: "تم تسجيل دفع العمولة بنجاح",
      });

      setPaymentDialog(false);
      fetchFinancialData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل تسجيل الدفع",
        variant: "destructive",
      });
    }
  };

  const handleVerifyMerchantPayment = async (paymentId: string) => {
    try {
      await databases.updateDocument(
        '68d8b9db00134c41e7c8',
        'merchantPayments',
        paymentId,
        {
          status: 'verified',
          verifiedAt: new Date().toISOString(),
        }
      );

      toast({
        title: "تم التحقق",
        description: "تم التحقق من دفع التاجر بنجاح",
      });

      fetchFinancialData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل التحقق من الدفع",
        variant: "destructive",
      });
    }
  };

  const handleProcessWithdrawal = async (requestId: string, status: 'completed' | 'rejected') => {
    try {
      await databases.updateDocument(
        '68d8b9db00134c41e7c8',
        'withdrawalRequests',
        requestId,
        {
          status,
          processedAt: new Date().toISOString(),
        }
      );

      toast({
        title: status === 'completed' ? "تم السحب" : "تم الرفض",
        description: status === 'completed' ? "تم معالجة طلب السحب" : "تم رفض طلب السحب",
      });

      fetchFinancialData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل معالجة الطلب",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم المالية</h1>
          <p className="text-muted-foreground">إدارة العمولات والمدفوعات</p>
        </div>

        {/* Financial Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">أرباح المنصة</CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {platformEarnings.toFixed(2)} ج.م
              </div>
              <p className="text-xs text-muted-foreground">
                الأرباح الصافية للمنصة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مستحقات المسوقين</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {pendingAffiliatePayments.toFixed(2)} ج.م
              </div>
              <p className="text-xs text-muted-foreground">
                يجب تحويلها للمسوقين
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي العمولات</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalCommissions.toFixed(2)} ج.م
              </div>
              <p className="text-xs text-muted-foreground">
                جميع العمولات المسجلة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مدفوعات التجار</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalMerchantPayments.toFixed(2)} ج.م
              </div>
              <p className="text-xs text-muted-foreground">
                إجمالي مدفوعات التجار
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              طرق التحويل المتاحة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">فودافون كاش</Badge>
              <span className="font-mono">01034324551</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">إنستا باي</Badge>
              <span className="font-mono">ebank_hema@instapay</span>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="commissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="commissions">عمولات المسوقين</TabsTrigger>
            <TabsTrigger value="merchant-payments">مدفوعات التجار</TabsTrigger>
            <TabsTrigger value="withdrawals">طلبات السحب</TabsTrigger>
          </TabsList>

          {/* Commissions Tab */}
          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>عمولات المسوقين</CardTitle>
                <CardDescription>
                  إدارة ودفع عمولات المسوقين
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المسوق</TableHead>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.$id}>
                        <TableCell className="font-medium">
                          {commission.affiliateName}
                        </TableCell>
                        <TableCell>{commission.orderId}</TableCell>
                        <TableCell className="font-bold text-green-600">
                          {commission.amount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            commission.status === 'paid' ? 'default' :
                            commission.status === 'approved' ? 'secondary' :
                            'outline'
                          }>
                            {commission.status === 'paid' ? 'مدفوعة' :
                             commission.status === 'approved' ? 'موافق عليها' :
                             'قيد الانتظار'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(commission.createdAt).toLocaleDateString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          {commission.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCommission(commission);
                                setPaymentDialog(true);
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              دفع
                            </Button>
                          )}
                          {commission.status === 'paid' && (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              تم الدفع
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Merchant Payments Tab */}
          <TabsContent value="merchant-payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>مدفوعات التجار</CardTitle>
                <CardDescription>
                  التحقق من مدفوعات التجار للعمولات ورسوم المنصة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاجر</TableHead>
                      <TableHead>رقم الطلب</TableHead>
                      <TableHead>المبلغ الكلي</TableHead>
                      <TableHead>عمولة المسوق</TableHead>
                      <TableHead>رسوم المنصة</TableHead>
                      <TableHead>إثبات التحويل</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchantPayments.map((payment) => (
                      <TableRow key={payment.$id}>
                        <TableCell className="font-medium">
                          {payment.merchantName}
                        </TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>{payment.totalAmount.toFixed(2)} ج.م</TableCell>
                        <TableCell className="text-orange-600">
                          {payment.commissionAmount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-green-600 font-bold">
                          {payment.platformFee.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          {payment.transferProof ? (
                            <Button variant="outline" size="sm" asChild>
                              <a href={payment.transferProof} target="_blank" rel="noopener noreferrer">
                                <ImageIcon className="h-4 w-4 mr-2" />
                                عرض
                              </a>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">لا يوجد</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            payment.status === 'verified' ? 'default' :
                            payment.status === 'completed' ? 'secondary' :
                            'outline'
                          }>
                            {payment.status === 'verified' ? 'تم التحقق' :
                             payment.status === 'completed' ? 'مكتمل' :
                             'قيد المراجعة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => handleVerifyMerchantPayment(payment.$id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              تحقق
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
                  معالجة طلبات سحب الأرباح
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الطريقة</TableHead>
                      <TableHead>تفاصيل الحساب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalRequests.map((request) => (
                      <TableRow key={request.$id}>
                        <TableCell className="font-medium">
                          {request.userName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {request.userType === 'affiliate' ? 'مسوق' : 'تاجر'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">
                          {request.amount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          {request.method === 'vodafone' ? 'فودافون كاش' : 'إنستا باي'}
                        </TableCell>
                        <TableCell className="font-mono">
                          {request.accountDetails}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'completed' ? 'default' :
                            request.status === 'processing' ? 'secondary' :
                            request.status === 'rejected' ? 'destructive' :
                            'outline'
                          }>
                            {request.status === 'completed' ? 'مكتمل' :
                             request.status === 'processing' ? 'قيد المعالجة' :
                             request.status === 'rejected' ? 'مرفوض' :
                             'قيد الانتظار'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleProcessWithdrawal(request.$id, 'completed')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                قبول
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleProcessWithdrawal(request.$id, 'rejected')}
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                رفض
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تسجيل دفع العمولة</DialogTitle>
              <DialogDescription>
                سجل تفاصيل الدفع للمسوق
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>المسوق</Label>
                <Input value={selectedCommission?.affiliateName || ''} disabled />
              </div>
              <div>
                <Label>المبلغ</Label>
                <Input value={`${selectedCommission?.amount.toFixed(2)} ج.م` || ''} disabled />
              </div>
              <div>
                <Label>رابط إثبات التحويل (اختياري)</Label>
                <Input
                  placeholder="https://..."
                  value={paymentProof}
                  onChange={(e) => setPaymentProof(e.target.value)}
                />
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea
                  placeholder="تفاصيل إضافية..."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentDialog(false)}>
                إلغاء
              </Button>
              <Button onClick={handlePayCommission}>
                <CheckCircle className="h-4 w-4 mr-2" />
                تأكيد الدفع
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
