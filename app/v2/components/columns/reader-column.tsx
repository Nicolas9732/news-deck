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

    // If we have content already, use it
    if (selectedArticle.content) {
      setFullContent(selectedArticle.content);
      return;
    }

    // Otherwise fetch full content
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

  // Handle scroll to show/hide scroll-to-top button
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
      <div className="h-full flex items-center justify-center px-6 text-center">
        <div className="max-w-sm animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-sm font-serif font-semibold mb-2">Select an article</h3>
          <p className="text-xs text-muted-fg">
            Click on any article from the news feed to read it here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="reader-content" className="h-full overflow-y-auto" onScroll={handleScroll}>
      <article className="p-6 max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-fg mb-3">
                <span className="font-medium">{selectedArticle.source}</span>
                <span>•</span>
                <time>{formatRelativeTime(selectedArticle.pubDate)}</time>
              </div>
              <h1 className="text-2xl font-serif font-bold leading-tight text-foreground mb-4">
                {selectedArticle.title}
              </h1>
            </div>
            <button
              onClick={() => selectArticle(null)}
              className="p-2 hover:bg-muted rounded-lg transition-colors flex-none"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={selectedArticle.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-fg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Original</span>
            </a>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-muted rounded w-full" />
              ))}
            </div>
          ) : fullContent ? (
            <div dangerouslySetInnerHTML={{ __html: fullContent }} />
          ) : selectedArticle.snippet ? (
            <p className="text-muted-fg">{selectedArticle.snippet}</p>
          ) : (
            <p className="text-muted-fg italic">
              Content not available. Click "Open Original" to read the full article.
            </p>
          )}
        </div>
      </article>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-fg shadow-lg hover:bg-primary/90 transition-all animate-slide-up"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
