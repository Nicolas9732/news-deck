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

const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net',
  'https://nitter.cz'
];

interface Cache {
  data: OsintTweet[];
  timestamp: number;
}

let cache: Cache | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

  const fetchUserTweets = async (username: string): Promise<OsintTweet[]> => {
    for (const instance of NITTER_INSTANCES) {
      try {
        const feed = await parser.parseURL(`${instance}/${username}/rss`);
        
        if (!feed.items) continue;

        return feed.items.map(item => ({
          id: item.guid || item.link || `${username}-${item.isoDate}`,
          author: username,
          // contentSnippet is often cleaner for plain text, content has HTML
          content: item.contentSnippet || item.content || '', 
          timestamp: item.isoDate || new Date().toISOString(),
          url: item.link || ''
        }));
      } catch {
        // Silently fail on this instance and try the next
        continue;
      }
    }
    // If all instances fail, return empty array for this user
    return [];
  };

  try {
    const results = await Promise.all(ACCOUNTS.map(fetchUserTweets));
    
    // Flatten and sort
    const allTweets = results.flat().sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const topTweets = allTweets.slice(0, 30);

    // Update cache only if we got some data, to avoid caching empty results on transient errors
    // However, if we partially failed, we still want to cache what we got to avoid hammering
    if (topTweets.length > 0) {
      cache = {
        data: topTweets,
        timestamp: now
      };
    } else if (cache) {
      // If fetch completely failed but we have old cache, return old cache even if expired?
      // For now, let's just return what we have (empty) or maybe keep the old cache if it exists?
      // Logic: If fetch fails and we have expired cache, maybe returning expired is better than empty?
      // Implementation: sticking to simple logic for now.
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
