"use client";

import { Column } from '@/app/v2/lib/types';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { useFilteredFeed } from '@/app/v2/hooks/use-filtered-feed';
import { formatRelativeTime } from '@/app/v2/lib/utils';
import { Loader2 } from 'lucide-react';

interface NewsFeedColumnProps {
  column: Column;
}

function isBreakingNews(pubDate: string): boolean {
  const articleTime = new Date(pubDate).getTime();
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  return (now - articleTime) < thirtyMinutes;
}

export function NewsFeedColumn({ column }: NewsFeedColumnProps) {
  const { selectArticle } = useLayout();
  const { articles, loading, error } = useFilteredFeed();

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <div className="text-red text-xs">
          ERROR: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {loading && articles.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 animate-spin text-cyan" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {articles.length === 0 ? (
            <div className="p-4 text-center text-gray text-xs">
              NO ARTICLES FOUND
            </div>
          ) : (
            articles.map((item, i) => (
              <div
                key={`${item.link}-${i}`}
                className="data-row cursor-pointer group"
                onClick={() => selectArticle(item)}
              >
                {/* Breaking News Indicator */}
                {isBreakingNews(item.pubDate) && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-red blink" />
                    <span className="text-red text-[10px] font-bold tracking-wider">
                      BREAKING
                    </span>
                  </div>
                )}

                {/* Source & Time */}
                <div className="flex items-center gap-2 mb-1 text-[10px]">
                  <span className="text-cyan font-semibold">
                    {item.source?.toUpperCase() || 'UNKNOWN'}
                  </span>
                  <span className="text-gray">|</span>
                  <span className="text-gray">
                    {formatRelativeTime(item.pubDate)}
                  </span>
                </div>

                {/* Headline */}
                <div className="text-orange text-sm leading-tight mb-2 group-hover:text-yellow">
                  {item.title}
                </div>

                {/* Snippet */}
                {item.snippet && (
                  <div className="text-gray text-xs leading-relaxed line-clamp-2">
                    {item.snippet}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
