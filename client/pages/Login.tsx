import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
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
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);

      // Redirect based on user role or to main page
      navigate("/");
    } catch (err: any) {
      setError(
        err?.message || "حدث خطأ أثناء تسجيل الدخول",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (user) {
    navigate("/");
    return null;
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
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            أو{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>أهلاً بك مرة أخرى</CardTitle>
            <CardDescription>
              قم بتسجيل الدخول للوصول إلى حسابك ومتابعة التسوق
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Demo Credentials */}
              <div className="p-3 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
                <p className="font-medium mb-1">بيانات تجريبية:</p>
                <p>مدير: admin@example.com / admin123</p>
                <p>مدير عام: superadmin@example.com / superadmin123</p>
              </div>

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
                    placeholder="أدخل بريدك الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm cursor-pointer"
                  >
                    تذكرني
                  </Label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري تسجيل الدخول...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    تسجيل الدخول
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    أو
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Implement Google login
                  console.log("تسجيل دخول بـ Google");
                }}
              >
                <svg
                  className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                متابعة بحساب Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Implement Facebook login
                  console.log("تسجيل دخول بـ Facebook");
                }}
              >
                <svg
                  className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                متابعة بحساب Facebook
              </Button>
            </div>

            {/* Affiliate Program Link */}
            <div className="mt-6 p-4 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
              <div className="text-center">
                <p className="text-sm text-brand-orange font-medium mb-2">
                  💰 هل تريد الانضمام لبرنامج الشراكة؟
                </p>
                <Link
                  to="/affiliate"
                  className="text-sm text-brand-orange hover:text-brand-orange/80 font-medium underline"
                >
                  اكسب عمولة تصل إلى 25% من كل عملية بيع تحيلها
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600">
          <p>
            بتسجيل الدخول، فإنك توافق على{" "}
            <Link to="/terms" className="text-primary hover:text-primary/80">
              شروط الخدمة
            </Link>{" "}
            و{" "}
            <Link to="/privacy" className="text-primary hover:text-primary/80">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
