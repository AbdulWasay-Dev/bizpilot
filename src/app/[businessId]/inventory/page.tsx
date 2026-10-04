'use client';

import { useParams } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/contexts/AppContext';
import { Plus, Copy, Star, MessageCircle, ExternalLink, Package, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const mockInventory = [
    { id: '1', title: 'Windows 11 Pro Key', sku: 'WIN11PRO-001', category: 'LICENSE', status: 'AVAILABLE', cost: 4.50, price: 24.99, vendor: 'Alpha Keys', payload: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX' },
    { id: '2', title: 'Office 2024 Home & Business', sku: 'OFF24HB-002', category: 'LICENSE', status: 'AVAILABLE', cost: 18.00, price: 89.00, vendor: 'DevStudio Keys', payload: 'AAAAA-BBBBB-CCCCC-DDDDD-EEEEE' },
    { id: '3', title: 'Adobe CC 1yr Key', sku: 'ADCC1Y-003', category: 'LICENSE', status: 'SOLD', cost: 22.00, price: 45.00, vendor: 'SoftVault', payload: '' },
    { id: '4', title: 'Canva Pro Account', sku: 'CANVAPRO-004', category: 'ACCOUNT', status: 'AVAILABLE', cost: 3.00, price: 15.00, vendor: 'AccSupplier', payload: 'user@example.com / P@ssw0rd' },
    { id: '5', title: 'Notion Template Pack', sku: 'NOTION-TPL-01', category: 'ASSET', status: 'AVAILABLE', cost: 0, price: 12.00, vendor: 'Self-made', payload: 'https://drive.google.com/file/xxx' },
];

const mockVendors = [
    { id: 'v1', name: 'Alpha Keys', rating: 5, whatsapp: 'https://wa.me/123456', telegram: '@alphakeys', notes: '48h replacement warranty' },
    { id: 'v2', name: 'DevStudio Keys', rating: 4, whatsapp: 'https://wa.me/789012', telegram: '@devstudiokeys', notes: 'PayPal only' },
    { id: 'v3', name: 'SoftVault', rating: 3, whatsapp: 'https://wa.me/345678', telegram: '@softvault', notes: 'No warranty on Adobe keys' },
];

const statusColors: Record<string, string> = {
    AVAILABLE: 'text-emerald-400 bg-emerald-400/10',
    SOLD: 'text-white/40 bg-white/5',
    RESERVED: 'text-amber-400 bg-amber-400/10',
    DEFECTIVE: 'text-rose-400 bg-rose-400/10',
};

function StarRating({ n }: { n: number }) {
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= n ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
            ))}
        </div>
    );
}

export default function InventoryPage() {
    const { businessId } = useParams() as { businessId: string };
    const business = MOCK_BUSINESSES.find(b => b.id === businessId);
    const [tab, setTab] = useState<'stock' | 'vendors'>('stock');
    const [masked, setMasked] = useState<Record<string, boolean>>({});

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-white">Inventory & Vendors</h1>
                    <p className="text-[11px] text-white/40">{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-500/20 transition-colors">
                        <Plus className="w-4 h-4" /> Add Stock
                    </button>
                </div>
            </header>

            {/* Summary strip */}
            <div className="bg-[#111] border-b border-white/[0.06] px-8 py-3 flex gap-8">
                {[
                    { label: 'In Stock', value: mockInventory.filter(i => i.status === 'AVAILABLE').length },
                    { label: 'Sold', value: mockInventory.filter(i => i.status === 'SOLD').length },
                    { label: 'Vendors', value: mockVendors.length },
                    { label: 'Stock Value (Cost)', value: `$${mockInventory.filter(i => i.status === 'AVAILABLE').reduce((s, i) => s + i.cost, 0).toFixed(2)}` },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                        <span className="text-xs text-white/40">{s.label}</span>
                        <span className="text-sm font-semibold text-white">{s.value}</span>
                    </div>
                ))}
            </div>

            <main className="p-8 max-w-6xl mx-auto space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
                    {(['stock', 'vendors'] as const).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                            {t === 'stock' ? 'Stock Inventory' : 'Vendor Directory'}
                        </button>
                    ))}
                </div>

                {tab === 'stock' && (
                    <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                            <Search className="w-4 h-4 text-white/30" />
                            <input placeholder="Search inventory..." className="bg-transparent text-sm text-white placeholder-white/30 flex-1 focus:outline-none" />
                        </div>
                        <div className="divide-y divide-white/[0.04]">
                            {mockInventory.map(item => {
                                const margin = ((item.price - item.cost) / item.price * 100).toFixed(0);
                                const isMasked = masked[item.id] !== false;
                                return (
                                    <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-sm font-medium text-white">{item.title}</p>
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[item.status]}`}>{item.status}</span>
                                            </div>
                                            <p className="text-xs text-white/40">{item.sku} · {item.category} · {item.vendor}</p>
                                        </div>
                                        {item.payload && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10 max-w-[140px] truncate">
                                                    {isMasked ? '•••••••••••' : item.payload}
                                                </span>
                                                <button onClick={() => setMasked(p => ({...p, [item.id]: !p[item.id]}))} className="text-xs text-white/40 hover:text-white transition-colors">
                                                    {isMasked ? 'Show' : 'Hide'}
                                                </button>
                                                <button className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-semibold text-white">${item.price.toFixed(2)}</p>
                                            <p className="text-xs text-emerald-400">{margin}% margin</p>
                                        </div>
                                        {item.status === 'AVAILABLE' && (
                                            <button className="shrink-0 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/20 transition-colors">
                                                Sell
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {tab === 'vendors' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mockVendors.map(v => (
                            <div key={v.id} className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-white">{v.name}</h3>
                                        <StarRating n={v.rating} />
                                    </div>
                                    <span className="text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded-full">Vendor</span>
                                </div>
                                <p className="text-xs text-white/50 bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2">{v.notes}</p>
                                <div className="flex gap-2">
                                    <a href={v.whatsapp} target="_blank" rel="noopener" className="flex items-center gap-2 flex-1 py-2 px-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors">
                                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                    </a>
                                    <button className="flex items-center gap-2 flex-1 py-2 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors">
                                        <ExternalLink className="w-3.5 h-3.5" /> Telegram
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button className="bg-[#141414] border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/50 hover:border-white/20 transition-colors cursor-pointer">
                            <Plus className="w-6 h-6" />
                            <span className="text-sm font-medium">Add Vendor</span>
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
