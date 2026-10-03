import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { label: 'Command Center', href: '/dashboard', icon: '🏠' },
    { label: 'Content Studio', href: '/content/calendar', icon: '📅' },
    { label: 'Inventory & Vendors', href: '/inventory', icon: '📦' },
    { label: 'Financial Ledger', href: '/finance', icon: '💰' },
    { label: 'Decision Log', href: '/decisions', icon: '🧠' },
    { label: 'Idea Vault', href: '/ideas', icon: '💡' },
];

export default function AppLayout({ title, children }) {
    const { url } = usePage();

    return (
        <div className="min-h-screen bg-[#0D1117] flex">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#0D1117] border-r border-white/[0.06] flex flex-col">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
                    <span className="text-white font-semibold text-lg tracking-tight">BizPilot</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                                ${url.startsWith(item.href)
                                    ? 'bg-white/10 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/[0.06] flex items-center px-8">
                    <h2 className="text-white/80 text-sm font-medium">{title}</h2>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
