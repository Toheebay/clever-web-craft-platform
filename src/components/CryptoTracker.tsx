import { useState, useEffect } from "react";
import { CryptoCard } from "./CryptoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  market_cap_rank: number;
  total_volume: number;
}

interface MarketStats {
  totalMarketCap: number;
  totalVolume: number;
  marketCapChange: number;
  dominance: number;
}

export function CryptoTracker() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false'
      );
      const data = await response.json();
      setCryptoData(data);

      // Calculate market stats
      const totalMC = data.reduce((sum: number, coin: CryptoData) => sum + coin.market_cap, 0);
      const totalVol = data.reduce((sum: number, coin: CryptoData) => sum + coin.total_volume, 0);
      const btcData = data.find((coin: CryptoData) => coin.id === 'bitcoin');
      
      setMarketStats({
        totalMarketCap: totalMC,
        totalVolume: totalVol,
        marketCapChange: btcData?.price_change_percentage_24h || 0,
        dominance: btcData ? (btcData.market_cap / totalMC) * 100 : 0
      });
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = cryptoData
    .filter(crypto =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_change_percentage_24h':
          return b.price_change_percentage_24h - a.price_change_percentage_24h;
        case 'current_price':
          return b.current_price - a.current_price;
        case 'market_cap':
          return b.market_cap - a.market_cap;
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

  const addToWatchlist = (cryptoId: string) => {
    setWatchlist(prev => 
      prev.includes(cryptoId) 
        ? prev.filter(id => id !== cryptoId)
        : [...prev, cryptoId]
    );
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Market Overview */}
      {marketStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeNumber(marketStats.totalMarketCap)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {marketStats.marketCapChange > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-success" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                )}
                {Math.abs(marketStats.marketCapChange).toFixed(2)}% 24h
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatLargeNumber(marketStats.totalVolume)}</div>
              <p className="text-xs text-muted-foreground">Trading volume</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
              <Zap className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketStats.dominance.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Market share</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{watchlist.length}</div>
              <p className="text-xs text-muted-foreground">Tracked coins</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="Search cryptocurrencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="market_cap_rank">Market Cap Rank</SelectItem>
                  <SelectItem value="market_cap">Market Cap</SelectItem>
                  <SelectItem value="current_price">Price</SelectItem>
                  <SelectItem value="price_change_percentage_24h">24h Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchCryptoData} disabled={loading} variant="outline">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crypto Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map((crypto) => (
            <CryptoCard
              key={crypto.id}
              crypto={crypto}
              onAddToWatchlist={addToWatchlist}
            />
          ))}
        </div>
      )}

      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
        </div>
      )}
    </div>
  );
}