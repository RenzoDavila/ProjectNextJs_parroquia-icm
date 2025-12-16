import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/lib/constants';

const { COOKIE_NAME } = AUTH_CONFIG;

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Permitir acceso a la página de login
    if (pathname === '/admin/login') {
        const token = request.cookies.get(COOKIE_NAME)?.value;
        // Si ya tiene token y va al login, redirigir al dashboard
        if (token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.next();
    }

    // Verificar si la ruta es del admin
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get(COOKIE_NAME)?.value;

        // Si no hay token, redirigir al login
        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Si hay token, permitimos pasar.
        // La validación real de la firma se hará en las APIs y en el layout via /api/auth/me
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
