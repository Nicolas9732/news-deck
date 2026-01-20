'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { PolymarketData } from '@/types';
import { Search, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PolymarketCard() {
  const [data, setData] = useState<PolymarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchData = useCallback(async (query?: string) => {
    setIsSearching(!!query);
    try {
      const url = query ? `/api/polymarket?q=${encodeURIComponent(query)}` : '/api/polymarket';
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch polymarket data', error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery) {
      fetchData();
      return;
    }

    const timer = setTimeout(() => {
      fetchData(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchData]);

  const handleRefresh = () => {
    setLoading(true);
    fetchData(searchQuery || undefined);
  };

  if (loading && data.length === 0) {
    return (
      <Card className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden h-[350px]">
        <CardHeader className="p-4 pb-2 border-b border-border/40">
           <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-4 space-y-4">
           <Skeleton className="h-9 w-full" />
           {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-3 border-b border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase flex items-center gap-2">
            <span>Polymarket</span>
            <span className="text-[10px] bg-violet-500/15 text-violet-500 px-1.5 py-0.5 rounded font-bold">LIVE</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleRefresh}
            disabled={isSearching}
          >
            <RefreshCw size={14} className={isSearching ? 'animate-spin' : ''} />
          </Button>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/50 border-border/40"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[350px] overflow-y-auto">
        <div className="divide-y divide-border/40">
          {data.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No markets found
            </div>
          ) : (
            data.map((item) => (
              <a 
                key={item.id} 
                href={`https://polymarket.com/event/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 hover:bg-muted/30 transition-colors space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors" title={item.question}>
                    {item.question}
                  </span>
                  <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
                
                <div className="relative h-2 w-full bg-red-500/20 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500 rounded-l-full transition-all" 
                    style={{ width: `${item.yes}%` }} 
                  />
                </div>

                <div className="flex justify-between text-xs font-medium">
                  <span className="text-emerald-500">Yes {item.yes}%</span>
                  <span className="text-muted-foreground tabular-nums text-[10px]">
                    Vol: {item.volume}
                  </span>
                  <span className="text-red-500">No {item.no}%</span>
                </div>
              </a>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
