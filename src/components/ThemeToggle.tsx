import { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'blue' | 'green';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('dark', 'theme-blue', 'theme-green');
    
    // Apply new theme
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'blue') {
      root.classList.add('theme-blue');
    } else if (newTheme === 'green') {
      root.classList.add('theme-green');
    }
    
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  const themes = [
    { id: 'light' as Theme, name: 'Light', icon: Sun },
    { id: 'dark' as Theme, name: 'Dark', icon: Moon },
    { id: 'blue' as Theme, name: 'Blue', icon: Palette },
    { id: 'green' as Theme, name: 'Green', icon: Palette },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          {theme === 'light' && <Sun className="h-4 w-4" />}
          {theme === 'dark' && <Moon className="h-4 w-4" />}
          {(theme === 'blue' || theme === 'green') && <Palette className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.id}
              onClick={() => applyTheme(themeOption.id)}
              className={theme === themeOption.id ? 'bg-accent' : ''}
            >
              <Icon className="mr-2 h-4 w-4" />
              {themeOption.name}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}