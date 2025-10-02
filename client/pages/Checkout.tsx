import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Truck, MapPin, Phone, Mail, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  
  // Mock cart data
  const cartItems = [
    {
      id: "1",
      name: "ساعة ذكية - Apple Watch Series 9",
      price: 4999,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100",
    },
    {
      id: "2",
      name: "سماعات لاسلكية - Sony WH-1000XM5",
      price: 3499,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "تم إرسال الطلب بنجاح!",
      description: "سيتم التواصل معك قريباً لتأكيد الطلب",
    });

    setIsProcessing(false);
    navigate("/orders");
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
                            <p className="font-semibold">الدفع بالبطاقة</p>
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
