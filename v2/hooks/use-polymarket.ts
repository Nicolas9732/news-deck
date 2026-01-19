"use client";

import { useState, useEffect } from 'react';
import { PolymarketMarket } from '@/v2/lib/types';

export function usePolymarket(keywords: string[], refreshInterval = 15000) {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkets() {
      if (keywords.length === 0) {
        setMarkets([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const keywordsParam = encodeURIComponent(keywords.join(','));
        const res = await fetch(`/v2/app/api/polymarket?keywords=${keywordsParam}`);
        if (!res.ok) throw new Error('Failed to fetch markets');
        const data = await res.json();
        setMarkets(data.markets || []);
      } catch (err) {
        console.error('Failed to fetch Polymarket data', err);
        setError('Failed to load markets');
      } finally {
        setLoading(false);
      }
    }

    fetchMarkets();
    const interval = setInterval(fetchMarkets, refreshInterval);
    return () => clearInterval(interval);
  }, [keywords, refreshInterval]);

  return { markets, loading, error };
}
