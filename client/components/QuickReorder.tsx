import { useState } from "react";
import { RotateCcw, ShoppingCart, Clock, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface QuickReorderProps {
  orderId: string;
  orderItems?: OrderItem[];
}

export function QuickReorder({ orderId, orderItems }: QuickReorderProps) {
  const [isReordering, setIsReordering] = useState(false);
  const { toast } = useToast();

  // Mock order items - replace with real API call
  const items: OrderItem[] = orderItems || [
    {
      id: "1",
      productId: "prod_123",
      productName: "حذاء رياضي نايك",
      quantity: 1,
      price: 1299,
      image: "/products/nike-shoe.jpg"
    },
    {
      id: "2",
      productId: "prod_456",
      productName: "تيشرت قطن",
      quantity: 2,
      price: 299,
      image: "/products/tshirt.jpg"
    }
  ];

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuickReorder = async () => {
    setIsReordering(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real implementation:
      // 1. Fetch original order items
      // const orderData = await fetchOrderItems(orderId);
      // 2. Check product availability
      // const availability = await checkProductsAvailability(orderData.items);
      // 3. Add to cart
      // await addToCart(orderData.items);
      // 4. Navigate to checkout or cart
      // navigate("/checkout");

      toast({
        title: "✅ تمت إضافة الطلب",
        description: `تم إضافة ${totalItems} منتج إلى السلة بنجاح`,
      });
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: "فشل في إعادة الطلب. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Order Items Preview */}
      <div className="rounded-lg border bg-card p-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">محتويات الطلب السابق</span>
          <Badge variant="secondary">{totalItems} منتج</Badge>
        </div>
        <div className="space-y-1.5">
          {items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-muted-foreground">
                {item.productName} × {item.quantity}
              </span>
            </div>
          ))}
          {items.length > 2 && (
            <div className="text-xs text-muted-foreground">
              + {items.length - 2} منتجات أخرى
            </div>
          )}
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>الإجمالي</span>
          <span>{totalPrice.toFixed(2)} جنيه</span>
        </div>
      </div>

      {/* Reorder Button */}
      <Button
        onClick={handleQuickReorder}
        disabled={isReordering}
        className="w-full"
        size="lg"
      >
        {isReordering ? (
          <>
            <Clock className="ml-2 h-5 w-5 animate-spin" />
            جارٍ إضافة المنتجات...
          </>
        ) : (
          <>
            <RotateCcw className="ml-2 h-5 w-5" />
            إعادة الطلب
          </>
        )}
      </Button>
    </div>
  );
}

// Auto-reorder subscription component
interface AutoReorderSubscriptionProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
}

export function AutoReorderSubscription({
  productId,
  productName,
  productPrice,
  productImage,
}: AutoReorderSubscriptionProps) {
  const [frequency, setFrequency] = useState<"weekly" | "biweekly" | "monthly">("monthly");
  const [isActive, setIsActive] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const frequencyLabels = {
    weekly: "أسبوعياً",
    biweekly: "كل أسبوعين",
    monthly: "شهرياً",
  };

  const getNextOrderDate = () => {
    const now = new Date();
    const daysToAdd = {
      weekly: 7,
      biweekly: 14,
      monthly: 30,
    }[frequency];

    const nextDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return nextDate.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateSavings = () => {
    const discount = 0.05; // 5% discount
    return (productPrice * discount).toFixed(2);
  };

  const handleToggleSubscription = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In real implementation:
      // if (!isActive) {
      //   await createRecurringOrder({ productId, frequency });
      // } else {
      //   await cancelRecurringOrder({ productId });
      // }

      setIsActive(!isActive);

      toast({
        title: !isActive ? "✅ تم تفعيل الطلب التلقائي" : "❌ تم إلغاء الاشتراك",
        description: !isActive
          ? `سيتم إرسال ${productName} ${frequencyLabels[frequency]} بخصم 5%`
          : "تم إلغاء الطلب التلقائي بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في حفظ التغييرات. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">الطلب التلقائي</CardTitle>
            <CardDescription>
              وفّر الوقت واحصل على خصم 5% على الطلبات المتكررة
            </CardDescription>
          </div>
          {isActive && (
            <Badge variant="default" className="gap-1">
              <Check className="h-3 w-3" />
              نشط
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Info */}
        {productImage && (
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <img
              src={productImage}
              alt={productName}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{productName}</p>
              <p className="text-sm text-muted-foreground">{productPrice} جنيه</p>
            </div>
          </div>
        )}

        {/* Frequency Selection */}
        <div className="space-y-2">
          <Label>التكرار</Label>
          <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">
                <div className="flex items-center justify-between w-full">
                  <span>أسبوعياً</span>
                  <span className="text-xs text-muted-foreground mr-2">كل 7 أيام</span>
                </div>
              </SelectItem>
              <SelectItem value="biweekly">
                <div className="flex items-center justify-between w-full">
                  <span>كل أسبوعين</span>
                  <span className="text-xs text-muted-foreground mr-2">كل 14 يوم</span>
                </div>
              </SelectItem>
              <SelectItem value="monthly">
                <div className="flex items-center justify-between w-full">
                  <span>شهرياً</span>
                  <span className="text-xs text-muted-foreground mr-2">كل 30 يوم</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subscription Details */}
        {isActive && (
          <div className="rounded-lg border bg-primary/5 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">الطلب القادم</span>
            </div>
            <p className="text-sm text-muted-foreground">{getNextOrderDate()}</p>
            <Separator className="my-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">التوفير الشهري</span>
              <span className="font-semibold text-green-600">
                {calculateSavings()} جنيه
              </span>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-sm font-medium">مميزات الطلب التلقائي:</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>خصم 5% على كل طلب</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>إلغاء أو تعديل في أي وقت</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>أولوية في الشحن</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>إشعار قبل الطلب بـ 24 ساعة</span>
            </li>
          </ul>
        </div>

        {/* Toggle Button */}
        <Button
          onClick={handleToggleSubscription}
          disabled={isSaving}
          variant={isActive ? "destructive" : "default"}
          className="w-full"
          size="lg"
        >
          {isSaving ? (
            <>
              <Clock className="ml-2 h-5 w-5 animate-spin" />
              جارٍ الحفظ...
            </>
          ) : isActive ? (
            <>
              <RotateCcw className="ml-2 h-5 w-5" />
              إلغاء الاشتراك
            </>
          ) : (
            <>
              <ShoppingCart className="ml-2 h-5 w-5" />
              تفعيل الطلب التلقائي
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Frequently Purchased Component
interface FrequentlyPurchasedProps {
  userId: string;
}

export function FrequentlyPurchased({ userId }: FrequentlyPurchasedProps) {
  // Mock data - replace with real API call
  const frequentProducts = [
    {
      id: "prod_123",
      name: "حذاء رياضي نايك",
      price: 1299,
      image: "/products/nike-shoe.jpg",
      purchaseCount: 5,
      lastPurchase: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    },
    {
      id: "prod_456",
      name: "تيشرت قطن",
      price: 299,
      image: "/products/tshirt.jpg",
      purchaseCount: 8,
      lastPurchase: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
  ];

  const getDaysSinceLastPurchase = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">مشترياتك المتكررة</CardTitle>
        <CardDescription>
          المنتجات التي تشتريها بانتظام - أعد طلبها بسرعة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {frequentProducts.map((product) => {
          const daysSince = getDaysSinceLastPurchase(product.lastPurchase);
          return (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.price} جنيه</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {product.purchaseCount} عمليات شراء
                  </Badge>
                  <span>• آخر شراء: منذ {daysSince} يوم</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ShoppingCart className="h-4 w-4 ml-1" />
                أعد الطلب
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
