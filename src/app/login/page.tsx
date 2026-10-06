import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    if (token?.value === 'authenticated') {
        redirect('/');
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-[#0a0a0a] text-black dark:text-white" style={{ background: 'var(--bg-base)' }}>
            <div className="card w-full max-w-sm p-8 shadow-2xl glass animate-fade-up">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-white dark:text-black font-bold text-xl">B</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>BizPilot</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Enter your admin credentials</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
