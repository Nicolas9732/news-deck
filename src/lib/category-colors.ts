import { Category } from '@/types';

export interface CategoryColorConfig {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

// Category color mapping - vibrant colors to break the monochromatic dark theme
export const categoryColors: Record<string, CategoryColorConfig> = {
  Tech: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-500',
    border: 'border-l-blue-500',
    icon: 'text-blue-500',
  },
  Finance: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-500',
    border: 'border-l-emerald-500',
    icon: 'text-emerald-500',
  },
  Crypto: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-500',
    border: 'border-l-amber-500',
    icon: 'text-amber-500',
  },
  Geopolitics: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-500',
    border: 'border-l-rose-500',
    icon: 'text-rose-500',
  },
  Climate: {
    bg: 'bg-teal-500/15',
    text: 'text-teal-500',
    border: 'border-l-teal-500',
    icon: 'text-teal-500',
  },
  AI: {
    bg: 'bg-violet-500/15',
    text: 'text-violet-500',
    border: 'border-l-violet-500',
    icon: 'text-violet-500',
  },
  Macro: {
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    border: 'border-l-slate-500',
    icon: 'text-slate-400',
  },
};

// Fallback for unknown categories
const defaultColor: CategoryColorConfig = {
  bg: 'bg-primary/10',
  text: 'text-primary',
  border: 'border-l-primary',
  icon: 'text-primary',
};

export function getCategoryColor(category: string | Category): CategoryColorConfig {
  return categoryColors[category] || defaultColor;
}

// Get all category names for iteration
export function getCategoryNames(): string[] {
  return Object.keys(categoryColors);
}
