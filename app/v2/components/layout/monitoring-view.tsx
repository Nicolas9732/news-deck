"use client";

import { useState } from 'react';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { useTheme } from '@/app/v2/contexts/theme-context';
import { ArrowLeft, Plus, Settings as SettingsIcon } from 'lucide-react';
import { ColumnContainer } from './column-container';

export function MonitoringView() {
  const { selectedTopic, selectTopic } = useTopic();
  const { resolvedTheme, setTheme } = useTheme();
  const { layout, addColumn } = useLayout();
  const [showSettings, setShowSettings] = useState(false);

  if (!selectedTopic) return null;

  const handleAddColumn = () => {
    // Add a news column by default
    addColumn({
      type: 'news',
      width: 4,
      config: {
        title: 'News Feed',
        refreshInterval: 60000,
        showMetadata: true,
      },
      visible: true,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-none border-b-[3px] border-border bg-card relative z-20">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => selectTopic(null)}
              className="flex items-center gap-3 px-4 py-2 border-[3px] border-border font-mono text-xs uppercase tracking-wider hover:bg-muted font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK
            </button>

            <div className="h-8 w-[3px] bg-border" />

            <div>
              <h1 className="font-display text-2xl leading-none mb-1">
                {selectedTopic.name}
              </h1>
              <p className="font-mono text-xs text-secondary uppercase tracking-wider">
                {selectedTopic.keywords.slice(0, 2).join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddColumn}
              className="btn-brutal"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              ADD COLUMN
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="btn-brutal"
            >
              <SettingsIcon className="w-4 h-4 inline mr-2" />
              SETTINGS
            </button>

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="btn-brutal"
            >
              {resolvedTheme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>

        {/* Accent bar */}
        <div className="h-[6px] bg-primary" />
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="flex-none border-b-[3px] border-border bg-muted p-6 animate-slide-up-brutal">
          <div className="max-w-4xl">
            <h3 className="font-display text-xl mb-4">Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="card-brutal p-4">
                <p className="font-mono text-xs uppercase mb-2 text-secondary">Refresh Interval</p>
                <p className="font-mono text-sm">60 seconds</p>
              </div>
              <div className="card-brutal p-4">
                <p className="font-mono text-xs uppercase mb-2 text-secondary">Active Columns</p>
                <p className="font-mono text-sm">{layout.columns.filter(c => c.visible).length}</p>
              </div>
              <div className="card-brutal p-4">
                <p className="font-mono text-xs uppercase mb-2 text-secondary">Theme</p>
                <p className="font-mono text-sm">{resolvedTheme.toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay pointer-events-none z-0" />
        <ColumnContainer />
      </div>

      {/* Status bar */}
      <footer className="flex-none border-t-[3px] border-border bg-card">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-secondary">
            <span>{layout.columns.filter(c => c.visible).length} COLUMNS</span>
            <span>•</span>
            <span>LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary animate-pulse-brutal" />
            <span className="font-mono text-xs uppercase tracking-wider text-secondary">
              MONITORING
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
