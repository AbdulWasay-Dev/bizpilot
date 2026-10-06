'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useState, useRef } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';
import type { InventoryItem, Vendor, DigitalField } from '@/lib/data';
import {
    Plus, Search, Copy, Eye, EyeOff, Star, MessageCircle, X,
    ExternalLink, Package, Globe, Mail, Instagram, Phone,
    ChevronRight, ChevronDown, Filter, Tag, AlertTriangle,
    MoreVertical, Edit2, Trash2, CheckCircle2, CreditCard, Link
} from 'lucide-react';

// ─── Status helpers ─────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; dot: string; badge: string }> = {
    AVAILABLE: { label: 'Available', dot: 'bg-emerald-500', badge: 'text-emerald-400 bg-emerald-400/10' },
    SOLD: { label: 'Sold', dot: 'bg-white/20', badge: 'text-white/40 bg-white/5' },
    RESERVED: { label: 'Reserved', dot: 'bg-amber-400', badge: 'text-amber-400 bg-amber-400/10' },
    DEFECTIVE: { label: 'Defective', dot: 'bg-rose-500', badge: 'text-rose-400 bg-rose-400/10' },
};

function StarRow({ n, onChange }: { n: number; onChange?: (v: number) => void }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    onClick={() => onChange?.(i)}
                    className={`w-3.5 h-3.5 transition-colors ${i <= n ? 'text-amber-400 fill-amber-400' : 'text-white/20'} ${onChange ? 'cursor-pointer hover:text-amber-300' : ''}`}
                />
            ))}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function InventoryPage() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, inventory, vendors, addInventoryItem, updateInventoryItem, addVendor } = useApp();
    const business = businesses.find(b => b.id === businessId);

    const bizInventory = inventory.filter(i => i.businessId === businessId);
    const bizVendors = vendors.filter(v => v.businessId === businessId);

    const [tab, setTab] = useState<'stock' | 'vendors'>('stock');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [addVendorOpen, setAddVendorOpen] = useState(false);
    const [revealed, setRevealed] = useState<Record<string, boolean>>({});
    const [copied, setCopied] = useState<string | null>(null);

    const copyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    // Filtered inventory
    const filtered = bizInventory.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(search.toLowerCase())
            || item.sku.toLowerCase().includes(search.toLowerCase())
            || item.vendor.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
        const matchType = typeFilter === 'ALL' || item.productType === typeFilter;
        return matchSearch && matchStatus && matchType;
    });

    const totalValue = bizInventory.filter(i => i.status === 'AVAILABLE').reduce((s, i) => s + i.cost * (i.quantity || 1), 0);
    const totalRetail = bizInventory.filter(i => i.status === 'AVAILABLE').reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const availableCount = bizInventory.filter(i => i.status === 'AVAILABLE').reduce((s, i) => s + (i.quantity || 1), 0);
    const soldCount = bizInventory.filter(i => i.status === 'SOLD').reduce((s, i) => s + (i.quantity || 1), 0);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-white">Inventory & Vendors</h1>
                    <p className="text-[11px] text-white/40">{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    {tab === 'stock' ? (
                        <button onClick={() => setAddItemOpen(true)} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/20">
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    ) : (
                        <button onClick={() => setAddVendorOpen(true)} className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-violet-500/20">
                            <Plus className="w-4 h-4" /> Add Vendor
                        </button>
                    )}
                </div>
            </header>

            {/* Stats strip */}
            <div className="bg-[#0d0d0d] border-b border-white/[0.05] px-8 py-3 flex items-center gap-8 overflow-x-auto">
                {[
                    { label: 'In Stock', value: availableCount, color: 'text-emerald-400' },
                    { label: 'Sold Units', value: soldCount, color: 'text-white/60' },
                    { label: 'SKUs', value: bizInventory.length, color: 'text-cyan-400' },
                    { label: 'Vendors', value: bizVendors.length, color: 'text-violet-400' },
                    { label: 'Cost Value', value: `$${totalValue.toFixed(2)}`, color: 'text-white' },
                    { label: 'Retail Value', value: `$${totalRetail.toFixed(2)}`, color: 'text-emerald-400' },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-white/30">{s.label}</span>
                        <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Tabs + Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left: List */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tab bar + filters */}
                    <div className="px-8 pt-5 pb-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                                {(['stock', 'vendors'] as const).map(t => (
                                    <button key={t} onClick={() => { setTab(t); setSelectedItem(null); setSelectedVendor(null); }}
                                        className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                                        {t === 'stock' ? 'Stock Inventory' : 'Vendor Directory'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {tab === 'stock' && (
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5">
                                    <Search className="w-4 h-4 text-white/30 shrink-0" />
                                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU, vendor..." className="bg-transparent text-sm text-white placeholder-white/25 flex-1 focus:outline-none" />
                                    {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5 text-white/30 hover:text-white" /></button>}
                                </div>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                                    className="bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" style={{ colorScheme: 'dark' }}>
                                    <option value="ALL">All Status</option>
                                    <option value="AVAILABLE">Available</option>
                                    <option value="SOLD">Sold</option>
                                    <option value="RESERVED">Reserved</option>
                                    <option value="DEFECTIVE">Defective</option>
                                </select>
                                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                                    className="bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none" style={{ colorScheme: 'dark' }}>
                                    <option value="ALL">All Types</option>
                                    <option value="digital">Digital</option>
                                    <option value="physical">Physical</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Stock list */}
                    {tab === 'stock' && (
                        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-2">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Package className="w-10 h-10 text-white/10 mb-3" />
                                    <p className="text-white/40 text-sm">No items found</p>
                                </div>
                            ) : filtered.map(item => {
                                const sc = STATUS_CFG[item.status] || STATUS_CFG.AVAILABLE;
                                const margin = item.price > 0 ? ((item.price - item.cost) / item.price * 100).toFixed(0) : 0;
                                const isSelected = selectedItem?.id === item.id;
                                const df = item.digitalFields;
                                const sensitiveValue = df?.licenseKey || df?.password || df?.couponCode || df?.downloadUrl || item.payload || '';

                                return (
                                    <div key={item.id}
                                        onClick={() => setSelectedItem(isSelected ? null : item)}
                                        className={`bg-[#141414] border rounded-2xl p-4 cursor-pointer transition-all ${isSelected ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5' : 'border-white/[0.06] hover:border-white/10'}`}>
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.productType === 'digital' ? 'bg-cyan-500/10' : 'bg-violet-500/10'}`}>
                                                {item.productType === 'digital'
                                                    ? <Globe className="w-5 h-5 text-cyan-400" />
                                                    : <Package className="w-5 h-5 text-violet-400" />}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-sm font-semibold text-white">{item.title}</p>
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${sc.badge}`}>{sc.label}</span>
                                                    {item.tags?.slice(0, 2).map(t => (
                                                        <span key={t} className="text-[9px] text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.5 rounded-full">#{t}</span>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-white/40">{item.sku} · {item.category} · {item.vendor}</p>
                                                {item.quantity > 1 && <p className="text-[10px] text-white/30 mt-0.5">Qty: {item.quantity}</p>}
                                            </div>

                                            {/* Sensitive payload pill */}
                                            {sensitiveValue && (
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="font-mono text-xs text-white/40 bg-white/5 border border-white/8 px-2.5 py-1 rounded-lg max-w-[120px] truncate">
                                                        {revealed[item.id] ? sensitiveValue : '••••••••••••'}
                                                    </span>
                                                    <button onClick={e => { e.stopPropagation(); setRevealed(p => ({ ...p, [item.id]: !p[item.id] })); }} className="p-1.5 text-white/30 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                                                        {revealed[item.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button onClick={e => { e.stopPropagation(); copyText(sensitiveValue, item.id); }} className="p-1.5 text-white/30 hover:text-white rounded-md hover:bg-white/5 transition-colors">
                                                        {copied === item.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold text-white">${Number(item.price).toFixed(2)}</p>
                                                <p className="text-[10px] text-emerald-400">{margin}% margin</p>
                                            </div>

                                            <ChevronRight className={`w-4 h-4 text-white/20 shrink-0 mt-0.5 transition-transform ${isSelected ? 'rotate-90 text-cyan-400' : ''}`} />
                                        </div>

                                        {/* Expanded detail */}
                                        {isSelected && (
                                            <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-4">
                                                {item.description && (
                                                    <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                                        <p className="text-[10px] text-white/30 font-bold uppercase mb-1">Description</p>
                                                        <p className="text-xs text-white/70">{item.description}</p>
                                                    </div>
                                                )}

                                                {/* Cost / Price / Qty */}
                                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
                                                    <p className="text-[10px] text-white/30 font-bold uppercase">Financials</p>
                                                    <div className="flex justify-between text-xs"><span className="text-white/50">Cost</span><span className="text-white">${Number(item.cost).toFixed(2)}</span></div>
                                                    <div className="flex justify-between text-xs"><span className="text-white/50">Price</span><span className="text-white">${Number(item.price).toFixed(2)}</span></div>
                                                    <div className="flex justify-between text-xs"><span className="text-white/50">Quantity</span><span className="text-white">{item.quantity}</span></div>
                                                </div>

                                                {/* Attributes */}
                                                {item.attributes && item.attributes.length > 0 && (
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                                        <p className="text-[10px] text-white/30 font-bold uppercase mb-2">Attributes</p>
                                                        {item.attributes.map((a, i) => (
                                                            <div key={i} className="flex justify-between text-xs mb-1">
                                                                <span className="text-white/50">{a.key}</span>
                                                                <span className="text-white">{a.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Digital Fields */}
                                                {item.digitalFields && (
                                                    <div className="col-span-2 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 space-y-2">
                                                        <p className="text-[10px] text-cyan-400 font-bold uppercase">Digital Product Details</p>
                                                        {item.digitalFields.email && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-white/50">Email</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-white font-mono">{item.digitalFields.email}</span>
                                                                    <button onClick={e => { e.stopPropagation(); copyText(item.digitalFields!.email!, item.id + 'email'); }} className="p-1 text-white/30 hover:text-white">
                                                                        {copied === item.id + 'email' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.password && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-white/50">Password</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-white font-mono">{revealed[item.id + 'df'] ? item.digitalFields.password : '••••••••'}</span>
                                                                    <button onClick={e => { e.stopPropagation(); setRevealed(p => ({ ...p, [item.id + 'df']: !p[item.id + 'df'] })); }} className="p-1 text-white/30 hover:text-white">
                                                                        {revealed[item.id + 'df'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                    </button>
                                                                    <button onClick={e => { e.stopPropagation(); copyText(item.digitalFields!.password!, item.id + 'pass'); }} className="p-1 text-white/30 hover:text-white">
                                                                        {copied === item.id + 'pass' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.licenseKey && (
                                                            <div className="flex justify-between items-center text-xs gap-2">
                                                                <span className="text-white/50 shrink-0">License Key</span>
                                                                <div className="flex items-center gap-1 min-w-0">
                                                                    <span className="text-white font-mono truncate">{revealed[item.id + 'lk'] ? item.digitalFields.licenseKey : '•••••-•••••-•••••'}</span>
                                                                    <button onClick={e => { e.stopPropagation(); setRevealed(p => ({ ...p, [item.id + 'lk']: !p[item.id + 'lk'] })); }} className="p-1 text-white/30 hover:text-white shrink-0">
                                                                        {revealed[item.id + 'lk'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                    </button>
                                                                    <button onClick={e => { e.stopPropagation(); copyText(item.digitalFields!.licenseKey!, item.id + 'lk2'); }} className="p-1 text-white/30 hover:text-white shrink-0">
                                                                        {copied === item.id + 'lk2' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.couponCode && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-white/50">Coupon Code</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-white font-mono">{item.digitalFields.couponCode}</span>
                                                                    <button onClick={e => { e.stopPropagation(); copyText(item.digitalFields!.couponCode!, item.id + 'coup'); }} className="p-1 text-white/30 hover:text-white">
                                                                        {copied === item.id + 'coup' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.downloadUrl && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className="text-white/50">Download URL</span>
                                                                <a href={item.digitalFields.downloadUrl} target="_blank" rel="noopener" className="text-cyan-400 hover:underline flex items-center gap-1">
                                                                    Open <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.notes && (
                                                            <div className="pt-2 border-t border-white/5 text-xs text-white/50 italic">{item.digitalFields.notes}</div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Quick actions */}
                                                <div className="col-span-2 flex gap-2">
                                                    {item.status === 'AVAILABLE' && (
                                                        <button onClick={e => { e.stopPropagation(); updateInventoryItem(item.id, { status: 'SOLD' }); }}
                                                            className="flex-1 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl hover:bg-emerald-500/20 transition-colors">
                                                            Mark as Sold
                                                        </button>
                                                    )}
                                                    {item.status === 'AVAILABLE' && (
                                                        <button onClick={e => { e.stopPropagation(); updateInventoryItem(item.id, { status: 'RESERVED' }); }}
                                                            className="flex-1 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-xl hover:bg-amber-500/20 transition-colors">
                                                            Reserve
                                                        </button>
                                                    )}
                                                    {item.status !== 'AVAILABLE' && (
                                                        <button onClick={e => { e.stopPropagation(); updateInventoryItem(item.id, { status: 'AVAILABLE' }); }}
                                                            className="flex-1 py-2 bg-white/5 border border-white/10 text-white/60 text-xs font-semibold rounded-xl hover:bg-white/10 transition-colors">
                                                            Restore to Available
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Vendor grid */}
                    {tab === 'vendors' && (
                        <div className="flex-1 overflow-y-auto px-8 pb-8">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {bizVendors.map(v => (
                                    <div key={v.id} onClick={() => setSelectedVendor(selectedVendor?.id === v.id ? null : v)}
                                        className={`bg-[#141414] border rounded-2xl p-5 cursor-pointer transition-all ${selectedVendor?.id === v.id ? 'border-violet-500/40' : 'border-white/[0.06] hover:border-white/10'}`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-white">{v.name}</h3>
                                                {v.category && <p className="text-xs text-white/40 mt-0.5">{v.category}</p>}
                                            </div>
                                            <StarRow n={v.rating} />
                                        </div>

                                        {v.notes && <p className="text-xs text-white/50 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 mb-3">{v.notes}</p>}

                                        {/* Contact row */}
                                        <div className="flex flex-wrap gap-2">
                                            {v.whatsapp && (
                                                <a href={`https://wa.me/${v.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/20 transition-colors">
                                                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                                </a>
                                            )}
                                            {v.telegram && (
                                                <a href={`https://t.me/${v.telegram.replace('@','')}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors">
                                                    <ExternalLink className="w-3.5 h-3.5" /> {v.telegram}
                                                </a>
                                            )}
                                            {v.email && (
                                                <a href={`mailto:${v.email}`} onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors">
                                                    <Mail className="w-3.5 h-3.5" /> Email
                                                </a>
                                            )}
                                            {v.website && (
                                                <a href={v.website} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded-lg text-xs font-medium hover:bg-white/10 transition-colors">
                                                    <Globe className="w-3.5 h-3.5" /> Website
                                                </a>
                                            )}
                                            {v.instagram && (
                                                <a href={`https://instagram.com/${v.instagram.replace('@','')}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-lg text-xs font-medium hover:bg-pink-500/20 transition-colors">
                                                    <Instagram className="w-3.5 h-3.5" /> {v.instagram}
                                                </a>
                                            )}
                                        </div>

                                        {v.paymentMethods && (
                                            <p className="text-[10px] text-white/30 mt-3 flex items-center gap-1">
                                                <CreditCard className="w-3 h-3" /> {v.paymentMethods}
                                            </p>
                                        )}

                                        {/* Products from this vendor */}
                                        {selectedVendor?.id === v.id && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <p className="text-[10px] font-bold text-white/30 uppercase mb-2">Products from this vendor</p>
                                                {bizInventory.filter(i => i.vendor === v.name).length === 0
                                                    ? <p className="text-xs text-white/30">No products linked</p>
                                                    : bizInventory.filter(i => i.vendor === v.name).map(i => (
                                                        <div key={i.id} className="flex justify-between text-xs py-1.5 border-b border-white/[0.04] last:border-0">
                                                            <span className="text-white/70">{i.title}</span>
                                                            <span className={`font-semibold ${STATUS_CFG[i.status]?.badge || ''}`}>{STATUS_CFG[i.status]?.label}</span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add vendor card */}
                                <button onClick={() => setAddVendorOpen(true)}
                                    className="bg-[#141414] border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/50 hover:border-violet-500/30 transition-colors min-h-[140px]">
                                    <Plus className="w-7 h-7" />
                                    <span className="text-sm font-medium">Add Vendor</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ═══ Add Product Drawer ═══ */}
            {addItemOpen && <AddProductDrawer businessId={businessId} vendors={bizVendors} onClose={() => setAddItemOpen(false)} addInventoryItem={addInventoryItem} />}

            {/* ═══ Add Vendor Drawer ═══ */}
            {addVendorOpen && <AddVendorDrawer businessId={businessId} onClose={() => setAddVendorOpen(false)} addVendor={addVendor} />}
        </div>
    );
}

// ─── Add Product Drawer ───────────────────────────────────────────────────────
function AddProductDrawer({ businessId, vendors, onClose, addInventoryItem }: {
    businessId: string;
    vendors: Vendor[];
    onClose: () => void;
    addInventoryItem: (i: any) => void;
}) {
    const [title, setTitle] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('LICENSE');
    const [productType, setProductType] = useState<'digital' | 'physical'>('digital');
    const [digitalType, setDigitalType] = useState<DigitalField['type']>('license_key');
    const [status, setStatus] = useState('AVAILABLE');
    const [quantity, setQuantity] = useState(1);
    const [cost, setCost] = useState('');
    const [price, setPrice] = useState('');
    const [vendor, setVendor] = useState(vendors[0]?.name || '');
    const [description, setDescription] = useState('');
    const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
    const [newAttrKey, setNewAttrKey] = useState('');
    const [newAttrVal, setNewAttrVal] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    // Digital fields
    const [dfLicenseKey, setDfLicenseKey] = useState('');
    const [dfEmail, setDfEmail] = useState('');
    const [dfPassword, setDfPassword] = useState('');
    const [dfRecovery, setDfRecovery] = useState('');
    const [dfCoupon, setDfCoupon] = useState('');
    const [dfUrl, setDfUrl] = useState('');
    const [dfNotes, setDfNotes] = useState('');

    const addAttr = () => {
        if (newAttrKey.trim()) {
            setAttributes(a => [...a, { key: newAttrKey.trim(), value: newAttrVal.trim() }]);
            setNewAttrKey(''); setNewAttrVal('');
        }
    };

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags(t => [...t, tagInput.trim()]);
            setTagInput('');
        }
    };

    const buildDigitalFields = (): DigitalField => {
        const base: DigitalField = { type: digitalType };
        if (digitalType === 'license_key') base.licenseKey = dfLicenseKey;
        if (digitalType === 'account') { base.email = dfEmail; base.password = dfPassword; base.recoveryEmail = dfRecovery; base.notes = dfNotes; }
        if (digitalType === 'coupon') base.couponCode = dfCoupon;
        if (digitalType === 'download_link') base.downloadUrl = dfUrl;
        if (digitalType === 'other') { base.notes = dfNotes; }
        return base;
    };

    const buildPayload = () => {
        if (digitalType === 'license_key') return dfLicenseKey;
        if (digitalType === 'account') return dfEmail ? `${dfEmail} / ${dfPassword}` : '';
        if (digitalType === 'coupon') return dfCoupon;
        if (digitalType === 'download_link') return dfUrl;
        return '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        addInventoryItem({
            businessId,
            title: title.trim(),
            sku: sku.trim() || `SKU-${Date.now()}`,
            category,
            productType,
            status,
            quantity,
            cost: parseFloat(cost) || 0,
            price: parseFloat(price) || 0,
            vendor,
            description,
            attributes,
            digitalFields: productType === 'digital' ? buildDigitalFields() : undefined,
            payload: productType === 'digital' ? buildPayload() : '',
            tags,
        });
        onClose();
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50";
    const labelCls = "text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="w-[480px] bg-[#0f0f0f] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
                <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
                    <h2 className="text-sm font-semibold text-white">Add Product to Inventory</h2>
                    <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-5">
                    {/* Product Type toggle */}
                    <div>
                        <label className={labelCls}>Product Type</label>
                        <div className="flex gap-2">
                            {(['digital', 'physical'] as const).map(t => (
                                <button key={t} type="button" onClick={() => setProductType(t)}
                                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-colors ${productType === t ? t === 'digital' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40' : 'bg-violet-500/15 text-violet-400 border-violet-500/40' : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Basic info */}
                    <div>
                        <label className={labelCls}>Product Name *</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Canva Pro Account" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>SKU</label>
                            <input value={sku} onChange={e => setSku(e.target.value)} placeholder="Auto-generated" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Category</label>
                            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. LICENSE" className={inputCls} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelCls}>Cost ($)</label>
                            <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Price ($)</label>
                            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Quantity</label>
                            <input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className={inputCls} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Vendor</label>
                            {vendors.length > 0 ? (
                                <select value={vendor} onChange={e => setVendor(e.target.value)} className={inputCls} style={{ colorScheme: 'dark' }}>
                                    {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                    <option value="Self-made">Self-made</option>
                                    <option value="Other">Other…</option>
                                </select>
                            ) : (
                                <input value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Vendor name" className={inputCls} />
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls} style={{ colorScheme: 'dark' }}>
                                <option value="AVAILABLE">Available</option>
                                <option value="RESERVED">Reserved</option>
                                <option value="DEFECTIVE">Defective</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Brief product description..." className={inputCls + " resize-none"} />
                    </div>

                    {/* Digital product fields */}
                    {productType === 'digital' && (
                        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 space-y-4">
                            <div>
                                <label className={labelCls}>Digital Type</label>
                                <select value={digitalType} onChange={e => setDigitalType(e.target.value as DigitalField['type'])} className={inputCls} style={{ colorScheme: 'dark' }}>
                                    <option value="license_key">License / Product Key</option>
                                    <option value="account">Account (Email + Password)</option>
                                    <option value="coupon">Coupon Code</option>
                                    <option value="download_link">Download Link</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {digitalType === 'license_key' && (
                                <div>
                                    <label className={labelCls}>License / Product Key</label>
                                    <input value={dfLicenseKey} onChange={e => setDfLicenseKey(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" className={inputCls + " font-mono"} />
                                </div>
                            )}
                            {digitalType === 'account' && (<>
                                <div>
                                    <label className={labelCls}>Login Email</label>
                                    <input type="email" value={dfEmail} onChange={e => setDfEmail(e.target.value)} placeholder="account@email.com" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>Password</label>
                                    <input value={dfPassword} onChange={e => setDfPassword(e.target.value)} placeholder="••••••••" className={inputCls + " font-mono"} />
                                </div>
                                <div>
                                    <label className={labelCls}>Recovery Email (Optional)</label>
                                    <input type="email" value={dfRecovery} onChange={e => setDfRecovery(e.target.value)} placeholder="recovery@email.com" className={inputCls} />
                                </div>
                            </>)}
                            {digitalType === 'coupon' && (
                                <div>
                                    <label className={labelCls}>Coupon Code</label>
                                    <input value={dfCoupon} onChange={e => setDfCoupon(e.target.value)} placeholder="SAVE20OFF" className={inputCls + " font-mono uppercase"} />
                                </div>
                            )}
                            {digitalType === 'download_link' && (
                                <div>
                                    <label className={labelCls}>Download URL</label>
                                    <input type="url" value={dfUrl} onChange={e => setDfUrl(e.target.value)} placeholder="https://..." className={inputCls} />
                                </div>
                            )}
                            <div>
                                <label className={labelCls}>Internal Notes</label>
                                <input value={dfNotes} onChange={e => setDfNotes(e.target.value)} placeholder="e.g. Do not change email" className={inputCls} />
                            </div>
                        </div>
                    )}

                    {/* Custom attributes */}
                    <div>
                        <label className={labelCls}>Custom Attributes</label>
                        <div className="flex gap-2 mb-2">
                            <input value={newAttrKey} onChange={e => setNewAttrKey(e.target.value)} placeholder="Key (e.g. Color)" className={inputCls} />
                            <input value={newAttrVal} onChange={e => setNewAttrVal(e.target.value)} placeholder="Value" className={inputCls} />
                            <button type="button" onClick={addAttr} className="px-3 py-2 bg-white/10 rounded-xl text-white text-sm hover:bg-white/15 shrink-0"><Plus className="w-4 h-4" /></button>
                        </div>
                        {attributes.map((a, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg mb-1 text-xs">
                                <span className="text-white/50">{a.key}</span>
                                <span className="text-white">{a.value}</span>
                                <button type="button" onClick={() => setAttributes(arr => arr.filter((_, j) => j !== i))} className="text-white/30 hover:text-rose-400 ml-2"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className={labelCls}>Tags</label>
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type tag + Enter" className={inputCls} />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {tags.map(t => (
                                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[11px] text-indigo-300">
                                        #{t} <button type="button" onClick={() => setTags(arr => arr.filter(x => x !== t))} className="hover:text-rose-400">&times;</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                <div className="p-4 border-t border-white/10 shrink-0">
                    <button type="submit" onClick={submit} className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-cyan-500/20">
                        Add to Inventory
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Add Vendor Drawer ────────────────────────────────────────────────────────
function AddVendorDrawer({ businessId, onClose, addVendor }: {
    businessId: string;
    onClose: () => void;
    addVendor: (v: any) => void;
}) {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [category, setCategory] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [telegram, setTelegram] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [instagram, setInstagram] = useState('');
    const [paymentMethods, setPaymentMethods] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) setTags(t => [...t, tagInput.trim()]);
            setTagInput('');
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        addVendor({ businessId, name, rating, category, whatsapp, telegram, email, website, instagram, paymentMethods, notes, tags });
        onClose();
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50";
    const labelCls = "text-[10px] font-bold text-white/40 uppercase tracking-wider block mb-1.5";

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="w-[440px] bg-[#0f0f0f] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden">
                <div className="h-14 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
                    <h2 className="text-sm font-semibold text-white">Add Vendor</h2>
                    <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/5"><X className="w-4 h-4" /></button>
                </div>

                <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-5">
                    <div>
                        <label className={labelCls}>Vendor Name *</label>
                        <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Alpha Keys" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Category</label>
                            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Accounts, Licenses" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Rating</label>
                            <div className="flex items-center gap-2 mt-1">
                                <StarRow n={rating} onChange={setRating} />
                                <span className="text-sm text-white/50">{rating}/5</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className={labelCls}>Contact Channels</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-7 flex justify-center"><MessageCircle className="w-4 h-4 text-green-400" /></div>
                                <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp number (+1234567890)" className={inputCls} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 flex justify-center"><ExternalLink className="w-4 h-4 text-blue-400" /></div>
                                <input value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="Telegram (@handle)" className={inputCls} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 flex justify-center"><Mail className="w-4 h-4 text-white/40" /></div>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className={inputCls} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 flex justify-center"><Globe className="w-4 h-4 text-white/40" /></div>
                                <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website URL" className={inputCls} />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-7 flex justify-center"><Instagram className="w-4 h-4 text-pink-400" /></div>
                                <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="Instagram (@handle)" className={inputCls} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Payment Methods</label>
                        <input value={paymentMethods} onChange={e => setPaymentMethods(e.target.value)} placeholder="e.g. PayPal, Binance Pay, Crypto" className={inputCls} />
                    </div>

                    <div>
                        <label className={labelCls}>Notes</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Warranty info, reliability notes, quirks..." className={inputCls + " resize-none"} />
                    </div>

                    <div>
                        <label className={labelCls}>Tags</label>
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type tag + Enter" className={inputCls} />
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {tags.map(t => (
                                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-[11px] text-violet-300">
                                        #{t} <button type="button" onClick={() => setTags(arr => arr.filter(x => x !== t))} className="hover:text-rose-400">&times;</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                <div className="p-4 border-t border-white/10 shrink-0">
                    <button type="submit" onClick={submit} className="w-full py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-violet-500/20">
                        Add Vendor
                    </button>
                </div>
            </div>
        </div>
    );
}
