
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '@/lib/constants';

const { JWT_SECRET, COOKIE_NAME } = AUTH_CONFIG;

export async function GET(request: NextRequest) {
    try {
        // Obtener token de la cookie
        const token = request.cookies.get(COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: number;
            email: string;
            name: string;
            role: string;
        };

        return NextResponse.json({
            success: true,
            user: {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role,
            },
        });
    } catch (error) {
        console.error('Error verificando token:', error);
        return NextResponse.json(
            { success: false, error: 'Token inválido' },
            { status: 401 }
        );
    }
}
