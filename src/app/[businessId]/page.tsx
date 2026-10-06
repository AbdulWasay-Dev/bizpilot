'use client';

import { useApp } from '@/contexts/AppContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    TrendingUp, Package, Image, Flame,
    Calendar, DollarSign, Brain, Lightbulb,
    ChevronRight, Plus
} from 'lucide-react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

function KpiCard({ label, value, sub, icon: Icon, accent, bg }: { label: string; value: string; sub?: string; icon: any; accent: string; bg: string }) {
    return (
        <div className="card p-5 flex flex-col gap-3 animate-fade-up">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <div className={`p-2 rounded-xl ${bg}`}>
                    <Icon className={`w-4 h-4 ${accent}`} />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
                {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
            </div>
        </div>
    );
}

const quickLinks = [
    { label: 'Content Studio', href: '/content', icon: Calendar, color: 'text-pink-500', bg: 'bg-pink-500/10', desc: 'Manage posts, calendar & media' },
    { label: 'Inventory', href: '/inventory', icon: Package, color: 'text-cyan-500', bg: 'bg-cyan-500/10', desc: 'Stock, vendors & digital keys' },
    { label: 'Financial Ledger', href: '/finance', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Revenue, expenses & profit' },
    { label: 'Decision Log', href: '/decisions', icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: 'Strategic decisions & outcomes' },
    { label: 'Idea Vault', href: '/ideas', icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Capture & score ideas with ICE' },
];

export default function BusinessDashboard() {
    const params = useParams();
    const businessId = params.businessId as string;
    const { businesses, setActiveModal } = useApp();
    const business = businesses.find(b => b.id === businessId);

    if (!business) {
        return (
            <div className="flex-1 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
                Business not found. <Link href="/" className="ml-2 font-semibold" style={{ color: 'var(--text-primary)' }}>Go home</Link>
            </div>
        );
    }

    const m = business.metrics;
    const postPct = Math.round((m.postsWeek / m.targetPostsWeek) * 100);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <header className="sticky top-0 z-20 h-16 px-8 flex items-center justify-between border-b glass" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {business.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{business.name}</h1>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Local Dashboard</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button onClick={() => setActiveModal('ADD_POST')} className="btn-secondary flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" /> Quick Post
                    </button>
                    <button onClick={() => setActiveModal('LOG_SALE')} className="btn-primary flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" /> Log Sale
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">
                {/* KPI Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Revenue (MTD)" value={`$${m.revenueMonth.toLocaleString()}`} sub="Month to date" icon={TrendingUp} accent="text-emerald-500" bg="bg-emerald-500/10" />
                    <KpiCard label="Items Sold" value={`${m.itemsSold}`} sub="All time" icon={Package} accent="text-cyan-500" bg="bg-cyan-500/10" />
                    <KpiCard label="Posts This Week" value={`${m.postsWeek}/${m.targetPostsWeek}`} sub={`${postPct}% of target`} icon={Image} accent="text-pink-500" bg="bg-pink-500/10" />
                    <KpiCard label="Posting Streak" value={m.streak > 0 ? `${m.streak} days` : '0 days'} sub={m.streak > 0 ? 'Keep it up!' : 'No streak yet'} icon={Flame} accent="text-amber-500" bg="bg-amber-500/10" />
                </div>

                {/* Posting target progress */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Content Consistency</h2>
                        <Link href={`/${businessId}/content`} className="text-xs font-semibold flex items-center gap-1 transition-colors hover:underline" style={{ color: 'var(--text-primary)' }}>
                            View calendar <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { platform: '📸 Instagram', posted: 3, target: 5 },
                            { platform: '🎵 TikTok', posted: 2, target: 3 },
                            { platform: '💼 LinkedIn', posted: 1, target: 2 },
                        ].map(row => {
                            const p = Math.round((row.posted / row.target) * 100);
                            return (
                                <div key={row.platform} className="flex items-center gap-4">
                                    <span className="w-28 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{row.platform}</span>
                                    <div className="flex-1 rounded-full h-2" style={{ background: 'var(--fill-2)' }}>
                                        <div className="h-2 rounded-full" style={{ width: `${Math.min(100, p)}%`, background: p >= 100 ? '#34C759' : p >= 60 ? '#FF9500' : '#FF3B30' }} />
                                    </div>
                                    <span className="w-14 text-right text-xs" style={{ color: 'var(--text-muted)' }}>{row.posted}/{row.target}</span>
                                    <span className={`pill ${p >= 100 ? 'pill-success' : p >= 60 ? 'pill-warning' : 'pill-danger'}`}>
                                        {p >= 100 ? 'On Target' : p >= 60 ? 'At Risk' : 'Behind'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Module quick links */}
                <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Workspace Modules</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {quickLinks.map(item => (
                            <Link key={item.href} href={`/${businessId}${item.href}`} className="card card-hover p-5 flex items-center gap-4">
                                <div className={`p-3 rounded-xl shrink-0 ${item.bg}`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 shrink-0 transition-colors" style={{ color: 'var(--text-muted)' }} />
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
