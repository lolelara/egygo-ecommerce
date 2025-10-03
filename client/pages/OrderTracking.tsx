import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi, queryKeys } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import SEO from "@/components/SEO";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface StatusStep {
  status: OrderStatus;
  label: string;
  icon: typeof Package;
  description: string;
}

const statusSteps: StatusStep[] = [
  {
    status: "PENDING",
    label: "قيد الانتظار",
    icon: Clock,
    description: "تم استلام طلبك وجاري المراجعة",
  },
  {
    status: "PROCESSING",
    label: "قيد التجهيز",
    icon: Package,
    description: "جاري تجهيز طلبك للشحن",
  },
  {
    status: "SHIPPED",
    label: "تم الشحن",
    icon: Truck,
    description: "طلبك في الطريق إليك",
  },
  {
    status: "DELIVERED",
    label: "تم التسليم",
    icon: CheckCircle,
    description: "تم تسليم طلبك بنجاح",
  },
];

const statusOrder: OrderStatus[] = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();

  // Fetch order details
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.order(orderId || ""),
    queryFn: () => ordersApi.getOrderById(orderId || "", user?.$id || ""),
    enabled: !!orderId && !!user?.$id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <XCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">الطلب غير موجود</h3>
            <p className="text-gray-500 mb-6">لم نتمكن من العثور على هذا الطلب</p>
            <Link to="/orders">
              <Button>
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة إلى طلباتي
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStatus = order.status as OrderStatus;
  const currentStepIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === "CANCELLED";

  return (
    <>
      <SEO
        title={`تتبع الطلب #${order.orderNumber}`}
        description="تتبع حالة طلبك وموعد التسليم المتوقع"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة إلى طلباتي
          </Button>
        </Link>

        {/* Order Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">
                  تتبع الطلب #{order.orderNumber}
                </CardTitle>
                <p className="text-gray-500">
                  تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">إجمالي الطلب</p>
                <p className="text-2xl font-bold text-primary">
                  {order.total.toFixed(2)} جنيه
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Cancelled Status */}
        {isCancelled && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="py-8">
              <div className="flex items-center gap-4">
                <XCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h3 className="text-xl font-semibold text-red-700 mb-1">
                    تم إلغاء الطلب
                  </h3>
                  <p className="text-red-600">
                    لقد تم إلغاء هذا الطلب. إذا كان لديك أي استفسار، يرجى التواصل مع خدمة العملاء.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Timeline */}
        {!isCancelled && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>حالة الطلب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute right-6 top-0 h-full w-0.5 bg-gray-200 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2" />

                {/* Status Steps */}
                <div className="space-y-8">
                  {statusSteps.map((step, index) => {
                    const isPast = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isFuture = index > currentStepIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.status} className="relative flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                            isPast
                              ? "bg-green-500 border-green-500"
                              : isCurrent
                              ? "bg-primary border-primary"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              isPast || isCurrent ? "text-white" : "text-gray-400"
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4
                              className={`text-lg font-semibold ${
                                isPast || isCurrent ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </h4>
                            {isCurrent && (
                              <Badge variant="default">الحالة الحالية</Badge>
                            )}
                            {isPast && (
                              <Badge variant="outline" className="bg-green-50 border-green-500 text-green-700">
                                ✓ مكتمل
                              </Badge>
                            )}
                          </div>
                          <p
                            className={`mt-1 text-sm ${
                              isPast || isCurrent ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>المنتجات المطلوبة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                  <img
                    src={item.product?.images?.[0]?.url || "/placeholder.png"}
                    alt={item.product?.name || "منتج"}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product?.name || "منتج"}</h4>
                    <p className="text-sm text-gray-500">
                      الكمية: {item.quantity} × {item.price.toFixed(2)} جنيه
                    </p>
                  </div>
                  <p className="font-bold text-primary">
                    {item.total.toFixed(2)} جنيه
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle>عنوان التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-gray-700">
              <p><strong>الاسم:</strong> {order.shippingAddress?.name}</p>
              <p><strong>الهاتف:</strong> {order.shippingAddress?.phone}</p>
              <p><strong>العنوان:</strong> {order.shippingAddress?.address}</p>
              {order.shippingAddress?.city && (
                <p><strong>المدينة:</strong> {order.shippingAddress.city}</p>
              )}
              {order.shippingAddress?.zipCode && (
                <p><strong>الرمز البريدي:</strong> {order.shippingAddress.zipCode}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
