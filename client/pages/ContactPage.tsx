import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Facebook, Instagram, Twitter, MessageCircle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال رسالتك!",
      description: "سنتواصل معك قريباً",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-primary to-purple-600 mb-4">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-3">نحن هنا للمساعدة!</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          تواصل معنا بأي طريقة تفضلها. فريقنا جاهز للرد على جميع استفساراتك
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Info */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">اتصل بنا</h3>
              <p className="text-lg font-semibold text-primary mb-1" dir="ltr">+20 103 432 4951</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-green-600" />
                <span>متاح على WhatsApp</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">البريد الإلكتروني</h3>
              <p className="text-sm text-muted-foreground mb-1">support@egygo.com</p>
              <p className="text-xs text-muted-foreground">نرد خلال 24 ساعة</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-bold mb-2">العنوان</h3>
              <p className="text-sm text-muted-foreground">
                القاهرة، مصر
                <br />
                123 شارع التحرير
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-purple-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5" />
                <h3 className="font-bold">ساعات العمل</h3>
              </div>
              <div className="space-y-2 text-sm text-white/90">
                <div className="flex justify-between">
                  <span>الأحد - الخميس:</span>
                  <span className="font-semibold">9ص - 6م</span>
                </div>
                <div className="flex justify-between">
                  <span>الجمعة:</span>
                  <span className="font-semibold">1م - 5م</span>
                </div>
                <div className="flex justify-between">
                  <span>السبت:</span>
                  <span className="font-semibold">مغلق</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3">تابعنا</h3>
              <div className="flex gap-3">
                <a href="#" className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              أرسل رسالة
            </CardTitle>
            <CardDescription>
              املأ النموذج وسنرد عليك في أقرب وقت ممكن
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">الرسالة *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Send className="h-5 w-5 mr-2" />
                إرسال الرسالة
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>الأسئلة الشائعة</CardTitle>
          <CardDescription>إجابات سريعة لأكثر الأسئلة شيوعاً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">ما هي مدة التوصيل؟</h4>
                  <p className="text-sm text-muted-foreground">
                    يتم التوصيل خلال 2-4 أيام عمل داخل القاهرة، وحتى 7 أيام للمحافظات الأخرى
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">كيف أصبح تاجر أو مسوق؟</h4>
                  <p className="text-sm text-muted-foreground">
                    سجّل حساب تاجر أو مسوق من صفحة التسجيل واحصل على عمولات مميزة على كل عملية بيع
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">ما هي سياسة الإرجاع؟</h4>
                  <p className="text-sm text-muted-foreground">
                    يمكنك إرجاع أي منتج خلال 14 يوم من تاريخ الاستلام
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">كيف يمكنني تتبع طلبي؟</h4>
                  <p className="text-sm text-muted-foreground">
                    يمكنك تتبع طلبك من صفحة "طلباتي" في حسابك
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">هل الدفع آمن؟</h4>
                  <p className="text-sm text-muted-foreground">
                    نعم، جميع معاملاتنا مشفرة وآمنة 100%
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">هل توفرون ضمان؟</h4>
                  <p className="text-sm text-muted-foreground">
                    نعم، جميع منتجاتنا مضمونة لمدة سنة على الأقل
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
