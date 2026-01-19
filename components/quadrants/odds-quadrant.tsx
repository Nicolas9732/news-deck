import { NewsFeed } from "@/components/features/news-feed";

export function OddsQuadrant() {
    return (
        <div className="h-full">
            <NewsFeed quadrant="odds" colorClass="text-brand-odds" />
        </div>
    );
}
