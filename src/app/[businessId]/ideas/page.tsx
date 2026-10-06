'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Zap, Tag } from 'lucide-react';
import { useState } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const categoryColors: Record<string, { color: string, bg: string }> = {
    'Content Hook': { color: '#FF2D55', bg: 'rgba(255, 45, 85, 0.1)' },
    'Revenue Stream': { color: '#34C759', bg: 'rgba(52, 199, 89, 0.1)' },
    'Automation': { color: '#007AFF', bg: 'rgba(0, 122, 255, 0.1)' },
    'Marketing Angle': { color: '#AF52DE', bg: 'rgba(175, 82, 222, 0.1)' },
    'Product Sourcing': { color: '#32ADE6', bg: 'rgba(50, 173, 230, 0.1)' },
    'Cost-cutting': { color: '#FF9500', bg: 'rgba(255, 149, 0, 0.1)' },
    'Other': { color: 'var(--text-secondary)', bg: 'var(--fill-1)' },
};

function IceBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] w-3 font-bold uppercase" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <div className="flex-1 rounded-full h-1" style={{ background: 'var(--fill-2)' }}>
                <div className="h-1 rounded-full" style={{ width: `${value * 10}%`, background: '#007AFF' }} />
            </div>
            <span className="text-[10px] font-bold w-4 text-right" style={{ color: 'var(--text-secondary)' }}>{value}</span>
        </div>
    );
}

export default function IdeaVault() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, ideas, addIdea } = useApp();
    const business = businesses.find(b => b.id === businessId);
    
    // Filter ideas for this business
    const businessIdeas = ideas.filter(i => i.businessId === businessId);
    const [newIdea, setNewIdea] = useState('');

    const ranked = [...businessIdeas].sort((a, b) => (b.impact * b.confidence * b.ease) - (a.impact * a.confidence * a.ease));

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <header className="sticky top-0 z-10 glass border-b px-8 h-16 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div>
                    <h1 className="text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Idea Vault</h1>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                </div>
            </header>

            <main className="p-8 max-w-4xl mx-auto space-y-6">
                {/* Quick capture */}
                <div className="card p-4 flex gap-3 border" style={{ borderColor: 'rgba(255, 149, 0, 0.3)' }}>
                    <Zap className="w-5 h-5 shrink-0 mt-2.5" style={{ color: '#FF9500' }} />
                    <div className="flex-1">
                        <textarea
                            value={newIdea}
                            onChange={e => setNewIdea(e.target.value)}
                            placeholder="Capture an idea instantly... (Ctrl+Shift+I from anywhere)"
                            rows={2}
                            className="w-full bg-transparent text-sm resize-none focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                        />
                        {newIdea.trim() && (
                            <div className="flex gap-2 mt-3">
                                <button 
                                    onClick={() => {
                                        addIdea({ businessId, title: newIdea, category: 'Other', impact: 5, confidence: 5, ease: 5, note: '' });
                                        setNewIdea('');
                                    }}
                                    className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border"
                                    style={{ background: 'rgba(255, 149, 0, 0.1)', borderColor: 'rgba(255, 149, 0, 0.2)', color: '#FF9500' }}
                                >
                                    Save Idea
                                </button>
                                <button onClick={() => setNewIdea('')} className="text-xs transition-colors px-3 py-1.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ICE board */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>ICE Priority Board</h2>
                        <span className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>Sorted by ICE Score (Impact × Confidence × Ease)</span>
                    </div>
                    <div className="space-y-3">
                        {ranked.map((idea, i) => {
                            const ice = idea.impact * idea.confidence * idea.ease;
                            const catColor = categoryColors[idea.category] ?? categoryColors['Other'];
                            return (
                                <div key={idea.id} className="card card-hover p-6 border" style={{ borderColor: 'var(--border)' }}>
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl font-bold shrink-0 mt-0.5 opacity-20" style={{ color: 'var(--text-primary)' }}>#{i + 1}</span>
                                            <div>
                                                <h3 className="text-sm font-bold leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{idea.title}</h3>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: catColor.bg, color: catColor.color }}>
                                                    {idea.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-2xl font-bold" style={{ color: '#FF9500' }}>{ice}</p>
                                            <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>ICE Score</p>
                                        </div>
                                    </div>
                                    <p className="text-xs mb-4 pl-9 font-medium" style={{ color: 'var(--text-secondary)' }}>{idea.note}</p>
                                    <div className="space-y-1.5 pl-9 mb-4">
                                        <IceBar label="I" value={idea.impact} />
                                        <IceBar label="C" value={idea.confidence} />
                                        <IceBar label="E" value={idea.ease} />
                                    </div>
                                    <div className="flex gap-2 pl-9">
                                        {['→ Content', '→ Decision', '→ Inventory'].map(action => (
                                            <button key={action} className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors"
                                                style={{ background: 'var(--fill-1)', color: 'var(--text-secondary)' }}>
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
