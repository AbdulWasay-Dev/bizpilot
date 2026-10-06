'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Plus, CheckCircle2, Clock, MoreHorizontal } from 'lucide-react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const statusConfig: Record<string, { label: string; badge: string; icon: any }> = {
    IN_DELIBERATION: { label: 'In Deliberation', badge: 'pill-warning', icon: Clock },
    DECIDED: { label: 'Decided', badge: 'pill-primary', icon: CheckCircle2 },
    IMPLEMENTED: { label: 'Implemented', badge: 'pill-success', icon: CheckCircle2 },
    ARCHIVED: { label: 'Archived', badge: 'pill-secondary', icon: MoreHorizontal },
};

const urgencyColors: Record<string, string> = {
    Immediate: '#FF3B30', High: '#FF9500', Medium: '#FFCC00', Low: 'var(--text-muted)'
};

export default function DecisionLog() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, decisions, setActiveModal } = useApp();
    const business = businesses.find(b => b.id === businessId);
    
    // Filter decisions for this business
    const businessDecisions = decisions.filter(d => d.businessId === businessId);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            <header className="sticky top-0 z-10 glass border-b px-8 h-16 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <div>
                    <h1 className="text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Decision Log</h1>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button onClick={() => setActiveModal('NEW_DECISION')} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Decision
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-4xl mx-auto space-y-4">
                {businessDecisions.map(d => {
                    const sc = statusConfig[d.status] ?? statusConfig.ARCHIVED;
                    const Icon = sc.icon;
                    return (
                        <div key={d.id} className="card card-hover overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="text-base font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>{d.title}</h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`pill ${sc.badge} flex items-center gap-1.5`}>
                                            <Icon className="w-3 h-3" /> {sc.label}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{d.context}</p>
                                <div className="flex items-center gap-8">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>Urgency</span>
                                        <p className="text-xs font-bold" style={{ color: urgencyColors[d.urgency] }}>{d.urgency}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>Impact</span>
                                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{d.impact}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>Deadline</span>
                                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{d.deadline}</p>
                                    </div>
                                    {d.outcomeRating && (
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: 'var(--text-muted)' }}>Outcome</span>
                                            <p className="text-xs font-semibold" style={{ color: '#FF9500' }}>{'★'.repeat(d.outcomeRating)}{'☆'.repeat(5 - d.outcomeRating)}</p>
                                        </div>
                                    )}
                                </div>
                                {d.chosen && (
                                    <div className="mt-5 px-4 py-3 rounded-xl border" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Chosen Path</p>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{d.chosen}</p>
                                    </div>
                                )}
                                <div className="mt-3 px-4 py-3 rounded-xl border" style={{ background: 'rgba(0, 122, 255, 0.05)', borderColor: 'rgba(0, 122, 255, 0.1)' }}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#007AFF' }}>Success KPI</p>
                                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{d.kpi}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
}
