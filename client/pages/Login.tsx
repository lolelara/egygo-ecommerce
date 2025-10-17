import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Check, Star, Shield, Truck } from "lucide-react";
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
import { GSAPAnimation } from "@/components/enhanced/GSAPAnimations";
import EgyGoLogo3D from "@/components/enhanced/EgyGoLogo3D";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogle, loginWithFacebook, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Login successful - user will be updated via context
      // Navigation will happen in useEffect below
    } catch (err: any) {
      setError(
        err?.message || "حدث خطأ أثناء تسجيل الدخول",
      );
      setIsLoading(false);
    }
  };

  // Smart redirect when user is authenticated
  useEffect(() => {
    if (user && !isLoading) {
      // 1. Check if there's a saved redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath && !redirectPath.includes('/login') && !redirectPath.includes('/register')) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
        return;
      }

      // 2. Redirect based on user role
      if (user.role === 'admin') {
        navigate("/admin");
      } else if (user.isMerchant) {
        navigate("/merchant/dashboard");
      } else if (user.isAffiliate) {
        navigate("/affiliate/dashboard");
      } else if (user.isIntermediary) {
        navigate("/intermediary/dashboard");
      } else {
        // Regular customer - go to homepage
        navigate("/");
      }
    }
  }, [user, isLoading, navigate]);

  // Don't render login form if already authenticated
  if (user) {
    return null; // useEffect will handle redirect
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-primary via-purple-600 to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full flex items-center justify-center scale-150">
            <EgyGoLogo3D size="large" interactive={false} autoRotate={true} showParticles={false} />
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-5xl font-bold mb-6">
            <Sparkles className="w-12 h-12" />
            إيجي جو
          </Link>
          <p className="text-2xl mb-8 opacity-90">
            التسوق الذكي يبدأ هنا
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div>آلاف المنتجات المميزة</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Truck className="h-6 w-6" />
              </div>
              <div>توصيل سريع وآمن</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div>استرجاع سهل خلال 14 يوم</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <div>دفع آمن 100%</div>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm mb-1">
                    "أفضل موقع تسوق استخدمته! المنتجات عالية الجودة"
                  </p>
                  <p className="text-xs opacity-75">- أحمد محمد، القاهرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent">
              <Sparkles className="w-8 h-8 text-purple-600" />
              إيجي جو
            </Link>
          </div>
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">مرحباً بعودتك</h2>
            <p className="text-muted-foreground">
              سجل دخولك للمتابعة
            </p>
          </div>

          {/* Social Login First */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                loginWithGoogle().catch((err) => {
                  setError("حدث خطأ أثناء تسجيل الدخول بـ Google");
                  console.error(err);
                });
              }}
            >
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              تسجيل الدخول بجوجل
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                loginWithFacebook().catch((err) => {
                  setError("حدث خطأ أثناء تسجيل الدخول بـ Facebook");
                  console.error(err);
                });
              }}
            >
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              تسجيل الدخول بفيسبوك
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                أو
              </span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-md shadow-sm">
                  {error}
                </div>
              )}

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
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" disabled={isLoading}>
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

          {/* Sign Up Link */}
          <div className="text-center text-sm mt-6">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              سجل الآن
            </Link>
          </div>

          {/* Affiliate Program */}
          <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-200 dark:border-orange-800">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-semibold mb-1">
                💰 انضم لبرنامج الشراكة
              </p>
              <Link to="/affiliate" className="text-sm text-orange-600 hover:underline">
                اكسب عمولة تصل إلى 25%
              </Link>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            بتسجيل الدخول، فإنك توافق على{" "}
            <Link to="/terms" className="hover:underline">شروط الخدمة</Link>
            {" "}و{" "}
            <Link to="/privacy" className="hover:underline">سياسة الخصوصية</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
