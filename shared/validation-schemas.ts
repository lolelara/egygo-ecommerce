import { z } from "zod";

/**
 * Custom error messages in Arabic
 */
const arabicErrors = {
  required: "هذا الحقل مطلوب",
  email: "البريد الإلكتروني غير صالح",
  minLength: (min: number) => `يجب أن يحتوي على ${min} أحرف على الأقل`,
  maxLength: (max: number) => `يجب ألا يتجاوز ${max} حرف`,
  positive: "يجب أن تكون القيمة موجبة",
  min: (min: number) => `يجب أن تكون القيمة ${min} على الأقل`,
  max: (max: number) => `يجب ألا تتجاوز القيمة ${max}`,
  url: "الرابط غير صالح",
  phone: "رقم الهاتف غير صالح",
  password: "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل",
  passwordMatch: "كلمات المرور غير متطابقة",
};

/**
 * Authentication Schemas
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: arabicErrors.required })
    .email(arabicErrors.email),
  password: z
    .string({ required_error: arabicErrors.required })
    .min(8, arabicErrors.password),
});

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: arabicErrors.required })
      .min(2, arabicErrors.minLength(2))
      .max(100, arabicErrors.maxLength(100)),
    email: z
      .string({ required_error: arabicErrors.required })
      .email(arabicErrors.email),
    password: z
      .string({ required_error: arabicErrors.required })
      .min(8, arabicErrors.password)
      .max(100, arabicErrors.maxLength(100)),
    confirmPassword: z
      .string({ required_error: arabicErrors.required })
      .min(8, arabicErrors.password),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          // Egyptian phone number format: 01[0-2,5][0-9]{8}
          return /^01[0125][0-9]{8}$/.test(val);
        },
        { message: "رقم الهاتف يجب أن يكون بصيغة مصرية صحيحة (مثال: 01012345678)" }
      ),
    accountType: z
      .enum(["customer", "affiliate", "merchant"])
      .default("customer"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: arabicErrors.passwordMatch,
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: arabicErrors.required })
    .email(arabicErrors.email),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: arabicErrors.required })
      .min(8, arabicErrors.password)
      .max(100, arabicErrors.maxLength(100)),
    confirmPassword: z
      .string({ required_error: arabicErrors.required })
      .min(8, arabicErrors.password),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: arabicErrors.passwordMatch,
    path: ["confirmPassword"],
  });

/**
 * Product Schemas
 */
export const productSchema = z.object({
  name: z
    .string({ required_error: arabicErrors.required })
    .min(3, arabicErrors.minLength(3))
    .max(200, arabicErrors.maxLength(200)),
  description: z
    .string({ required_error: arabicErrors.required })
    .min(10, arabicErrors.minLength(10))
    .max(2000, arabicErrors.maxLength(2000)),
  price: z
    .number({ required_error: arabicErrors.required })
    .positive(arabicErrors.positive)
    .min(1, arabicErrors.min(1)),
  originalPrice: z
    .number()
    .positive(arabicErrors.positive)
    .optional()
    .refine(
      (val) => val === undefined || val === 0 || val > 0,
      { message: "السعر الأصلي يجب أن يكون موجباً أو صفر" }
    ),
  categoryId: z
    .string({ required_error: "يجب اختيار الفئة" })
    .min(1, "يجب اختيار الفئة"),
  images: z
    .array(z.string().url(arabicErrors.url))
    .min(1, "يجب إضافة صورة واحدة على الأقل")
    .max(5, "يمكن إضافة 5 صور كحد أقصى"),
  tags: z
    .array(z.string())
    .optional()
    .default([]),
  stockQuantity: z
    .number()
    .int("يجب أن يكون عدد صحيح")
    .min(0, "الكمية لا يمكن أن تكون سالبة")
    .default(100),
  affiliateCommission: z
    .number()
    .min(0, arabicErrors.min(0))
    .max(100, "نسبة العمولة يجب ألا تتجاوز 100%")
    .default(8),
});

/**
 * Category Schemas
 */
export const categorySchema = z.object({
  name: z
    .string({ required_error: arabicErrors.required })
    .min(2, arabicErrors.minLength(2))
    .max(100, arabicErrors.maxLength(100)),
  description: z
    .string()
    .min(10, arabicErrors.minLength(10))
    .max(500, arabicErrors.maxLength(500))
    .optional(),
  slug: z
    .string({ required_error: arabicErrors.required })
    .min(2, arabicErrors.minLength(2))
    .max(100, arabicErrors.maxLength(100))
    .regex(
      /^[a-z0-9-]+$/,
      "الرمز يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط"
    ),
  icon: z
    .string()
    .url(arabicErrors.url)
    .optional(),
});

/**
 * Order Schemas
 */
export const checkoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z
      .string({ required_error: arabicErrors.required })
      .min(3, arabicErrors.minLength(3))
      .max(100, arabicErrors.maxLength(100)),
    phone: z
      .string({ required_error: arabicErrors.required })
      .regex(
        /^01[0125][0-9]{8}$/,
        "رقم الهاتف يجب أن يكون بصيغة مصرية صحيحة (مثال: 01012345678)"
      ),
    address: z
      .string({ required_error: arabicErrors.required })
      .min(10, arabicErrors.minLength(10))
      .max(500, arabicErrors.maxLength(500)),
    city: z
      .string({ required_error: arabicErrors.required })
      .min(2, arabicErrors.minLength(2))
      .max(100, arabicErrors.maxLength(100)),
    governorate: z
      .string({ required_error: arabicErrors.required })
      .min(2, arabicErrors.minLength(2))
      .max(100, arabicErrors.maxLength(100)),
    postalCode: z
      .string()
      .optional(),
  }),
  paymentMethod: z.enum(["cash", "card", "wallet"], {
    required_error: "يجب اختيار طريقة الدفع",
  }),
  notes: z
    .string()
    .max(500, arabicErrors.maxLength(500))
    .optional(),
});

/**
 * Review Schema
 */
export const reviewSchema = z.object({
  rating: z
    .number({ required_error: arabicErrors.required })
    .int("التقييم يجب أن يكون عدد صحيح")
    .min(1, "التقييم يجب أن يكون من 1 إلى 5")
    .max(5, "التقييم يجب أن يكون من 1 إلى 5"),
  comment: z
    .string({ required_error: arabicErrors.required })
    .min(10, arabicErrors.minLength(10))
    .max(1000, arabicErrors.maxLength(1000)),
});

/**
 * Contact Form Schema
 */
export const contactSchema = z.object({
  name: z
    .string({ required_error: arabicErrors.required })
    .min(2, arabicErrors.minLength(2))
    .max(100, arabicErrors.maxLength(100)),
  email: z
    .string({ required_error: arabicErrors.required })
    .email(arabicErrors.email),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^01[0125][0-9]{8}$/.test(val);
      },
      { message: "رقم الهاتف يجب أن يكون بصيغة مصرية صحيحة (مثال: 01012345678)" }
    ),
  subject: z
    .string({ required_error: arabicErrors.required })
    .min(5, arabicErrors.minLength(5))
    .max(200, arabicErrors.maxLength(200)),
  message: z
    .string({ required_error: arabicErrors.required })
    .min(20, arabicErrors.minLength(20))
    .max(2000, arabicErrors.maxLength(2000)),
});

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
  name: z
    .string({ required_error: arabicErrors.required })
    .min(2, arabicErrors.minLength(2))
    .max(100, arabicErrors.maxLength(100)),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^01[0125][0-9]{8}$/.test(val);
      },
      { message: "رقم الهاتف يجب أن يكون بصيغة مصرية صحيحة (مثال: 01012345678)" }
    ),
  bio: z
    .string()
    .max(500, arabicErrors.maxLength(500))
    .optional(),
});

/**
 * Type exports
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
