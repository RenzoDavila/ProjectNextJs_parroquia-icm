import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { GalleryImage } from '@/lib/db/types';

/**
 * GET /api/admin/gallery/images
 * Lista todas las imágenes
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const albumId = searchParams.get('album_id');

    let sql = `
      SELECT 
        gi.*,
        ga.title as album_title,
        ga.year as album_year
      FROM gallery_images gi
      LEFT JOIN gallery_albums ga ON gi.album_id = ga.id
    `;
    
    const params: (string | number)[] = [];
    
    if (albumId) {
      sql += ` WHERE gi.album_id = $1`;
      params.push(parseInt(albumId));
    }
    
    sql += ` ORDER BY gi.album_id, gi.display_order ASC`;

    const result = await query<GalleryImage & { album_title: string; album_year: number }>(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
    });

  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/gallery/images
 * Subir una o más imágenes a un álbum
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Soporta tanto una imagen como un array de imágenes
    const images = Array.isArray(body) ? body : [body];
    const results = [];

    for (const img of images) {
      const { album_id, title, description, image_url, thumbnail_url, display_order, is_approved } = img;

      if (!album_id || !image_url) {
        continue; // Skip invalid entries
      }

      const result = await query(
        `INSERT INTO gallery_images 
          (album_id, title, description, image_url, thumbnail_url, display_order, is_approved)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          album_id,
          title || null,
          description || null,
          image_url,
          thumbnail_url || null,
          display_order || 0,
          is_approved !== false,
        ]
      );
      results.push(result.rows[0]);
    }

    if (results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se pudieron agregar imágenes. album_id e image_url son obligatorios.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${results.length} imagen(es) agregada(s) exitosamente`,
      data: results,
    }, { status: 201 });

  } catch (error) {
    console.error('Error al agregar imagen:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
