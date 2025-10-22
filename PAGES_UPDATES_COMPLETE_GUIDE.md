# 🚀 دليل تحديثات الصفحات الشامل

---

## 📑 **المحتويات**

1. [Index.tsx - الصفحة الرئيسية](#1-indextsx)
2. [Products.tsx - صفحة المنتجات](#2-productstsx)
3. [ProductDetail.tsx - صفحة المنتج](#3-productdetailtsx)
4. [Cart.tsx - عربة التسوق](#4-carttsx)
5. [Checkout.tsx - صفحة الدفع](#5-checkouttsx)
6. [DealsPage.tsx - صفحة العروض](#6-dealspagetsx)
7. [CustomerAccount.tsx - حسابي](#7-customeraccounttsx)

---

## 1. Index.tsx

### ✅ تم إنشاؤه:
- `TestimonialsSection.tsx` - آراء العملاء
- `FeaturedDealsSection.tsx` - العروض الخاصة
- `INDEX_UPDATES_GUIDE.md` - دليل التطبيق

### 📝 التطبيق:
انظر `INDEX_UPDATES_GUIDE.md` للتفاصيل الكاملة

---

## 2. Products.tsx

### المطلوب:
```
❌ الإعلانات المدعومة
❌ فلاتر متقدمة
❌ Sorting options
❌ Grid/List view toggle
❌ Quick view
❌ Wishlist
❌ مقارنة المنتجات
```

### الحل:

#### أ) إضافة Imports:
```typescript
import { SponsoredProductCard } from '@/components/ads/SponsoredProductCard';
import { adsManager } from '@/lib/ads-manager';
import { Filter, Grid, List, Eye, Heart, GitCompare } from 'lucide-react';
```

#### ب) State Management:
```typescript
const [sponsoredAds, setSponsoredAds] = useState([]);
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [sortBy, setSortBy] = useState<string>('newest');
const [filters, setFilters] = useState({
  priceMin: 0,
  priceMax: 10000,
  rating: 0,
  brands: [],
});
```

#### ج) Load Sponsored Ads:
```typescript
useEffect(() => {
  loadSponsoredAds();
}, [category]);

const loadSponsoredAds = async () => {
  const ads = await adsManager.getActiveAds('category_top', 3);
  setSponsoredAds(ads);
  ads.forEach(ad => adsManager.trackImpression(ad.$id));
};
```

#### د) Filters Component:
```tsx
<div className="mb-6 p-4 bg-white rounded-lg shadow">
  <h3 className="font-semibold mb-4">فلاتر البحث</h3>
  
  {/* Price Range */}
  <div className="mb-4">
    <label className="block mb-2">السعر</label>
    <input type="range" min="0" max="10000" 
      value={filters.priceMax} 
      onChange={(e) => setFilters({...filters, priceMax: +e.target.value})}
    />
    <div className="flex justify-between text-sm">
      <span>{filters.priceMin} ج.م</span>
      <span>{filters.priceMax} ج.م</span>
    </div>
  </div>

  {/* Rating Filter */}
  <div className="mb-4">
    <label className="block mb-2">التقييم</label>
    {[5, 4, 3, 2, 1].map(rating => (
      <div key={rating} className="flex items-center gap-2">
        <input type="checkbox" 
          checked={filters.rating === rating}
          onChange={() => setFilters({...filters, rating})}
        />
        <div className="flex">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400" />
          ))}
        </div>
      </div>
    ))}
  </div>
</div>
```

#### هـ) Sorting & View Toggle:
```tsx
<div className="flex justify-between items-center mb-6">
  {/* Sorting */}
  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger className="w-48">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="newest">الأحدث</SelectItem>
      <SelectItem value="price-low">السعر: الأقل أولاً</SelectItem>
      <SelectItem value="price-high">السعر: الأعلى أولاً</SelectItem>
      <SelectItem value="rating">الأعلى تقييماً</SelectItem>
      <SelectItem value="popular">الأكثر مبيعاً</SelectItem>
    </SelectContent>
  </Select>

  {/* View Toggle */}
  <div className="flex gap-2">
    <Button 
      variant={viewMode === 'grid' ? 'default' : 'outline'}
      size="icon"
      onClick={() => setViewMode('grid')}
    >
      <Grid className="h-4 w-4" />
    </Button>
    <Button 
      variant={viewMode === 'list' ? 'default' : 'outline'}
      size="icon"
      onClick={() => setViewMode('list')}
    >
      <List className="h-4 w-4" />
    </Button>
  </div>
</div>
```

#### و) Sponsored Ads Section:
```tsx
{sponsoredAds.length > 0 && (
  <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-sm text-yellow-800 mb-4 flex items-center gap-2">
      <Sparkles className="h-4 w-4" />
      منتجات مدعومة
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sponsoredAds.map(ad => (
        <SponsoredProductCard
          key={ad.$id}
          ad={ad}
          onImpression={() => {}}
          onClick={(id) => adsManager.trackClick(id)}
        />
      ))}
    </div>
  </div>
)}
```

---

## 3. ProductDetail.tsx

### المطلوب:
```
❌ نظام المراجعات
❌ Q&A
❌ منتجات مشابهة
❌ Recently viewed
```

### الحل:

#### أ) Reviews Component:
```tsx
// Create: client/components/product/ReviewsSection.tsx

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  // Load reviews
  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    // Load from database
  };

  const submitReview = async () => {
    // Submit to database
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">التقييمات والمراجعات</h2>
      
      {/* Rating Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl font-bold">4.8</div>
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-muted-foreground">من أصل 156 تقييم</p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="mt-4 space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-2">
              <span className="w-8">{rating}★</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${rating * 20}%` }}
                />
              </div>
              <span className="w-12 text-sm">{rating * 20}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">اكتب تقييمك</h3>
          <div className="mb-4">
            <label className="block mb-2">التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setNewReview({...newReview, rating})}
                  className="hover:scale-110 transition-transform"
                >
                  <Star 
                    className={`h-8 w-8 ${
                      rating <= newReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="شاركنا رأيك في المنتج..."
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            rows={4}
          />
          <Button onClick={submitReview} className="mt-4">
            نشر التقييم
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{review.userName}</h4>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString('ar')}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <div className="mt-2">
                    <Button variant="ghost" size="sm">
                      👍 مفيد ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

#### ب) Related Products:
```tsx
// في ProductDetail.tsx
<section className="mt-12">
  <h2 className="text-2xl font-bold mb-6">منتجات مشابهة</h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {relatedProducts.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
</section>
```

---

## 4. Cart.tsx

### المطلوب:
```
❌ تطبيق الكوبونات
❌ تقدير الشحن
❌ Upsell products
```

### الحل:

#### أ) Coupon Section:
```tsx
<Card className="p-4">
  <h3 className="font-semibold mb-4">هل لديك كوبون خصم؟</h3>
  <div className="flex gap-2">
    <Input 
      placeholder="أدخل كود الخصم"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
    />
    <Button onClick={applyCoupon} disabled={applyingCoupon}>
      {applyingCoupon ? <Loader2 className="animate-spin" /> : 'تطبيق'}
    </Button>
  </div>
  {discount > 0 && (
    <div className="mt-2 text-green-600 flex items-center gap-2">
      <CheckCircle className="h-4 w-4" />
      تم تطبيق خصم {discount} ج.م
    </div>
  )}
</Card>
```

#### ب) Shipping Estimator:
```tsx
<Card className="p-4 mt-4">
  <h3 className="font-semibold mb-4">تقدير تكلفة الشحن</h3>
  <Select value={governorate} onValueChange={setGovernorate}>
    <SelectTrigger>
      <SelectValue placeholder="اختر المحافظة" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="cairo">القاهرة - 50 ج.م</SelectItem>
      <SelectItem value="giza">الجيزة - 50 ج.م</SelectItem>
      <SelectItem value="alex">الإسكندرية - 60 ج.م</SelectItem>
      <SelectItem value="other">محافظات أخرى - 70 ج.م</SelectItem>
    </SelectContent>
  </Select>
  {shippingCost > 0 && (
    <div className="mt-2">
      <p className="text-sm">تكلفة الشحن: <strong>{shippingCost} ج.م</strong></p>
    </div>
  )}
</Card>
```

---

## 5. Checkout.tsx

### المطلوب:
```
❌ Address autocomplete
❌ Order notes
❌ Order summary sidebar
```

### الحل:

#### أ) Order Notes:
```tsx
<div className="mb-6">
  <Label htmlFor="notes">ملاحظات الطلب (اختياري)</Label>
  <Textarea
    id="notes"
    placeholder="أي ملاحظات خاصة بالطلب أو التوصيل..."
    value={orderNotes}
    onChange={(e) => setOrderNotes(e.target.value)}
    rows={3}
  />
</div>
```

#### ب) Order Summary Sidebar:
```tsx
<div className="lg:col-span-1">
  <Card className="sticky top-4">
    <CardHeader>
      <CardTitle>ملخص الطلب</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Items */}
      {cartItems.map(item => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>{item.name} × {item.quantity}</span>
          <span>{item.price * item.quantity} ج.م</span>
        </div>
      ))}
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>المجموع الفرعي</span>
          <span>{subtotal} ج.م</span>
        </div>
        <div className="flex justify-between">
          <span>الشحن</span>
          <span>{shipping} ج.م</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>الخصم</span>
            <span>-{discount} ج.م</span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>الإجمالي</span>
          <span>{total} ج.م</span>
        </div>
      </div>

      <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
        إتمام الطلب
      </Button>
    </CardContent>
  </Card>
</div>
```

---

## 6. DealsPage.tsx

### المطلوب:
```
❌ عرض العروض من قاعدة البيانات
❌ Countdown timer
❌ Filter by discount
```

### الحل:

```tsx
export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [filterDiscount, setFilterDiscount] = useState(0);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      'featuredDeals',
      [Query.equal('active', true), Query.orderDesc('discount')]
    );
    setDeals(response.documents);
  };

  const filteredDeals = deals.filter(deal => 
    filterDiscount === 0 || deal.discount >= filterDiscount
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">العروض الخاصة</h1>

      {/* Filter */}
      <div className="mb-6">
        <label className="block mb-2">حسب نسبة الخصم</label>
        <Select value={String(filterDiscount)} onValueChange={v => setFilterDiscount(+v)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">جميع العروض</SelectItem>
            <SelectItem value="20">20% فأكثر</SelectItem>
            <SelectItem value="30">30% فأكثر</SelectItem>
            <SelectItem value="40">40% فأكثر</SelectItem>
            <SelectItem value="50">50% فأكثر</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDeals.map(deal => (
          <DealCard key={deal.$id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
```

---

## 7. CustomerAccount.tsx

### المطلوب:
```
❌ تعديل الملف الشخصي
❌ إدارة العناوين
❌ Wishlist
❌ نقاط الولاء
```

### الحل:

```tsx
export default function CustomerAccount() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">حسابي</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="addresses">العناوين</TabsTrigger>
          <TabsTrigger value="orders">طلباتي</TabsTrigger>
          <TabsTrigger value="wishlist">المفضلة</TabsTrigger>
          <TabsTrigger value="points">النقاط</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileEditForm />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesManager />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersHistory />
        </TabsContent>

        <TabsContent value="wishlist">
          <WishlistView />
        </TabsContent>

        <TabsContent value="points">
          <LoyaltyPoints />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## ⏱️ تقدير الوقت

```
Index.tsx: ✅ مكتمل (1 يوم)
Products.tsx: 2-3 أيام
ProductDetail.tsx: 3-4 أيام
Cart.tsx: 1-2 يوم
Checkout.tsx: 1 يوم
DealsPage.tsx: 1 يوم
CustomerAccount.tsx: 2-3 أيام

المجموع: 11-15 يوم عمل
```

---

## 🎯 الأولوية

```
1. Index.tsx ✅
2. ProductDetail.tsx (نظام المراجعات ضروري)
3. Products.tsx (الفلاتر مهمة)
4. Cart.tsx (الكوبونات)
5. CustomerAccount.tsx
6. DealsPage.tsx
7. Checkout.tsx (تحسينات)
```

---

**🚀 جاهز للتطبيق!**
