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

export interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number; // percentage
  changeValue: number;
  isPositive: boolean;
  history: number[]; // For sparkline
}

export interface WeatherForecast {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm';
}

export interface WeatherData {
  location: string;
  currentTemp: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'snow' | 'storm';
  humidity: number;
  windSpeed: number;
  forecast: WeatherForecast[];
}

export interface TrendingCompany {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  isPositive: boolean;
}
