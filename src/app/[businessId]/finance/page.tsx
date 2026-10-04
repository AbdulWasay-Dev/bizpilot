'use client';

export default function FinancialLedger() {
    return (
        <div className="flex h-screen bg-[#0a0a0a] p-8 flex-col gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Financial Ledger</h1>
                    <p className="text-sm text-white/50 mt-1">Track revenue, COGS, and automated net profit.</p>
                </div>
            </header>
            
            <main className="flex-1 border border-white/10 border-dashed rounded-2xl flex items-center justify-center text-white/40">
                Financial Ledger Module (Coming Soon)
            </main>
        </div>
    );
}
