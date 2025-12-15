import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/team/:id
 * Obtener un miembro específico
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM team_members WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener miembro:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/team/:id
 * Actualizar un miembro del equipo
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { name, role, bio, image_url, email, phone, display_order, is_active } = body;

    const result = await query(
      `UPDATE team_members SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        bio = COALESCE($3, bio),
        image_url = COALESCE($4, image_url),
        email = COALESCE($5, email),
        phone = COALESCE($6, phone),
        display_order = COALESCE($7, display_order),
        is_active = COALESCE($8, is_active),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [name, role, bio, image_url, email, phone, display_order, is_active, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Miembro actualizado exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar miembro:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/team/:id
 * Eliminar un miembro del equipo
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM team_members WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Miembro eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar miembro:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
