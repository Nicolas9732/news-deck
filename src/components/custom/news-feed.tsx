'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDashboard } from '@/context/dashboard-context';
import { NewsItem } from '@/types';
import { NewsCard } from '@/components/custom/news-card';
import { SearchX } from 'lucide-react';

export function NewsFeed() {
  const { activeTopic, searchQuery } = useDashboard();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news?topic=${activeTopic}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchNews();
  }, [activeTopic]);

  // Filter news by search query (client-side for instant feedback)
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;
    
    const query = searchQuery.toLowerCase();
    return news.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [news, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-[400px] w-full rounded-xl bg-muted/20 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="h-[300px] w-full rounded-xl bg-muted/20 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const featuredNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const standardNews = filteredNews.length > 0 ? filteredNews.slice(1) : [];

  // Show search results message when filtering
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Search results indicator */}
      {isSearching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Found <strong className="text-foreground">{filteredNews.length}</strong> results for &quot;{searchQuery}&quot;
          </span>
        </div>
      )}

      {featuredNews && (
        <section>
          <NewsCard item={featuredNews} variant="featured" />
        </section>
      )}
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standardNews.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </section>

      {filteredNews.length === 0 && (
         <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
            <SearchX size={32} className="text-muted-foreground/50" />
            {isSearching ? (
              <span>No news matching &quot;{searchQuery}&quot;</span>
            ) : (
              <span>No news found for this category.</span>
            )}
         </div>
      )}
    </div>
  );
}
