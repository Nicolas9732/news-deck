'use client';

import React from 'react';
import { Home, Compass, TrendingUp, Menu, Zap, Globe, Bitcoin, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboard } from '@/context/dashboard-context';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { getCategoryColor } from '@/lib/category-colors';

const feedCategories = [
  { id: 'Tech', label: 'Tech & Science', icon: Zap },
  { id: 'Finance', label: 'Finance', icon: TrendingUp },
  { id: 'Crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'Geopolitics', label: 'Geopolitics', icon: Globe },
  { id: 'Climate', label: 'Climate', icon: Leaf },
];

export function MobileNav() {
  const { activeTopic, setActiveTopic } = useDashboard();
  const [open, setOpen] = React.useState(false);

  const handleCategorySelect = (category: string) => {
    setActiveTopic(category);
    setOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background/95 backdrop-blur-lg border-t border-border/40">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <button
          onClick={() => setActiveTopic('For You')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors",
            activeTopic === 'For You' ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Home size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Discover */}
        <button
          onClick={() => setActiveTopic('Top')}
          className={cn(
            "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors",
            activeTopic === 'Top' ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <Compass size={20} />
          <span className="text-[10px] font-medium">Discover</span>
        </button>

        {/* Markets (scrolls to widgets on mobile) */}
        <button
          onClick={() => {
            // Scroll to market widget section
            const marketWidget = document.querySelector('[data-widget="market"]');
            marketWidget?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors text-muted-foreground"
        >
          <TrendingUp size={20} />
          <span className="text-[10px] font-medium">Markets</span>
        </button>

        {/* Categories Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors",
                feedCategories.some(c => c.id === activeTopic) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <Menu size={20} />
              <span className="text-[10px] font-medium">Feeds</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[50vh] rounded-t-2xl">
            <SheetTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Select Feed
            </SheetTitle>
            <div className="grid grid-cols-2 gap-3">
              {feedCategories.map((category) => {
                const Icon = category.icon;
                const color = getCategoryColor(category.id);
                const isActive = activeTopic === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "secondary" : "outline"}
                    onClick={() => handleCategorySelect(category.id)}
                    className={cn(
                      "h-auto py-4 flex flex-col gap-2 justify-center items-center",
                      isActive && "ring-2 ring-primary"
                    )}
                  >
                    <Icon size={24} className={color.icon} />
                    <span className="text-sm font-medium">{category.label}</span>
                  </Button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
