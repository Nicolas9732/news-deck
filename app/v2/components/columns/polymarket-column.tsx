"use client";

import { Column } from '@/app/v2/lib/types';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { usePolymarket } from '@/app/v2/hooks/use-polymarket';
import { POLYMARKET_KEYWORDS } from '@/app/v2/lib/sources';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PolymarketColumnProps {
  column: Column;
}

export function PolymarketColumn({ column }: PolymarketColumnProps) {
  const { selectedTopic } = useTopic();

  if (!selectedTopic) return null;

  const keywords = POLYMARKET_KEYWORDS[selectedTopic.country || selectedTopic.id] || selectedTopic.keywords;
  const { markets, loading, error } = usePolymarket(keywords, column.config.refreshInterval);

  if (loading && markets.length === 0) {
    return (
      <div className="h-full flex flex-col gap-4 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 border-[3px] border-border bg-muted animate-pulse-brutal" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div className="card-brutal p-8">
          <div className="font-display text-3xl mb-4 text-destructive">ERROR</div>
          <p className="font-mono text-sm uppercase">{error}</p>
        </div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="font-mono text-sm uppercase text-secondary">
          NO MARKETS FOUND
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {markets.map((market, index) => (
        <div
          key={market.id}
          className="card-brutal p-6 animate-slide-brutal"
          style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
        >
          <div className="accent-bar" />

          <h4 className="font-display text-lg leading-tight mb-4">
            {market.question}
          </h4>

          <div className="space-y-3 mb-4">
            {market.outcomes.map((outcome, i) => {
              const probability = market.prices[i] * 100;
              const change = market.change24h;

              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs uppercase font-bold">{outcome}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold">
                        {probability.toFixed(1)}%
                      </span>
                      {change !== undefined && (
                        <span className={`font-mono text-xs flex items-center gap-1 ${
                          change > 0 ? 'text-primary' : 'text-destructive'
                        }`}>
                          {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(change).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-3 border-[3px] border-border bg-muted">
                    <div
                      className={`h-full ${i === 0 ? 'bg-primary' : 'bg-secondary'}`}
                      style={{ width: `${probability}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-secondary uppercase pt-3 border-t-[3px] border-border">
            <div>
              <span className="text-muted-fg">VOL</span> ${(market.volume / 1000).toFixed(0)}K
            </div>
            <span>•</span>
            <div>
              <span className="text-muted-fg">LIQ</span> ${(market.liquidity / 1000).toFixed(0)}K
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
