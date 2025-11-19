import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface MegaMenuCategory {
    id: string;
    name: string;
    nameAr: string;
    icon?: string;
    gradient?: string;
    subcategories: {
        id: string;
        name: string;
        nameAr: string;
        link: string;
    }[];
    featured?: {
        id: string;
        name: string;
        nameAr: string;
        price: number;
        image: string;
        link: string;
    }[];
}

interface MegaMenuModernProps {
    categories: MegaMenuCategory[];
    onCategoryClick?: (category: MegaMenuCategory) => void;
}

export function MegaMenuModern({ categories, onCategoryClick }: MegaMenuModernProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleCategoryHover = (categoryId: string) => {
        setActiveCategory(categoryId);
        setIsMenuOpen(true);
    };

    const handleMenuLeave = () => {
        setIsMenuOpen(false);
        setTimeout(() => setActiveCategory(null), 300);
    };

    const activeData = categories.find(c => c.id === activeCategory);

    return (
        <div className="relative" onMouseLeave={handleMenuLeave}>
            {/* Main Navigation Bar */}
            <nav className="bg-white shadow-md border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center gap-1">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <button
                                    onMouseEnter={() => handleCategoryHover(category.id)}
                                    onClick={() => {
                                        onCategoryClick?.(category);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-2 px-4 py-4 text-gray-700 
                             hover:text-purple-600 transition-all duration-200 font-semibold
                             relative group ${activeCategory === category.id ? 'text-purple-600' : ''
                                        }`}
                                >
                                    {category.icon && (
                                        <span className="text-xl">{category.icon}</span>
                                    )}
                                    <span>{category.nameAr}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${activeCategory === category.id && isMenuOpen ? 'rotate-180' : ''
                                            }`}
                                    />

                                    {/* Active Indicator */}
                                    {activeCategory === category.id && isMenuOpen && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                                 from-purple-600 to-orange-500 rounded-t-full"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && activeData && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Menu Content */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 z-50 shadow-2xl"
                        >
                            <div className="bg-white rounded-b-2xl overflow-hidden">
                                <div className="container mx-auto px-4 py-8">
                                    {/* Close Button (Mobile) */}
                                    <button
                                        onClick={() => setIsMenuOpen(false)}
                                        className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100
                               hover:bg-gray-200 flex items-center justify-center md:hidden"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        {/* Subcategories Column */}
                                        <div className="md:col-span-4">
                                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                {activeData.icon && <span className="text-2xl">{activeData.icon}</span>}
                                                الفئات الفرعية
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
                                                {activeData.subcategories.map((sub, index) => (
                                                    <motion.div
                                                        key={sub.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.03 }}
                                                    >
                                                        <Link
                                                            to={sub.link}
                                                            onClick={() => setIsMenuOpen(false)}
                                                            className="block py-2.5 px-4 rounded-lg hover:bg-gradient-to-r 
                                       hover:from-purple-50 hover:to-orange-50
                                       hover:text-purple-600 transition-all duration-200
                                       border border-transparent hover:border-purple-200"
                                                        >
                                                            <span className="font-medium">{sub.nameAr}</span>
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Featured Products Section */}
                                        {activeData.featured && activeData.featured.length > 0 && (
                                            <div className="md:col-span-8">
                                                <h3 className="text-lg font-bold text-gray-800 mb-4">
                                                    منتجات مميزة
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {activeData.featured.map((product, index) => (
                                                        <motion.div
                                                            key={product.id}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.05 }}
                                                        >
                                                            <Link
                                                                to={product.link}
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className="block group"
                                                            >
                                                                <motion.div
                                                                    whileHover={{ y: -4 }}
                                                                    className={`rounded-xl p-4 bg-gradient-to-br ${activeData.gradient || 'from-purple-500 to-orange-500'
                                                                        } text-white cursor-pointer shadow-lg
                                  hover:shadow-xl transition-shadow`}
                                                                >
                                                                    {/* Product Image */}
                                                                    <div className="aspect-square bg-white/20 rounded-lg mb-3 
                                                  overflow-hidden backdrop-blur-sm">
                                                                        {product.image && (
                                                                            <img
                                                                                src={product.image}
                                                                                alt={product.nameAr}
                                                                                className="w-full h-full object-cover group-hover:scale-110 
                                                   transition-transform duration-300"
                                                                            />
                                                                        )}
                                                                    </div>

                                                                    {/* Product Info */}
                                                                    <h4 className="font-semibold mb-1 text-sm line-clamp-2">
                                                                        {product.nameAr}
                                                                    </h4>
                                                                    <p className="text-sm opacity-90 font-bold">
                                                                        {product.price.toLocaleString('ar-EG')} جنيه
                                                                    </p>
                                                                </motion.div>
                                                            </Link>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* View All Button */}
                                    <div className="mt-6 text-center">
                                        <Link
                                            to={`/category/${activeData.id}`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="btn-modern px-6 py-2.5 rounded-xl border-2 border-purple-600
                                   text-purple-600 hover:bg-purple-600 hover:text-white
                                   transition-all duration-300 font-semibold"
                                            >
                                                عرض جميع منتجات {activeData.nameAr}
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
