import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Sparkles } from 'lucide-react';
import { type Advertisement } from '@/lib/ads-manager';

interface SponsoredProductCardProps {
  ad: Advertisement;
  onImpression: (adId: string) => void;
  onClick: (adId: string) => void;
}

export function SponsoredProductCard({ ad, onImpression, onClick }: SponsoredProductCardProps) {
  return (
    <Link
      to={`/product/${ad.productId}`}
      onClick={() => onClick(ad.$id)}
      className="block group"
    >
      <Card className="overflow-hidden border-2 border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-xl transition-all duration-300 relative">
        {/* Sponsored Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg animate-pulse">
            <Sparkles className="h-3 w-3 mr-1 inline" />
            مُمَوَّل
          </Badge>
        </div>

        {/* Premium Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-orange-400/10 pointer-events-none"></div>

        {/* Product Image */}
        <div className="relative h-64 overflow-hidden bg-muted">
          {ad.productImage ? (
            <img
              src={ad.productImage}
              alt={ad.productName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-4xl">📦</span>
            </div>
          )}
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {ad.productName}
          </h3>

          {/* Merchant Name */}
          <p className="text-sm text-muted-foreground">
            {ad.merchantName}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
            <span className="text-sm text-muted-foreground mr-2">(4.8)</span>
          </div>

          {/* CTA Button */}
          <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold shadow-lg">
            <ShoppingCart className="h-4 w-4 mr-2" />
            اشترِ الآن
          </Button>

          {/* Ad Info */}
          <div className="pt-2 border-t text-xs text-muted-foreground text-center">
            إعلان مدفوع • {ad.adType.replace('_', ' ')}
          </div>
        </CardContent>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
      </Card>
    </Link>
  );
}
