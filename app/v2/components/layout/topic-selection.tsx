"use client";

import { useState } from 'react';
import { Topic } from '@/app/v2/lib/types';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { TrendingUp, Cpu, Bitcoin, Globe, Search, Plus, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/v2/contexts/theme-context';
import { cn } from '@/app/v2/lib/utils';

const TOPIC_ICONS = {
  TrendingUp,
  Cpu,
  Bitcoin,
  Globe,
};

export function TopicSelection() {
  const { topics, selectTopic } = useTopic();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'predefined' | 'geopolitics' | 'custom'>('all');

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || topic.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const predefinedTopics = filteredTopics.filter(t => t.type === 'predefined');
  const geopoliticsTopics = filteredTopics.filter(t => t.type === 'geopolitics');
  const customTopics = filteredTopics.filter(t => t.type === 'custom');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-1">
              Intelligence Briefing
            </h1>
            <p className="text-sm text-muted-fg">
              Select a topic to monitor
            </p>
          </div>

          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Search and filters */}
        <div className="mb-12 space-y-6 animate-slide-up">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-fg" />
            <input
              type="text"
              placeholder="Search topics or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-fg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Topics' },
              { value: 'predefined', label: 'Markets & Tech' },
              { value: 'geopolitics', label: 'Geopolitics' },
              { value: 'custom', label: 'Custom' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  selectedCategory === cat.value
                    ? "bg-primary text-primary-fg shadow-md"
                    : "bg-card text-foreground hover:bg-muted border border-border"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topics grid */}
        <div className="space-y-12">
          {predefinedTopics.length > 0 && (
            <section className="animate-slide-up stagger-1">
              <h2 className="text-xl font-serif font-semibold mb-6 text-foreground">
                Markets & Technology
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predefinedTopics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onSelect={selectTopic}
                    delay={index * 50}
                  />
                ))}
              </div>
            </section>
          )}

          {geopoliticsTopics.length > 0 && (
            <section className="animate-slide-up stagger-2">
              <h2 className="text-xl font-serif font-semibold mb-6 text-foreground">
                Geopolitical Monitoring
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {geopoliticsTopics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onSelect={selectTopic}
                    delay={index * 50}
                  />
                ))}
              </div>
            </section>
          )}

          {customTopics.length > 0 && (
            <section className="animate-slide-up stagger-3">
              <h2 className="text-xl font-serif font-semibold mb-6 text-foreground">
                Custom Topics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customTopics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onSelect={selectTopic}
                    delay={index * 50}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Create custom topic card */}
          <section className="animate-slide-up stagger-4">
            <button
              className="w-full md:w-auto px-8 py-6 rounded-xl border-2 border-dashed border-border hover:border-primary bg-card hover:bg-muted transition-all group"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Create Custom Topic</span>
              </div>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

function TopicCard({ topic, onSelect, delay }: { topic: Topic; onSelect: (topic: Topic) => void; delay: number }) {
  const Icon = topic.icon ? TOPIC_ICONS[topic.icon as keyof typeof TOPIC_ICONS] : Globe;

  const colorClass = topic.id === 'finance' ? 'topic-finance' :
                     topic.id === 'tech' ? 'topic-tech' :
                     topic.id === 'crypto' ? 'topic-crypto' :
                     topic.type === 'geopolitics' ? 'topic-geo' : '';

  return (
    <button
      onClick={() => onSelect(topic)}
      className="group relative p-6 rounded-xl border border-border bg-card hover:bg-card-hover transition-all hover:shadow-lg hover:-translate-y-1 text-left overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Accent line */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", colorClass)} style={{ background: topic.color }} />

      {/* Icon */}
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110", colorClass)} style={{ background: topic.color ? `${topic.color}15` : undefined }}>
        <Icon className="w-6 h-6" style={{ color: topic.color }} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-serif font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
        {topic.name}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {topic.keywords.slice(0, 3).map((keyword) => (
          <span
            key={keyword}
            className="text-xs px-2 py-0.5 rounded bg-muted text-muted-fg"
          >
            {keyword}
          </span>
        ))}
        {topic.keywords.length > 3 && (
          <span className="text-xs px-2 py-0.5 text-muted-fg">
            +{topic.keywords.length - 3}
          </span>
        )}
      </div>

      {topic.country && (
        <p className="text-xs text-muted-fg capitalize">
          {topic.country.replace('-', '/')}
        </p>
      )}
    </button>
  );
}
