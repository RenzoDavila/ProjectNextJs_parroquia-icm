import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/gallery/images/:id
 * Obtener una imagen específica
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const result = await query(
      `SELECT gi.*, ga.title as album_title 
       FROM gallery_images gi
       LEFT JOIN gallery_albums ga ON gi.album_id = ga.id
       WHERE gi.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al obtener imagen:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/gallery/images/:id
 * Actualizar una imagen
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { album_id, title, description, image_url, thumbnail_url, display_order, is_approved } = body;

    const result = await query(
      `UPDATE gallery_images SET
        album_id = COALESCE($1, album_id),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        image_url = COALESCE($4, image_url),
        thumbnail_url = COALESCE($5, thumbnail_url),
        display_order = COALESCE($6, display_order),
        is_approved = COALESCE($7, is_approved)
       WHERE id = $8
       RETURNING *`,
      [album_id, title, description, image_url, thumbnail_url, display_order, is_approved, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Imagen actualizada exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar imagen:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/gallery/images/:id
 * Eliminar una imagen
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const result = await query(
      `DELETE FROM gallery_images WHERE id = $1 RETURNING id, image_url`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Imagen eliminada exitosamente',
      // Devolver URL por si se necesita eliminar de Cloudinary
      deletedImageUrl: result.rows[0].image_url,
    });

  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
