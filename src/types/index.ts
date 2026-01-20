export type Category = 'AI' | 'Crypto' | 'Tech' | 'Macro';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  url: string;
  category: Category;
  timestamp: string;
  imageUrl?: string;
  readingTime?: number;
}

export type LayoutMode = 'grid' | 'list';

export interface DashboardConfig {
  visibleCategories: Category[];
  layoutMode: LayoutMode;
  isCompact: boolean;
}
