'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Plus, AlertTriangle, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    IN_DELIBERATION: { label: 'In Deliberation', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
    DECIDED: { label: 'Decided', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle2 },
    IMPLEMENTED: { label: 'Implemented', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
    ARCHIVED: { label: 'Archived', color: 'text-white/40 bg-white/5 border-white/10', icon: MoreHorizontal },
};

const urgencyColors: Record<string, string> = {
    Immediate: 'text-rose-400', High: 'text-orange-400', Medium: 'text-amber-400', Low: 'text-white/40'
};

export default function DecisionLog() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, decisions, setActiveModal } = useApp();
    const business = businesses.find(b => b.id === businessId);
    
    // Filter decisions for this business
    const businessDecisions = decisions.filter(d => d.businessId === businessId);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-white">Decision Log</h1>
                    <p className="text-[11px] text-white/40">{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button onClick={() => setActiveModal('NEW_DECISION')} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-colors">
                        <Plus className="w-4 h-4" /> New Decision
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-4xl mx-auto space-y-4">
                {businessDecisions.map(d => {
                    const sc = statusConfig[d.status] ?? statusConfig.ARCHIVED;
                    const Icon = sc.icon;
                    return (
                        <div key={d.id} className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="text-base font-semibold text-white leading-tight">{d.title}</h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border ${sc.color}`}>
                                            <Icon className="w-3 h-3" /> {sc.label}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed mb-4">{d.context}</p>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider">Urgency</span>
                                        <p className={`text-xs font-semibold ${urgencyColors[d.urgency]}`}>{d.urgency}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider">Impact</span>
                                        <p className="text-xs font-semibold text-white/70">{d.impact}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-white/30 uppercase tracking-wider">Deadline</span>
                                        <p className="text-xs font-semibold text-white/70">{d.deadline}</p>
                                    </div>
                                    {d.outcomeRating && (
                                        <div>
                                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Outcome</span>
                                            <p className="text-xs font-semibold text-amber-400">{'★'.repeat(d.outcomeRating)}{'☆'.repeat(5 - d.outcomeRating)}</p>
                                        </div>
                                    )}
                                </div>
                                {d.chosen && (
                                    <div className="mt-4 px-3 py-2.5 bg-white/[0.02] border border-white/[0.04] rounded-lg">
                                        <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-1">Chosen Path</p>
                                        <p className="text-sm text-white/70">{d.chosen}</p>
                                    </div>
                                )}
                                <div className="mt-3 px-3 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                                    <p className="text-[10px] font-semibold text-indigo-400/60 uppercase tracking-wider mb-0.5">Success KPI</p>
                                    <p className="text-xs text-indigo-300/80">{d.kpi}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}
