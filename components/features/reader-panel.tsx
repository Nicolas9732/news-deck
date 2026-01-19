"use client";

import { useReader } from '@/contexts/reader-context';
import { cn } from '@/lib/utils';
import { X, ExternalLink, Calendar, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ReaderPanel() {
    const { isOpen, activeArticle, closeReader } = useReader();

    // State for local content handling
    const [fetchedContent, setFetchedContent] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    // Reset fetched content when article changes
    useEffect(() => {
        if (!activeArticle) {
            setFetchedContent(null);
            setIsFetching(false);
            return;
        }

        // Check if we need to fetch content
        // Criteria: No content OR content is very short (likely just a snippet)
        const hasFullContent = activeArticle.content && activeArticle.content.length > 500;

        if (!hasFullContent) {
            setIsFetching(true);
            fetch(`/api/read?url=${encodeURIComponent(activeArticle.link)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.content) {
                        setFetchedContent(data.content);
                    }
                })
                .catch(err => console.error("Failed to fetch full access", err))
                .finally(() => setIsFetching(false));
        } else {
            setFetchedContent(activeArticle.content || null);
        }
    }, [activeArticle]);

    // Derived content to display
    const displayContent = fetchedContent || activeArticle?.content || activeArticle?.snippet || "";

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={closeReader}
            />

            {/* Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-card border-l border-border z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {activeArticle && (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-border flex justify-between items-start bg-accent/5">
                            <div className="pr-8">
                                <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2 text-primary">{activeArticle.title}</h2>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1 font-mono"><User className="w-3 h-3" /> {activeArticle.source}</span>
                                    <span className="flex items-center gap-1 font-mono"><Calendar className="w-3 h-3" /> {new Date(activeArticle.pubDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <a
                                    href={activeArticle.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                    title="Open Original"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                                <button
                                    onClick={closeReader}
                                    className="p-2 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Content Scroller */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <article className="prose prose-invert prose-sm md:prose-base max-w-none">
                                {isFetching ? (
                                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground animate-pulse">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                                        <p>DECODING_TRANSMISSION...</p>
                                    </div>
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: displayContent }} />
                                )}
                            </article>

                            {!isFetching && !fetchedContent && !activeArticle.content && (
                                <div className="mt-8 p-4 border border-dashed border-border rounded text-center text-muted-foreground text-xs font-mono">
                                    <p>// END OF TRANSMISSION (Snippet Only)</p>
                                    <a href={activeArticle.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block">{">>"} ACCESS_SOURCE_TERMINAL</a>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
