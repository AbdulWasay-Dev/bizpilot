import { redirect } from 'next/navigation';
import { MOCK_BUSINESSES } from '@/lib/data';

export default function RootInventoryRedirect() {
    redirect(`/${MOCK_BUSINESSES[0].id}/inventory`);
}
