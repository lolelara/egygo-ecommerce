# 🔗 Integration Examples - Real-World Usage

## 📋 Overview

أمثلة عملية لكيفية دمج المكونات الجديدة في الصفحات الموجودة.

---

## 🏠 **Homepage Integration**

```tsx
// client/pages/Homepage.tsx
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export default function Homepage() {
  const { user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-primary to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">
            اكتشف أفضل المنتجات
          </h1>
          
          {/* Advanced Search */}
          <AdvancedSearch 
            onSearch={(query) => navigate(`/search?q=${query}`)}
            className="max-w-3xl mx-auto"
          />
        </div>
      </section>

      {/* Smart Recommendations */}
      <section className="container mx-auto px-4 py-12">
        <SmartRecommendations
          userId={user?.$id}
          onProductClick={(id) => navigate(`/product/${id}`)}
        />
      </section>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        cartCount={cart.items.length}
        favoritesCount={user?.favorites?.length || 0}
      />
    </div>
  );
}
```

---

## 🛍️ **Product Page Integration**

```tsx
// client/pages/ProductPage.tsx
import { Product360Viewer } from '@/components/Product360Viewer';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) return <SkeletonCard />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product 360° Viewer */}
        <div>
          {product.images360 ? (
            <Product360Viewer
              images={product.images360}
              alt={product.name}
              autoRotate={true}
            />
          ) : (
            <img src={product.image} alt={product.name} />
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-4xl font-bold text-primary mb-6">
            <AnimatedCounter 
              value={product.price}
              prefix="EGP "
              decimals={2}
            />
          </div>

          <EnhancedButton
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            loading={isAdding}
            success={isAdded}
            icon={<ShoppingCart />}
          >
            {isAdded ? 'تمت الإضافة' : 'أضف للسلة'}
          </EnhancedButton>

          {/* Product Specs */}
          <div className="mt-8">
            <h3 className="font-bold mb-4">المواصفات</h3>
            {/* Specs table */}
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="mt-12">
        <SmartRecommendations
          userId={user?.$id}
          currentProductId={product.$id}
          onProductClick={(id) => navigate(`/product/${id}`)}
        />
      </div>
    </div>
  );
}
```

---

## 🔍 **Search Results Page**

```tsx
// client/pages/SearchResults.tsx
import { AdvancedSearch } from '@/components/AdvancedSearch';
import { ProductComparison } from '@/components/ProductComparison';
import { EnhancedCard } from '@/components/ui/enhanced-card';

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <AdvancedSearch 
        onSearch={(query) => {
          setSearchQuery({ q: query });
          searchProducts(query);
        }}
      />

      {/* Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 z-40">
          <EnhancedButton
            onClick={() => setShowComparison(true)}
            variant="gradient"
            size="lg"
            className="w-full md:w-auto"
          >
            مقارنة ({compareList.length})
          </EnhancedButton>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {products.map(product => (
          <EnhancedCard 
            key={product.$id}
            variant="interactive"
          >
            {/* Product card with compare checkbox */}
            <Checkbox
              checked={compareList.includes(product)}
              onChange={(e) => {
                if (e.target.checked) {
                  setCompareList([...compareList, product]);
                } else {
                  setCompareList(compareList.filter(p => p !== product));
                }
              }}
            />
          </EnhancedCard>
        ))}
      </div>

      {/* Comparison Modal */}
      {showComparison && (
        <Dialog open={showComparison} onOpenChange={setShowComparison}>
          <DialogContent className="max-w-7xl">
            <ProductComparison
              products={compareList}
              onRemove={(id) => {
                setCompareList(compareList.filter(p => p.$id !== id));
              }}
              onAdd={() => setShowComparison(false)}
              onAddToCart={addToCart}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
```

---

## 👤 **Profile Page - Gamification**

```tsx
// client/pages/UserProfile.tsx
import { PointsSystem } from '@/components/PointsSystem';
import { SpinWheel } from '@/components/SpinWheel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UserProfile() {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState({
    total: 0,
    level: 1,
    pointsToNextLevel: 100,
    streak: 0,
  });
  const [spinsLeft, setSpinsLeft] = useState(0);

  useEffect(() => {
    loadUserPoints();
    loadSpinsLeft();
  }, []);

  const handleClaimReward = async (rewardId) => {
    await claimReward(rewardId);
    await loadUserPoints();
    toast.success('تم استلام المكافأة!');
  };

  const handleSpin = async (result) => {
    await saveSpin Result(result);
    setSpinsLeft(prev => prev - 1);
    toast.success(`🎉 ربحت: ${result.label}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">حسابي</h1>

      <Tabs defaultValue="points">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="points">النقاط</TabsTrigger>
          <TabsTrigger value="spin">عجلة الحظ</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        <TabsContent value="points" className="mt-6">
          <PointsSystem
            userPoints={userPoints}
            onClaimReward={handleClaimReward}
          />
        </TabsContent>

        <TabsContent value="spin" className="mt-6">
          <SpinWheel
            onSpin={handleSpin}
            spinsLeft={spinsLeft}
          />
        </TabsContent>

        <TabsContent value="settings">
          {/* User settings */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

---

## 📊 **Admin Dashboard - Reports**

```tsx
// client/pages/AdminDashboard.tsx
import { AdvancedReports } from '@/components/AdvancedReports';
import { SmartNotifications } from '@/components/SmartNotifications';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
  });

  const handleGenerateReport = async (config) => {
    const report = await generateReport(config.type, config.dateRange);
    
    // Download based on format
    if (config.format === 'pdf') {
      downloadPDF(report);
    } else if (config.format === 'excel') {
      downloadExcel(report);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EnhancedCard>
            <EnhancedCardContent className="p-6">
              <h3 className="text-sm text-muted-foreground mb-2">
                إجمالي المبيعات
              </h3>
              <div className="text-3xl font-bold text-primary">
                <AnimatedCounter 
                  value={stats.totalSales}
                  prefix="EGP "
                  decimals={2}
                />
              </div>
              <ProgressIndicator 
                value={85} 
                color="success"
                className="mt-4"
                label="من الهدف الشهري"
              />
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard>
            <EnhancedCardContent className="p-6">
              <h3 className="text-sm text-muted-foreground mb-2">
                عدد الطلبات
              </h3>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={stats.totalOrders} />
              </div>
            </EnhancedCardContent>
          </EnhancedCard>

          <EnhancedCard>
            <EnhancedCardContent className="p-6">
              <h3 className="text-sm text-muted-foreground mb-2">
                عدد المستخدمين
              </h3>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={stats.totalUsers} />
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>

        {/* Reports Generator */}
        <AdvancedReports 
          onGenerateReport={handleGenerateReport}
        />

        {/* Notifications */}
        <SmartNotifications />
      </div>
    </AdminLayout>
  );
}
```

---

## 📱 **Mobile Layout Wrapper**

```tsx
// client/components/MobileLayout.tsx
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

export function MobileLayout({ children }) {
  const { items: cartItems } = useCart();
  const { items: favoriteItems } = useFavorites();

  return (
    <>
      {/* Add bottom padding on mobile to prevent content hiding */}
      <div className="pb-16 md:pb-0">
        {children}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        cartCount={cartItems.length}
        favoritesCount={favoriteItems.length}
      />
    </>
  );
}
```

---

## 🎯 **Complete App Integration**

```tsx
// client/App.tsx
import { MobileLayout } from '@/components/MobileLayout';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <BrowserRouter>
                  <MobileLayout>
                    <Routes>
                      <Route path="/" element={<Homepage />} />
                      <Route path="/product/:id" element={<ProductPage />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                  </MobileLayout>

                  {/* Global Components */}
                  <PWAInstallPrompt />
                  <CookieConsent />
                  <AIAssistant />
                  <WhatsAppButton />
                </BrowserRouter>
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

---

## 🔄 **API Integration Examples**

### **Search API:**
```typescript
// client/lib/api/search.ts
export async function searchProducts(query: string) {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

export async function getSuggestions(query: string) {
  const response = await fetch(`/api/search/suggestions?q=${query}`);
  return response.json();
}
```

### **Points API:**
```typescript
// client/lib/api/points.ts
export async function getUserPoints(userId: string) {
  const response = await fetch(`/api/points/user/${userId}`);
  return response.json();
}

export async function claimReward(rewardId: string) {
  const response = await fetch('/api/points/claim', {
    method: 'POST',
    body: JSON.stringify({ rewardId }),
  });
  return response.json();
}
```

### **Spin API:**
```typescript
// client/lib/api/spin.ts
export async function executeSpin(userId: string) {
  const response = await fetch('/api/spin/execute', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
  return response.json();
}

export async function getSpinsLeft(userId: string) {
  const response = await fetch(`/api/spin/remaining/${userId}`);
  return response.json();
}
```

---

## 🎨 **Styling Customization**

### **Theme Integration:**
```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
    },
  },
};
```

### **CSS Variables:**
```css
/* global.css */
:root {
  --primary: 221 83% 53%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  /* Add more variables */
}
```

---

## 🧪 **Testing Examples**

### **Component Test:**
```typescript
// __tests__/AdvancedSearch.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedSearch } from '@/components/AdvancedSearch';

describe('AdvancedSearch', () => {
  it('renders search input', () => {
    render(<AdvancedSearch onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText(/ابحث/)).toBeInTheDocument();
  });

  it('calls onSearch when submitting', () => {
    const onSearch = jest.fn();
    render(<AdvancedSearch onSearch={onSearch} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'iPhone' } });
    fireEvent.submit(input);
    
    expect(onSearch).toHaveBeenCalledWith('iPhone');
  });
});
```

---

## 📚 **Best Practices**

### **1. Performance:**
```tsx
// Lazy load heavy components
const Product360Viewer = lazy(() => import('@/components/Product360Viewer'));
const SpinWheel = lazy(() => import('@/components/SpinWheel'));

// Use Suspense
<Suspense fallback={<SkeletonCard />}>
  <Product360Viewer images={images} />
</Suspense>
```

### **2. Error Handling:**
```tsx
// Wrap in ErrorBoundary
<ErrorBoundary fallback={<ErrorMessage />}>
  <AdvancedReports onGenerateReport={handleReport} />
</ErrorBoundary>
```

### **3. Accessibility:**
```tsx
// Add ARIA labels
<AdvancedSearch 
  onSearch={handleSearch}
  aria-label="بحث متقدم عن المنتجات"
/>

// Keyboard navigation
<ProductComparison
  onKeyDown={(e) => {
    if (e.key === 'Escape') closeComparison();
  }}
/>
```

---

## 🎯 **Summary**

```
✅ 9 real-world integration examples
✅ Complete app structure
✅ API integration patterns
✅ Testing examples
✅ Best practices
✅ Performance tips
✅ Accessibility guidelines

📚 Ready to integrate in production!
```

---

**📅 Last Updated:** October 2025  
**✅ Status:** Production Ready
