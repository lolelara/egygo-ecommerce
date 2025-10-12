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
import { databases, appwriteConfig } from "@/lib/appwrite";
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
    // Recalculate stats whenever orders change
    loadStats();
  }, [orders]);

  const loadOrders = async () => {
    try {
      // Load real orders from Appwrite
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.orders,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
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
    }
  };

  const loadShippingMethods = async () => {
    try {
      // For now, use default shipping methods
      // You can create a shipping_methods collection later
      const defaultMethods: ShippingMethod[] = [
        {
          id: '1',
          name: 'الشحن السريع',
          description: 'توصيل خلال 24 ساعة',
          cost: 100,
          estimatedDays: 1,
          isActive: true,
          supportedRegions: ['القاهرة', 'الجيزة']
        },
        {
          id: '2',
          name: 'الشحن العادي',
          description: 'توصيل خلال 3-5 أيام',
          cost: 50,
          estimatedDays: 3,
          isActive: true,
          supportedRegions: ['جميع المحافظات']
        },
        {
          id: '3',
          name: 'الشحن الاقتصادي',
          description: 'توصيل خلال 7-10 أيام',
          cost: 25,
          estimatedDays: 7,
          isActive: true,
          supportedRegions: ['جميع المحافظات']
        }
      ];
      setShippingMethods(defaultMethods);
    } catch (error) {
      console.error('Failed to load shipping methods:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Calculate stats from real orders
      const totalOrders = orders.length;
      const pendingShipment = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
      const inTransit = orders.filter(o => o.status === 'shipped').length;
      const delivered = orders.filter(o => o.status === 'delivered').length;
      
      // Calculate average delivery time for delivered orders
      const deliveredOrders = orders.filter(o => o.status === 'delivered' && o.actualDelivery && o.createdAt);
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
        totalOrders,
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

  const handleAddTrackingNumber = async (orderId: string, trackingNumber: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, trackingNumber, status: 'shipped' as any, updatedAt: new Date() }
          : order
      ));

      toast({
        title: "نجح",
        description: "تم إضافة رقم التتبع بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة رقم التتبع",
        variant: "destructive"
      });
    }
  };

  const handleCreateShippingMethod = async () => {
    try {
      const newMethod: ShippingMethod = {
        id: Date.now().toString(),
        ...methodForm
      };

      setShippingMethods(prev => [...prev, newMethod]);
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
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء طريقة الشحن",
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
              {filteredOrders.map((order) => (
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
              ))}
            </TableBody>
          </Table>
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
                    <div className="flex justify-between">
                      <span className="text-sm">الحالة:</span>
                      <Badge variant={method.isActive ? 'default' : 'secondary'}>
                        {method.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
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
