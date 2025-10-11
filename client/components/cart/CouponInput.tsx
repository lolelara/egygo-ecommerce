import { useState } from 'react';
import { Tag, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { couponsAPI, type Coupon } from '@/lib/coupons-api';

interface CouponInputProps {
  cartTotal: number;
  onCouponApplied: (discount: number, coupon: Coupon) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: Coupon | null;
}

export default function CouponInput({
  cartTotal,
  onCouponApplied,
  onCouponRemoved,
  appliedCoupon
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('يرجى إدخال كود الكوبون');
      return;
    }

    setLoading(true);
    try {
      const result = await couponsAPI.validateCoupon(couponCode, cartTotal);

      if (result.valid && result.coupon && result.discount) {
        onCouponApplied(result.discount, result.coupon);
        toast.success(result.message || 'تم تطبيق الكوبون بنجاح!');
        setCouponCode('');
      } else {
        toast.error(result.message || 'الكوبون غير صالح');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('حدث خطأ في تطبيق الكوبون');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    setCouponCode('');
    toast.success('تم إزالة الكوبون');
  };

  return (
    <div className="space-y-3">
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">
                كوبون مطبق: <span className="font-mono">{appliedCoupon.code}</span>
              </p>
              <p className="text-xs text-green-700">
                {appliedCoupon.type === 'percentage' 
                  ? `خصم ${appliedCoupon.value}%` 
                  : `خصم ${appliedCoupon.value} ج.م`}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveCoupon}
            className="text-green-700 hover:text-green-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="أدخل كود الكوبون"
              className="pr-10"
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCoupon();
                }
              }}
            />
          </div>
          <Button
            onClick={handleApplyCoupon}
            disabled={loading || !couponCode.trim()}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                جاري التطبيق
              </>
            ) : (
              'تطبيق'
            )}
          </Button>
        </div>
      )}

      {/* Coupon hints */}
      {!appliedCoupon && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            💡 استخدم كوبون للحصول على خصم
          </Badge>
        </div>
      )}
    </div>
  );
}
