"use client";

import { useState, useEffect } from 'react';
import { Column } from '@/app/v2/lib/types';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { ExternalLink, X, ChevronUp } from 'lucide-react';
import { formatRelativeTime } from '@/app/v2/lib/utils';

interface ReaderColumnProps {
  column: Column;
}

export function ReaderColumn({ column }: ReaderColumnProps) {
  const { selectedArticle, selectArticle } = useLayout();
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!selectedArticle) {
      setFullContent(null);
      return;
    }

    if (selectedArticle.content) {
      setFullContent(selectedArticle.content);
      return;
    }

    async function fetchContent() {
      if (!selectedArticle) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/read?url=${encodeURIComponent(selectedArticle.link)}`);
        const data = await res.json();
        if (data.content) {
          setFullContent(data.content);
        }
      } catch (err) {
        console.error('Failed to fetch article content', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [selectedArticle]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 300);
  };

  const scrollToTop = () => {
    const container = document.getElementById('reader-content');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!selectedArticle) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <div>
          <div className="text-orange text-2xl mb-2">NO ARTICLE SELECTED</div>
          <div className="text-gray text-xs uppercase">
            Click any article to read
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="reader-content" className="h-full overflow-y-auto" onScroll={handleScroll}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 text-[10px]">
                <span className="text-cyan font-semibold uppercase tracking-wider">
                  {selectedArticle.source}
                </span>
                <span className="text-gray">|</span>
                <span className="text-gray uppercase tracking-wider">
                  {formatRelativeTime(selectedArticle.pubDate)}
                </span>
              </div>
              <h1 className="text-orange text-xl leading-tight font-semibold">
                {selectedArticle.title}
              </h1>
            </div>
            <button
              onClick={() => selectArticle(null)}
              className="flex-shrink-0 w-8 h-8 border border-border hover:border-red hover:text-red flex items-center justify-center text-xs"
            >
              [X]
            </button>
          </div>

          <a
            href={selectedArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-terminal inline-flex items-center gap-2"
          >
            <ExternalLink className="w-3 h-3" />
            <span>OPEN ORIGINAL</span>
          </a>
        </div>

        {/* Content */}
        <div className="text-sm leading-relaxed">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-3 bg-muted animate-pulse" />
              ))}
            </div>
          ) : fullContent ? (
            <div
              className="text-gray [&>p]:mb-4 [&>h2]:text-orange [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-3 [&>h2]:mt-6 [&>h3]:text-cyan [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-4"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            />
          ) : selectedArticle.snippet ? (
            <p className="text-gray text-sm">{selectedArticle.snippet}</p>
          ) : (
            <p className="text-red text-sm italic">
              CONTENT NOT AVAILABLE
            </p>
          )}
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 w-10 h-10 border border-orange bg-muted hover:bg-card-hover flex items-center justify-center"
        >
          <ChevronUp className="w-4 h-4 text-orange" />
        </button>
      )}
    </div>
  );
}
