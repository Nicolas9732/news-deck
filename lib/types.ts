export type QuadrantType = 'geo' | 'finance' | 'tech' | 'odds';

export interface FeedSource {
    id: string;
    name: string;
    url: string;
    type: 'rss' | 'twitter' | 'api';
    quadrant: QuadrantType;
    enabled: boolean;
}

export interface NewsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    source: string;
    snippet?: string;
    content?: string;
    imageUrl?: string;
}

export const DEFAULT_FEEDS: FeedSource[] = [
    // Geopolitics
    { id: 'geo-1', name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews', type: 'rss', quadrant: 'geo', enabled: true },
    { id: 'geo-2', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', type: 'rss', quadrant: 'geo', enabled: true },

    // Finance
    { id: 'fin-1', name: 'Yahoo Finance', url: 'https://finance.yahoo.com/news/rssindex', type: 'rss', quadrant: 'finance', enabled: true },

    // Tech
    { id: 'tech-1', name: 'Hacker News', url: 'https://news.ycombinator.com/rss', type: 'rss', quadrant: 'tech', enabled: true },
    { id: 'tech-2', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', type: 'rss', quadrant: 'tech', enabled: true },

    // Odds (PolyMarket is API based, but we can have RSS fallback if available)
    { id: 'odds-1', name: 'PolyMarket Blog', url: 'https://blog.polymarket.com/rss/', type: 'rss', quadrant: 'odds', enabled: true },
];
