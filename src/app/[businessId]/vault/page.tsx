'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';
import { Shield, Eye, EyeOff, Plus, Copy, CheckCircle2, Lock, Smartphone, Mail, KeyRound } from 'lucide-react';

export default function AccountVault() {
    const { businessId } = useParams() as { businessId: string };
    const { businesses, socialAccounts, setActiveModal } = useApp();
    const business = businesses.find(b => b.id === businessId);
    
    const vaultAccounts = socialAccounts.filter(sa => sa.businessId === businessId);
    
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const togglePassword = (id: string) => {
        setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
            <header className="h-16 shrink-0 px-8 flex items-center justify-between border-b glass" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ background: 'rgba(255, 59, 48, 0.1)', borderColor: 'rgba(255, 59, 48, 0.2)' }}>
                            <Shield className="w-4 h-4" style={{ color: '#FF3B30' }} />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>Account Vault</h1>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{business?.name} Secure Storage</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button onClick={() => setActiveModal('ADD_SOCIAL_ACCOUNT')} className="btn-primary flex items-center gap-2" style={{ background: '#FF3B30', color: 'white' }}>
                        <Plus className="w-4 h-4" /> Store Credentials
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 max-w-6xl mx-auto w-full">
                {vaultAccounts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Lock className="w-16 h-16 mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
                        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Vault is Empty</h2>
                        <p className="max-w-sm mb-6" style={{ color: 'var(--text-muted)' }}>Securely store your social media passwords, recovery emails, and connected devices here.</p>
                        <button onClick={() => setActiveModal('ADD_SOCIAL_ACCOUNT')} className="btn-secondary">
                            Add First Account
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {vaultAccounts.map(account => (
                            <div key={account.id} className="card p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-6 relative">
                                    <div>
                                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{account.platform}</h3>
                                        <p className="font-semibold text-sm mt-1" style={{ color: '#FF3B30' }}>{account.username}</p>
                                    </div>
                                    <div className="p-2 rounded-lg" style={{ background: 'var(--fill-2)' }}>
                                        <KeyRound className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                </div>

                                <div className="space-y-4 relative">
                                    <div>
                                        <label className="text-[10px] font-bold tracking-wider uppercase mb-1 block" style={{ color: 'var(--text-muted)' }}>Login Email</label>
                                        <div className="flex items-center justify-between border rounded-lg p-3" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                                            <span className="text-sm font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{account.email}</span>
                                            <button onClick={() => copyToClipboard(account.email, account.id + 'email')} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                                                {copiedId === account.id + 'email' ? <CheckCircle2 className="w-4 h-4" style={{ color: '#34C759' }} /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold tracking-wider uppercase mb-1 block" style={{ color: 'var(--text-muted)' }}>Password</label>
                                        <div className="flex items-center justify-between border rounded-lg p-3" style={{ background: 'var(--fill-1)', borderColor: 'var(--border)' }}>
                                            <span className="text-sm font-mono tracking-widest font-medium" style={{ color: 'var(--text-primary)' }}>
                                                {revealedPasswords[account.id] ? account.password : '••••••••••••'}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => togglePassword(account.id)} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                                                    {revealedPasswords[account.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => account.password && copyToClipboard(account.password, account.id + 'pass')} className="transition-colors" style={{ color: 'var(--text-muted)' }}>
                                                    {copiedId === account.id + 'pass' ? <CheckCircle2 className="w-4 h-4" style={{ color: '#34C759' }} /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {(account.recoveryEmail || account.phoneLinked || account.devices) && (
                                    <div className="mt-6 pt-5 border-t grid grid-cols-2 gap-4" style={{ borderColor: 'var(--border)' }}>
                                        {account.recoveryEmail && (
                                            <div className="flex items-start gap-2 text-xs">
                                                <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                                <div>
                                                    <span className="block mb-0.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Recovery Email</span>
                                                    <span className="truncate block font-medium" style={{ color: 'var(--text-secondary)' }}>{account.recoveryEmail}</span>
                                                </div>
                                            </div>
                                        )}
                                        {account.phoneLinked && (
                                            <div className="flex items-start gap-2 text-xs">
                                                <Smartphone className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                                <div>
                                                    <span className="block mb-0.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Linked Phone</span>
                                                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{account.phoneLinked}</span>
                                                </div>
                                            </div>
                                        )}
                                        {account.devices && (
                                            <div className="flex items-start gap-2 text-xs col-span-2 mt-2">
                                                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                                <div>
                                                    <span className="block mb-0.5 font-semibold" style={{ color: 'var(--text-muted)' }}>Authorized Devices</span>
                                                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{account.devices}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
