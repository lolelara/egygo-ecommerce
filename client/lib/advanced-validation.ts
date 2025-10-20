import { z } from 'zod';

export const schemas = {
  egyptianPhone: z.string().regex(/^(010|011|012|015)\d{8}$/, 'رقم هاتف مصري غير صحيح'),
  
  email: z.string().email('بريد إلكتروني غير صحيح'),
  
  price: z.number()
    .min(0, 'السعر يجب أن يكون موجب')
    .max(1000000, 'السعر كبير جداً'),
  
  productName: z.string()
    .min(3, 'الاسم قصير جداً')
    .max(200, 'الاسم طويل جداً')
    .regex(/^[a-zA-Z0-9\u0600-\u06FF\s]+$/, 'أحرف غير مسموحة'),
  
  address: z.object({
    governorate: z.string().min(1, 'المحافظة مطلوبة'),
    city: z.string().min(1, 'المدينة مطلوبة'),
    street: z.string().min(5, 'اسم الشارع قصير جداً'),
    building: z.string().optional(),
    floor: z.string().optional(),
    apartment: z.string().optional(),
  }),
  
  orderData: z.object({
    customerName: z.string().min(2, 'الاسم قصير جداً'),
    phone: z.string().regex(/^(010|011|012|015)\d{8}$/, 'رقم هاتف غير صحيح'),
    address: z.string().min(10, 'العنوان قصير جداً'),
    items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number().min(0),
    })).min(1, 'يجب إضافة منتج واحد على الأقل'),
  }),
};

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(e => e.message),
      };
    }
    return { success: false, errors: ['خطأ في التحقق'] };
  }
}

export function validateField<T>(schema: z.ZodSchema<T>, data: unknown): string | null {
  try {
    schema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'خطأ في التحقق';
    }
    return 'خطأ في التحقق';
  }
}
