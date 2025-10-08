import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("إرسال رابط إعادة تعيين كلمة المرور إلى:", email);
      setIsEmailSent(true);
    } catch (error) {
      console.error("خطأ في إرسال البريد الإلكتروني:", error);
      alert("حدث خطأ في إرسال البريد الإلكتروني");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="text-3xl font-bold text-primary">
              EgyGo
            </Link>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                تم إرسال البريد الإلكتروني!
              </CardTitle>
              <CardDescription>
                تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                <p>أرسلنا رابط إعادة تعيين كلمة المرور إلى:</p>
                <p className="font-medium text-gray-900 mt-1">{email}</p>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>
                  لم تستلم البريد الإلكتروني؟ تحقق من مجلد الرسائل غير المرغوب
                  فيها أو
                </p>
                <button
                  onClick={() => {
                    setIsEmailSent(false);
                    setEmail("");
                  }}
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  جرب مرة أخرى
                </button>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link to="/login">
                    العودة لتسجيل الدخول
                    <ArrowRight className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-primary">
            شوب كو
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            نسيت كلمة المرور؟
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle>إعادة تعيين كلمة المرور</CardTitle>
            <CardDescription>
              سنرسل لك رابط آمن لإعادة تعيين كلمة المرور على بريدك الإلكتروني
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="أدخل بريدك الإلكتروني المسجل"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    إرسال رابط إعادة التعيين
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </div>
                )}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                ← العودة لتسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            تحتاج مساعدة؟{" "}
            <Link
              to="/contact"
              className="text-primary hover:text-primary/80 font-medium"
            >
              اتصل بنا
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
