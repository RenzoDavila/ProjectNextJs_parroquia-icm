import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '@/lib/constants';

/**
 * GET /api/admin/users
 * Lista todos los usuarios administradores
 */
export async function GET(request: Request) {
    try {
        // Verificar autenticación
        const authError = await verifyAdmin(request);
        if (authError) return authError;

        const result = await query(
            `SELECT id, email, name, role, is_active, last_login, created_at, updated_at
       FROM admin_users
       ORDER BY created_at DESC`
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
            total: result.rowCount,
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        const errorResult = handleDbError(error);
        return NextResponse.json(
            { success: false, error: errorResult.error },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/users
 * Crear un nuevo usuario administrador
 */
export async function POST(request: Request) {
    try {
        // Verificar autenticación
        const authError = await verifyAdmin(request);
        if (authError) return authError;

        const body = await request.json();
        const { email, password, name, role } = body;

        // Validaciones
        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: 'Email, contraseña y nombre son obligatorios' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }

        // Verificar que el email no exista
        const existing = await query(
            'SELECT id FROM admin_users WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Ya existe un usuario con este email' },
                { status: 409 }
            );
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const result = await query(
            `INSERT INTO admin_users (email, password_hash, name, role, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, email, name, role, is_active, created_at`,
            [email, passwordHash, name, role || 'editor']
        );

        return NextResponse.json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: result.rows[0],
        }, { status: 201 });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        const errorResult = handleDbError(error);
        return NextResponse.json(
            { success: false, error: errorResult.error },
            { status: 500 }
        );
    }
}

/**
 * Verifica que la petición tenga un JWT válido de admin
 */
async function verifyAdmin(request: Request): Promise<NextResponse | null> {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(new RegExp(`${AUTH_CONFIG.COOKIE_NAME}=([^;]+)`));
        const token = match?.[1];

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
        return null; // OK
    } catch {
        return NextResponse.json(
            { success: false, error: 'Token inválido' },
            { status: 401 }
        );
    }
}
