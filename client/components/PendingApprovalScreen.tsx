import { useAuth } from "@/contexts/AppwriteAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PendingApprovalScreen() {
  const { user } = useAuth();

  const getAccountTypeText = () => {
    if (user?.isMerchant) return "تاجر";
    if (user?.isAffiliate) return "مسوق";
    return "مستخدم";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/30 to-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl mb-2">⏳ حسابك قيد المراجعة</CardTitle>
          <p className="text-muted-foreground">
            مرحباً {user?.name}، شكراً لتسجيلك كـ{getAccountTypeText()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  في انتظار موافقة الإدارة
                </h3>
                <p className="text-sm text-yellow-700">
                  حسابك الآن قيد المراجعة من قبل فريق إيجي جو. سيتم إشعارك فوراً عند الموافقة على حسابك.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">ماذا بعد؟</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">المراجعة السريعة</p>
                  <p className="text-sm text-muted-foreground">
                    عادة ما تستغرق المراجعة من 24 إلى 48 ساعة عمل
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">التحقق من البيانات</p>
                  <p className="text-sm text-muted-foreground">
                    سنتحقق من بياناتك ونتأكد من صحة المعلومات المقدمة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">إشعار فوري</p>
                  <p className="text-sm text-muted-foreground">
                    عند الموافقة، ستتلقى إشعاراً على الموقع ورسالة على بريدك الإلكتروني
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">بيانات التواصل المسجلة:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              يمكنك التصفح والتسوق في الموقع أثناء انتظار الموافقة
            </p>
            <div className="flex gap-2">
              <Button asChild className="flex-1" variant="outline">
                <Link to="/">العودة للرئيسية</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/products">تصفح المنتجات</Link>
              </Button>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>هل لديك استفسار؟</strong>
              <br />
              يمكنك التواصل معنا على{" "}
              <a href="mailto:support@egygo.me" className="text-primary hover:underline">
                support@egygo.me
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
