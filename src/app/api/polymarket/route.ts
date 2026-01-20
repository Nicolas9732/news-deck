import { NextResponse } from 'next/server';
import { fetchPolymarketData, searchPolymarketMarkets } from '@/lib/polymarket-service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    let data;
    if (query) {
      data = await searchPolymarketMarkets(query);
    } else {
      data = await fetchPolymarketData();
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Polymarket API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Polymarket data' },
      { status: 500 }
    );
  }
}
