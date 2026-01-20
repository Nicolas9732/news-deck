'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3, Bitcoin, Gem } from 'lucide-react';
import { MarketItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TabType = 'indices' | 'crypto' | 'commodities';

const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'indices', label: 'Indices', icon: BarChart3 },
  { id: 'crypto', label: 'Crypto', icon: Bitcoin },
  { id: 'commodities', label: 'Commodities', icon: Gem },
];

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const width = 50;
  const height = 18;
  if (!data || data.length < 2) return <div style={{width, height}} />;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface MarketData {
  indices: MarketItem[];
  crypto: MarketItem[];
  commodities: MarketItem[];
}

export function MarketWidget() {
  const [data, setData] = useState<MarketData>({ indices: [], crypto: [], commodities: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('indices');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/market');
      const json = await res.json();
      setData({
        indices: json.indices || json.market || [],
        crypto: json.crypto || [],
        commodities: json.commodities || [],
      });

      // Check for partial errors
      if (json.errors) {
        const failedCategories = Object.entries(json.errors)
          .filter(([, v]) => v !== null)
          .map(([k]) => k);
        if (failedCategories.length > 0) {
          setError(`Some data unavailable: ${failedCategories.join(', ')}`);
        } else {
          setError(null);
        }
      } else {
        setError(null);
      }
    } catch (error) {
      console.error('Failed to fetch market data', error);
      setError('Failed to load market data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const currentData = data[activeTab] || [];

  if (loading) {
    return (
      <Card data-widget="market" className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden h-[350px]">
        <CardHeader className="p-4 pb-2 border-b border-border/40">
           <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="p-4 space-y-4">
           <Skeleton className="h-8 w-full" />
           {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-widget="market" className="border-border/40 bg-card shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-3 border-b border-border/40 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground uppercase flex items-center gap-2">
            <span>Markets</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-bold">LIVE</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-background shadow-sm text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[280px] overflow-y-auto">
        <div className="divide-y divide-border/40">
          {currentData.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No data available
            </div>
          ) : (
            currentData.map((item) => (
              <div key={item.symbol} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{item.symbol}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Sparkline 
                    data={item.history} 
                    color={item.isPositive ? '#22c55e' : '#ef4444'} 
                  />
                  
                  <div className="flex flex-col items-end min-w-[70px]">
                    <span className="text-sm font-medium tabular-nums">
                      {item.price >= 1000 
                        ? item.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        : item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      }
                    </span>
                    <div className={cn(
                      "flex items-center gap-0.5 text-xs font-medium tabular-nums",
                      item.isPositive ? 'text-emerald-500' : 'text-red-500'
                    )}>
                      {item.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      <span>{item.isPositive ? '+' : ''}{item.change?.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {error && (
          <div className="px-3 py-2 text-xs text-amber-500 bg-amber-500/10 border-t border-amber-500/20">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
