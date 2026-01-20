'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardConfig, Category, LayoutMode } from '@/types';

interface DashboardContextType extends DashboardConfig {
  setVisibleCategories: (categories: Category[]) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setIsCompact: (isCompact: boolean) => void;
  toggleCategory: (category: Category) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_CONFIG: DashboardConfig = {
  visibleCategories: ['AI', 'Crypto', 'Tech', 'Macro'],
  layoutMode: 'grid',
  isCompact: false,
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG);

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setConfig((prev) => ({ ...prev, ...parsed }));
        }, 0);
      } catch (e) {
        console.error('Failed to parse dashboard config', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('dashboard-config', JSON.stringify(config));
  }, [config]);

  const setVisibleCategories = (categories: Category[]) => {
    setConfig((prev) => ({ ...prev, visibleCategories: categories }));
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setConfig((prev) => ({ ...prev, layoutMode: mode }));
  };

  const setIsCompact = (isCompact: boolean) => {
    setConfig((prev) => ({ ...prev, isCompact }));
  };

  const toggleCategory = (category: Category) => {
    setConfig((prev) => {
      const isVisible = prev.visibleCategories.includes(category);
      if (isVisible) {
        return {
          ...prev,
          visibleCategories: prev.visibleCategories.filter((c) => c !== category),
        };
      } else {
        return {
          ...prev,
          visibleCategories: [...prev.visibleCategories, category],
        };
      }
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        ...config,
        setVisibleCategories,
        setLayoutMode,
        setIsCompact,
        toggleCategory,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
