"use client";

import { useState } from 'react';
import { Topic } from '@/app/v2/lib/types';
import { useTopic } from '@/app/v2/contexts/topic-context';
import { Search } from 'lucide-react';

export function TopicSelection() {
  const { topics, selectTopic } = useTopic();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const predefinedTopics = filteredTopics.filter(t => t.type === 'predefined');
  const geopoliticsTopics = filteredTopics.filter(t => t.type === 'geopolitics');

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Top Status Bar */}
      <div className="terminal-panel mb-4">
        <div className="panel-header flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-orange">BLOOMBERG</span>
            <span className="text-gray">|</span>
            <span className="text-blue">MONITOR</span>
            <span className="text-gray">|</span>
            <span className="text-cyan">{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray text-[10px]">TERMINAL v2.0</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="terminal-panel mb-4">
          <div className="panel-header">TOPIC SEARCH</div>
          <div className="p-4">
            <div className="flex items-center gap-2 bg-background border border-border p-2">
              <Search className="w-4 h-4 text-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics or keywords..."
                className="flex-1 bg-transparent outline-none text-orange placeholder:text-gray font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Markets Section */}
        <div className="terminal-panel mb-4">
          <div className="panel-header flex items-center justify-between">
            <span>MARKETS</span>
            <span className="text-gray text-[10px]">{predefinedTopics.length} AVAILABLE</span>
          </div>
          <div className="grid grid-cols-3 gap-px bg-border">
            {predefinedTopics.map((topic, i) => (
              <button
                key={topic.id}
                onClick={() => selectTopic(topic)}
                className="data-row text-left p-6 bg-card hover:bg-card-hover group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange font-semibold text-sm uppercase tracking-wider">
                    {topic.name}
                  </span>
                  <span className="text-cyan text-xs">{">"}</span>
                </div>
                <div className="text-gray text-xs mb-3">
                  {topic.keywords.slice(0, 3).join(' · ')}
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-blue">LIVE</span>
                  <span className="text-gray">|</span>
                  <span className="text-gray">{topic.keywords.length} KEYWORDS</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Geopolitics Section */}
        {geopoliticsTopics.length > 0 && (
          <div className="terminal-panel">
            <div className="panel-header flex items-center justify-between">
              <span>GEOPOLITICS</span>
              <span className="text-gray text-[10px]">{geopoliticsTopics.length} REGIONS</span>
            </div>
            <div className="grid grid-cols-4 gap-px bg-border">
              {geopoliticsTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => selectTopic(topic)}
                  className="data-row text-left p-4 bg-card hover:bg-card-hover group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-red font-semibold text-xs uppercase tracking-wider">
                      {topic.name}
                    </span>
                    <span className="text-cyan text-xs">{">"}</span>
                  </div>
                  <div className="text-gray text-[10px]">
                    {topic.keywords.length} SOURCES
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-muted border-t border-border p-2 px-4">
        <div className="flex items-center justify-between text-[10px] text-gray">
          <div className="flex items-center gap-6">
            <span>READY</span>
            <span>|</span>
            <span className="text-cyan">SELECT TOPIC TO BEGIN</span>
          </div>
          <div className="flex items-center gap-4">
            <span>HELP: <span className="text-blue">F1</span></span>
            <span>SEARCH: <span className="text-blue">CTRL+F</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
