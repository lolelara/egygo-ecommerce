import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
    id: string;
    name: string;
    nameAr: string;
    icon: LucideIcon | string;
    productCount: number;
    gradient: string;
    image?: string;
    children?: Category[];
}

interface CategoryGridAnimatedProps {
    categories: Category[];
    onCategoryClick?: (category: Category) => void;
}

export function CategoryGridAnimated({ categories, onCategoryClick }: CategoryGridAnimatedProps) {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-purple-600 
                         to-orange-500 bg-clip-text text-transparent">
                        تصفح حسب الفئة
                    </h2>
                    <p className="text-gray-600 text-lg">
                        اختر من بين مجموعة واسعة من الفئات
                    </p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {categories.map((category, index) => {
                        const Icon = typeof category.icon === 'string' ? null : category.icon;

                        return (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05, duration: 0.4 }}
                            >
                                <Link
                                    to={`/category/${category.id}`}
                                    onClick={(e) => {
                                        if (onCategoryClick) {
                                            e.preventDefault();
                                            onCategoryClick(category);
                                        }
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative overflow-hidden rounded-2xl cursor-pointer group h-full flex flex-col"
                                    >
                                        {/* Image or Gradient Background */}
                                        <div className={`aspect-square relative flex flex-col items-center justify-center overflow-hidden
                                    ${!category.image ? `bg-gradient-to-br ${category.gradient}` : 'bg-gray-100'} text-white`}>

                                            {category.image ? (
                                                <>
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                                </>
                                            ) : (
                                                /* Animated Background Pattern for Gradient */
                                                <motion.div
                                                    className="absolute inset-0 opacity-10"
                                                    animate={{
                                                        backgroundPosition: ['0% 0%', '100% 100%'],
                                                    }}
                                                    transition={{
                                                        duration: 20,
                                                        repeat: Infinity,
                                                        repeatType: 'reverse',
                                                    }}
                                                    style={{
                                                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                                        backgroundSize: '20px 20px',
                                                    }}
                                                />
                                            )}

                                            {/* Icon (only show if no image or if specifically desired) */}
                                            {!category.image && (
                                                <motion.div
                                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                    className="relative z-10 mb-4"
                                                >
                                                    {Icon ? (
                                                        <Icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
                                                    ) : (
                                                        <span className="text-4xl md:text-5xl">{category.icon as string}</span>
                                                    )}
                                                </motion.div>
                                            )}

                                            {/* Overlay on Hover */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="bg-white p-4 border-t-0 rounded-b-2xl shadow-md
                                    group-hover:shadow-xl transition-shadow duration-300 flex-grow">
                                            <h3 className="font-bold text-gray-800 text-center mb-1 text-sm md:text-base">
                                                {category.nameAr}
                                            </h3>
                                            <p className="text-xs md:text-sm text-gray-500 text-center mb-2">
                                                {category.productCount.toLocaleString('ar-EG')} منتج
                                            </p>

                                            {/* Subcategories Preview */}
                                            {category.children && category.children.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <div className="flex flex-wrap justify-center gap-1">
                                                        {category.children.slice(0, 3).map(child => (
                                                            <span key={child.id} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                                {child.nameAr}
                                                            </span>
                                                        ))}
                                                        {category.children.length > 3 && (
                                                            <span className="text-[10px] text-gray-400 px-1">
                                                                +{category.children.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Shine Effect on Hover */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.6 }}
                                        />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* View All Categories Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-10"
                >
                    <Link to="/categories">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-modern px-8 py-3 rounded-xl border-2 border-purple-600 
                         text-purple-600 hover:bg-purple-600 hover:text-white
                         transition-all duration-300 font-semibold"
                        >
                            عرض جميع الفئات
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
