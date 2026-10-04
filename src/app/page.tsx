import { Plus, MoreHorizontal, ArrowUpRight, AlertCircle, Edit2, Play, DollarSign, PenTool, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

// Mock Data for Phase 1
const businesses = [
    {
        id: '1',
        name: 'Glow Skincare',
        color: 'from-pink-500 to-rose-500',
        textColor: 'text-rose-400',
        metrics: { revenue: 12450.00, salesCount: 142, postsThisWeek: 3, targetScore: 92 },
        lastActivity: '2 hours ago',
        neglected: false,
    },
    {
        id: '2',
        name: 'TechGear',
        color: 'from-blue-500 to-indigo-500',
        textColor: 'text-blue-400',
        metrics: { revenue: 3200.00, salesCount: 12, postsThisWeek: 0, targetScore: 45 },
        lastActivity: '4 days ago',
        neglected: true,
    },
    {
        id: '3',
        name: 'Fitness Pro',
        color: 'from-emerald-400 to-teal-500',
        textColor: 'text-emerald-400',
        metrics: { revenue: 8900.50, salesCount: 89, postsThisWeek: 5, targetScore: 88 },
        lastActivity: '1 day ago',
        neglected: false,
    }
];

export default function CommandCenter() {
    const totalRevenue = businesses.reduce((acc, b) => acc + b.metrics.revenue, 0);
    const totalSales = businesses.reduce((acc, b) => acc + b.metrics.salesCount, 0);
    const neglectedCount = businesses.filter(b => b.neglected).length;

    return (
        <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
            {/* Header / Global Summary Strip */}
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Command Center</h1>
                    <p className="text-sm text-white/50 mt-1">Global workspace overview</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Total Revenue</span>
                        <span className="text-lg font-semibold text-white">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Total Sales</span>
                        <span className="text-lg font-semibold text-white">{totalSales}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors">
                        <Plus className="w-4 h-4" />
                        New Business
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Neglect Detection Engine Banner */}
                {neglectedCount > 0 && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-4">
                        <div className="bg-rose-500/20 p-2 rounded-full mt-0.5">
                            <AlertCircle className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-rose-500 font-semibold text-sm">Attention Required</h3>
                            <p className="text-rose-500/80 text-sm mt-1">
                                {neglectedCount} business{neglectedCount > 1 ? 'es require' : ' requires'} your attention. No posts or sales logged in the last 3 days.
                            </p>
                        </div>
                    </div>
                )}

                {/* Business Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {businesses.map((business) => (
                        <div key={business.id} className="group relative bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl shadow-black/50 flex flex-col">
                            {/* Card Header */}
                            <div className="p-6 pb-4 border-b border-white/5 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${business.color} p-0.5 shadow-inner`}>
                                        <div className="w-full h-full bg-black/20 rounded-[10px] flex items-center justify-center backdrop-blur-sm">
                                            <span className="text-white font-bold text-sm">{business.name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white tracking-tight">{business.name}</h2>
                                        <span className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                                            <span className={`w-1.5 h-1.5 rounded-full ${business.neglected ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                            {business.lastActivity}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-white/40 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Metrics */}
                            <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Revenue</p>
                                    <p className="text-xl font-semibold text-white flex items-center gap-2">
                                        ${business.metrics.revenue.toLocaleString()}
                                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Target Score</p>
                                    <div className="flex items-end gap-2">
                                        <p className={`text-xl font-semibold ${business.metrics.targetScore < 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                            {business.metrics.targetScore}
                                        </p>
                                        <span className="text-sm text-white/40 mb-0.5">/ 100</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Sales (Wk)</p>
                                    <p className="text-base font-medium text-white">{business.metrics.salesCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Posts (Wk)</p>
                                    <p className="text-base font-medium text-white">{business.metrics.postsThisWeek}</p>
                                </div>
                            </div>

                            {/* Quick Action Row */}
                            <div className="mt-auto p-4 bg-white/[0.02] border-t border-white/5 flex gap-2">
                                <button className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors group/btn">
                                    <PenTool className="w-4 h-4 text-white/60 mb-1.5 group-hover/btn:text-white transition-colors" />
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/60 group-hover/btn:text-white">Post Idea</span>
                                </button>
                                <button className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors group/btn">
                                    <DollarSign className="w-4 h-4 text-white/60 mb-1.5 group-hover/btn:text-white transition-colors" />
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/60 group-hover/btn:text-white">Log Sale</span>
                                </button>
                                <button className="flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors group/btn">
                                    <Play className="w-4 h-4 text-white/60 mb-1.5 group-hover/btn:text-white transition-colors" />
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/60 group-hover/btn:text-white">Active</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
