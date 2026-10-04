import { redirect } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/lib/data';

export default function RootDecisionsRedirect() {
    redirect(`/${MOCK_BUSINESSES[0].id}/decisions`);
}
