import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, MapPin, Phone, Mail, User, ArrowRight, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items: cartItems } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "الرجاء إضافة منتجات للسلة أولاً",
        variant: "destructive",
      });
      navigate("/products");
    }
  }, [cartItems, navigate, toast]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500 ? 0 : 50;
  
  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percentage") {
      discount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discount = appliedCoupon.value;
    }
  }
  
  const total = subtotal + shipping - discount;

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode) return;
    setIsCheckingCoupon(true);
    
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        "coupons",
        [Query.equal("code", couponCode.toUpperCase()), Query.equal("isActive", true)]
      );
      
      if (response.documents.length === 0) {
        toast({
          title: "كوبون غير صالح",
          description: "الكود غير موجود أو غير نشط",
          variant: "destructive",
        });
        return;
      }
      
      const coupon = response.documents[0];
      
      // Check expiry
      if (new Date(coupon.expiryDate) < new Date()) {
        toast({
          title: "كوبون منتهي",
          description: "هذا الكوبون انتهت صلاحيته",
          variant: "destructive",
        });
        return;
      }
      
      // Check usage limit
      if (coupon.usageCount >= coupon.usageLimit) {
        toast({
          title: "كوبون مستنفذ",
          description: "تم استخدام هذا الكوبون بالكامل",
          variant: "destructive",
        });
        return;
      }
      
      setAppliedCoupon(coupon);
      toast({
        title: "تم تطبيق الكوبون!",
        description: `حصلت على خصم ${coupon.type === 'percentage' ? coupon.value + '%' : coupon.value + ' ج.م'}`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في التحقق من الكوبون",
        variant: "destructive",
      });
    } finally {
      setIsCheckingCoupon(false);
    }
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgress(0);
    // Animate progress bar
    let val = 0;
    const interval = setInterval(() => {
      val += Math.random() * 30;
      setProgress(Math.min(val, 100));
    }, 200);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(interval);
    setProgress(100);
    toast({
      title: "تم إرسال الطلب بنجاح!",
      description: "سيتم التواصل معك قريباً لتأكيد الطلب",
    });
    setTimeout(() => {
      setIsProcessing(false);
      setProgress(0);
      navigate("/orders");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إتمام الطلب</h1>
          <p className="text-muted-foreground">
            أكمل البيانات لإتمام طلبك
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Checkout Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">السلة</span>
              <span className="text-xs font-medium text-primary">البيانات</span>
              <span className="text-xs font-medium text-muted-foreground">تأكيد</span>
            </div>
            <Progress value={66} className="h-2 bg-muted" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">الاسم الأول *</Label>
                      <Input
                        id="firstName"
                        placeholder="محمد"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">اسم العائلة *</Label>
                      <Input
                        id="lastName"
                        placeholder="أحمد"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني *</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground rtl:right-auto rtl:left-3" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          className="pr-10 rtl:pr-3 rtl:pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground rtl:right-auto rtl:left-3" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+20 123 456 7890"
                          className="pr-10 rtl:pr-3 rtl:pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    عنوان الشحن
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة *</Label>
                      <Input
                        id="city"
                        placeholder="القاهرة"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">المحافظة *</Label>
                      <Input
                        id="state"
                        placeholder="القاهرة"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                    <Textarea
                      id="address"
                      placeholder="الشارع، رقم المبنى، الدور، الشقة"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">الرمز البريدي</Label>
                      <Input
                        id="postalCode"
                        placeholder="12345"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark">علامة مميزة</Label>
                      <Input
                        id="landmark"
                        placeholder="بجوار المسجد / المدرسة"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    طريقة الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold">الدفع عند الاستلام</p>
                            <p className="text-sm text-muted-foreground">
                              ادفع نقداً عند استلام الطلب
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-muted">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              الدفع بالبطاقة
                              {/* Payment icons */}
                              <span className="inline-flex gap-1 ml-2">
                                <svg width="24" height="14" viewBox="0 0 24 14" fill="none"><rect width="24" height="14" rx="2" fill="#fff"/><text x="3" y="11" font-size="8" fill="#1a237e">VISA</text></svg>
                                <svg width="24" height="14" viewBox="0 0 24 14" fill="none"><rect width="24" height="14" rx="2" fill="#fff"/><circle cx="8" cy="7" r="5" fill="#f44336"/><circle cx="16" cy="7" r="5" fill="#ff9800"/><text x="5" y="12" font-size="6" fill="#222">MC</text></svg>
                                <svg width="24" height="14" viewBox="0 0 24 14" fill="none"><rect width="24" height="14" rx="2" fill="#fff"/><text x="2" y="11" font-size="8" fill="#1976d2">AMEX</text></svg>
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Visa, Mastercard, American Express
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">رقم البطاقة</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            maxLength={4}
                            required={paymentMethod === "card"}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>ملاحظات إضافية</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="أي ملاحظات خاصة بالطلب..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>ملخص الطلب</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            الكمية: {item.quantity}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm">
                            {(item.price * item.quantity).toLocaleString()} ج.م
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        المجموع الفرعي
                      </span>
                      <span className="font-semibold">
                        {subtotal.toLocaleString()} ج.م
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">الشحن</span>
                      <span className="font-semibold">
                        {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg">
                      <span className="font-bold">الإجمالي</span>
                      <span className="font-bold text-primary text-2xl">
                        {total.toLocaleString()} ج.م
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        "جاري المعالجة..."
                      ) : (
                        <>
                          تأكيد الطلب
                          <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                        </>
                      )}
                    </Button>
                    {isProcessing && (
                      <Progress value={progress} className="h-2 bg-muted" />
                    )}
                  </div>

                  {/* Security Note */}
                  <div className="space-y-2 text-xs text-muted-foreground text-center">
                    <p>🔒 معاملاتك آمنة ومشفرة</p>
                    <p>سيتم التواصل معك خلال 24 ساعة</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
