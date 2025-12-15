import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { TeamMember } from '@/lib/db/types';

/**
 * GET /api/admin/team
 * Lista todos los miembros del equipo (incluyendo inactivos)
 */
export async function GET() {
  try {
    const result = await query<TeamMember>(
      `SELECT 
        id,
        name,
        role,
        bio,
        image_url,
        email,
        phone,
        display_order,
        is_active,
        created_at,
        updated_at
      FROM team_members
      ORDER BY display_order ASC, created_at DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener equipo:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/team
 * Crear un nuevo miembro del equipo
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, role, bio, image_url, email, phone, display_order, is_active } = body;

    if (!name || !role) {
      return NextResponse.json(
        { success: false, error: 'Nombre y cargo son obligatorios' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO team_members 
        (name, role, bio, image_url, email, phone, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        role,
        bio || null,
        image_url || null,
        email || null,
        phone || null,
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Miembro creado exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear miembro:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
