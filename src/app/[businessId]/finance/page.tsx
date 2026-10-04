'use client';

import { useParams } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/contexts/AppContext';
import {
    Plus, TrendingUp, ArrowDownLeft, Package, DollarSign,
    FileText, Receipt, ChevronRight, ExternalLink
} from 'lucide-react';
import { UniversalDashboardButton } from '@/components/UniversalDashboardButton';

const mockTransactions = [
    { id: '1', type: 'SALE', description: 'Windows 11 Pro Key', amount: 24.99, date: '2026-10-04', ref: 'ORD-2841', channel: 'Direct' },
    { id: '2', type: 'EXPENSE', description: 'Vendor: Alpha Keys (Batch #47)', amount: -180.00, date: '2026-10-03', ref: 'INV-0391', channel: 'COGS' },
    { id: '3', type: 'SALE', description: 'Office 2024 Home & Business', amount: 89.00, date: '2026-10-03', ref: 'ORD-2840', channel: 'Direct' },
    { id: '4', type: 'RETURN', description: 'Refund: Invalid Key — Customer #C219', amount: -24.99, date: '2026-10-02', ref: 'RET-0082', channel: 'Refund' },
    { id: '5', type: 'EXPENSE', description: 'Hostinger Hosting (Oct)', amount: -12.00, date: '2026-10-01', ref: 'SUB-HOST', channel: 'SaaS' },
    { id: '6', type: 'SALE', description: 'Adobe CC Key (1yr)', amount: 45.00, date: '2026-10-01', ref: 'ORD-2839', channel: 'Direct' },
];

const grossSales = mockTransactions.filter(t => t.type === 'SALE').reduce((s, t) => s + t.amount, 0);
const returns = mockTransactions.filter(t => t.type === 'RETURN').reduce((s, t) => s + t.amount, 0);
const expenses = mockTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
const netProfit = grossSales + returns + expenses;
const margin = Math.round((netProfit / (grossSales + returns)) * 100);

function KpiTile({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
    return (
        <div className="bg-[#141414] border border-white/[0.06] rounded-2xl p-5">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">{label}</p>
            <p className={`text-2xl font-bold ${positive === undefined ? 'text-white' : positive ? 'text-emerald-400' : 'text-rose-400'}`}>{value}</p>
            {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
        </div>
    );
}

export default function FinanceLedger() {
    const { businessId } = useParams() as { businessId: string };
    const business = MOCK_BUSINESSES.find(b => b.id === businessId);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-8 h-16 flex items-center justify-between">
                <div>
                    <h1 className="text-base font-semibold text-white">Financial Ledger</h1>
                    <p className="text-[11px] text-white/40">{business?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <UniversalDashboardButton />
                    <button className="flex items-center gap-2 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Log Sale
                    </button>
                    <button className="flex items-center gap-2 border border-white/10 text-white/70 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Expense
                    </button>
                </div>
            </header>

            <main className="p-8 max-w-5xl mx-auto space-y-6">
                {/* P&L Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiTile label="Gross Sales" value={`$${grossSales.toFixed(2)}`} sub="Before returns" positive={true} />
                    <KpiTile label="Returns / Refunds" value={`$${returns.toFixed(2)}`} sub="Deducted from revenue" positive={false} />
                    <KpiTile label="Total Expenses" value={`$${expenses.toFixed(2)}`} sub="COGS + Overheads" positive={false} />
                    <KpiTile label="Net Profit" value={`$${netProfit.toFixed(2)}`} sub={`${margin}% margin`} positive={netProfit > 0} />
                </div>

                {/* Transaction log */}
                <div className="bg-[#141414] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-white">Transaction Log</h2>
                        <div className="flex gap-2">
                            {['All', 'Sales', 'Expenses', 'Returns'].map(f => (
                                <button key={f} className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${f === 'All' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>{f}</button>
                            ))}
                        </div>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                        {mockTransactions.map(tx => (
                            <div key={tx.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                                <div className={`p-2 rounded-lg shrink-0 ${
                                    tx.type === 'SALE' ? 'bg-emerald-500/10' :
                                    tx.type === 'RETURN' ? 'bg-rose-500/10' : 'bg-white/5'
                                }`}>
                                    {tx.type === 'SALE' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
                                     tx.type === 'RETURN' ? <ArrowDownLeft className="w-4 h-4 text-rose-400" /> :
                                     <Receipt className="w-4 h-4 text-white/40" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{tx.date} · {tx.ref} · {tx.channel}</p>
                                </div>
                                <span className={`text-base font-semibold shrink-0 ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
