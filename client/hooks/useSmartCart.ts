import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

export function useSmartCart() {
  const cart = useCart();

  // Auto-save cart to localStorage
  useEffect(() => {
    const saveCart = () => {
      try {
        localStorage.setItem('egygo_cart', JSON.stringify(cart.items));
        localStorage.setItem('egygo_cart_timestamp', Date.now().toString());
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    };

    // Save on every cart change
    if (cart.items.length > 0) {
      saveCart();
    }
  }, [cart.items]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('egygo_cart');
        const timestamp = localStorage.getItem('egygo_cart_timestamp');
        
        if (savedCart && timestamp) {
          const age = Date.now() - parseInt(timestamp);
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
          
          if (age < maxAge) {
            const items = JSON.parse(savedCart);
            // Restore cart items
            items.forEach((item: any) => {
              cart.addItem(item.product, item.quantity);
            });
          } else {
            // Clear old cart
            localStorage.removeItem('egygo_cart');
            localStorage.removeItem('egygo_cart_timestamp');
          }
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    };

    loadCart();
  }, []);

  return cart;
}
