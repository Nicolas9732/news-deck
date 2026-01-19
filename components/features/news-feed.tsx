"use client";

import { useSources } from '@/contexts/source-context';
import { useRssFeed } from '@/hooks/use-rss-feed';
import { useReader } from '@/contexts/reader-context';
import { QuadrantType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { BookOpen } from 'lucide-react';

interface NewsFeedProps {
    quadrant: QuadrantType;
    colorClass: string; // e.g. "text-brand-geo"
}

export function NewsFeed({ quadrant, colorClass }: NewsFeedProps) {
    const { getSourcesByQuadrant } = useSources();
    const { openArticle } = useReader();
    const sources = getSourcesByQuadrant(quadrant);
    const { items, loading, error } = useRssFeed(sources);

    if (loading && items.length === 0) {
        return (
            <div className="flex flex-col gap-2 p-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded-md" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-destructive">Error loading feeds: {error}</div>;
    }

    if (items.length === 0) {
        return <div className="p-4 text-muted-foreground">No active feeds. Add one in settings.</div>;
    }

    return (
        <ul className="flex flex-col h-full overflow-y-auto">
            {items.map((item) => (
                <li key={item.id} className="group flex-none border-b border-white/5 last:border-0">
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            // If modifier keys are pressed, let the browser handle it (open in new tab)
                            if (e.metaKey || e.ctrlKey || e.shiftKey) return;

                            // Otherwise, open the internal reader
                            e.preventDefault();
                            openArticle(item);
                        }}
                        className="w-full text-left flex items-start gap-3 p-2 hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/10 group-hover:pl-4 transition-all duration-300 relative"
                    >
                        {/* Hover Indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Timestamp as Code Line Number style */}
                        <div className="hidden sm:block font-mono text-[10px] text-muted-foreground w-20 pt-0.5 shrink-0 opacity-50">
                            {new Date(item.pubDate).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${colorClass} opacity-90`}>
                                    [{item.source}]
                                </span>
                                <h3 className="font-mono text-xs md:text-sm text-foreground group-hover:text-primary transition-colors leading-tight truncate w-full decoration-primary/50 group-hover:underline underline-offset-4">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Snippet */}
                            {item.snippet && (
                                <p className="font-mono text-[10px] text-muted-foreground/60 w-full truncate pl-2 border-l border-white/10 ml-1">
                                    // {item.snippet}
                                </p>
                            )}
                        </div>

                        <div className="opacity-0 group-hover:opacity-50 transition-opacity">
                            <BookOpen className="w-3 h-3 text-foreground" />
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
}
