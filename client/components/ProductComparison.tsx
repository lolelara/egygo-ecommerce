/**
 * Product Comparison Component
 * Compare up to 4 products side-by-side
 */

import { useState } from 'react';
import { X, Plus, Check, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { cn } from '@/lib/utils';

interface Product {
  $id: string;
  name: string;
  price: number;
  image: string;
  brand?: string;
  rating?: number;
  specs: { [key: string]: string | number };
}

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onAdd: () => void;
  onAddToCart: (productId: string) => void;
  maxProducts?: number;
}

export function ProductComparison({
  products,
  onRemove,
  onAdd,
  onAddToCart,
  maxProducts = 4,
}: ProductComparisonProps) {
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  // Get all unique spec keys
  const allSpecs = new Set<string>();
  products.forEach(product => {
    Object.keys(product.specs).forEach(key => allSpecs.add(key));
  });
  const specKeys = Array.from(allSpecs);

  // Check if a spec value is different across products
  const isDifferent = (specKey: string) => {
    const values = products.map(p => p.specs[specKey]).filter(Boolean);
    return new Set(values).size > 1;
  };

  // Get best value (lowest price, highest rating, etc.)
  const getBestValue = (specKey: string, productIndex: number) => {
    if (!highlightDifferences) return false;
    
    const values = products.map(p => ({
      value: p.specs[specKey],
      index: products.indexOf(p)
    })).filter(v => v.value !== undefined);

    if (values.length <= 1) return false;

    // For numeric values
    if (typeof values[0].value === 'number') {
      // Higher is better for rating, lower is better for price
      const isPrice = specKey.toLowerCase().includes('price') || specKey.toLowerCase().includes('سعر');
      const best = isPrice 
        ? Math.min(...values.map(v => v.value as number))
        : Math.max(...values.map(v => v.value as number));
      
      return values[productIndex]?.value === best;
    }

    return false;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>لم تقم بإضافة منتجات للمقارنة بعد</p>
          <p className="text-sm mt-1">يمكنك إضافة حتى {maxProducts} منتجات</p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">مقارنة المنتجات</h2>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="rounded"
            />
            <span>إبراز الاختلافات</span>
          </label>
          {products.length < maxProducts && (
            <Button onClick={onAdd} variant="outline" size="sm">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="grid gap-4" style={{
            gridTemplateColumns: `200px repeat(${products.length}, minmax(250px, 1fr))`
          }}>
            {/* Header Row - Products */}
            <div></div>
            {products.map((product) => (
              <EnhancedCard key={product.$id} className="relative">
                <button
                  onClick={() => onRemove(product.$id)}
                  className="absolute top-2 left-2 z-10 p-1 rounded-full bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-bold mb-1 line-clamp-2">{product.name}</h3>
                  {product.brand && (
                    <Badge variant="secondary" className="mb-2">{product.brand}</Badge>
                  )}
                  <div className="text-2xl font-bold text-primary mb-3">
                    <AnimatedCounter 
                      value={product.price} 
                      prefix="EGP " 
                      decimals={2}
                    />
                  </div>
                  <Button
                    onClick={() => onAddToCart(product.$id)}
                    className="w-full"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 ml-2" />
                    أضف للسلة
                  </Button>
                </div>
              </EnhancedCard>
            ))}

            {/* Spec Rows */}
            {specKeys.map((specKey) => (
              <>
                {/* Spec Label */}
                <div className="flex items-center p-3 font-medium bg-muted rounded-md">
                  {specKey}
                </div>

                {/* Spec Values */}
                {products.map((product, index) => {
                  const value = product.specs[specKey];
                  const isBest = getBestValue(specKey, index);
                  const showDifference = highlightDifferences && isDifferent(specKey);

                  return (
                    <div
                      key={`${product.$id}-${specKey}`}
                      className={cn(
                        "flex items-center justify-center p-3 rounded-md text-center transition-colors",
                        showDifference && "bg-muted/50",
                        isBest && "bg-green-50 dark:bg-green-950/20 border-2 border-green-500"
                      )}
                    >
                      {value ? (
                        <div className="flex items-center gap-2">
                          {isBest && (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          )}
                          <span className={cn(
                            isBest && "font-bold text-green-700 dark:text-green-400"
                          )}>
                            {value}
                          </span>
                        </div>
                      ) : (
                        <Minus className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      {highlightDifferences && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-500 rounded"></div>
            <span>أفضل قيمة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted/50 rounded"></div>
            <span>اختلافات</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductComparison;
