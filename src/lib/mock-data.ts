import { NewsItem, Category, MarketItem, WeatherData, TrendingCompany } from '@/types';

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'The Rise of Agentic AI: Beyond Chatbots',
    summary: 'Autonomous agents are shifting from passive responders to active goal-seekers, capable of executing complex workflows across multiple tools.',
    content: 'Agentic AI represents a fundamental shift in how we interact with machines. Unlike traditional LLM interfaces that wait for prompts, agentic systems can autonomously break down goals, reason through steps, and execute actions in the real world.',
    source: 'AI Insider',
    url: 'https://example.com/ai-agents',
    category: 'AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    readingTime: 5,
  },
  {
    id: '2',
    title: 'Ethereum Dencun Upgrade: What to Expect',
    summary: 'The upcoming Dencun upgrade aims to drastically reduce Layer 2 transaction costs via EIP-4844 (Proto-Danksharding).',
    content: 'The Dencun upgrade is one of the most significant milestones for Ethereum since The Merge. By introducing "blobs", it allows Layer 2 networks like Arbitrum and Optimism to store data more efficiently, leading to sub-cent transaction fees.',
    source: 'CryptoPulse',
    url: 'https://example.com/eth-dencun',
    category: 'Crypto',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
    readingTime: 4,
  },
  {
    id: '3',
    title: 'Apple Vision Pro: Spatial Computing Era Begins',
    summary: 'Early reviews suggest that while heavy, the Vision Pro offers an unparalleled immersive experience that redefines "spatial computing".',
    content: 'Apple\'s entry into the headset market isn\'t just about VR or AR; it\'s about creating a new computing paradigm. The integration of eye-tracking and hand-gestures sets a new bar for user interface design.',
    source: 'TechFrontier',
    url: 'https://example.com/vision-pro',
    category: 'Tech',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1707310037146-599298e6a187?auto=format&fit=crop&q=80&w=800',
    readingTime: 7,
  },
  {
    id: '4',
    title: 'Global Inflation Trends: A Cooling Signal?',
    summary: 'Recent CPI data suggests that central bank rate hikes are finally having the intended effect, though the "last mile" remains challenging.',
    content: 'Macroeconomists are closely watching the latest inflation figures. While energy prices have stabilized, service-sector inflation remains sticky, complicating the path toward a soft landing.',
    source: 'MacroView',
    url: 'https://example.com/macro-inflation',
    category: 'Macro',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    imageUrl: 'https://images.unsplash.com/photo-1611974714024-4607a55d46ed?auto=format&fit=crop&q=80&w=800',
    readingTime: 6,
  },
  {
    id: '5',
    title: 'NVIDIA Enters New Phase of Dominance',
    summary: 'With the announcement of Blackwell, NVIDIA cements its position as the primary architect of the AI hardware revolution.',
    content: 'The Blackwell GPU architecture promises to provide 25x less cost and energy consumption compared to its predecessor, H100. This leap is critical for training trillion-parameter models.',
    source: 'TechFrontier',
    url: 'https://example.com/nvidia-blackwell',
    category: 'AI',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    imageUrl: 'https://images.unsplash.com/photo-1591447732043-4f964aa22e43?auto=format&fit=crop&q=80&w=800',
    readingTime: 3,
  }
];

export async function getNews(category?: Category): Promise<NewsItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (category) {
    return MOCK_NEWS.filter(item => item.category === category);
  }
  
  return MOCK_NEWS;
}


export async function getCategories(): Promise<Category[]> {
  return ['AI', 'Crypto', 'Tech', 'Macro'];
}

export const MOCK_MARKET: MarketItem[] = [
  {
    symbol: 'SPX',
    name: 'S&P 500',
    price: 4783.45,
    change: 0.54,
    changeValue: 25.6,
    isPositive: true,
    history: [4750, 4760, 4755, 4770, 4780, 4783.45]
  },
  {
    symbol: 'NDX',
    name: 'NASDAQ',
    price: 16832.90,
    change: 0.89,
    changeValue: 148.2,
    isPositive: true,
    history: [16700, 16750, 16720, 16800, 16810, 16832.90]
  },
  {
    symbol: 'VIX',
    name: 'Volatility',
    price: 13.45,
    change: -2.3,
    changeValue: -0.32,
    isPositive: false, // For VIX, down is usually "good" but strictly numerically it's negative change
    history: [14.0, 13.8, 13.9, 13.6, 13.5, 13.45]
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 64230.50,
    change: 1.2,
    changeValue: 760.3,
    isPositive: true,
    history: [63500, 63800, 63600, 64000, 64100, 64230.50]
  }
];

export const MOCK_WEATHER: WeatherData = {
  location: 'Zurich',
  currentTemp: 18,
  condition: 'cloudy',
  humidity: 65,
  windSpeed: 12,
  forecast: [
    { day: 'Mon', tempMin: 12, tempMax: 20, condition: 'sunny' },
    { day: 'Tue', tempMin: 14, tempMax: 22, condition: 'cloudy' },
    { day: 'Wed', tempMin: 13, tempMax: 19, condition: 'rain' },
    { day: 'Thu', tempMin: 11, tempMax: 18, condition: 'cloudy' },
    { day: 'Fri', tempMin: 10, tempMax: 17, condition: 'sunny' }
  ]
};

export const MOCK_TRENDING: TrendingCompany[] = [
  { id: '1', name: 'NVIDIA Corp', symbol: 'NVDA', price: 890.55, change: 3.4, isPositive: true },
  { id: '2', name: 'Tesla Inc', symbol: 'TSLA', price: 175.30, change: -1.2, isPositive: false },
  { id: '3', name: 'Microsoft', symbol: 'MSFT', price: 420.10, change: 0.8, isPositive: true },
  { id: '4', name: 'Apple Inc', symbol: 'AAPL', price: 170.25, change: -0.5, isPositive: false },
  { id: '5', name: 'Meta Platforms', symbol: 'META', price: 495.60, change: 1.5, isPositive: true }
];

export async function getMarketData(): Promise<MarketItem[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_MARKET;
}

export async function getWeatherData(): Promise<WeatherData> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_WEATHER;
}

export async function getTrendingCompanies(): Promise<TrendingCompany[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_TRENDING;
}
