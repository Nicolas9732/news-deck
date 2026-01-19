import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NewsItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Keyword matching for news filtering
export function matchesKeywords(item: NewsItem, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const searchText = `${item.title} ${item.snippet || ''}`.toLowerCase();
  return keywords.some(keyword =>
    searchText.includes(keyword.toLowerCase())
  );
}

// Highlight keywords in text
export function highlightKeywords(text: string, keywords: string[]): string {
  if (keywords.length === 0) return text;
  let result = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, '<mark class="bg-primary/20 text-primary">$1</mark>');
  });
  return result;
}

// Check if article is breaking news (< 30 minutes old)
export function isBreakingNews(pubDate: string): boolean {
  const articleTime = new Date(pubDate).getTime();
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  return (now - articleTime) < thirtyMinutes;
}

// Format relative time
export function formatRelativeTime(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// localStorage helpers
export function saveToLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

export function removeFromLocal(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('Failed to remove from localStorage:', e);
  }
}
