"use client";

import { useState, useEffect } from 'react';
import { FeedSource, NewsItem } from '@/lib/types';

export function useRssFeed(sources: FeedSource[]) {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAllFeeds() {
            if (sources.length === 0) {
                setItems([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const promises = sources.map(async (source) => {
                    try {
                        const encodedUrl = encodeURIComponent(source.url);
                        const res = await fetch(`/api/proxy?url=${encodedUrl}`);
                        if (!res.ok) throw new Error('Failed to fetch');
                        const xmlText = await res.text();

                        // Simple XML Parsing Logic (Browser Native)
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
                        const xmlItems = xmlDoc.querySelectorAll("item");

                        return Array.from(xmlItems).map(item => {
                            const title = item.querySelector("title")?.textContent || "No Title";
                            const link = item.querySelector("link")?.textContent || "#";
                            const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();

                            const description = item.querySelector("description")?.textContent || "";
                            // Check for content:encoded, which often contains full HTML content
                            const contentEncoded = item.getElementsByTagName("content:encoded")[0]?.textContent;
                            const fullContent = contentEncoded || description || "";

                            // Basic snippet extraction (strip HTML)
                            // Use description or fullContent for snippet generation
                            const doc = new DOMParser().parseFromString(description || fullContent, 'text/html');
                            const textContent = doc.body.textContent || "";
                            const snippet = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');

                            return {
                                id: link, // simple unique key, assuming link is unique enough
                                title,
                                link,
                                pubDate,
                                source: source.name,
                                snippet,
                                content: fullContent, // Store full HTML content
                                // Try to find an image in standard RSS extensions if description doesn't have it (todo)
                            } as NewsItem; // Cast to NewsItem
                        });
                    } catch (err) {
                        console.warn(`Failed to fetch source ${source.name}`, err);
                        return [];
                    }
                });

                const results = await Promise.all(promises);
                const allItems = results.flat().sort((a, b) => {
                    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
                });

                setItems(allItems);
            } catch (err) {
                setError('Failed to load feeds');
            } finally {
                setLoading(false);
            }
        }

        fetchAllFeeds();

        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchAllFeeds, 60000);
        return () => clearInterval(interval);

    }, [sources]); // Re-run if sources list changes

    return { items, loading, error };
}
