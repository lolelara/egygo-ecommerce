/**
 * تحويل أسماء الألوان العربية إلى hex colors
 */

export interface ColorInfo {
  name: string;
  hex: string;
  textColor: string; // لون النص المناسب (أبيض أو أسود)
  border?: boolean; // إذا كان اللون يحتاج border (مثل الأبيض)
}

/**
 * تحويل أسماء الألوان العربية إلى hex colors
 */

export interface ColorInfo {
  name: string;
  hex: string;
  textColor: string; // لون النص المناسب (أبيض أو أسود)
  border?: boolean; // إذا كان اللون يحتاج border (مثل الأبيض)
}

const colorMap: Record<string, string> = {
  // الألوان العربية
  'أسود': '#000000', 'اسود': '#000000',
  'أبيض': '#FFFFFF', 'abiad': '#FFFFFF', 'ابيض': '#FFFFFF',
  'أحمر': '#DC2626', 'احمر': '#DC2626',
  'أزرق': '#2563EB', 'ازرق': '#2563EB',
  'أخضر': '#16A34A', 'اخضر': '#16A34A',
  'أصفر': '#EAB308', 'اصفر': '#EAB308',
  'برتقالي': '#F97316',
  'بني': '#78350F',
  'رمادي': '#6B7280', 'رصاصي': '#6B7280',
  'بنفسجي': '#9333EA', 'موف': '#9333EA',
  'وردي': '#EC4899', 'زهري': '#EC4899', 'بمبي': '#EC4899',
  'فوشيا': '#DB2777',
  'سماوي': '#0EA5E9', 'لبني': '#0EA5E9',
  'تركواز': '#14B8A6',
  'ذهبي': '#F59E0B',
  'فضي': '#D4D4D4',
  'بيج': '#D2B48C',
  'كريمي': '#F5F5DC',
  'نيلي': '#4F46E5',
  'كحلي': '#1E3A8A',
  'عنابي': '#7F1D1D', 'نبيتي': '#7F1D1D',
  'زيتي': '#4D7C0F',
  'خمري': '#881337',
  'جملي': '#CA8A04',
  'كافيه': '#78350F',
  'هافان': '#8B4513',
  'سكري': '#FFE4B5',
  'نحاسي': '#B87333',
  'أرجواني': '#800080',
  'ليموني': '#DAF7A6',
  'خوخي': '#FFDAB9',
  'كاكي': '#F0E68C',
  'مارون': '#800000',
  'فيروزي': '#40E0D0',
  'بترولي': '#005F6A',

  // English Colors
  'black': '#000000',
  'white': '#FFFFFF',
  'red': '#DC2626',
  'blue': '#2563EB',
  'green': '#16A34A',
  'yellow': '#EAB308',
  'orange': '#F97316',
  'brown': '#78350F',
  'grey': '#6B7280', 'gray': '#6B7280',
  'purple': '#9333EA',
  'pink': '#EC4899',
  'fuchsia': '#DB2777',
  'cyan': '#0EA5E9',
  'turquoise': '#14B8A6',
  'gold': '#F59E0B',
  'silver': '#D4D4D4',
  'beige': '#D2B48C',
  'cream': '#F5F5DC',
  'indigo': '#4F46E5',
  'navy': '#1E3A8A',
  'maroon': '#7F1D1D',
  'olive': '#4D7C0F',
  'lime': '#65A30D',
  'coral': '#F97316',
  'salmon': '#FB923C',
  'khaki': '#D2B48C',
  'tan': '#D2B48C',
  'burgundy': '#7F1D1D',
  'teal': '#008080',
  'violet': '#EE82EE',
  'magenta': '#FF00FF',
  'lavender': '#E6E6FA',
  'peach': '#FFDAB9',
  'mint': '#98FF98',
  'apricot': '#FBCEB1',
  'mustard': '#FFDB58',
  'charcoal': '#36454F',
  'bronze': '#CD7F32',
  'copper': '#B87333',
  'rose': '#FF007F',
  'ruby': '#E0115F',
  'emerald': '#50C878',
  'sapphire': '#0F52BA',
  'ivory': '#FFFFF0',
  'wheat': '#F5DEB3',
  'azure': '#F0FFFF',
  'aquamarine': '#7FFFD4',
  'crimson': '#DC143C',
  'plum': '#DDA0DD',
  'orchid': '#DA70D6',
  'thistle': '#D8BFD8',
  'sienna': '#A0522D',
  'chocolate': '#D2691E',
  'peru': '#CD853F',
  'tomato': '#FF6347',
  'darkblue': '#00008B',
  'lightblue': '#ADD8E6',
  'darkgreen': '#006400',
  'lightgreen': '#90EE90',
};

const lightColors = [
  'أبيض', 'ابيض', 'أصفر', 'اصفر', 'كريمي', 'بيج', 'سكري', 'فضي', 'ليموني', 'خوخي', 'كاكي', 'white', 'yellow', 'cream', 'beige', 'silver', 'ivory', 'wheat', 'azure', 'lavender', 'mint', 'apricot', 'lightgreen', 'lightblue'
];

/**
 * تحويل اسم اللون إلى hex
 */
export function getColorHex(colorName: string): string {
  if (!colorName) return '#9CA3AF'; // Default gray

  const normalized = colorName.trim().toLowerCase();

  // بحث مباشر
  if (colorMap[normalized]) {
    return colorMap[normalized];
  }

  // بحث في المفاتيح بدون case sensitivity
  const foundKey = Object.keys(colorMap).find(
    key => key.toLowerCase() === normalized
  );

  if (foundKey) {
    return colorMap[foundKey];
  }

  // Check if it's already a hex code
  if (normalized.startsWith('#') && (normalized.length === 4 || normalized.length === 7)) {
    return normalized;
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
export function needsBorder(colorName: string): boolean {
  return lightColors.some(c => colorName.toLowerCase().includes(c.toLowerCase()));
}

/**
 * الحصول على معلومات كاملة عن اللون
 */
export function getColorInfo(colorName: string): ColorInfo {
  const hex = getColorHex(colorName);
  const textColor = getTextColor(hex);
  const border = needsBorder(colorName);

  return {
    name: colorName,
    hex,
    textColor,
    border,
  };
}

/**
 * تحويل قائمة ألوان إلى معلومات كاملة
 */
export function getColorsInfo(colorNames: string[]): ColorInfo[] {
  return colorNames.map(name => getColorInfo(name));
}
