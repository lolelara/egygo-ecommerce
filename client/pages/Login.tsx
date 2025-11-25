import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-[20rem] font-black tracking-tighter rotate-12 select-none">
              GO
            </div>
          </div>
        </div>

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/30 rounded-full blur-[100px]"
        />

        <div className="relative z-10 max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-3 text-6xl font-black mb-8 tracking-tight hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
            <span>إيجي جو</span>
          </Link>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl font-bold mb-12 leading-relaxed text-red-50"
          >
            وجهتك الأولى للتسوق الذكي <br />
            <span className="text-yellow-300">جودة.. سرعة.. توفير</span>
          </motion.p>

          <div className="space-y-6 mb-12">
            {[
              { icon: Check, text: "آلاف المنتجات المميزة بأسعار تنافسية" },
              { icon: Truck, text: "شحن سريع لجميع محافظات مصر" },
              { icon: Shield, text: "ضمان استرجاع ودفع آمن 100%" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg font-medium">{item.text}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400/20 p-2 rounded-full">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium mb-2 italic text-white/90">
                      "تجربة تسوق ممتازة، المنتجات وصلت في الموعد وبجودة عالية جداً. شكراً إيجي جو!"
                    </p>
                    <p className="text-sm text-white/70 font-bold">- أحمد محمد، القاهرة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form (appears on left in RTL, right in LTR) */}
      <div className={`flex items-center justify-center p-6 lg:p-12 bg-background relative ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2">
            <BrandLogo size="lg" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2 text-center lg:text-right">
            <h2 className="text-4xl font-bold tracking-tight text-foreground">مرحباً بعودتك 👋</h2>
            <p className="text-muted-foreground text-lg">
              سجل دخولك للمتابعة واستكشاف العروض
            </p>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <Shield className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">البريد الإلكتروني</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pr-12 h-12 text-lg bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base">كلمة المرور</Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-12 pl-12 h-12 text-lg bg-muted/30 border-muted-foreground/20 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-4 flex items-center focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="w-5 h-5 border-2"
              />
              <Label
                htmlFor="remember-me"
                className="text-sm cursor-pointer select-none"
              >
                تذكرني على هذا الجهاز
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري التحقق...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  تسجيل الدخول
                  <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                </div>
              )}
            </Button>

            {/* reCAPTCHA Badge */}
            <div className="flex justify-center opacity-80 scale-90">
              <RecaptchaBadge />
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                أو
              </span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              ليس لديك حساب؟{" "}
              <Link to="/register" className="text-primary font-bold hover:underline text-lg">
                أنشئ حساب جديد
              </Link>
            </p>

            {/* Affiliate Program */}
            <Link to="/affiliate" className="block group">
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 transition-all group-hover:shadow-md group-hover:scale-[1.02]">
                <div className="flex items-center justify-center gap-2 text-orange-700 dark:text-orange-400 font-bold">
                  <Sparkles className="w-5 h-5" />
                  انضم لبرنامج الشراكة واكسب معنا
                </div>
                <p className="text-sm text-orange-600/80 dark:text-orange-400/80 mt-1">
                  عمولات تصل إلى 25% على كل عملية بيع
                </p>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground pt-8">
            محمي بواسطة reCAPTCHA وتطبق{" "}
            <Link to="/privacy" className="underline hover:text-primary">الخصوصية</Link>
            {" "}و{" "}
            <Link to="/terms" className="underline hover:text-primary">الشروط</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
