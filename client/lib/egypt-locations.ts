/**
 * Egypt Governorates and Cities
 * محافظات ومراكز مصر
 */

export interface City {
  name: string;
  nameAr: string;
}

export interface Governorate {
  name: string;
  nameAr: string;
  cities: City[];
}

export const egyptGovernorates: Governorate[] = [
  {
    name: 'Cairo',
    nameAr: 'القاهرة',
    cities: [
      { name: 'Nasr City', nameAr: 'مدينة نصر' },
      { name: 'Heliopolis', nameAr: 'مصر الجديدة' },
      { name: 'Maadi', nameAr: 'المعادي' },
      { name: 'Zamalek', nameAr: 'الزمالك' },
      { name: 'Downtown', nameAr: 'وسط البلد' },
      { name: 'Shubra', nameAr: 'شبرا' },
      { name: 'Ain Shams', nameAr: 'عين شمس' },
      { name: 'Helwan', nameAr: 'حلوان' },
      { name: 'New Cairo', nameAr: 'القاهرة الجديدة' },
      { name: 'Mokattam', nameAr: 'المقطم' },
    ],
  },
  {
    name: 'Giza',
    nameAr: 'الجيزة',
    cities: [
      { name: 'Dokki', nameAr: 'الدقي' },
      { name: 'Mohandessin', nameAr: 'المهندسين' },
      { name: 'Agouza', nameAr: 'العجوزة' },
      { name: '6th of October', nameAr: '6 أكتوبر' },
      { name: 'Sheikh Zayed', nameAr: 'الشيخ زايد' },
      { name: 'Haram', nameAr: 'الهرم' },
      { name: 'Faisal', nameAr: 'فيصل' },
      { name: 'Imbaba', nameAr: 'إمبابة' },
      { name: 'Bulaq Al Dakrour', nameAr: 'بولاق الدكرور' },
    ],
  },
  {
    name: 'Alexandria',
    nameAr: 'الإسكندرية',
    cities: [
      { name: 'Montaza', nameAr: 'المنتزه' },
      { name: 'Sidi Gaber', nameAr: 'سيدي جابر' },
      { name: 'Miami', nameAr: 'ميامي' },
      { name: 'Smouha', nameAr: 'سموحة' },
      { name: 'Stanley', nameAr: 'ستانلي' },
      { name: 'Sporting', nameAr: 'سبورتنج' },
      { name: 'Agami', nameAr: 'العجمي' },
      { name: 'Borg El Arab', nameAr: 'برج العرب' },
      { name: 'Amreya', nameAr: 'العامرية' },
    ],
  },
  {
    name: 'Qalyubia',
    nameAr: 'القليوبية',
    cities: [
      { name: 'Banha', nameAr: 'بنها' },
      { name: 'Qalyub', nameAr: 'قليوب' },
      { name: 'Shubra El Kheima', nameAr: 'شبرا الخيمة' },
      { name: 'Obour', nameAr: 'العبور' },
      { name: 'Khanka', nameAr: 'الخانكة' },
      { name: 'Kafr Shukr', nameAr: 'كفر شكر' },
      { name: 'Toukh', nameAr: 'طوخ' },
    ],
  },
  {
    name: 'Sharqia',
    nameAr: 'الشرقية',
    cities: [
      { name: 'Zagazig', nameAr: 'الزقازيق' },
      { name: '10th of Ramadan', nameAr: 'العاشر من رمضان' },
      { name: 'Bilbeis', nameAr: 'بلبيس' },
      { name: 'Abu Hammad', nameAr: 'أبو حماد' },
      { name: 'Faqous', nameAr: 'فاقوس' },
      { name: 'Minya El Qamh', nameAr: 'منيا القمح' },
    ],
  },
  {
    name: 'Dakahlia',
    nameAr: 'الدقهلية',
    cities: [
      { name: 'Mansoura', nameAr: 'المنصورة' },
      { name: 'Talkha', nameAr: 'طلخا' },
      { name: 'Mit Ghamr', nameAr: 'ميت غمر' },
      { name: 'Dekernes', nameAr: 'دكرنس' },
      { name: 'Aga', nameAr: 'أجا' },
      { name: 'Manzala', nameAr: 'المنزلة' },
    ],
  },
  {
    name: 'Beheira',
    nameAr: 'البحيرة',
    cities: [
      { name: 'Damanhour', nameAr: 'دمنهور' },
      { name: 'Kafr El Dawwar', nameAr: 'كفر الدوار' },
      { name: 'Rashid', nameAr: 'رشيد' },
      { name: 'Edku', nameAr: 'إدكو' },
      { name: 'Abu Hummus', nameAr: 'أبو حمص' },
    ],
  },
  {
    name: 'Gharbia',
    nameAr: 'الغربية',
    cities: [
      { name: 'Tanta', nameAr: 'طنطا' },
      { name: 'Mahalla El Kubra', nameAr: 'المحلة الكبرى' },
      { name: 'Kafr El Zayat', nameAr: 'كفر الزيات' },
      { name: 'Zefta', nameAr: 'زفتى' },
      { name: 'Samanoud', nameAr: 'سمنود' },
    ],
  },
  {
    name: 'Monufia',
    nameAr: 'المنوفية',
    cities: [
      { name: 'Shibin El Kom', nameAr: 'شبين الكوم' },
      { name: 'Menouf', nameAr: 'منوف' },
      { name: 'Ashmoun', nameAr: 'أشمون' },
      { name: 'Quesna', nameAr: 'قويسنا' },
      { name: 'Berket El Saba', nameAr: 'بركة السبع' },
    ],
  },
  {
    name: 'Kafr El Sheikh',
    nameAr: 'كفر الشيخ',
    cities: [
      { name: 'Kafr El Sheikh', nameAr: 'كفر الشيخ' },
      { name: 'Desouk', nameAr: 'دسوق' },
      { name: 'Fuwwah', nameAr: 'فوه' },
      { name: 'Metoubes', nameAr: 'مطوبس' },
      { name: 'Baltim', nameAr: 'بلطيم' },
    ],
  },
  {
    name: 'Damietta',
    nameAr: 'دمياط',
    cities: [
      { name: 'Damietta', nameAr: 'دمياط' },
      { name: 'New Damietta', nameAr: 'دمياط الجديدة' },
      { name: 'Ras El Bar', nameAr: 'رأس البر' },
      { name: 'Faraskour', nameAr: 'فارسكور' },
      { name: 'Zarqa', nameAr: 'الزرقا' },
    ],
  },
  {
    name: 'Port Said',
    nameAr: 'بورسعيد',
    cities: [
      { name: 'Port Said', nameAr: 'بورسعيد' },
      { name: 'Port Fouad', nameAr: 'بور فؤاد' },
    ],
  },
  {
    name: 'Ismailia',
    nameAr: 'الإسماعيلية',
    cities: [
      { name: 'Ismailia', nameAr: 'الإسماعيلية' },
      { name: 'Fayed', nameAr: 'فايد' },
      { name: 'Qantara', nameAr: 'القنطرة' },
      { name: 'Abu Suwir', nameAr: 'أبو صوير' },
    ],
  },
  {
    name: 'Suez',
    nameAr: 'السويس',
    cities: [
      { name: 'Suez', nameAr: 'السويس' },
      { name: 'Ain Sokhna', nameAr: 'العين السخنة' },
      { name: 'Ataka', nameAr: 'عتاقة' },
    ],
  },
  {
    name: 'North Sinai',
    nameAr: 'شمال سيناء',
    cities: [
      { name: 'Arish', nameAr: 'العريش' },
      { name: 'Rafah', nameAr: 'رفح' },
      { name: 'Sheikh Zuweid', nameAr: 'الشيخ زويد' },
      { name: 'Bir al-Abed', nameAr: 'بئر العبد' },
    ],
  },
  {
    name: 'South Sinai',
    nameAr: 'جنوب سيناء',
    cities: [
      { name: 'Sharm El Sheikh', nameAr: 'شرم الشيخ' },
      { name: 'Dahab', nameAr: 'دهب' },
      { name: 'Nuweiba', nameAr: 'نويبع' },
      { name: 'Taba', nameAr: 'طابا' },
      { name: 'Saint Catherine', nameAr: 'سانت كاترين' },
    ],
  },
  {
    name: 'Fayoum',
    nameAr: 'الفيوم',
    cities: [
      { name: 'Fayoum', nameAr: 'الفيوم' },
      { name: 'Ibshaway', nameAr: 'إبشواي' },
      { name: 'Tamiya', nameAr: 'طامية' },
      { name: 'Sinnuris', nameAr: 'سنورس' },
    ],
  },
  {
    name: 'Beni Suef',
    nameAr: 'بني سويف',
    cities: [
      { name: 'Beni Suef', nameAr: 'بني سويف' },
      { name: 'Nasser', nameAr: 'ناصر' },
      { name: 'Beba', nameAr: 'ببا' },
      { name: 'Fashn', nameAr: 'الفشن' },
    ],
  },
  {
    name: 'Minya',
    nameAr: 'المنيا',
    cities: [
      { name: 'Minya', nameAr: 'المنيا' },
      { name: 'Mallawi', nameAr: 'ملوي' },
      { name: 'Samalut', nameAr: 'سمالوط' },
      { name: 'Matay', nameAr: 'مطاي' },
      { name: 'Beni Mazar', nameAr: 'بني مزار' },
    ],
  },
  {
    name: 'Assiut',
    nameAr: 'أسيوط',
    cities: [
      { name: 'Assiut', nameAr: 'أسيوط' },
      { name: 'Dayrout', nameAr: 'ديروط' },
      { name: 'Manfalut', nameAr: 'منفلوط' },
      { name: 'Abu Tig', nameAr: 'أبو تيج' },
    ],
  },
  {
    name: 'Sohag',
    nameAr: 'سوهاج',
    cities: [
      { name: 'Sohag', nameAr: 'سوهاج' },
      { name: 'Akhmim', nameAr: 'أخميم' },
      { name: 'Girga', nameAr: 'جرجا' },
      { name: 'Dar El Salam', nameAr: 'دار السلام' },
    ],
  },
  {
    name: 'Qena',
    nameAr: 'قنا',
    cities: [
      { name: 'Qena', nameAr: 'قنا' },
      { name: 'Nag Hammadi', nameAr: 'نجع حمادي' },
      { name: 'Qus', nameAr: 'قوص' },
      { name: 'Dishna', nameAr: 'دشنا' },
    ],
  },
  {
    name: 'Luxor',
    nameAr: 'الأقصر',
    cities: [
      { name: 'Luxor', nameAr: 'الأقصر' },
      { name: 'Esna', nameAr: 'إسنا' },
      { name: 'Armant', nameAr: 'أرمنت' },
    ],
  },
  {
    name: 'Aswan',
    nameAr: 'أسوان',
    cities: [
      { name: 'Aswan', nameAr: 'أسوان' },
      { name: 'Kom Ombo', nameAr: 'كوم أمبو' },
      { name: 'Edfu', nameAr: 'إدفو' },
      { name: 'Daraw', nameAr: 'دراو' },
    ],
  },
  {
    name: 'Red Sea',
    nameAr: 'البحر الأحمر',
    cities: [
      { name: 'Hurghada', nameAr: 'الغردقة' },
      { name: 'Safaga', nameAr: 'سفاجا' },
      { name: 'Marsa Alam', nameAr: 'مرسى علم' },
      { name: 'Quseer', nameAr: 'القصير' },
    ],
  },
  {
    name: 'New Valley',
    nameAr: 'الوادي الجديد',
    cities: [
      { name: 'Kharga', nameAr: 'الخارجة' },
      { name: 'Dakhla', nameAr: 'الداخلة' },
      { name: 'Farafra', nameAr: 'الفرافرة' },
      { name: 'Balat', nameAr: 'بلاط' },
    ],
  },
  {
    name: 'Matrouh',
    nameAr: 'مطروح',
    cities: [
      { name: 'Marsa Matrouh', nameAr: 'مرسى مطروح' },
      { name: 'El Alamein', nameAr: 'العلمين' },
      { name: 'Sidi Barrani', nameAr: 'سيدي براني' },
      { name: 'Siwa', nameAr: 'سيوة' },
    ],
  },
];

/**
 * Get cities by governorate name
 */
export function getCitiesByGovernorate(governorateName: string): City[] {
  const governorate = egyptGovernorates.find(
    (g) => g.name === governorateName || g.nameAr === governorateName
  );
  return governorate?.cities || [];
}

/**
 * Get governorate names (Arabic)
 */
export function getGovernorateNames(): string[] {
  return egyptGovernorates.map((g) => g.nameAr);
}
