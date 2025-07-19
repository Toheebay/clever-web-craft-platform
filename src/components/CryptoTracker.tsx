import { useState, useEffect } from "react";
import { CryptoCard } from "./CryptoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, Loader2, Bell, PieChart, Target, Crown, Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
}

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  type: 'above' | 'below';
  isActive: boolean;
}

export function CryptoTracker() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("market_cap_rank");
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    checkAlerts();
  }, [cryptoData, alerts]);

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

  const addToPortfolio = (crypto: CryptoData, amount: number) => {
    if (!isPremium && portfolio.length >= 3) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to track unlimited portfolio items. Free users can track up to 3 coins.",
        variant: "destructive"
      });
      return;
    }

    const existingItem = portfolio.find(item => item.id === crypto.id);
    if (existingItem) {
      setPortfolio(prev => prev.map(item => 
        item.id === crypto.id 
          ? { ...item, amount: item.amount + amount }
          : item
      ));
    } else {
      const newItem: PortfolioItem = {
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        amount,
        buyPrice: crypto.current_price,
        currentPrice: crypto.current_price
      };
      setPortfolio(prev => [...prev, newItem]);
    }
    toast({
      title: "Added to Portfolio",
      description: `Added ${amount} ${crypto.symbol.toUpperCase()} to your portfolio`
    });
  };

  const removeFromPortfolio = (id: string) => {
    setPortfolio(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Removed from Portfolio",
      description: "Item removed from your portfolio"
    });
  };

  const addPriceAlert = (crypto: CryptoData, targetPrice: number, type: 'above' | 'below') => {
    if (!isPremium && alerts.length >= 5) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium for unlimited price alerts. Free users can set up to 5 alerts.",
        variant: "destructive"
      });
      return;
    }

    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      symbol: crypto.symbol,
      name: crypto.name,
      targetPrice,
      type,
      isActive: true
    };
    setAlerts(prev => [...prev, newAlert]);
    toast({
      title: "Price Alert Set",
      description: `Alert set for ${crypto.name} ${type} $${targetPrice}`
    });
  };

  const checkAlerts = () => {
    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const crypto = cryptoData.find(c => c.symbol === alert.symbol);
      if (!crypto) return;

      const shouldTrigger = alert.type === 'above' 
        ? crypto.current_price >= alert.targetPrice
        : crypto.current_price <= alert.targetPrice;

      if (shouldTrigger) {
        toast({
          title: "Price Alert Triggered!",
          description: `${alert.name} has reached $${crypto.current_price.toFixed(2)}`,
        });
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, isActive: false } : a
        ));
      }
    });
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const crypto = cryptoData.find(c => c.id === item.id);
      return total + (item.amount * (crypto?.current_price || item.currentPrice));
    }, 0);
  };

  const calculatePortfolioChange = () => {
    const currentValue = calculatePortfolioValue();
    const initialValue = portfolio.reduce((total, item) => total + (item.amount * item.buyPrice), 0);
    return initialValue > 0 ? ((currentValue - initialValue) / initialValue) * 100 : 0;
  };

  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);

  const PREMIUM_PASSCODE = "ADEBAYOadebayo12AJANIajani";

  const handlePasscodeSubmit = () => {
    if (passcodeInput === PREMIUM_PASSCODE) {
      setIsPremium(true);
      setShowPasscodeDialog(false);
      setPasscodeInput('');
      toast({
        title: "Access Granted!",
        description: "Premium features unlocked!",
      });
    } else {
      toast({
        title: "Invalid Passcode",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const upgradeToPremium = () => {
    const amount = currency === 'USD' ? 25 : 11000; // $25 or ₦11,000
    
    if (typeof window !== 'undefined' && (window as any).FlutterwaveCheckout) {
      (window as any).FlutterwaveCheckout({
        public_key: "FLWPUBK-3d0e062fa50b5b538affc64535245178-X",
        tx_ref: "premium-" + Date.now(),
        amount: amount,
        currency: currency,
        payment_options: "card,ussd,banktransfer",
        customer: {
          email: "user@example.com",
          name: "Premium User",
        },
        callback: function (data: any) {
          console.log(data);
          setIsPremium(true);
          toast({
            title: "Premium Activated!",
            description: "Welcome to Premium! Enjoy unlimited portfolio tracking and price alerts."
          });
        },
        customizations: {
          title: "Crypto Tracker Premium",
          description: "Unlock unlimited portfolio tracking and alerts",
          logo: "",
        },
      });
    } else {
      toast({
        title: "Payment System Loading",
        description: "Please wait for the payment system to load and try again."
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Premium Upgrade Banner */}
      {!isPremium && (
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">Upgrade to Premium</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Unlimited portfolio tracking, price alerts & advanced analytics</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasscodeDialog(true)}
                  className="text-xs"
                >
                  Use Passcode
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant={currency === 'USD' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrency('USD')}
                  >
                    $25
                  </Button>
                  <Button
                    variant={currency === 'NGN' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrency('NGN')}
                  >
                    ₦11K
                  </Button>
                </div>
                <Button onClick={upgradeToPremium} className="bg-primary hover:bg-primary/90">
                  Upgrade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="alerts">Alerts {alerts.filter(a => a.isActive).length > 0 && <Badge variant="secondary" className="ml-1">{alerts.filter(a => a.isActive).length}</Badge>}</TabsTrigger>
          <TabsTrigger value="analytics">Analytics {!isPremium && <Crown className="w-3 h-3 ml-1" />}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                  <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                  <PieChart className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatLargeNumber(calculatePortfolioValue())}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {calculatePortfolioChange() > 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                    )}
                    {Math.abs(calculatePortfolioChange()).toFixed(2)}% total
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <Bell className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.filter(a => a.isActive).length}</div>
                  <p className="text-xs text-muted-foreground">Price alerts</p>
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
                <EnhancedCryptoCard
                  key={crypto.id}
                  crypto={crypto}
                  onAddToWatchlist={addToWatchlist}
                  onAddToPortfolio={addToPortfolio}
                  onSetAlert={addPriceAlert}
                  isPremium={isPremium}
                />
              ))}
            </div>
          )}

          {filteredData.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Portfolio Tracker
                {!isPremium && <Badge variant="outline">Free: 3 coins max</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No portfolio items yet. Add coins from the Overview tab.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolio.map((item) => {
                    const crypto = cryptoData.find(c => c.id === item.id);
                    const currentValue = item.amount * (crypto?.current_price || item.currentPrice);
                    const initialValue = item.amount * item.buyPrice;
                    const change = ((currentValue - initialValue) / initialValue) * 100;
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.amount} {item.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatLargeNumber(currentValue)}</p>
                          <div className="flex items-center text-sm">
                            {change > 0 ? (
                              <TrendingUp className="w-3 h-3 mr-1 text-success" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1 text-destructive" />
                            )}
                            <span className={change > 0 ? 'text-success' : 'text-destructive'}>
                              {Math.abs(change).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromPortfolio(item.id)}
                          className="ml-2"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Price Alerts
                {!isPremium && <Badge variant="outline">Free: 5 alerts max</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No price alerts set. Add alerts from the Overview tab.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const crypto = cryptoData.find(c => c.symbol === alert.symbol);
                    return (
                      <div key={alert.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Target className={`h-4 w-4 ${alert.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div>
                            <p className="font-medium">{alert.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Alert when price goes {alert.type} ${alert.targetPrice}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Current: ${crypto?.current_price.toFixed(2) || 'N/A'}</p>
                          <Badge variant={alert.isActive ? "default" : "secondary"}>
                            {alert.isActive ? "Active" : "Triggered"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {!isPremium ? (
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-8 text-center">
                <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Unlock advanced portfolio analytics, market insights, and trend analysis
                </p>
                <Button onClick={upgradeToPremium} className="bg-primary hover:bg-primary/90">
                  Upgrade to Premium - $25
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Advanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-card/50 rounded-lg border">
                    <h4 className="font-medium mb-2">Portfolio Diversification</h4>
                    <p className="text-2xl font-bold">{portfolio.length > 0 ? 'Well Diversified' : 'No Data'}</p>
                    <p className="text-sm text-muted-foreground">Based on your current holdings</p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg border">
                    <h4 className="font-medium mb-2">Risk Score</h4>
                    <p className="text-2xl font-bold text-warning">Medium</p>
                    <p className="text-sm text-muted-foreground">Volatility-based assessment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Passcode Dialog */}
      <Dialog open={showPasscodeDialog} onOpenChange={setShowPasscodeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Premium Passcode</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter passcode"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              className="w-full"
              onKeyDown={(e) => e.key === 'Enter' && handlePasscodeSubmit()}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPasscodeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePasscodeSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Enhanced Crypto Card Component with Portfolio and Alert Features
function EnhancedCryptoCard({ 
  crypto, 
  onAddToWatchlist, 
  onAddToPortfolio, 
  onSetAlert, 
  isPremium 
}: {
  crypto: CryptoData;
  onAddToWatchlist: (id: string) => void;
  onAddToPortfolio: (crypto: CryptoData, amount: number) => void;
  onSetAlert: (crypto: CryptoData, price: number, type: 'above' | 'below') => void;
  isPremium: boolean;
}) {
  const [portfolioAmount, setPortfolioAmount] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertType, setAlertType] = useState<'above' | 'below'>('above');

  const formatPrice = (price: number): string => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString()}`;
  };

  const formatMarketCap = (marketCap: number): string => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-semibold text-sm">{crypto.name}</h3>
              <p className="text-xs text-muted-foreground uppercase">{crypto.symbol}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            #{crypto.market_cap_rank}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-semibold">{formatPrice(crypto.current_price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <span className={`font-semibold flex items-center ${
              crypto.price_change_percentage_24h > 0 ? 'text-success' : 'text-destructive'
            }`}>
              {crypto.price_change_percentage_24h > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Cap</span>
            <span className="font-semibold text-xs">{formatMarketCap(crypto.market_cap)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Plus className="w-3 h-3 mr-1" />
                Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Portfolio</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount of {crypto.symbol.toUpperCase()}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={portfolioAmount}
                    onChange={(e) => setPortfolioAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button 
                  onClick={() => {
                    const amount = parseFloat(portfolioAmount);
                    if (amount > 0) {
                      onAddToPortfolio(crypto, amount);
                      setPortfolioAmount("");
                    }
                  }}
                  className="w-full"
                >
                  Add to Portfolio
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Bell className="w-3 h-3 mr-1" />
                Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Price Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="price">Target Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Alert Type</Label>
                  <Select value={alertType} onValueChange={(value: 'above' | 'below') => setAlertType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price goes above</SelectItem>
                      <SelectItem value="below">Price goes below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => {
                    const price = parseFloat(alertPrice);
                    if (price > 0) {
                      onSetAlert(crypto, price, alertType);
                      setAlertPrice("");
                    }
                  }}
                  className="w-full"
                >
                  Set Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}