import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { NewsItem } from '@/types';
import { ExternalLink, Clock, Hash } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

interface NewsCardProps {
  item: NewsItem;
  compact?: boolean;
}

export function NewsCard({ item, compact }: NewsCardProps) {
  return (
    <Card className="group overflow-hidden border-border/40 bg-card transition-all hover:shadow-sm hover:border-border/80">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/80">
            <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded">
              <Hash size={10} />
              {item.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {formatRelativeTime(item.timestamp)}
            </span>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        </div>
        <CardTitle className={`leading-tight font-semibold tracking-tight ${compact ? 'text-base' : 'text-lg'}`}>
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
          {item.summary}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex items-center justify-between border-0">
        <span className="text-[11px] font-medium text-muted-foreground/70">
          {item.source}
        </span>
        {item.readingTime && (
          <span className="text-[11px] text-muted-foreground/70">
            {item.readingTime} min read
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
