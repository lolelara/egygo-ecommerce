import { useState, useEffect } from 'react';
import { databases, DATABASE_ID } from '@/lib/appwrite-client';
import { Query } from 'appwrite';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { CheckCircle, XCircle, Clock, AlertCircle, Package, Eye } from 'lucide-react';
import { getImageUrl } from '@/lib/storage';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Product {
  $id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  stock: number;
  categoryId: string;
  $createdAt: string;
}

export default function MerchantProductsStatus() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReasonDialog, setShowReasonDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user, activeTab]);

  const loadProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const queries = [
        Query.equal('merchantId', user.$id),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ];

      if (activeTab !== 'all') {
        queries.push(Query.equal('status', activeTab));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        'products',
        queries
      );

      setProducts(response.documents as any);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 ml-1" />
            موافق عليه
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 ml-1" />
            مرفوض
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      default:
        return null;
    }
  };

  const showRejectionReason = (product: Product) => {
    setSelectedProduct(product);
    setShowReasonDialog(true);
  };

  const pendingCount = products.filter(p => p.status === 'pending').length;
  const approvedCount = products.filter(p => p.status === 'approved').length;
  const rejectedCount = products.filter(p => p.status === 'rejected').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">حالة المنتجات</h2>
          <p className="text-muted-foreground">تتبع حالة منتجاتك والموافقات</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي المنتجات</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">موافق عليها</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مرفوضة</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>منتجاتي</CardTitle>
            <CardDescription>جميع منتجاتك مع حالة الموافقة</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  الكل ({products.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  موافق عليها ({approvedCount})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  قيد المراجعة ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  مرفوضة ({rejectedCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">جاري التحميل...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">لا توجد منتجات</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <Card key={product.$id} className="overflow-hidden">
                        <div className="aspect-square relative bg-gray-100">
                          {product.images?.[0] && (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-2 right-2">
                            {getStatusBadge(product.status)}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-primary">
                              {product.price} ج.م
                            </span>
                            <span className="text-sm text-muted-foreground">
                              المخزون: {product.stock}
                            </span>
                          </div>

                          {product.status === 'rejected' && product.rejectionReason && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mb-2"
                              onClick={() => showRejectionReason(product)}
                            >
                              <AlertCircle className="h-4 w-4 ml-2" />
                              عرض سبب الرفض
                            </Button>
                          )}

                          {product.status === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <p className="text-yellow-800">
                                  منتجك قيد المراجعة من قبل الإدارة. سيتم إخطارك عند الموافقة عليه.
                                </p>
                              </div>
                            </div>
                          )}

                          {product.status === 'approved' && (
                            <Link to={`/product/${product.$id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                <Eye className="h-4 w-4 ml-2" />
                                معاينة في الموقع
                              </Button>
                            </Link>
                          )}

                          <div className="text-xs text-muted-foreground mt-2">
                            تاريخ الإضافة: {new Date(product.$createdAt).toLocaleDateString('ar-EG')}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Reason Dialog */}
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>سبب رفض المنتج</DialogTitle>
            <DialogDescription>
              المنتج: {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-900 mb-2">سبب الرفض:</p>
                <p className="text-red-800">
                  {selectedProduct?.rejectionReason || 'لم يتم تحديد سبب'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              💡 <strong>نصيحة:</strong> يمكنك تعديل المنتج وإعادة رفعه مرة أخرى بعد معالجة المشكلة المذكورة.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
