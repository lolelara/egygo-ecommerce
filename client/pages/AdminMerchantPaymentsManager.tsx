import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Eye,
  DollarSign,
  TrendingUp,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

interface MerchantPayment {
  $id: string;
  merchantId: string;
  merchantName: string;
  orderId: string;
  totalAmount: number;
  commissionAmount: number;
  platformFee: number;
  transferProof?: string;
  notes?: string;
  status: 'pending' | 'verified' | 'completed' | 'rejected';
  paymentMethod?: string;
  accountDetails?: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export default function AdminMerchantPaymentsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<MerchantPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<MerchantPayment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  // Stats
  const [totalPending, setTotalPending] = useState(0);
  const [totalVerified, setTotalVerified] = useState(0);
  const [totalPlatformRevenue, setTotalPlatformRevenue] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);

  // Verify Dialog
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<MerchantPayment | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'verified' | 'rejected'>('verified');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Image Dialog
  const [imageDialog, setImageDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPayments();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [payments, filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'merchantPayments',
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      setPayments(response.documents as any);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل المدفوعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filter === 'all') {
      setFilteredPayments(payments);
    } else {
      setFilteredPayments(payments.filter(p => p.status === filter));
    }
  };

  const calculateStats = () => {
    const pending = payments.filter(p => p.status === 'pending');
    const verified = payments.filter(p => p.status === 'verified');

    setTotalPending(pending.length);
    setTotalVerified(verified.length);
    setTotalPlatformRevenue(verified.reduce((sum, p) => sum + p.platformFee, 0));
    setPendingAmount(pending.reduce((sum, p) => sum + p.platformFee, 0));
  };

  const openVerifyDialog = (payment: MerchantPayment) => {
    setSelectedPayment(payment);
    setVerifyStatus('verified');
    setVerifyNotes('');
    setVerifyDialog(true);
  };

  const handleVerify = async () => {
    if (!selectedPayment) return;

    try {
      setProcessing(true);

      await databases.updateDocument(
        appwriteConfig.databaseId,
        'merchantPayments',
        selectedPayment.$id,
        {
          status: verifyStatus,
          verifiedAt: new Date().toISOString(),
          verifiedBy: user?.$id,
          notes: verifyNotes
        }
      );

      // Create notification for merchant
      try {
        const message = verifyStatus === 'verified'
          ? `تم التحقق من دفعتك بمبلغ ${selectedPayment.totalAmount} ج.م للطلب ${selectedPayment.orderId}`
          : `تم رفض دفعتك للطلب ${selectedPayment.orderId}. السبب: ${verifyNotes}`;

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.notifications || 'notifications',
          ID.unique(),
          {
            userId: selectedPayment.merchantId,
            title: verifyStatus === 'verified' ? '✅ تم التحقق من الدفع' : '❌ تم رفض الدفع',
            message,
            type: verifyStatus === 'verified' ? 'success' : 'alert',
            read: false,
            relatedId: selectedPayment.$id,
            metadata: JSON.stringify({
              type: 'payment_verification',
              paymentId: selectedPayment.$id,
              status: verifyStatus
            })
          }
        );
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }

      toast({
        title: "تم بنجاح",
        description: `تم ${verifyStatus === 'verified' ? 'التحقق من' : 'رفض'} الدفع`,
      });

      setVerifyDialog(false);
      fetchPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "خطأ",
        description: "فشل في معالجة الدفع",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const viewProof = (proofId: string) => {
    const proofUrl = `${appwriteConfig.endpoint}/storage/buckets/payment-proofs/files/${proofId}/view?project=${appwriteConfig.projectId}`;
    setSelectedImage(proofUrl);
    setImageDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: '⏳ معلق' },
      verified: { color: 'bg-green-100 text-green-800 border-green-200', label: '✅ تم التحقق' },
      completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: '🎉 مكتمل' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: '❌ مرفوض' },
    };

    const variant = variants[status] || variants.pending;
    return <Badge className={`${variant.color} border`}>{variant.label}</Badge>;
  };

  const getMethodBadge = (method?: string) => {
    if (!method) return <span className="text-sm text-muted-foreground">غير محدد</span>;

    const methods: Record<string, { icon: string; label: string }> = {
      vodafone: { icon: '📱', label: 'Vodafone Cash' },
      instapay: { icon: '💳', label: 'InstaPay' },
      bank: { icon: '🏦', label: 'تحويل بنكي' },
      fawry: { icon: '🟢', label: 'فوري' },
    };

    const m = methods[method] || { icon: '💰', label: method };
    return <span className="text-sm">{m.icon} {m.label}</span>;
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">غير مصرح</h3>
            <p className="text-muted-foreground">هذه الصفحة متاحة للأدمن فقط</p>
          </CardContent>
        </Card>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">إدارة مدفوعات التجار</h1>
        <p className="text-muted-foreground">
          مراجعة والتحقق من مدفوعات التجار للمنصة
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">معلق</p>
                <p className="text-2xl font-bold">{totalPending}</p>
                <p className="text-xs text-muted-foreground">
                  {pendingAmount.toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تم التحقق</p>
                <p className="text-2xl font-bold">{totalVerified}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إيرادات المنصة</p>
                <p className="text-2xl font-bold">{totalPlatformRevenue.toFixed(2)} ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المدفوعات</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل ({payments.length})</TabsTrigger>
              <TabsTrigger value="pending">معلق ({totalPending})</TabsTrigger>
              <TabsTrigger value="verified">تم التحقق ({totalVerified})</TabsTrigger>
              <TabsTrigger value="rejected">مرفوض</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد مدفوعات</h3>
              <p className="text-muted-foreground">لا توجد مدفوعات في هذه الحالة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاجر</TableHead>
                    <TableHead>الطلب</TableHead>
                    <TableHead>المبلغ الكلي</TableHead>
                    <TableHead>رسوم المنصة</TableHead>
                    <TableHead>طريقة الدفع</TableHead>
                    <TableHead>إثبات الدفع</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.$id}>
                      <TableCell>
                        <div className="font-medium">{payment.merchantName}</div>
                        <div className="text-xs text-muted-foreground">{payment.merchantId.slice(0, 8)}...</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{payment.orderId}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold">{payment.totalAmount.toFixed(2)} ج.م</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-green-600">{payment.platformFee.toFixed(2)} ج.م</span>
                      </TableCell>
                      <TableCell>{getMethodBadge(payment.paymentMethod)}</TableCell>
                      <TableCell>
                        {payment.transferProof ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewProof(payment.transferProof!)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> عرض
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">لا يوجد</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(payment.createdAt).toLocaleDateString('ar-EG')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => openVerifyDialog(payment)}
                          disabled={payment.status === 'verified' || payment.status === 'rejected'}
                        >
                          {payment.status === 'pending' ? 'مراجعة' : 'عرض'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verify Dialog */}
      <Dialog open={verifyDialog} onOpenChange={setVerifyDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مراجعة الدفع</DialogTitle>
            <DialogDescription>
              {selectedPayment && `${selectedPayment.merchantName} - ${selectedPayment.totalAmount.toFixed(2)} ج.م`}
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Payment Details */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">التاجر</Label>
                      <p className="font-medium">{selectedPayment.merchantName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">رقم الطلب</Label>
                      <p className="font-mono">{selectedPayment.orderId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">المبلغ الإجمالي</Label>
                      <p className="font-bold text-lg">{selectedPayment.totalAmount.toFixed(2)} ج.م</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">رسوم المنصة</Label>
                      <p className="font-bold text-lg text-green-600">{selectedPayment.platformFee.toFixed(2)} ج.م</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">عمولة المسوق</Label>
                      <p className="font-medium">{selectedPayment.commissionAmount.toFixed(2)} ج.م</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">طريقة الدفع</Label>
                      <p className="font-medium">{getMethodBadge(selectedPayment.paymentMethod)}</p>
                    </div>
                  </div>
                  {selectedPayment.accountDetails && (
                    <div>
                      <Label className="text-muted-foreground">تفاصيل الحساب</Label>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {selectedPayment.accountDetails}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Selection */}
              <div>
                <Label>حالة الدفع</Label>
                <Select value={verifyStatus} onValueChange={(v: any) => setVerifyStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verified">✅ تم التحقق</SelectItem>
                    <SelectItem value="rejected">❌ مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <Label>ملاحظات {verifyStatus === 'rejected' ? '(يجب ذكر سبب الرفض)' : '(اختياري)'}</Label>
                <Textarea
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder={verifyStatus === 'rejected' ? 'أدخل سبب رفض الدفع' : 'أضف أي ملاحظات إضافية'}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialog(false)} disabled={processing}>
              إلغاء
            </Button>
            <Button onClick={handleVerify} disabled={processing || (verifyStatus === 'rejected' && !verifyNotes.trim())}>
              {processing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialog} onOpenChange={setImageDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>إثبات الدفع</DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto">
            <img src={selectedImage} alt="Payment Proof" className="w-full h-auto rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
