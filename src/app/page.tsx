import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function RootPage() {
    const businesses = await prisma.business.findMany();
    
    if (businesses.length > 0) {
        redirect(`/${businesses[0].id}/universal`);
    } else {
        redirect('/settings');
    }
}
