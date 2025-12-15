import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/social-media/:id
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT * FROM social_media WHERE id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Red social no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener red social:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/social-media/:id
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { platform, platform_name, url, icon_name, display_order, is_active, show_in_header, show_in_footer } = body;

    const result = await query(
      `UPDATE social_media SET
        platform = COALESCE($1, platform),
        platform_name = COALESCE($2, platform_name),
        url = COALESCE($3, url),
        icon_name = COALESCE($4, icon_name),
        display_order = COALESCE($5, display_order),
        is_active = COALESCE($6, is_active),
        show_in_header = COALESCE($7, show_in_header),
        show_in_footer = COALESCE($8, show_in_footer)
       WHERE id = $9
       RETURNING *`,
      [platform, platform_name, url, icon_name, display_order, is_active, show_in_header, show_in_footer, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Red social no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Red social actualizada exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar red social:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/social-media/:id
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM social_media WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Red social no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Red social eliminada exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar red social:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
