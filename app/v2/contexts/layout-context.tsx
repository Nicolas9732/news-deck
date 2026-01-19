"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Column, ColumnLayout, NewsItem } from '@/app/v2/lib/types';
import { saveToLocal, loadFromLocal } from '@/app/v2/lib/utils';

interface LayoutContextType {
  layout: ColumnLayout;
  updateLayout: (layout: ColumnLayout) => void;
  addColumn: (column: Omit<Column, 'id' | 'position'>) => void;
  removeColumn: (id: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  resizeColumn: (id: string, width: number) => void;
  selectedArticle: NewsItem | null;
  selectArticle: (article: NewsItem | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children, topicId }: { children: React.ReactNode; topicId?: string }) {
  const [layout, setLayout] = useState<ColumnLayout>({ columns: [] });
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Load layout from localStorage
  useEffect(() => {
    if (topicId) {
      const saved = loadFromLocal<ColumnLayout>(`news-deck-layout-${topicId}`, { columns: [] });
      setLayout(saved);
    }
  }, [topicId]);

  // Save layout to localStorage
  useEffect(() => {
    if (topicId && layout.columns.length > 0) {
      saveToLocal(`news-deck-layout-${topicId}`, layout);
    }
  }, [layout, topicId]);

  const updateLayout = (newLayout: ColumnLayout) => {
    setLayout(newLayout);
  };

  const addColumn = (columnData: Omit<Column, 'id' | 'position'>) => {
    const newColumn: Column = {
      ...columnData,
      id: `col-${Date.now()}`,
      position: layout.columns.length,
    };
    setLayout({
      ...layout,
      columns: [...layout.columns, newColumn],
    });
  };

  const removeColumn = (id: string) => {
    const filtered = layout.columns.filter(c => c.id !== id);
    // Reindex positions
    const reindexed = filtered.map((col, index) => ({ ...col, position: index }));
    setLayout({
      ...layout,
      columns: reindexed,
    });
  };

  const reorderColumns = (columnIds: string[]) => {
    const reordered = columnIds.map((id, index) => {
      const col = layout.columns.find(c => c.id === id);
      return col ? { ...col, position: index } : null;
    }).filter((col): col is Column => col !== null);

    setLayout({
      ...layout,
      columns: reordered,
    });
  };

  const resizeColumn = (id: string, width: number) => {
    setLayout({
      ...layout,
      columns: layout.columns.map(col =>
        col.id === id ? { ...col, width } : col
      ),
    });
  };

  const selectArticle = (article: NewsItem | null) => {
    setSelectedArticle(article);
    if (article) {
      // Ensure reader column is visible
      const hasReader = layout.columns.some(c => c.type === 'reader' && c.visible);
      if (!hasReader) {
        const readerCol = layout.columns.find(c => c.type === 'reader');
        if (readerCol) {
          setLayout({
            ...layout,
            columns: layout.columns.map(c =>
              c.type === 'reader' ? { ...c, visible: true } : c
            ),
          });
        }
      }
    }
  };

  return (
    <LayoutContext.Provider value={{
      layout,
      updateLayout,
      addColumn,
      removeColumn,
      reorderColumns,
      resizeColumn,
      selectedArticle,
      selectArticle,
    }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
