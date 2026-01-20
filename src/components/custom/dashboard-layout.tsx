'use client';

import React from 'react';
import { useDashboard } from '@/context/dashboard-context';
import { NewsCard } from './news-card';
import { NewsItem } from '@/types';

interface DashboardLayoutProps {
  news: NewsItem[];
}

export function DashboardLayout({ news }: DashboardLayoutProps) {
  const { layoutMode, isCompact, visibleCategories } = useDashboard();

  const filteredNews = news.filter((item) => visibleCategories.includes(item.category));

  if (filteredNews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p>No news items found for the selected categories.</p>
      </div>
    );
  }

  return (
    <div
      className={
        layoutMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6'
          : 'flex flex-col gap-4 max-w-3xl mx-auto px-4'
      }
    >
      {filteredNews.map((item) => (
        <NewsCard key={item.id} item={item} compact={isCompact} />
      ))}
    </div>
  );
}
