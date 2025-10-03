import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Search,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";
import type { Order } from "@/shared/api";
import { adminOrdersApi } from "@/lib/admin-api";

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    status: "PENDING",
    total: 599,
    subtotal: 599,
    tax: 0,
    shipping: 0,
    discount: 0,
    shippingAddress: {
      name: "أحمد محمد",
      address: "شارع النصر، المعادي، القاهرة",
      phone: "01234567890",
    },
    paymentMethod: "cash_on_delivery",
    paymentStatus: "PENDING",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    userId: "1",
    user: {
      id: "1",
      email: "ahmed@example.com",
      name: "أحمد محمد",
      role: "USER",
      isActive: true,
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    items: [
      {
        id: "1",
        quantity: 1,
        price: 599,
        total: 599,
        productId: "1",
        product: {
          id: "1",
          name: "سماعات بلوتوث لاسلكية",
          description: "",
          price: 599,
          originalPrice: 799,
          images: ["/placeholder.svg"],
          category: "electronics",
          tags: [],
          inStock: true,
          rating: 4.8,
          reviewCount: 24,
          affiliateCommission: 8,
        },
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    status: "PROCESSING",
    total: 1299,
    subtotal: 1299,
    tax: 0,
    shipping: 0,
    discount: 0,
    shippingAddress: {
      name: "فاطمة علي",
      address: "مدينة نصر، القاهرة",
      phone: "01987654321",
    },
    paymentMethod: "credit_card",
    paymentStatus: "PAID",
    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    userId: "2",
    user: {
      id: "2",
      email: "fatima@example.com",
      name: "فاطمة علي",
      role: "USER",
      isActive: true,
      createdAt: "2024-01-12T14:30:00Z",
      updatedAt: "2024-01-15T14:30:00Z",
    },
    items: [
      {
        id: "2",
        quantity: 1,
        price: 1299,
        total: 1299,
        productId: "2",
        product: {
          id: "2",
          name: "ساعة ذكية رياضية",
          description: "",
          price: 1299,
          originalPrice: 1599,
          images: ["/placeholder.svg"],
          category: "electronics",
          tags: [],
          inStock: true,
          rating: 4.6,
          reviewCount: 18,
          affiliateCommission: 10,
        },
      },
    ],
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    status: "SHIPPED",
    total: 899,
    subtotal: 899,
    tax: 0,
    shipping: 0,
    discount: 0,
    shippingAddress: {
      name: "محمد أحمد",
      address: "الزمالك، القاهرة",
      phone: "01555666777",
    },
    paymentMethod: "credit_card",
    paymentStatus: "PAID",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
    userId: "3",
    user: {
      id: "3",
      email: "mohamed@example.com",
      name: "محمد أحمد",
      role: "USER",
      isActive: true,
      createdAt: "2024-01-08T09:15:00Z",
      updatedAt: "2024-01-15T09:15:00Z",
    },
    items: [],
  },
];

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: {
      label: "في الانتظار",
      variant: "secondary" as const,
      icon: Clock,
    },
    PROCESSING: {
      label: "قيد المعالجة",
      variant: "default" as const,
      icon: ShoppingCart,
    },
    SHIPPED: { label: "تم الشحن", variant: "outline" as const, icon: Truck },
    DELIVERED: {
      label: "تم التسليم",
      variant: "secondary" as const,
      icon: CheckCircle,
    },
    CANCELLED: {
      label: "ملغي",
      variant: "destructive" as const,
      icon: XCircle,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    PENDING: { label: "في الانتظار", variant: "secondary" as const },
    PAID: { label: "مدفوع", variant: "default" as const },
    FAILED: { label: "فشل", variant: "destructive" as const },
    REFUNDED: { label: "مسترد", variant: "outline" as const },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await adminOrdersApi.getAll();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Fallback to mock data
        setOrders(mockOrders as any);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminOrdersApi.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("فشل في تحديث حالة الطلب");
    }
  };

  // Statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const processingOrders = orders.filter(
    (o) => o.status === "PROCESSING",
  ).length;
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const paidRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">إدارة الطلبات</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الطلبات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الطلبات المعلقة
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">
                {processingOrders} قيد المعالجة
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">تم الشحن</CardTitle>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shippedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الإيرادات
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalRevenue.toLocaleString()} ج.م
              </div>
              <p className="text-xs text-muted-foreground">
                {paidRevenue.toLocaleString()} ج.م مدفوع
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="حالة الطلب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="PENDING">في الانتظار</SelectItem>
              <SelectItem value="PROCESSING">قيد المعالجة</SelectItem>
              <SelectItem value="SHIPPED">تم الشحن</SelectItem>
              <SelectItem value="DELIVERED">تم التسليم</SelectItem>
              <SelectItem value="CANCELLED">ملغي</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="حالة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع حالات الدف��</SelectItem>
              <SelectItem value="PENDING">في الانتظار</SelectItem>
              <SelectItem value="PAID">مدفوع</SelectItem>
              <SelectItem value="FAILED">فشل</SelectItem>
              <SelectItem value="REFUNDED">مسترد</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>حالة الطلب</TableHead>
                  <TableHead>حالة الدفع</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
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
                        <div className="font-medium">
                          {order.user?.name || "غير محدد"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.user?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} منتج
                        {order.items.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.items[0].product.name}
                            {order.items.length > 1 &&
                              ` +${order.items.length - 1} أخرى`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.total.toLocaleString()} ج.م
                      </div>
                      {order.discount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          خصم: {order.discount} ج.م
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleUpdateOrderStatus(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <Edit className="h-3 w-3" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">في الانتظار</SelectItem>
                            <SelectItem value="PROCESSING">
                              قيد المعالجة
                            </SelectItem>
                            <SelectItem value="SHIPPED">تم الشحن</SelectItem>
                            <SelectItem value="DELIVERED">
                              تم التسليم
                            </SelectItem>
                            <SelectItem value="CANCELLED">ملغي</SelectItem>
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
      </div>
    </AdminLayout>
  );
}
