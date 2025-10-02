import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stockQuantity: number;
  inStock: boolean;
}

export default function Cart() {
  const { toast } = useToast();
  
  // Mock cart data - في الواقع سيأتي من API أو Context
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      productId: "prod-1",
      name: "ساعة ذكية - Apple Watch Series 9",
      price: 4999,
      originalPrice: 5999,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
      quantity: 1,
      stockQuantity: 10,
      inStock: true,
    },
    {
      id: "2",
      productId: "prod-2",
      name: "سماعات لاسلكية - Sony WH-1000XM5",
      price: 3499,
      originalPrice: 3999,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      quantity: 2,
      stockQuantity: 5,
      inStock: true,
    },
  ]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
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

    setCartItems((items) =>
      items.map((i) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      )
    );

    toast({
      title: "تم التحديث",
      description: "تم تحديث كمية المنتج",
    });
  };

  const removeItem = (itemId: string) => {
    setCartItems((items) => items.filter((i) => i.id !== itemId));
    toast({
      title: "تمت الإزالة",
      description: "تم إزالة المنتج من السلة",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "تم إفراغ السلة",
      description: "تم إزالة جميع المنتجات من السلة",
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
    0
  );
  
  const savings = originalTotal - subtotal;
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

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
                  onClick={clearCart}
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

                        <div className="flex items-center justify-between">
                          {/* Quantity Control */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 font-semibold min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-left hidden sm:block">
                        <p className="font-bold text-lg">
                          {(item.price * item.quantity).toLocaleString()} ج.م
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Button variant="outline" asChild>
              <Link to="/products">
                متابعة التسوق
                <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      المجموع الفرعي ({cartItems.length} منتج)
                    </span>
                    <span className="font-semibold">
                      {subtotal.toLocaleString()} ج.م
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>التوفير</span>
                      <span className="font-semibold">
                        -{savings.toLocaleString()} ج.م
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <Badge variant="secondary">مجاني</Badge>
                      ) : (
                        `${shipping} ج.م`
                      )}
                    </span>
                  </div>

                  {shipping > 0 && subtotal < 500 && (
                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      أضف منتجات بقيمة {(500 - subtotal).toLocaleString()} ج.م
                      للحصول على شحن مجاني
                    </p>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-primary text-2xl">
                      {total.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                <Button size="lg" className="w-full" asChild>
                  <Link to="/checkout">
                    إتمام الطلب
                    <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Link>
                </Button>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    ✓ دفع آمن 100%
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ شحن سريع وموثوق
                  </p>
                  <p className="flex items-center gap-2">
                    ✓ ضمان استرجاع المال
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
