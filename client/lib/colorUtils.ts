/**
 * تحويل أسماء الألوان العربية إلى hex colors
 */

export interface ColorInfo {
  name: string;
  hex: string;
  textColor: string; // لون النص المناسب (أبيض أو أسود)
  border?: boolean; // إذا كان اللون يحتاج border (مثل الأبيض)
}

const arabicToHexMap: Record<string, string> = {
  // الألوان الأساسية
  'أسود': '#000000',
  'اسود': '#000000',
  'أبيض': '#FFFFFF',
  'ابيض': '#FFFFFF',
  'أحمر': '#DC2626',
  'احمر': '#DC2626',
  'أزرق': '#2563EB',
  'ازرق': '#2563EB',
  'أخضر': '#16A34A',
  'اخضر': '#16A34A',
  'أصفر': '#EAB308',
  'اصفر': '#EAB308',
  'برتقالي': '#F97316',
  'بني': '#78350F',
  'رمادي': '#6B7280',
  'رصاصي': '#6B7280',
  'بنفسجي': '#9333EA',
  'موف': '#9333EA',
  'وردي': '#EC4899',
  'زهري': '#EC4899',
  'فوشيا': '#DB2777',
  'سماوي': '#0EA5E9',
  'تركواز': '#14B8A6',
  'ذهبي': '#F59E0B',
  'فضي': '#D4D4D4',
  'بيج': '#D2B48C',
  'كريمي': '#F5F5DC',
  'نيلي': '#4F46E5',
  'كحلي': '#1E3A8A',
  'عنابي': '#7F1D1D',
  'زيتي': '#4D7C0F',
  'خمري': '#881337',
  'جملي': '#CA8A04',
  'كافيه': '#78350F',
  'هافان': '#8B4513', // لون بني محمر
  'سكري': '#FFE4B5',
  
  // ألوان إضافية شائعة
  'navy': '#1E3A8A',
  'maroon': '#7F1D1D',
  'olive': '#4D7C0F',
  'lime': '#65A30D',
  'coral': '#F97316',
  'salmon': '#FB923C',
  'khaki': '#D2B48C',
  'tan': '#D2B48C',
  'burgundy': '#7F1D1D',
};

const lightColors = ['أبيض', 'ابيض', 'أصفر', 'اصفر', 'كريمي', 'بيج', 'سكري', 'فضي'];

/**
 * تحويل اسم اللون العربي إلى hex
 */
export function getColorHex(arabicName: string): string {
  const normalized = arabicName.trim().toLowerCase();
  
  // بحث مباشر
  if (arabicToHexMap[normalized]) {
    return arabicToHexMap[normalized];
  }
  
  // بحث في المفاتيح بدون case sensitivity
  const foundKey = Object.keys(arabicToHexMap).find(
    key => key.toLowerCase() === normalized
  );
  
  if (foundKey) {
    return arabicToHexMap[foundKey];
  }
  
  // لون افتراضي إذا لم يُعثر على اللون
  return '#9CA3AF'; // رمادي
}

/**
 * تحديد لون النص المناسب (أبيض أو أسود) حسب خلفية اللون
 */
export function getTextColor(hexColor: string): string {
  // تحويل hex إلى RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // حساب luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // إذا كان اللون فاتح، استخدم نص أسود، وإلا أبيض
  return luminance > 0.6 ? '#000000' : '#FFFFFF';
}

/**
 * تحديد إذا كان اللون يحتاج border
 */
export function needsBorder(arabicName: string): boolean {
  return lightColors.some(c => arabicName.toLowerCase().includes(c.toLowerCase()));
}

/**
 * الحصول على معلومات كاملة عن اللون
 */
export function getColorInfo(arabicName: string): ColorInfo {
  const hex = getColorHex(arabicName);
  const textColor = getTextColor(hex);
  const border = needsBorder(arabicName);
  
  return {
    name: arabicName,
    hex,
    textColor,
    border,
  };
}

/**
 * تحويل قائمة ألوان عربية إلى معلومات كاملة
 */
export function getColorsInfo(arabicNames: string[]): ColorInfo[] {
  return arabicNames.map(name => getColorInfo(name));
}
