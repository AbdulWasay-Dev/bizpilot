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
        <div className="flex-1 flex flex-col h-screen bg-[#0a0a0a] overflow-hidden">
            <header className="h-20 shrink-0 border-b border-white/10 px-8 flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-xl z-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/20">
                            <Shield className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-white tracking-tight">Account Vault</h1>
                            <p className="text-[11px] text-white/40">{business?.name} Secure Storage</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <UniversalDashboardButton />
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <button 
                        onClick={() => setActiveModal('ADD_SOCIAL_ACCOUNT')}
                        className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-rose-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Store Credentials
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8">
                {vaultAccounts.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Lock className="w-16 h-16 text-white/10 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Vault is Empty</h2>
                        <p className="text-white/40 max-w-sm mb-6">Securely store your social media passwords, recovery emails, and connected devices here.</p>
                        <button 
                            onClick={() => setActiveModal('ADD_SOCIAL_ACCOUNT')}
                            className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors border border-white/10"
                        >
                            Add First Account
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        {vaultAccounts.map(account => (
                            <div key={account.id} className="bg-[#141414] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
                                
                                <div className="flex justify-between items-start mb-6 relative">
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">{account.platform}</h3>
                                        <p className="text-rose-400 font-medium text-sm mt-1">{account.username}</p>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <KeyRound className="w-5 h-5 text-white/40" />
                                    </div>
                                </div>

                                <div className="space-y-4 relative">
                                    <div>
                                        <label className="text-[10px] font-bold tracking-wider text-white/40 uppercase mb-1 block">Login Email</label>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg p-3">
                                            <span className="text-sm text-white/90 font-mono">{account.email}</span>
                                            <button 
                                                onClick={() => copyToClipboard(account.email, account.id + 'email')}
                                                className="text-white/40 hover:text-white transition-colors"
                                            >
                                                {copiedId === account.id + 'email' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold tracking-wider text-white/40 uppercase mb-1 block">Password</label>
                                        <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg p-3">
                                            <span className="text-sm text-white/90 font-mono tracking-widest">
                                                {revealedPasswords[account.id] ? account.password : '••••••••••••'}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => togglePassword(account.id)}
                                                    className="text-white/40 hover:text-white transition-colors p-1"
                                                >
                                                    {revealedPasswords[account.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={() => account.password && copyToClipboard(account.password, account.id + 'pass')}
                                                    className="text-white/40 hover:text-white transition-colors p-1"
                                                >
                                                    {copiedId === account.id + 'pass' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {(account.recoveryEmail || account.phoneLinked || account.devices) && (
                                    <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-2 gap-4">
                                        {account.recoveryEmail && (
                                            <div className="flex items-start gap-2 text-xs">
                                                <Mail className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="block text-white/30 mb-0.5">Recovery Email</span>
                                                    <span className="text-white/70 truncate block">{account.recoveryEmail}</span>
                                                </div>
                                            </div>
                                        )}
                                        {account.phoneLinked && (
                                            <div className="flex items-start gap-2 text-xs">
                                                <Smartphone className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="block text-white/30 mb-0.5">Linked Phone</span>
                                                    <span className="text-white/70">{account.phoneLinked}</span>
                                                </div>
                                            </div>
                                        )}
                                        {account.devices && (
                                            <div className="flex items-start gap-2 text-xs col-span-2">
                                                <Shield className="w-3.5 h-3.5 text-white/30 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="block text-white/30 mb-0.5">Authorized Devices</span>
                                                    <span className="text-white/70">{account.devices}</span>
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
