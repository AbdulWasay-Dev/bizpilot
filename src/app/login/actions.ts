'use server';

import { cookies } from 'next/headers';

export async function authenticate(email: string, pass: string) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPass) {
        return { success: false, error: 'Server authentication not configured properly.' };
    }

    if (email === adminEmail && pass === adminPass) {
        const cookieStore = await cookies();
        cookieStore.set('auth_token', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        return { success: true };
    } else {
        return { success: false, error: 'Invalid email or password' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
}
