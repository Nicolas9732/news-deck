import { NewsFeed } from "@/components/features/news-feed";

export function TechQuadrant() {
    return (
        <div className="h-full">
            <NewsFeed quadrant="tech" colorClass="text-brand-tech" />
        </div>
    );
}
