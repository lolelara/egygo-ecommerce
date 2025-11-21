import { motion } from 'framer-motion';
import { Home, Search, ShoppingCart, Heart, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
    id: string;
    icon: typeof Home;
    label: string;
    path: string;
    badge?: number;
}

interface MobileBottomNavEnhancedProps {
    cartCount?: number;
    wishlistCount?: number;
    onMenuClick?: () => void;
}

export function MobileBottomNavEnhanced({
    cartCount = 0,
    wishlistCount = 0,
    onMenuClick,
}: MobileBottomNavEnhancedProps) {
    const location = useLocation();

    const navItems: NavItem[] = [
        { id: 'home', icon: Home, label: 'الرئيسية', path: '/' },
        { id: 'search', icon: Search, label: 'بحث', path: '/search' },
        { id: 'cart', icon: ShoppingCart, label: 'السلة', path: '/cart', badge: cartCount },
        { id: 'wishlist', icon: Heart, label: 'المفضلة', path: '/wishlist', badge: wishlistCount },
        { id: 'menu', icon: Menu, label: 'القائمة', path: '/menu' },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-white/20 
                    shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.1)] z-50 md:hidden safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 relative">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={(e) => {
                                if (item.id === 'menu' && onMenuClick) {
                                    e.preventDefault();
                                    onMenuClick();
                                }
                            }}
                            className="relative flex flex-col items-center justify-center flex-1 h-full group"
                        >
                            {/* Icon Container */}
                            <div className="relative">
                                {/* Icon Background (Active) */}
                                {active && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute inset-0 -m-2 bg-gradient-to-br from-purple-100 to-orange-100 
                               rounded-2xl"
                                    />
                                )}

                                {/* Icon */}
                                <div className="relative z-10 p-2">
                                    <Icon
                                        className={`w-6 h-6 transition-colors ${active
                                            ? 'text-purple-600'
                                            : 'text-gray-400 group-hover:text-gray-600'
                                            }`}
                                        strokeWidth={active ? 2.5 : 2}
                                    />
                                </div>

                                {/* Badge */}
                                {item.badge && item.badge > 0 && (
                                    <div className="absolute -top-1 -right-1 z-20">
                                        <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-pink-500 
                                    text-white text-xs rounded-full flex items-center 
                                    justify-center font-bold shadow-lg">
                                            {item.badge > 99 ? '99+' : item.badge}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-xs mt-1 transition-all ${active ? 'text-purple-600 font-semibold' : 'text-gray-500'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
