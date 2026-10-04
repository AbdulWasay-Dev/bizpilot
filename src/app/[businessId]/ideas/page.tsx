'use client';

import { useParams } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/contexts/AppContext';
import { Plus, Zap, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const mockIdeas = [
    { id: '1', title: 'Create TikTok "watch before buying" series for software keys', category: 'Content Hook', impact: 9, confidence: 8, ease: 7, note: 'Showcase value prop as short videos. Low edit time needed.' },
    { id: '2', title: 'Bundle Office + Windows keys for $99 deal', category: 'Revenue Stream', impact: 8, confidence: 7, ease: 9, note: 'Bundle pricing could improve AOV significantly.' },
    { id: '3', title: 'Auto-send WhatsApp delivery message via template', category: 'Automation', impact: 7, confidence: 9, ease: 5, note: 'Use WA Business API to automate key delivery notification.' },
    { id: '4', title: 'Partner with micro-influencers for affiliate deals', category: 'Marketing Angle', impact: 9, confidence: 5, ease: 4, note: 'Needs outreach. Could be very high ROI if done right.' },
];

const categoryColors: Record<string, string> = {
    'Content Hook': 'text-pink-400 bg-pink-400/10',
    'Revenue Stream': 'text-emerald-400 bg-emerald-400/10',
    'Automation': 'text-blue-400 bg-blue-400/10',
    'Marketing Angle': 'text-purple-400 bg-purple-400/10',
    'Product Sourcing': 'text-cyan-400 bg-cyan-400/10',
    'Cost-cutting': 'text-amber-400 bg-amber-400/10',
};

function IceBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 w-3 font-semibold">{label}</span>
            <div className="flex-1 bg-white/5 rounded-full h-1">
                <div className="h-1 rounded-full bg-indigo-500" style={{ width: `${value * 10}%` }} />
            </div>
            <span className="text-[10px] text-white/60 w-4 text-right">{value}</span>
        </div>
    );
}

export default function IdeaVault() {
    const { businessId } = useParams() as { businessId: string };
    const business = MOCK_BUSINESSES.find(b => b.id === businessId);
    const [newIdea, setNewIdea] = useState('');

    const ranked = [...mockIdeas].sort((a, b) => (b.impact * b.confidence * b.ease) - (a.impact * a.confidence * a.ease));

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-white">Idea Vault</h1>
                    <p className="text-[11px] text-white/40">{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                </div>
            </header>

            <main className="p-8 max-w-4xl mx-auto space-y-6">
                {/* Quick capture */}
                <div className="bg-[#141414] border border-amber-400/20 rounded-2xl p-4 flex gap-3">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-2.5" />
                    <div className="flex-1">
                        <textarea
                            value={newIdea}
                            onChange={e => setNewIdea(e.target.value)}
                            placeholder="Capture an idea instantly... (Ctrl+Shift+I from anywhere)"
                            rows={2}
                            className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none"
                        />
                        {newIdea.trim() && (
                            <div className="flex gap-2 mt-3">
                                <button className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-400/20 transition-colors">
                                    Save Idea
                                </button>
                                <button onClick={() => setNewIdea('')} className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ICE board */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">ICE Priority Board</h2>
                        <span className="text-xs text-white/40">Sorted by ICE Score (Impact × Confidence × Ease)</span>
                    </div>
                    <div className="space-y-3">
                        {ranked.map((idea, i) => {
                            const ice = idea.impact * idea.confidence * idea.ease;
                            const catColor = categoryColors[idea.category] ?? 'text-white/60 bg-white/5';
                            return (
                                <div key={idea.id} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl font-bold text-white/10 shrink-0 mt-0.5">#{i + 1}</span>
                                            <div>
                                                <h3 className="text-sm font-semibold text-white leading-tight mb-1">{idea.title}</h3>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
                                                    {idea.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-2xl font-bold text-amber-400">{ice}</p>
                                            <p className="text-[10px] text-white/30">ICE Score</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/50 mb-4 pl-9">{idea.note}</p>
                                    <div className="space-y-1.5 pl-9 mb-4">
                                        <IceBar label="I" value={idea.impact} />
                                        <IceBar label="C" value={idea.confidence} />
                                        <IceBar label="E" value={idea.ease} />
                                    </div>
                                    <div className="flex gap-2 pl-9">
                                        {['→ Content', '→ Decision', '→ Inventory'].map(action => (
                                            <button key={action} className="flex items-center gap-1 text-[10px] font-semibold text-white/40 hover:text-indigo-400 px-2 py-1 rounded-lg hover:bg-indigo-400/10 transition-colors">
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
