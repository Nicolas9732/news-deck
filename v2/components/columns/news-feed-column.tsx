"use client";

import { Column } from '@/v2/lib/types';
import { useTopic } from '@/v2/contexts/topic-context';
import { useLayout } from '@/v2/contexts/layout-context';
import { useFilteredFeed } from '@/v2/hooks/use-filtered-feed';
import { RSS_SOURCES } from '@/v2/lib/sources';
import { formatRelativeTime, isBreakingNews, cn } from '@/v2/lib/utils';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsFeedColumnProps {
  column: Column;
}

export function NewsFeedColumn({ column }: NewsFeedColumnProps) {
  const { selectedTopic } = useTopic();
  const { selectArticle } = useLayout();

  if (!selectedTopic) return null;

  // Get sources for this topic
  const sourceKey = selectedTopic.country || selectedTopic.id;
  const sources = RSS_SOURCES[sourceKey] || [];

  const { items, loading, error } = useFilteredFeed(
    sources,
    selectedTopic.keywords,
    column.config.refreshInterval
  );

  if (loading && items.length === 0) {
    return (
      <div className="h-full flex flex-col gap-3 p-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center px-4 text-center">
        <div>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-destructive font-medium mb-1">Failed to load feeds</p>
          <p className="text-xs text-muted-fg">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4 text-center">
        <div>
          <Newspaper className="w-12 h-12 text-muted-fg mx-auto mb-3 opacity-50" />
          <p className="text-sm text-muted-fg">No articles found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y divide-border">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={cn(
              "group p-4 hover:bg-muted/50 transition-colors cursor-pointer",
              "animate-slide-up"
            )}
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            onClick={() => selectArticle(item)}
          >
            {/* Time and source */}
            <div className="flex items-center gap-2 mb-2">
              <time className="text-xs text-muted-fg font-medium">
                {formatRelativeTime(item.pubDate)}
              </time>
              <span className="text-xs text-muted-fg">•</span>
              <span className="text-xs text-muted-fg">{item.source}</span>
              {isBreakingNews(item.pubDate) && (
                <>
                  <span className="text-xs text-muted-fg">•</span>
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wide">
                    Breaking
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className={cn(
              "font-serif text-sm font-semibold leading-snug text-foreground mb-2",
              "group-hover:text-primary transition-colors line-clamp-3",
              isBreakingNews(item.pubDate) && "breaking-indicator"
            )}>
              {item.title}
            </h3>

            {/* Snippet */}
            {item.snippet && (
              <p className="text-xs text-muted-fg line-clamp-2 leading-relaxed">
                {item.snippet}
              </p>
            )}

            {/* External link icon on hover */}
            <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary">Read article</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
