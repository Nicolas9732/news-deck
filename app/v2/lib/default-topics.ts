import { Topic, Column } from "./types";
import { RSS_SOURCES, POLYMARKET_KEYWORDS } from "./sources";

// Default column layouts
function createDefaultLayout(topicId: string): Column[] {
  return [
    {
      id: 'news-1',
      type: 'news',
      width: 4,
      position: 0,
      config: {
        title: 'News Feed',
        refreshInterval: 60000,
        showMetadata: true,
        compactView: false,
      },
      visible: true,
    },
    {
      id: 'reader-1',
      type: 'reader',
      width: 5,
      position: 1,
      config: {
        title: 'Article Reader',
      },
      visible: true,
    },
    {
      id: 'polymarket-1',
      type: 'polymarket',
      width: 3,
      position: 2,
      config: {
        title: 'Markets',
        refreshInterval: 15000,
        showMetadata: true,
        compactView: false,
      },
      visible: true,
    },
  ];
}

export const DEFAULT_TOPICS: Topic[] = [
  // Pre-defined topics
  {
    id: 'finance',
    name: 'Finance',
    type: 'predefined',
    keywords: ['finance', 'market', 'stock', 'economy', 'trading', 'investment'],
    icon: 'TrendingUp',
    color: 'var(--color-topic-finance)',
    layout: {
      columns: createDefaultLayout('finance'),
    },
  },
  {
    id: 'tech',
    name: 'Technology',
    type: 'predefined',
    keywords: ['tech', 'technology', 'ai', 'software', 'startup', 'innovation'],
    icon: 'Cpu',
    color: 'var(--color-topic-tech)',
    layout: {
      columns: createDefaultLayout('tech'),
    },
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    type: 'predefined',
    keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'btc', 'eth'],
    icon: 'Bitcoin',
    color: 'var(--color-topic-crypto)',
    layout: {
      columns: createDefaultLayout('crypto'),
    },
  },

  // Geopolitics topics
  {
    id: 'iran',
    name: 'Iran',
    type: 'geopolitics',
    country: 'iran',
    keywords: ['iran', 'iranian', 'tehran', 'middle east', 'israel'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('iran'),
    },
  },
  {
    id: 'ukraine',
    name: 'Ukraine',
    type: 'geopolitics',
    country: 'ukraine',
    keywords: ['ukraine', 'ukrainian', 'kyiv', 'russia', 'war'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('ukraine'),
    },
  },
  {
    id: 'china',
    name: 'China',
    type: 'geopolitics',
    country: 'china',
    keywords: ['china', 'chinese', 'beijing', 'xi', 'ccp'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('china'),
    },
  },
  {
    id: 'taiwan',
    name: 'Taiwan',
    type: 'geopolitics',
    country: 'taiwan',
    keywords: ['taiwan', 'taiwanese', 'taipei', 'strait'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('taiwan'),
    },
  },
  {
    id: 'russia',
    name: 'Russia',
    type: 'geopolitics',
    country: 'russia',
    keywords: ['russia', 'russian', 'moscow', 'putin', 'kremlin'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('russia'),
    },
  },
  {
    id: 'israel-palestine',
    name: 'Israel/Palestine',
    type: 'geopolitics',
    country: 'israel-palestine',
    keywords: ['israel', 'palestine', 'palestinian', 'gaza', 'hamas', 'west bank'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('israel-palestine'),
    },
  },
  {
    id: 'north-korea',
    name: 'North Korea',
    type: 'geopolitics',
    country: 'north-korea',
    keywords: ['north korea', 'dprk', 'pyongyang', 'kim jong'],
    icon: 'Globe',
    color: 'var(--color-topic-geo)',
    layout: {
      columns: createDefaultLayout('north-korea'),
    },
  },
];

export function getTopicById(id: string): Topic | undefined {
  return DEFAULT_TOPICS.find(t => t.id === id);
}

export function getTopicsByType(type: Topic['type']): Topic[] {
  return DEFAULT_TOPICS.filter(t => t.type === type);
}
