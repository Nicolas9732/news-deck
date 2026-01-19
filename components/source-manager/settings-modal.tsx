"use client";

import { useSources } from '@/contexts/source-context';
import { QuadrantType } from '@/lib/types';
import { X, Plus, Trash2, Power, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { sources, addSource, removeSource, toggleSource, resetDefaults } = useSources();
    const [newUrl, setNewUrl] = useState('');
    const [newName, setNewName] = useState('');
    const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType>('tech');

    if (!isOpen) return null;

    const handleAdd = () => {
        if (!newUrl || !newName) return;
        addSource({
            name: newName,
            url: newUrl,
            type: 'rss',
            quadrant: selectedQuadrant,
        });
        setNewUrl('');
        setNewName('');
    };

    const categories: { id: QuadrantType; label: string; color: string }[] = [
        { id: 'geo', label: 'Geopolitics', color: 'text-brand-geo' },
        { id: 'finance', label: 'Finance', color: 'text-brand-fin' },
        { id: 'tech', label: 'Tech & AI', color: 'text-brand-tech' },
        { id: 'odds', label: 'Odds', color: 'text-brand-odds' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-2xl flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold font-mono tracking-tight flex items-center gap-2">
                        Settings <span className="text-muted-foreground text-sm font-normal">/ Source Manager</span>
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-accent rounded-md">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-6">

                    {/* Add New Source */}
                    <div className="bg-accent/20 p-4 rounded-md border border-border border-dashed">
                        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Add New Feed</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                            <input
                                placeholder="Feed Name (e.g. OpenAI Blog)"
                                className="col-span-1 md:col-span-1 bg-input border border-border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <input
                                placeholder="RSS URL (e.g. https://...)"
                                className="col-span-1 md:col-span-2 bg-input border border-border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                            />
                            <select
                                className="col-span-1 bg-input border border-border rounded p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                                value={selectedQuadrant}
                                onChange={(e) => setSelectedQuadrant(e.target.value as QuadrantType)}
                            >
                                <option value="geo">Geopolitics</option>
                                <option value="finance">Finance</option>
                                <option value="tech">Tech</option>
                                <option value="odds">Odds</option>
                            </select>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="w-full bg-primary text-primary-foreground hover:opacity-90 p-2 rounded text-sm font-bold flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Source
                        </button>
                    </div>

                    {/* Manage Existing */}
                    <div className="space-y-4">
                        {categories.map((cat) => (
                            <div key={cat.id}>
                                <h4 className={`text-xs font-bold uppercase mb-2 ${cat.color} flex items-center gap-2`}>
                                    {cat.label} <span className="text-muted-foreground font-normal opacity-50">({sources.filter(s => s.quadrant === cat.id).length})</span>
                                </h4>
                                <div className="space-y-1">
                                    {sources.filter(s => s.quadrant === cat.id).map((source) => (
                                        <div key={source.id} className="flex items-center justify-between p-2 bg-accent/10 rounded border border-border/50 group hover:border-border transition-colors">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <button
                                                    onClick={() => toggleSource(source.id)}
                                                    className={`p-1 rounded-full ${source.enabled ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-muted'}`}
                                                    title={source.enabled ? "Enabled" : "Disabled"}
                                                >
                                                    <Power className="w-3 h-3" />
                                                </button>
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-sm font-medium truncate ${!source.enabled && 'opacity-50 line-through'}`}>{source.name}</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[300px] font-mono">{source.url}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeSource(source.id)}
                                                className="text-destructive opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                                                title="Delete Source"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {sources.filter(s => s.quadrant === cat.id).length === 0 && (
                                        <div className="text-xs text-muted-foreground italic p-2">No feeds configured.</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-accent/5 flex justify-between">
                    <button onClick={resetDefaults} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> Reset to Defaults
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded text-sm font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
