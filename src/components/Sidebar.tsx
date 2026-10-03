'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Package, DollarSign, Brain, Lightbulb } from 'lucide-react';

const navItems = [
    { label: 'Command Center', href: '/', icon: Home },
    { label: 'Content Studio', href: '/content/calendar', icon: Calendar },
    { label: 'Inventory & Vendors', href: '/inventory', icon: Package },
    { label: 'Financial Ledger', href: '/finance', icon: DollarSign },
    { label: 'Decision Log', href: '/decisions', icon: Brain },
    { label: 'Idea Vault', href: '/ideas', icon: Lightbulb },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 bg-[#0D1117] border-r border-white/[0.06] flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
                <span className="text-white font-semibold text-lg tracking-tight">BizPilot</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    
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
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom User */}
            <div className="p-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                        BP
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">BizPilot</p>
                        <p className="text-slate-500 text-xs">Admin</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
