import { useState, useEffect } from "react";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2, 
  PlayCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/storage";

interface Product {
  $id?: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  verificationVideo?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  merchantId: string;
  merchantName?: string;
  categoryId: string;
  stock: number;
  createdAt?: string;
}

type ApprovalAction = 'approve' | 'reject';

export default function AdminProductApproval() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<ApprovalAction>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, [filterStatus]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
      
      if (filterStatus !== 'all') {
        queries.push(Query.equal('approvalStatus', filterStatus));
      }

      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        queries
      );

      // Load merchant names
      const productsWithMerchants = await Promise.all(
        response.documents.map(async (doc: any) => {
          try {
            const merchantDoc = await databases.getDocument(
              appwriteConfig.databaseId,
              appwriteConfig.collections.users,
              doc.merchantId
            );
            return {
              ...doc,
              merchantName: merchantDoc.name || merchantDoc.email
            };
          } catch {
            return { ...doc, merchantName: 'غير معروف' };
          }
        })
      );

      setProducts(productsWithMerchants as Product[]);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "خطأ",
        description: "فشل تحميل المنتجات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openApprovalDialog = (product: Product, action: ApprovalAction) => {
    setSelectedProduct(product);
    setActionType(action);
    setRejectionReason('');
    setIsDialogOpen(true);
  };

  const handleApproval = async () => {
    if (!selectedProduct) return;

    if (actionType === 'reject' && !rejectionReason.trim()) {
      toast({
        title: "خطأ",
        description: "يجب إدخال سبب الرفض",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Update product status
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.products,
        selectedProduct.$id!,
        {
          approvalStatus: actionType === 'approve' ? 'approved' : 'rejected',
          rejectionReason: actionType === 'reject' ? rejectionReason : null,
          approvedAt: actionType === 'approve' ? new Date().toISOString() : null,
        }
      );

      // Send notification to merchant
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.notifications,
        ID.unique(),
        {
          userId: selectedProduct.merchantId,
          type: actionType === 'approve' ? 'info' : 'alert',
          title: actionType === 'approve' ? 'تمت الموافقة على المنتج' : 'تم رفض المنتج',
          message: actionType === 'approve' 
            ? `تمت الموافقة على منتج "${selectedProduct.name}" وهو الآن متاح للعرض`
            : `تم رفض منتج "${selectedProduct.name}". السبب: ${rejectionReason}`,
          read: false,
          relatedId: selectedProduct.$id,
          metadata: JSON.stringify({
            productId: selectedProduct.$id,
            productName: selectedProduct.name,
            action: actionType,
            rejectionReason: actionType === 'reject' ? rejectionReason : undefined
          })
        }
      );

      toast({
        title: "✅ تم بنجاح",
        description: actionType === 'approve' 
          ? "تمت الموافقة على المنتج وإرسال إشعار للتاجر"
          : "تم رفض المنتج وإرسال إشعار للتاجر مع السبب",
      });

      setIsDialogOpen(false);
      loadProducts();
    } catch (error) {
      console.error('Error processing approval:', error);
      toast({
        title: "خطأ",
        description: "فشل معالجة الطلب",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 ml-1" />موافق عليه</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />مرفوض</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" />قيد المراجعة</Badge>;
    }
  };

  const pendingCount = products.filter(p => p.approvalStatus === 'pending').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">مراجعة المنتجات</h1>
          <p className="text-muted-foreground mt-2">
            مراجعة والموافقة على المنتجات الجديدة من التجار
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="destructive" className="text-lg py-2 px-4">
            <AlertCircle className="h-5 w-5 ml-2" />
            {pendingCount} منتج بانتظار الموافقة
          </Badge>
        )}
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>تصفية حسب الحالة:</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المنتجات</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="approved">موافق عليها</SelectItem>
                <SelectItem value="rejected">مرفوضة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                لا توجد منتجات {filterStatus !== 'all' && `في حالة "${filterStatus}"`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>التاجر</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الفيديو</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.$id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Eye className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.merchantName}</TableCell>
                    <TableCell className="font-bold">{product.price} ج.م</TableCell>
                    <TableCell>
                      {product.verificationVideo ? (
                        <a
                          href={getImageUrl(product.verificationVideo)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <PlayCircle className="h-4 w-4" />
                          مشاهدة
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">لا يوجد</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(product.approvalStatus)}</TableCell>
                    <TableCell>
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString('ar-EG')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-left">
                      <div className="flex gap-2">
                        {product.approvalStatus === 'pending' && (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => openApprovalDialog(product, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 ml-1" />
                              موافقة
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openApprovalDialog(product, 'reject')}
                            >
                              <XCircle className="h-4 w-4 ml-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        {product.approvalStatus === 'rejected' && product.rejectionReason && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "سبب الرفض",
                                description: product.rejectionReason,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4 ml-1" />
                            السبب
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'الموافقة على المنتج' : 'رفض المنتج'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Details */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">تفاصيل المنتج:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">الاسم:</span>
                  <p className="font-medium">{selectedProduct?.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">السعر:</span>
                  <p className="font-medium">{selectedProduct?.price} ج.م</p>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">الوصف:</span>
                  <p className="text-sm mt-1">{selectedProduct?.description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">الكمية:</span>
                  <p className="font-medium">{selectedProduct?.stock}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">التاجر:</span>
                  <p className="font-medium">{selectedProduct?.merchantName}</p>
                </div>
              </div>
            </div>

            {/* Video */}
            {selectedProduct?.verificationVideo && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">فيديو التحقق:</h3>
                <video
                  controls
                  className="w-full rounded"
                  src={getImageUrl(selectedProduct.verificationVideo)}
                >
                  المتصفح لا يدعم عرض الفيديو
                </video>
              </div>
            )}

            {/* Rejection Reason */}
            {actionType === 'reject' && (
              <div>
                <Label htmlFor="reason">سبب الرفض *</Label>
                <Textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="اكتب سبب رفض المنتج هنا... (سيتم إرساله للتاجر)"
                  rows={4}
                  required
                />
              </div>
            )}

            {actionType === 'approve' && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ سيتم الموافقة على هذا المنتج وسيصبح متاحاً للعرض في الموقع
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleApproval}
              disabled={isProcessing || (actionType === 'reject' && !rejectionReason.trim())}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? (
                    <>
                      <CheckCircle className="h-4 w-4 ml-2" />
                      تأكيد الموافقة
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 ml-2" />
                      تأكيد الرفض
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
