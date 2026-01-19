"use client";

import { ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Settings, Terminal } from 'lucide-react';
import { SettingsModal } from '@/components/source-manager/settings-modal';
import { ReaderPanel } from '@/components/features/reader-panel';

interface CommandCenterShellProps {
    children?: ReactNode;
    geoQuadrant: ReactNode;
    financeQuadrant: ReactNode;
    techQuadrant: ReactNode;
    oddsQuadrant: ReactNode;
    className?: string;
}

export function CommandCenterShell({
    geoQuadrant,
    financeQuadrant,
    techQuadrant,
    oddsQuadrant,
    className
}: CommandCenterShellProps) {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        // Shell Container: Full screen, no padding, strict grid
        <div className={cn("h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden scanlines", className)}>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <ReaderPanel />

            {/* Terminal Header - Dense */}
            <header className="flex-none h-12 border-b border-border bg-card flex items-center justify-between px-4 select-none">
                <h1 className="text-lg font-bold tracking-tight text-primary flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-green-500" />
                    <span className="text-green-500 uppercase tracking-widest">NEWS_DECK.SYS</span>
                    <span className="text-xs text-muted-foreground bg-accent px-1">v2.0.4-RC</span>
                </h1>
                <div className="flex items-center gap-4">
                    {/* System Stats Mockup (Todo: Real Clock) */}
                    <div className="hidden md:flex gap-4 text-xs font-mono text-muted-foreground border-r border-border pr-4">
                        <span>CPU: <span className="text-foreground">12%</span></span>
                        <span>NET: <span className="text-foreground">ONLINE</span></span>
                        <span>UPTIME: <span className="text-foreground">04:20:11</span></span>
                    </div>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-1 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main Command Grid - 2x2 Dense Layout */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 grid-rows-2 overflow-hidden border-t border-border">
                {/* 
                   Using borders on the cells themselves to create the grid lines.
                   Negative margins or specific border classes can prevent double borders if needed,
                   but standard collapsing borders in CSS Grid aren't default in Tailwind.
                   We'll use border-r and border-b for specific cells.
                */}

                {/* Q1: Geopolitics (Top-Left) */}
                <section className="relative flex flex-col border-b border-border md:border-r overflow-hidden group">
                    {/* Header Strip */}
                    <div className="flex-none h-8 bg-accent/30 border-b border-white/5 flex items-center justify-between px-3">
                        <span className="text-brand-geo text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-geo animate-pulse shadow-[0_0_8px_var(--color-brand-geo)]" />
                            [01] GEOPOLITICS_WIRE
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">128kbps</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-auto p-0 relative bg-background/50">
                        {geoQuadrant}
                    </div>
                </section>

                {/* Q2: Finance (Top-Right) */}
                <section className="relative flex flex-col border-b border-border overflow-hidden group">
                    <div className="flex-none h-8 bg-accent/30 border-b border-white/5 flex items-center justify-between px-3">
                        <span className="text-brand-fin text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-fin animate-pulse shadow-[0_0_8px_var(--color-brand-fin)]" />
                            [02] MARKET_DATA_STREAM
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">LIVE</span>
                    </div>
                    <div className="flex-1 overflow-auto p-0 relative bg-background/50">
                        {financeQuadrant}
                    </div>
                </section>

                {/* Q3: Tech (Bottom-Left) */}
                <section className="relative flex flex-col border-border md:border-r overflow-hidden group">
                    <div className="flex-none h-8 bg-accent/30 border-b border-white/5 flex items-center justify-between px-3">
                        <span className="text-brand-tech text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-tech animate-pulse shadow-[0_0_8px_var(--color-brand-tech)]" />
                            [03] SILICON_VALLEY_FEED
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">RSS_V2</span>
                    </div>
                    <div className="flex-1 overflow-auto p-0 relative bg-background/50">
                        {techQuadrant}
                    </div>
                </section>

                {/* Q4: Odds (Bottom-Right) */}
                <section className="relative flex flex-col overflow-hidden group">
                    <div className="flex-none h-8 bg-accent/30 border-b border-white/5 flex items-center justify-between px-3">
                        <span className="text-brand-odds text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <div className="w-2 h-2 bg-brand-odds animate-pulse shadow-[0_0_8px_var(--color-brand-odds)]" />
                            [04] PREDICTION_MARKETS
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">POLY_API</span>
                    </div>
                    <div className="flex-1 overflow-auto p-0 relative bg-background/50">
                        {oddsQuadrant}
                    </div>
                </section>

            </main>

            {/* System Footer Loop (Optional) */}
            <footer className="h-6 border-t border-border bg-card flex items-center px-4 text-[10px] text-muted-foreground justify-between">
                <span>SYSTEM STATUS: NORMAL</span>
                <span className="animate-pulse">_</span>
            </footer>
        </div>
    );
}
