'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings2, Grid, List, Check } from 'lucide-react';
import { useDashboard } from '@/context/dashboard-context';
import { Category } from '@/types';

export function SettingsPanel() {
  const {
    visibleCategories,
    toggleCategory,
    layoutMode,
    setLayoutMode,
    isCompact,
    setIsCompact,
  } = useDashboard();

  const categories: Category[] = ['AI', 'Crypto', 'Tech', 'Macro'];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-background">
          <Settings2 size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dashboard Settings</SheetTitle>
          <SheetDescription>
            Customize your news feed and layout.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={visibleCategories.includes(category) ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start gap-2"
                  onClick={() => toggleCategory(category)}
                >
                  {visibleCategories.includes(category) && <Check size={14} />}
                  <span className={visibleCategories.includes(category) ? '' : 'ml-5'}>{category}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Layout Mode</h3>
            <div className="flex gap-2">
              <Button
                variant={layoutMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setLayoutMode('grid')}
              >
                <Grid size={14} />
                Grid
              </Button>
              <Button
                variant={layoutMode === 'list' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 gap-2"
                onClick={() => setLayoutMode('list')}
              >
                <List size={14} />
                List
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Display</h3>
            <Button
              variant={isCompact ? 'default' : 'outline'}
              size="sm"
              className="justify-start gap-2"
              onClick={() => setIsCompact(!isCompact)}
            >
              {isCompact && <Check size={14} />}
              <span className={isCompact ? '' : 'ml-5'}>Compact Cards</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
