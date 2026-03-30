import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AUTH_CONFIG } from '@/lib/constants';

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/users/:id
 * Obtener un usuario específico
 */
export async function GET(request: Request, { params }: RouteParams) {
    try {
        const authError = await verifyAdmin(request);
        if (authError) return authError;

        const { id } = await params;

        const result = await query(
            `SELECT id, email, name, role, is_active, last_login, created_at, updated_at
       FROM admin_users WHERE id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        const errorResult = handleDbError(error);
        return NextResponse.json(
            { success: false, error: errorResult.error },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/admin/users/:id
 * Actualizar un usuario (nombre, rol, contraseña, estado)
 */
export async function PUT(request: Request, { params }: RouteParams) {
    try {
        const authError = await verifyAdmin(request);
        if (authError) return authError;

        const { id } = await params;
        const body = await request.json();
        const { name, role, is_active, password } = body;

        // Si se proporciona nueva contraseña, hashearla
        let passwordUpdate = '';
        const values: any[] = [name, role, is_active, id];

        if (password && password.length >= 6) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            passwordUpdate = ', password_hash = $5';
            values.push(passwordHash);
        }

        const result = await query(
            `UPDATE admin_users SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        is_active = COALESCE($3, is_active),
        updated_at = CURRENT_TIMESTAMP
        ${passwordUpdate}
       WHERE id = $4
       RETURNING id, email, name, role, is_active, updated_at`,
            values
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: result.rows[0],
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        const errorResult = handleDbError(error);
        return NextResponse.json(
            { success: false, error: errorResult.error },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/users/:id
 * Eliminar un usuario (no puede eliminarse a sí mismo)
 */
export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const authError = await verifyAdmin(request);
        if (authError) return authError;

        const { id } = await params;

        // Verificar que no se autoelimina
        const currentUser = getCurrentUser(request);
        if (currentUser && currentUser.id === parseInt(id)) {
            return NextResponse.json(
                { success: false, error: 'No puedes eliminarte a ti mismo' },
                { status: 400 }
            );
        }

        const result = await query(
            'DELETE FROM admin_users WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Usuario no encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
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
        return null;
    } catch {
        return NextResponse.json(
            { success: false, error: 'Token inválido' },
            { status: 401 }
        );
    }
}

/**
 * Obtiene info del usuario actual del JWT
 */
function getCurrentUser(request: Request): { id: number; email: string } | null {
    try {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(new RegExp(`${AUTH_CONFIG.COOKIE_NAME}=([^;]+)`));
        const token = match?.[1];
        if (!token) return null;

        const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as { id: number; email: string };
        return decoded;
    } catch {
        return null;
    }
}
