"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from '@/app/v2/lib/types';
import { NewsFeedColumn } from '../columns/news-feed-column';
import { PolymarketColumn } from '../columns/polymarket-column';
import { ReaderColumn } from '../columns/reader-column';
import { GripVertical, X } from 'lucide-react';
import { useLayout } from '@/app/v2/contexts/layout-context';

interface DraggableColumnProps {
  column: Column;
}

export function DraggableColumn({ column }: DraggableColumnProps) {
  const { removeColumn } = useLayout();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderColumn = () => {
    switch (column.type) {
      case 'news':
        return <NewsFeedColumn column={column} />;
      case 'polymarket':
        return <PolymarketColumn column={column} />;
      case 'reader':
        return <ReaderColumn column={column} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex flex-col h-full"
    >
      {/* Brutal Column Header */}
      <div className="flex items-center justify-between gap-4 mb-4 p-4 border-[3px] border-border bg-card">
        <div className="accent-bar" />

        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 w-10 h-10 border-[3px] border-border hover:bg-muted cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Column Title */}
        <div className="flex-1">
          <h2 className="font-display text-2xl uppercase tracking-tight">
            {column.config.title}
          </h2>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeColumn(column.id)}
          className="flex-shrink-0 w-10 h-10 border-[3px] border-border hover:bg-destructive hover:text-white flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-hidden border-[3px] border-border bg-card shadow-brutal">
        {renderColumn()}
      </div>
    </div>
  );
}
