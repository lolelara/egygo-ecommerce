import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  itemsCount: number;
  items: {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    city: string;
    address: string;
    phone: string;
  };
}

const statusConfig = {
  PENDING: {
    label: "قيد الانتظار",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "default" as const,
  },
  CONFIRMED: {
    label: "مؤكد",
    icon: CheckCircle,
    color: "bg-blue-500",
    variant: "default" as const,
  },
  SHIPPED: {
    label: "تم الشحن",
    icon: Truck,
    color: "bg-purple-500",
    variant: "default" as const,
  },
  DELIVERED: {
    label: "تم التوصيل",
    icon: CheckCircle,
    color: "bg-green-500",
    variant: "default" as const,
  },
  CANCELLED: {
    label: "ملغي",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive" as const,
  },
};

export default function MyOrders() {
  const { user } = useAuth();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Mock orders data
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2025-001",
      date: "2025-09-28",
      status: "DELIVERED",
      total: 8497,
      itemsCount: 2,
      items: [
        {
          id: "1",
          productId: "prod-1",
          name: "ساعة ذكية - Apple Watch Series 9",
          price: 4999,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
        },
        {
          id: "2",
          productId: "prod-2",
          name: "سماعات لاسلكية - Sony WH-1000XM5",
          price: 3498,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
        },
      ],
      shippingAddress: {
        city: "القاهرة",
        address: "شارع التحرير، مبنى 15، الدور 3",
        phone: "+20 123 456 7890",
      },
    },
    {
      id: "2",
      orderNumber: "ORD-2025-002",
      date: "2025-09-30",
      status: "SHIPPED",
      total: 2499,
      itemsCount: 1,
      items: [
        {
          id: "3",
          productId: "prod-3",
          name: "لوحة مفاتيح ميكانيكية",
          price: 2499,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100",
        },
      ],
      shippingAddress: {
        city: "الجيزة",
        address: "الهرم، شارع الثلاثيني، مبنى 8",
        phone: "+20 123 456 7890",
      },
    },
    {
      id: "3",
      orderNumber: "ORD-2025-003",
      date: "2025-10-01",
      status: "PENDING",
      total: 1299,
      itemsCount: 1,
      items: [
        {
          id: "4",
          productId: "prod-4",
          name: "ماوس لاسلكي - Logitech MX Master",
          price: 1299,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100",
        },
      ],
      shippingAddress: {
        city: "الإسكندرية",
        address: "سموحة، شارع فوزي معاذ",
        phone: "+20 123 456 7890",
      },
    },
  ];

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">
            يجب تسجيل الدخول لعرض طلباتك
          </h1>
          <Button asChild>
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">لا توجد طلبات حتى الآن</h1>
          <p className="text-muted-foreground mb-6">
            ابدأ بتصفح منتجاتنا واطلب ما يناسبك
          </p>
          <Button asChild>
            <Link to="/products">تصفح المنتجات</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">طلباتي</h1>
          <p className="text-muted-foreground">
            لديك {orders.length} طلب إجمالي
          </p>
        </div>

        {/* Orders Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "PENDING").length}
                  </p>
                  <p className="text-sm text-muted-foreground">قيد الانتظار</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "SHIPPED").length}
                  </p>
                  <p className="text-sm text-muted-foreground">تم الشحن</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orders.filter((o) => o.status === "DELIVERED").length}
                  </p>
                  <p className="text-sm text-muted-foreground">تم التوصيل</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">إجمالي المشتريات</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            const isExpanded = expandedOrders.has(order.id);

            return (
              <Card key={order.id}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">
                          {order.orderNumber}
                        </CardTitle>
                        <Badge variant={config.variant} className="flex items-center gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span>
                          التاريخ: {new Date(order.date).toLocaleDateString("ar")}
                        </span>
                        <span>{order.itemsCount} منتج</span>
                        <span className="font-semibold text-primary">
                          {order.total.toLocaleString()} ج.م
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                          إخفاء التفاصيل
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                          عرض التفاصيل
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <Separator />

                    {/* Order Items */}
                    <div>
                      <h4 className="font-semibold mb-3">المنتجات</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 bg-muted rounded-lg"
                          >
                            <Link to={`/product/${item.productId}`}>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            </Link>
                            <div className="flex-1">
                              <Link
                                to={`/product/${item.productId}`}
                                className="hover:text-primary"
                              >
                                <p className="font-medium">{item.name}</p>
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                الكمية: {item.quantity} × {item.price.toLocaleString()}{" "}
                                ج.م
                              </p>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold">
                                {(item.price * item.quantity).toLocaleString()} ج.م
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Shipping Address */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">عنوان التوصيل</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{order.shippingAddress.city}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.phone}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">تفاصيل الدفع</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              المجموع الفرعي
                            </span>
                            <span>{order.total.toLocaleString()} ج.م</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">الشحن</span>
                            <span>مجاني</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold text-base">
                            <span>الإجمالي</span>
                            <span className="text-primary">
                              {order.total.toLocaleString()} ج.م
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" size="sm">
                        تتبع الشحنة
                      </Button>
                      {order.status === "DELIVERED" && (
                        <Button variant="outline" size="sm">
                          إعادة الطلب
                        </Button>
                      )}
                      {order.status === "PENDING" && (
                        <Button variant="destructive" size="sm">
                          إلغاء الطلب
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
