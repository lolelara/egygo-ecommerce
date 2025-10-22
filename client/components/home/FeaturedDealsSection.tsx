/**
 * Featured Deals Section
 * قسم العروض الخاصة
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Clock, Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import { databases, appwriteConfig } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface Deal {
  $id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  originalPrice: number;
  discount: number;
  order: number;
  active: boolean;
}

export function FeaturedDealsSection() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  // Load deals from database
  useEffect(() => {
    loadDeals();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadDeals = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        'featuredDeals',
        [Query.equal('active', true), Query.orderAsc('order'), Query.limit(4)]
      );
      setDeals(response.documents as any);
    } catch (error) {
      console.error('Error loading deals:', error);
      // Fallback to mock data if database fails
      setDeals(mockDeals);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockDeals: Deal[] = [
    {
      $id: '1',
      productId: 'prod1',
      productName: 'ساعة ذكية - Smart Watch Pro',
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      price: 899,
      originalPrice: 1499,
      discount: 40,
      order: 1,
      active: true,
    },
    {
      $id: '2',
      productId: 'prod2',
      productName: 'سماعات لاسلكية - AirPods Pro',
      productImage: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500',
      price: 1299,
      originalPrice: 1999,
      discount: 35,
      order: 2,
      active: true,
    },
    {
      $id: '3',
      productId: 'prod3',
      productName: 'حقيبة لاب توب احترافية',
      productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      price: 399,
      originalPrice: 699,
      discount: 43,
      order: 3,
      active: true,
    },
    {
      $id: '4',
      productId: 'prod4',
      productName: 'شاحن لاسلكي سريع',
      productImage: 'https://images.unsplash.com/photo-1591290619762-2afae212e7b0?w=500',
      price: 249,
      originalPrice: 449,
      discount: 45,
      order: 4,
      active: true,
    },
  ];

  const displayDeals = deals.length > 0 ? deals : mockDeals;

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-6 w-6 text-red-600 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold">
                عروض <span className="text-red-600">اليوم</span>
              </h2>
            </div>
            <p className="text-muted-foreground">عروض محدودة وتخفيضات حصرية</p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">ينتهي العرض خلال</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-red-600 text-white rounded-lg px-3 py-2 text-center">
                <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs">ساعة</div>
              </div>
              <div className="text-2xl font-bold flex items-center">:</div>
              <div className="bg-red-600 text-white rounded-lg px-3 py-2 text-center">
                <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs">دقيقة</div>
              </div>
              <div className="text-2xl font-bold flex items-center">:</div>
              <div className="bg-red-600 text-white rounded-lg px-3 py-2 text-center">
                <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs">ثانية</div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {displayDeals.map((deal) => (
            <Link to={`/product/${deal.productId}`} key={deal.$id}>
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-red-600 overflow-hidden">
                <div className="relative">
                  {/* Discount Badge */}
                  <Badge className="absolute top-3 right-3 z-10 bg-red-600 text-white text-lg px-3 py-1 shadow-lg">
                    -{deal.discount}%
                  </Badge>

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-white">
                    <img
                      src={deal.productImage}
                      alt={deal.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Product Name */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {deal.productName}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-muted-foreground mr-1">(4.8)</span>
                  </div>

                  {/* Prices */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-red-600">{deal.price} ج.م</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {deal.originalPrice} ج.م
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    أضف للسلة
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center">
          <Link to="/deals">
            <Button size="lg" variant="outline" className="group">
              عرض جميع العروض
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
