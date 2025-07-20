import * as React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

// ✅ Only this one import from lucide-react is needed
import {
  Search,
  Bell,
  Menu,
  TrendingUp,
  CheckSquare,
  Wand2,
} from "lucide-react";

interface HeaderProps {
  activeView: "crypto" | "tasks" | "redesign";
  onViewChange: (view: "crypto" | "tasks" | "redesign") => void;
}

export function Header({ activeView, onViewChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CryptoFlow
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button
            variant={activeView === "crypto" ? "default" : "ghost"}
            onClick={() => onViewChange("crypto")}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Crypto Tracker
          </Button>
          <Button
            variant={activeView === "tasks" ? "default" : "ghost"}
            onClick={() => onViewChange("tasks")}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            Task Manager
          </Button>
          <Button
            variant={activeView === "redesign" ? "default" : "ghost"}
            onClick={() => onViewChange("redesign")}
            className="flex items-center gap-2"
          >
            <Wand2 className="w-4 h-4" />
            AI Redesign
          </Button>
        </nav>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-accent" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
