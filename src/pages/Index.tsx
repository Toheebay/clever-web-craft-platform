import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CryptoTracker } from "@/components/CryptoTracker";
import { TaskManager } from "@/components/TaskManager";
import { AIWebsiteAnalyzer } from "@/components/AIWebsiteAnalyzer";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  Shield, 
  Star,
  ArrowRight,
  Play,
  Users,
  Award,
  ChevronRight
} from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<string>('home');

  const HomePage = () => (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <Badge className="mx-auto bg-primary/10 text-primary border-primary/20">
          <Zap className="mr-2 h-3 w-3" />
          AI-Powered E-commerce Platform
        </Badge>
        
        <h1 className="text-6xl font-bold glow-text pulse-neon max-w-4xl mx-auto">
          The Future of 
          <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent"> Digital Commerce</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Analyze, optimize, and transform any website into a high-converting e-commerce powerhouse 
          with our AI-driven platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="cta-button text-lg px-8 py-4">
            <Play className="mr-2 h-5 w-5" />
            <span className="cta-button-text">Start Free Analysis</span>
          </Button>
          <Button variant="outline" className="text-lg px-8 py-4 border-primary/20 hover:border-primary/50">
            View Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            50,000+ Users
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            4.9/5 Rating
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Award Winning
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Why Choose CryptoFlow Pro?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed in the digital economy
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "AI Website Analysis",
              description: "Advanced AI analyzes any website and provides actionable optimization recommendations",
              features: ["Real-time analysis", "E-commerce optimization", "Performance insights"]
            },
            {
              icon: TrendingUp,
              title: "Conversion Optimization",
              description: "Boost your conversion rates with data-driven design improvements and CTA optimization",
              features: ["A/B testing ready", "Conversion tracking", "ROI analytics"]
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level security with encrypted data processing and secure payment systems",
              features: ["256-bit encryption", "PCI compliance", "GDPR ready"]
            }
          ].map((feature, index) => (
            <Card key={index} className="product-card neon-border group">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <Button variant="ghost" className="group-hover:text-primary transition-colors p-0">
                  Learn More
                  <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "50K+", label: "Websites Analyzed" },
            { number: "2.5x", label: "Average Conversion Boost" },
            { number: "99.9%", label: "Uptime Guarantee" },
            { number: "24/7", label: "Expert Support" }
          ].map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-3xl font-bold glow-text">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-16 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl">
        <h2 className="text-4xl font-bold glow-text">
          Ready to Transform Your Business?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of successful businesses using our AI-powered platform
        </p>
        <Button 
          className="cta-button text-lg px-8 py-4"
          onClick={() => setActiveView('analyzer')}
        >
          <span className="cta-button-text">Start Your Free Analysis</span>
        </Button>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {activeView === 'home' && <HomePage />}
        {activeView === 'analyzer' && <AIWebsiteAnalyzer />}
        {activeView === 'products' && <ProductShowcase />}
        {activeView === 'crypto' && <CryptoTracker />}
        {activeView === 'account' && <TaskManager />}
      </main>
      
      <Footer />
      
      {/* Floating background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default Index;
