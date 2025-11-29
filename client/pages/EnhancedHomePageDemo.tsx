import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSectionEnhanced } from '@/components/HeroSectionEnhanced';
import { ProductCarouselModern } from '@/components/ProductCarouselModern';
import { CategoryGridAnimated } from '@/components/CategoryGridAnimated';
import { QuickViewModal } from '@/components/QuickViewModal';
import { useToastHelpers } from '@/components/ToastNotifications';
import {
    Smartphone, Shirt, Home, Gamepad2, Watch, Headphones,
    Monitor, Camera, Coffee, Gift, Book, Zap
} from 'lucide-react';

// Sample data
const sampleProducts = [
    {
        id: '1',
        name: 'iPhone 15 Pro Max',
        nameAr: 'آيفون 15 برو ماكس',
        price: 45000,
        originalPrice: 55000,
        image: 'https://images.unsplash.com/photo-1678685888221-cda773a86-ba9?w=500&q=80',
        images: [
            'https://images.unsplash.com/photo-1678685888221-cda773a86ba9?w=500&q=80',
            'https://images.unsplash.com/photo-1592286927505-b0e2e5bcf1f8?w=500&q=80',
        ],
        rating: 4.8,
        reviewCount: 245,
        discount: 18,
        isNew: true,
        isTrending: true,
        badge: 'الأكثر مبيعاً',
        description: 'iPhone 15 Pro Max with titanium design',
        descriptionAr: 'آيفون 15 برو ماكس بتصميم تيتانيوم متميز مع كاميرا قوية وأداء استثنائي',
        inStock: true,
        variants: {
            colors: [
                { name: 'أسود', value: '#000000' },
                { name: 'فضي', value: '#C0C0C0' },
                { name: 'ذهبي', value: '#FFD700' },
            ],
            sizes: ['128GB', '256GB', '512GB', '1TB'],
        },
    },
    {
        id: '2',
        name: 'Samsung Galaxy S24 Ultra',
        nameAr: 'سامسونج جالاكسي S24 الترا',
        price: 42000,
        originalPrice: 50000,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80'],
        rating: 4.7,
        reviewCount: 189,
        discount: 16,
        isTrending: true,
        description: 'Samsung flagship with amazing camera',
        descriptionAr: 'هاتف سامسونج الرائد مع كاميرا مذهلة',
        inStock: true,
        variants: { colors: [], sizes: [] },
    },
    {
        id: '3',
        name: 'MacBook Air M3',
        nameAr: 'ماك بوك إير M3',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'],
        rating: 4.9,
        reviewCount: 312,
        isNew: true,
        description: 'Latest MacBook with M3 chip',
        descriptionAr: 'أحدث ماك بوك بمعالج M3',
        inStock: true,
        variants: { colors: [], sizes: [] },
    },
    {
        id: '4',
        name: 'AirPods Pro 2',
        nameAr: 'إير بودز برو 2',
        price: 8500,
        originalPrice: 10000,
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80'],
        rating: 4.6,
        reviewCount: 156,
        discount: 15,
        description: 'Premium wireless earbuds',
        descriptionAr: 'سماعات لاسلكية فاخرة',
        inStock: true,
        variants: { colors: [], sizes: [] },
    },
];

const categories = [
    { id: '1', nameAr: 'إلكترونيات', name: 'Electronics', icon: Smartphone, productCount: 1250, gradient: 'from-purple-500 to-blue-500' },
    { id: '2', nameAr: 'أزياء', name: 'Fashion', icon: Shirt, productCount: 2340, gradient: 'from-pink-500 to-orange-500' },
    { id: '3', nameAr: 'منزل ومطبخ', name: 'Home', icon: Home, productCount: 890, gradient: 'from-green-500 to-teal-500' },
    { id: '4', nameAr: 'ألعاب', name: 'Gaming', icon: Gamepad2, productCount: 567, gradient: 'from-red-500 to-pink-500' },
    { id: '5', nameAr: 'ساعات', name: 'Watches', icon: Watch, productCount: 445, gradient: 'from-yellow-500 to-orange-500' },
    { id: '6', nameAr: 'سماعات', name: 'Audio', icon: Headphones, productCount: 678, gradient: 'from-indigo-500 to-purple-500' },
];

export default function EnhancedHomePage() {
    const navigate = useNavigate();
    const toast = useToastHelpers();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showQuickView, setShowQuickView] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);

    const handleQuickView = (product: any) => {
        setSelectedProduct(product);
        setShowQuickView(true);
    };

    const handleAddToCart = (product: any) => {
        toast.success('تمت الإضافة!', `تم إضافة ${product.nameAr} إلى السلة`);
    };

    const handleToggleWishlist = (productId: string) => {
        setWishlist(prev => {
            const newWishlist = prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId];

            const isAdded = newWishlist.includes(productId);
            toast[isAdded ? 'success' : 'info'](
                isAdded ? 'أضيف للمفضلة!' : 'حُذف من المفضلة',
                isAdded ? 'تم إضافة المنتج لقائمة المفضلة' : 'تم إزالة المنتج من المفضلة'
            );

            return newWishlist;
        });
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <HeroSectionEnhanced
                onShopNow={() => navigate('/products')}
                onExploreDeals={() => navigate('/deals')}
            />

            {/* Categories Grid */}
            <CategoryGridAnimated
                categories={categories}
                onCategoryClick={(cat) => {
                    toast.info('تصفح الفئة', `جار الانتقال إلى ${cat.nameAr}`);
                    navigate(`/category/${cat.id}`);
                }}
                {/* Best Sellers */}
            <ProductCarouselModern
                products={sampleProducts.reverse()}
                title="home.bestSellers.title"
                subtitle="home.bestSellers.subtitle"
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                wishlistedIds={wishlist}
                onToggleWishlist={handleToggleWishlist}
            />

            {/* Quick View Modal */}
            <QuickViewModal
                product={selectedProduct}
                isOpen={showQuickView}
                onClose={() => setShowQuickView(false)}
                onAddToCart={(id, qty) => {
                    if (selectedProduct) {
                        handleAddToCart(selectedProduct);
                        setShowQuickView(false);
                    }
                }}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
            />
        </div>
    );
}
