/**
 * Spin Wheel Component
 * Lucky draw wheel for rewards
 */

import { useState, useRef } from 'react';
import { RotateCw, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';

interface WheelSegment {
  id: string;
  label: string;
  value: string;
  color: string;
  probability: number;
}

interface SpinWheelProps {
  onSpin: (result: WheelSegment) => void;
  spinsLeft: number;
  className?: string;
}

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: '1', label: 'خصم 5%', value: '5', color: '#FF6B6B', probability: 30 },
  { id: '2', label: 'خصم 10%', value: '10', color: '#4ECDC4', probability: 25 },
  { id: '3', label: 'خصم 15%', value: '15', color: '#45B7D1', probability: 20 },
  { id: '4', label: 'شحن مجاني', value: 'free_ship', color: '#FFA07A', probability: 15 },
  { id: '5', label: 'خصم 20%', value: '20', color: '#98D8C8', probability: 7 },
  { id: '6', label: 'جائزة كبرى!', value: 'jackpot', color: '#FFD700', probability: 3 },
];

export function SpinWheel({ onSpin, spinsLeft, className }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const selectWinner = (): WheelSegment => {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const segment of DEFAULT_SEGMENTS) {
      cumulative += segment.probability;
      if (random <= cumulative) {
        return segment;
      }
    }

    return DEFAULT_SEGMENTS[0];
  };

  const handleSpin = () => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setResult(null);

    const winner = selectWinner();
    const winnerIndex = DEFAULT_SEGMENTS.findIndex(s => s.id === winner.id);
    const segmentAngle = 360 / DEFAULT_SEGMENTS.length;
    const targetRotation = 360 * 5 + (360 - (winnerIndex * segmentAngle + segmentAngle / 2));

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(winner);
      onSpin(winner);
    }, 4000);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <EnhancedCard variant="gradient">
        <EnhancedCardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold">عجلة الحظ</h2>
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              لديك {spinsLeft} محاولات متبقية
            </p>
          </div>

          {/* Wheel Container */}
          <div className="relative w-full max-w-md mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
            </div>

            {/* Wheel */}
            <div
              ref={wheelRef}
              className="relative aspect-square rounded-full shadow-2xl overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {DEFAULT_SEGMENTS.map((segment, index) => {
                const angle = (360 / DEFAULT_SEGMENTS.length) * index;
                const segmentAngle = 360 / DEFAULT_SEGMENTS.length;

                return (
                  <div
                    key={segment.id}
                    className="absolute inset-0 flex items-start justify-center pt-8"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(50% 50%, ${
                        50 + 50 * Math.sin((segmentAngle / 2) * (Math.PI / 180))
                      }% ${
                        50 - 50 * Math.cos((segmentAngle / 2) * (Math.PI / 180))
                      }%, 100% 50%, ${
                        50 + 50 * Math.sin((segmentAngle / 2) * (Math.PI / 180))
                      }% ${
                        50 + 50 * Math.cos((segmentAngle / 2) * (Math.PI / 180))
                      }%)`,
                      backgroundColor: segment.color,
                    }}
                  >
                    <div
                      className="text-white font-bold text-sm"
                      style={{
                        transform: `rotate(${segmentAngle / 2}deg)`,
                      }}
                    >
                      {segment.label}
                    </div>
                  </div>
                );
              })}

              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
                <Gift className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Spin Button */}
          <div className="text-center mt-8">
            <Button
              size="lg"
              onClick={handleSpin}
              disabled={isSpinning || spinsLeft <= 0}
              className="px-8 py-6 text-lg"
            >
              {isSpinning ? (
                <span className="flex items-center gap-2">
                  <RotateCw className="h-5 w-5 animate-spin" />
                  جاري الدوران...
                </span>
              ) : spinsLeft <= 0 ? (
                'لا توجد محاولات'
              ) : (
                <span className="flex items-center gap-2">
                  <RotateCw className="h-5 w-5" />
                  اضغط للدوران
                </span>
              )}
            </Button>
          </div>

          {/* Result */}
          {result && !isSpinning && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border-2 border-green-500 rounded-lg text-center animate-bounce-in">
              <div className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
                🎉 مبروك!
              </div>
              <div className="text-lg font-semibold">{result.label}</div>
            </div>
          )}
        </EnhancedCardContent>
      </EnhancedCard>

      {/* How to Get More Spins */}
      <EnhancedCard>
        <EnhancedCardContent className="p-4">
          <h3 className="font-bold mb-3">كيف تحصل على محاولات إضافية؟</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>محاولة واحدة يومياً مجاناً</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>محاولة عند كل عملية شراء</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>3 محاولات عند دعوة صديق</span>
            </div>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
}

export default SpinWheel;
