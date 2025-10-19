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
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, storage } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

interface Order {
  $id: string;
  orderId: string;
  totalAmount: number;
  commissionAmount: number;
  platformFee: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'unpaid' | 'pending_verification' | 'verified';
  createdAt: string;
  deliveredAt?: string;
}

interface PaymentSubmission {
  $id: string;
  orderId: string;
  totalAmount: number;
  commissionAmount: number;
  platformFee: number;
  transferProof: string;
  notes?: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
}

export default function MerchantFinancialHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [totalSales, setTotalSales] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [totalPlatformFees, setTotalPlatformFees] = useState(0);
  
  // Data
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  
  // Payment Dialog
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [transferProof, setTransferProof] = useState<File | null>(null);
  const [paymentNotes, setPaymentNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user]);

  const fetchFinancialData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch orders
      const ordersData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'orders',
        [
          Query.equal('merchantId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      // Fetch payment submissions
      const paymentsData = await databases.listDocuments(
        '68d8b9db00134c41e7c8',
        'merchantPayments',
        [
          Query.equal('merchantId', user.$id),
          Query.orderDesc('$createdAt'),
          Query.limit(50)
        ]
      );

      setOrders(ordersData.documents as any);
      setPayments(paymentsData.documents as any);

      // Calculate stats
      calculateStats(ordersData.documents);
      
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

  const calculateStats = (orders: any[]) => {
    // Total sales (delivered orders)
    const sales = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    setTotalSales(sales);

    // Pending payments (delivered but not paid)
    const pending = orders
      .filter(o => o.status === 'delivered' && o.paymentStatus === 'unpaid')
      .reduce((sum, o) => sum + (o.commissionAmount + o.platformFee), 0);
    setPendingPayments(pending);

    // Total commissions to pay
    const commissions = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.commissionAmount, 0);
    setTotalCommissions(commissions);

    // Total platform fees to pay
    const fees = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.platformFee, 0);
    setTotalPlatformFees(fees);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTransferProof(e.target.files[0]);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedOrder || !transferProof) {
      toast({
        title: "خطأ",
        description: "الرجاء رفع صورة إثبات التحويل",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload proof image
      const fileUpload = await storage.createFile(
        'payment-proofs',
        ID.unique(),
        transferProof
      );

      const fileUrl = storage.getFileView('payment-proofs', fileUpload.$id).toString();

      // Create payment submission
      await databases.createDocument(
        '68d8b9db00134c41e7c8',
        'merchantPayments',
        ID.unique(),
        {
          merchantId: user.$id,
          merchantName: user.name,
          orderId: selectedOrder.orderId,
          totalAmount: selectedOrder.totalAmount,
          commissionAmount: selectedOrder.commissionAmount,
          platformFee: selectedOrder.platformFee,
          transferProof: fileUrl,
          notes: paymentNotes,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
      );

      // Update order payment status
      await databases.updateDocument(
        '68d8b9db00134c41e7c8',
        'orders',
        selectedOrder.$id,
        {
          paymentStatus: 'pending_verification',
        }
      );

      toast({
        title: "تم الإرسال",
        description: "تم إرسال إثبات الدفع بنجاح. سيتم المراجعة قريباً.",
      });

      setPaymentDialog(false);
      setTransferProof(null);
      setPaymentNotes("");
      fetchFinancialData();
      
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast({
        title: "خطأ",
        description: "فشل إرسال إثبات الدفع",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">السجل المالي</h1>
        <p className="text-muted-foreground">إدارة المبيعات والمدفوعات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalSales.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              الطلبات المكتملة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مدفوعات معلقة</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingPayments.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              يجب دفعها للمنصة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عمولات المسوقين</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCommissions.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي العمولات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رسوم المنصة</CardTitle>
            <Wallet className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalPlatformFees.toFixed(2)} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              إجمالي الرسوم
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            طرق الدفع المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-sm font-medium mb-2">بعد تسليم الطلب، قم بتحويل العمولات والرسوم إلى:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline">فودافون كاش</Badge>
                <span className="font-mono">01034324551</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">إنستا باي</Badge>
                <span className="font-mono">ebank_hema@instapay</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ يجب رفع صورة إثبات التحويل بعد الدفع
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">الطلبات المكتملة</TabsTrigger>
          <TabsTrigger value="payments">سجل المدفوعات</TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الطلبات المكتملة</CardTitle>
              <CardDescription>
                الطلبات التي تم تسليمها وتحتاج لدفع العمولات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>المبلغ الكلي</TableHead>
                    <TableHead>عمولة المسوق</TableHead>
                    <TableHead>رسوم المنصة</TableHead>
                    <TableHead>الإجمالي المستحق</TableHead>
                    <TableHead>حالة الدفع</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter(o => o.status === 'delivered').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        لا توجد طلبات مكتملة
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.filter(o => o.status === 'delivered').map((order) => (
                      <TableRow key={order.$id}>
                        <TableCell className="font-mono">
                          {order.orderId}
                        </TableCell>
                        <TableCell className="font-bold">
                          {order.totalAmount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {order.commissionAmount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-purple-600">
                          {order.platformFee.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="font-bold text-orange-600">
                          {(order.commissionAmount + order.platformFee).toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            order.paymentStatus === 'verified' ? 'default' :
                            order.paymentStatus === 'pending_verification' ? 'secondary' :
                            'destructive'
                          }>
                            {order.paymentStatus === 'verified' ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> تم التحقق</>
                            ) : order.paymentStatus === 'pending_verification' ? (
                              <><Clock className="h-3 w-3 mr-1" /> قيد المراجعة</>
                            ) : (
                              <><AlertCircle className="h-3 w-3 mr-1" /> لم يتم الدفع</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.paymentStatus === 'unpaid' && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setPaymentDialog(true);
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              رفع إثبات
                            </Button>
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

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل المدفوعات</CardTitle>
              <CardDescription>
                جميع إثباتات الدفع المرسلة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الطلب</TableHead>
                    <TableHead>المبلغ الكلي</TableHead>
                    <TableHead>عمولة المسوق</TableHead>
                    <TableHead>رسوم المنصة</TableHead>
                    <TableHead>إثبات التحويل</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        لا توجد مدفوعات مسجلة
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.$id}>
                        <TableCell className="font-mono">
                          {payment.orderId}
                        </TableCell>
                        <TableCell>
                          {payment.totalAmount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-blue-600">
                          {payment.commissionAmount.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell className="text-purple-600">
                          {payment.platformFee.toFixed(2)} ج.م
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <a href={payment.transferProof} target="_blank" rel="noopener noreferrer">
                              عرض الصورة
                            </a>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            payment.status === 'verified' ? 'default' :
                            payment.status === 'rejected' ? 'destructive' :
                            'secondary'
                          }>
                            {payment.status === 'verified' ? 'تم التحقق' :
                             payment.status === 'rejected' ? 'مرفوض' :
                             'قيد المراجعة'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(payment.createdAt).toLocaleDateString('ar-EG')}
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

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>رفع إثبات الدفع</DialogTitle>
            <DialogDescription>
              قم برفع صورة إثبات التحويل للعمولات ورسوم المنصة
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">تفاصيل الدفع:</p>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>عمولة المسوق:</span>
                  <span className="font-bold text-blue-600">
                    {selectedOrder?.commissionAmount.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>رسوم المنصة:</span>
                  <span className="font-bold text-purple-600">
                    {selectedOrder?.platformFee.toFixed(2)} ج.م
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-bold text-orange-600">
                    {((selectedOrder?.commissionAmount || 0) + (selectedOrder?.platformFee || 0)).toFixed(2)} ج.م
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Label>صورة إثبات التحويل *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                صورة واضحة لإيصال التحويل
              </p>
            </div>
            <div>
              <Label>ملاحظات (اختياري)</Label>
              <Textarea
                placeholder="أي ملاحظات إضافية..."
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialog(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmitPayment} disabled={!transferProof || uploading}>
              {uploading ? (
                <>جاري الرفع...</>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  رفع الإثبات
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
