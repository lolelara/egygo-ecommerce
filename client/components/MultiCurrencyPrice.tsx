import { useState, useEffect } from "react";
import { DollarSign, Euro, PoundSterling, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Currency = "EGP" | "USD" | "EUR" | "GBP" | "SAR" | "AED";

interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CURRENCIES: Record<Currency, CurrencyConfig> = {
  EGP: { code: "EGP", name: "جنيه مصري", symbol: "ج.م", icon: DollarSign },
  USD: { code: "USD", name: "دولار أمريكي", symbol: "$", icon: DollarSign },
  EUR: { code: "EUR", name: "يورو", symbol: "€", icon: Euro },
  GBP: { code: "GBP", name: "جنيه إسترليني", symbol: "£", icon: PoundSterling },
  SAR: { code: "SAR", name: "ريال سعودي", symbol: "ر.س", icon: DollarSign },
  AED: { code: "AED", name: "درهم إماراتي", symbol: "د.إ", icon: DollarSign },
};

const SHIPPING_ZONES: Record<Currency, { base: number; free_threshold: number }> = {
  EGP: { base: 50, free_threshold: 500 },
  USD: { base: 5, free_threshold: 50 },
  EUR: { base: 4, free_threshold: 45 },
  GBP: { base: 3.5, free_threshold: 40 },
  SAR: { base: 18, free_threshold: 180 },
  AED: { base: 18, free_threshold: 180 },
};

interface MultiCurrencyPriceProps {
  priceUSD: number;
  showShipping?: boolean;
  size?: "sm" | "md" | "lg";
  onCurrencyChange?: (currency: Currency) => void;
}

export function MultiCurrencyPrice({
  priceUSD,
  showShipping = true,
  size = "md",
  onCurrencyChange,
}: MultiCurrencyPriceProps) {
  const [currency, setCurrency] = useState<Currency>("EGP");
  const [rates, setRates] = useState<Record<string, number>>({
    EGP: 30.9,
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    SAR: 3.75,
    AED: 3.67,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      try {
        // In production, use a real API like:
        // const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        // const data = await response.json();
        // setRates(data.rates);
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
    // Refetch every 1 hour
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    onCurrencyChange?.(newCurrency);
    // Save to localStorage
    localStorage.setItem("preferredCurrency", newCurrency);
  };

  // Load saved currency preference
  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency") as Currency;
    if (saved && CURRENCIES[saved]) {
      setCurrency(saved);
    }
  }, []);

  const convertedPrice = priceUSD * (rates[currency] || 1);
  const shippingInfo = SHIPPING_ZONES[currency];
  const shippingFee = convertedPrice >= shippingInfo.free_threshold ? 0 : shippingInfo.base;
  const totalPrice = convertedPrice + shippingFee;

  const config = CURRENCIES[currency];
  const Icon = config.icon;

  const sizeClasses = {
    sm: { price: "text-lg", shipping: "text-xs", icon: "h-4 w-4" },
    md: { price: "text-2xl", shipping: "text-sm", icon: "h-5 w-5" },
    lg: { price: "text-4xl", shipping: "text-base", icon: "h-6 w-6" },
  };

  return (
    <div className="space-y-3">
      {/* Currency Selector */}
      <div className="flex items-center gap-2">
        <Icon className={cn(sizeClasses[size].icon, "text-muted-foreground")} />
        <Select value={currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(CURRENCIES).map((curr) => {
              const CurrIcon = curr.icon;
              return (
                <SelectItem key={curr.code} value={curr.code}>
                  <div className="flex items-center gap-2">
                    <CurrIcon className="h-4 w-4" />
                    <span>{curr.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {curr.symbol}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Price Display */}
      <div className="space-y-2">
        <div className={cn("font-bold flex items-baseline gap-2", sizeClasses[size].price)}>
          <span>{convertedPrice.toFixed(2)}</span>
          <span className="text-lg font-medium text-muted-foreground">{config.symbol}</span>
        </div>

        {showShipping && (
          <>
            <Separator />
            <div className="space-y-1">
              {shippingFee === 0 ? (
                <Badge variant="default" className="gap-1">
                  <TrendingUp className="h-3 w-3" />
                  شحن مجاني
                </Badge>
              ) : (
                <div className={cn("text-muted-foreground", sizeClasses[size].shipping)}>
                  + {shippingFee.toFixed(2)} {config.symbol} شحن
                </div>
              )}
              <div className={cn("text-muted-foreground", sizeClasses[size].shipping)}>
                شحن مجاني على الطلبات أكثر من {shippingInfo.free_threshold} {config.symbol}
              </div>
            </div>
            <Separator />
            <div className="flex items-baseline justify-between">
              <span className={cn("font-semibold", sizeClasses[size].shipping)}>
                الإجمالي:
              </span>
              <span className={cn("font-bold", sizeClasses[size].price)}>
                {totalPrice.toFixed(2)} {config.symbol}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Exchange Rate Info */}
      {currency !== "USD" && (
        <div className="text-xs text-muted-foreground">
          سعر الصرف: 1 USD = {rates[currency]?.toFixed(4)} {config.symbol}
        </div>
      )}
    </div>
  );
}

// Compact version for product cards
interface CompactCurrencyPriceProps {
  priceUSD: number;
}

export function CompactCurrencyPrice({ priceUSD }: CompactCurrencyPriceProps) {
  const [currency, setCurrency] = useState<Currency>("EGP");

  useEffect(() => {
    const saved = localStorage.getItem("preferredCurrency") as Currency;
    if (saved && CURRENCIES[saved]) {
      setCurrency(saved);
    }
  }, []);

  const rates: Record<Currency, number> = {
    EGP: 30.9,
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    SAR: 3.75,
    AED: 3.67,
  };

  const convertedPrice = priceUSD * rates[currency];
  const config = CURRENCIES[currency];

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold">{convertedPrice.toFixed(2)}</span>
      <span className="text-sm text-muted-foreground">{config.symbol}</span>
    </div>
  );
}
