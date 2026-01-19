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
      className="terminal-panel h-full flex flex-col"
    >
      {/* Panel Header */}
      <div className="panel-header flex items-center justify-between flex-shrink-0">
        <button
          {...attributes}
          {...listeners}
          className="flex items-center gap-2 hover:text-cyan cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
          <span>{column.config.title.toUpperCase()}</span>
        </button>

        <button
          onClick={() => removeColumn(column.id)}
          className="hover:text-red text-[10px] tracking-wider"
        >
          [X]
        </button>
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-hidden">
        {renderColumn()}
      </div>
    </div>
  );
}
