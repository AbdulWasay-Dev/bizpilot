'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import {
    LayoutDashboard, Globe, Calendar, Package, DollarSign,
    Brain, Lightbulb, ChevronDown, Settings, Check, Plus, Lock
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

export function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const router = useRouter();
    const [switcherOpen, setSwitcherOpen] = useState(false);
    
    const { businesses, setActiveModal } = useApp();

    // Active workspace identity is always a business
    const activeBusinessId = (params?.businessId as string) || businesses[0]?.id;
    const currentBusiness = businesses.find(b => b.id === activeBusinessId) || businesses[0];

    if (!currentBusiness) return null; // Fallback if no businesses

    const isNeglected = currentBusiness.metrics.neglectScore < 50;
    const neglectedCount = businesses.filter(b => b.metrics.neglectScore < 50).length;

    // Switch business while preserving the current submodule if possible
    const handleSwitchBusiness = (newBusinessId: string) => {
        setSwitcherOpen(false);
        if (!pathname) {
            router.push(`/${newBusinessId}`);
            return;
        }

        if (pathname.includes('/universal')) {
            router.push(`/${newBusinessId}/universal`);
        } else if (pathname.includes('/content')) {
            router.push(`/${newBusinessId}/content`);
        } else if (pathname.includes('/inventory')) {
            router.push(`/${newBusinessId}/inventory`);
        } else if (pathname.includes('/finance')) {
            router.push(`/${newBusinessId}/finance`);
        } else if (pathname.includes('/decisions')) {
            router.push(`/${newBusinessId}/decisions`);
        } else if (pathname.includes('/ideas')) {
            router.push(`/${newBusinessId}/ideas`);
        } else {
            router.push(`/${newBusinessId}`);
        }
    };

    const navItems = [
        {
            label: 'Universal Dashboard',
            href: `/${activeBusinessId}/universal`,
            icon: Globe,
            accent: 'text-indigo-400',
            badge: `${businesses.length} Biz`,
            alertCount: neglectedCount > 0 ? neglectedCount : undefined,
            isActive: pathname?.endsWith('/universal') || false,
        },
        {
            label: 'Local Dashboard',
            href: `/${activeBusinessId}`,
            icon: LayoutDashboard,
            accent: 'text-blue-400',
            isActive: pathname === `/${activeBusinessId}`,
        },
        {
            label: 'Content Studio',
            href: `/${activeBusinessId}/content`,
            icon: Calendar,
            accent: 'text-pink-400',
            isActive: pathname?.includes(`/${activeBusinessId}/content`) || false,
        },
        {
            label: 'Inventory & Vendors',
            href: `/${activeBusinessId}/inventory`,
            icon: Package,
            accent: 'text-cyan-400',
            isActive: pathname?.includes(`/${activeBusinessId}/inventory`) || false,
        },
        {
            label: 'Financial Ledger',
            href: `/${activeBusinessId}/finance`,
            icon: DollarSign,
            accent: 'text-emerald-400',
            isActive: pathname?.includes(`/${activeBusinessId}/finance`) || false,
        },
        {
            label: 'Decision Log',
            href: `/${activeBusinessId}/decisions`,
            icon: Brain,
            accent: 'text-violet-400',
            isActive: pathname?.includes(`/${activeBusinessId}/decisions`) || false,
        },
        {
            label: 'Idea Vault',
            href: `/${activeBusinessId}/ideas`,
            icon: Lightbulb,
            accent: 'text-amber-400',
            isActive: pathname?.includes(`/${activeBusinessId}/ideas`) || false,
        },
        {
            label: 'Account Vault',
            href: `/${activeBusinessId}/vault`,
            icon: Lock,
            accent: 'text-rose-400',
            isActive: pathname?.includes(`/${activeBusinessId}/vault`) || false,
        },
    ];

    return (
        <aside className="w-64 shrink-0 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col h-screen sticky top-0 z-20">
            {/* Business Workspace Switcher Header */}
            <div className="relative p-3 border-b border-white/[0.06]">
                <button
                    onClick={() => setSwitcherOpen(!switcherOpen)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group text-left"
                >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentBusiness.color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                        {currentBusiness.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <p className="text-white text-sm font-semibold tracking-tight truncate">
                                {currentBusiness.name}
                            </p>
                            <span className={`w-1.5 h-1.5 rounded-full ${isNeglected ? 'bg-rose-500' : 'bg-emerald-500'} shrink-0`} />
                        </div>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Active Workspace</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-200 ${switcherOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Workspace Switcher Dropdown */}
                {switcherOpen && (
                    <div className="absolute top-full left-3 right-3 mt-1.5 bg-[#161616] border border-white/10 rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden backdrop-blur-xl">
                        <div className="px-3 py-2 border-b border-white/[0.06]">
                            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Switch Workspace</p>
                        </div>

                        {/* List of Businesses (Workspaces) */}
                        <div className="p-1 space-y-0.5">
                            {businesses.map(b => {
                                const isSelected = b.id === activeBusinessId;
                                const bNeglected = b.metrics.neglectScore < 50;
                                return (
                                    <button
                                        key={b.id}
                                        onClick={() => handleSwitchBusiness(b.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${isSelected ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70 hover:text-white'}`}
                                    >
                                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm`}>
                                            {b.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-medium truncate">{b.name}</span>
                                                <span className={`w-1.5 h-1.5 rounded-full ${bNeglected ? 'bg-rose-500' : 'bg-emerald-500'} shrink-0`} />
                                            </div>
                                            <span className="text-[10px] text-white/40 truncate block">${b.metrics.revenueMonth.toLocaleString()} /mo</span>
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-1 border-t border-white/[0.06]">
                            <button
                                onClick={() => { setSwitcherOpen(false); setActiveModal('ADD_BUSINESS'); }}
                                className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create New Workspace</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation items for the current workspace */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                <div className="px-3 pt-2 pb-1">
                    <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
                        {currentBusiness.name} Navigation
                    </p>
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                            item.isActive
                                ? 'bg-white/10 text-white font-semibold shadow-sm'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <item.icon className={`w-4 h-4 shrink-0 ${item.isActive ? item.accent : 'text-white/40'}`} />
                            <span className="truncate">{item.label}</span>
                        </div>

                        {item.alertCount ? (
                            <span className="flex items-center gap-1 bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded-full font-semibold shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                {item.alertCount} alert
                            </span>
                        ) : item.badge ? (
                            <span className="text-[10px] font-medium text-white/30 bg-white/5 px-1.5 py-0.5 rounded-md shrink-0">
                                {item.badge}
                            </span>
                        ) : null}
                    </Link>
                ))}
            </nav>

            {/* Bottom — Settings & Profile */}
            <div className="p-3 border-t border-white/[0.06] space-y-1">
                <Link
                    href={`/${activeBusinessId}/settings`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <Settings className="w-3.5 h-3.5 text-white/40" />
                    <span>Workspace Settings</span>
                </Link>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xs font-semibold shrink-0">
                        AW
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-white text-xs font-medium truncate leading-tight">Abdul Wasay</p>
                        <p className="text-white/40 text-[10px] leading-tight">Portfolio Owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
