/**
 * Testimonials Section - Customer Reviews
 * قسم آراء العملاء
 */

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'عميل منذ سنة',
    rating: 5,
    text: 'تجربة رائعة! المنتجات عالية الجودة والتوصيل سريع جداً. خدمة العملاء ممتازة ودائماً متعاونين. أنصح الجميع بالشراء من هنا.',
    date: '2025-10-15',
  },
  {
    id: 2,
    name: 'فاطمة أحمد',
    role: 'عميلة منذ 6 أشهر',
    rating: 5,
    text: 'أفضل موقع تسوق في مصر! الأسعار منافسة والمنتجات أصلية. اشتريت أكثر من مرة ودائماً راضية عن الخدمة.',
    date: '2025-10-10',
  },
  {
    id: 3,
    name: 'محمود علي',
    role: 'عميل منذ 8 أشهر',
    rating: 5,
    text: 'خدمة ممتازة وتوصيل سريع. المنتجات تطابق الوصف تماماً. التعامل احترافي جداً والأسعار معقولة.',
    date: '2025-10-05',
  },
  {
    id: 4,
    name: 'سارة حسن',
    role: 'عميلة منذ 3 أشهر',
    rating: 5,
    text: 'موقع رائع وسهل الاستخدام. عروض ممتازة ومنتجات متنوعة. التوصيل للمنزل مريح جداً وفريق الدعم متعاون.',
    date: '2025-09-28',
  },
  {
    id: 5,
    name: 'عمر إبراهيم',
    role: 'عميل جديد',
    rating: 5,
    text: 'أول مرة أشتري وتجربة فوق الممتازة! المنتج وصل بحالة ممتازة والسعر كان أفضل من المحلات. حتأكيد هكمل معاهم.',
    date: '2025-09-20',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ماذا يقول <span className="text-primary">عملاؤنا</span> عنا؟
          </h2>
          <p className="text-muted-foreground text-lg">
            آراء حقيقية من عملاء راضين عن خدماتنا
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                {/* Quote Icon */}
                <div className="mb-6 relative">
                  <Quote className="h-12 w-12 text-primary/20 absolute -top-2 -left-2" />
                  <Avatar className="h-20 w-20 border-4 border-primary/20">
                    <AvatarImage src={currentTestimonial.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {currentTestimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < currentTestimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
                  "{currentTestimonial.text}"
                </p>

                {/* Author Info */}
                <div>
                  <h4 className="font-bold text-xl">{currentTestimonial.name}</h4>
                  <p className="text-muted-foreground">{currentTestimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary/30'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">5.0</div>
            <div className="text-sm text-muted-foreground">متوسط التقييم</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">10,000+</div>
            <div className="text-sm text-muted-foreground">عميل راضي</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">98%</div>
            <div className="text-sm text-muted-foreground">معدل الرضا</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">50,000+</div>
            <div className="text-sm text-muted-foreground">طلب ناجح</div>
          </div>
        </div>
      </div>
    </section>
  );
}
