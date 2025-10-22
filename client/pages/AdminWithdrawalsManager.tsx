import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Phone,
  CreditCard,
  Upload,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, storage, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";

interface WithdrawalRequest {
  $id: string;
  userId: string;
  userName: string;
  userType: 'affiliate' | 'merchant';
  amount: number;
  method: string;
  accountDetails: string;
  phoneNumber?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  rejectionReason?: string;
  paymentProof?: string;
  transactionId?: string;
  notes?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}

export default function AdminWithdrawalsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'rejected'>('pending');
  
  // Stats
  const [totalPending, setTotalPending] = useState(0);
  const [totalProcessing, setTotalProcessing] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  
  // Process Dialog
  const [processDialog, setProcessDialog] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [processStatus, setProcessStatus] = useState<'processing' | 'completed' | 'rejected'>('processing');
  const [transactionId, setTransactionId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchWithdrawals();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [withdrawals, filter]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'withdrawalRequests',
        [
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      setWithdrawals(response.documents as any);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل طلبات السحب",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (filter === 'all') {
      setFilteredWithdrawals(withdrawals);
    } else {
      setFilteredWithdrawals(withdrawals.filter(w => w.status === filter));
    }
  };

  const calculateStats = () => {
    const pending = withdrawals.filter(w => w.status === 'pending');
    const processing = withdrawals.filter(w => w.status === 'processing');
    const completed = withdrawals.filter(w => w.status === 'completed');

    setTotalPending(pending.length);
    setTotalProcessing(processing.length);
    setTotalCompleted(completed.length);
    setTotalPendingAmount(pending.reduce((sum, w) => sum + w.amount, 0));
  };

  const openProcessDialog = (withdrawal: WithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setProcessStatus('processing');
    setTransactionId('');
    setRejectionReason('');
    setNotes('');
    setPaymentProof(null);
    setProcessDialog(true);
  };

  const handleProcess = async () => {
    if (!selectedWithdrawal) return;

    // Validation
    if (processStatus === 'completed' && !transactionId) {
      toast({
        title: "خطأ",
        description: "يجب إدخال رقم المعاملة",
        variant: "destructive",
      });
      return;
    }

    if (processStatus === 'rejected' && !rejectionReason.trim()) {
      toast({
        title: "خطأ",
        description: "يجب إدخال سبب الرفض",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload payment proof if provided
      let proofUrl = '';
      if (paymentProof) {
        try {
          const proofFile = await storage.createFile(
            'payment-proofs',
            ID.unique(),
            paymentProof
          );
          proofUrl = proofFile.$id;
        } catch (uploadError) {
          console.error('Error uploading proof:', uploadError);
        }
      }

      // Update withdrawal
      const updateData: any = {
        status: processStatus,
        processedAt: new Date().toISOString(),
        processedBy: user?.$id,
        notes: notes || ''
      };

      if (processStatus === 'completed') {
        updateData.transactionId = transactionId;
        if (proofUrl) updateData.paymentProof = proofUrl;
      } else if (processStatus === 'rejected') {
        updateData.rejectionReason = rejectionReason;
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        'withdrawalRequests',
        selectedWithdrawal.$id,
        updateData
      );

      // If completed, deduct from user balance
      if (processStatus === 'completed') {
        try {
          const userDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.users,
            selectedWithdrawal.userId
          );

          const currentBalance = (userDoc as any).totalEarnings || 0;
          const newBalance = currentBalance - selectedWithdrawal.amount;

          await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.users,
            selectedWithdrawal.userId,
            {
              totalEarnings: Math.max(0, newBalance)
            }
          );
        } catch (balanceError) {
          console.error('Error updating balance:', balanceError);
        }
      }

      // Create notification for user
      try {
        let title = '';
        let message = '';
        let type: 'success' | 'alert' | 'info' = 'info';

        if (processStatus === 'completed') {
          title = '🎉 تم تحويل المبلغ';
          message = `تم تحويل ${selectedWithdrawal.amount} ج.م إلى حسابك بنجاح`;
          type = 'success';
        } else if (processStatus === 'rejected') {
          title = '❌ تم رفض طلب السحب';
          message = `تم رفض طلب سحب ${selectedWithdrawal.amount} ج.م. السبب: ${rejectionReason}`;
          type = 'alert';
        } else {
          title = '⏳ جاري معالجة طلبك';
          message = `طلب سحب ${selectedWithdrawal.amount} ج.م قيد المعالجة`;
          type = 'info';
        }

        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.notifications || 'notifications',
          ID.unique(),
          {
            userId: selectedWithdrawal.userId,
            title,
            message,
            type,
            read: false,
            relatedId: selectedWithdrawal.$id,
            metadata: JSON.stringify({
              type: 'withdrawal_processed',
              withdrawalId: selectedWithdrawal.$id,
              status: processStatus
            })
          }
        );
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
      }

      toast({
        title: "تم بنجاح",
        description: `تم ${processStatus === 'completed' ? 'إكمال' : processStatus === 'rejected' ? 'رفض' : 'معالجة'} طلب السحب`,
      });

      setProcessDialog(false);
      fetchWithdrawals();
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "خطأ",
        description: "فشل في معالجة طلب السحب",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: '⏳ معلق' },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: '🔄 قيد المعالجة' },
      completed: { color: 'bg-green-100 text-green-800 border-green-200', label: '✅ مكتمل' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', label: '❌ مرفوض' },
    };

    const variant = variants[status] || variants.pending;
    return <Badge className={`${variant.color} border`}>{variant.label}</Badge>;
  };

  const getMethodBadge = (method: string) => {
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
        <h1 className="text-3xl font-bold mb-2">إدارة طلبات السحب</h1>
        <p className="text-muted-foreground">
          مراجعة ومعالجة طلبات سحب الأرباح للمسوقين والتجار
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
                  {totalPendingAmount.toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">قيد المعالجة</p>
                <p className="text-2xl font-bold">{totalProcessing}</p>
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
                <p className="text-sm text-muted-foreground">مكتمل</p>
                <p className="text-2xl font-bold">{totalCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{withdrawals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">الكل ({withdrawals.length})</TabsTrigger>
              <TabsTrigger value="pending">معلق ({totalPending})</TabsTrigger>
              <TabsTrigger value="processing">جاري ({totalProcessing})</TabsTrigger>
              <TabsTrigger value="completed">مكتمل ({totalCompleted})</TabsTrigger>
              <TabsTrigger value="rejected">مرفوض</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardContent className="p-6">
          {filteredWithdrawals.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">لا توجد طلبات</h3>
              <p className="text-muted-foreground">لا توجد طلبات سحب في هذه الحالة</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>المبلغ</TableHead>
                    <TableHead>طريقة السحب</TableHead>
                    <TableHead>تفاصيل الحساب</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead className="text-left">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.$id}>
                      <TableCell>
                        <div className="font-medium">{withdrawal.userName}</div>
                        <div className="text-xs text-muted-foreground">{withdrawal.userId.slice(0, 8)}...</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {withdrawal.userType === 'affiliate' ? '💰 مسوق' : '🏪 تاجر'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-lg">{withdrawal.amount.toFixed(2)} ج.م</span>
                      </TableCell>
                      <TableCell>{getMethodBadge(withdrawal.method)}</TableCell>
                      <TableCell>
                        <div className="text-sm max-w-[200px] truncate">
                          {withdrawal.phoneNumber && <div>📱 {withdrawal.phoneNumber}</div>}
                          {withdrawal.bankName && <div>🏦 {withdrawal.bankName}</div>}
                          {withdrawal.accountNumber && <div className="text-xs text-muted-foreground">{withdrawal.accountNumber}</div>}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(withdrawal.createdAt).toLocaleDateString('ar-EG')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => openProcessDialog(withdrawal)}
                          disabled={withdrawal.status === 'completed' || withdrawal.status === 'rejected'}
                        >
                          {withdrawal.status === 'pending' ? 'معالجة' : withdrawal.status === 'processing' ? 'إكمال' : 'عرض'}
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

      {/* Process Dialog */}
      <Dialog open={processDialog} onOpenChange={setProcessDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>معالجة طلب السحب</DialogTitle>
            <DialogDescription>
              {selectedWithdrawal && `${selectedWithdrawal.userName} - ${selectedWithdrawal.amount.toFixed(2)} ج.م`}
            </DialogDescription>
          </DialogHeader>

          {selectedWithdrawal && (
            <div className="space-y-4">
              {/* Withdrawal Details */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">المستخدم</Label>
                      <p className="font-medium">{selectedWithdrawal.userName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">النوع</Label>
                      <p className="font-medium">
                        {selectedWithdrawal.userType === 'affiliate' ? 'مسوق' : 'تاجر'}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">المبلغ</Label>
                      <p className="font-bold text-lg">{selectedWithdrawal.amount.toFixed(2)} ج.م</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">طريقة السحب</Label>
                      <p className="font-medium">{getMethodBadge(selectedWithdrawal.method)}</p>
                    </div>
                    {selectedWithdrawal.phoneNumber && (
                      <div>
                        <Label className="text-muted-foreground">رقم الهاتف</Label>
                        <p className="font-medium">{selectedWithdrawal.phoneNumber}</p>
                      </div>
                    )}
                    {selectedWithdrawal.bankName && (
                      <div>
                        <Label className="text-muted-foreground">البنك</Label>
                        <p className="font-medium">{selectedWithdrawal.bankName}</p>
                      </div>
                    )}
                    {selectedWithdrawal.accountNumber && (
                      <div>
                        <Label className="text-muted-foreground">رقم الحساب</Label>
                        <p className="font-medium font-mono">{selectedWithdrawal.accountNumber}</p>
                      </div>
                    )}
                    {selectedWithdrawal.accountHolder && (
                      <div>
                        <Label className="text-muted-foreground">صاحب الحساب</Label>
                        <p className="font-medium">{selectedWithdrawal.accountHolder}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Status Selection */}
              <div>
                <Label>حالة الطلب</Label>
                <Select value={processStatus} onValueChange={(v: any) => setProcessStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">🔄 جاري المعالجة</SelectItem>
                    <SelectItem value="completed">✅ مكتمل</SelectItem>
                    <SelectItem value="rejected">❌ مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transaction ID (if completed) */}
              {processStatus === 'completed' && (
                <div>
                  <Label>رقم المعاملة *</Label>
                  <Input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="أدخل رقم المعاملة"
                  />
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {processStatus === 'rejected' && (
                <div>
                  <Label>سبب الرفض *</Label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="أدخل سبب رفض الطلب"
                    rows={3}
                  />
                </div>
              )}

              {/* Payment Proof Upload */}
              {processStatus === 'completed' && (
                <div>
                  <Label>إثبات الدفع (اختياري)</Label>
                  <Input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <Label>ملاحظات (اختياري)</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف أي ملاحظات إضافية"
                  rows={2}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessDialog(false)} disabled={uploading}>
              إلغاء
            </Button>
            <Button onClick={handleProcess} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              تأكيد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
