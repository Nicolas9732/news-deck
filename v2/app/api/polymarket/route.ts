import { NextRequest, NextResponse } from 'next/server';

// Simple cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 15000; // 15 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keywords = searchParams.get('keywords')?.split(',') || [];

    if (keywords.length === 0) {
      return NextResponse.json({ markets: [] });
    }

    const cacheKey = keywords.join(',');
    const cached = cache.get(cacheKey);

    // Return cached data if still fresh
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Fetch from Polymarket API
    const response = await fetch('https://gamma-api.polymarket.com/markets', {
      headers: {
        'User-Agent': 'NewsDeck/2.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.statusText}`);
    }

    const allMarkets = await response.json();

    // Filter markets by keywords
    const filteredMarkets = allMarkets
      .filter((market: any) => {
        const searchText = `${market.question} ${market.description || ''}`.toLowerCase();
        return keywords.some(keyword =>
          searchText.includes(keyword.toLowerCase())
        );
      })
      .slice(0, 20) // Limit to 20 markets
      .map((market: any) => ({
        id: market.condition_id || market.id,
        question: market.question,
        outcomes: market.outcomes || ['Yes', 'No'],
        prices: market.outcomePrices ? market.outcomePrices.split(',').map((p: string) => parseFloat(p)) : [0.5, 0.5],
        volume: market.volume || 0,
        liquidity: market.liquidity || 0,
        endDate: market.endDate || market.end_date_iso,
        image: market.image,
      }));

    const result = { markets: filteredMarkets };

    // Cache the result
    cache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 's-maxage=15, stale-while-revalidate=30',
      },
    });
  } catch (error: any) {
    console.error('Polymarket API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markets', details: error.message, markets: [] },
      { status: 500 }
    );
  }
}
