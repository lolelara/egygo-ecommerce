import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Check, Star, Shield, Truck, Phone, MapPin } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { GSAPAnimation } from "@/components/enhanced/GSAPAnimations";
import { RecaptchaBadge } from "@/components/RecaptchaBadge";
import { validateRecaptcha, RecaptchaActions } from "@/lib/recaptcha-service";
import { egyptGovernorates, getCitiesByGovernorate } from "@/lib/egypt-locations";
import { rateLimiter } from "@/lib/advanced-rate-limiter";
import { validateInput, schemas } from "@/lib/advanced-validation";

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
    governorate: "",
    city: "",
  });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  // Note: 'intermediary' role can only be activated by admin for existing customer accounts
  const [accountType, setAccountType] = useState<'customer' | 'affiliate' | 'merchant'>('customer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [phoneAvailableOnWhatsApp, setPhoneAvailableOnWhatsApp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [referrerInfo, setReferrerInfo] = useState<any>(null);
  const [isRTL, setIsRTL] = useState(true);

  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  // Handle governorate change
  const handleGovernorateChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      governorate: value,
      city: "", // Reset city when governorate changes
    }));
    
    // Update available cities
    const cities = getCitiesByGovernorate(value);
    setAvailableCities(cities.map(c => c.nameAr));
  };

  // Handle city change
  const handleCityChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      city: value,
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

    // Check rate limit
    if (!rateLimiter.check(formData.email, {
      maxRequests: 20,
      windowMs: 60000,
      blockDuration: 600000
    })) {
      setError('محاولات كثيرة جداً. حاول بعد 10 دقائق');
      return;
    }

    // Validate phone
    const phoneValidation = validateInput(schemas.egyptianPhone, formData.phone);
    if (!phoneValidation.success) {
      setError(phoneValidation.errors?.[0] || 'رقم هاتف غير صحيح');
      return;
    }

    // Validate email
    const emailValidation = validateInput(schemas.email, formData.email);
    if (!emailValidation.success) {
      setError(emailValidation.errors?.[0] || 'بريد إلكتروني غير صحيح');
      return;
    }

    if (!acceptTerms) {
      setError("يجب الموافقة على شروط الخدمة للمتابعة");
      return;
    }

    if (!formData.phone) {
      setError("رقم الهاتف مطلوب");
      return;
    }

    if (!formData.governorate) {
      setError("المحافظة مطلوبة");
      return;
    }

    if (!formData.city) {
      setError("المركز/المدينة مطلوب");
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
      // Validate reCAPTCHA
      const recaptchaResult = await validateRecaptcha(RecaptchaActions.REGISTER);
      if (!recaptchaResult.success) {
        throw new Error(recaptchaResult.error || 'فشل التحقق من reCAPTCHA');
      }

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
              governorate: formData.governorate,
              city: formData.city,
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
              console.log('Creating referral record:', {
                referrerId: referrerInfo.userId,
                referredUserId: registeredUser.$id,
                code: formData.referralCode
              });
              
              const referralDoc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.collections.referrals,
                ID.unique(),
                {
                  referrerId: referrerInfo.userId,
                  referredUserId: registeredUser.$id,
                  referredUserName: formData.name,
                  referredUserEmail: formData.email,
                  status: 'pending', // Will be 'completed' after first purchase
                  reward: 0, // Will be updated after first purchase
                  level: 1 // First level referral
                }
              );
              console.log('✅ Referral record created:', referralDoc.$id);
              
              // Notify the referrer
              try {
                await databases.createDocument(
                  appwriteConfig.databaseId,
                  appwriteConfig.collections.notifications,
                  ID.unique(),
                  {
                    userId: referrerInfo.userId,
                    title: '🎉 إحالة جديدة!',
                    message: `قام ${formData.name} بالتسجيل باستخدام كود الإحالة الخاص بك`,
                    type: 'affiliate',
                    read: false,
                    relatedId: registeredUser.$id,
                    metadata: JSON.stringify({
                      referralCode: formData.referralCode,
                      newUserName: formData.name,
                      link: '/affiliate/referrals'
                    })
                  }
                );
                console.log('✅ Referrer notification sent');
              } catch (notifError) {
                console.error('Error sending referrer notification:', notifError);
              }
            } catch (refError) {
              console.error('❌ Error creating referral record:', refError);
              console.error('Referral error details:', {
                message: refError.message,
                type: refError.type,
                referrerInfo: referrerInfo
              });
            }
          } else {
            console.log('No referral code or referrer info:', {
              hasCode: !!formData.referralCode,
              hasReferrerInfo: !!referrerInfo
            });
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
            ID.unique(),
            {
              userId: registeredUser.$id,
              title: '👋 مرحباً بك في إيجي جو',
              message: accountType === 'customer' 
                ? 'نتمنى لك تجربة تسوق ممتعة! ابدأ باستكشاف منتجاتنا الآن'
                : '⏳ تم استلام طلبك وجاري المراجعة. سنخطرك فوراً عند الموافقة على حسابك',
              type: 'info',
              read: false,
              relatedId: registeredUser.$id,
              metadata: JSON.stringify({
                accountType: accountType,
                link: accountType === 'customer' ? '/products' : undefined
              })
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
<div className={`min-h-screen grid grid-cols-1 lg:grid-cols-2 ${!isRTL ? 'direction-ltr' : ''}`}>
{/* Left Side - Branding (appears on right in RTL, left in LTR) */}
<div className={`hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden ${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
<div className="absolute inset-0 opacity-10">
<div className="w-full h-full flex items-center justify-center scale-150">
<img src="/logo.jpg" alt="EgyGo" className="max-w-[70%] h-auto object-contain" />
</div>
</div>
<div className="relative z-10 max-w-md">
<Link to="/" className="inline-flex items-center gap-2 text-5xl font-bold mb-6">
<Sparkles className="w-12 h-12" />
إيجي جو
</Link>
<p className="text-2xl mb-8 opacity-90">انضم إلى عائلة إيجي جو</p>
<div className="space-y-4 mb-8">
<div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"><Check className="h-6 w-6" /></div><div>حساب واحد لجميع الخدمات</div></div>
<div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"><Star className="h-6 w-6" /></div><div>عمولات مميزة للتجار والمسوقين</div></div>
<div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"><Shield className="h-6 w-6" /></div><div>بيانات آمنة ومشفرة</div></div>
<div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"><Truck className="h-6 w-6" /></div><div>توصيل سريع وآمن</div></div>
</div>
<Card className="bg-white/10 backdrop-blur border-white/20">
<CardContent className="p-4">
<div className="flex items-start gap-3">
<Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
<div>
<p className="text-sm opacity-90 mb-2">"تجربة رائعة! التسجيل سهل والمنصة احترافية جداً"</p>
<p className="text-xs opacity-75">- أحمد محمد، تاجر شريك</p>
</div>
</div>
</CardContent>
</Card>
</div>
</div>
      {/* Right Side - Form (appears on left in RTL, right in LTR) */}
      <div className={`flex items-center justify-center p-6 lg:p-12 bg-background overflow-y-auto ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              إنشاء حساب جديد
            </h2>
            <p className="mt-2 text-muted-foreground">
              املأ البيانات للبدء
            </p>
            <p className="mt-2 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-center text-sm font-medium">
              {error}
            </div>
          )}

          {/* Register Form */}
          <Card className="shadow-lg">
          <CardContent className="pt-6">
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

              {/* Governorate Field */}
              <div>
                <Label htmlFor="governorate">
                  المحافظة <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.governorate}
                  onValueChange={handleGovernorateChange}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="اختر المحافظة" />
                  </SelectTrigger>
                  <SelectContent>
                    {egyptGovernorates.map((gov) => (
                      <SelectItem key={gov.name} value={gov.nameAr}>
                        {gov.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Field */}
              <div>
                <Label htmlFor="city">
                  المركز/المدينة <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.city}
                  onValueChange={handleCityChange}
                  disabled={!formData.governorate}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={formData.governorate ? "اختر المركز/المدينة" : "اختر المحافظة أولاً"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                      <p className="text-xs text-red-600 mt-1 font-medium">
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
                className="w-full h-14 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
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

              {/* reCAPTCHA Badge */}
              <RecaptchaBadge className="mt-2" />
              
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
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <Truck className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 dark:text-red-400 font-semibold">سريع</span>
                </div>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-6">
            </div>

            {/* Privacy Note */}
            <div className="text-xs text-muted-foreground text-center mt-6">
              جميع بياناتك محمية وفق <Link to="/privacy" className="underline text-primary">سياسة الخصوصية</Link> الخاصة بنا.
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
