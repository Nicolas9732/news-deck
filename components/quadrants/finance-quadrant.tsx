import { NewsFeed } from "@/components/features/news-feed";

export function FinanceQuadrant() {
    return (
        <div className="h-full">
            {/* TODO: Add Ticker Widget Here */}
            <h3 className="px-3 py-2 text-xs font-mono text-muted-foreground border-b border-border/50">Market News</h3>
            <NewsFeed quadrant="finance" colorClass="text-brand-fin" />
        </div>
    );
}
