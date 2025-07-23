import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Filter, 
  Search,
  Zap,
  Shield,
  Truck,
  Award,
  TrendingUp,
  Eye
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  badge?: string;
  features: string[];
}

export const ProductShowcase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const { toast } = useToast();

  const products: Product[] = [
    {
      id: '1',
      name: 'AI-Powered Trading Bot',
      price: 299.99,
      originalPrice: 399.99,
      rating: 4.8,
      reviews: 256,
      image: '/api/placeholder/300/300',
      category: 'software',
      badge: 'Best Seller',
      features: ['24/7 Trading', 'Risk Management', 'Multiple Exchanges']
    },
    {
      id: '2',
      name: 'Crypto Portfolio Tracker Pro',
      price: 99.99,
      rating: 4.6,
      reviews: 189,
      image: '/api/placeholder/300/300',
      category: 'software',
      badge: 'New',
      features: ['Real-time Tracking', 'Tax Reports', 'Mobile App']
    },
    {
      id: '3',
      name: 'Hardware Wallet Premium',
      price: 159.99,
      rating: 4.9,
      reviews: 342,
      image: '/api/placeholder/300/300',
      category: 'hardware',
      badge: 'Secure',
      features: ['Multi-currency', 'PIN Protection', '2-year Warranty']
    },
    {
      id: '4',
      name: 'DeFi Analytics Dashboard',
      price: 199.99,
      rating: 4.7,
      reviews: 128,
      image: '/api/placeholder/300/300',
      category: 'software',
      features: ['Yield Farming', 'Risk Analysis', 'Custom Alerts']
    },
    {
      id: '5',
      name: 'NFT Collection Manager',
      price: 79.99,
      rating: 4.5,
      reviews: 95,
      image: '/api/placeholder/300/300',
      category: 'software',
      badge: 'Hot',
      features: ['Multi-blockchain', 'Rarity Analysis', 'Price Tracking']
    },
    {
      id: '6',
      name: 'Crypto Mining Optimizer',
      price: 249.99,
      rating: 4.4,
      reviews: 167,
      image: '/api/placeholder/300/300',
      category: 'software',
      features: ['Auto-switching', 'Profit Calculator', 'Pool Management']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'software', label: 'Software' },
    { value: 'hardware', label: 'Hardware' },
    { value: 'services', label: 'Services' }
  ];

  const addToCart = (product: Product) => {
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
      duration: 3000
    });
  };

  const addToWishlist = (product: Product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been saved to your wishlist.`,
      duration: 2000
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold glow-text">
          Premium Crypto Tools & Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover professional-grade tools and services to enhance your crypto trading and investment experience
        </p>
      </div>

      {/* Filters */}
      <Card className="product-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="product-card group">
            <div className="relative">
              {/* Product Image */}
              <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-6xl opacity-20">
                    {product.category === 'hardware' ? <Shield /> : <Zap />}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-2">
                {product.badge && (
                  <Badge 
                    variant={product.badge === 'Best Seller' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Wishlist Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => addToWishlist(product)}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1 w-1 bg-primary rounded-full" />
                    {feature}
                  </div>
                ))}
                {product.features.length > 2 && (
                  <div className="text-sm text-muted-foreground">
                    +{product.features.length - 2} more features
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-muted-foreground">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="cta-button flex-1"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span className="cta-button-text">Add to Cart</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        {[
          {
            icon: Shield,
            title: "Secure Payments",
            description: "256-bit SSL encryption"
          },
          {
            icon: Truck,
            title: "Fast Delivery",
            description: "Instant digital delivery"
          },
          {
            icon: Award,
            title: "Quality Guaranteed",
            description: "30-day money back"
          },
          {
            icon: TrendingUp,
            title: "Proven Results",
            description: "Used by 10,000+ traders"
          }
        ].map((feature, index) => (
          <Card key={index} className="product-card text-center">
            <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <Card className="product-card text-center bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold glow-text">
            Ready to Level Up Your Crypto Game?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful traders using our premium tools and services
          </p>
          <Button className="cta-button text-lg px-8 py-3">
            <span className="cta-button-text">Get Started Today</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};