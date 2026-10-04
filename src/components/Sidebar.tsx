'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Home, Calendar, Package, DollarSign, Brain, Lightbulb, ChevronDown } from 'lucide-react';

const globalNavItems = [
    { label: 'Command Center', href: '/', icon: Home },
];

const workspaceNavItems = [
    { label: 'Content Studio', href: '/content/calendar', icon: Calendar },
    { label: 'Inventory & Vendors', href: '/inventory', icon: Package },
    { label: 'Financial Ledger', href: '/finance', icon: DollarSign },
    { label: 'Decision Log', href: '/decisions', icon: Brain },
    { label: 'Idea Vault', href: '/ideas', icon: Lightbulb },
];

export function Sidebar() {
    const pathname = usePathname();
    const params = useParams();
    const businessId = params.businessId as string | undefined;

    return (
        <aside className="w-64 flex-shrink-0 bg-[#0D1117] border-r border-white/[0.06] flex flex-col">
            {/* Workspace Selector */}
            <div className="h-20 flex items-center px-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between w-full p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                            {businessId ? businessId.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white text-sm font-semibold tracking-tight leading-tight">
                                {businessId ? `Workspace ${businessId}` : 'Global View'}
                            </span>
                            <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
                                BizPilot
                            </span>
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/40" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-6">
                
                {/* Global Links */}
                <div>
                    <div className="px-3 mb-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Overview</div>
                    <div className="space-y-1">
                        {globalNavItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                        ${isActive
                                            ? 'bg-white/10 text-white'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Workspace Links */}
                {businessId && (
                    <div>
                        <div className="px-3 mb-2 text-[10px] font-semibold text-white/40 uppercase tracking-wider">Workspace</div>
                        <div className="space-y-1">
                            {workspaceNavItems.map((item) => {
                                const fullHref = `/${businessId}${item.href}`;
                                const isActive = pathname?.startsWith(fullHref);
                                
                                return (
                                    <Link
                                        key={item.href}
                                        href={fullHref}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                            ${isActive
                                                ? 'bg-indigo-500/10 text-indigo-400'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Bottom User */}
            <div className="p-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-semibold">
                        AW
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">Abdul Wasay</p>
                        <p className="text-slate-500 text-xs">Owner</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
