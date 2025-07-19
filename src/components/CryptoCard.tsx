import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Star, MoreHorizontal } from "lucide-react";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  market_cap_rank: number;
}

interface CryptoCardProps {
  crypto: CryptoData;
  onAddToWatchlist?: (id: string) => void;
}

export function CryptoCard({ crypto, onAddToWatchlist }: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h > 0;
  const priceChange = Math.abs(crypto.price_change_percentage_24h);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;

    if (marketCap >= trillion) {
      return `$${(marketCap / trillion).toFixed(2)}T`;
    } else if (marketCap >= billion) {
      return `$${(marketCap / billion).toFixed(2)}B`;
    } else if (marketCap >= million) {
      return `$${(marketCap / million).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-300 hover:scale-[1.02] bg-gradient-card border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-12 h-12 rounded-full"
              />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 text-xs px-1 min-w-0 h-5"
              >
                #{crypto.market_cap_rank}
              </Badge>
            </div>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {crypto.name}
              </h3>
              <p className="text-muted-foreground uppercase text-sm">
                {crypto.symbol}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddToWatchlist?.(crypto.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {formatPrice(crypto.current_price)}
            </span>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={`flex items-center gap-1 ${
                isPositive 
                  ? "bg-success text-success-foreground" 
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {priceChange.toFixed(2)}%
            </Badge>
          </div>

          <div className="pt-3 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-medium">{formatMarketCap(crypto.market_cap)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}