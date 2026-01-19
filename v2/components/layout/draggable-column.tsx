"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Column } from '@/v2/lib/types';
import { GripVertical, X, Settings } from 'lucide-react';
import { useLayout } from '@/v2/contexts/layout-context';
import { cn } from '@/v2/lib/utils';

interface DraggableColumnProps {
  column: Column;
  children: React.ReactNode;
}

export function DraggableColumn({ column, children }: DraggableColumnProps) {
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
  };

  // Calculate width in pixels (assuming 12-column grid, each column ~300px)
  const widthClass = `w-[${column.width * 80 + (column.width - 1) * 16}px]`;
  const minWidth = column.width * 80 + (column.width - 1) * 16;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, minWidth: `${minWidth}px`, maxWidth: `${minWidth}px` }}
      className={cn(
        "h-full flex flex-col rounded-xl border border-border bg-card shadow-lg transition-all",
        isDragging && "opacity-50 scale-95"
      )}
    >
      {/* Column header */}
      <div className="flex-none flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-muted-fg" />
          </button>
          <h3 className="text-sm font-semibold text-foreground">
            {column.config.title || 'Column'}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Column settings"
          >
            <Settings className="w-4 h-4 text-muted-fg" />
          </button>
          <button
            onClick={() => removeColumn(column.id)}
            className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
            aria-label="Close column"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
