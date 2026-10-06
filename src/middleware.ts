import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Ignore static files, api routes, and the login page itself
    if (path.startsWith('/_next') || path.startsWith('/api') || path === '/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get('auth_token')?.value;

    if (!token || token !== 'authenticated') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
