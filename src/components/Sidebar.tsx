'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Globe, Calendar, Package, DollarSign,
    Brain, Lightbulb, ChevronDown, Check, Plus, Lock, Settings
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const [switcherOpen, setSwitcherOpen] = useState(false);
    const { businesses, setActiveModal } = useApp();

    const activeBusinessId = (params?.businessId as string) || businesses[0]?.id;
    const currentBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0];
    if (!currentBusiness) return null;

    const isNeglected = currentBusiness.metrics.neglectScore < 50;
    const neglectedCount = businesses.filter(b => b.metrics.neglectScore < 50).length;

    const handleSwitchBusiness = (newBusinessId: string) => {
        setSwitcherOpen(false);
        const segments = ['/universal', '/content', '/inventory', '/finance', '/decisions', '/ideas', '/vault'];
        const matched = segments.find(s => pathname?.includes(s));
        router.push(matched ? `/${newBusinessId}${matched}` : `/${newBusinessId}`);
    };

    const navItems = [
        { label: 'Overview', href: `/${activeBusinessId}/universal`, icon: Globe, badge: `${businesses.length}`, alertCount: neglectedCount > 0 ? neglectedCount : undefined, isActive: pathname?.endsWith('/universal') || false },
        { label: 'Dashboard', href: `/${activeBusinessId}`, icon: LayoutDashboard, isActive: pathname === `/${activeBusinessId}` },
        { label: 'Content Studio', href: `/${activeBusinessId}/content`, icon: Calendar, isActive: pathname?.includes(`/${activeBusinessId}/content`) || false },
        { label: 'Inventory', href: `/${activeBusinessId}/inventory`, icon: Package, isActive: pathname?.includes(`/${activeBusinessId}/inventory`) || false },
        { label: 'Finances', href: `/${activeBusinessId}/finance`, icon: DollarSign, isActive: pathname?.includes(`/${activeBusinessId}/finance`) || false },
        { label: 'Decisions', href: `/${activeBusinessId}/decisions`, icon: Brain, isActive: pathname?.includes(`/${activeBusinessId}/decisions`) || false },
        { label: 'Ideas', href: `/${activeBusinessId}/ideas`, icon: Lightbulb, isActive: pathname?.includes(`/${activeBusinessId}/ideas`) || false },
        { label: 'Account Vault', href: `/${activeBusinessId}/vault`, icon: Lock, isActive: pathname?.includes(`/${activeBusinessId}/vault`) || false },
    ];

    return (
        <aside className="w-60 shrink-0 flex flex-col h-screen sticky top-0 z-20 sidebar-glass">

            {/* Workspace Switcher */}
            <div className="relative p-3 border-b border-black/[0.06]">
                <button
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-black/[0.04] transition-colors text-left"
                >
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                        {currentBusiness.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-[#111] text-sm font-semibold tracking-tight truncate">{currentBusiness.name}</p>
                            {isNeglected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0" />}
                        </div>
                        <p className="text-black/40 text-[10px] uppercase tracking-widest font-medium">Workspace</p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-black/30 shrink-0 transition-transform duration-200 ${switcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Switcher dropdown */}
                {switcherOpen && (
                    <div className="absolute top-full left-3 right-3 mt-1.5 z-50 animate-scale-in"
                        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(0,0,0,0.09)', borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.14)' }}>
                        <div className="px-3 py-2 border-b border-black/[0.05]">
                            <p className="text-[10px] font-semibold text-black/35 uppercase tracking-wider">Switch Workspace</p>
                        </div>
                        <div className="p-1.5 space-y-0.5">
                            {businesses.map(b => {
                                const isSelected = b.id === activeBusinessId;
                                const bNeglected = b.metrics.neglectScore < 50;
                                return (
                                    <button key={b.id} onClick={() => handleSwitchBusiness(b.id)}
                                        className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors text-left ${isSelected ? 'bg-black/[0.06]' : 'hover:bg-black/[0.04]'}`}>
                                        <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                                            {b.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-medium text-[#111] truncate">{b.name}</span>
                                                {bNeglected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] shrink-0" />}
                                            </div>
                                            <span className="text-[10px] text-black/40">${b.metrics.revenueMonth.toLocaleString()}/mo</span>
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-black/50 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-1.5 border-t border-black/[0.05]">
                            <button onClick={() => { setSwitcherOpen(false); setActiveModal('ADD_BUSINESS'); }}
                                className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-black/50 hover:text-black hover:bg-black/[0.04] transition-colors">
                                <Plus className="w-3.5 h-3.5" /> New Workspace
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-2.5 space-y-0.5 overflow-y-auto">
                <p className="px-3 pt-3 pb-1.5 text-[10px] font-semibold text-black/30 uppercase tracking-widest">
                    Navigation
                </p>

                {navItems.map((item) => (
                    <Link key={item.label} href={item.href}
                        className={`relative flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                            item.isActive
                                ? 'bg-white text-[#111] font-semibold shadow-sm border border-black/[0.06]'
                                : 'text-black/55 hover:text-black hover:bg-black/[0.04]'
                        }`}>
                        {item.isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[55%] bg-black rounded-r-full" />}

                        <div className="flex items-center gap-2.5 min-w-0">
                            <item.icon className={`w-4 h-4 shrink-0 ${item.isActive ? 'text-black' : 'text-black/35'}`} />
                            <span className="truncate">{item.label}</span>
                        </div>

                        {item.alertCount ? (
                            <span className="flex items-center gap-1 bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
                                {item.alertCount}
                            </span>
                        ) : item.badge ? (
                            <span className="text-[10px] font-medium text-black/30 bg-black/[0.06] px-1.5 py-0.5 rounded-md shrink-0">
                                {item.badge}
                            </span>
                        ) : null}
                    </Link>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-2.5 border-t border-black/[0.06] space-y-1">
                <Link href={`/${activeBusinessId}/settings`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-black/45 hover:text-black hover:bg-black/[0.04] transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                </Link>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-black/[0.03] border border-black/[0.05]">
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                        AW
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[#111] text-xs font-semibold truncate">Abdul Wasay</p>
                        <p className="text-black/35 text-[10px]">Portfolio Owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
