import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '@/lib/constants';

const { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_NAME } = AUTH_CONFIG;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validar campos requeridos
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Buscar usuario en la base de datos
        const result = await query(
            'SELECT id, email, password_hash, name, role, is_active FROM admin_users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        const user = result.rows[0];

        // Verificar si el usuario está activo
        if (!user.is_active) {
            return NextResponse.json(
                { success: false, error: 'Usuario desactivado' },
                { status: 401 }
            );
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Actualizar último login
        await query(
            'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Crear token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        // Crear respuesta con cookie
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });

        // Configurar cookie con el token
        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 días
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            { success: false, error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
