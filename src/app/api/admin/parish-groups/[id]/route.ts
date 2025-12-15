import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/parish-groups/:id
 * Obtener un grupo específico
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM parish_groups WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Grupo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener grupo:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/parish-groups/:id
 * Actualizar un grupo parroquial
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { 
      name, description, meeting_day, meeting_time, category,
      contact_person, contact_email, contact_phone, display_order, is_active 
    } = body;

    const result = await query(
      `UPDATE parish_groups SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        meeting_day = COALESCE($3, meeting_day),
        meeting_time = COALESCE($4, meeting_time),
        category = COALESCE($5, category),
        contact_person = COALESCE($6, contact_person),
        contact_email = COALESCE($7, contact_email),
        contact_phone = COALESCE($8, contact_phone),
        display_order = COALESCE($9, display_order),
        is_active = COALESCE($10, is_active)
       WHERE id = $11
       RETURNING *`,
      [
        name, description, meeting_day, meeting_time, category,
        contact_person, contact_email, contact_phone, display_order, is_active, id
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Grupo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Grupo actualizado exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar grupo:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/parish-groups/:id
 * Eliminar un grupo parroquial
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM parish_groups WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Grupo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Grupo eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
