import { PolymarketData } from '@/types';

// Polymarket Gamma API endpoint (public, no auth required)
const GAMMA_API = 'https://gamma-api.polymarket.com';

interface GammaMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  volume: number;
  volumeNum: number;
  outcomePrices: string; // JSON string like "[0.65, 0.35]"
  active: boolean;
  closed: boolean;
}

// Cache for API responses
interface CacheEntry {
  data: PolymarketData[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Mock fallback data
const MOCK_DATA: PolymarketData[] = [
  { id: '1', question: 'Fed Rate Cut in March?', yes: 15, no: 85, volume: '$12.5M' },
  { id: '2', question: 'Bitcoin > $100k in 2024?', yes: 62, no: 38, volume: '$45.2M' },
  { id: '3', question: 'TikTok Banned in US?', yes: 34, no: 66, volume: '$8.1M' },
  { id: '4', question: 'Trump wins 2024 election?', yes: 48, no: 52, volume: '$125M' },
  { id: '5', question: 'AI causes major incident in 2024?', yes: 22, no: 78, volume: '$5.3M' },
];

function formatVolume(volume: number): string {
  if (volume >= 1000000) {
    return `$${(volume / 1000000).toFixed(1)}M`;
  } else if (volume >= 1000) {
    return `$${(volume / 1000).toFixed(1)}K`;
  }
  return `$${volume.toFixed(0)}`;
}

export async function fetchPolymarketData(searchQuery?: string): Promise<PolymarketData[]> {
  // Check cache if no search query
  if (!searchQuery && cache && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    // Use Gamma API for better market discovery
    const url = new URL(`${GAMMA_API}/markets`);
    url.searchParams.set('limit', '20');
    url.searchParams.set('active', 'true');
    url.searchParams.set('closed', 'false');
    url.searchParams.set('order', 'volume');
    url.searchParams.set('ascending', 'false');
    
    if (searchQuery) {
      url.searchParams.set('tag_slug', searchQuery.toLowerCase());
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 120 } // Cache for 2 minutes
    });

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`);
    }

    const markets: GammaMarket[] = await response.json();

    const data: PolymarketData[] = markets
      .filter(m => m.active && !m.closed && m.outcomePrices)
      .slice(0, 10)
      .map(market => {
        let yesPrice = 50;
        let noPrice = 50;
        
        try {
          const prices = JSON.parse(market.outcomePrices);
          if (Array.isArray(prices) && prices.length >= 2) {
            yesPrice = Math.round(parseFloat(prices[0]) * 100);
            noPrice = Math.round(parseFloat(prices[1]) * 100);
          }
        } catch {
          // Keep defaults
        }

        return {
          id: market.id || market.conditionId,
          question: market.question,
          yes: yesPrice,
          no: noPrice,
          volume: formatVolume(market.volumeNum || market.volume || 0),
        };
      });

    // Update cache only for non-search queries
    if (!searchQuery && data.length > 0) {
      cache = { data, timestamp: Date.now() };
    }

    return data.length > 0 ? data : MOCK_DATA;
  } catch (error) {
    console.error('Polymarket API error:', error);
    // Return cached data if available, otherwise mock
    return cache?.data || MOCK_DATA;
  }
}

// Search markets by keyword
export async function searchPolymarketMarkets(query: string): Promise<PolymarketData[]> {
  try {
    const url = new URL(`${GAMMA_API}/markets`);
    url.searchParams.set('limit', '20');
    url.searchParams.set('active', 'true');
    url.searchParams.set('closed', 'false');
    
    // The API uses text_query for search
    if (query) {
      url.searchParams.set('text_query', query);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Polymarket search error: ${response.status}`);
    }

    const markets: GammaMarket[] = await response.json();

    return markets
      .filter(m => m.active && !m.closed && m.outcomePrices)
      .slice(0, 10)
      .map(market => {
        let yesPrice = 50;
        let noPrice = 50;
        
        try {
          const prices = JSON.parse(market.outcomePrices);
          if (Array.isArray(prices) && prices.length >= 2) {
            yesPrice = Math.round(parseFloat(prices[0]) * 100);
            noPrice = Math.round(parseFloat(prices[1]) * 100);
          }
        } catch {
          // Keep defaults
        }

        return {
          id: market.id || market.conditionId,
          question: market.question,
          yes: yesPrice,
          no: noPrice,
          volume: formatVolume(market.volumeNum || market.volume || 0),
        };
      });
  } catch (error) {
    console.error('Polymarket search error:', error);
    return [];
  }
}
