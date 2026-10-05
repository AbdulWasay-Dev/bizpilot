'use client';

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
    TrendingUp, Package, Image as ImageIcon, Flame, AlertCircle,
    ChevronRight, Plus, ArrowUpRight, DollarSign, PenTool,
    Clock, CheckCircle2, Bell, Sparkles, Filter, ExternalLink,
    LayoutDashboard, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function TargetBar({ current, target }: { current: number; target: number }) {
    const pct = Math.min(100, Math.round((current / target) * 100));
    const color = pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-400' : 'bg-rose-500';
    return (
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
        </div>
    );
}

function StatusBadge({ current, target }: { current: number; target: number }) {
    const pct = Math.round((current / target) * 100);
    if (pct >= 100) return <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">🏆 Exceeded</span>;
    if (pct >= 60) return <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">🟡 At Risk</span>;
    return <span className="text-[10px] font-semibold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">🔴 Behind</span>;
}

export default function UniversalDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const { businesses, setActiveModal } = useApp();
    const activeBusinessId = (params?.businessId as string) || businesses[0]?.id;
    const currentBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0];

    if (!currentBusiness) return null;

    const totalRevenue = businesses.reduce((s, b) => s + b.metrics.revenueMonth, 0);
    const totalPosts = businesses.reduce((s, b) => s + b.metrics.postsWeek, 0);
    const totalTargetPosts = businesses.reduce((s, b) => s + b.metrics.targetPostsWeek, 0);
    const totalItemsSold = businesses.reduce((s, b) => s + b.metrics.itemsSold, 0);
    const bestStreak = Math.max(...businesses.map(b => b.metrics.streak));
    const neglectedBusinesses = businesses.filter(b => b.metrics.neglectScore < 50);

    const [notificationFilter, setNotificationFilter] = useState<'all' | 'alerts' | 'milestones'>('all');

    const notifications = [
        {
            id: 'n1',
            businessId: 'techgear',
            businessName: 'TechGear',
            color: 'from-blue-500 to-indigo-500',
            type: 'alert',
            title: 'Neglect Alert: 0 posts recorded this week',
            detail: 'Target is 5 posts/week. Last activity was recorded 4 days ago. Audience engagement is at risk.',
            time: '2 hours ago',
            actionText: 'Open TechGear Workspace',
            actionHref: '/techgear/content',
        },
        {
            id: 'n2',
            businessId: 'fitness-pro',
            businessName: 'Fitness Pro',
            color: 'from-emerald-400 to-teal-500',
            type: 'milestone',
            title: 'Goal Achieved: 100% weekly content delivered',
            detail: '5 of 5 planned posts published. Posting streak extended to 11 consecutive days!',
            time: '5 hours ago',
            actionText: 'View Fitness Pro',
            actionHref: '/fitness-pro',
        },
        {
            id: 'n3',
            businessId: 'glow-skincare',
            businessName: 'Glow Skincare',
            color: 'from-pink-500 to-rose-500',
            type: 'alert',
            title: 'Inventory Notice: Low stock on key item',
            detail: 'Vitamin C Brightening Serum has dropped below reorder threshold (14 units remaining).',
            time: '1 day ago',
            actionText: 'Check Inventory',
            actionHref: '/glow-skincare/inventory',
        },
    ];

    const filteredNotifications = notifications.filter(n => {
        if (notificationFilter === 'alerts') return n.type === 'alert';
        if (notificationFilter === 'milestones') return n.type === 'milestone';
        return true;
    });

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Top Workspace & Dashboard Navigation Bar */}
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Workspace:</span>
                            <span className="text-xs font-semibold text-white/90 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                {currentBusiness.name}
                            </span>
                        </div>
                        <h1 className="text-base font-semibold text-white leading-tight flex items-center gap-2 mt-0.5">
                            <Globe className="w-4 h-4 text-indigo-400" />
                            Universal Dashboard
                        </h1>
                    </div>

                    {/* View Switcher: Toggle between Universal and Local Dashboard */}
                    <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex items-center ml-4">
                        <button
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 text-white shadow-sm transition-all"
                        >
                            <Globe className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Universal (All Biz)</span>
                        </button>
                        <button
                            onClick={() => router.push(`/${activeBusinessId}`)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Local ({currentBusiness.name})</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveModal('ADD_POST')}
                        className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:text-white hover:bg-indigo-500/20 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" /> Quick Post
                    </button>
                    <button
                        onClick={() => setActiveModal('LOG_SALE')}
                        className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:text-white hover:bg-emerald-500/20 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                        <DollarSign className="w-3.5 h-3.5" /> Log Sale
                    </button>
                </div>
            </header>

            {/* Global Summary Strip */}
            <div className="bg-[#111] border-b border-white/[0.06] px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] text-white/40 uppercase font-semibold block leading-tight">Total Revenue (MTD)</span>
                            <span className="text-base font-bold text-white leading-tight">${totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden sm:block" />

                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] text-white/40 uppercase font-semibold block leading-tight">Posts This Week</span>
                            <span className="text-base font-bold text-white leading-tight">
                                {totalPosts} <span className="text-xs text-white/40 font-normal">/ {totalTargetPosts} target</span>
                            </span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden sm:block" />

                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                            <Flame className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] text-white/40 uppercase font-semibold block leading-tight">Top Streak</span>
                            <span className="text-base font-bold text-white leading-tight">🔥 {bestStreak} days</span>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-white/10 hidden sm:block" />

                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                            <Package className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] text-white/40 uppercase font-semibold block leading-tight">Items Sold</span>
                            <span className="text-base font-bold text-white leading-tight">{totalItemsSold} units</span>
                        </div>
                    </div>
                </div>

                {neglectedBusinesses.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{neglectedBusinesses.length} {neglectedBusinesses.length === 1 ? 'business needs' : 'businesses need'} attention</span>
                    </div>
                )}
            </div>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Cross-Business Notifications & Attention Feed */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-indigo-400" />
                            <h2 className="text-sm font-semibold text-white">Universal Notifications & Neglect Alerts</h2>
                            <span className="text-[10px] font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                                {notifications.length} events
                            </span>
                        </div>

                        {/* Filter pills */}
                        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg">
                            <button
                                onClick={() => setNotificationFilter('all')}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${notificationFilter === 'all' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setNotificationFilter('alerts')}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${notificationFilter === 'alerts' ? 'bg-rose-500/20 text-rose-300' : 'text-white/40 hover:text-white'}`}
                            >
                                Alerts ({notifications.filter(n => n.type === 'alert').length})
                            </button>
                            <button
                                onClick={() => setNotificationFilter('milestones')}
                                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${notificationFilter === 'milestones' ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/40 hover:text-white'}`}
                            >
                                Milestones ({notifications.filter(n => n.type === 'milestone').length})
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredNotifications.map(n => (
                            <div
                                key={n.id}
                                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                                    n.type === 'alert'
                                        ? 'bg-rose-500/[0.04] border-rose-500/20 hover:border-rose-500/30'
                                        : 'bg-emerald-500/[0.04] border-emerald-500/20 hover:border-emerald-500/30'
                                }`}
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${n.color} flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm`}>
                                        {n.businessName.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-semibold text-white">{n.businessName}</span>
                                            <span className="text-white/20">•</span>
                                            <span className="text-[11px] text-white/40">{n.time}</span>
                                            {n.type === 'alert' && (
                                                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-400 bg-rose-400/10 px-1.5 py-0.2 rounded">
                                                    Action Required
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm font-semibold text-white/90 mt-0.5">{n.title}</p>
                                        <p className="text-xs text-white/50 mt-0.5">{n.detail}</p>
                                    </div>
                                </div>

                                <Link
                                    href={n.actionHref}
                                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white shrink-0 self-start sm:self-center transition-colors"
                                >
                                    <span>{n.actionText}</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Businesses Portfolio Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-semibold text-white">Business Workspaces Portfolio</h2>
                            <p className="text-xs text-white/40">Select any business to enter its dedicated workspace or perform quick actions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {businesses.map(b => {
                            const isNeglected = b.metrics.neglectScore < 50;
                            const isCurrent = b.id === activeBusinessId;
                            const pctPosts = Math.round((b.metrics.postsWeek / b.metrics.targetPostsWeek) * 100);

                            return (
                                <div
                                    key={b.id}
                                    className={`bg-[#141414] border rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/70 ${
                                        isCurrent
                                            ? 'border-indigo-500/40 ring-1 ring-indigo-500/20'
                                            : isNeglected
                                            ? 'border-rose-500/30'
                                            : 'border-white/[0.06]'
                                    }`}
                                >
                                    {/* Card Header */}
                                    <div className="p-5 flex items-center justify-between gap-3 border-b border-white/[0.04]">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg`}>
                                                {b.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="text-base font-semibold text-white truncate">{b.name}</h3>
                                                    {isCurrent && (
                                                        <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isNeglected ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                    <span className="text-xs text-white/40">{b.metrics.lastActivity}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/${b.id}`}
                                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors shrink-0"
                                        >
                                            <span>Open</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>

                                    {/* KPI Grid */}
                                    <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                                        <div>
                                            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3 text-emerald-400" /> Revenue (MTD)
                                            </p>
                                            <p className="text-xl font-bold text-white">${b.metrics.revenueMonth.toLocaleString()}</p>
                                            <p className="text-[10px] text-white/40 mt-0.5">
                                                {Math.round((b.metrics.revenueMonth / totalRevenue) * 100)}% of total
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Package className="w-3 h-3 text-cyan-400" /> Items Sold
                                            </p>
                                            <p className="text-xl font-bold text-white">{b.metrics.itemsSold}</p>
                                            <p className="text-[10px] text-white/40 mt-0.5">Total units</p>
                                        </div>

                                        <div className="col-span-2 space-y-1.5 pt-1 border-t border-white/[0.04]">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
                                                    <ImageIcon className="w-3 h-3 text-pink-400" /> Posts This Week
                                                </span>
                                                <StatusBadge current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-white">
                                                <span className="font-semibold">{b.metrics.postsWeek} / {b.metrics.targetPostsWeek} target</span>
                                                <span className="text-white/40">{pctPosts}%</span>
                                            </div>
                                            <TargetBar current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                        </div>

                                        <div className="col-span-2 flex items-center justify-between pt-1 border-t border-white/[0.04]">
                                            <span className="text-xs text-white/40 flex items-center gap-1">
                                                <Flame className="w-3.5 h-3.5 text-orange-400" /> Streak
                                            </span>
                                            <span className="text-xs font-semibold text-white">
                                                {b.metrics.streak > 0 ? `🔥 ${b.metrics.streak} days` : <span className="text-rose-400">0 days</span>}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Neglect Warning */}
                                    {isNeglected && (
                                        <div className="mx-5 mb-4 px-3 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2">
                                            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-rose-400 leading-tight">
                                                {b.metrics.postsWeek === 0 ? 'No posts recorded this week.' : 'Significantly behind target.'} Needs focus.
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick action buttons */}
                                    <div className="mt-auto border-t border-white/[0.06] grid grid-cols-3 bg-white/[0.01]">
                                        <Link
                                            href={`/${b.id}/content`}
                                            className="flex flex-col items-center gap-1 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors border-r border-white/[0.06]"
                                        >
                                            <PenTool className="w-3.5 h-3.5 text-pink-400" />
                                            <span className="text-[9px] font-semibold uppercase tracking-wider">Post</span>
                                        </Link>
                                        <Link
                                            href={`/${b.id}/finance`}
                                            className="flex flex-col items-center gap-1 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors border-r border-white/[0.06]"
                                        >
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-[9px] font-semibold uppercase tracking-wider">Sale</span>
                                        </Link>
                                        <Link
                                            href={`/${b.id}`}
                                            className="flex flex-col items-center gap-1 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors"
                                        >
                                            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-400" />
                                            <span className="text-[9px] font-semibold uppercase tracking-wider">Workspace</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Cross-Business Content Radar & Revenue Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Content Radar */}
                    <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-pink-400" />
                                Cross-Business Content Consistency Radar
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {businesses.map(b => {
                                const pct = Math.round((b.metrics.postsWeek / b.metrics.targetPostsWeek) * 100);
                                return (
                                    <div key={b.id} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${b.color}`} />
                                                <span className="font-semibold text-white">{b.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white/60">{b.metrics.postsWeek} / {b.metrics.targetPostsWeek} posts</span>
                                                <StatusBadge current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                            </div>
                                        </div>
                                        <TargetBar current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Revenue Contribution Breakdown */}
                    <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                                Revenue Contribution Distribution
                            </h2>
                            <span className="text-xs font-semibold text-white">${totalRevenue.toLocaleString()} Total</span>
                        </div>

                        {/* Multi-segment progress bar */}
                        <div className="w-full h-3 rounded-full overflow-hidden flex bg-white/5 mb-4">
                            {businesses.map(b => {
                                const pct = (b.metrics.revenueMonth / totalRevenue) * 100;
                                return (
                                    <div
                                        key={b.id}
                                        style={{ width: `${pct}%` }}
                                        className={`h-full bg-gradient-to-r ${b.color} transition-all`}
                                        title={`${b.name}: $${b.metrics.revenueMonth.toLocaleString()} (${Math.round(pct)}%)`}
                                    />
                                );
                            })}
                        </div>

                        <div className="space-y-2.5">
                            {businesses.map(b => {
                                const pct = Math.round((b.metrics.revenueMonth / totalRevenue) * 100);
                                return (
                                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/[0.02]">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded bg-gradient-to-br ${b.color}`} />
                                            <span className="text-white font-medium">{b.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-white/50">{pct}% share</span>
                                            <span className="font-semibold text-white">${b.metrics.revenueMonth.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
