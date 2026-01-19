import { FeedSource } from "./types";

// RSS Sources by Topic/Country
export const RSS_SOURCES: Record<string, FeedSource[]> = {
  // Finance Sources
  finance: [
    { id: 'fin-1', name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews', type: 'rss', enabled: true },
    { id: 'fin-2', name: 'Financial Times', url: 'https://www.ft.com/?format=rss', type: 'rss', enabled: true },
    { id: 'fin-3', name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss', type: 'rss', enabled: true },
    { id: 'fin-4', name: 'MarketWatch', url: 'https://www.marketwatch.com/rss/topstories', type: 'rss', enabled: true },
  ],

  // Tech Sources
  tech: [
    { id: 'tech-1', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', type: 'rss', enabled: true },
    { id: 'tech-2', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', type: 'rss', enabled: true },
    { id: 'tech-3', name: 'Hacker News', url: 'https://news.ycombinator.com/rss', type: 'rss', enabled: true },
    { id: 'tech-4', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', type: 'rss', enabled: true },
    { id: 'tech-5', name: 'Wired', url: 'https://www.wired.com/feed/rss', type: 'rss', enabled: true },
  ],

  // Crypto Sources
  crypto: [
    { id: 'crypto-1', name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', type: 'rss', enabled: true },
    { id: 'crypto-2', name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', type: 'rss', enabled: true },
    { id: 'crypto-3', name: 'Decrypt', url: 'https://decrypt.co/feed', type: 'rss', enabled: true },
    { id: 'crypto-4', name: 'The Block', url: 'https://www.theblock.co/rss.xml', type: 'rss', enabled: true },
  ],

  // Geopolitics - Iran
  iran: [
    { id: 'iran-1', name: 'Reuters Middle East', url: 'https://feeds.reuters.com/reuters/MENews', type: 'rss', enabled: true },
    { id: 'iran-2', name: 'Al Jazeera Middle East', url: 'https://www.aljazeera.com/xml/rss/all.xml', type: 'rss', enabled: true },
    { id: 'iran-3', name: 'Times of Israel', url: 'https://www.timesofisrael.com/feed/', type: 'rss', enabled: true },
    { id: 'iran-4', name: 'BBC Middle East', url: 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml', type: 'rss', enabled: true },
  ],

  // Geopolitics - Ukraine
  ukraine: [
    { id: 'ukraine-1', name: 'Kyiv Independent', url: 'https://kyivindependent.com/feed/', type: 'rss', enabled: true },
    { id: 'ukraine-2', name: 'Reuters Europe', url: 'https://feeds.reuters.com/reuters/UKdomesticNews', type: 'rss', enabled: true },
    { id: 'ukraine-3', name: 'BBC Europe', url: 'http://feeds.bbci.co.uk/news/world/europe/rss.xml', type: 'rss', enabled: true },
    { id: 'ukraine-4', name: 'Defense One', url: 'https://www.defenseone.com/rss/', type: 'rss', enabled: true },
  ],

  // Geopolitics - China
  china: [
    { id: 'china-1', name: 'South China Morning Post', url: 'https://www.scmp.com/rss/91/feed', type: 'rss', enabled: true },
    { id: 'china-2', name: 'Reuters Asia', url: 'https://feeds.reuters.com/reuters/INbusinessNews', type: 'rss', enabled: true },
    { id: 'china-3', name: 'FT Asia', url: 'https://www.ft.com/asia-pacific?format=rss', type: 'rss', enabled: true },
  ],

  // Geopolitics - Taiwan
  taiwan: [
    { id: 'taiwan-1', name: 'Focus Taiwan', url: 'https://focustaiwan.tw/rss/news.xml', type: 'rss', enabled: true },
    { id: 'taiwan-2', name: 'Taiwan News', url: 'https://www.taiwannews.com.tw/rss.xml', type: 'rss', enabled: true },
    { id: 'taiwan-3', name: 'Reuters Asia', url: 'https://feeds.reuters.com/reuters/INbusinessNews', type: 'rss', enabled: true },
  ],

  // Geopolitics - Russia
  russia: [
    { id: 'russia-1', name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews', type: 'rss', enabled: true },
    { id: 'russia-2', name: 'BBC Europe', url: 'http://feeds.bbci.co.uk/news/world/europe/rss.xml', type: 'rss', enabled: true },
  ],

  // Geopolitics - Israel/Palestine
  'israel-palestine': [
    { id: 'isr-1', name: 'Haaretz', url: 'https://www.haaretz.com/cmlink/1.628816', type: 'rss', enabled: true },
    { id: 'isr-2', name: 'Times of Israel', url: 'https://www.timesofisrael.com/feed/', type: 'rss', enabled: true },
    { id: 'isr-3', name: 'Al Jazeera Middle East', url: 'https://www.aljazeera.com/xml/rss/all.xml', type: 'rss', enabled: true },
    { id: 'isr-4', name: 'Reuters Middle East', url: 'https://feeds.reuters.com/reuters/MENews', type: 'rss', enabled: true },
  ],

  // Geopolitics - North Korea
  'north-korea': [
    { id: 'nk-1', name: 'NK News', url: 'https://www.nknews.org/feed/', type: 'rss', enabled: true },
    { id: 'nk-2', name: 'Reuters Asia', url: 'https://feeds.reuters.com/reuters/INbusinessNews', type: 'rss', enabled: true },
    { id: 'nk-3', name: 'BBC Asia', url: 'http://feeds.bbci.co.uk/news/world/asia/rss.xml', type: 'rss', enabled: true },
  ],
};

// Polymarket keywords by topic
export const POLYMARKET_KEYWORDS: Record<string, string[]> = {
  finance: ['inflation', 'fed', 'stocks', 'bitcoin', 'economy', 'market'],
  tech: ['ai', 'apple', 'tesla', 'tech', 'microsoft', 'google'],
  crypto: ['bitcoin', 'ethereum', 'crypto', 'btc', 'eth'],
  iran: ['iran', 'israel', 'middle east', 'war', 'gaza'],
  ukraine: ['ukraine', 'russia', 'putin', 'zelensky', 'war'],
  china: ['china', 'xi', 'taiwan', 'ccp'],
  taiwan: ['taiwan', 'china', 'strait'],
  russia: ['russia', 'putin', 'ukraine'],
  'israel-palestine': ['israel', 'palestine', 'gaza', 'hamas'],
  'north-korea': ['north korea', 'kim', 'dprk'],
};
