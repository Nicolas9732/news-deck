'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardConfig, LayoutMode } from '@/types';

interface DashboardContextType extends DashboardConfig {
  setActiveTopic: (topic: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setIsCompact: (isCompact: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const DEFAULT_CONFIG: DashboardConfig = {
  activeTopic: 'For You',
  layoutMode: 'grid',
  isCompact: false,
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DashboardConfig>(DEFAULT_CONFIG);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure activeTopic exists if we're migrating from an old config
        if (!parsed.activeTopic) {
           parsed.activeTopic = 'For You';
        }
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

  const setActiveTopic = (topic: string) => {
    setConfig((prev) => ({ ...prev, activeTopic: topic }));
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setConfig((prev) => ({ ...prev, layoutMode: mode }));
  };

  const setIsCompact = (isCompact: boolean) => {
    setConfig((prev) => ({ ...prev, isCompact }));
  };

  return (
    <DashboardContext.Provider
      value={{
        ...config,
        setActiveTopic,
        setLayoutMode,
        setIsCompact,
        searchQuery,
        setSearchQuery,
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
