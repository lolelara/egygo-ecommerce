import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

interface EnhancedCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnhancedCartDrawer({ open, onOpenChange }: EnhancedCartDrawerProps) {
  const { items, removeItem, updateQuantity, total } = useCart();

  const handleRemove = (itemId: string) => {
    removeItem(itemId);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            سلة التسوق
            {items.length > 0 && (
              <Badge variant="secondary">{items.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">السلة فارغة</h3>
              <p className="text-muted-foreground mb-4">
                ابدأ التسوق وأضف منتجاتك المفضلة
              </p>
              <Button onClick={() => onOpenChange(false)} className="btn-hover-lift">
                تصفح المنتجات
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-4 mb-4 p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  {/* Image */}
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-primary">
                        {item.price.toFixed(2)} ج.م
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {item.originalPrice.toFixed(2)} ج.م
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity - 1)
                        }
                        className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </motion.button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleQuantityChange(item.productId, item.quantity + 1)
                        }
                        className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(item.productId)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <SheetFooter className="px-6 py-4 border-t flex-col gap-4">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">المجموع:</span>
              <motion.span
                key={total}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold text-primary"
              >
                {total.toFixed(2)} ج.م
              </motion.span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full">
              <Button
                asChild
                size="lg"
                className="w-full btn-hover-lift btn-gradient"
                onClick={() => onOpenChange(false)}
              >
                <Link to="/checkout">
                  إتمام الطلب
                  <ArrowRight className="mr-2 h-5 w-5 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                <Link to="/cart">عرض السلة</Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
