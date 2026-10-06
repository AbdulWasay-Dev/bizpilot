'use client';

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import {
    TrendingUp, Package, Image as ImageIcon, Flame, AlertCircle,
    ChevronRight, Plus, ArrowUpRight, DollarSign, PenTool,
    Bell, LayoutDashboard, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function TargetBar({ current, target }: { current: number; target: number }) {
    const pct = Math.min(100, Math.round((current / target) * 100));
    const color = pct >= 100 ? '#34C759' : pct >= 60 ? '#FF9500' : '#FF3B30';
    return (
        <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--fill-2)' }}>
            <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

function StatusBadge({ current, target }: { current: number; target: number }) {
    const pct = Math.round((current / target) * 100);
    if (pct >= 100) return <span className="pill pill-success">🏆 Exceeded</span>;
    if (pct >= 60) return <span className="pill pill-warning">🟡 At Risk</span>;
    return <span className="pill pill-danger">🔴 Behind</span>;
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
            id: 'n1', businessId: 'techgear', businessName: 'TechGear', color: 'from-blue-500 to-indigo-500', type: 'alert',
            title: 'Neglect Alert: 0 posts recorded this week', detail: 'Target is 5 posts/week. Last activity was recorded 4 days ago. Audience engagement is at risk.', time: '2 hours ago', actionText: 'Open TechGear Workspace', actionHref: '/techgear/content',
        },
        {
            id: 'n2', businessId: 'fitness-pro', businessName: 'Fitness Pro', color: 'from-emerald-400 to-teal-500', type: 'milestone',
            title: 'Goal Achieved: 100% weekly content delivered', detail: '5 of 5 planned posts published. Posting streak extended to 11 consecutive days!', time: '5 hours ago', actionText: 'View Fitness Pro', actionHref: '/fitness-pro',
        },
        {
            id: 'n3', businessId: 'glow-skincare', businessName: 'Glow Skincare', color: 'from-pink-500 to-rose-500', type: 'alert',
            title: 'Inventory Notice: Low stock on key item', detail: 'Vitamin C Brightening Serum has dropped below reorder threshold (14 units remaining).', time: '1 day ago', actionText: 'Check Inventory', actionHref: '/glow-skincare/inventory',
        },
    ];

    const filteredNotifications = notifications.filter(n => {
        if (notificationFilter === 'alerts') return n.type === 'alert';
        if (notificationFilter === 'milestones') return n.type === 'milestone';
        return true;
    });

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            <header className="sticky top-0 z-20 h-16 px-8 flex items-center justify-between border-b glass" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Workspace:</span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md border" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                {currentBusiness.name}
                            </span>
                        </div>
                        <h1 className="text-base font-semibold leading-tight flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-primary)' }}>
                            <Globe className="w-4 h-4 text-indigo-500" /> Universal Dashboard
                        </h1>
                    </div>

                    <div className="border p-1 rounded-xl flex items-center ml-4" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Universal (All Biz)</span>
                        </button>
                        <button onClick={() => router.push(`/${activeBusinessId}`)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}>
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Local ({currentBusiness.name})</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setActiveModal('ADD_POST')} className="btn-secondary flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5" /> Quick Post
                    </button>
                    <button onClick={() => setActiveModal('LOG_SALE')} className="btn-primary flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" /> Log Sale
                    </button>
                </div>
            </header>

            <div className="border-b px-8 py-3.5 flex flex-wrap items-center justify-between gap-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center gap-6 sm:gap-8 flex-wrap">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600"><TrendingUp className="w-4 h-4" /></div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>Total Revenue (MTD)</span>
                            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${totalRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-600"><ImageIcon className="w-4 h-4" /></div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>Posts This Week</span>
                            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{totalPosts} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>/ {totalTargetPosts}</span></span>
                        </div>
                    </div>
                    <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-600"><Flame className="w-4 h-4" /></div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>Top Streak</span>
                            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>🔥 {bestStreak} days</span>
                        </div>
                    </div>
                    <div className="w-px h-6" style={{ background: 'var(--border)' }} />
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600"><Package className="w-4 h-4" /></div>
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: 'var(--text-muted)' }}>Items Sold</span>
                            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{totalItemsSold} units</span>
                        </div>
                    </div>
                </div>
                {neglectedBusinesses.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30' }}>
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{neglectedBusinesses.length} {neglectedBusinesses.length === 1 ? 'business needs' : 'businesses need'} attention</span>
                    </div>
                )}
            </div>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-indigo-500" />
                            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Universal Notifications</h2>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--fill-1)', color: 'var(--text-secondary)' }}>{notifications.length} events</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 rounded-lg" style={{ background: 'var(--fill-1)' }}>
                            <button onClick={() => setNotificationFilter('all')} className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors`} style={{ background: notificationFilter === 'all' ? 'var(--bg-card)' : 'transparent', color: notificationFilter === 'all' ? 'var(--text-primary)' : 'var(--text-muted)' }}>All</button>
                            <button onClick={() => setNotificationFilter('alerts')} className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors`} style={{ background: notificationFilter === 'alerts' ? 'rgba(255,59,48,0.1)' : 'transparent', color: notificationFilter === 'alerts' ? '#FF3B30' : 'var(--text-muted)' }}>Alerts</button>
                            <button onClick={() => setNotificationFilter('milestones')} className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors`} style={{ background: notificationFilter === 'milestones' ? 'rgba(52,199,89,0.1)' : 'transparent', color: notificationFilter === 'milestones' ? '#34C759' : 'var(--text-muted)' }}>Milestones</button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredNotifications.map(n => (
                            <div key={n.id} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: n.type === 'alert' ? 'rgba(255,59,48,0.03)' : 'rgba(52,199,89,0.03)', borderColor: 'var(--border)' }}>
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${n.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm mt-0.5`}>{n.businessName.charAt(0)}</div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.businessName}</span>
                                            <span style={{ color: 'var(--text-muted)' }}>•</span>
                                            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                                        </div>
                                        <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.detail}</p>
                                    </div>
                                </div>
                                <Link href={n.actionHref} className="btn-secondary flex items-center gap-1.5 text-xs font-semibold shrink-0">
                                    <span>{n.actionText}</span> <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Business Workspaces Portfolio</h2>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Select any business to enter its dedicated workspace or perform quick actions</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {businesses.map(b => {
                            const isNeglected = b.metrics.neglectScore < 50;
                            const isCurrent = b.id === activeBusinessId;
                            const pctPosts = Math.round((b.metrics.postsWeek / b.metrics.targetPostsWeek) * 100);

                            return (
                                <div key={b.id} className={`card flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${isCurrent ? 'border-black' : ''}`} style={{ borderColor: isCurrent ? 'var(--text-primary)' : isNeglected ? '#FF3B30' : 'var(--border)' }}>
                                    <div className="p-5 flex items-center justify-between gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-lg`}>{b.name.charAt(0)}</div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{b.name}</h3>
                                                    {isCurrent && <span className="pill" style={{ background: 'var(--text-primary)', color: 'var(--bg-base)' }}>Current</span>}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isNeglected ? 'bg-red-500' : 'bg-green-500'}`} />
                                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{b.metrics.lastActivity}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href={`/${b.id}`} className="btn-secondary px-2.5 py-1 text-xs shrink-0 flex items-center gap-1">Open <ChevronRight className="w-3.5 h-3.5" /></Link>
                                    </div>
                                    <div className="p-5 grid grid-cols-2 gap-4 flex-1">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><TrendingUp className="w-3 h-3 text-emerald-500" /> Revenue</p>
                                            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>${b.metrics.revenueMonth.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><Package className="w-3 h-3 text-cyan-500" /> Items Sold</p>
                                            <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{b.metrics.itemsSold}</p>
                                        </div>
                                        <div className="col-span-2 space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: 'var(--text-muted)' }}><ImageIcon className="w-3 h-3 text-pink-500" /> Posts</span>
                                                <StatusBadge current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-semibold">
                                                <span style={{ color: 'var(--text-primary)' }}>{b.metrics.postsWeek} / {b.metrics.targetPostsWeek}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>{pctPosts}%</span>
                                            </div>
                                            <TargetBar current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                        </div>
                                    </div>
                                    {isNeglected && (
                                        <div className="mx-5 mb-4 p-2.5 rounded-lg flex items-start gap-2" style={{ background: 'rgba(255,59,48,0.1)' }}>
                                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-red-600 leading-tight">Needs focus. Significantly behind target.</p>
                                        </div>
                                    )}
                                    <div className="mt-auto border-t grid grid-cols-3" style={{ borderColor: 'var(--border)', background: 'var(--fill-1)' }}>
                                        <Link href={`/${b.id}/content`} className="flex flex-col items-center gap-1 py-3 transition-colors border-r hover:bg-black/5" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                            <PenTool className="w-3.5 h-3.5 text-pink-500" /> <span className="text-[9px] font-bold uppercase tracking-wider">Post</span>
                                        </Link>
                                        <Link href={`/${b.id}/finance`} className="flex flex-col items-center gap-1 py-3 transition-colors border-r hover:bg-black/5" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> <span className="text-[9px] font-bold uppercase tracking-wider">Sale</span>
                                        </Link>
                                        <Link href={`/${b.id}`} className="flex flex-col items-center gap-1 py-3 transition-colors hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" /> <span className="text-[9px] font-bold uppercase tracking-wider">Workspace</span>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><ImageIcon className="w-4 h-4 text-pink-500" /> Content Radar</h2>
                        </div>
                        <div className="space-y-4">
                            {businesses.map(b => (
                                <div key={b.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${b.color}`} />
                                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span style={{ color: 'var(--text-muted)' }}>{b.metrics.postsWeek} / {b.metrics.targetPostsWeek}</span>
                                            <StatusBadge current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                        </div>
                                    </div>
                                    <TargetBar current={b.metrics.postsWeek} target={b.metrics.targetPostsWeek} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><TrendingUp className="w-4 h-4 text-emerald-500" /> Revenue Distribution</h2>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>${totalRevenue.toLocaleString()} Total</span>
                        </div>
                        <div className="w-full h-3 rounded-full overflow-hidden flex mb-4" style={{ background: 'var(--fill-2)' }}>
                            {businesses.map(b => {
                                const pct = (b.metrics.revenueMonth / totalRevenue) * 100;
                                return <div key={b.id} style={{ width: `${pct}%` }} className={`h-full bg-gradient-to-r ${b.color}`} />;
                            })}
                        </div>
                        <div className="space-y-2">
                            {businesses.map(b => {
                                const pct = Math.round((b.metrics.revenueMonth / totalRevenue) * 100);
                                return (
                                    <div key={b.id} className="flex items-center justify-between text-xs p-2 rounded-lg" style={{ background: 'var(--fill-1)' }}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded bg-gradient-to-br ${b.color}`} />
                                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span style={{ color: 'var(--text-muted)' }}>{pct}% share</span>
                                            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>${b.metrics.revenueMonth.toLocaleString()}</span>
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
