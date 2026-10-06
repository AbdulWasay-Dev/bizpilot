'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useState, useMemo } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';
import type { InventoryItem } from '@/lib/data';
import {
    Plus, TrendingUp, ArrowDownLeft, Receipt, X, Search,
    Package, Globe, CheckCircle2, ChevronRight,
    ShoppingBag, Tag, CreditCard, Zap, Layers,
    DollarSign, ArrowUpRight, ArrowDownRight, BarChart2, Clock, AlertCircle
} from 'lucide-react';

// ─── KPI Tile ────────────────────────────────────────────────────────────────
function KpiTile({ label, value, sub, icon: Icon, danger }: {
    label: string; value: string; sub?: string; icon: any; danger?: boolean;
}) {
    return (
        <div className="card p-5 flex items-start gap-4 animate-fade-up">
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: danger ? 'var(--red-bg)' : 'var(--fill-2)' }}>
                <Icon className="w-5 h-5" style={{ color: danger ? 'var(--red)' : 'var(--text-secondary)' }} />
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
            </div>
        </div>
    );
}

// ─── Expense category config ──────────────────────────────────────────────────
const EXPENSE_CATS = [
    { id: 'COGS', label: 'Cost of Goods', icon: Package },
    { id: 'MARKETING', label: 'Marketing / Ads', icon: Zap },
    { id: 'SAAS', label: 'SaaS / Tools', icon: Layers },
    { id: 'VENDOR', label: 'Vendor Payment', icon: ShoppingBag },
    { id: 'OVERHEAD', label: 'Overhead', icon: CreditCard },
    { id: 'OTHER', label: 'Other', icon: Tag },
];

// ─── Sale Panel ───────────────────────────────────────────────────────────────
function LogSalePanel({ businessId, inventory, onClose, addTransaction, updateInventoryItem }: {
    businessId: string; inventory: InventoryItem[]; onClose: () => void;
    addTransaction: (t: any) => void; updateInventoryItem: (id: string, u: any) => void;
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
        setSelected(item); setSalePrice(String(item.price)); setStep('confirm');
    };

    const submit = () => {
        if (!selected) return;
        const price = parseFloat(salePrice) || selected.price;
        const ref = customRef.trim() || `ORD-${Date.now().toString().slice(-5)}`;
        addTransaction({ businessId, type: 'SALE', description: selected.title, amount: price, date: new Date().toISOString().split('T')[0], ref, channel, inventoryItemId: selected.id, note });
        updateInventoryItem(selected.id, { status: 'SOLD' });
        onClose();
    };

    const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm transition-all input";

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 panel-backdrop" onClick={onClose} />
            <div className="w-[520px] flex flex-col shadow-2xl animate-fade-up" style={{ background: 'var(--bg-base)', borderLeft: '1px solid var(--border)' }}>
                <div className="h-14 px-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-2">
                        {step === 'confirm' && (
                            <button onClick={() => setStep('pick')} className="p-1 rounded-lg hover:bg-black/5 transition-colors">
                                <ChevronRight className="w-4 h-4 rotate-180" style={{ color: 'var(--text-muted)' }} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {step === 'pick' ? 'Log Sale — Select Product' : `Confirm: ${selected?.title}`}
                            </h2>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {step === 'pick' ? `${available.length} available` : `SKU: ${selected?.sku}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/5 transition-colors"><X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                </div>

                {step === 'pick' ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'var(--fill-1)', border: '1px solid var(--border)' }}>
                                <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
                                    className="bg-transparent text-sm flex-1 focus:outline-none" style={{ color: 'var(--text-primary)' }} />
                                {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /></button>}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <Package className="w-10 h-10 mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No available products</p>
                                </div>
                            ) : filtered.map(item => {
                                const margin = item.price > 0 ? ((item.price - item.cost) / item.price * 100).toFixed(0) : 0;
                                return (
                                    <button key={item.id} onClick={() => selectProduct(item)}
                                        className="w-full text-left card card-hover p-4 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--fill-2)' }}>
                                                {item.productType === 'digital' ? <Globe className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} /> : <Package className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                                                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sku} · {item.vendor}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${Number(item.price).toFixed(2)}</p>
                                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{margin}% margin</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-5 space-y-5">
                        {/* Selected recap */}
                        <div className="card p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--text-secondary)' }} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selected?.title}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected?.sku} · {selected?.vendor}</p>
                            </div>
                            <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>${Number(selected?.price).toFixed(2)}</p>
                        </div>

                        {/* Price override */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Sale Price</label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                                <input type="number" step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)}
                                    className="w-full rounded-xl pl-8 pr-4 py-3 text-lg font-bold focus:outline-none input" style={{ color: 'var(--text-primary)' }} />
                            </div>
                            {selected && parseFloat(salePrice) !== selected.price && (
                                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--red)' }}>
                                    <AlertCircle className="w-3 h-3" /> Price differs from default ${Number(selected.price).toFixed(2)}
                                </p>
                            )}
                        </div>

                        {/* Channel */}
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Sale Channel</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Direct', 'WhatsApp', 'Instagram', 'Website', 'Marketplace', 'Other'].map(ch => (
                                    <button key={ch} type="button" onClick={() => setChannel(ch)}
                                        className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${channel === ch ? '' : ''}`}
                                        style={{
                                            background: channel === ch ? 'var(--text-primary)' : 'var(--fill-1)',
                                            color: channel === ch ? '#fff' : 'var(--text-secondary)',
                                            borderColor: channel === ch ? 'var(--text-primary)' : 'var(--border)',
                                        }}>
                                        {ch}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Order Reference</label>
                            <input value={customRef} onChange={e => setCustomRef(e.target.value)} placeholder="Auto-generated if blank" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Note</label>
                            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Customer name, details…" className={inputCls + " resize-none"} />
                        </div>

                        {/* Profit preview */}
                        {selected && (
                            <div className="card p-4 grid grid-cols-3 gap-3 text-center">
                                {[
                                    { label: 'Revenue', val: `$${parseFloat(salePrice || '0').toFixed(2)}` },
                                    { label: 'Cost', val: `-$${Number(selected.cost).toFixed(2)}` },
                                    { label: 'Profit', val: `$${(parseFloat(salePrice || '0') - Number(selected.cost)).toFixed(2)}` },
                                ].map(m => (
                                    <div key={m.label}>
                                        <p className="text-[10px] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                                        <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{m.val}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 'confirm' && (
                    <div className="p-4 border-t shrink-0 space-y-2" style={{ borderColor: 'var(--border)' }}>
                        <button onClick={submit} className="btn-primary w-full py-3 flex items-center justify-center gap-2 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" /> Confirm Sale & Mark Sold
                        </button>
                        <button onClick={onClose} className="btn-secondary w-full py-2 rounded-xl text-xs">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Expense Panel ────────────────────────────────────────────────────────────
function AddExpensePanel({ businessId, inventory, vendors, onClose, addTransaction }: {
    businessId: string; inventory: InventoryItem[]; vendors: any[];
    onClose: () => void; addTransaction: (t: any) => void;
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
        const linkedItem = bizInventory.find(i => i.id === linkedInventoryId);
        const linkedVendor = bizVendors.find((v: any) => v.id === linkedVendorId);
        const desc = description.trim() || (linkedItem ? `COGS: ${linkedItem.title}` : linkedVendor ? `Payment to ${linkedVendor.name}` : `${category} Expense`);
        addTransaction({ businessId, type: 'EXPENSE', description: desc, amount: -(Math.abs(parseFloat(amount))), date: new Date().toISOString().split('T')[0], ref: expRef, channel: channel || category, inventoryItemId: linkedInventoryId, note });
        onClose();
    };

    const inputCls = "input w-full rounded-xl";

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 panel-backdrop" onClick={onClose} />
            <div className="w-[500px] flex flex-col shadow-2xl animate-fade-up" style={{ background: 'var(--bg-base)', borderLeft: '1px solid var(--border)' }}>
                <div className="h-14 px-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Add Expense</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-black/5 transition-colors"><X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Category cards */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-3" style={{ color: 'var(--text-muted)' }}>Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {EXPENSE_CATS.map(cat => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button key={cat.id} type="button" onClick={() => { setCategory(cat.id); setChannel(cat.label); }}
                                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all"
                                        style={{
                                            background: isSelected ? 'var(--text-primary)' : 'var(--fill-1)',
                                            borderColor: isSelected ? 'var(--text-primary)' : 'var(--border)',
                                            color: isSelected ? '#fff' : 'var(--text-secondary)',
                                        }}>
                                        <Icon className="w-4 h-4 shrink-0" />
                                        <span className="text-xs font-semibold">{cat.label}</span>
                                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Link inventory */}
                    {(category === 'COGS' || category === 'VENDOR') && bizInventory.length > 0 && (
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Link Inventory Item</label>
                            <div className="space-y-1 max-h-36 overflow-y-auto">
                                <button type="button" onClick={() => setLinkedInventoryId(null)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors"
                                    style={{ background: !linkedInventoryId ? 'var(--fill-3)' : 'var(--fill-1)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                                    No link
                                </button>
                                {bizInventory.map(item => (
                                    <button key={item.id} type="button" onClick={() => { setLinkedInventoryId(item.id); if (!amount) setAmount(String(item.cost)); }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors"
                                        style={{ background: linkedInventoryId === item.id ? 'var(--fill-3)' : 'var(--fill-1)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                                        <span className="font-medium">{item.title}</span>
                                        <span className="ml-2" style={{ color: 'var(--text-muted)' }}>Cost: ${Number(item.cost).toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vendor chips */}
                    {bizVendors.length > 0 && (
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>Vendor Paid</label>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setLinkedVendorId(null)}
                                    className="px-3 py-1.5 rounded-lg text-xs border transition-colors"
                                    style={{ background: !linkedVendorId ? 'var(--fill-3)' : 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                    None
                                </button>
                                {bizVendors.map((v: any) => (
                                    <button key={v.id} type="button" onClick={() => setLinkedVendorId(v.id)}
                                        className="px-3 py-1.5 rounded-lg text-xs border transition-colors"
                                        style={{ background: linkedVendorId === v.id ? 'var(--text-primary)' : 'var(--fill-1)', borderColor: linkedVendorId === v.id ? 'var(--text-primary)' : 'var(--border)', color: linkedVendorId === v.id ? '#fff' : 'var(--text-secondary)' }}>
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amount */}
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount *</label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: 'var(--text-muted)' }}>$</span>
                            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                                className="input w-full rounded-xl pl-8 pr-4 py-3 text-lg font-bold" style={{ color: 'var(--text-primary)' }} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Auto-filled if blank" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Reference</label>
                            <input value={ref} onChange={e => setRef(e.target.value)} placeholder="INV-0001 (auto)" className={inputCls} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Channel</label>
                            <input value={channel} onChange={e => setChannel(e.target.value)} placeholder="e.g. COGS, SaaS" className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Note</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Additional context…" className={inputCls + " resize-none"} />
                    </div>
                </div>

                <div className="p-4 border-t shrink-0 space-y-2" style={{ borderColor: 'var(--border)' }}>
                    <button onClick={submit} disabled={!category || !amount}
                        className="btn-destructive w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-40">
                        Record Expense
                    </button>
                    <button onClick={onClose} className="btn-secondary w-full py-2 rounded-xl text-xs">Cancel</button>
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
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

    const salesByDay = useMemo(() => {
        const days: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date(); d.setDate(d.getDate() - i);
            days[d.toISOString().split('T')[0]] = 0;
        }
        bizTx.filter(t => t.type === 'SALE').forEach(t => { if (days[t.date] !== undefined) days[t.date] += t.amount; });
        return { data: Object.values(days), labels: Object.keys(days).map(k => new Date(k).toLocaleDateString('en', { weekday: 'short' })) };
    }, [bizTx]);
    const maxBar = Math.max(...salesByDay.data, 1);

    const txCfg: Record<string, { icon: any; label: string; isPositive: boolean }> = {
        SALE:    { icon: ArrowUpRight,   label: 'Sale',    isPositive: true },
        EXPENSE: { icon: ArrowDownRight, label: 'Expense', isPositive: false },
        RETURN:  { icon: ArrowDownLeft,  label: 'Return',  isPositive: false },
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <header className="sticky top-0 z-20 h-16 px-8 flex items-center justify-between border-b glass" style={{ borderColor: 'var(--border)' }}>
                <div>
                    <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Financial Ledger</h1>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <UniversalDashboardButton />
                    <button onClick={() => setExpenseOpen(true)} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                    <button onClick={() => setSaleOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
                        <ShoppingBag className="w-4 h-4" /> Log Sale
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-5">

                {/* KPI tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiTile label="Gross Sales" value={`$${grossSales.toFixed(2)}`} sub="Before returns" icon={TrendingUp} />
                    <KpiTile label="Returns" value={`$${Math.abs(returnsTotal).toFixed(2)}`} sub="Deducted from revenue" icon={ArrowDownLeft} danger={returnsTotal < 0} />
                    <KpiTile label="Expenses" value={`$${Math.abs(expensesTotal).toFixed(2)}`} sub="COGS + Overheads" icon={Receipt} danger />
                    <KpiTile label="Net Profit" value={`$${netProfit.toFixed(2)}`} sub={`${margin}% margin`} icon={DollarSign} danger={netProfit < 0} />
                </div>

                {/* 7-day chart */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Sales — Last 7 Days</h2>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>${salesByDay.data.reduce((a, b) => a + b, 0).toFixed(2)} total</span>
                    </div>
                    <div className="flex items-end gap-2 h-20">
                        {salesByDay.data.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full rounded-t-sm transition-all duration-500 hover:opacity-80"
                                    style={{ height: `${Math.max((val / maxBar) * 64, val > 0 ? 4 : 0)}px`, background: 'var(--fill-3)' }}
                                    title={`$${val.toFixed(2)}`} />
                                <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{salesByDay.labels[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick-sale strip */}
                {inventory.filter(i => i.businessId === businessId && i.status === 'AVAILABLE').length > 0 && (
                    <div className="card p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                <Zap className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> Quick Sale
                            </h2>
                            <button onClick={() => setSaleOpen(true)} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                All products <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {inventory.filter(i => i.businessId === businessId && i.status === 'AVAILABLE').slice(0, 6).map(item => (
                                <button key={item.id} onClick={() => setSaleOpen(true)}
                                    className="shrink-0 card card-hover p-3 text-left w-40 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--fill-2)' }}>
                                        <Package className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                    </div>
                                    <p className="text-xs font-semibold line-clamp-2" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                                    <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>${Number(item.price).toFixed(2)}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Transaction log */}
                <div className="card overflow-hidden">
                    <div className="px-6 py-4 border-b space-y-3" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Transaction Log</h2>
                            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--fill-1)' }}>
                                {(['ALL', 'SALE', 'EXPENSE', 'RETURN'] as const).map(f => (
                                    <button key={f} onClick={() => setTxFilter(f)}
                                        className="px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all"
                                        style={{
                                            background: txFilter === f ? 'var(--bg-card)' : 'transparent',
                                            color: txFilter === f ? 'var(--text-primary)' : 'var(--text-muted)',
                                            boxShadow: txFilter === f ? 'var(--shadow-sm)' : 'none',
                                        }}>
                                        {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase() + 's'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'var(--fill-1)', border: '1px solid var(--border)' }}>
                            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…"
                                className="bg-transparent text-xs flex-1 focus:outline-none" style={{ color: 'var(--text-primary)' }} />
                            {search && <button onClick={() => setSearch('')}><X className="w-3 h-3" style={{ color: 'var(--text-muted)' }} /></button>}
                        </div>
                    </div>

                    <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                        {filtered.length === 0 ? (
                            <div className="px-6 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No transactions found.</div>
                        ) : filtered.map(tx => {
                            const cfg = txCfg[tx.type] || txCfg.EXPENSE;
                            const Icon = cfg.icon;
                            const linkedItem = inventory.find(i => (i as any).id === (tx as any).inventoryItemId);
                            return (
                                <div key={tx.id} className="px-6 py-4 flex items-center gap-4 transition-colors hover:bg-black/[0.02]">
                                    <div className="p-2 rounded-xl shrink-0" style={{ background: 'var(--fill-2)' }}>
                                        <Icon className="w-4 h-4" style={{ color: cfg.isPositive ? 'var(--text-secondary)' : 'var(--red)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{tx.description}</p>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                                                <Clock className="w-2.5 h-2.5" />{tx.date}
                                            </span>
                                            <span style={{ color: 'var(--border-strong)' }}>·</span>
                                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tx.ref}</span>
                                            <span style={{ color: 'var(--border-strong)' }}>·</span>
                                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tx.channel}</span>
                                            {linkedItem && (
                                                <>
                                                    <span style={{ color: 'var(--border-strong)' }}>·</span>
                                                    <span className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                                                        <Package className="w-2.5 h-2.5" />{linkedItem.title}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-base font-bold shrink-0" style={{ color: tx.amount > 0 ? 'var(--text-primary)' : 'var(--red)' }}>
                                        {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {saleOpen && <LogSalePanel businessId={businessId} inventory={inventory} onClose={() => setSaleOpen(false)} addTransaction={addTransaction} updateInventoryItem={updateInventoryItem} />}
            {expenseOpen && <AddExpensePanel businessId={businessId} inventory={inventory} vendors={vendors} onClose={() => setExpenseOpen(false)} addTransaction={addTransaction} />}
        </div>
    );
}
