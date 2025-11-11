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
import { RecaptchaBadge } from "@/components/RecaptchaBadge";
import { validateRecaptcha, RecaptchaActions } from "@/lib/recaptcha-service";
import { rateLimiter } from "@/lib/advanced-rate-limiter";
import { BrandLogo } from "@/components/BrandLogo";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRTL, setIsRTL] = useState(true);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Detect language direction
  useEffect(() => {
    const checkLanguage = () => {
      const htmlDir = document.documentElement.dir;
      const htmlLang = document.documentElement.lang;
      setIsRTL(htmlDir === 'rtl' || htmlLang === 'ar');
    };
    
    checkLanguage();
    
    // Watch for language changes
    const observer = new MutationObserver(checkLanguage);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['dir', 'lang']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Check rate limit
      if (!rateLimiter.check(email, {
        maxRequests: 20,
        windowMs: 60000,
        blockDuration: 600000
      })) {
        throw new Error('محاولات كثيرة جداً. حاول بعد 10 دقائق');
      }

      // Validate reCAPTCHA
      const recaptchaResult = await validateRecaptcha(RecaptchaActions.LOGIN);
      if (!recaptchaResult.success) {
        throw new Error(recaptchaResult.error || 'فشل التحقق من reCAPTCHA');
      }

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
    <div className={`min-h-screen grid grid-cols-1 lg:grid-cols-2 ${!isRTL ? 'direction-ltr' : ''}`}>
      {/* Left Side - Branding (appears on right in RTL, left in LTR) */}
      <div className={`hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-9xl font-black tracking-tight">
              <span className="text-red-300">egy</span>
              <span className="text-white">go</span>
              <span className="text-red-100">.me</span>
            </div>
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

      {/* Right Side - Form (appears on left in RTL, right in LTR) */}
      <div className={`flex items-center justify-center p-6 lg:p-12 bg-background ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="text-center lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <BrandLogo size="xl" />
            </Link>
          </div>
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">مرحباً بعودتك</h2>
            <p className="text-muted-foreground">
              سجل دخولك للمتابعة
            </p>
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

              {/* reCAPTCHA Badge */}
              <RecaptchaBadge className="mt-2" />
          </form>

          {/* Divider */}
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
