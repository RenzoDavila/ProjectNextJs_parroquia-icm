import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/gallery/albums/:id
 * Obtener un álbum específico con sus imágenes
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const albumResult = await query(
      `SELECT * FROM gallery_albums WHERE id = $1`,
      [id]
    );

    if (albumResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    // Obtener imágenes del álbum
    const imagesResult = await query(
      `SELECT * FROM gallery_images WHERE album_id = $1 ORDER BY display_order ASC`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...albumResult.rows[0],
        images: imagesResult.rows,
      },
    });

  } catch (error) {
    console.error('Error al obtener álbum:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/gallery/albums/:id
 * Actualizar un álbum
 */
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { year, month, day, title, description, cover_image_url, date_event, display_order, is_active } = body;

    const result = await query(
      `UPDATE gallery_albums SET
        year = COALESCE($1, year),
        month = COALESCE($2, month),
        day = COALESCE($3, day),
        title = COALESCE($4, title),
        description = COALESCE($5, description),
        cover_image_url = COALESCE($6, cover_image_url),
        date_event = COALESCE($7, date_event),
        display_order = COALESCE($8, display_order),
        is_active = COALESCE($9, is_active),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [year, month, day, title, description, cover_image_url, date_event, display_order, is_active, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Álbum actualizado exitosamente',
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Error al actualizar álbum:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/gallery/albums/:id
 * Eliminar un álbum y todas sus imágenes
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Las imágenes se eliminan automáticamente por CASCADE
    const result = await query(
      `DELETE FROM gallery_albums WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Álbum eliminado exitosamente',
    });

  } catch (error) {
    console.error('Error al eliminar álbum:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
