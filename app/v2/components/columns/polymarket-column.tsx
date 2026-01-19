"use client";

import { Column } from '@/app/v2/lib/types';
import { usePolymarket } from '@/app/v2/hooks/use-polymarket';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface PolymarketColumnProps {
  column: Column;
}

export function PolymarketColumn({ column }: PolymarketColumnProps) {
  const { markets, loading, error } = usePolymarket();

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-red text-xs">
          ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {loading && markets.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 animate-spin text-cyan" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {markets.length === 0 ? (
            <div className="p-4 text-center text-gray text-xs">
              NO MARKETS FOUND
            </div>
          ) : (
            markets.map((market, i) => (
              <div key={i} className="data-row">
                <div className="status-bar" />

                {/* Market Question */}
                <div className="text-orange text-sm leading-tight mb-3">
                  {market.question}
                </div>

                {/* Outcomes */}
                <div className="space-y-2 mb-3">
                  {market.outcomes.map((outcome, j) => {
                    const probability = (market.prices[j] * 100).toFixed(1);
                    const isYes = j === 0;

                    return (
                      <div key={j}>
                        <div className="flex items-center justify-between mb-1 text-[10px]">
                          <span className={isYes ? 'text-cyan' : 'text-gray'}>
                            {outcome.toUpperCase()}
                          </span>
                          <span className={isYes ? 'text-cyan font-bold' : 'text-gray'}>
                            {probability}%
                          </span>
                        </div>
                        <div className="h-2 bg-background border border-border">
                          <div
                            className={`h-full ${isYes ? 'bg-cyan' : 'bg-gray-600'}`}
                            style={{ width: `${probability}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Market Stats */}
                <div className="flex items-center gap-4 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="text-gray">VOL:</span>
                    <span className="text-yellow">
                      ${(market.volume / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <span className="text-gray">|</span>
                  <div className="flex items-center gap-1">
                    <span className="text-gray">LIQ:</span>
                    <span className="text-blue">
                      ${(market.liquidity / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
