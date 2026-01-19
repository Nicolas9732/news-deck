"use client";

import { useState, useEffect } from 'react';
import { NewsItem, FeedSource } from '@/app/v2/lib/types';
import { matchesKeywords } from '@/app/v2/lib/utils';

export function useFilteredFeed(sources: FeedSource[], keywords: string[], refreshInterval = 60000) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeeds() {
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

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            const xmlItems = xmlDoc.querySelectorAll("item");

            return Array.from(xmlItems).map(item => {
              const title = item.querySelector("title")?.textContent || "No Title";
              const link = item.querySelector("link")?.textContent || "#";
              const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString();
              const description = item.querySelector("description")?.textContent || "";
              const contentEncoded = item.getElementsByTagName("content:encoded")[0]?.textContent;
              const fullContent = contentEncoded || description || "";

              const doc = new DOMParser().parseFromString(description || fullContent, 'text/html');
              const textContent = doc.body.textContent || "";
              const snippet = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');

              return {
                id: link,
                title,
                link,
                pubDate,
                source: source.name,
                snippet,
                content: fullContent,
              } as NewsItem;
            });
          } catch (err) {
            console.warn(`Failed to fetch source ${source.name}`, err);
            return [];
          }
        });

        const results = await Promise.all(promises);
        let allItems = results.flat();

        // Filter by keywords if provided
        if (keywords.length > 0) {
          allItems = allItems.filter(item => matchesKeywords(item, keywords));
        }

        // Sort by date
        allItems.sort((a, b) => {
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        });

        setItems(allItems);
      } catch (err) {
        setError('Failed to load feeds');
      } finally {
        setLoading(false);
      }
    }

    fetchFeeds();
    const interval = setInterval(fetchFeeds, refreshInterval);
    return () => clearInterval(interval);
  }, [sources, keywords, refreshInterval]);

  return { items, loading, error };
}
