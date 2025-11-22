import {
    Smartphone,
    Shirt,
    Home,
    Gamepad2,
    Watch,
    Gift,
    Headphones,
    Laptop,
    Camera,
    Baby,
    Dumbbell,
    Car,
    Book,
    Utensils,
    Briefcase,
    Footprints,
    Glasses,
    ShoppingBag,
    Sparkles,
    LucideIcon
} from 'lucide-react';

export const getCategoryIcon = (categoryName: string, slug: string): LucideIcon => {
    const term = (categoryName + ' ' + slug).toLowerCase();

    if (term.includes('phone') || term.includes('mobile') || term.includes('موبايل') || term.includes('هاتف')) return Smartphone;
    if (term.includes('laptop') || term.includes('computer') || term.includes('لابتوب') || term.includes('كمبيوتر')) return Laptop;
    if (term.includes('audio') || term.includes('headphone') || term.includes('speaker') || term.includes('سماعات') || term.includes('صوتيات')) return Headphones;
    if (term.includes('camera') || term.includes('photo') || term.includes('كاميرا') || term.includes('تصوير')) return Camera;
    if (term.includes('game') || term.includes('console') || term.includes('playstation') || term.includes('ألعاب') || term.includes('بلايستيشن')) return Gamepad2;
    if (term.includes('watch') || term.includes('smart') || term.includes('ساعة') || term.includes('ذكية')) return Watch;

    // Specific categories first
    if (term.includes('baby') || term.includes('kids') || term.includes('toy') || term.includes('أطفال') || term.includes('ألعاب أطفال')) return Baby;
    if (term.includes('sport') || term.includes('fitness') || term.includes('gym') || term.includes('رياضة') || term.includes('لياقة')) return Dumbbell;
    if (term.includes('perfume') || term.includes('fragrance') || term.includes('عطور') || term.includes('برفان')) return Sparkles;
    if (term.includes('skin') || term.includes('beauty') || term.includes('care') || term.includes('بشرة') || term.includes('تجميل') || term.includes('عناية')) return Sparkles;

    if (term.includes('clothes') || term.includes('fashion') || term.includes('shirt') || term.includes('dress') || term.includes('ملابس') || term.includes('أزياء') || term.includes('موضة')) return Shirt;
    if (term.includes('shoe') || term.includes('sneaker') || term.includes('footwear') || term.includes('أحذية') || term.includes('حذاء')) return Footprints;
    if (term.includes('bag') || term.includes('wallet') || term.includes('حقائب') || term.includes('شنط')) return Briefcase;
    if (term.includes('glasses') || term.includes('sunglasses') || term.includes('نظارات')) return Glasses;

    if (term.includes('home') || term.includes('furniture') || term.includes('decor') || term.includes('منزل') || term.includes('أثاث') || term.includes('ديكور')) return Home;
    if (term.includes('kitchen') || term.includes('cooking') || term.includes('food') || term.includes('مطبخ') || term.includes('طبخ') || term.includes('طعام')) return Utensils;

    if (term.includes('car') || term.includes('auto') || term.includes('سيارات')) return Car;
    if (term.includes('book') || term.includes('read') || term.includes('كتب') || term.includes('قراءة')) return Book;

    if (term.includes('gift') || term.includes('offer') || term.includes('deal') || term.includes('هدايا') || term.includes('عروض')) return Gift;

    return ShoppingBag;
};
