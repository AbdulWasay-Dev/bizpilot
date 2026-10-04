'use client';

import { MOCK_BUSINESSES, Business } from '@/contexts/AppContext';
import { 
    TrendingUp, Package, Image, Target, AlertCircle, 
    Plus, DollarSign, PenTool, ArrowUpRight, Flame, 
    Clock, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

function TargetBar({ current, target }: { current: number; target: number }) {
    const pct = Math.min(100, Math.round((current / target) * 100));
    const color = pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-500';
    return (
        <div className="w-full bg-white/5 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
        </div>
    );
}

function StatusBadge({ current, target }: { current: number; target: number }) {
    const pct = Math.round((current / target) * 100);
    if (pct >= 100) return <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">🏆 Exceeded</span>;
    if (pct >= 60) return <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">🟡 At Risk</span>;
    return <span className="text-[10px] font-semibold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">🔴 Behind</span>;
}

function BusinessCard({ b }: { b: Business }) {
    const isNeglected = b.metrics.neglectScore < 50;
    const totalRevenue = MOCK_BUSINESSES.reduce((s, x) => s + x.metrics.revenueMonth, 0);

    return (
        <div className={`bg-[#141414] border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/60 ${isNeglected ? 'border-rose-500/20' : 'border-white/[0.06]'}`}>
            {/* Card header */}
            <div className="p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg`}>
                        {b.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-white leading-tight">{b.name}</h2>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isNeglected ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span className="text-xs text-white/40">{b.metrics.lastActivity}</span>
                        </div>
                    </div>
                </div>
                <Link href={`/${b.id}`} className="flex items-center gap-1 text-xs font-medium text-white/40 hover:text-white transition-colors shrink-0">
                    Open <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* KPI Grid */}
            <div className="px-5 pb-4 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Revenue (MTD)</p>
                    <p className="text-xl font-semibold text-white">${b.metrics.revenueMonth.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Items Sold</p>
                    <p className="text-xl font-semibold text-white">{b.metrics.itemsSold}</p>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1"><Image className="w-3 h-3" /> Posts (Week)</p>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-base font-semibold text-white">{b.metrics.postsWeek} / {b.metrics.targetPostsWeek}</span>
                            <StatusBadge current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                        </div>
                        <TargetBar current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1"><Flame className="w-3 h-3" /> Streak</p>
                    <p className="text-base font-semibold text-white flex items-center gap-2">
                        {b.metrics.streak > 0 ? `🔥 ${b.metrics.streak} days` : <span className="text-rose-400">No streak</span>}
                    </p>
                </div>
            </div>

            {/* Neglect warning */}
            {isNeglected && (
                <div className="mx-5 mb-4 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-rose-400 leading-tight">
                        {b.metrics.postsWeek === 0 ? 'No posts recorded this week.' : 'Posts significantly behind target.'} Needs attention.
                    </p>
                </div>
            )}

            {/* Quick actions */}
            <div className="mt-auto border-t border-white/[0.06] grid grid-cols-3">
                {[
                    { icon: PenTool, label: 'Post Idea' },
                    { icon: DollarSign, label: 'Log Sale' },
                    { icon: Clock, label: 'Mark Active' },
                ].map(action => (
                    <button key={action.label} className="flex flex-col items-center gap-1.5 py-3 text-white/40 hover:text-white hover:bg-white/[0.03] transition-colors border-r border-white/[0.06] last:border-r-0">
                        <action.icon className="w-4 h-4" />
                        <span className="text-[9px] font-medium uppercase tracking-wider">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function UniversalDashboard() {
    const totalRevenue = MOCK_BUSINESSES.reduce((s, b) => s + b.metrics.revenueMonth, 0);
    const totalPosts = MOCK_BUSINESSES.reduce((s, b) => s + b.metrics.postsWeek, 0);
    const totalTargetPosts = MOCK_BUSINESSES.reduce((s, b) => s + b.metrics.targetPostsWeek, 0);
    const bestStreak = Math.max(...MOCK_BUSINESSES.map(b => b.metrics.streak));
    const neglectedCount = MOCK_BUSINESSES.filter(b => b.metrics.neglectScore < 50).length;

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Top bar */}
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-white">Universal Dashboard</h1>
                    <p className="text-xs text-white/40">All businesses at a glance</p>
                </div>
                <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">
                    <Plus className="w-4 h-4" /> Add Business
                </button>
            </header>

            {/* Global summary strip */}
            <div className="bg-[#111] border-b border-white/[0.06] px-8 py-3 flex items-center gap-8">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-white/50">Revenue (Month)</span>
                    <span className="text-sm font-semibold text-white">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-pink-400" />
                    <span className="text-xs text-white/50">Posts (Week)</span>
                    <span className="text-sm font-semibold text-white">{totalPosts}/{totalTargetPosts}</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-white/50">Best Streak</span>
                    <span className="text-sm font-semibold text-white">🔥 {bestStreak} days</span>
                </div>
                {neglectedCount > 0 && (
                    <>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-400" />
                            <span className="text-sm font-semibold text-rose-400">{neglectedCount} {neglectedCount === 1 ? 'business needs' : 'businesses need'} attention</span>
                        </div>
                    </>
                )}
            </div>

            {/* Business cards */}
            <main className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 max-w-7xl mx-auto">
                    {MOCK_BUSINESSES.map(b => <BusinessCard key={b.id} b={b} />)}
                </div>
            </main>
        </div>
    );
}
