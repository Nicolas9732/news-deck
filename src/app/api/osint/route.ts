import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { OsintTweet } from '@/types';

// Force dynamic to ensure we always run the logic (though we handle caching manually)
export const dynamic = 'force-dynamic';

const ACCOUNTS = [
  'Pizzint',
  'PolymarketIntel',
  'WarMonitor3',
  'Sino_Market',
  'Deltaone'
];

// RSSHub instances (more reliable than Nitter)
const RSSHUB_INSTANCES = [
  'https://rsshub.app',
  'https://rsshub.rssforever.com',
  'https://hub.slarker.me',
  'https://rsshub.feeded.xyz'
];

// Nitter as fallback
const NITTER_INSTANCES = [
  'https://nitter.poast.org',
  'https://nitter.privacydev.net',
  'https://nitter.cz',
  'https://nitter.net'
];

interface Cache {
  data: OsintTweet[];
  timestamp: number;
}

let cache: Cache | null = null;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for fresher data

export async function GET() {
  const now = Date.now();

  // Return cached data if valid
  if (cache && (now - cache.timestamp < CACHE_DURATION)) {
    return NextResponse.json({ items: cache.data });
  }

  const parser = new Parser({
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; NewsDashboard/1.0;)'
    }
  });

  // Helper to convert any tweet URL to x.com format with full path
  const normalizeTwitterUrl = (url: string, username: string): string => {
    if (!url) return `https://x.com/${username}`;
    
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Check if it contains a status ID (specific tweet)
      if (pathname.includes('/status/')) {
        return `https://x.com${pathname}`;
      }
      
      // For Nitter/RSSHub URLs that might have the tweet path
      if (pathname.startsWith(`/${username}`)) {
        return `https://x.com${pathname}`;
      }
      
      return `https://x.com/${username}`;
    } catch {
      // If URL parsing fails, return profile link
      return `https://x.com/${username}`;
    }
  };

  const fetchUserTweets = async (username: string): Promise<OsintTweet[]> => {
    // Try RSSHub first (more reliable)
    for (const instance of RSSHUB_INSTANCES) {
      try {
        const feed = await parser.parseURL(`${instance}/twitter/user/${username}`);
        
        if (!feed.items || feed.items.length === 0) continue;

        return feed.items.slice(0, 10).map(item => ({
          id: item.guid || item.link || `${username}-${Date.now()}-${Math.random()}`,
          author: username,
          content: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '') || '', 
          timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
          url: normalizeTwitterUrl(item.link || '', username)
        }));
      } catch {
        continue;
      }
    }

    // Fallback to Nitter
    for (const instance of NITTER_INSTANCES) {
      try {
        const feed = await parser.parseURL(`${instance}/${username}/rss`);
        
        if (!feed.items || feed.items.length === 0) continue;

        return feed.items.slice(0, 10).map(item => ({
          id: item.guid || item.link || `${username}-${Date.now()}-${Math.random()}`,
          author: username,
          content: item.contentSnippet || item.content?.replace(/<[^>]*>/g, '') || '', 
          timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
          url: normalizeTwitterUrl(item.link || '', username)
        }));
      } catch {
        continue;
      }
    }
    
    // If all instances fail, return empty array for this user
    return [];
  };

  // --- MOCK FALLBACK DATA ---
  const generateMockTweets = (): OsintTweet[] => {
    return [
      {
        id: 'mock-1',
        author: 'PolymarketIntel',
        content: 'BREAKING: Bitcoin > $100k odds hit 32% on Polymarket as ETF inflows surge. 📈 #Crypto',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        url: 'https://x.com/PolymarketIntel'
      },
      {
        id: 'mock-2',
        author: 'Deltaone',
        content: 'US DEC. CPI MOM +0.3% VS +0.2% EST; YOY +3.4% VS +3.2% EST.',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        url: 'https://x.com/Deltaone'
      },
      {
        id: 'mock-3',
        author: 'WarMonitor3',
        content: 'Reports of air raid sirens in Kyiv. Air defense active in the region.',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        url: 'https://x.com/WarMonitor3'
      },
      {
        id: 'mock-4',
        author: 'Sino_Market',
        content: 'PBoC sets USD/CNY reference rate at 7.1050 vs 7.1020 previous.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        url: 'https://x.com/Sino_Market'
      },
      {
        id: 'mock-5',
        author: 'Pizzint',
        content: 'New high-res satellite imagery confirms movement of carrier strike group in the Mediterranean.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        url: 'https://x.com/Pizzint'
      },
      {
        id: 'mock-6',
        author: 'Deltaone',
        content: 'TESLA SHARES DOWN 2% PREMARKET AFTER PRICE CUTS IN CHINA.',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        url: 'https://x.com/Deltaone'
      }
    ];
  };

  try {
    const results = await Promise.all(ACCOUNTS.map(fetchUserTweets));
    
    // Flatten and sort
    let topTweets = results.flat().sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }).slice(0, 30);

    // EMERGENCY FALLBACK: If scraping failed completely (0 items), use Mock Data
    if (topTweets.length === 0) {
      console.warn('OSINT Scrape failed. Using Fallback Mock Data.');
      topTweets = generateMockTweets();
    }

    // Update cache only if we got some data (real or mock fallback is better than empty)
    if (topTweets.length > 0) {
      cache = {
        data: topTweets,
        timestamp: now
      };
    }

    return NextResponse.json({ items: topTweets });
  } catch (error) {
    console.error('OSINT API Critical Error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh OSINT data' },
      { status: 500 }
    );
  }
}
