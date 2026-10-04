'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/contexts/AppContext';

export function UniversalDashboardButton() {
    const params = useParams();
    const businessId = (params?.businessId as string) || MOCK_BUSINESSES[0].id;
    const neglectedCount = MOCK_BUSINESSES.filter(b => b.metrics.neglectScore < 50).length;

    return (
        <Link
            href={`/${businessId}/universal`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-xs font-medium text-white/80 hover:text-white transition-all group shadow-sm"
            title="View Universal Dashboard (all businesses)"
        >
            <Globe className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span className="hidden sm:inline font-medium">Universal Dashboard</span>
            <span className="sm:hidden font-medium">Universal</span>
            {neglectedCount > 0 && (
                <span className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 text-rose-400 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>{neglectedCount}</span>
                </span>
            )}
        </Link>
    );
}
