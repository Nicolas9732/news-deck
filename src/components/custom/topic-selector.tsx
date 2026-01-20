'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface TopicSelectorProps {
  className?: string;
}

export function TopicSelector({ className }: TopicSelectorProps) {
  const [activeTab, setActiveTab] = React.useState('For You');

  const mainTabs = ['For You', 'Top'];
  const topics = ['Finance', 'Tech', 'Geopolitics'];

  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto no-scrollbar py-1", className)}>
      {mainTabs.map((tab) => (
        <Button
          key={tab}
          variant={activeTab === tab ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab(tab)}
          className={cn(
            "rounded-full px-4 text-sm font-medium transition-all shrink-0",
            activeTab === tab 
              ? "bg-muted text-foreground hover:bg-muted/80" 
              : "text-muted-foreground hover:text-foreground hover:bg-transparent"
          )}
        >
          {tab}
        </Button>
      ))}

      <div className="h-4 w-px bg-border/50 mx-1 shrink-0" />

      {topics.map((topic) => (
        <Button
          key={topic}
          variant={activeTab === topic ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab(topic)}
          className={cn(
            "rounded-full px-4 text-sm font-medium transition-all shrink-0",
            activeTab === topic
              ? "bg-muted text-foreground hover:bg-muted/80" 
              : "text-muted-foreground hover:text-foreground hover:bg-transparent"
          )}
        >
          {topic}
        </Button>
      ))}
      
      <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8 text-muted-foreground hover:text-foreground shrink-0"
        >
          <Plus size={16} />
      </Button>
    </div>
  );
}
