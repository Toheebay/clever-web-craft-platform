import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Wand2, Upload, Download, Eye, Palette, Layout, Sparkles, Globe, CreditCard, Star, Lock, Unlock } from "lucide-react";

declare global {
  interface Window {
    FlutterwaveCheckout: (params: any) => void;
  }
}

export function AIRedesignTools() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [designPrompt, setDesignPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [generatedPalette, setGeneratedPalette] = useState<string[]>([]);
  const [isGeneratingPalette, setIsGeneratingPalette] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscodeInput, setShowPasscodeInput] = useState(false);
  const [paymentEmail, setPaymentEmail] = useState("");
  const [paymentName, setPaymentName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PASSCODE = "ADEBAYOadebayo12AJANIajani";

  // Check access on component mount
  useEffect(() => {
    const paidStatus = localStorage.getItem('ai_redesign_paid');
    const validPasscode = localStorage.getItem('ai_redesign_passcode');
    
    if (paidStatus === 'true' || validPasscode === PASSCODE) {
      setHasPaid(true);
    }
  }, []);

  const pricingPlans = [
    { 
      name: "Basic Analysis", 
      price: 25, 
      features: ["Website Analysis", "Basic Recommendations", "Color Palette", "1 Design Template"] 
    },
    { 
      name: "Professional Redesign", 
      price: 75, 
      features: ["Complete Analysis", "Custom Redesign", "Multiple Templates", "Export Code", "Priority Support"] 
    },
    { 
      name: "Enterprise Package", 
      price: 150, 
      features: ["Full Redesign Suite", "Multiple Websites", "Advanced Analytics", "Custom Development", "24/7 Support"] 
    }
  ];

  const designTemplates = [
    { name: "Modern Minimalist", category: "Business", preview: "Clean, spacious design with subtle animations" },
    { name: "Dark Professional", category: "Tech", preview: "Dark theme with neon accents and gradients" },
    { name: "Colorful Creative", category: "Creative", preview: "Vibrant colors with playful interactions" },
    { name: "E-commerce Optimized", category: "E-commerce", preview: "Conversion-focused layout with clear CTAs" },
  ];

  const features = [
    { icon: Eye, title: "AI Website Analysis", description: "Analyze current design and user experience" },
    { icon: Palette, title: "Color Scheme Generator", description: "Generate harmonious color palettes" },
    { icon: Layout, title: "Layout Optimization", description: "Optimize layouts for better user engagement" },
    { icon: Sparkles, title: "Interactive Elements", description: "Add modern animations and interactions" },
  ];

  const handleAnalyzeWebsite = async () => {
    if (!websiteUrl) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          toast.success("Website analysis complete! AI recommendations generated.");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleUploadFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) uploaded successfully!`);
  };

  const handleExportRedesign = () => {
    if (!websiteUrl && uploadedFiles.length === 0) {
      toast.error("Please analyze a website or upload design files first.");
      return;
    }
    
    // Simulate export process
    toast.loading("Generating redesign files...");
    setTimeout(() => {
      // Create downloadable content
      const redesignData = {
        website: websiteUrl,
        prompt: designPrompt,
        timestamp: new Date().toISOString(),
        recommendations: [
          "Implement modern CSS Grid layout",
          "Add dark mode toggle",
          "Optimize for mobile-first design",
          "Improve color contrast ratios",
          "Add micro-interactions"
        ]
      };
      
      const blob = new Blob([JSON.stringify(redesignData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-redesign-recommendations.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Redesign exported successfully!");
    }, 2000);
  };

  const generateColorPalette = () => {
    setIsGeneratingPalette(true);
    
    // Generate random modern color palette
    setTimeout(() => {
      const palettes = [
        ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"],
        ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"],
        ["#1f2937", "#374151", "#6b7280", "#9ca3af", "#d1d5db"],
        ["#7c3aed", "#a855f7", "#c084fc", "#ddd6fe", "#ede9fe"],
        ["#059669", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]
      ];
      
      const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
      setGeneratedPalette(randomPalette);
      setIsGeneratingPalette(false);
      toast.success("Color palette generated!");
    }, 1500);
  };

  const handlePasscodeSubmit = () => {
    if (passcode === PASSCODE) {
      setHasPaid(true);
      localStorage.setItem('ai_redesign_passcode', PASSCODE);
      setShowPasscodeInput(false);
      toast.success("Access granted! Welcome to AI Redesign Tools.");
    } else {
      toast.error("Invalid passcode. Please try again.");
    }
  };

  const handleFlutterwavePayment = (plan: typeof pricingPlans[0]) => {
    if (!paymentName || !paymentEmail) {
      toast.error("Please fill in your name and email for payment.");
      return;
    }

    if (!window.FlutterwaveCheckout) {
      toast.error("Payment system not loaded. Please refresh the page.");
      return;
    }

    window.FlutterwaveCheckout({
      public_key: "FLWPUBK-3d0e062fa50b5b538affc64535245178-X",
      tx_ref: "tx-" + Date.now(),
      amount: plan.price,
      currency: "USD",
      payment_options: "card,ussd,banktransfer",
      customer: {
        email: paymentEmail,
        name: paymentName,
      },
      callback: function (data: any) {
        console.log(data);
        if (data.status === "successful") {
          setHasPaid(true);
          localStorage.setItem('ai_redesign_paid', 'true');
          toast.success(`Payment successful! Welcome to ${plan.name}`);
        } else {
          toast.error("Payment failed. Please try again.");
        }
      },
      customizations: {
        title: "AI Redesign Tools",
        description: `Payment for ${plan.name} - Premium AI Website Redesign`,
        logo: "https://your-logo-url.com",
      },
    });
  };

  // If user hasn't paid, show payment/passcode screen
  if (!hasPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Redesign Access
              </h1>
            </div>
            <CardDescription>
              Premium AI-powered website redesign tools require payment or valid access code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Form */}
            <div className="space-y-4">
              <h3 className="font-semibold text-center">Payment Information</h3>
              <Input
                placeholder="Full Name"
                value={paymentName}
                onChange={(e) => setPaymentName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={paymentEmail}
                onChange={(e) => setPaymentEmail(e.target.value)}
              />
              
              <div className="grid gap-4">
                {pricingPlans.map((plan, index) => (
                  <Button
                    key={index}
                    onClick={() => handleFlutterwavePayment(plan)}
                    className={`w-full ${index === 1 ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    variant={index === 1 ? 'default' : 'outline'}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${plan.price} - {plan.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Passcode Section */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => setShowPasscodeInput(!showPasscodeInput)}
                className="w-full"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Enter Access Code
              </Button>
              
              {showPasscodeInput && (
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                  <Button onClick={handlePasscodeSubmit} className="w-full">
                    Verify Access Code
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2 className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI-Powered Redesign Tools
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your website with intelligent design recommendations, modern layouts, and optimized user experiences.
        </p>
      </div>

      {/* Website Analysis Section */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Website Analysis & Redesign
          </CardTitle>
          <CardDescription>
            Enter your website URL to get AI-powered design recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyzeWebsite}
              disabled={isAnalyzing || !websiteUrl}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Website"}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing website structure...</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}

          <Textarea
            placeholder="Describe your design vision (e.g., 'Make it more modern with dark theme', 'Add e-commerce features', 'Improve mobile experience')"
            value={designPrompt}
            onChange={(e) => setDesignPrompt(e.target.value)}
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Design Templates */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Popular Design Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {designTemplates.map((template, index) => (
            <Card key={index} className="hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{template.preview}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AI Design Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <feature.icon className="w-12 h-12 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative hover:shadow-glow transition-all duration-300 ${index === 1 ? 'border-primary shadow-elegant' : ''}`}>
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-primary text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary">${plan.price}</div>
                <CardDescription>Per analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${index === 1 ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                  variant={index === 1 ? 'default' : 'outline'}
                  onClick={() => toast.info("Please use the payment form above to purchase this plan.")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Functional Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Design Files */}
        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Design Files
            </CardTitle>
            <CardDescription>
              Upload your current design files for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.sketch,.fig,.psd"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              onClick={handleUploadFiles}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="text-xs bg-secondary p-2 rounded">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Export Redesign */}
        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Redesign
            </CardTitle>
            <CardDescription>
              Download AI-generated recommendations and code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleExportRedesign}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </CardContent>
        </Card>

        {/* Color Palette Generator */}
        <Card className="hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Color Palette Generator
            </CardTitle>
            <CardDescription>
              Generate modern color schemes for your design
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={generateColorPalette}
              disabled={isGeneratingPalette}
              variant="outline"
              className="w-full"
            >
              <Palette className="w-4 h-4 mr-2" />
              {isGeneratingPalette ? "Generating..." : "Generate Palette"}
            </Button>
            {generatedPalette.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Generated Palette:</p>
                <div className="flex gap-1">
                  {generatedPalette.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded cursor-pointer border border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                      onClick={() => {
                        navigator.clipboard.writeText(color);
                        toast.success(`Copied ${color} to clipboard!`);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}