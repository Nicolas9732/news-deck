import { NewsFeed } from "@/components/features/news-feed";

export function GeoQuadrant() {
    return (
        <div className="h-full">
            <NewsFeed quadrant="geo" colorClass="text-brand-geo" />
        </div>
    );
}
