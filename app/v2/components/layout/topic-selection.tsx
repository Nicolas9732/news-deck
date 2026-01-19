"use client";

import { useState } from 'react';
import { Topic } from '@/app/v2/lib/types';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { TrendingUp, Cpu, Bitcoin, Globe, Search, Plus } from 'lucide-react';
import { useTheme } from '@/app/v2/contexts/theme-context';

const TOPIC_ICONS = {
  TrendingUp,
  Cpu,
  Bitcoin,
  Globe,
};

export function TopicSelection() {
  const { topics, selectTopic } = useTopic();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const predefinedTopics = filteredTopics.filter(t => t.type === 'predefined');
  const geopoliticsTopics = filteredTopics.filter(t => t.type === 'geopolitics');

  return (
    <div className="min-h-screen bg-background relative">
      {/* Grid overlay */}
      <div className="fixed inset-0 grid-overlay pointer-events-none" />

      {/* Diagonal accent */}
      <div className="fixed top-0 right-0 w-1/3 h-full bg-primary/5 transform skew-x-12 translate-x-1/2" />

      {/* Header */}
      <header className="relative z-10 border-b-[3px] border-border">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-6xl mb-2 leading-none">
                INTELLIGENCE
              </h1>
              <div className="h-1 w-32 bg-primary" />
            </div>

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="btn-brutal"
            >
              {resolvedTheme === 'dark' ? '☀' : '☾'} {resolvedTheme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          </div>

          <p className="font-mono text-sm uppercase tracking-wider text-secondary">
            SELECT MONITORING DOMAIN
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Search */}
        <div className="mb-16 animate-slide-up-brutal">
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="SEARCH TOPICS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-5 border-[3px] border-border bg-input font-mono text-sm uppercase tracking-wide focus:outline-none focus:border-primary placeholder:text-muted-fg"
            />
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-fg" />
          </div>
        </div>

        {/* Markets & Tech */}
        {predefinedTopics.length > 0 && (
          <section className="mb-16 animate-slide-up-brutal stagger-1">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-display text-4xl">Markets</h2>
              <div className="flex-1 h-[3px] bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {predefinedTopics.map((topic) => (
                <TopicCardBrutal key={topic.id} topic={topic} onSelect={selectTopic} />
              ))}
            </div>
          </section>
        )}

        {/* Geopolitics */}
        {geopoliticsTopics.length > 0 && (
          <section className="mb-16 animate-slide-up-brutal stagger-2">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-display text-4xl">Geopolitics</h2>
              <div className="flex-1 h-[3px] bg-border" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {geopoliticsTopics.map((topic) => (
                <TopicCardCompact key={topic.id} topic={topic} onSelect={selectTopic} />
              ))}
            </div>
          </section>
        )}

        {/* Custom */}
        <section className="animate-slide-up-brutal stagger-3">
          <button className="card-brutal w-full md:w-auto px-12 py-8 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-[3px] border-border flex items-center justify-center bg-background">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-mono font-bold text-sm uppercase tracking-wider">
                Create Custom
              </span>
            </div>
          </button>
        </section>
      </main>
    </div>
  );
}

function TopicCardBrutal({ topic, onSelect }: { topic: Topic; onSelect: (topic: Topic) => void }) {
  const Icon = topic.icon ? TOPIC_ICONS[topic.icon as keyof typeof TOPIC_ICONS] : Globe;

  const colorClass = topic.id === 'finance' ? 'bg-topic-finance' :
                     topic.id === 'tech' ? 'bg-topic-tech' :
                     topic.id === 'crypto' ? 'bg-topic-crypto' : '';

  return (
    <button
      onClick={() => onSelect(topic)}
      className="card-brutal p-8 text-left group animate-slide-brutal"
    >
      <div className="accent-bar" style={{ background: topic.color }} />

      <div className={`w-16 h-16 border-[3px] border-border flex items-center justify-center mb-6 ${colorClass}`} style={{ background: topic.color }}>
        <Icon className="w-8 h-8 text-primary-fg" />
      </div>

      <h3 className="font-display text-3xl mb-4 leading-tight">
        {topic.name}
      </h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {topic.keywords.slice(0, 2).map((kw) => (
          <span key={kw} className="px-2 py-1 border border-border font-mono text-xs uppercase bg-muted">
            {kw}
          </span>
        ))}
      </div>

      <div className="font-mono text-xs uppercase tracking-wider text-secondary">
        → VIEW FEED
      </div>
    </button>
  );
}

function TopicCardCompact({ topic, onSelect }: { topic: Topic; onSelect: (topic: Topic) => void }) {
  return (
    <button
      onClick={() => onSelect(topic)}
      className="card-brutal p-6 text-left group animate-slide-brutal"
    >
      <div className="accent-bar-vertical" />

      <h4 className="font-display text-xl mb-2 pl-4">
        {topic.name}
      </h4>

      <div className="font-mono text-xs text-secondary uppercase pl-4">
        {topic.country?.toUpperCase()}
      </div>
    </button>
  );
}
