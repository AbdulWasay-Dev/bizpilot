'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';
import type { InventoryItem, Vendor, DigitalField } from '@/lib/data';
import {
    Plus, Search, Copy, Eye, EyeOff, Star, MessageCircle, X,
    ExternalLink, Package, Globe, Mail, Instagram,
    ChevronRight, CheckCircle2, CreditCard
} from 'lucide-react';

// ─── Status helpers ─────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; badge: string }> = {
    AVAILABLE: { label: 'Available', badge: 'pill-success' },
    SOLD:      { label: 'Sold',      badge: 'pill-muted' },
    RESERVED:  { label: 'Reserved',  badge: 'pill-warning' },
    DEFECTIVE: { label: 'Defective', badge: 'pill-danger' },
};

function StarRow({ n, onChange }: { n: number; onChange?: (v: number) => void }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    onClick={() => onChange?.(i)}
                    className={`w-3.5 h-3.5 transition-colors ${i <= n ? 'text-amber-500 fill-amber-500' : 'text-black/10'} ${onChange ? 'cursor-pointer hover:text-amber-400' : ''}`}
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
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
            {/* Header */}
            <header className="sticky top-0 z-20 h-16 px-8 flex items-center justify-between border-b glass" style={{ borderColor: 'var(--border)' }}>
                <div>
                    <h1 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Inventory & Vendors</h1>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    {tab === 'stock' ? (
                        <button onClick={() => setAddItemOpen(true)} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    ) : (
                        <button onClick={() => setAddVendorOpen(true)} className="btn-primary flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Vendor
                        </button>
                    )}
                </div>
            </header>

            {/* Stats strip */}
            <div className="border-b px-8 py-3 flex items-center gap-8 overflow-x-auto" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                {[
                    { label: 'In Stock', value: availableCount },
                    { label: 'Sold Units', value: soldCount },
                    { label: 'SKUs', value: bizInventory.length },
                    { label: 'Vendors', value: bizVendors.length },
                    { label: 'Cost Value', value: `$${totalValue.toFixed(2)}` },
                    { label: 'Retail Value', value: `$${totalRetail.toFixed(2)}` },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 shrink-0">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
                    </div>
                ))}
            </div>

            <main className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-8 pb-4 space-y-4">
                        <div className="flex gap-1 p-1 rounded-xl w-max" style={{ background: 'var(--fill-1)' }}>
                            {(['stock', 'vendors'] as const).map(t => (
                                <button key={t} onClick={() => { setTab(t); setSelectedItem(null); setSelectedVendor(null); }}
                                    className="px-5 py-1.5 rounded-lg text-sm font-semibold transition-all"
                                    style={{
                                        background: tab === t ? 'var(--bg-card)' : 'transparent',
                                        color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
                                    }}>
                                    {t === 'stock' ? 'Stock Inventory' : 'Vendor Directory'}
                                </button>
                            ))}
                        </div>

                        {tab === 'stock' && (
                            <div className="flex items-center gap-3">
                                <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: 'var(--fill-1)', border: '1px solid var(--border)' }}>
                                    <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
                                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU, vendor..." className="bg-transparent text-sm flex-1 focus:outline-none" style={{ color: 'var(--text-primary)' }} />
                                    {search && <button onClick={() => setSearch('')}><X className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /></button>}
                                </div>
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-auto">
                                    <option value="ALL">All Status</option>
                                    <option value="AVAILABLE">Available</option>
                                    <option value="SOLD">Sold</option>
                                    <option value="RESERVED">Reserved</option>
                                    <option value="DEFECTIVE">Defective</option>
                                </select>
                                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input w-auto">
                                    <option value="ALL">All Types</option>
                                    <option value="digital">Digital</option>
                                    <option value="physical">Physical</option>
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Stock list */}
                    {tab === 'stock' && (
                        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-3">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Package className="w-10 h-10 mb-3" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No items found</p>
                                </div>
                            ) : filtered.map(item => {
                                const sc = STATUS_CFG[item.status] || STATUS_CFG.AVAILABLE;
                                const margin = item.price > 0 ? ((item.price - item.cost) / item.price * 100).toFixed(0) : 0;
                                const isSelected = selectedItem?.id === item.id;
                                const df = item.digitalFields;
                                const sensitiveValue = df?.licenseKey || df?.password || df?.couponCode || df?.downloadUrl || item.payload || '';

                                return (
                                    <div key={item.id} onClick={() => setSelectedItem(isSelected ? null : item)}
                                        className={`card card-hover p-4 cursor-pointer ${isSelected ? 'border-black' : ''}`}
                                        style={{ borderColor: isSelected ? 'var(--text-primary)' : 'var(--border)' }}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--fill-2)' }}>
                                                {item.productType === 'digital' ? <Globe className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} /> : <Package className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                                                    <span className={`pill ${sc.badge}`}>{sc.label}</span>
                                                </div>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.sku} · {item.category} · {item.vendor}</p>
                                                {item.quantity > 1 && <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>}
                                            </div>
                                            {sensitiveValue && (
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg max-w-[120px] truncate" style={{ background: 'var(--fill-1)', color: 'var(--text-secondary)' }}>
                                                        {revealed[item.id] ? sensitiveValue : '••••••••••••'}
                                                    </span>
                                                    <button onClick={e => { e.stopPropagation(); setRevealed(p => ({ ...p, [item.id]: !p[item.id] })); }} className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}>
                                                        {revealed[item.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button onClick={e => { e.stopPropagation(); copyText(sensitiveValue, item.id); }} className="p-1.5 rounded-md transition-colors" style={{ color: 'var(--text-muted)' }}>
                                                        {copied === item.id ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--text-primary)' }} /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            )}
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>${Number(item.price).toFixed(2)}</p>
                                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{margin}% margin</p>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} style={{ color: 'var(--text-muted)' }} />
                                        </div>

                                        {isSelected && (
                                            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 animate-fade-up" style={{ borderColor: 'var(--border)' }}>
                                                {item.description && (
                                                    <div className="col-span-2 rounded-xl p-3" style={{ background: 'var(--fill-1)' }}>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Description</p>
                                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>
                                                    </div>
                                                )}
                                                <div className="rounded-xl p-3 space-y-2" style={{ background: 'var(--fill-1)' }}>
                                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Financials</p>
                                                    <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Cost</span><span style={{ color: 'var(--text-primary)' }}>${Number(item.cost).toFixed(2)}</span></div>
                                                    <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Price</span><span style={{ color: 'var(--text-primary)' }}>${Number(item.price).toFixed(2)}</span></div>
                                                    <div className="flex justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Quantity</span><span style={{ color: 'var(--text-primary)' }}>{item.quantity}</span></div>
                                                </div>
                                                {item.attributes && item.attributes.length > 0 && (
                                                    <div className="rounded-xl p-3" style={{ background: 'var(--fill-1)' }}>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Attributes</p>
                                                        {item.attributes.map((a, i) => (
                                                            <div key={i} className="flex justify-between text-xs mb-1">
                                                                <span style={{ color: 'var(--text-muted)' }}>{a.key}</span>
                                                                <span style={{ color: 'var(--text-primary)' }}>{a.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {item.digitalFields && (
                                                    <div className="col-span-2 rounded-xl p-3 space-y-2" style={{ background: 'var(--fill-2)', border: '1px solid var(--border)' }}>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Digital Product Details</p>
                                                        {item.digitalFields.email && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span style={{ color: 'var(--text-muted)' }}>Email</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{item.digitalFields.email}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.password && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span style={{ color: 'var(--text-muted)' }}>Password</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{revealed[item.id + 'df'] ? item.digitalFields.password : '••••••••'}</span>
                                                                    <button onClick={e => { e.stopPropagation(); setRevealed(p => ({ ...p, [item.id + 'df']: !p[item.id + 'df'] })); }} style={{ color: 'var(--text-muted)' }}>
                                                                        {revealed[item.id + 'df'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.digitalFields.licenseKey && (
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span style={{ color: 'var(--text-muted)' }}>License Key</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{revealed[item.id + 'lk'] ? item.digitalFields.licenseKey : '••••••••'}</span>
                                                                    <button onClick={e => { e.stopPropagation(); setRevealed(p => ({ ...p, [item.id + 'lk']: !p[item.id + 'lk'] })); }} style={{ color: 'var(--text-muted)' }}>
                                                                        {revealed[item.id + 'lk'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="col-span-2 flex gap-2 pt-2">
                                                    {item.status === 'AVAILABLE' && (
                                                        <button onClick={e => { e.stopPropagation(); updateInventoryItem(item.id, { status: 'SOLD' }); }} className="btn-secondary flex-1 py-2 text-xs">Mark as Sold</button>
                                                    )}
                                                    {item.status === 'AVAILABLE' && (
                                                        <button onClick={e => { e.stopPropagation(); updateInventoryItem(item.id, { status: 'RESERVED' }); }} className="btn-secondary flex-1 py-2 text-xs">Reserve</button>
                                                    )}
                                                    {item.status !== 'AVAILABLE' && (
                                                        <button onClick={e => { e.stopPropagation(); updateInventoryItem(item.id, { status: 'AVAILABLE' }); }} className="btn-secondary flex-1 py-2 text-xs">Restore to Available</button>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {bizVendors.map(v => (
                                    <div key={v.id} onClick={() => setSelectedVendor(selectedVendor?.id === v.id ? null : v)}
                                        className={`card card-hover p-5 cursor-pointer ${selectedVendor?.id === v.id ? 'border-black' : ''}`}
                                        style={{ borderColor: selectedVendor?.id === v.id ? 'var(--text-primary)' : 'var(--border)' }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{v.name}</h3>
                                                {v.category && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{v.category}</p>}
                                            </div>
                                            <StarRow n={v.rating} />
                                        </div>
                                        {v.notes && <p className="text-xs p-2.5 rounded-lg mb-3" style={{ background: 'var(--fill-1)', color: 'var(--text-secondary)' }}>{v.notes}</p>}
                                        <div className="flex flex-wrap gap-2">
                                            {v.whatsapp && (
                                                <a href={`https://wa.me/${v.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                                                    style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                                                </a>
                                            )}
                                            {v.telegram && (
                                                <a href={`https://t.me/${v.telegram.replace('@', '')}`} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                                                    style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                    <ExternalLink className="w-3.5 h-3.5" /> {v.telegram}
                                                </a>
                                            )}
                                            {v.email && (
                                                <a href={`mailto:${v.email}`} onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                                                    style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                    <Mail className="w-3.5 h-3.5" /> Email
                                                </a>
                                            )}
                                            {v.website && (
                                                <a href={v.website} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                                                    style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                    <Globe className="w-3.5 h-3.5" /> Website
                                                </a>
                                            )}
                                        </div>
                                        {selectedVendor?.id === v.id && (
                                            <div className="mt-4 pt-4 border-t animate-fade-up" style={{ borderColor: 'var(--border)' }}>
                                                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Products from this vendor</p>
                                                {bizInventory.filter(i => i.vendor === v.name).length === 0
                                                    ? <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No products linked</p>
                                                    : bizInventory.filter(i => i.vendor === v.name).map(i => (
                                                        <div key={i.id} className="flex justify-between text-xs py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                                                            <span style={{ color: 'var(--text-secondary)' }}>{i.title}</span>
                                                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{STATUS_CFG[i.status]?.label}</span>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => setAddVendorOpen(true)}
                                    className="card card-hover flex flex-col items-center justify-center gap-2 min-h-[140px] transition-colors"
                                    style={{ background: 'transparent', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                                    <Plus className="w-6 h-6" />
                                    <span className="text-sm font-semibold">Add Vendor</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {addItemOpen && <AddProductDrawer businessId={businessId} vendors={bizVendors} onClose={() => setAddItemOpen(false)} addInventoryItem={addInventoryItem} />}
            {addVendorOpen && <AddVendorDrawer businessId={businessId} onClose={() => setAddVendorOpen(false)} addVendor={addVendor} />}
        </div>
    );
}

function AddProductDrawer({ businessId, vendors, onClose, addInventoryItem }: { businessId: string; vendors: Vendor[]; onClose: () => void; addInventoryItem: (i: any) => void; }) {
    const [title, setTitle] = useState(''); const [sku, setSku] = useState(''); const [category, setCategory] = useState('LICENSE'); const [productType, setProductType] = useState<'digital' | 'physical'>('digital'); const [digitalType, setDigitalType] = useState<DigitalField['type']>('license_key'); const [status, setStatus] = useState('AVAILABLE'); const [quantity, setQuantity] = useState(1); const [cost, setCost] = useState(''); const [price, setPrice] = useState(''); const [vendor, setVendor] = useState(vendors[0]?.name || ''); const [description, setDescription] = useState(''); const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]); const [newAttrKey, setNewAttrKey] = useState(''); const [newAttrVal, setNewAttrVal] = useState(''); const [tags, setTags] = useState<string[]>([]); const [tagInput, setTagInput] = useState(''); const [dfLicenseKey, setDfLicenseKey] = useState(''); const [dfEmail, setDfEmail] = useState(''); const [dfPassword, setDfPassword] = useState(''); const [dfRecovery, setDfRecovery] = useState(''); const [dfCoupon, setDfCoupon] = useState(''); const [dfUrl, setDfUrl] = useState(''); const [dfNotes, setDfNotes] = useState('');
    const addAttr = () => { if (newAttrKey.trim()) { setAttributes(a => [...a, { key: newAttrKey.trim(), value: newAttrVal.trim() }]); setNewAttrKey(''); setNewAttrVal(''); } };
    const addTag = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && tagInput.trim()) { e.preventDefault(); if (!tags.includes(tagInput.trim())) setTags(t => [...t, tagInput.trim()]); setTagInput(''); } };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const buildDigitalFields = (): DigitalField => { const base: DigitalField = { type: digitalType }; if (digitalType === 'license_key') base.licenseKey = dfLicenseKey; if (digitalType === 'account') { base.email = dfEmail; base.password = dfPassword; base.recoveryEmail = dfRecovery; base.notes = dfNotes; } if (digitalType === 'coupon') base.couponCode = dfCoupon; if (digitalType === 'download_link') base.downloadUrl = dfUrl; if (digitalType === 'other') { base.notes = dfNotes; } return base; };
        const buildPayload = () => { if (digitalType === 'license_key') return dfLicenseKey; if (digitalType === 'account') return dfEmail ? `${dfEmail} / ${dfPassword}` : ''; if (digitalType === 'coupon') return dfCoupon; if (digitalType === 'download_link') return dfUrl; return ''; };
        addInventoryItem({ businessId, title: title.trim(), sku: sku.trim() || `SKU-${Date.now()}`, category, productType, status, quantity, cost: parseFloat(cost) || 0, price: parseFloat(price) || 0, vendor, description, attributes, digitalFields: productType === 'digital' ? buildDigitalFields() : undefined, payload: productType === 'digital' ? buildPayload() : '', tags });
        onClose();
    };
    const inputCls = "input";
    const labelCls = "text-[10px] font-bold uppercase tracking-wider block mb-1.5 text-muted";
    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 panel-backdrop" onClick={onClose} />
            <div className="w-[480px] flex flex-col shadow-2xl overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)', borderLeft: '1px solid var(--border)' }}>
                <div className="h-14 px-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Add Product to Inventory</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-black/5"><X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                </div>
                <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-5">
                    <div>
                        <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Product Type</label>
                        <div className="flex gap-2">
                            {(['digital', 'physical'] as const).map(t => (
                                <button key={t} type="button" onClick={() => setProductType(t)}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold border capitalize transition-colors"
                                    style={{ background: productType === t ? 'var(--text-primary)' : 'var(--fill-1)', color: productType === t ? '#fff' : 'var(--text-secondary)', borderColor: productType === t ? 'var(--text-primary)' : 'var(--border)' }}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Product Name *</label><input required value={title} onChange={e => setTitle(e.target.value)} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>SKU</label><input value={sku} onChange={e => setSku(e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Category</label><input value={category} onChange={e => setCategory(e.target.value)} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Cost ($)</label><input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Price ($)</label><input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Quantity</label><input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 1)} className={inputCls} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Vendor</label>
                            {vendors.length > 0 ? (
                                <select value={vendor} onChange={e => setVendor(e.target.value)} className={inputCls}>
                                    {vendors.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                                    <option value="Self-made">Self-made</option>
                                    <option value="Other">Other…</option>
                                </select>
                            ) : (<input value={vendor} onChange={e => setVendor(e.target.value)} className={inputCls} />)}
                        </div>
                        <div>
                            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Status</label>
                            <select value={status} onChange={e => setStatus(e.target.value)} className={inputCls}>
                                <option value="AVAILABLE">Available</option>
                                <option value="SOLD">Sold</option>
                                <option value="RESERVED">Reserved</option>
                                <option value="DEFECTIVE">Defective</option>
                            </select>
                        </div>
                    </div>
                    {productType === 'digital' && (
                        <div className="rounded-xl p-4 space-y-4" style={{ background: 'var(--fill-1)', border: '1px solid var(--border)' }}>
                            <div>
                                <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Digital Type</label>
                                <select value={digitalType} onChange={e => setDigitalType(e.target.value as DigitalField['type'])} className={inputCls}>
                                    <option value="license_key">License / Product Key</option>
                                    <option value="account">Account (Email + Password)</option>
                                    <option value="coupon">Coupon Code</option>
                                    <option value="download_link">Download Link</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            {digitalType === 'license_key' && (<div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>License / Product Key</label><input value={dfLicenseKey} onChange={e => setDfLicenseKey(e.target.value)} className={inputCls + " font-mono"} /></div>)}
                            {digitalType === 'account' && (<>
                                <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Login Email</label><input type="email" value={dfEmail} onChange={e => setDfEmail(e.target.value)} className={inputCls} /></div>
                                <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Password</label><input value={dfPassword} onChange={e => setDfPassword(e.target.value)} className={inputCls + " font-mono"} /></div>
                            </>)}
                        </div>
                    )}
                </form>
                <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <button type="submit" onClick={submit} className="btn-primary w-full py-3">Add to Inventory</button>
                </div>
            </div>
        </div>
    );
}

function AddVendorDrawer({ businessId, onClose, addVendor }: { businessId: string; onClose: () => void; addVendor: (v: any) => void; }) {
    const [name, setName] = useState(''); const [rating, setRating] = useState(5); const [category, setCategory] = useState(''); const [whatsapp, setWhatsapp] = useState(''); const [telegram, setTelegram] = useState(''); const [email, setEmail] = useState(''); const [website, setWebsite] = useState(''); const [instagram, setInstagram] = useState(''); const [paymentMethods, setPaymentMethods] = useState(''); const [notes, setNotes] = useState('');
    const submit = (e: React.FormEvent) => { e.preventDefault(); addVendor({ businessId, name, rating, category, whatsapp, telegram, email, website, instagram, paymentMethods, notes, tags: [] }); onClose(); };
    const inputCls = "input";
    const labelCls = "text-[10px] font-bold uppercase tracking-wider block mb-1.5";
    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 panel-backdrop" onClick={onClose} />
            <div className="w-[440px] flex flex-col shadow-2xl overflow-hidden animate-fade-up" style={{ background: 'var(--bg-base)', borderLeft: '1px solid var(--border)' }}>
                <div className="h-14 px-5 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Add Vendor</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-black/5"><X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /></button>
                </div>
                <form onSubmit={submit} className="flex-1 overflow-y-auto p-5 space-y-5">
                    <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Vendor Name *</label><input required value={name} onChange={e => setName(e.target.value)} className={inputCls} /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Category</label><input value={category} onChange={e => setCategory(e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Rating</label><div className="flex items-center gap-2 mt-2"><StarRow n={rating} onChange={setRating} /><span className="text-sm" style={{ color: 'var(--text-muted)' }}>{rating}/5</span></div></div>
                    </div>
                    <div><label className={labelCls} style={{ color: 'var(--text-muted)' }}>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={inputCls + " resize-none"} /></div>
                </form>
                <div className="p-4 border-t shrink-0" style={{ borderColor: 'var(--border)' }}>
                    <button type="submit" onClick={submit} className="btn-primary w-full py-3">Add Vendor</button>
                </div>
            </div>
        </div>
    );
}
