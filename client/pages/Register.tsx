import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [accountType, setAccountType] = useState<'customer' | 'affiliate' | 'merchant'>('customer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if account type is specified in URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'affiliate' || type === 'merchant') {
      setAccountType(type);
    }
  }, [searchParams]);

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  // Redirect if already authenticated
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("يجب الموافقة على شروط الخدمة للمتابعة");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      // Register with account type
      await register(
        formData.email,
        formData.password,
        formData.name,
        accountType
      );

      // Redirect to appropriate page based on account type
      if (accountType === 'affiliate') {
        navigate("/affiliate/dashboard");
      } else if (accountType === 'merchant') {
        navigate("/merchant/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الحساب",
      );
      alert("حدث خطأ في إنشاء الحساب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-primary">
            إيجي جو
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            أو{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              تسجيل الدخول لحساب موجود
            </Link>
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>انضم إلى إيجي جو</CardTitle>
            <CardDescription>
              أنشئ حسابك واستمتع بتجربة تسوق م��يزة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <Label htmlFor="name">الاسم الكامل</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="أدخل اسمك الكامل"
                    value={formData.name}
                    onChange={handleChange("name")}
                    className="pr-10"
                  />
                </div>
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
                    value={formData.email}
                    onChange={handleChange("email")}
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
                    autoComplete="new-password"
                    required
                    placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                    value={formData.password}
                    onChange={handleChange("password")}
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

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    className="pr-10 pl-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <Label>نوع الحساب</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {/* Customer */}
                  <div
                    className={`flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      accountType === 'customer'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAccountType('customer')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      accountType === 'customer' ? 'border-primary' : 'border-gray-300'
                    }`}>
                      {accountType === 'customer' && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">🛒 عميل</div>
                      <p className="text-xs text-gray-600 mt-0.5">
                        تسوق واشتري المنتجات
                      </p>
                    </div>
                  </div>

                  {/* Affiliate */}
                  <div
                    className={`flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      accountType === 'affiliate'
                        ? 'border-brand-orange bg-brand-orange/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAccountType('affiliate')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      accountType === 'affiliate' ? 'border-brand-orange' : 'border-gray-300'
                    }`}>
                      {accountType === 'affiliate' && (
                        <div className="w-3 h-3 rounded-full bg-brand-orange" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-brand-orange">💰 مسوق بالعمولة</div>
                      <p className="text-xs text-brand-orange/80 mt-0.5">
                        اكسب عمولة تصل إلى 25% من كل عملية بيع
                      </p>
                    </div>
                  </div>

                  {/* Merchant */}
                  <div
                    className={`flex items-center space-x-3 rtl:space-x-reverse p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      accountType === 'merchant'
                        ? 'border-brand-purple bg-brand-purple/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setAccountType('merchant')}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      accountType === 'merchant' ? 'border-brand-purple' : 'border-gray-300'
                    }`}>
                      {accountType === 'merchant' && (
                        <div className="w-3 h-3 rounded-full bg-brand-purple" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-brand-purple">🏪 تاجر</div>
                      <p className="text-xs text-brand-purple/80 mt-0.5">
                        بيع منتجاتك على المنصة
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="accept-terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                  required
                />
                <Label
                  htmlFor="accept-terms"
                  className="text-sm cursor-pointer"
                >
                  أوافق على{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    شروط الخدمة
                  </Link>{" "}
                  و{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    سياسة الخصوصية
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    إنشاء الحساب
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

            {/* Social Registration Options */}
            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  console.log("التسجيل بـ Google");
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
                التسجيل بحساب Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  console.log("التسجيل بـ Facebook");
                }}
              >
                <svg
                  className="w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                التسجيل بحساب Facebook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
