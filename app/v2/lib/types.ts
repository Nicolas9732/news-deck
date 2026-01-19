export type QuadrantType = 'geo' | 'finance' | 'tech' | 'odds';
export type TopicType = 'predefined' | 'geopolitics' | 'custom';
export type ColumnType = 'news' | 'polymarket' | 'reader' | 'twitter' | 'notes';

export interface Topic {
  id: string;
  name: string;
  type: TopicType;
  keywords: string[];
  country?: string;
  icon?: string;
  color?: string;
  layout?: ColumnLayout;
}

export interface Column {
  id: string;
  type: ColumnType;
  width: number; // 1-12 grid units
  position: number;
  config: ColumnConfig;
  visible: boolean;
}

export interface ColumnConfig {
  title?: string;
  refreshInterval?: number;
  showMetadata?: boolean;
  compactView?: boolean;
}

export interface ColumnLayout {
  columns: Column[];
  selectedColumnId?: string;
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

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'twitter' | 'api';
  enabled: boolean;
}

export interface PolymarketMarket {
  id: string;
  question: string;
  outcomes: string[];
  prices: number[];
  volume: number;
  liquidity: number;
  endDate: string;
  image?: string;
  change24h?: number;
}
