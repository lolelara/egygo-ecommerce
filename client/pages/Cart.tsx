import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { toast } = useToast();
  const { items: cartItems, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentage: number;
  } | null>(null);

  // Mock discount codes
  const DISCOUNT_CODES: Record<string, number> = {
    "WELCOME10": 10,
    "SAVE20": 20,
    "SUMMER15": 15,
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity > item.stockQuantity) {
      toast({
        title: "الكمية غير متوفرة",
        description: `الكمية المتوفرة فقط ${item.stockQuantity}`,
        variant: "destructive",
      });
      return;
    }

    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast({
      title: "تمت الإزالة",
      description: "تم إزالة المنتج من السلة",
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "تم إفراغ السلة",
      description: "تم إزالة جميع المنتجات من السلة",
    });
  };

  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    const percentage = DISCOUNT_CODES[code];

    if (!percentage) {
      toast({
        title: "كود خاطئ",
        description: "الكود الذي أدخلته غير صحيح",
        variant: "destructive",
      });
      return;
    }

    if (appliedDiscount?.code === code) {
      toast({
        title: "تم تطبيق الكود مسبقاً",
        description: "هذا الكود مُطبق بالفعل",
        variant: "default",
      });
      return;
    }

    setAppliedDiscount({ code, percentage });
    toast({
      title: "تم تطبيق الكود",
      description: `تم خصم ${percentage}% من إجمالي المشتريات`,
    });
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    toast({
      title: "تمت إزالة الخصم",
      description: "تم إلغاء كود الخصم",
    });
  };

  // Calculations
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  
  const savings = originalTotal - subtotal;
  const discountAmount = appliedDiscount
    ? Math.round(subtotal * (appliedDiscount.percentage / 100))
    : 0;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount >= 500 ? 0 : 50;
  const total = subtotalAfterDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-muted rounded-full">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">سلة التسوق فارغة</h1>
              <p className="text-muted-foreground">
                لم تقم بإضافة أي منتجات إلى سلة التسوق بعد
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/products">
                تصفح المنتجات
                <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">سلة التسوق</h1>
          <p className="text-muted-foreground">
            لديك {cartItems.length} منتج في السلة
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>المنتجات</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
                  إفراغ السلة
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.productId}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.productId}`}
                          className="hover:text-primary"
                        >
                          <h3 className="font-semibold mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>

                        {/* Color and Size */}
                        {(item.color || item.size) && (
                          <div className="flex items-center gap-2 mb-2">
                            {item.color && (
                              <Badge variant="outline" className="text-xs">
                                اللون: {item.color}
                              </Badge>
                            )}
                            {item.size && (
                              <Badge variant="outline" className="text-xs">
                                المقاس: {item.size}
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">
                            {item.price.toLocaleString()} ج.م
                          </span>
                          {item.originalPrice && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                {item.originalPrice.toLocaleString()} ج.م
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                وفر{" "}
                                {Math.round(
                                  ((item.originalPrice - item.price) /
                                    item.originalPrice) *
                                    100
                                )}
                                %
                              </Badge>
                            </>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stockQuantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <span className="text-sm text-muted-foreground">
                            متوفر: {item.stockQuantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Discount Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    كود الخصم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedDiscount ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div>
                          <p className="font-semibold text-green-700 dark:text-green-300">
                            {appliedDiscount.code}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            خصم {appliedDiscount.percentage}%
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveDiscount}
                        >
                          إزالة
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        placeholder="أدخل كود الخصم"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleApplyDiscount();
                          }
                        }}
                      />
                      <Button
                        className="w-full"
                        onClick={handleApplyDiscount}
                        disabled={!discountCode.trim()}
                      >
                        تطبيق الكود
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        <p className="font-semibold mb-1">أكواد متاحة:</p>
                        <p>• WELCOME10 - خصم 10%</p>
                        <p>• SAVE20 - خصم 20%</p>
                        <p>• SUMMER15 - خصم 15%</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المجموع الفرعي</span>
                      <span>{subtotal.toLocaleString()} ج.م</span>
                    </div>

                    {savings > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>وفرت</span>
                        <span>- {savings.toLocaleString()} ج.م</span>
                      </div>
                    )}

                    {appliedDiscount && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>خصم الكود ({appliedDiscount.percentage}%)</span>
                        <span>- {discountAmount.toLocaleString()} ج.م</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span className="text-muted-foreground">الشحن</span>
                      </div>
                      <span className={shipping === 0 ? "text-green-600 dark:text-green-400" : ""}>
                        {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                      </span>
                    </div>

                    {subtotalAfterDiscount < 500 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                        <Package className="h-4 w-4 inline-block ml-1" />
                        اشترِ بـ {(500 - subtotalAfterDiscount).toLocaleString()} ج.م إضافية للحصول على شحن مجاني!
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{total.toLocaleString()} ج.م</span>
                  </div>

                  <Button size="lg" className="w-full" asChild>
                    <Link to="/checkout">
                      إتمام الطلب
                      <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                    </Link>
                  </Button>

                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/products">متابعة التسوق</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
