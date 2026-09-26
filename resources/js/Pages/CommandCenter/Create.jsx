import AppLayout from '@/Layouts/AppLayout';

export default function NewBusiness({ auth }) {
    return (
        <AppLayout title="New Business">
            <div className="p-8">
                <h1 className="text-2xl font-semibold text-white">New Business</h1>
                <p className="text-slate-400 mt-2">Coming soon — this module is being built.</p>
            </div>
        </AppLayout>
    );
}
