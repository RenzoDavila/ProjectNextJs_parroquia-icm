import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { GalleryAlbum } from '@/lib/db/types';

/**
 * GET /api/admin/gallery/albums
 * Lista todos los álbumes (incluyendo inactivos)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let sql = `
      SELECT 
        ga.*,
        COUNT(gi.id) as image_count
      FROM gallery_albums ga
      LEFT JOIN gallery_images gi ON ga.id = gi.album_id
    `;
    
    const params: (string | number)[] = [];
    
    if (year) {
      sql += ` WHERE ga.year = $1`;
      params.push(parseInt(year));
    }
    
    sql += ` GROUP BY ga.id ORDER BY ga.year DESC, ga.display_order ASC`;

    const result = await query<GalleryAlbum & { image_count: number }>(sql, params);

    // Obtener años disponibles
    const yearsResult = await query<{ year: number }>(
      `SELECT DISTINCT year FROM gallery_albums ORDER BY year DESC`
    );

    return NextResponse.json({
      success: true,
      data: result.rows,
      total: result.rowCount,
      years: yearsResult.rows.map(r => r.year),
    });

  } catch (error) {
    console.error('Error al obtener álbumes:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/gallery/albums
 * Crear un nuevo álbum
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { year, month, day, title, description, cover_image_url, date_event, display_order, is_active } = body;

    if (!year || !title) {
      return NextResponse.json(
        { success: false, error: 'Año y título son obligatorios' },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO gallery_albums 
        (year, month, day, title, description, cover_image_url, date_event, display_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        year,
        month || null,
        day || null,
        title,
        description || null,
        cover_image_url || null,
        date_event || null,
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Álbum creado exitosamente',
      data: result.rows[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear álbum:', error);
    const errorResult = handleDbError(error);
    return NextResponse.json(
      { success: false, error: errorResult.error },
      { status: 500 }
    );
  }
}
