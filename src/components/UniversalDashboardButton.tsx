'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

export function UniversalDashboardButton() {
    const params = useParams();
    const { businesses } = useApp();
    const businessId = (params?.businessId as string) || businesses[0]?.id;
    const neglectedCount = businesses.filter(b => b.metrics.neglectScore < 50).length;

    return (
        <Link
            href={`/${businessId}/universal`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all"
            style={{ background: 'var(--fill-1)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
            title="View Universal Dashboard"
        >
            <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <span className="hidden sm:inline font-medium">All Businesses</span>
            {neglectedCount > 0 && (
                <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: 'var(--red-bg)', color: 'var(--red)', border: '1px solid var(--red-border)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
                    {neglectedCount}
                </span>
            )}
        </Link>
    );
}
