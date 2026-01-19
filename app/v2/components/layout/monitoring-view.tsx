"use client";

import { useState } from 'react';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { useLayout } from '@/app/v2/contexts/layout-context';
import { ColumnContainer } from './column-container';
import { ChevronLeft, Plus, Settings as SettingsIcon, Menu } from 'lucide-react';

export function MonitoringView() {
  const { selectedTopic, selectTopic } = useTopic();
  const { columns, addColumn } = useLayout();
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  if (!selectedTopic) return null;

  const handleAddColumn = () => {
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
      {/* Top Bar - Bloomberg Style */}
      <div className="terminal-panel flex-shrink-0">
        <div className="panel-header flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => selectTopic(null)}
              className="flex items-center gap-2 hover:text-cyan"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>MENU</span>
            </button>
            <span className="text-gray">|</span>
            <span className="text-orange font-bold">{selectedTopic.name.toUpperCase()}</span>
            <span className="text-gray">|</span>
            <span className="text-cyan text-[10px]">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleAddColumn} className="btn-terminal flex items-center gap-2">
              <Plus className="w-3 h-3" />
              <span>ADD</span>
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="btn-terminal flex items-center gap-2">
              <SettingsIcon className="w-3 h-3" />
              <span>SETTINGS</span>
            </button>
            <button onClick={() => setShowSidebar(!showSidebar)} className="btn-terminal">
              <Menu className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 flex-shrink-0 terminal-panel m-2 ml-2 overflow-y-auto">
            <div className="panel-header">PANELS</div>
            <div className="p-3 space-y-2">
              {columns.map((col, i) => (
                <div
                  key={col.id}
                  className="data-row text-xs flex items-center justify-between"
                >
                  <span className="text-orange">{col.config.title}</span>
                  <span className="text-cyan">[{i + 1}]</span>
                </div>
              ))}
            </div>

            <div className="panel-header mt-4">KEYWORDS</div>
            <div className="p-3 space-y-1">
              {selectedTopic.keywords.slice(0, 8).map((keyword, i) => (
                <div key={i} className="text-[10px] text-gray hover:text-orange cursor-pointer">
                  • {keyword.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Column Container */}
        <div className="flex-1 p-2 overflow-hidden">
          <ColumnContainer />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="terminal-panel w-full max-w-2xl m-4">
            <div className="panel-header flex items-center justify-between">
              <span>SETTINGS</span>
              <button onClick={() => setShowSettings(false)} className="text-red hover:text-white">
                [X] CLOSE
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="text-orange text-xs font-semibold mb-2">REFRESH INTERVAL</div>
                <div className="text-gray text-[11px]">
                  News feeds update every 60 seconds. Polymarket data updates every 15 seconds.
                </div>
              </div>
              <div>
                <div className="text-orange text-xs font-semibold mb-2">DISPLAY OPTIONS</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] text-gray cursor-pointer">
                    <input type="checkbox" className="accent-blue" defaultChecked />
                    <span>Show source metadata</span>
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-gray cursor-pointer">
                    <input type="checkbox" className="accent-blue" defaultChecked />
                    <span>Highlight keywords</span>
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-gray cursor-pointer">
                    <input type="checkbox" className="accent-blue" defaultChecked />
                    <span>Breaking news alerts</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="text-gray text-[10px]">
                  TERMINAL VERSION 2.0 | COLUMNS ACTIVE: {columns.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="flex-shrink-0 bg-muted border-t border-border p-2 px-4">
        <div className="flex items-center justify-between text-[10px] text-gray">
          <div className="flex items-center gap-6">
            <span className="text-cyan">LIVE</span>
            <span>|</span>
            <span>{columns.length} PANELS ACTIVE</span>
            <span>|</span>
            <span className="text-orange">{selectedTopic.keywords.length} KEYWORDS</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ADD: <span className="text-blue">CTRL+N</span></span>
            <span>HELP: <span className="text-blue">F1</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
