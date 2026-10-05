'use client';

import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

export function GlobalModals() {
    const appCtx = useApp();
    const { activeModal, setActiveModal } = appCtx;

    if (!activeModal) return null;

    const closeModal = () => setActiveModal(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">
                        {activeModal === 'ADD_BUSINESS' && 'Create Workspace'}
                        {activeModal === 'ADD_POST' && 'Create Post'}
                        {activeModal === 'LOG_SALE' && 'Log Sale'}
                        {activeModal === 'ADD_EXPENSE' && 'Add Expense'}
                        {activeModal === 'ADD_STOCK' && 'Add Stock'}
                        {activeModal === 'ADD_VENDOR' && 'Add Vendor'}
                        {activeModal === 'NEW_DECISION' && 'New Decision'}
                    </h2>
                    <button onClick={closeModal} className="text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto custom-scrollbar">
                    {activeModal === 'ADD_BUSINESS' && <AddBusinessForm onClose={closeModal} addBusiness={appCtx.addBusiness} />}
                    {activeModal === 'ADD_POST' && <AddPostForm onClose={closeModal} addPost={appCtx.addPost} businesses={appCtx.businesses} />}
                    {activeModal === 'LOG_SALE' && <AddTransactionForm type="SALE" onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'ADD_EXPENSE' && <AddTransactionForm type="EXPENSE" onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'ADD_STOCK' && <AddStockForm onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'ADD_VENDOR' && <AddVendorForm onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'NEW_DECISION' && <AddDecisionForm onClose={closeModal} addDecision={appCtx.addDecision} businesses={appCtx.businesses} />}
                </div>
            </div>
        </div>
    );
}

function AddBusinessForm({ onClose, addBusiness }: any) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('from-indigo-500 to-purple-500');

    const submit = (e: any) => {
        e.preventDefault();
        addBusiness({ name, color, accentColor: '#6366f1' });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Business Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Acme Corp" />
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Theme Color</label>
                <select value={color} onChange={e => setColor(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="from-indigo-500 to-purple-500">Indigo / Purple</option>
                    <option value="from-pink-500 to-rose-500">Pink / Rose</option>
                    <option value="from-emerald-400 to-teal-500">Emerald / Teal</option>
                    <option value="from-amber-400 to-orange-500">Amber / Orange</option>
                    <option value="from-sky-400 to-blue-500">Sky / Blue</option>
                </select>
            </div>
            <button type="submit" className="mt-4 bg-white text-black font-semibold rounded-lg p-2 text-sm hover:bg-white/90">Create Workspace</button>
        </form>
    );
}

function AddPostForm({ onClose, addPost, businesses }: any) {
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('Instagram');
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');
    const [date, setDate] = useState(new Date().getDate());

    const submit = (e: any) => {
        e.preventDefault();
        addPost({ businessId, title, platform, time: '12:00 PM', status: 'draft', date, platformColor: 'bg-indigo-500' });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Post Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Summer Promo" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">Platform</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                        <option>Instagram</option><option>TikTok</option><option>Twitter</option><option>LinkedIn</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">Date (Day of Month)</label>
                    <input type="number" required value={date} onChange={e => setDate(Number(e.target.value))} min={1} max={31} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Business</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <button type="submit" className="mt-4 bg-white text-black font-semibold rounded-lg p-2 text-sm hover:bg-white/90">Create Post</button>
        </form>
    );
}

function AddTransactionForm({ type, onClose, appCtx }: any) {
    const { businesses, addTransaction, inventory, updateInventoryItem } = appCtx;
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [selectedItemId, setSelectedItemId] = useState('');

    const availableItems = inventory.filter((i: any) => i.businessId === businessId && i.status === 'AVAILABLE');

    const submit = (e: any) => {
        e.preventDefault();
        
        let finalAmount = Number(amount);
        let finalDescription = description;

        if (type === 'SALE' && selectedItemId) {
            const item = inventory.find((i: any) => i.id === selectedItemId);
            if (item) {
                finalAmount = item.price;
                finalDescription = item.title;
                updateInventoryItem(item.id, { status: 'SOLD' });
            }
        }

        const amt = type === 'EXPENSE' ? -Math.abs(finalAmount) : Math.abs(finalAmount);
        
        addTransaction({ businessId, type, description: finalDescription, amount: amt, date: new Date().toISOString().split('T')[0], ref: 'MNL-001', channel: 'Direct' });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Business</label>
                <select value={businessId} onChange={e => { setBusinessId(e.target.value); setSelectedItemId(''); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            {type === 'SALE' ? (
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">Select Inventory Item</label>
                    <select required value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                        <option value="" disabled>Select an item to sell...</option>
                        {availableItems.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.title} - ${item.price.toFixed(2)}</option>
                        ))}
                    </select>
                    {availableItems.length === 0 && (
                        <p className="text-[10px] text-amber-400 mt-1">No available items to sell for this business.</p>
                    )}
                </div>
            ) : (
                <>
                    <div>
                        <label className="text-xs font-medium text-white/50 mb-1 block">Description</label>
                        <input required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Office 2024 Key" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-white/50 mb-1 block">Amount ($)</label>
                        <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="0.00" />
                    </div>
                </>
            )}

            <button type="submit" disabled={type === 'SALE' && !selectedItemId} className="mt-4 bg-white text-black font-semibold rounded-lg p-2 text-sm hover:bg-white/90 disabled:opacity-50">{type === 'SALE' ? 'Log Sale' : 'Add Expense'}</button>
        </form>
    );
}

function AddVendorForm({ onClose, appCtx }: any) {
    const { businesses, addVendor } = appCtx;
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [telegram, setTelegram] = useState('');
    const [notes, setNotes] = useState('');

    const submit = (e: any) => {
        e.preventDefault();
        addVendor({ businessId, name, rating: 5, whatsapp, telegram, notes });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Business</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Vendor Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Alpha Keys" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">WhatsApp URL</label>
                    <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. https://wa.me/..." />
                </div>
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">Telegram</label>
                    <input value={telegram} onChange={e => setTelegram(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. @alphakeys" />
                </div>
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Notes</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. PayPal only, fast delivery" />
            </div>
            <button type="submit" className="mt-4 bg-white text-black font-semibold rounded-lg p-2 text-sm hover:bg-white/90">Add Vendor</button>
        </form>
    );
}

function AddStockForm({ onClose, appCtx }: any) {
    const { businesses, addInventoryItem, vendors } = appCtx;
    const [title, setTitle] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [cost, setCost] = useState('');
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');
    const [vendorId, setVendorId] = useState('');

    const businessVendors = vendors.filter((v: any) => v.businessId === businessId);

    const submit = (e: any) => {
        e.preventDefault();
        const vendorName = vendors.find((v: any) => v.id === vendorId)?.name || 'Internal';
        addInventoryItem({ businessId, title, sku, category: 'LICENSE', status: 'AVAILABLE', cost: Number(cost), price: Number(price), vendor: vendorName, payload: 'NEW-ITEM-XXX' });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Business</label>
                <select value={businessId} onChange={e => { setBusinessId(e.target.value); setVendorId(''); }} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Item Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Windows 11 Key" />
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">SKU</label>
                <input required value={sku} onChange={e => setSku(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. WIN11-01" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">Cost ($)</label>
                    <input type="number" step="0.01" required value={cost} onChange={e => setCost(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-xs font-medium text-white/50 mb-1 block">Selling Price ($)</label>
                    <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="0.00" />
                </div>
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Vendor</label>
                <select required value={vendorId} onChange={e => setVendorId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="" disabled>Select a vendor...</option>
                    {businessVendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
            </div>
            <button type="submit" disabled={!vendorId} className="mt-4 bg-white text-black font-semibold rounded-lg p-2 text-sm hover:bg-white/90 disabled:opacity-50">Add Stock</button>
        </form>
    );
}

function AddDecisionForm({ onClose, addDecision, businesses }: any) {
    const [title, setTitle] = useState('');
    const [urgency, setUrgency] = useState('Medium');
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');

    const submit = (e: any) => {
        e.preventDefault();
        addDecision({ businessId, title, status: 'IN_DELIBERATION', urgency, impact: 'Medium', context: '', chosen: '', deadline: new Date().toISOString().split('T')[0], kpi: '', outcomeRating: null, createdAt: new Date().toISOString().split('T')[0] });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Decision Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Switch vendor for licenses" />
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Urgency</label>
                <select value={urgency} onChange={e => setUrgency(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option>Low</option><option>Medium</option><option>High</option><option>Immediate</option>
                </select>
            </div>
            <div>
                <label className="text-xs font-medium text-white/50 mb-1 block">Business</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <button type="submit" className="mt-4 bg-white text-black font-semibold rounded-lg p-2 text-sm hover:bg-white/90">Add Decision</button>
        </form>
    );
}
