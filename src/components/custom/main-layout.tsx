'use client';

import React from 'react';
import { Home, Compass, Bookmark, Settings, Sun, Zap, Moon, Laptop, Globe, Leaf, Bitcoin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboard } from '@/context/dashboard-context';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { getCategoryColor } from '@/lib/category-colors';
import { MobileNav } from '@/components/custom/mobile-nav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { activeTopic, setActiveTopic } = useDashboard();
  const { theme, setTheme } = useTheme();

  const isActive = (topic: string) => activeTopic === topic;

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-border/40 bg-background/50 backdrop-blur-xl z-30">
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center text-background font-bold text-xl">
               N
             </div>
             <span className="text-lg font-bold tracking-tight">NewsDash</span>
          </div>
        </div>

        <ScrollArea className="flex-1 py-6 px-4">
          <div className="space-y-6">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start gap-3", isActive('For You') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                onClick={() => setActiveTopic('For You')}
              >
                <Home size={18} />
                Home
              </Button>
              <Button 
                variant="ghost" 
                className={cn("w-full justify-start gap-3", isActive('Top') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                onClick={() => setActiveTopic('Top')}
              >
                <Compass size={18} />
                Discover
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                <Bookmark size={18} />
                Library
              </Button>
            </div>

            <div>
              <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                Feeds
              </h3>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3", isActive('Tech') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                  onClick={() => setActiveTopic('Tech')}
                >
                  <Zap size={16} className={getCategoryColor('Tech').icon} />
                  Tech & Science
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3", isActive('Finance') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                  onClick={() => setActiveTopic('Finance')}
                >
                  <TrendingUp size={16} className={getCategoryColor('Finance').icon} />
                  Finance
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3", isActive('Climate') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                  onClick={() => setActiveTopic('Climate')}
                >
                  <Leaf size={16} className={getCategoryColor('Climate').icon} />
                  Climate
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3", isActive('Geopolitics') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                  onClick={() => setActiveTopic('Geopolitics')}
                >
                  <Globe size={16} className={getCategoryColor('Geopolitics').icon} />
                  Geopolitics
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn("w-full justify-start gap-3", isActive('Crypto') ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
                  onClick={() => setActiveTopic('Crypto')}
                >
                  <Bitcoin size={16} className={getCategoryColor('Crypto').icon} />
                  Crypto
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/40 space-y-2">
          <div className="flex items-center justify-center gap-1 p-1 rounded-lg bg-muted/50 w-full">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 flex-1 rounded-md", theme === 'light' ? "bg-background shadow-sm" : "text-muted-foreground")}
                onClick={() => setTheme('light')}
                title="Light Mode"
              >
                  <Sun size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 flex-1 rounded-md", theme === 'dark' ? "bg-background shadow-sm" : "text-muted-foreground")}
                onClick={() => setTheme('dark')}
                title="Dark Mode"
              >
                  <Moon size={14} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-8 flex-1 rounded-md", theme === 'system' ? "bg-background shadow-sm" : "text-muted-foreground")}
                onClick={() => setTheme('system')}
                title="System Mode"
              >
                  <Laptop size={14} />
              </Button>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <Settings size={18} />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 transition-all duration-300 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
