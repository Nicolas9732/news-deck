'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { NewsItem } from '@/types';
import { Clock, Hash, Heart, MoreHorizontal } from 'lucide-react';
import { formatRelativeTime, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getCategoryColor } from '@/lib/category-colors';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'standard' | 'featured';
  compact?: boolean; // Kept for backward compatibility, maps to standard
}


export function NewsCard({ item, variant = 'standard' }: NewsCardProps) {
  const isFeatured = variant === 'featured';
  const categoryColor = getCategoryColor(item.category);
  const hasImage = !!item.imageUrl;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className={cn(
        "group relative flex flex-col h-full overflow-hidden border-border/40 bg-card transition-all hover:shadow-md hover:border-border/80",
        isFeatured && hasImage ? 'md:flex-row md:items-stretch' : '',
        !isFeatured && 'border-l-2',
        !isFeatured && categoryColor.border
      )}>
        
        {/* Image Section - Featured: side image, Standard: top thumbnail */}
        {/* Only show image section if there's an image, otherwise show thin colored strip */}
        {isFeatured ? (
          item.imageUrl ? (
            <div className="w-full md:w-2/5 bg-muted relative overflow-hidden order-first md:order-last">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : null
        ) : (
          /* Standard card: show image if exists, otherwise thin colored strip */
          item.imageUrl ? (
            <div className="w-full h-32 bg-muted relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className={cn("w-full h-1", categoryColor.bg)} />
          )
        )}

        <div className={cn("flex flex-col flex-1", isFeatured ? 'justify-center p-2' : '')}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest">
                <span className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold",
                  categoryColor.bg,
                  categoryColor.text
                )}>
                  <Hash size={10} />
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground/80">
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
            <CardTitle className={cn(
              "leading-tight font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors",
              isFeatured ? 'text-2xl md:text-3xl lg:text-4xl mb-2' : 'text-base'
            )}>
              {item.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 pt-0 flex-grow">
            <p className={cn(
              "text-muted-foreground leading-relaxed",
              isFeatured ? 'text-base md:text-lg line-clamp-4' : 'text-sm line-clamp-2'
            )}>
              {item.summary}
            </p>
          </CardContent>
          
          <CardFooter className="p-4 pt-2 flex items-center justify-between border-0 mt-auto">
            <div className="flex items-center gap-2">
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
