import { useState } from 'react';
import { Plus, X, Palette, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Variant {
  id: string;
  type: 'color' | 'size';
  value: string;
  price?: number;
  stock?: number;
}

interface VariantManagerProps {
  variants: Variant[];
  onChange: (variants: Variant[]) => void;
}

export default function VariantManager({ variants, onChange }: VariantManagerProps) {
  const [colorInput, setColorInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');

  const addColor = () => {
    if (!colorInput.trim()) return;
    const newVariant: Variant = {
      id: Date.now().toString(),
      type: 'color',
      value: colorInput.trim(),
      stock: 0
    };
    onChange([...variants, newVariant]);
    setColorInput('');
  };

  const addSize = () => {
    if (!sizeInput.trim()) return;
    const newVariant: Variant = {
      id: Date.now().toString(),
      type: 'size',
      value: sizeInput.trim(),
      stock: 0
    };
    onChange([...variants, newVariant]);
    setSizeInput('');
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter(v => v.id !== id));
  };

  const updateVariantStock = (id: string, stock: number) => {
    onChange(variants.map(v => v.id === id ? { ...v, stock } : v));
  };

  const updateVariantPrice = (id: string, price: number) => {
    onChange(variants.map(v => v.id === id ? { ...v, price } : v));
  };

  const colors = variants.filter(v => v.type === 'color');
  const sizes = variants.filter(v => v.type === 'size');

  return (
    <div className="space-y-6">
      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            الألوان المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="أضف لون (مثال: أحمر)"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addColor()}
            />
            <Button onClick={addColor}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {colors.length > 0 && (
            <div className="space-y-2">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Badge className="flex-shrink-0">{color.value}</Badge>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">الكمية</Label>
                      <Input
                        type="number"
                        min="0"
                        value={color.stock || 0}
                        onChange={(e) => updateVariantStock(color.id, parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">سعر إضافي</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={color.price || 0}
                        onChange={(e) => updateVariantPrice(color.id, parseFloat(e.target.value) || 0)}
                        className="h-8"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeVariant(color.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            المقاسات المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="أضف مقاس (مثال: كبير)"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSize()}
            />
            <Button onClick={addSize}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => {
              ['صغير', 'متوسط', 'كبير', 'كبير جداً'].forEach(size => {
                if (!sizes.find(s => s.value === size)) {
                  onChange([...variants, {
                    id: Date.now().toString() + size,
                    type: 'size',
                    value: size,
                    stock: 0
                  }]);
                }
              });
            }}>
              إضافة المقاسات القياسية
            </Button>
          </div>

          {sizes.length > 0 && (
            <div className="space-y-2">
              {sizes.map((size) => (
                <div key={size.id} className="flex items-center gap-2 p-3 border rounded-lg">
                  <Badge variant="secondary" className="flex-shrink-0">{size.value}</Badge>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">الكمية</Label>
                      <Input
                        type="number"
                        min="0"
                        value={size.stock || 0}
                        onChange={(e) => updateVariantStock(size.id, parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">سعر إضافي</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={size.price || 0}
                        onChange={(e) => updateVariantPrice(size.id, parseFloat(e.target.value) || 0)}
                        className="h-8"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeVariant(size.id)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {(colors.length > 0 || sizes.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>إجمالي التنويعات:</strong> {colors.length} لون × {sizes.length || 1} مقاس = {colors.length * (sizes.length || 1)} تنويع
          </p>
        </div>
      )}
    </div>
  );
}
