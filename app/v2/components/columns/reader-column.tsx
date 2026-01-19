"use client";

import { useState, useEffect } from 'react';
import { Column } from '@/app/v2/lib/types';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { ExternalLink, X, ArrowUp } from 'lucide-react';
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
      <div className="h-full flex items-center justify-center p-12 text-center">
        <div>
          <div className="font-display text-4xl mb-4">SELECT</div>
          <div className="font-display text-4xl mb-6">ARTICLE</div>
          <p className="font-mono text-xs uppercase text-secondary">
            Click any article to read
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="reader-content" className="h-full overflow-y-auto" onScroll={handleScroll}>
      <article className="p-8 animate-slide-up-brutal">
        {/* Header */}
        <header className="mb-8 pb-8 border-b-[3px] border-border">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-xs uppercase tracking-wider text-secondary">
                  {selectedArticle.source}
                </span>
                <span className="text-secondary">•</span>
                <time className="font-mono text-xs uppercase tracking-wider text-secondary">
                  {formatRelativeTime(selectedArticle.pubDate)}
                </time>
              </div>
              <h1 className="font-display text-4xl leading-tight mb-6">
                {selectedArticle.title}
              </h1>
            </div>
            <button
              onClick={() => selectArticle(null)}
              className="flex-shrink-0 w-12 h-12 border-[3px] border-border hover:bg-muted flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <a
            href={selectedArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutal inline-flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            OPEN ORIGINAL
          </a>
        </header>

        {/* Content */}
        <div className="prose-brutal max-w-none">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 border-[3px] border-border bg-muted animate-pulse-brutal" />
              ))}
            </div>
          ) : fullContent ? (
            <div
              className="font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: fullContent }}
            />
          ) : selectedArticle.snippet ? (
            <p className="font-mono text-sm text-muted-fg">{selectedArticle.snippet}</p>
          ) : (
            <p className="font-mono text-sm italic text-muted-fg">
              CONTENT NOT AVAILABLE
            </p>
          )}
        </div>
      </article>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-16 h-16 border-[3px] border-border bg-primary hover:bg-primary/90 flex items-center justify-center shadow-brutal animate-slide-up-brutal"
        >
          <ArrowUp className="w-6 h-6 text-primary-fg" />
        </button>
      )}
    </div>
  );
}
