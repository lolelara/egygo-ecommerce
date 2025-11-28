import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount?: number;
    discount?: number;
    badge?: string;
    isNew?: boolean;
    isTrending?: boolean;
}

interface ProductCardPremiumProps {
    product: Product;
    onProductClick?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onQuickView?: (product: Product) => void;
    onToggleWishlist?: (productId: string) => void;
    isWishlisted?: boolean;
    hideActions?: boolean;
}

export function ProductCardPremium({
    product,
    onProductClick,
    onAddToCart,
    onQuickView,
    onToggleWishlist,
    isWishlisted = false,
    hideActions = false,
}: ProductCardPremiumProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        onAddToCart?.(product);

        // Simulate API call
        setTimeout(() => {
            setIsAddingToCart(false);
        }, 800);
    };

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : product.discount || 0;

    return (
        <motion.div
            layout
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onProductClick?.(product)}
            className="card-modern relative group cursor-pointer bg-white"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            {/* Badges Container */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="badge-modern badge-gradient-orange shadow-lg"
                    >
                        -{discountPercentage}%
                    </motion.div>
                )}

                {/* New Badge */}
                {product.isNew && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="badge-modern bg-green-500 text-white shadow-lg"
                    >
                        جديد
                    </motion.div>
                )}

                {/* Trending Badge */}
                {product.isTrending && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="badge-modern badge-gradient-purple shadow-lg flex items-center gap-1"
                    >
                        <TrendingUp className="w-3 h-3" />
                        رائج
                    </motion.div>
                )}

                {/* Custom Badge */}
                {product.badge && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="badge-modern bg-blue-500 text-white shadow-lg text-xs"
                    >
                        {product.badge}
                    </motion.div>
                )}
            </div>

            {/* Wishlist Button */}
            {!hideActions && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.(product.id);
                    }}
                    className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full 
                       bg-white shadow-lg flex items-center justify-center
                       hover:bg-red-50 transition-colors border border-gray-100"
                >
                    <Heart
                        className={`w-5 h-5 transition-all duration-300 ${isWishlisted
                            ? 'fill-red-500 text-red-500 scale-110'
                            : 'text-gray-400 hover:text-red-400'
                            }`}
                    />
                </motion.button>
            )}

            {/* Image Container */}
            <div className="relative overflow-hidden rounded-t-xl aspect-[4/5] bg-gray-100">
                {/* Skeleton Loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 shimmer-effect" />
                )}

                {/* Product Image */}
                <motion.img
                    src={product.image}
                    alt={product.nameAr}
                    className="w-full h-full object-cover"
                    onLoad={() => setImageLoaded(true)}
                    animate={{
                        scale: isHovered ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Quick View Overlay */}
                <AnimatePresence>
                    {isHovered && !hideActions && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm 
                         flex items-center justify-center"
                        >
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ delay: 0.1 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickView?.(product);
                                }}
                                className="btn-modern btn-gradient-purple px-6 py-3 rounded-xl
                           flex items-center gap-2 text-white font-semibold"
                            >
                                <Eye className="w-4 h-4" />
                                نظرة سريعة
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : i < product.rating
                                        ? 'fill-yellow-200 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-2">
                        ({product.reviewCount || product.rating})
                    </span>
                </div>

                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                    {product.nameAr}
                </h3>

                {/* Price Section */}
                <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 
                           bg-clip-text text-transparent">
                        {product.price.toLocaleString('ar-EG')} جنيه
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice.toLocaleString('ar-EG')} جنيه
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                {!hideActions && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className={`w-full btn-modern btn-gradient-purple py-3 rounded-xl
                         flex items-center justify-center gap-2 text-white font-semibold
                         transition-all duration-300 ${isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                    >
                        {isAddingToCart ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                                جاري الإضافة...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                أضف إلى السلة
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Hover Gradient Border Effect */}
            <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(249, 115, 22, 0.2))',
                    padding: '2px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                }}
            />
        </motion.div>
    );
}
