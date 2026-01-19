"use client";

import { useState } from 'react';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { useTheme } from '@/app/v2/contexts/theme-context';
import { ArrowLeft, Menu, Moon, Sun, Settings, Plus, LayoutGrid } from 'lucide-react';
import { cn } from '@/app/v2/lib/utils';
import { ColumnContainer } from './column-container';

export function MonitoringView() {
  const { selectedTopic, selectTopic } = useTopic();
  const { resolvedTheme, setTheme } = useTheme();
  const { layout } = useLayout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!selectedTopic) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-none border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => selectTopic(null)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Topics</span>
            </button>

            <div className="h-6 w-px bg-border" />

            <div>
              <h1 className="text-lg font-serif font-semibold text-foreground">
                {selectedTopic.name}
              </h1>
              <p className="text-xs text-muted-fg hidden sm:block">
                {selectedTopic.keywords.slice(0, 3).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Add column button */}
            <button
              className="px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium flex items-center gap-2"
              title="Add column"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Column</span>
            </button>

            {/* Layout button */}
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Layout options"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {/* Settings button */}
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <ColumnContainer />
      </div>

      {/* Status bar */}
      <footer className="flex-none border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-2 flex items-center justify-between text-xs text-muted-fg">
          <div className="flex items-center gap-4">
            <span>{layout.columns.filter(c => c.visible).length} columns active</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Last updated: just now</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
