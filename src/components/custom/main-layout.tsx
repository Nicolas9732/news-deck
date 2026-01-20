import React from 'react';
import { Home, Compass, Bookmark, Settings, Activity, Sun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
              <Button variant="ghost" className="w-full justify-start gap-3 font-medium text-foreground bg-muted/50">
                <Home size={18} />
                Home
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
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
                <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                  <Zap size={16} />
                  Tech & Science
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                  <Activity size={16} />
                  Finance
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                  <Sun size={16} />
                  Climate
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/40">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <Settings size={18} />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
