import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, Package, Shield, RotateCcw, CheckCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import CouponInput from "@/components/cart/CouponInput";
import { type Coupon } from "@/lib/coupons-api";

export default function Cart() {
  const { toast } = useToast();
  const { items: cartItems, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

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


  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const handleRemoveItem = (itemId: string) => {
    setPendingRemoveId(itemId);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveItem = () => {
    if (pendingRemoveId) {
      removeItem(pendingRemoveId);
      toast({
        title: "تمت الإزالة",
        description: "تم إزالة المنتج من السلة",
      });
    }
    setRemoveDialogOpen(false);
    setPendingRemoveId(null);
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "تم إفراغ السلة",
      description: "تم إزالة جميع المنتجات من السلة",
    });
  };

  const handleCouponApplied = (discount: number, coupon: Coupon) => {
    setDiscountAmount(discount);
    setAppliedCoupon(coupon);
  };

  const handleCouponRemoved = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
  };

  // Calculations
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  
  const savings = originalTotal - subtotal;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = subtotalAfterDiscount >= 500 ? 0 : 50;
  const total = subtotalAfterDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto border-2 border-dashed">
            <CardContent className="py-16">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-purple-600/10 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">سلة التسوق فارغة</h1>
                  <p className="text-muted-foreground">
                    لم تضف أي منتجات بعد. ابدأ بإضافة منتجاتك المفضلة!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-primary to-purple-600">
                    <Link to="/products">
                      <ShoppingBag className="h-5 w-5 ml-2" />
                      ابدأ التسوق
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/deals">
                      <Tag className="h-5 w-5 ml-2" />
                      العروض الخاصة
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">سلة التسوق 🛒</h1>
            <p className="text-muted-foreground">
              لديك <span className="font-semibold text-primary">{cartItems.length}</span> {cartItems.length === 1 ? "منتج" : "منتجات"} في السلة
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/products">
              متابعة التسوق
            </Link>
          </Button>
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
                      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="flex-shrink-0"
                          >
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تأكيد إزالة المنتج</DialogTitle>
                          </DialogHeader>
                          <p>هل أنت متأكد أنك تريد إزالة هذا المنتج من السلة؟</p>
                          <DialogFooter>
                            <Button variant="destructive" onClick={confirmRemoveItem}>نعم، إزالة</Button>
                            <Button variant="outline" onClick={() => setRemoveDialogOpen(false)}>إلغاء</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Coupon Code - New System */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    كود الخصم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CouponInput
                    cartTotal={subtotal}
                    onCouponApplied={handleCouponApplied}
                    onCouponRemoved={handleCouponRemoved}
                    appliedCoupon={appliedCoupon}
                  />
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

                    {appliedCoupon && discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>خصم الكود ({appliedCoupon.code})</span>
                        <span>- {discountAmount.toLocaleString()} ج.م</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span className="text-muted-foreground">الشحن</span>
                      </div>
                      <span>
                        {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-primary">{total.toLocaleString()} ج.م</span>
                  </div>

                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" asChild>
                    <Link to="/checkout">
                      <CheckCircle className="h-5 w-5 ml-2" />
                      إتمام عملية الشراء 💳
                    </Link>
                  </Button>

                  <Button variant="outline" size="lg" className="w-full" asChild>
                    <Link to="/products">
                      <ShoppingBag className="h-4 w-4 ml-2" />
                      متابعة التسوق
                    </Link>
                  </Button>

                  {/* Trust Badges */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>دفع آمن ومشفر 100%</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <RotateCcw className="h-4 w-4 text-blue-600" />
                      <span>إرجاع مجاني خلال 14 يوم</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Truck className="h-4 w-4 text-purple-600" />
                      <span>توصيل سريع في جميع أنحاء مصر</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
