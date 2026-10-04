'use client';

import { MOCK_BUSINESSES } from '@/contexts/AppContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    TrendingUp, Package, Image, Flame, AlertCircle,
    Calendar, DollarSign, Brain, Lightbulb, ArrowUpRight,
    ChevronRight, Plus
} from 'lucide-react';

function KpiCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string; sub?: string; icon: any; accent: string }) {
    return (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</span>
                <div className={`p-2 rounded-lg ${accent}/10`}>
                    <Icon className={`w-4 h-4 ${accent}`} />
                </div>
            </div>
            <div>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
                {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
            </div>
        </div>
    );
}

const quickLinks = [
    { label: 'Content Studio', href: '/content', icon: Calendar, accent: 'text-pink-400', bg: 'bg-pink-500/10', desc: 'Manage posts, calendar & media' },
    { label: 'Inventory', href: '/inventory', icon: Package, accent: 'text-cyan-400', bg: 'bg-cyan-500/10', desc: 'Stock, vendors & digital keys' },
    { label: 'Financial Ledger', href: '/finance', icon: DollarSign, accent: 'text-emerald-400', bg: 'bg-emerald-500/10', desc: 'Revenue, expenses & profit' },
    { label: 'Decision Log', href: '/decisions', icon: Brain, accent: 'text-indigo-400', bg: 'bg-indigo-500/10', desc: 'Strategic decisions & outcomes' },
    { label: 'Idea Vault', href: '/ideas', icon: Lightbulb, accent: 'text-amber-400', bg: 'bg-amber-500/10', desc: 'Capture & score ideas with ICE' },
];

export default function BusinessDashboard() {
    const params = useParams();
    const businessId = params.businessId as string;
    const business = MOCK_BUSINESSES.find(b => b.id === businessId);

    if (!business) {
        return (
            <div className="flex-1 flex items-center justify-center text-white/40 text-sm">
                Business not found. <Link href="/" className="ml-2 underline text-indigo-400">Go home</Link>
            </div>
        );
    }

    const m = business.metrics;
    const postPct = Math.round((m.postsWeek / m.targetPostsWeek) * 100);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${business.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                            {business.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-base font-semibold text-white leading-tight">{business.name}</h1>
                            <p className="text-[11px] text-white/40">Local Dashboard</p>
                        </div>
                    </div>

                    {/* View Switcher Toggle: Local vs Universal */}
                    <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex items-center ml-2">
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 text-white shadow-sm transition-all"
                        >
                            <span>Local Dashboard</span>
                        </button>
                        <Link
                            href={`/${businessId}/universal`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <span className="text-indigo-400">🌐</span>
                            <span>Universal Dashboard</span>
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href={`/${businessId}/universal`}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-medium transition-colors"
                    >
                        <span>View All Businesses</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <button className="flex items-center gap-2 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Quick Post
                    </button>
                    <button className="flex items-center gap-2 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Log Sale
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-6xl mx-auto space-y-8">
                {/* KPI Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Revenue (MTD)" value={`$${m.revenueMonth.toLocaleString()}`} sub="Month to date" icon={TrendingUp} accent="text-emerald-400" />
                    <KpiCard label="Items Sold" value={`${m.itemsSold}`} sub="All time" icon={Package} accent="text-cyan-400" />
                    <KpiCard
                        label="Posts This Week"
                        value={`${m.postsWeek}/${m.targetPostsWeek}`}
                        sub={`${postPct}% of target`}
                        icon={Image}
                        accent="text-pink-400"
                    />
                    <KpiCard
                        label="Posting Streak"
                        value={m.streak > 0 ? `${m.streak} days` : '0 days'}
                        sub={m.streak > 0 ? '🔥 Keep it up!' : 'No streak yet'}
                        icon={Flame}
                        accent="text-orange-400"
                    />
                </div>

                {/* Posting target progress */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-white">Content Consistency Scorecard</h2>
                        <Link href={`/${businessId}/content`} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
                            View full calendar <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { platform: '📸 Instagram', posted: 3, target: 5 },
                            { platform: '🎵 TikTok', posted: 2, target: 3 },
                            { platform: '💼 LinkedIn', posted: 1, target: 2 },
                        ].map(row => {
                            const p = Math.round((row.posted / row.target) * 100);
                            return (
                                <div key={row.platform} className="flex items-center gap-4">
                                    <span className="w-28 text-sm text-white/70 shrink-0">{row.platform}</span>
                                    <div className="flex-1 bg-white/5 rounded-full h-1.5">
                                        <div
                                            className={`h-1.5 rounded-full ${p >= 100 ? 'bg-emerald-500' : p >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                            style={{ width: `${Math.min(100, p)}%` }}
                                        />
                                    </div>
                                    <span className="w-14 text-right text-xs text-white/50 shrink-0">{row.posted}/{row.target}</span>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${p >= 100 ? 'text-emerald-400 bg-emerald-400/10' : p >= 60 ? 'text-amber-400 bg-amber-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
                                        {p >= 100 ? 'On Target' : p >= 60 ? 'At Risk' : 'Behind'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Module quick links */}
                <div>
                    <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Workspace Modules</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {quickLinks.map(item => (
                            <Link
                                key={item.href}
                                href={`/${businessId}${item.href}`}
                                className="group bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-white/10 rounded-2xl p-5 flex items-center gap-4 transition-all"
                            >
                                <div className={`p-3 rounded-xl ${item.bg} shrink-0`}>
                                    <item.icon className={`w-5 h-5 ${item.accent}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white group-hover:text-white/90">{item.label}</p>
                                    <p className="text-xs text-white/40 mt-0.5 truncate">{item.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 shrink-0 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
