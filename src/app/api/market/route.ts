import { NextResponse } from 'next/server';
import { fetchMarketDataByCategory, fetchTrendingStocks, AssetCategory } from '@/lib/market-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as AssetCategory | null;

  try {
    // If specific category requested, return just that
    if (category && ['indices', 'crypto', 'commodities', 'stocks'].includes(category)) {
      const data = await fetchMarketDataByCategory(category);
      return NextResponse.json({ [category]: data });
    }

    // Default: return all categories
    const [indices, crypto, commodities, trending] = await Promise.all([
      fetchMarketDataByCategory('indices'),
      fetchMarketDataByCategory('crypto'),
      fetchMarketDataByCategory('commodities'),
      fetchTrendingStocks()
    ]);
    
    return NextResponse.json({ 
      indices, 
      crypto, 
      commodities,
      trending,
      // Legacy support
      market: indices 
    });
  } catch (error) {
    console.error('Market API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
