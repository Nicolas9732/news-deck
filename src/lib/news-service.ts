import Parser from 'rss-parser';
import { NewsItem, Category, PolymarketData } from '@/types';

const parser = new Parser();

const FEEDS: Record<string, string[]> = {
  'Finance': [
    'https://www.cnbc.com/id/15839069/device/rss/rss.html', // CNBC Investing
    'https://finance.yahoo.com/news/rssindex' // Yahoo Finance
  ],
  'Crypto': [
    'https://www.coindesk.com/arc/outboundfeeds/rss/', // CoinDesk
    'https://cointelegraph.com/rss' // Cointelegraph
  ],
  'Geopolitics': [
    'https://www.aljazeera.com/xml/rss/all.xml', // Al Jazeera
    'https://feeds.bbci.co.uk/news/world/rss.xml' // BBC World
  ],
  'Tech': [
    'https://techcrunch.com/feed/', // TechCrunch
    'https://www.theverge.com/rss/index.xml' // The Verge
  ]
};

// In-memory cache
interface CacheEntry {
  data: NewsItem[];
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchNews(category: string): Promise<NewsItem[]> {
  const targetCategories = FEEDS[category] ? [category] : Object.keys(FEEDS);
  const cacheKey = category;

  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`[NewsService] Serving ${category} from cache`);
    return cache[cacheKey].data;
  }

  console.log(`[NewsService] Fetching ${category} from RSS`);

  let allItems: NewsItem[] = [];
  const itemsByCategory: Record<string, NewsItem[]> = {};

  for (const cat of targetCategories) {
    itemsByCategory[cat] = [];
    const urls = FEEDS[cat];
    if (!urls) continue;

    for (const url of urls) {
      try {
        const feed = await parser.parseURL(url);
        const items = feed.items.map((item) => {
          // Attempt to find an image
          let imageUrl = undefined;
          if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image')) {
            imageUrl = item.enclosure.url;
          } else if (item['media:content'] && item['media:content']['$'] && item['media:content']['$']['url']) {
             imageUrl = item['media:content']['$']['url'];
          } else if (item.content && item.content.match(/src="([^"]+)"/)) {
            const match = item.content.match(/src="([^"]+)"/);
            if (match) imageUrl = match[1];
          }

          return {
            id: item.guid || item.link || Math.random().toString(),
            title: item.title || 'No Title',
            summary: item.contentSnippet || item.content || '',
            content: item.content || '',
            source: feed.title || 'Unknown Source',
            url: item.link || '',
            category: cat as Category,
            timestamp: item.pubDate || new Date().toISOString(),
            imageUrl: imageUrl,
            readingTime: Math.ceil((item.contentSnippet?.length || 0) / 200) || 1,
          };
        });
        itemsByCategory[cat].push(...items);
      } catch (error) {
        console.error(`[NewsService] Error fetching ${url}:`, error);
      }
    }
    
    // Sort category items by date descending
    itemsByCategory[cat].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Interleaving logic for mixed feeds (For You)
  if (targetCategories.length > 1) {
    const maxItems = Math.max(...Object.values(itemsByCategory).map(list => list.length));
    
    // Take 2 from each category in round-robin fashion
    for (let i = 0; i < maxItems; i += 2) {
      for (const cat of targetCategories) {
        if (itemsByCategory[cat]) {
          const slice = itemsByCategory[cat].slice(i, i + 2);
          allItems.push(...slice);
        }
      }
    }
  } else {
    // Single category
    if (targetCategories[0] && itemsByCategory[targetCategories[0]]) {
        allItems = itemsByCategory[targetCategories[0]];
    }
  }

  // Update cache
  cache[cacheKey] = {
    data: allItems,
    timestamp: Date.now()
  };

  return allItems;
}

export function fetchPolymarketTrending(): PolymarketData[] {
  // Mock data as per request since we don't have an API key
  return [
    {
      id: '1',
      question: 'Fed Rate Cut in March?',
      yes: 15,
      no: 85,
      volume: '$12.5M'
    },
    {
      id: '2',
      question: 'Bitcoin > $100k in 2024?',
      yes: 62,
      no: 38,
      volume: '$45.2M'
    },
    {
      id: '3',
      question: 'TikTok Banned in US?',
      yes: 34,
      no: 66,
      volume: '$8.1M'
    }
  ];
}
