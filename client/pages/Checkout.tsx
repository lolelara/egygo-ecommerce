import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, MapPin, Phone, Mail, User, ArrowRight, Tag, X, Package, Shield, CheckCircle, Clock } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState(1);
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
      navigate("/my-orders");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إتمام الطلب 💳</h1>
          <p className="text-muted-foreground">
            أكمل البيانات لإتمام طلبك بأمان
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {/* Step 1 - Cart (Completed) */}
              <div className="flex flex-col items-center flex-1">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-500 text-white mb-2">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-green-600">السلة</span>
              </div>

              <div className="flex-1 h-1 bg-primary -mx-2" />

              {/* Step 2 - Info (Current) */}
              <div className="flex flex-col items-center flex-1">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-white mb-2 animate-pulse">
                  2
                </div>
                <span className="text-sm font-semibold text-primary">البيانات</span>
              </div>

              <div className="flex-1 h-1 bg-gray-200 -mx-2" />

              {/* Step 3 - Confirm (Pending) */}
              <div className="flex flex-col items-center flex-1">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 mb-2">
                  3
                </div>
                <span className="text-sm font-medium text-gray-600">التأكيد</span>
              </div>
            </div>
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
                    {/* Cash on Delivery */}
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Package className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-bold">الدفع عند الاستلام 📦</p>
                              <p className="text-sm text-muted-foreground">
                                ادفع نقداً عند استلام الطلب
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Vodafone Cash */}
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'vodafone' ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="vodafone" id="vodafone" />
                        <Label htmlFor="vodafone" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                              <Phone className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="font-bold">فودافون كاش 📱</p>
                              <p className="text-sm text-muted-foreground">
                                تحويل فوري عبر فودافون كاش
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-bold">بطاقة ائتمان 💳</p>
                              <p className="text-sm text-muted-foreground">
                                Visa, Mastercard, Amex
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
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
              <Card className="sticky top-4 border-2 border-primary/10 shadow-lg overflow-hidden">
                <div className="bg-primary/5 p-4 border-b border-primary/10">
                  <CardTitle className="text-primary">ملخص الطلب</CardTitle>
                </div>
                <CardContent className="space-y-6 p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-tl">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="font-semibold text-sm line-clamp-2 leading-tight mb-1">
                            {item.name}
                          </p>
                          <p className="font-bold text-primary text-sm">
                            {(item.price * item.quantity).toLocaleString()} ج.م
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-border/60" />

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
                      <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                        {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>الخصم</span>
                        <span>- {discount.toLocaleString()} ج.م</span>
                      </div>
                    )}

                    <Separator className="my-2" />

                    <div className="flex justify-between items-end">
                      <span className="font-bold text-lg">الإجمالي</span>
                      <div className="text-right">
                        <span className="font-extrabold text-2xl text-primary block leading-none">
                          {total.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">ج.م</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground">شامل الضريبة</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="space-y-3 pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-primary/25 transition-all rounded-xl"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>جاري المعالجة...</span>
                        </div>
                      ) : (
                        <>
                          تأكيد الطلب
                          <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                        </>
                      )}
                    </Button>
                    {isProcessing && (
                      <Progress value={progress} className="h-1.5 bg-muted rounded-full overflow-hidden" />
                    )}
                  </div>

                  {/* Trust Badges - Enhanced Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60">
                    <div className="flex flex-col items-center text-center p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                      <Shield className="h-5 w-5 text-green-600 mb-1" />
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400">دفع آمن 100%</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                      <Clock className="h-5 w-5 text-blue-600 mb-1" />
                      <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400">دعم 24/7</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20">
                      <Package className="h-5 w-5 text-purple-600 mb-1" />
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400">شحن سريع</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                      <CheckCircle className="h-5 w-5 text-orange-600 mb-1" />
                      <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400">ضمان الجودة</span>
                    </div>
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
