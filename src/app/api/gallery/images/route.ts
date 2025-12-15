import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { GalleryImage } from '@/lib/db/types';

/**
 * GET /api/gallery/images
 * Obtiene las imágenes de la galería
 * 
 * Query params:
 * - album_id: Filtrar por álbum (obligatorio si no se quiere todas)
 * - approved: Filtrar solo aprobadas (default: true)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('album_id');
    const approvedOnly = searchParams.get('approved') !== 'false';

    let sql = `
      SELECT 
        gi.id,
        gi.album_id,
        gi.title,
        gi.description,
        gi.image_url,
        gi.thumbnail_url,
        gi.display_order,
        gi.is_approved,
        gi.uploaded_by,
        gi.created_at,
        ga.title as album_title,
        ga.year as album_year
      FROM gallery_images gi
      LEFT JOIN gallery_albums ga ON gi.album_id = ga.id
      WHERE 1=1
    `;
    
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;
    
    if (approvedOnly) {
      sql += ` AND gi.is_approved = true`;
    }
    
    if (albumId) {
      sql += ` AND gi.album_id = $${paramIndex}`;
      params.push(parseInt(albumId));
      paramIndex++;
    }
    
    sql += ` ORDER BY gi.display_order ASC, gi.created_at DESC`;

    const result = await query<GalleryImage & { album_title: string; album_year: number }>(sql, params);

    // Transformar para compatibilidad con componentes
    const images = result.rows.map(image => ({
      id: image.id,
      albumId: image.album_id,
      title: image.title || '',
      description: image.description || '',
      url: image.image_url,
      thumbnail: image.thumbnail_url || image.image_url,
      albumTitle: image.album_title,
      albumYear: image.album_year,
    }));

    return NextResponse.json({
      success: true,
      data: result.rows,
      images: images,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener las imágenes',
      },
      { status: 500 }
    );
  }
}
