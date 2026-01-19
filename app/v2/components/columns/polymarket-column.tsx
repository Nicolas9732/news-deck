"use client";

import { Column } from '@/app/v2/lib/types';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { usePolymarket } from '@/app/v2/hooks/use-polymarket';
import { POLYMARKET_KEYWORDS } from '@/app/v2/lib/sources';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/app/v2/lib/utils';

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
      <div className="h-full flex flex-col gap-3 p-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center px-4 text-center">
        <div>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-destructive font-medium mb-1">Failed to load markets</p>
          <p className="text-xs text-muted-fg">{error}</p>
        </div>
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4 text-center">
        <div>
          <DollarSign className="w-12 h-12 text-muted-fg mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-fg">No markets found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      {markets.map((market, index) => (
        <div
          key={market.id}
          className={cn(
            "p-4 rounded-lg border border-border bg-background hover:bg-muted/30 transition-all cursor-pointer",
            "animate-slide-up"
          )}
          style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
        >
          {/* Question */}
          <h4 className="font-serif text-sm font-semibold leading-snug text-foreground mb-3 line-clamp-2">
            {market.question}
          </h4>

          {/* Outcomes */}
          <div className="space-y-2 mb-3">
            {market.outcomes.map((outcome, i) => {
              const probability = market.prices[i] * 100;
              const change = market.change24h;

              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{outcome}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {probability.toFixed(1)}%
                      </span>
                      {change !== undefined && (
                        <span className={cn(
                          "text-xs font-medium flex items-center gap-0.5",
                          change > 0 ? "text-primary" : "text-destructive"
                        )}>
                          {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(change).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        i === 0 ? "bg-primary" : "bg-secondary"
                      )}
                      style={{ width: `${probability}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Volume and liquidity */}
          <div className="flex items-center gap-3 text-xs text-muted-fg">
            <div className="flex items-center gap-1">
              <span>Vol:</span>
              <span className="font-medium text-foreground">
                ${(market.volume / 1000).toFixed(1)}k
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Liq:</span>
              <span className="font-medium text-foreground">
                ${(market.liquidity / 1000).toFixed(1)}k
              </span>
            </div>
          </div>

          {/* End date */}
          {market.endDate && (
            <p className="mt-2 text-xs text-muted-fg">
              Ends: {new Date(market.endDate).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
