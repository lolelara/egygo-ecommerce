import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Check, Star, Shield, Truck, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AppwriteAuthContext";
import { databases, appwriteConfig } from "@/lib/appwrite";
import { Query, ID } from "appwrite";
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

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternativePhone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  // Note: 'intermediary' role can only be activated by admin for existing customer accounts
  const [accountType, setAccountType] = useState<'customer' | 'affiliate' | 'merchant'>('customer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [phoneAvailableOnWhatsApp, setPhoneAvailableOnWhatsApp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [referrerInfo, setReferrerInfo] = useState<any>(null);

  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if account type is specified in URL
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'affiliate' || type === 'merchant') {
      setAccountType(type);
    }
    
    // Check for referral code in URL
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
      validateReferralCode(ref);
    }
  }, [searchParams]);
  
  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferrerInfo(null);
      return;
    }
    
    try {
      // Find user with this affiliate code
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.collections.userPreferences,
        [
          Query.equal('affiliateCode', code),
          Query.limit(1)
        ]
      );
      
      if (response.documents.length > 0) {
        setReferrerInfo(response.documents[0]);
      } else {
        setReferrerInfo(null);
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setReferrerInfo(null);
    }
  };

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

    if (!formData.phone) {
      setError("رقم الهاتف مطلوب");
      return;
    }

    if (!phoneAvailableOnWhatsApp) {
      setError("يجب تأكيد توفر رقم الهاتف على WhatsApp أو للاتصال");
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
      const registeredUser = await register(
        formData.email,
        formData.password,
        formData.name,
        accountType,
        formData.phone,
        formData.alternativePhone
      );

      // Create user preferences document for admin panel
      if (registeredUser) {
        try {
          // Create user preferences for the admin panel
          await databases.createDocument(
            appwriteConfig.databaseId,
            'userPreferences',
            ID.unique(),
            {
              userId: registeredUser.$id,
              email: formData.email,
              name: formData.name,
              phone: formData.phone || '',
              role: accountType === 'merchant' ? 'merchant' : 
                    accountType === 'affiliate' ? 'affiliate' : 'customer',
              accountStatus: accountType === 'customer' ? 'approved' : 'pending',
              isAdmin: false,
              isAffiliate: accountType === 'affiliate',
              isMerchant: accountType === 'merchant',
              isIntermediary: false,
              affiliateCode: accountType === 'affiliate' ? `AFF${Date.now()}` : '',
              intermediaryCode: '',
              defaultMarkupPercentage: 0,
              commissionRate: accountType === 'affiliate' ? 10 : 0,
              businessName: '',
              businessAddress: '',
              taxId: ''
            }
          );
          console.log('✅ User preferences created for admin panel');
          
          // If user was referred, create referral record
          if (formData.referralCode && referrerInfo) {
            try {
              await databases.createDocument(
                appwriteConfig.databaseId,
                'referrals',
                ID.unique(),
                {
                  referrerId: referrerInfo.userId,
                  referredUserId: registeredUser.$id,
                  referralCode: formData.referralCode,
                  status: 'pending', // Will be 'completed' after first purchase
                  createdAt: new Date().toISOString()
                }
              );
              console.log('✅ Referral record created');
              
              // Notify the referrer
              await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.notifications,
                'unique()',
                {
                  userId: referrerInfo.userId,
                  title: '🎉 إحالة جديدة!',
                  message: `قام ${formData.name} بالتسجيل باستخدام كود الإحالة الخاص بك`,
                  type: 'affiliate',
                  isRead: false,
                  link: '/affiliate/referrals'
                }
              );
            } catch (refError) {
              console.error('Error creating referral record:', refError);
            }
          }
        } catch (prefError) {
          console.error('Error creating user preferences:', prefError);
          // Don't block registration if preferences creation fails
        }

        // Create welcome notification
        try {
          await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.collections.notifications,
            'unique()',
            {
              userId: registeredUser.$id,
              title: '👋 مرحباً بك في إيجي جو',
              message: accountType === 'customer' 
                ? 'نتمنى لك تجربة تسوق ممتعة! ابدأ باستكشاف منتجاتنا الآن'
                : '⏳ تم استلام طلبك وجاري المراجعة. سنخطرك فوراً عند الموافقة على حسابك',
              type: 'info',
              isRead: false,
              link: accountType === 'customer' ? '/products' : undefined,
            }
          );
        } catch (notifError) {
          console.error('Error creating welcome notification:', notifError);
        }
      }

      // Show different messages based on account type
      if (accountType === 'affiliate' || accountType === 'merchant') {
        const accountTypeArabic = accountType === 'affiliate' ? 'مسوق' : 'تاجر';
        alert(
          `تم إنشاء حسابك كـ${accountTypeArabic} بنجاح!\n\n` +
          `⏳ حسابك قيد المراجعة من قبل الإدارة\n` +
          `📧 سيتم إخطارك عبر البريد الإلكتروني فور الموافقة\n` +
          `⚠️ لن تتمكن من الوصول لكامل المميزات حتى تتم الموافقة على حسابك`
        );
        navigate("/login");
      } else {
        // Customer accounts are active immediately
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 dark:from-neutral-900 dark:via-purple-950 dark:to-neutral-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* 3D Logo Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 scale-150">
        <div className="w-[600px] h-[600px]">
          <EgyGoLogo3D size="large" interactive={false} autoRotate={true} showParticles={false} />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <GSAPAnimation animation="fadeIn" duration={1}>
          <div className="text-center mb-2">
            <Link to="/" className="inline-flex items-center gap-2 text-4xl font-extrabold bg-gradient-to-r from-primary via-purple-600 to-secondary bg-clip-text text-transparent drop-shadow-lg">
              <Sparkles className="w-10 h-10 text-purple-600" />
              إيجي جو
            </Link>
            <h2 className="mt-4 text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              أهلاً بك في عالم التسوق الذكي
            </h2>
            <p className="mt-2 text-base text-gray-700 dark:text-gray-200">
              أنشئ حسابك الجديد وابدأ رحلتك معنا الآن
            </p>
            <p className="mt-2 text-sm text-gray-600">
              أو
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors mx-1"
              >
                تسجيل الدخول لحساب موجود
              </Link>
            </p>
          </div>
        </GSAPAnimation>

        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm font-medium shadow-lg animate-pulse">
            {error}
          </div>
        )}

        {/* Register Form */}
        <GSAPAnimation animation="slideUp" delay={0.2}>
          <Card className="shadow-2xl border-2 border-purple-200 dark:border-purple-800 backdrop-blur-sm bg-white/90 dark:bg-neutral-900/90">
          <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 dark:from-neutral-800 dark:to-neutral-800">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">انضم إلى إيجي جو</CardTitle>
            <CardDescription className="text-gray-700 dark:text-gray-200">
              استمتع بتجربة تسوق احترافية وميزات حصرية
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

              {/* Phone Field */}
              <div>
                <Label htmlFor="phone">
                  رقم الهاتف <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="مثال: 01012345678"
                    value={formData.phone}
                    onChange={handleChange("phone")}
                    className="pr-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  سيتم استخدام هذا الرقم للتواصل معك
                </p>
              </div>

              {/* WhatsApp Confirmation */}
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="whatsapp-available"
                  checked={phoneAvailableOnWhatsApp}
                  onCheckedChange={(checked) =>
                    setPhoneAvailableOnWhatsApp(!!checked)
                  }
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="whatsapp-available"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    هذا الرقم متاح على WhatsApp أو للاتصال <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    تأكد من إمكانية التواصل معك عبر هذا الرقم
                  </p>
                </div>
              </div>

              {/* Alternative Phone Field (Optional) */}
              <div>
                <Label htmlFor="alternativePhone">
                  رقم هاتف بديل (اختياري)
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <Input
                    id="alternativePhone"
                    name="alternativePhone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="رقم إضافي للتواصل (اختياري)"
                    value={formData.alternativePhone}
                    onChange={handleChange("alternativePhone")}
                    className="pr-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  يمكنك إضافة رقم آخر للتواصل معك
                </p>
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

              {/* Referral Code Field (Optional) */}
              <div>
                <Label htmlFor="referralCode">
                  كود الإحالة (اختياري)
                </Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Sparkles className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    placeholder="أدخل كود الإحالة إن وجد"
                    value={formData.referralCode}
                    onChange={(e) => {
                      handleChange("referralCode")(e);
                      validateReferralCode(e.target.value);
                    }}
                    className="pr-10"
                  />
                </div>
                {referrerInfo && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    ✓ تمت الإحالة من: {referrerInfo.name}
                  </p>
                )}
                {formData.referralCode && !referrerInfo && (
                  <p className="text-xs text-red-600 mt-1">
                    كود الإحالة غير صحيح
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  إذا كان لديك كود إحالة من أحد المسوقين، أدخله هنا
                </p>
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
                        اكسب عمولة على كل عملية بيع
                      </p>
                      <p className="text-xs text-amber-600 mt-1 font-medium">
                        ⏳ يتطلب موافقة الإدارة
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
                        اعرض وبع منتجاتك على المنصة
                      </p>
                      <p className="text-xs text-purple-600 mt-1 font-medium">
                        ⏳ يتطلب موافقة الإدارة
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
                size="lg"
                className="w-full h-14 bg-gradient-to-r from-primary via-purple-600 to-secondary text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                disabled={isLoading || !acceptTerms}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>إنشاء الحساب</span>
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                  </div>
                )}
              </Button>
              
              {/* Trust Signals */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 dark:text-green-400 font-semibold">آمن</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <Star className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 dark:text-blue-400 font-semibold">موثوق</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <Truck className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700 dark:text-purple-400 font-semibold">سريع</span>
                </div>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">
                    أو يمكنك التسجيل عبر
                  </span>
                </div>
              </div>
            </div>

            {/* Social Registration Options */}
            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 hover:border-primary"
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
                className="w-full border-gray-300 hover:border-primary"
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

            {/* Privacy Note */}
            <div className="text-xs text-gray-500 text-center mt-6">
              جميع بياناتك محمية وفق <Link to="/privacy" className="underline text-primary">سياسة الخصوصية</Link> الخاصة بنا.
            </div>
          </CardContent>
        </Card>
        </GSAPAnimation>
      </div>
    </div>
  );
}
