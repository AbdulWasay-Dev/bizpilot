'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Calendar, Package, DollarSign,
    Brain, Lightbulb, ChevronDown, Home, Settings,
    Check
} from 'lucide-react';
import { useState } from 'react';
import { MOCK_BUSINESSES } from '@/contexts/AppContext';

const workspaceNavItems = [
    { label: 'Dashboard', href: '', icon: LayoutDashboard, accent: 'text-indigo-400' },
    { label: 'Content Studio', href: '/content', icon: Calendar, accent: 'text-pink-400' },
    { label: 'Inventory & Vendors', href: '/inventory', icon: Package, accent: 'text-cyan-400' },
    { label: 'Financial Ledger', href: '/finance', icon: DollarSign, accent: 'text-emerald-400' },
    { label: 'Decision Log', href: '/decisions', icon: Brain, accent: 'text-indigo-400' },
    { label: 'Idea Vault', href: '/ideas', icon: Lightbulb, accent: 'text-amber-400' },
];

export function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const businessId = params.businessId as string | undefined;
    const [switcherOpen, setSwitcherOpen] = useState(false);

    const currentBusiness = MOCK_BUSINESSES.find(b => b.id === businessId);

    const isGlobal = !businessId;

    return (
        <aside className="w-60 shrink-0 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col h-screen sticky top-0 z-20">

            {/* Workspace Switcher */}
            <div className="relative p-3 border-b border-white/[0.06]">
                <button
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentBusiness?.color ?? 'from-slate-600 to-slate-700'} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                        {currentBusiness ? currentBusiness.name.charAt(0) : 'G'}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                        <p className="text-white text-sm font-semibold tracking-tight truncate">
                            {currentBusiness?.name ?? 'Global View'}
                        </p>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">BizPilot</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${switcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {switcherOpen && (
                    <div className="absolute top-full left-3 right-3 mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
                        {/* Global option */}
                        <button
                            onClick={() => { router.push('/'); setSwitcherOpen(false); }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                <Home className="w-3.5 h-3.5 text-white/70" />
                            </div>
                            <span className="text-sm font-medium text-white/80 flex-1 text-left">Universal Dashboard</span>
                            {isGlobal && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </button>

                        <div className="h-px bg-white/[0.06] mx-3" />

                        {/* Business list */}
                        {MOCK_BUSINESSES.map(b => (
                            <button
                                key={b.id}
                                onClick={() => { router.push(`/${b.id}`); setSwitcherOpen(false); }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors"
                            >
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                                    {b.name.charAt(0)}
                                </div>
                                <span className="text-sm font-medium text-white/80 flex-1 text-left truncate">{b.name}</span>
                                {businessId === b.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {/* Global link always visible */}
                <Link
                    href="/"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                        isGlobal
                            ? 'bg-white/10 text-white'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Home className="w-4 h-4" />
                    Universal Dashboard
                </Link>

                {/* Workspace-specific nav */}
                {businessId && (
                    <>
                        <div className="pt-4 pb-1 px-3">
                            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Workspace</p>
                        </div>
                        {workspaceNavItems.map(item => {
                            const fullHref = `/${businessId}${item.href}`;
                            const isActive = item.href === ''
                                ? pathname === `/${businessId}`
                                : pathname?.startsWith(fullHref);
                            return (
                                <Link
                                    key={item.href}
                                    href={fullHref}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? item.accent : ''}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Bottom — Settings + User */}
            <div className="p-3 border-t border-white/[0.06] space-y-1">
                <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                </Link>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-semibold">
                        AW
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">Abdul Wasay</p>
                        <p className="text-white/40 text-xs">Owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
