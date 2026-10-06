'use client';

import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import { X } from 'lucide-react';

export function GlobalModals() {
    const appCtx = useApp();
    const { activeModal, setActiveModal } = appCtx;

    if (!activeModal) return null;

    const closeModal = () => setActiveModal(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 panel-backdrop animate-fade-up">
            <div className="card w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--fill-1)' }}>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {activeModal === 'ADD_BUSINESS' && 'Create Workspace'}
                        {activeModal === 'ADD_POST' && 'Create Post'}
                        {activeModal === 'LOG_SALE' && 'Log Sale'}
                        {activeModal === 'ADD_EXPENSE' && 'Add Expense'}
                        {activeModal === 'ADD_STOCK' && 'Add Stock'}
                        {activeModal === 'ADD_VENDOR' && 'Add Vendor'}
                        {activeModal === 'NEW_DECISION' && 'New Decision'}
                        {activeModal === 'ADD_SOCIAL_ACCOUNT' && 'Store Credentials'}
                    </h2>
                    <button onClick={closeModal} className="p-1.5 rounded-lg transition-colors hover:bg-black/5" style={{ color: 'var(--text-secondary)' }}>
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-5 overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
                    {activeModal === 'ADD_BUSINESS' && <AddBusinessForm onClose={closeModal} addBusiness={appCtx.addBusiness} />}
                    {activeModal === 'ADD_POST' && <AddPostForm onClose={closeModal} addPost={appCtx.addPost} businesses={appCtx.businesses} />}
                    {activeModal === 'LOG_SALE' && <AddTransactionForm type="SALE" onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'ADD_EXPENSE' && <AddTransactionForm type="EXPENSE" onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'ADD_STOCK' && <AddStockForm onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'ADD_VENDOR' && <AddVendorForm onClose={closeModal} appCtx={appCtx} />}
                    {activeModal === 'NEW_DECISION' && <AddDecisionForm onClose={closeModal} addDecision={appCtx.addDecision} businesses={appCtx.businesses} />}
                    {activeModal === 'ADD_SOCIAL_ACCOUNT' && <AddSocialAccountForm onClose={closeModal} appCtx={appCtx} />}
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
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Business Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. Acme Corp" />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Theme Color</label>
                <select value={color} onChange={e => setColor(e.target.value)} className="input">
                    <option value="from-indigo-500 to-purple-500">Indigo / Purple</option>
                    <option value="from-pink-500 to-rose-500">Pink / Rose</option>
                    <option value="from-emerald-400 to-teal-500">Emerald / Teal</option>
                    <option value="from-amber-400 to-orange-500">Amber / Orange</option>
                    <option value="from-sky-400 to-blue-500">Sky / Blue</option>
                </select>
            </div>
            <button type="submit" className="mt-4 btn-primary py-2.5">Create Workspace</button>
        </form>
    );
}

function AddPostForm({ onClose, addPost, businesses }: any) {
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('Instagram');
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');
    const [date, setDate] = useState(new Date().getDate());
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const submit = async (e: any) => {
        e.preventDefault();
        let mediaUrl = null;

        if (file) {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();
                if (data.success) {
                    mediaUrl = data.url;
                }
            } catch (err) {
                console.error("Upload failed", err);
            }
            setUploading(false);
        }

        addPost({ businessId, title, platform, time: '12:00 PM', status: 'draft', date, platformColor: 'bg-indigo-500', mediaUrl });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Post Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="e.g. Summer Promo" />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Media Upload</label>
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="input file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-black hover:file:bg-black/10 cursor-pointer" />
                {file && <span className="text-[10px] font-semibold mt-1 block" style={{ color: '#34C759' }}>File selected: {file.name}</span>}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Platform</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} className="input">
                        <option>Instagram</option><option>TikTok</option><option>Twitter</option><option>LinkedIn</option>
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Date</label>
                    <input type="number" required value={date} onChange={e => setDate(Number(e.target.value))} min={1} max={31} className="input" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Business</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="input">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <button type="submit" disabled={uploading} className="mt-4 btn-primary py-2.5 flex justify-center items-center">
                {uploading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : 'Create Post'}
            </button>
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
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Business</label>
                <select value={businessId} onChange={e => { setBusinessId(e.target.value); setSelectedItemId(''); }} className="input">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>

            {type === 'SALE' ? (
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Select Inventory Item</label>
                    <select required value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} className="input">
                        <option value="" disabled>Select an item to sell...</option>
                        {availableItems.map((item: any) => (
                            <option key={item.id} value={item.id}>{item.title} - ${item.price.toFixed(2)}</option>
                        ))}
                    </select>
                    {availableItems.length === 0 && (
                        <p className="text-[10px] font-semibold mt-1" style={{ color: '#FF9500' }}>No available items to sell for this business.</p>
                    )}
                </div>
            ) : (
                <>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
                        <input required value={description} onChange={e => setDescription(e.target.value)} className="input" placeholder="e.g. Office 2024 Key" />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Amount ($)</label>
                        <input type="number" step="0.01" required value={amount} onChange={e => setAmount(e.target.value)} className="input" placeholder="0.00" />
                    </div>
                </>
            )}

            <button type="submit" disabled={type === 'SALE' && !selectedItemId} className="mt-4 btn-primary py-2.5">
                {type === 'SALE' ? 'Log Sale' : 'Add Expense'}
            </button>
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
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Business</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="input">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Vendor Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. Alpha Keys" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>WhatsApp URL</label>
                    <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="input" placeholder="e.g. https://wa.me/..." />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Telegram</label>
                    <input value={telegram} onChange={e => setTelegram(e.target.value)} className="input" placeholder="e.g. @alphakeys" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Notes</label>
                <input value={notes} onChange={e => setNotes(e.target.value)} className="input" placeholder="e.g. PayPal only, fast delivery" />
            </div>
            <button type="submit" className="mt-4 btn-primary py-2.5">Add Vendor</button>
        </form>
    );
}

function AddStockForm({ onClose, appCtx }: any) {
    const { businesses, addInventoryItem, addTransaction, vendors } = appCtx;
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
        
        // Add to inventory
        addInventoryItem({ businessId, title, sku, category: 'LICENSE', status: 'AVAILABLE', cost: Number(cost), price: Number(price), vendor: vendorName, payload: 'NEW-ITEM-XXX' });
        
        // Log expense in finance (COGS)
        addTransaction({ 
            businessId, 
            type: 'EXPENSE', 
            description: `Inventory Purchase: ${title} (${vendorName})`, 
            amount: -Math.abs(Number(cost)), 
            date: new Date().toISOString().split('T')[0], 
            ref: sku || 'INV-PURCHASE', 
            channel: 'COGS' 
        });

        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Business</label>
                <select value={businessId} onChange={e => { setBusinessId(e.target.value); setVendorId(''); }} className="input">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Item Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="e.g. Windows 11 Key" />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>SKU</label>
                <input required value={sku} onChange={e => setSku(e.target.value)} className="input" placeholder="e.g. WIN11-01" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Cost ($)</label>
                    <input type="number" step="0.01" required value={cost} onChange={e => setCost(e.target.value)} className="input" placeholder="0.00" />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Selling Price ($)</label>
                    <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="input" placeholder="0.00" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Vendor</label>
                <select required value={vendorId} onChange={e => setVendorId(e.target.value)} className="input">
                    <option value="" disabled>Select a vendor...</option>
                    {businessVendors.map((v: any) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
            </div>
            <button type="submit" disabled={!vendorId} className="mt-4 btn-primary py-2.5">Add Stock</button>
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
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Decision Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="input" placeholder="e.g. Switch vendor for licenses" />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Urgency</label>
                <select value={urgency} onChange={e => setUrgency(e.target.value)} className="input">
                    <option>Low</option><option>Medium</option><option>High</option><option>Immediate</option>
                </select>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Business</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="input">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <button type="submit" className="mt-4 btn-primary py-2.5">Add Decision</button>
        </form>
    );
}

function AddSocialAccountForm({ onClose, appCtx }: any) {
    const { businesses, addSocialAccount } = appCtx;
    const [businessId, setBusinessId] = useState(businesses[0]?.id || '');
    const [platform, setPlatform] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [phoneLinked, setPhoneLinked] = useState('');
    const [devices, setDevices] = useState('');

    const submit = (e: any) => {
        e.preventDefault();
        addSocialAccount({ businessId, platform, username, email, password, recoveryEmail, phoneLinked, devices });
        onClose();
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Workspace</label>
                <select value={businessId} onChange={e => setBusinessId(e.target.value)} className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]">
                    {businesses.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Platform</label>
                    <input required value={platform} onChange={e => setPlatform(e.target.value)} placeholder="e.g. Instagram" className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Username / Handle</label>
                    <input required value={username} onChange={e => setUsername(e.target.value)} placeholder="@handle" className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Login Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@company.com" className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Password</label>
                <input type="text" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Secure password" className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Recovery Email (Optional)</label>
                    <input type="email" value={recoveryEmail} onChange={e => setRecoveryEmail(e.target.value)} className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Linked Phone (Optional)</label>
                    <input type="tel" value={phoneLinked} onChange={e => setPhoneLinked(e.target.value)} className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>Authorized Devices (Optional)</label>
                <input type="text" value={devices} onChange={e => setDevices(e.target.value)} placeholder="e.g. iPhone 14, MacBook Pro" className="input focus:border-[#FF3B30] focus:ring-[#FF3B30]" />
            </div>
            <button type="submit" className="mt-4 btn-primary py-2.5" style={{ background: '#FF3B30', color: 'white' }}>Save Credentials</button>
        </form>
    );
}
