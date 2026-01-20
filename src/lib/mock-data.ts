import { NewsItem, Category } from '@/types';

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
