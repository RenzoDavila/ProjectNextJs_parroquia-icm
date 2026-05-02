import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Eliminar cookie del token
    response.cookies.delete(AUTH_CONFIG.COOKIE_NAME);

    return response;
}
