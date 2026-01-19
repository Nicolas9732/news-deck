"use client";

import { Column } from '@/app/v2/lib/types';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { useFilteredFeed } from '@/app/v2/hooks/use-filtered-feed';
import { RSS_SOURCES } from '@/app/v2/lib/sources';
import { formatRelativeTime, isBreakingNews } from '@/app/v2/lib/utils';
import { ExternalLink } from 'lucide-react';

interface NewsFeedColumnProps {
  column: Column;
}

export function NewsFeedColumn({ column }: NewsFeedColumnProps) {
  const { selectedTopic } = useTopic();
  const { selectArticle } = useLayout();

  if (!selectedTopic) return null;

  const sourceKey = selectedTopic.country || selectedTopic.id;
  const sources = RSS_SOURCES[sourceKey] || [];
  const { items, loading, error } = useFilteredFeed(
    sources,
    selectedTopic.keywords,
    column.config.refreshInterval
  );

  if (loading && items.length === 0) {
    return (
      <div className="h-full flex flex-col gap-4 p-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 border-[3px] border-border bg-muted animate-pulse-brutal" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <div className="card-brutal p-8">
          <div className="font-display text-3xl mb-4 text-destructive">ERROR</div>
          <p className="font-mono text-sm uppercase">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="font-mono text-sm uppercase text-secondary">
          NO ARTICLES FOUND
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="card-brutal p-6 cursor-pointer group animate-slide-brutal"
            style={{ animationDelay: `${Math.min(index * 30, 200)}ms` }}
            onClick={() => selectArticle(item)}
          >
            {isBreakingNews(item.pubDate) && (
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-destructive animate-pulse-brutal" />
                <span className="font-mono text-xs font-bold uppercase text-destructive">BREAKING</span>
              </div>
            )}

            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-secondary">
                    {formatRelativeTime(item.pubDate)}
                  </span>
                  <span className="text-secondary">•</span>
                  <span className="font-mono text-xs uppercase tracking-wider text-secondary">
                    {item.source}
                  </span>
                </div>

                <h3 className="font-display text-xl leading-tight mb-2 group-hover:text-primary">
                  {item.title}
                </h3>

                {item.snippet && (
                  <p className="font-mono text-sm text-muted-fg line-clamp-2">
                    {item.snippet}
                  </p>
                )}
              </div>

              <ExternalLink className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 flex-shrink-0" />
            </div>

            <div className="h-[3px] w-16 bg-primary opacity-0 group-hover:opacity-100" />
          </article>
        ))}
      </div>
    </div>
  );
}
