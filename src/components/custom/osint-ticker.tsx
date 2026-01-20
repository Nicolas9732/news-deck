'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { OsintTweet } from '@/types';

export interface OsintItem {
  id: string;
  text: string;
  category?: string; // e.g. 'Pizzint' -> 'INTEL'
  timestamp?: string;
  url?: string;
  author?: string;
}

const DEFAULT_ACCOUNTS = ['Pizzint', 'PolymarketIntel', 'WarMonitor3', 'Sino_Market', 'Deltaone'];

function convertUrl(url: string | undefined) {
  if (!url) return '#';
  
  // If it's already an absolute X/Twitter URL, return it as-is
  if (url.includes('x.com') || url.includes('twitter.com')) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Convert Nitter/RSSHub URLs to x.com, preserving the full path (including /status/xxx)
    if (urlObj.hostname.includes('nitter') || urlObj.hostname.includes('rsshub')) {
      return `https://x.com${pathname}`;
    }
    
    return url;
  } catch {
    // If it's a relative path, prepend x.com
    if (url.startsWith('/')) {
      return `https://x.com${url}`;
    }
    return url;
  }
}

function mapAuthorToCategory(author: string): string {
  if (author.toLowerCase().includes('poly')) return 'MARKET';
  if (author.toLowerCase().includes('war')) return 'CONFLICT';
  if (author.toLowerCase().includes('sino')) return 'MACRO';
  if (author.toLowerCase().includes('delta')) return 'FAST';
  return 'INTEL';
}

export function OsintTicker({ className }: { className?: string }) {
  const [items, setItems] = useState<OsintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSources, setSelectedSources] = useState<string[]>(DEFAULT_ACCOUNTS);

  // Load preferences from local storage
  useEffect(() => {
    const saved = localStorage.getItem('osint-sources');
    if (saved) {
      try {
        setSelectedSources(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem('osint-sources', JSON.stringify(selectedSources));
  }, [selectedSources]);

  // Fetch Data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/osint');
        const data = await res.json();
        
        if (data.items) {
          const mapped = data.items.map((tweet: OsintTweet) => ({
            id: tweet.id,
            text: tweet.content,
            category: mapAuthorToCategory(tweet.author || 'Unknown'),
            timestamp: new Date(tweet.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            url: tweet.url,
            author: tweet.author
          }));
          setItems(mapped);
        }
      } catch (e) {
        console.error('Failed to fetch OSINT', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // Refresh every 60s
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter Items
  const filteredItems = items.filter(item => {
    if (!item.author) return true;
    // Simple flexible matching
    return selectedSources.some(source => item.author?.toLowerCase().includes(source.toLowerCase()));
  });

  // Duplicate for infinite scroll
  const displayItems = filteredItems.length > 0 ? [...filteredItems, ...filteredItems] : [];

  const toggleSource = (source: string) => {
    setSelectedSources(prev => {
      if (prev.includes(source)) return prev.filter(s => s !== source);
      return [...prev, source];
    });
  };

  return (
    <Card className={cn("w-full h-[400px] flex flex-col overflow-hidden bg-background border-border/40 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/40 bg-muted/20 z-10 shrink-0">
        <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-foreground/80 uppercase">
            OSINT WIRE
            </span>
        </div>

        {/* Source Manager */}
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <Settings size={14} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
                <div className="space-y-1">
                    <h4 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sources
                    </h4>
                    {DEFAULT_ACCOUNTS.map(source => (
                        <div 
                            key={source} 
                            onClick={() => toggleSource(source)}
                            className="flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-pointer"
                        >
                            <span>@{source}</span>
                            {selectedSources.includes(source) && <Check size={14} className="text-primary" />}
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
      </div>

      {/* Ticker Container */}
      <div className="relative flex-1 overflow-hidden w-full group">
          {loading ? (
             <div className="p-4 space-y-3">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
             </div>
          ) : (
            <>
                {/* Scroll Track */}
                <div className="animate-scroll-up flex flex-col w-full hover:pause">
                    {displayItems.map((item, index) => (
                    <a 
                        key={`${item.id}-${index}`} 
                        href={convertUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-1 p-3 border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer group/item"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded font-mono uppercase", 
                                    "bg-primary/10 text-primary group-hover/item:bg-primary/20"
                                )}>
                                    {item.category || 'INFO'}
                                </span>
                                <span className="text-[10px] font-bold text-foreground/70">
                                    @{item.author}
                                </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                                {item.timestamp}
                            </span>
                        </div>
                        <p className="text-sm text-foreground/90 font-medium leading-snug font-mono line-clamp-3">
                            {item.text}
                        </p>
                    </a>
                    ))}
                    {displayItems.length === 0 && (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No updates from selected sources.
                        </div>
                    )}
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </>
          )}
      </div>
    </Card>
  );
}
