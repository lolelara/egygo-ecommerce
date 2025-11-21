import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { databases, appwriteConfig, ID } from "@/lib/appwrite";
import { Query } from "appwrite";

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: number;
  isActive: boolean;
  supportedRegions: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ShippingStats {
  totalOrders: number;
  pendingShipment: number;
  inTransit: number;
  delivered: number;
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
}

interface TrackingEvent {
  id: string;
  orderId: string;
  status: string;
  description: string;
  location?: string;
  timestamp: Date;
  updatedBy: string;
}

export default function AdminShipping() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]); // Store all orders for stats
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [stats, setStats] = useState<ShippingStats>({
    totalOrders: 0,
    pendingShipment: 0,
    inTransit: 0,
    delivered: 0,
    averageDeliveryTime: 0,
    onTimeDeliveryRate: 0
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ordersPerPage = 20;

  const { toast } = useToast();

  // Form state for shipping method
  const [methodForm, setMethodForm] = useState({
    name: '',
    description: '',
    cost: 0,
    estimatedDays: 1,
    supportedRegions: [] as string[],
    isActive: true
  });

  useEffect(() => {
    loadOrders();
    loadShippingMethods();
  }, []);

  useEffect(() => {
    // Recalculate stats whenever allOrders change
    loadStats();
  }, [allOrders]);

  useEffect(() => {
    // Reload orders when filter changes
    loadOrders(1);
  }, [statusFilter]);

  const loadOrders = async (page: number = 1) => {
    setIsLoading(true);
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * ordersPerPage;

      // Build queries based on filters
      const queries: any[] = [
        Query.orderDesc('$createdAt'),
        Query.limit(ordersPerPage),
        Query.offset(offset)
      ];

      // Add status filter if not "all"
      if (statusFilter !== 'all') {
        queries.push(Query.equal('status', statusFilter));
      }

      // Load real orders from Appwrite with pagination
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        queries
      );

      const ordersData: Order[] = response.documents.map((doc: any) => ({
        id: doc.$id,
        orderNumber: doc.orderNumber || `EGY-${doc.$id.slice(0, 8)}`,
        customerName: doc.customerName || 'غير محدد',
        customerEmail: doc.customerEmail || '',
        customerPhone: doc.customerPhone || '',
        shippingAddress: doc.shippingAddress || {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'مصر'
        },
        items: doc.items || [],
        total: doc.totalAmount || 0,
        status: doc.status || 'pending',
        shippingMethod: doc.shippingMethod || 'standard',
        trackingNumber: doc.trackingNumber,
        estimatedDelivery: doc.estimatedDelivery ? new Date(doc.estimatedDelivery) : undefined,
        actualDelivery: doc.actualDelivery ? new Date(doc.actualDelivery) : undefined,
        createdAt: new Date(doc.$createdAt),
        updatedAt: new Date(doc.$updatedAt)
      }));

      setOrders(ordersData);
      setTotalOrders(response.total);
      setTotalPages(Math.ceil(response.total / ordersPerPage));
      setCurrentPage(page);

      // Load all orders for stats calculation (without pagination)
      if (page === 1) {
        const allOrdersResponse = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.collections.orders,
          [Query.orderDesc('$createdAt'), Query.limit(1000)]
        );

        const allOrdersData: Order[] = allOrdersResponse.documents.map((doc: any) => ({
          id: doc.$id,
          orderNumber: doc.orderNumber || `EGY-${doc.$id.slice(0, 8)}`,
          customerName: doc.customerName || 'غير محدد',
          customerEmail: doc.customerEmail || '',
          customerPhone: doc.customerPhone || '',
          shippingAddress: doc.shippingAddress || {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'مصر'
          },
          items: doc.items || [],
          total: doc.totalAmount || 0,
          status: doc.status || 'pending',
          shippingMethod: doc.shippingMethod || 'standard',
          trackingNumber: doc.trackingNumber,
          estimatedDelivery: doc.estimatedDelivery ? new Date(doc.estimatedDelivery) : undefined,
          actualDelivery: doc.actualDelivery ? new Date(doc.actualDelivery) : undefined,
          createdAt: new Date(doc.$createdAt),
          updatedAt: new Date(doc.$updatedAt)
        }));

        setAllOrders(allOrdersData);
      }

      // If no orders, show empty state instead of mock data
      if (ordersData.length === 0) {
        console.log('No orders found');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحميل الطلبات",
        variant: "destructive"
      });
      // Show empty state on error
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadShippingMethods = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.shipping_methods
      );

      const methods: ShippingMethod[] = response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        cost: doc.cost,
        estimatedDays: doc.estimatedDays,
        isActive: doc.isActive,
        supportedRegions: doc.supportedRegions || []
      }));

      setShippingMethods(methods);
    } catch (error) {
      console.error('Failed to load shipping methods:', error);
      // Don't show error toast on initial load if collection doesn't exist yet
    }
  };

  const loadStats = async () => {
    try {
      // Use allOrders for stats calculation (not paginated)
      const ordersForStats = allOrders.length > 0 ? allOrders : orders;

      // Calculate stats from real orders
      const totalOrdersCount = ordersForStats.length;
      const pendingShipment = ordersForStats.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const inTransit = ordersForStats.filter(o => o.status === 'shipped').length;
      const delivered = ordersForStats.filter(o => o.status === 'delivered').length;

      // Calculate average delivery time for delivered orders
      const deliveredOrders = ordersForStats.filter(o => o.status === 'delivered' && o.actualDelivery && o.createdAt);
      const avgDeliveryTime = deliveredOrders.length > 0
        ? deliveredOrders.reduce((sum, order) => {
          const days = Math.ceil((order.actualDelivery!.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / deliveredOrders.length
        : 0;

      // Calculate on-time delivery rate
      const onTimeOrders = deliveredOrders.filter(order => {
        if (!order.estimatedDelivery || !order.actualDelivery) return false;
        return order.actualDelivery <= order.estimatedDelivery;
      }).length;
      const onTimeRate = deliveredOrders.length > 0 ? (onTimeOrders / deliveredOrders.length) * 100 : 0;

      setStats({
        totalOrders: totalOrdersCount,
        pendingShipment,
        inTransit,
        delivered,
        averageDeliveryTime: avgDeliveryTime,
        onTimeDeliveryRate: onTimeRate
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        orderId,
        {
          status: newStatus,
          updatedAt: new Date().toISOString()
        }
      );

      setOrders(prev => prev.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus as any, updatedAt: new Date() }
          : order
      ));

      toast({
        title: "نجح",
        description: "تم تحديث حالة الطلب بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive"
      });
    }
  };

  const handleCreateShippingMethod = async () => {
    try {
      const newMethodData = {
        name: methodForm.name,
        description: methodForm.description,
        cost: methodForm.cost,
        estimatedDays: methodForm.estimatedDays,
        supportedRegions: methodForm.supportedRegions,
        isActive: methodForm.isActive
      };

      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.shipping_methods,
        ID.unique(),
        newMethodData
      );

      loadShippingMethods();
      setMethodForm({
        name: '',
        description: '',
        cost: 0,
        estimatedDays: 1,
        supportedRegions: [],
        isActive: true
      });
      setIsMethodDialogOpen(false);

      toast({
        title: "نجح",
        description: "تم إنشاء طريقة الشحن بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إنشاء طريقة الشحن",
        variant: "destructive"
      });
    }
  };

  const handleDeleteShippingMethod = async (methodId: string) => {
    if (!confirm('هل أنت متأكد من حذف طريقة الشحن هذه؟')) return;

    try {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.collections.shipping_methods,
        methodId
      );

      loadShippingMethods();
      toast({
        title: "نجح",
        description: "تم حذف طريقة الشحن بنجاح"
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف طريقة الشحن",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'في الانتظار', variant: 'secondary' as const },
      processing: { label: 'قيد المعالجة', variant: 'default' as const },
      shipped: { label: 'تم الشحن', variant: 'default' as const },
      delivered: { label: 'تم التسليم', variant: 'default' as const },
      cancelled: { label: 'ملغي', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الشحن والتتبع</h1>
        <div className="flex space-x-2">
          <Dialog open={isMethodDialogOpen} onOpenChange={setIsMethodDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                إضافة طريقة شحن
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طريقة شحن جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="methodName">اسم طريقة الشحن</Label>
                  <Input
                    id="methodName"
                    value={methodForm.name}
                    onChange={(e) => setMethodForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="الشحن السريع"
                  />
                </div>
                <div>
                  <Label htmlFor="methodDescription">الوصف</Label>
                  <Input
                    id="methodDescription"
                    value={methodForm.description}
                    onChange={(e) => setMethodForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="توصيل خلال 24 ساعة"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="methodCost">التكلفة (جنيه)</Label>
                    <Input
                      id="methodCost"
                      type="number"
                      value={methodForm.cost}
                      onChange={(e) => setMethodForm(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedDays">الأيام المتوقعة</Label>
                    <Input
                      id="estimatedDays"
                      type="number"
                      value={methodForm.estimatedDays}
                      onChange={(e) => setMethodForm(prev => ({ ...prev, estimatedDays: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsMethodDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleCreateShippingMethod}>
                    إضافة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في الانتظار</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingShipment}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيد النقل</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم التسليم</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>متوسط وقت التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.averageDeliveryTime} أيام</div>
            <p className="text-sm text-muted-foreground">متوسط الوقت من الشحن إلى التسليم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معدل التسليم في الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>معدل التسليم في الوقت</span>
                <span>{stats.onTimeDeliveryRate}%</span>
              </div>
              <Progress value={stats.onTimeDeliveryRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>فلترة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في رقم الطلب، اسم العميل، أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">في الانتظار</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>رقم التتبع</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span>جاري التحميل...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    لا توجد طلبات
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">{order.orderNumber}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{order.shippingAddress.street}</div>
                        <div>{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.total.toLocaleString()} جنيه</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        {getStatusBadge(order.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.trackingNumber ? (
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {order.trackingNumber}
                        </code>
                      ) : (
                        <span className="text-muted-foreground">غير متوفر</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(order.createdAt, 'dd/MM/yyyy', { locale: ar })}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsTrackingDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">في الانتظار</SelectItem>
                            <SelectItem value="processing">قيد المعالجة</SelectItem>
                            <SelectItem value="shipped">تم الشحن</SelectItem>
                            <SelectItem value="delivered">تم التسليم</SelectItem>
                            <SelectItem value="cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                عرض {((currentPage - 1) * ordersPerPage) + 1} إلى {Math.min(currentPage * ordersPerPage, totalOrders)} من {totalOrders} طلب
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadOrders(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  السابق
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => loadOrders(pageNum)}
                        disabled={isLoading}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadOrders(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Methods */}
      <Card>
        <CardHeader>
          <CardTitle>طرق الشحن المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shippingMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{method.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <div className="flex justify-between">
                      <span className="text-sm">التكلفة:</span>
                      <span className="font-medium">{method.cost} جنيه</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">الوقت المتوقع:</span>
                      <span className="font-medium">{method.estimatedDays} أيام</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-4"
                      onClick={() => handleDeleteShippingMethod(method.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
