import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Star, Minus, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';

interface Product {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    originalPrice?: number;
    images?: string[] | any[];  // Support both string array and object array
    image?: string;              // Support single image
    rating: number;
    reviewCount: number;
    description: string;
    descriptionAr: string;
    inStock: boolean;
    variants?: {
        colors?: { name: string; value: string }[];
        sizes?: string[];
    };
}

interface QuickViewModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart?: (productId: string, quantity: number) => void;
    onToggleWishlist?: (productId: string) => void;
    isWishlisted?: boolean;
}

export function QuickViewModal({
    product,
    isOpen,
    onClose,
    onAddToCart,
    onToggleWishlist,
    isWishlisted = false,
}: QuickViewModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [isAdding, setIsAdding] = useState(false);

    if (!product) return null;

    const handleAddToCart = async () => {
        setIsAdding(true);
        await onAddToCart?.(product.id, quantity);
        setTimeout(() => setIsAdding(false), 1000);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Safely process images - handle both single image and images array
    const processedImages: string[] = (() => {
        // If images array exists
        if (product.images && Array.isArray(product.images)) {
            return product.images.map((img: any) => {
                // If image is an object with url property
                if (typeof img === 'object' && img !== null && 'url' in img) {
                    return img.url;
                }
                // If image is already a string
                if (typeof img === 'string') {
                    return img;
                }
                // Fallback
                return '/placeholder.png';
            });
        }
        // If single image field exists
        if (product.image) {
            return [product.image];
        }
        // Fallback
        return ['/placeholder.png'];
    })();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="fixed inset-0 z-[101] flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] 
                            overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800">نظرة سريعة</h2>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center 
                             justify-center transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Images Section */}
                                    <div className="space-y-4">
                                        {/* Main Image Slider */}
                                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                            <Swiper
                                                modules={[Navigation, Thumbs]}
                                                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                                navigation
                                                className="h-full"
                                            >
                                                {processedImages.map((image, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img
                                                            src={image}
                                                            alt={`${product.nameAr} - ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>

                                        {/* Thumbnails */}
                                        <Swiper
                                            modules={[FreeMode, Thumbs]}
                                            onSwiper={setThumbsSwiper}
                                            spaceBetween={10}
                                            slidesPerView={4}
                                            freeMode
                                            watchSlidesProgress
                                            className="!py-2"
                                        >
                                            {processedImages.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="aspect-square rounded-lg overflow-hidden cursor-pointer 
                                          border-2 border-transparent hover:border-purple-500 
                                          transition-colors">
                                                        <img
                                                            src={image}
                                                            alt={`Thumbnail ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>

                                    {/* Info Section */}
                                    <div className="space-y-6">
                                        {/* Title & Rating */}
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                                {product.nameAr}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-gray-600">
                                                    ({product.reviewCount} تقييم)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-3xl font-black bg-gradient-to-r from-purple-600 
                                       to-orange-500 bg-clip-text text-transparent">
                                                {product.price.toLocaleString('ar-EG')} جنيه
                                            </span>
                                            {product.originalPrice && (
                                                <>
                                                    <span className="text-lg text-gray-400 line-through">
                                                        {product.originalPrice.toLocaleString('ar-EG')} جنيه
                                                    </span>
                                                    <span className="badge-modern badge-gradient-orange text-sm">
                                                        وفر {discount}%
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Stock Status */}
                                        <div>
                                            {product.inStock ? (
                                                <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                                                    <Check className="w-5 h-5" />
                                                    متوفر في المخزون
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">
                                                    غير متوفر حالياً
                                                </span>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-2">الوصف:</h4>
                                            <p className="text-gray-600 leading-relaxed">
                                                {product.descriptionAr}
                                            </p>
                                        </div>

                                        {/* Color Picker */}
                                        {product.variants?.colors && product.variants.colors.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-3">اللون:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.variants.colors.map((color) => (
                                                        <button
                                                            key={color.name}
                                                            onClick={() => setSelectedColor(color.name)}
                                                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.name
                                                                ? 'border-purple-600 scale-110'
                                                                : 'border-gray-300'
                                                                }`}
                                                            style={{ backgroundColor: color.value }}
                                                            title={color.name}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Size Picker */}
                                        {product.variants?.sizes && product.variants.sizes.length > 0 && (
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-3">المقاس:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.variants.sizes.map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => setSelectedSize(size)}
                                                            className={`px-4 py-2 rounded-xl border-2 font-semibold transition-all ${selectedSize === size
                                                                ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                                : 'border-gray-300 hover:border-gray-400'
                                                                }`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quantity */}
                                        <div>
                                            <h4 className="font-bold text-gray-800 mb-3">الكمية:</h4>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-600
                                     flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => setQuantity(quantity + 1)}
                                                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-purple-600
                                     flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3 pt-4">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleAddToCart}
                                                disabled={!product.inStock || isAdding}
                                                className="flex-1 btn-modern btn-gradient-purple py-4 rounded-xl
                                   flex items-center justify-center gap-2 text-white font-bold text-lg
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isAdding ? (
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

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => onToggleWishlist?.(product.id)}
                                                className="w-14 h-14 rounded-xl border-2 border-purple-600 
                                   flex items-center justify-center hover:bg-purple-50 transition-colors"
                                            >
                                                <Heart
                                                    className={`w-6 h-6 transition-all ${isWishlisted
                                                        ? 'fill-purple-600 text-purple-600'
                                                        : 'text-purple-600'
                                                        }`}
                                                />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
