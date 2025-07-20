import { useState } from "react";
import { Header } from "@/components/Header";
import { CryptoTracker } from "@/components/CryptoTracker";
import { TaskManager } from "@/components/TaskManager";
import { AIRedesignTools } from "@/components/AIRedesignTools";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeView, setActiveView] = useState<'crypto' | 'tasks' | 'redesign'>('crypto');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {activeView === 'crypto' && <CryptoTracker />}
        {activeView === 'tasks' && <TaskManager />}
        {activeView === 'redesign' && <AIRedesignTools />}
      </main>
      
      <Footer />
      
      {/* Floating background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default Index;
