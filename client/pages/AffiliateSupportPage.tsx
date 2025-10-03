import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageCircle, Mail, Phone, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function AffiliateSupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    priority: "medium",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support ticket:", formData);
    toast({
      title: "تم إرسال الطلب",
      description: "سنرد عليك في أقرب وقت ممكن"
    });
    setFormData({ subject: "", priority: "medium", message: "" });
  };

  if (!user?.isAffiliate && user?.role !== "affiliate") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            هذه الصفحة متاحة للمسوقين فقط
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">الدعم الفني</h1>
        <p className="text-muted-foreground">
          نحن هنا لمساعدتك في أي وقت
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>إرسال طلب دعم</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="subject">الموضوع</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="اكتب موضوع المشكلة"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="priority">الأولوية</Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">عادي</option>
                    <option value="medium">متوسط</option>
                    <option value="high">عاجل</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="اشرح المشكلة بالتفصيل..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  إرسال الطلب
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>الأسئلة الشائعة للمسوقين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">كيف أحصل على رابط تتبع؟</h4>
                  <p className="text-sm text-muted-foreground">
                    اذهب لصفحة "الروابط" واختر المنتج ثم انسخ الرابط الخاص بك.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">متى أستلم عمولاتي؟</h4>
                  <p className="text-sm text-muted-foreground">
                    تُصرف العمولات شهرياً في الأسبوع الأول من كل شهر.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">كيف أزيد مبيعاتي؟</h4>
                  <p className="text-sm text-muted-foreground">
                    راجع صفحة "المصادر" للحصول على استراتيجيات تسويقية فعالة.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">طرق التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">دردشة مباشرة</p>
                  <p className="text-xs text-muted-foreground">متاح: 10 ص - 10 م</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full">
                    بدء المحادثة
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">البريد الإلكتروني</p>
                  <p className="text-xs text-muted-foreground">affiliate@egygo.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">الهاتف</p>
                  <p className="text-xs text-muted-foreground">+20 123 456 7890</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                أوقات العمل
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>السبت - الخميس: 10 ص - 10 م</p>
              <p>الجمعة: 2 م - 10 م</p>
            </CardContent>
          </Card>

          <Alert>
            <AlertDescription className="text-sm">
              متوسط وقت الرد: أقل من 24 ساعة
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
