import { ZodSchema, ZodError } from "zod";

/**
 * Helper function to validate form data with Zod
 * Returns validation result with field errors
 */
export function validateForm<T>(
  schema: ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  fieldErrors?: Record<string, string>;
  generalError?: string;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Extract field errors
  const fieldErrors: Record<string, string> = {};
  let generalError: string | undefined;

  result.error.errors.forEach((err) => {
    if (err.path.length > 0) {
      const field = err.path[0] as string;
      // Only keep first error for each field
      if (!fieldErrors[field]) {
        fieldErrors[field] = err.message;
      }
    } else {
      // General error (no specific field)
      generalError = err.message;
    }
  });

  return {
    success: false,
    fieldErrors,
    generalError: generalError || "يرجى التحقق من البيانات المدخلة",
  };
}

/**
 * Get first error message from validation result
 */
export function getFirstError(fieldErrors: Record<string, string>): string {
  const errors = Object.values(fieldErrors);
  return errors.length > 0 ? errors[0] : "خطأ في التحقق من البيانات";
}

/**
 * Format Zod error for display
 */
export function formatZodError(error: ZodError): string {
  const firstError = error.errors[0];
  if (!firstError) return "خطأ في التحقق من البيانات";
  
  const field = firstError.path.length > 0 ? firstError.path.join(".") : "";
  return field ? `${field}: ${firstError.message}` : firstError.message;
}
