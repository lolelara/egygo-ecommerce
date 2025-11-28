import { Link } from 'react-router-dom';
import {
    User, Box, Heart, Settings, HelpCircle, LogOut,
    ChevronLeft, ShoppingBag, Home, Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function MobileMenu() {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: Home, label: 'الرئيسية', path: '/' },
        { icon: Search, label: 'البحث', path: '/search' },
        { icon: ShoppingBag, label: 'المنتجات', path: '/products' },
        { icon: Box, label: 'طلباتي', path: '/my-orders' },
        { icon: Heart, label: 'المفضلة', path: '/wishlist' },
        { icon: User, label: 'حسابي', path: '/account' },
        { icon: Settings, label: 'الإعدادات', path: '/settings' },
        { icon: HelpCircle, label: 'المساعدة والدعم', path: '/contact' },
    ];

    return (
        <div className="container mx-auto px-4 py-6 pb-24 min-h-screen bg-background">
            <h1 className="text-2xl font-bold mb-6">القائمة</h1>

            {user ? (
                <div className="flex items-center gap-4 mb-8 p-4 bg-muted/50 rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link to="/login" className="w-full">
                        <Button className="w-full" variant="default">تسجيل الدخول</Button>
                    </Link>
                    <Link to="/register" className="w-full">
                        <Button className="w-full" variant="outline">إنشاء حساب</Button>
                    </Link>
                </div>
            )}

            <div className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                        </Link>
                    );
                })}
            </div>

            {user && (
                <>
                    <Separator className="my-6" />
                    <Button
                        variant="destructive"
                        className="w-full flex items-center gap-2"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-4 w-4" />
                        تسجيل الخروج
                    </Button>
                </>
            )}
        </div>
    );
}
