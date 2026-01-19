"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FeedSource, DEFAULT_FEEDS, QuadrantType } from '@/lib/types';

interface SourceContextType {
    sources: FeedSource[];
    addSource: (source: Omit<FeedSource, 'id' | 'enabled'>) => void;
    removeSource: (id: string) => void;
    toggleSource: (id: string) => void;
    getSourcesByQuadrant: (quadrant: QuadrantType) => FeedSource[];
    resetDefaults: () => void;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export function SourceProvider({ children }: { children: React.ReactNode }) {
    const [sources, setSources] = useState<FeedSource[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('news-deck-sources');
        if (saved) {
            try {
                setSources(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse sources", e);
                setSources(DEFAULT_FEEDS);
            }
        } else {
            setSources(DEFAULT_FEEDS);
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('news-deck-sources', JSON.stringify(sources));
        }
    }, [sources, isInitialized]);

    const addSource = (source: Omit<FeedSource, 'id' | 'enabled'>) => {
        const newSource: FeedSource = {
            ...source,
            id: crypto.randomUUID(),
            enabled: true,
        };
        setSources(prev => [...prev, newSource]);
    };

    const removeSource = (id: string) => {
        setSources(prev => prev.filter(s => s.id !== id));
    };

    const toggleSource = (id: string) => {
        setSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    };

    const getSourcesByQuadrant = (quadrant: QuadrantType) => {
        return sources.filter(s => s.quadrant === quadrant && s.enabled);
    };

    const resetDefaults = () => {
        setSources(DEFAULT_FEEDS);
    };

    return (
        <SourceContext.Provider value={{ sources, addSource, removeSource, toggleSource, getSourcesByQuadrant, resetDefaults }}>
            {children}
        </SourceContext.Provider>
    );
}

export function useSources() {
    const context = useContext(SourceContext);
    if (context === undefined) {
        throw new Error('useSources must be used within a SourceProvider');
    }
    return context;
}
