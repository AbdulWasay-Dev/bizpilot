'use client';

import { useApp } from '@/contexts/AppContext';
import { deleteBusiness } from '@/app/db-actions';
import { Plus, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const { businesses, setActiveModal } = useApp();
    const [deleting, setDeleting] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this business and all its data? This action cannot be undone.')) return;
        
        setDeleting(id);
        await deleteBusiness(id);
        setDeleting(null);
    };

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-8 animate-fade-up">
            <header className="flex items-center gap-3 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                    <SettingsIcon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                </div>
                <div>
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Settings</h1>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Manage workspaces and global preferences</p>
                </div>
            </header>

            <section className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Workspaces (Businesses)</h2>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add or remove businesses. Removing a business deletes all its associated data.</p>
                    </div>
                    <button onClick={() => setActiveModal('ADD_BUSINESS')} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Workspace
                    </button>
                </div>

                <div className="space-y-3">
                    {businesses.length === 0 ? (
                        <div className="text-center py-8 border rounded-xl border-dashed" style={{ borderColor: 'var(--border)' }}>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No workspaces found. Create one to get started.</p>
                        </div>
                    ) : (
                        businesses.map(b => (
                            <div key={b.id} className="flex items-center justify-between p-4 rounded-xl border" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br" className={`bg-gradient-to-br ${b.color}`}>
                                        {b.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{b.name}</h3>
                                        <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>ID: {b.id}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(b.id)}
                                    disabled={deleting === b.id}
                                    className="p-2 rounded-lg transition-colors border hover:bg-red-50"
                                    style={{ color: '#FF3B30', borderColor: 'rgba(255,59,48,0.2)' }}
                                >
                                    {deleting === b.id ? (
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
