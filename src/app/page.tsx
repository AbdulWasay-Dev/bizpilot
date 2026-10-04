import { redirect } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/lib/data';

export default function RootPage() {
    redirect(`/${MOCK_BUSINESSES[0].id}/universal`);
}
