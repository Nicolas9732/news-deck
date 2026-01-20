import yahooFinance from 'yahoo-finance2';
import { MarketItem, TrendingCompany } from '@/types';

// Asset categories
const INDICES_SYMBOLS = ['^GSPC', '^IXIC', '^DJI', '^VIX'];
const CRYPTO_SYMBOLS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD'];
const COMMODITIES_SYMBOLS = ['GC=F', 'SI=F', 'CL=F', 'NG=F']; // Gold, Silver, Oil, NatGas
const TRENDING_SYMBOLS = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'META'];

// Friendly names for commodities and indices
const SYMBOL_NAMES: Record<string, string> = {
  '^GSPC': 'S&P 500',
  '^IXIC': 'NASDAQ',
  '^DJI': 'Dow Jones',
  '^VIX': 'VIX',
  'GC=F': 'Gold',
  'SI=F': 'Silver',
  'CL=F': 'Crude Oil',
  'NG=F': 'Natural Gas',
  'BTC-USD': 'Bitcoin',
  'ETH-USD': 'Ethereum',
  'SOL-USD': 'Solana',
  'XRP-USD': 'XRP',
};

export type AssetCategory = 'indices' | 'crypto' | 'commodities' | 'stocks';

// Cache to prevent hitting rate limits
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache: Record<string, CacheEntry<MarketItem[]>> = {};
let trendingCache: { data: TrendingCompany[]; timestamp: number } | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes - reduced rate limiting issues

interface YahooQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketChange?: number;
  [key: string]: unknown;
}

// Get symbols for a specific category
function getSymbolsForCategory(category: AssetCategory): string[] {
  switch (category) {
    case 'indices': return INDICES_SYMBOLS;
    case 'crypto': return CRYPTO_SYMBOLS;
    case 'commodities': return COMMODITIES_SYMBOLS;
    case 'stocks': return TRENDING_SYMBOLS;
    default: return INDICES_SYMBOLS;
  }
}

// Fetch market data for a specific category
export async function fetchMarketDataByCategory(category: AssetCategory): Promise<MarketItem[]> {
  const cacheKey = category;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  const symbols = getSymbolsForCategory(category);

  try {
    const quotes = await yahooFinance.quote(symbols) as unknown as YahooQuote[];
    
    const results = await Promise.all(quotes.map(async (quote: YahooQuote) => {
      let history: number[] = [];
      try {
        // Fetch 1 day chart with 1h interval for sparkline
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chart = await yahooFinance.chart(quote.symbol, { period1: '1d', interval: '1h' }) as any;
        if (chart && chart.quotes) {
          history = chart.quotes
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((q: any) => q.close)
            .filter((c: unknown): c is number => typeof c === 'number');
        }
      } catch (e) {
        console.error(`Failed to fetch chart for ${quote.symbol}`, e);
      }

      // Fallback if history is empty
      if (history.length === 0) {
        history = [quote.regularMarketPrice || 0, quote.regularMarketPrice || 0]; 
      }

      // Use friendly name if available
      const displayName = SYMBOL_NAMES[quote.symbol] || quote.shortName || quote.longName || quote.symbol;

      return {
        symbol: quote.symbol,
        name: displayName,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChangePercent || 0,
        changeValue: quote.regularMarketChange || 0,
        isPositive: (quote.regularMarketChange || 0) >= 0,
        history
      };
    }));

    cache[cacheKey] = { data: results, timestamp: Date.now() };
    return results;
  } catch (error) {
    console.error(`Error fetching ${category} data:`, error);
    return cache[cacheKey]?.data || [];
  }
}

// Legacy function for backwards compatibility - fetches indices
export async function fetchMarketData(): Promise<MarketItem[]> {
  return fetchMarketDataByCategory('indices');
}

export async function fetchTrendingStocks(): Promise<TrendingCompany[]> {
  if (trendingCache && Date.now() - trendingCache.timestamp < CACHE_DURATION) {
    return trendingCache.data;
  }

  try {
    const quotes = await yahooFinance.quote(TRENDING_SYMBOLS) as unknown as YahooQuote[];
    
    const results = quotes.map((quote: YahooQuote) => ({
      id: quote.symbol,
      name: quote.shortName || quote.longName || quote.symbol,
      symbol: quote.symbol,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChangePercent || 0,
      isPositive: (quote.regularMarketChangePercent || 0) >= 0
    }));

    trendingCache = { data: results, timestamp: Date.now() };
    return results;
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    return [];
  }
}
