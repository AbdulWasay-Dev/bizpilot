'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useState, useMemo } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';
import type { InventoryItem } from '@/lib/data';
import {
    Plus, TrendingUp, ArrowDownLeft, Receipt, X, Search,
    Package, Globe, CheckCircle2, ChevronRight, ExternalLink,
    ShoppingBag, Tag, CreditCard, Zap, Layers, AlertCircle,
    DollarSign, ArrowUpRight, ArrowDownRight, BarChart2, Clock
} from 'lucide-react';

// ─── KPI Tile ────────────────────────────────────────────────────────────────
function KpiTile({ label, value, sub, color, icon: Icon }: {
    label: string; value: string; sub?: string; color: string; icon: any;
}) {
    return (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5 flex items-start gap-4">
            <div className={`p-2.5 rounded-xl ${color} shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Expense category config ──────────────────────────────────────────────────
const EXPENSE_CATS = [
    { id: 'COGS', label: 'Cost of Goods', icon: Package, color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
    { id: 'MARKETING', label: 'Marketing / Ads', icon: Zap, color: 'bg-pink-500/15 text-pink-400 border-pink-500/25' },
    { id: 'SAAS', label: 'SaaS / Tools', icon: Layers, color: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
    { id: 'VENDOR', label: 'Vendor Payment', icon: ShoppingBag, color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    { id: 'OVERHEAD', label: 'Overhead', icon: CreditCard, color: 'bg-white/10 text-white/60 border-white/10' },
    { id: 'OTHER', label: 'Other', icon: Tag, color: 'bg-white/5 text-white/40 border-white/5' },
];

// ─── Sale Panel ───────────────────────────────────────────────────────────────
function LogSalePanel({ businessId, inventory, onClose, addTransaction, updateInventoryItem }: {
    businessId: string;
    inventory: InventoryItem[];
    onClose: () => void;
    addTransaction: (t: any) => void;
    updateInventoryItem: (id: string, u: any) => void;
}) {
    const available = inventory.filter(i => i.businessId === businessId && i.status === 'AVAILABLE');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<InventoryItem | null>(null);
    const [salePrice, setSalePrice] = useState('');
    const [channel, setChannel] = useState('Direct');
    const [note, setNote] = useState('');
    const [customRef, setCustomRef] = useState('');
    const [step, setStep] = useState<'pick' | 'confirm'>('pick');

    const filtered = available.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase()) ||
        i.vendor.toLowerCase().includes(search.toLowerCase())
    );

    const selectProduct = (item: InventoryItem) => {
        setSelected(item);
        setSalePrice(String(item.price));
        setStep('confirm');
    };

    const submit = () => {
        if (!selected) return;
        const price = parseFloat(salePrice) || selected.price;
        const ref = customRef.trim() || `ORD-${Date.now().toString().slice(-5)}`;
        const date = new Date().toISOString().split('T')[0];

        // 1) Log the sale transaction
        addTransaction({
            businessId,
            type: 'SALE',
            description: selected.title,
            amount: price,
            date,
            ref,
            channel,
            inventoryItemId: selected.id,
            note,
        });

        // 2) Mark item sold in inventory
        updateInventoryItem(selected.id, { status: 'SOLD' });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="w-[520px] bg-[#0f0f0f] border-l border-white/10 flex flex-col shadow-2xl">
                {/* Header */}
                <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        {step === 'confirm' && (
                            <button onClick={() => setStep('pick')} className="p-1 text-white/40 hover:text-white">
                                <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                        )}
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                {step === 'pick' ? 'Log a Sale — Select Product' : `Confirm Sale: ${selected?.title}`}
                            </h2>
                            <p className="text-[10px] text-white/40">{step === 'pick' ? `${available.length} items available` : `SKU: ${selected?.sku}`}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {step === 'pick' ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-white/[0.05]">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5">
                                <Search className="w-4 h-4 text-white/30 shrink-0" />
                                <input
                                    autoFocus
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search available products..."
                                    className="bg-transparent text-sm text-white placeholder-white/25 flex-1 focus:outline-none"
                                />
                                {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-white/30" /></button>}
                            </div>
                        </div>

                        {/* Product cards */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <Package className="w-10 h-10 text-white/10 mb-3" />
                                    <p className="text-white/40 text-sm">No available products</p>
                                    <p className="text-white/25 text-xs mt-1">Add stock from the Inventory page</p>
                                </div>
                            ) : filtered.map(item => {
                                const margin = item.price > 0 ? ((item.price - item.cost) / item.price * 100).toFixed(0) : 0;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => selectProduct(item)}
                                        className="w-full text-left bg-[#1a1a1a] hover:bg-[#1f1f1f] border border-white/[0.06] hover:border-emerald-500/30 rounded-2xl p-4 transition-all group"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.productType === 'digital' ? 'bg-cyan-500/10' : 'bg-violet-500/10'}`}>
                                                {item.productType === 'digital' ? <Globe className="w-5 h-5 text-cyan-400" /> : <Package className="w-5 h-5 text-violet-400" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">{item.title}</p>
                                                <p className="text-xs text-white/40 mt-0.5">{item.sku} · {item.category} · from {item.vendor}</p>
                                                {item.tags && item.tags.length > 0 && (
                                                    <div className="flex gap-1 mt-1.5">
                                                        {item.tags.slice(0, 3).map(t => (
                                                            <span key={t} className="text-[9px] text-indigo-400/70 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">#{t}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-base font-bold text-white">${Number(item.price).toFixed(2)}</p>
                                                <p className="text-[10px] text-emerald-400">{margin}% margin</p>
                                                <p className="text-[10px] text-white/30">Cost: ${Number(item.cost).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Confirm sale step */
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {/* Selected product recap */}
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white">{selected?.title}</p>
                                <p className="text-xs text-white/40">{selected?.sku} · {selected?.vendor}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-base font-bold text-emerald-400">${Number(selected?.price).toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Sale price override */}
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">
                                Sale Price (override if discounted)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={salePrice}
                                    onChange={e => setSalePrice(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-emerald-500/50"
                                />
                            </div>
                            {selected && parseFloat(salePrice) !== selected.price && (
                                <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {parseFloat(salePrice) < selected.price ? 'Discounted from' : 'Premium over'} default ${Number(selected.price).toFixed(2)}
                                </p>
                            )}
                        </div>

                        {/* Sale channel — card picker */}
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Sale Channel</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Direct', 'WhatsApp', 'Instagram', 'Website', 'Marketplace', 'Other'].map(ch => (
                                    <button
                                        key={ch}
                                        type="button"
                                        onClick={() => setChannel(ch)}
                                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                                            channel === ch
                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                : 'bg-white/5 text-white/50 border-white/8 hover:text-white hover:bg-white/8'
                                        }`}
                                    >
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Order ref */}
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Order Reference (Optional)</label>
                            <input
                                value={customRef}
                                onChange={e => setCustomRef(e.target.value)}
                                placeholder="e.g. ORD-1234 (auto-generated if blank)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>

                        {/* Note */}
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Note (Optional)</label>
                            <textarea
                                value={note}
                                onChange={e => setNote(e.target.value)}
                                rows={2}
                                placeholder="Customer name, extra details..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 resize-none"
                            />
                        </div>

                        {/* Profit preview */}
                        {selected && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase mb-1">Revenue</p>
                                    <p className="text-base font-bold text-white">${parseFloat(salePrice || '0').toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase mb-1">Cost</p>
                                    <p className="text-base font-bold text-rose-400">-${Number(selected.cost).toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase mb-1">Profit</p>
                                    <p className={`text-base font-bold ${parseFloat(salePrice || '0') - Number(selected.cost) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        ${(parseFloat(salePrice || '0') - Number(selected.cost)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                {step === 'confirm' && (
                    <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
                        <button
                            onClick={submit}
                            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" /> Confirm Sale & Mark Sold
                        </button>
                        <button onClick={onClose} className="w-full py-2 border border-white/10 text-white/40 hover:text-white rounded-xl text-xs transition-colors">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Expense Panel ────────────────────────────────────────────────────────────
function AddExpensePanel({ businessId, inventory, vendors, onClose, addTransaction }: {
    businessId: string;
    inventory: InventoryItem[];
    vendors: any[];
    onClose: () => void;
    addTransaction: (t: any) => void;
}) {
    const [category, setCategory] = useState<string | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [channel, setChannel] = useState('');
    const [ref, setRef] = useState('');
    const [linkedInventoryId, setLinkedInventoryId] = useState<string | null>(null);
    const [linkedVendorId, setLinkedVendorId] = useState<string | null>(null);
    const [note, setNote] = useState('');

    const bizVendors = vendors.filter((v: any) => v.businessId === businessId);
    const bizInventory = inventory.filter(i => i.businessId === businessId);

    const submit = () => {
        if (!category || !amount) return;
        const expRef = ref.trim() || `EXP-${Date.now().toString().slice(-5)}`;
        const date = new Date().toISOString().split('T')[0];
        const linkedItem = bizInventory.find(i => i.id === linkedInventoryId);
        const linkedVendor = bizVendors.find((v: any) => v.id === linkedVendorId);
        const desc = description.trim() || (linkedItem ? `COGS: ${linkedItem.title}` : linkedVendor ? `Payment to ${linkedVendor.name}` : `${category} Expense`);

        addTransaction({
            businessId,
            type: 'EXPENSE',
            description: desc,
            amount: -(Math.abs(parseFloat(amount))),
            date,
            ref: expRef,
            channel: channel || category,
            inventoryItemId: linkedInventoryId,
            note,
        });
        onClose();
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-rose-500/50";

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="w-[500px] bg-[#0f0f0f] border-l border-white/10 flex flex-col shadow-2xl">
                <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
                    <h2 className="text-sm font-semibold text-white">Add Expense</h2>
                    <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5"><X className="w-4 h-4" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Category picker — large cards */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-3">Expense Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {EXPENSE_CATS.map(cat => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => { setCategory(cat.id); setChannel(cat.label); }}
                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
                                            isSelected ? cat.color + ' shadow-lg' : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/5 hover:text-white/80'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="text-xs font-semibold">{cat.label}</span>
                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Link to inventory item (for COGS) */}
                    {(category === 'COGS' || category === 'VENDOR') && bizInventory.length > 0 && (
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Link to Inventory Item (Optional)</label>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                <button
                                    type="button"
                                    onClick={() => setLinkedInventoryId(null)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors ${!linkedInventoryId ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : 'border-white/[0.05] bg-white/[0.02] text-white/40 hover:text-white/60'}`}
                                >
                                    No link
                                </button>
                                {bizInventory.map(item => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => { setLinkedInventoryId(item.id); if (!amount) setAmount(String(item.cost)); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-colors ${linkedInventoryId === item.id ? 'border-rose-500/30 bg-rose-500/10 text-white' : 'border-white/[0.05] bg-white/[0.02] text-white/50 hover:text-white/80 hover:bg-white/[0.04]'}`}
                                    >
                                        <span className="font-medium">{item.title}</span>
                                        <span className="text-white/40 ml-2">Cost: ${Number(item.cost).toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Link to vendor */}
                    {bizVendors.length > 0 && (
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-2">Vendor Paid (Optional)</label>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setLinkedVendorId(null)}
                                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${!linkedVendorId ? 'border-rose-500/30 bg-rose-500/10 text-rose-400' : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60'}`}>
                                    None
                                </button>
                                {bizVendors.map((v: any) => (
                                    <button key={v.id} type="button" onClick={() => setLinkedVendorId(v.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${linkedVendorId === v.id ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60'}`}>
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Amount *</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-rose-500/50"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Description (Optional)</label>
                        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Auto-filled from category/item if blank" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Reference</label>
                            <input value={ref} onChange={e => setRef(e.target.value)} placeholder="INV-0001 (auto)" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Channel / Tag</label>
                            <input value={channel} onChange={e => setChannel(e.target.value)} placeholder="e.g. COGS, SaaS" className={inputCls} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5">Note</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Additional context..." className={inputCls + " resize-none"} />
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
                    <button
                        onClick={submit}
                        disabled={!category || !amount}
                        className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-rose-500/20"
                    >
                        Record Expense
                    </button>
                    <button onClick={onClose} className="w-full py-2 border border-white/10 text-white/40 hover:text-white rounded-xl text-xs transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Finance Page ────────────────────────────────────────────────────────
export default function FinanceLedger() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, transactions, inventory, vendors, addTransaction, updateInventoryItem } = useApp();
    const business = businesses.find(b => b.id === businessId);

    const [saleOpen, setSaleOpen] = useState(false);
    const [expenseOpen, setExpenseOpen] = useState(false);
    const [txFilter, setTxFilter] = useState<'ALL' | 'SALE' | 'EXPENSE' | 'RETURN'>('ALL');
    const [search, setSearch] = useState('');

    const bizTx = transactions.filter(t => t.businessId === businessId);

    const grossSales = bizTx.filter(t => t.type === 'SALE').reduce((s, t) => s + t.amount, 0);
    const returnsTotal = bizTx.filter(t => t.type === 'RETURN').reduce((s, t) => s + t.amount, 0);
    const expensesTotal = bizTx.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    const netRevenue = grossSales + returnsTotal;
    const netProfit = netRevenue + expensesTotal;
    const margin = netRevenue > 0 ? Math.round((netProfit / netRevenue) * 100) : 0;

    const filtered = bizTx
        .filter(t => txFilter === 'ALL' || t.type === txFilter)
        .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()) || t.ref?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.date.localeCompare(a.date));

    // Recent sales in chart data (last 7 days)
    const salesByDay = useMemo(() => {
        const days: Record<string, number> = {};
        const labels: string[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            const label = d.toLocaleDateString('en', { weekday: 'short' });
            days[key] = 0;
            labels.push(label);
        }
        bizTx.filter(t => t.type === 'SALE').forEach(t => {
            if (days[t.date] !== undefined) days[t.date] += t.amount;
        });
        return { data: Object.values(days), labels: Object.keys(days).map(k => new Date(k).toLocaleDateString('en', { weekday: 'short' })) };
    }, [bizTx]);

    const maxBar = Math.max(...salesByDay.data, 1);

    const txIconConfig: Record<string, { icon: any; color: string; bg: string }> = {
        SALE: { icon: ArrowUpRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        EXPENSE: { icon: ArrowDownRight, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        RETURN: { icon: ArrowDownLeft, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-white">Financial Ledger</h1>
                    <p className="text-[11px] text-white/40">{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button
                        onClick={() => setExpenseOpen(true)}
                        className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                    <button
                        onClick={() => setSaleOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20"
                    >
                        <ShoppingBag className="w-4 h-4" /> Log Sale
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-6">

                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiTile label="Gross Sales" value={`$${grossSales.toFixed(2)}`} sub="Before returns" color="bg-emerald-500/10 text-emerald-400" icon={TrendingUp} />
                    <KpiTile label="Returns" value={`$${Math.abs(returnsTotal).toFixed(2)}`} sub="Deducted from revenue" color="bg-amber-500/10 text-amber-400" icon={ArrowDownLeft} />
                    <KpiTile label="Total Expenses" value={`$${Math.abs(expensesTotal).toFixed(2)}`} sub="COGS + Overheads" color="bg-rose-500/10 text-rose-400" icon={Receipt} />
                    <KpiTile label="Net Profit" value={`$${netProfit.toFixed(2)}`} sub={`${margin}% margin`} color={netProfit >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"} icon={DollarSign} />
                </div>

                {/* 7-day sales sparkline */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-emerald-400" />
                            <h2 className="text-sm font-semibold text-white">Sales — Last 7 Days</h2>
                        </div>
                        <span className="text-xs text-white/40">${salesByDay.data.reduce((a, b) => a + b, 0).toFixed(2)} total</span>
                    </div>
                    <div className="flex items-end gap-2 h-20">
                        {salesByDay.data.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full relative">
                                    <div
                                        className="w-full bg-emerald-500/20 rounded-t-sm transition-all duration-500 hover:bg-emerald-500/40 cursor-default"
                                        style={{ height: `${Math.max((val / maxBar) * 64, val > 0 ? 4 : 0)}px` }}
                                        title={`$${val.toFixed(2)}`}
                                    />
                                </div>
                                <span className="text-[9px] text-white/30">{salesByDay.labels[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick-add inventory sale row */}
                {inventory.filter(i => i.businessId === businessId && i.status === 'AVAILABLE').length > 0 && (
                    <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Zap className="w-4 h-4 text-amber-400" /> Quick Sale — Available Products
                            </h2>
                            <button onClick={() => setSaleOpen(true)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                See all <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {inventory.filter(i => i.businessId === businessId && i.status === 'AVAILABLE').slice(0, 6).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setSaleOpen(true)}
                                    className="shrink-0 bg-[#1a1a1a] hover:bg-emerald-500/10 border border-white/[0.06] hover:border-emerald-500/30 rounded-xl p-3 text-left transition-all w-40 group"
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${item.productType === 'digital' ? 'bg-cyan-500/10' : 'bg-violet-500/10'}`}>
                                        {item.productType === 'digital' ? <Globe className="w-4 h-4 text-cyan-400" /> : <Package className="w-4 h-4 text-violet-400" />}
                                    </div>
                                    <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">{item.title}</p>
                                    <p className="text-xs font-bold text-white mt-1">${Number(item.price).toFixed(2)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transaction Log */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
                    {/* Log header + filters */}
                    <div className="px-6 py-4 border-b border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-white">Transaction Log</h2>
                            <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                                {(['ALL', 'SALE', 'EXPENSE', 'RETURN'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setTxFilter(f)}
                                        className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${txFilter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                                    >
                                        {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase() + 's'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2">
                            <Search className="w-3.5 h-3.5 text-white/30 shrink-0" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search transactions..."
                                className="bg-transparent text-xs text-white placeholder-white/20 flex-1 focus:outline-none"
                            />
                            {search && <button onClick={() => setSearch('')}><X className="w-3 h-3 text-white/30" /></button>}
                        </div>
                    </div>

                    <div className="divide-y divide-white/[0.04]">
                        {filtered.length === 0 ? (
                            <div className="px-6 py-10 text-center text-white/30 text-sm">No transactions found.</div>
                        ) : filtered.map(tx => {
                            const cfg = txIconConfig[tx.type] || txIconConfig.EXPENSE;
                            const Icon = cfg.icon;
                            const linkedItem = inventory.find(i => (i as any).id === (tx as any).inventoryItemId);
                            return (
                                <div key={tx.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.015] transition-colors group">
                                    <div className={`p-2 rounded-xl shrink-0 ${cfg.bg}`}>
                                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-[10px] text-white/30 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{tx.date}</span>
                                            <span className="text-white/20">·</span>
                                            <span className="text-[10px] text-white/30">{tx.ref}</span>
                                            <span className="text-white/20">·</span>
                                            <span className="text-[10px] text-white/30">{tx.channel}</span>
                                            {linkedItem && (
                                                <>
                                                    <span className="text-white/20">·</span>
                                                    <span className="text-[10px] text-cyan-400/70 flex items-center gap-1"><Package className="w-2.5 h-2.5" />{linkedItem.title}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-base font-bold shrink-0 ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Panels */}
            {saleOpen && (
                <LogSalePanel
                    businessId={businessId}
                    inventory={inventory}
                    onClose={() => setSaleOpen(false)}
                    addTransaction={addTransaction}
                    updateInventoryItem={updateInventoryItem}
                />
            )}
            {expenseOpen && (
                <AddExpensePanel
                    businessId={businessId}
                    inventory={inventory}
                    vendors={vendors}
                    onClose={() => setExpenseOpen(false)}
                    addTransaction={addTransaction}
                />
            )}
        </div>
    );
}
