import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QuickViewModal } from '@/components/QuickViewModal';
// import { useCart } from '@/contexts/CartContext'; // Assuming CartContext exists
// import { useWishlist } from '@/contexts/WishlistContext'; // Assuming WishlistContext exists

interface Product {
    id: string;
    name: string;
    nameAr: string;
    price: number;
    originalPrice?: number;
    images: string[];
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

interface QuickViewContextType {
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: ReactNode }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    // You might want to integrate these with your actual Cart/Wishlist contexts
    // const { addToCart } = useCart();
    // const { toggleWishlist, isInWishlist } = useWishlist();

    const openQuickView = (product: Product) => {
        setProduct(product);
        setIsOpen(true);
    };

    const closeQuickView = () => {
        setIsOpen(false);
        setTimeout(() => setProduct(null), 300); // Clear after animation
    };

    const handleAddToCart = (productId: string, quantity: number) => {
        console.log('Add to cart:', productId, quantity);
        // addToCart(productId, quantity);
    };

    const handleToggleWishlist = (productId: string) => {
        console.log('Toggle wishlist:', productId);
        // toggleWishlist(productId);
    };

    return (
        <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
            {children}
            <QuickViewModal
                product={product}
                isOpen={isOpen}
                onClose={closeQuickView}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={false} // Replace with actual check
            />
        </QuickViewContext.Provider>
    );
}

export function useQuickView() {
    const context = useContext(QuickViewContext);
    if (context === undefined) {
        throw new Error('useQuickView must be used within a QuickViewProvider');
    }
    return context;
}
