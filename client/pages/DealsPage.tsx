import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Percent, Gift, Star } from "lucide-react";

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      title: "خصم 50% على الإلكترونيات",
      description: "خصم كبير على جميع المنتجات الإلكترونية",
      discount: 50,
      endsIn: "3 أيام",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "عرض 2 بـ 1 على الملابس",
      description: "اشتري قطعتين واحصل على الثانية مجاناً",
      discount: 50,
      endsIn: "5 أيام",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "شحن مجاني",
      description: "شحن مجاني على جميع الطلبات فوق 500 ج.م",
      discount: 0,
      endsIn: "أسبوع",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">العروض الخاصة</h1>
        <p className="text-muted-foreground">
          أفضل العروض والخصومات المتاحة الآن
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl">{deal.title}</CardTitle>
                {deal.discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{deal.discount}%
                  </span>
                )}
              </div>
              <CardDescription>{deal.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  ينتهي خلال: {deal.endsIn}
                </span>
                <Tag className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Section */}
      <Card className="mt-8 bg-gradient-to-r from-orange-500/10 to-purple-500/10">
        <CardContent className="p-8 text-center">
          <Gift className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">المزيد من العروض قريباً!</h2>
          <p className="text-muted-foreground">
            تابعنا للحصول على أحدث العروض والخصومات الحصرية
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
