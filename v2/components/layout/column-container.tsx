"use client";

import { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useLayout } from '@/v2/contexts/layout-context';
import { useTopic } from '@/v2/contexts/topic-context';
import { DraggableColumn } from './draggable-column';
import { NewsFeedColumn } from '../columns/news-feed-column';
import { ReaderColumn } from '../columns/reader-column';
import { PolymarketColumn } from '../columns/polymarket-column';
import { Column } from '@/v2/lib/types';

export function ColumnContainer() {
  const { layout, reorderColumns, updateLayout } = useLayout();
  const { selectedTopic } = useTopic();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize layout if empty
  useEffect(() => {
    if (selectedTopic && layout.columns.length === 0 && selectedTopic.layout) {
      updateLayout(selectedTopic.layout);
    }
  }, [selectedTopic, layout.columns.length]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = layout.columns.findIndex((col) => col.id === active.id);
      const newIndex = layout.columns.findIndex((col) => col.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumns = arrayMove(layout.columns, oldIndex, newIndex);
        reorderColumns(newColumns.map(c => c.id));
      }
    }
  };

  const visibleColumns = layout.columns
    .filter(col => col.visible)
    .sort((a, b) => a.position - b.position);

  if (visibleColumns.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center px-6">
        <div className="max-w-md animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-muted-fg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-serif font-semibold mb-2">No columns configured</h3>
          <p className="text-sm text-muted-fg">
            Add columns to start monitoring news and markets
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleColumns.map(col => col.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="h-full flex gap-4 p-4 overflow-x-auto">
          {visibleColumns.map((column) => (
            <DraggableColumn key={column.id} column={column}>
              {renderColumn(column)}
            </DraggableColumn>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function renderColumn(column: Column) {
  switch (column.type) {
    case 'news':
      return <NewsFeedColumn column={column} />;
    case 'reader':
      return <ReaderColumn column={column} />;
    case 'polymarket':
      return <PolymarketColumn column={column} />;
    default:
      return (
        <div className="h-full flex items-center justify-center text-muted-fg">
          <p>Column type "{column.type}" not implemented</p>
        </div>
      );
  }
}
