import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  Download, 
  Scan, 
  Wand2, 
  Globe, 
  ShoppingCart, 
  Zap, 
  Palette,
  Code2,
  Layout,
  Smartphone,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Eye,
  Search
} from 'lucide-react';

interface AnalysisResult {
  url: string;
  score: number;
  ecommerceOptimization: {
    cta: number;
    productPages: number;
    checkout: number;
    mobile: number;
  };
  recommendations: string[];
  generatedCode: string;
  designSuggestions: string[];
}

export const AIWebsiteAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = useCallback(async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate analysis progress
      const progressSteps = [
        { step: 20, message: "Fetching website data..." },
        { step: 40, message: "Analyzing structure..." },
        { step: 60, message: "Evaluating e-commerce features..." },
        { step: 80, message: "Generating recommendations..." },
        { step: 100, message: "Creating optimized design..." }
      ];

      for (const { step, message } of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAnalysisProgress(step);
        toast({
          title: "Analysis Progress",
          description: message,
          duration: 1000
        });
      }

      // Mock analysis result
      const mockResult: AnalysisResult = {
        url,
        score: 85,
        ecommerceOptimization: {
          cta: 78,
          productPages: 92,
          checkout: 67,
          mobile: 89
        },
        recommendations: [
          "Implement sticky CTA buttons for better conversion",
          "Add trust badges near checkout button",
          "Optimize product images with zoom functionality",
          "Implement urgency indicators (stock levels, limited time)",
          "Add customer reviews section",
          "Improve mobile checkout flow",
          "Implement exit-intent popups",
          "Add abandoned cart recovery"
        ],
        generatedCode: generateOptimizedEcommerceCode(url),
        designSuggestions: [
          "Use dark theme with neon accents for modern appeal",
          "Implement gradient backgrounds for visual hierarchy",
          "Add micro-animations for better user engagement",
          "Use consistent spacing and typography",
          "Implement progressive disclosure for complex forms"
        ]
      };

      setResult(mockResult);
      toast({
        title: "Analysis Complete!",
        description: `Website scored ${mockResult.score}/100 for e-commerce optimization`,
        duration: 3000
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [url, toast]);

  const downloadOptimizedCode = useCallback(() => {
    if (!result) return;

    const blob = new Blob([result.generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-ecommerce-site.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Optimized code has been downloaded successfully!",
      duration: 3000
    });
  }, [result, toast]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold glow-text pulse-neon">
          AI Website Analyzer
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze any website and get AI-powered e-commerce optimization recommendations 
          with downloadable dark professional design
        </p>
      </div>

      {/* Analysis Form */}
      <Card className="product-card neon-border">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-lg font-semibold">
              Website URL
            </Label>
            <div className="flex gap-3">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 text-lg"
                disabled={isAnalyzing}
              />
              <Button 
                onClick={analyzeWebsite}
                disabled={isAnalyzing || !url}
                className="cta-button px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Scan className="mr-2 h-5 w-5 animate-spin" />
                    <span className="cta-button-text">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    <span className="cta-button-text">Analyze & Optimize</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analysis Progress</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Score Overview */}
          <Card className="product-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Overall Score</h3>
                <p className="text-muted-foreground">E-commerce optimization rating</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold glow-text">
                  {result.score}/100
                </div>
                <Badge variant={result.score >= 80 ? "default" : "secondary"} className="mt-2">
                  {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Detailed Analysis */}
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/20">
              <TabsTrigger value="metrics" className="nav-pill">
                <TrendingUp className="mr-2 h-4 w-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="nav-pill">
                <Target className="mr-2 h-4 w-4" />
                Recommendations
              </TabsTrigger>
              <TabsTrigger value="design" className="nav-pill">
                <Palette className="mr-2 h-4 w-4" />
                Design
              </TabsTrigger>
              <TabsTrigger value="code" className="nav-pill">
                <Code2 className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <Card className="product-card">
                <h3 className="text-xl font-semibold mb-4">E-commerce Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(result.ecommerceOptimization).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-semibold">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                      <div className="flex items-center text-xs text-muted-foreground">
                        {value >= 80 ? (
                          <CheckCircle className="mr-1 h-3 w-3 text-success" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3 text-warning" />
                        )}
                        {value >= 80 ? "Optimized" : "Needs improvement"}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="product-card">
                <h3 className="text-xl font-semibold mb-4">AI Recommendations</h3>
                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <p className="flex-1">{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card className="product-card">
                <h3 className="text-xl font-semibold mb-4">Design Suggestions</h3>
                <div className="space-y-3">
                  {result.designSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <Palette className="h-5 w-5 text-accent mt-0.5" />
                      <p className="flex-1">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <Card className="product-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Optimized Code</h3>
                  <Button onClick={downloadOptimizedCode} className="cta-button">
                    <Download className="mr-2 h-4 w-4" />
                    <span className="cta-button-text">Download HTML</span>
                  </Button>
                </div>
                <div className="bg-muted/20 rounded-lg p-4 max-h-96 overflow-auto">
                  <pre className="text-sm text-muted-foreground">
                    <code>{result.generatedCode}</code>
                  </pre>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            icon: Globe,
            title: "Website Analysis",
            description: "Comprehensive analysis of structure, performance, and user experience"
          },
          {
            icon: ShoppingCart,
            title: "E-commerce Optimization",
            description: "Conversion-focused recommendations for better sales performance"
          },
          {
            icon: Smartphone,
            title: "Mobile Responsive",
            description: "Ensures perfect mobile experience across all devices"
          },
          {
            icon: Zap,
            title: "Performance Boost",
            description: "Optimized code for faster loading and better SEO"
          },
          {
            icon: Eye,
            title: "UX/UI Enhancement",
            description: "Dark professional design with neon accents and smooth animations"
          },
          {
            icon: Search,
            title: "SEO Optimized",
            description: "Built-in SEO best practices for better search rankings"
          }
        ].map((feature, index) => (
          <Card key={index} className="product-card text-center">
            <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

function generateOptimizedEcommerceCode(url: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Optimized E-commerce Site</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: 'hsl(267 100% 75%)',
                        secondary: 'hsl(190 100% 50%)',
                        accent: 'hsl(310 100% 60%)',
                        background: 'hsl(222 84% 4.9%)',
                        foreground: 'hsl(210 40% 98%)',
                        card: 'hsl(222 84% 6%)',
                        muted: 'hsl(222 84% 8%)',
                        border: 'hsl(222 84% 12%)'
                    }
                }
            }
        }
    </script>
    <style>
        .glow { box-shadow: 0 0 40px hsl(267 100% 75% / 0.3); }
        .cta-btn { 
            background: linear-gradient(135deg, hsl(267 100% 75%), hsl(310 100% 60%));
            transition: all 0.3s ease;
        }
        .cta-btn:hover { 
            transform: scale(1.05);
            box-shadow: 0 0 40px hsl(267 100% 75% / 0.5);
        }
        .product-card:hover {
            border-color: hsl(267 100% 75% / 0.5);
            box-shadow: 0 0 40px hsl(267 100% 75% / 0.3);
            transform: scale(1.02);
        }
    </style>
</head>
<body class="bg-background text-foreground">
    <!-- Navigation -->
    <nav class="bg-card border-b border-border p-4">
        <div class="container mx-auto flex justify-between items-center">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                E-Commerce Pro
            </h1>
            <div class="flex gap-4">
                <a href="#" class="hover:text-primary transition-colors">Products</a>
                <a href="#" class="hover:text-primary transition-colors">About</a>
                <button class="cta-btn text-white px-6 py-2 rounded-lg font-semibold">
                    Shop Now
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 text-center">
        <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Premium E-commerce Experience
        </h2>
        <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our curated collection of premium products with cutting-edge design
        </p>
        <button class="cta-btn text-white px-8 py-4 rounded-lg font-semibold text-lg">
            Explore Collection
        </button>
    </section>

    <!-- Products Grid -->
    <section class="container mx-auto px-4 py-16">
        <h3 class="text-3xl font-bold text-center mb-12">Featured Products</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Product Cards -->
            <div class="product-card bg-card border border-border rounded-lg p-6 transition-all duration-300">
                <div class="h-48 bg-muted rounded-lg mb-4"></div>
                <h4 class="text-xl font-semibold mb-2">Premium Product</h4>
                <p class="text-muted-foreground mb-4">High-quality product description</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-primary">$99.99</span>
                    <button class="cta-btn text-white px-4 py-2 rounded-lg">Add to Cart</button>
                </div>
            </div>
            <!-- Repeat for more products -->
        </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-gradient-to-r from-primary to-accent py-16">
        <div class="container mx-auto px-4 text-center">
            <h3 class="text-4xl font-bold text-white mb-6">Ready to Start Shopping?</h3>
            <p class="text-xl text-white/80 mb-8">Join thousands of satisfied customers</p>
            <button class="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transition-transform">
                Get Started Today
            </button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-card border-t border-border py-12">
        <div class="container mx-auto px-4 text-center">
            <p class="text-muted-foreground">© 2025 E-Commerce Pro. Optimized by AI.</p>
        </div>
    </footer>

    <script>
        // Add interactive functionality
        document.querySelectorAll('.cta-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Add cart animation or redirect logic
                this.innerHTML = 'Added! ✓';
                setTimeout(() => {
                    this.innerHTML = 'Add to Cart';
                }, 2000);
            });
        });
    </script>
</body>
</html>`;
}