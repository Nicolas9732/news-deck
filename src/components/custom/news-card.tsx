'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { NewsItem } from '@/types';
import { Clock, Hash, Heart, MoreHorizontal } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'standard' | 'featured';
  compact?: boolean; // Kept for backward compatibility, maps to standard
}

export function NewsCard({ item, variant = 'standard' }: NewsCardProps) {
  // Map compact prop to standard variant logic if needed, but variant takes precedence
  const isFeatured = variant === 'featured';

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className={`group relative flex flex-col h-full overflow-hidden border-border/40 bg-card transition-all hover:shadow-md hover:border-border/80 ${isFeatured ? 'md:flex-row md:items-stretch' : ''}`}>
        
        {/* Image for Featured Variant */}
        {isFeatured && item.imageUrl && (
          <div className="w-full md:w-1/3 bg-muted relative overflow-hidden order-first md:order-last">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          </div>
        )}

        <div className={`flex flex-col flex-1 ${isFeatured ? 'justify-center p-2' : ''}`}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/80">
                <span className="flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded text-foreground/80">
                  <Hash size={10} className="text-primary/70" />
                  {item.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-red-500" onClick={(e) => { e.preventDefault(); }}>
                  <Heart size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={(e) => { e.preventDefault(); }}>
                  <MoreHorizontal size={14} />
                </Button>
              </div>
            </div>
            <CardTitle className={`leading-tight font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors ${isFeatured ? 'text-2xl md:text-3xl lg:text-4xl mb-2' : 'text-base'}`}>
              {item.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 pt-0 flex-grow">
            <p className={`text-muted-foreground leading-relaxed ${isFeatured ? 'text-base md:text-lg line-clamp-4' : 'text-sm line-clamp-3'}`}>
              {item.summary}
            </p>
          </CardContent>
          
          <CardFooter className="p-4 pt-2 flex items-center justify-between border-0 mt-auto">
            <div className="flex items-center gap-2">
               {/* Favicon fallback/placeholder could go here */}
               <span className="text-[11px] font-semibold text-foreground/70">
                {item.source}
              </span>
            </div>
           
            {item.readingTime && (
              <span className="text-[11px] text-muted-foreground/70 bg-muted/30 px-2 py-1 rounded-full">
                {item.readingTime} min read
              </span>
            )}
          </CardFooter>
        </div>
      </Card>
    </a>
  );
}
