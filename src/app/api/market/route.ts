import { NextResponse } from 'next/server';
import { fetchMarketDataByCategory, fetchTrendingStocks, AssetCategory } from '@/lib/market-service';

export const dynamic = 'force-dynamic';

// Fallback data when API fails
const FALLBACK_DATA = {
  indices: [
    { symbol: '^GSPC', name: 'S&P 500', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
    { symbol: '^IXIC', name: 'NASDAQ', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
    { symbol: '^DJI', name: 'Dow Jones', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
  ],
  crypto: [
    { symbol: 'BTC-USD', name: 'Bitcoin', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
    { symbol: 'ETH-USD', name: 'Ethereum', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
  ],
  commodities: [
    { symbol: 'GC=F', name: 'Gold', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
    { symbol: 'CL=F', name: 'Crude Oil', price: 0, change: 0, changeValue: 0, isPositive: true, history: [] },
  ],
  trending: []
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as AssetCategory | null;

  try {
    // If specific category requested, return just that with error handling
    if (category && ['indices', 'crypto', 'commodities', 'stocks'].includes(category)) {
      try {
        const data = await fetchMarketDataByCategory(category);
        return NextResponse.json({ [category]: data });
      } catch (error) {
        console.error(`Failed to fetch ${category}:`, error);
        return NextResponse.json({
          [category]: FALLBACK_DATA[category as keyof typeof FALLBACK_DATA] || [],
          error: `Failed to load ${category} data`
        });
      }
    }

    // Default: return all categories using Promise.allSettled for graceful degradation
    const results = await Promise.allSettled([
      fetchMarketDataByCategory('indices'),
      fetchMarketDataByCategory('crypto'),
      fetchMarketDataByCategory('commodities'),
      fetchTrendingStocks()
    ]);

    const [indicesResult, cryptoResult, commoditiesResult, trendingResult] = results;

    const response = {
      indices: indicesResult.status === 'fulfilled' ? indicesResult.value : FALLBACK_DATA.indices,
      crypto: cryptoResult.status === 'fulfilled' ? cryptoResult.value : FALLBACK_DATA.crypto,
      commodities: commoditiesResult.status === 'fulfilled' ? commoditiesResult.value : FALLBACK_DATA.commodities,
      trending: trendingResult.status === 'fulfilled' ? trendingResult.value : FALLBACK_DATA.trending,
      // Legacy support
      market: indicesResult.status === 'fulfilled' ? indicesResult.value : FALLBACK_DATA.indices,
      // Include error info for debugging
      errors: {
        indices: indicesResult.status === 'rejected' ? 'Failed to load' : null,
        crypto: cryptoResult.status === 'rejected' ? 'Failed to load' : null,
        commodities: commoditiesResult.status === 'rejected' ? 'Failed to load' : null,
        trending: trendingResult.status === 'rejected' ? 'Failed to load' : null,
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json({
      ...FALLBACK_DATA,
      market: FALLBACK_DATA.indices,
      error: 'Failed to fetch market data'
    });
  }
}
