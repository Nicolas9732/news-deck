"use client";

import { NewsItem } from '@/lib/types';
import React, { createContext, useContext, useState } from 'react';

interface ReaderContextType {
    isOpen: boolean;
    activeArticle: NewsItem | null;
    openArticle: (article: NewsItem) => void;
    closeReader: () => void;
}

const ReaderContext = createContext<ReaderContextType | undefined>(undefined);

export function ReaderProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

    const openArticle = (article: NewsItem) => {
        setActiveArticle(article);
        setIsOpen(true);
    };

    const closeReader = () => {
        setIsOpen(false);
        setTimeout(() => setActiveArticle(null), 300); // Clear after animation
    };

    return (
        <ReaderContext.Provider value={{ isOpen, activeArticle, openArticle, closeReader }}>
            {children}
        </ReaderContext.Provider>
    );
}

export function useReader() {
    const context = useContext(ReaderContext);
    if (context === undefined) {
        throw new Error('useReader must be used within a ReaderProvider');
    }
    return context;
}
