import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/lib/constants';

const { COOKIE_NAME } = AUTH_CONFIG;

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Eliminar cookie del token
    response.cookies.delete(COOKIE_NAME);

    return response;
}
