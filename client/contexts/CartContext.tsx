import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stockQuantity: number;
  inStock: boolean;
  color?: string;
  size?: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shopko_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "id">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + newItem.quantity;
        
        if (newQuantity > newItem.stockQuantity) {
          toast({
            title: "الكمية غير متوفرة",
            description: `الكمية المتوفرة فقط ${newItem.stockQuantity}`,
            variant: "destructive",
          });
          return currentItems;
        }

        return currentItems.map((item) =>
          item.productId === newItem.productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      // Add new item
      const item: CartItem = {
        ...newItem,
        id: `cart-${Date.now()}-${Math.random()}`,
      };

      toast({
        title: "تمت الإضافة لسلة التسوق",
        description: `تم إضافة ${newItem.name} إلى سلة التسوق`,
      });

      return [...currentItems, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
    
    toast({
      title: "تمت الإزالة",
      description: "تم إزالة المنتج من السلة",
    });
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItems((currentItems) => {
      const item = currentItems.find((i) => i.id === itemId);
      if (!item) return currentItems;

      if (newQuantity > item.stockQuantity) {
        toast({
          title: "الكمية غير متوفرة",
          description: `الكمية المتوفرة فقط ${item.stockQuantity}`,
          variant: "destructive",
        });
        return currentItems;
      }

      return currentItems.map((i) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "تم إفراغ السلة",
      description: "تم إزالة جميع المنتجات من السلة",
    });
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextType = {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
