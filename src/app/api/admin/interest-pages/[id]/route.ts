import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/interest-pages/[id]
 * Obtener una página de interés específica
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM interest_pages WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Página de interés no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener página de interés:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/interest-pages/[id]
 * Actualizar una página de interés
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, image_url, link_url, display_order, is_active } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'El título es obligatorio' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE interest_pages 
       SET title = $1, description = $2, image_url = $3, link_url = $4, 
           display_order = $5, is_active = $6
       WHERE id = $7
       RETURNING *`,
      [title, description || null, image_url || null, link_url || '#', 
       display_order || 0, is_active !== false, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Página de interés no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Página de interés actualizada exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar página de interés:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/interest-pages/[id]
 * Eliminar una página de interés
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    
    const result = await query(
      `DELETE FROM interest_pages WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Página de interés no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Página de interés eliminada exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar página de interés:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
