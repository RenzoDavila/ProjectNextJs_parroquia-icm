import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/home-services/[id]
 * Obtener un servicio específico
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM home_services WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener servicio:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/home-services/[id]
 * Actualizar un servicio
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, icon, link_url, display_order, is_active } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'El título es obligatorio' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE home_services 
       SET title = $1, description = $2, icon = $3, link_url = $4, 
           display_order = $5, is_active = $6
       WHERE id = $7
       RETURNING *`,
      [title, description || null, icon || 'info', link_url || null, 
       display_order || 0, is_active !== false, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/home-services/[id]
 * Eliminar un servicio
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    
    const result = await query(
      `DELETE FROM home_services WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Servicio eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
