import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wand2, Upload, Download, Eye, Palette, Layout, Sparkles, Globe } from "lucide-react";

export function AIRedesignTools() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [designPrompt, setDesignPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-gradient-primary hover:opacity-90">
          <Upload className="w-4 h-4 mr-2" />
          Upload Design Files
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Redesign
        </Button>
        <Button variant="outline">
          <Palette className="w-4 h-4 mr-2" />
          Color Palette Generator
        </Button>
      </div>
    </div>
  );
}