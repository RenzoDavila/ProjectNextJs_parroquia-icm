import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/banners/:id
 * Obtener un banner específico
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM banners WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Banner no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener banner:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/banners/:id
 * Actualizar un banner
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { title, subtitle, description, image_url, link_url, link_text, display_order, is_active } = body;

    const result = await query(
      `UPDATE banners SET
        title = COALESCE($1, title),
        subtitle = COALESCE($2, subtitle),
        description = COALESCE($3, description),
        image_url = COALESCE($4, image_url),
        link_url = COALESCE($5, link_url),
        link_text = COALESCE($6, link_text),
        display_order = COALESCE($7, display_order),
        is_active = COALESCE($8, is_active),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        title,
        subtitle,
        description,
        image_url,
        link_url,
        link_text,
        display_order,
        is_active,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Banner no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Banner actualizado exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar banner:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/banners/:id
 * Eliminar un banner
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM banners WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Banner no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Banner eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar banner:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
