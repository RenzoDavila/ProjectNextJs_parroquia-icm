import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { GalleryAlbum } from '@/lib/db/types';

/**
 * GET /api/gallery/albums
 * Obtiene los álbumes de la galería
 * 
 * Query params:
 * - year: Filtrar por año
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let sql = `
      SELECT 
        id,
        year,
        month,
        day,
        title,
        description,
        cover_image_url,
        date_event,
        display_order,
        is_active,
        created_at
      FROM gallery_albums
      WHERE is_active = true
    `;
    
    const params: (string | number)[] = [];
    
    if (year) {
      sql += ` AND year = $1`;
      params.push(parseInt(year));
    }
    
    sql += ` ORDER BY year DESC, display_order ASC, created_at DESC`;

    const result = await query<GalleryAlbum>(sql, params);

    // Transformar para compatibilidad con componentes
    const albums = result.rows.map(album => ({
      id: album.id,
      year: album.year,
      title: album.title,
      description: album.description || '',
      coverImage: album.cover_image_url || '/images/placeholder-gallery.jpg',
      date: album.date_event,
    }));

    // Agrupar por año
    const groupedByYear = result.rows.reduce((acc, album) => {
      const y = album.year;
      if (!acc[y]) {
        acc[y] = [];
      }
      acc[y].push(album);
      return acc;
    }, {} as Record<number, GalleryAlbum[]>);

    // Obtener años disponibles
    const years = [...new Set(result.rows.map(a => a.year))].sort((a, b) => b - a);

    return NextResponse.json({
      success: true,
      data: result.rows,
      albums: albums,
      byYear: groupedByYear,
      years: years,
    });

  } catch (error) {
    console.error('Error al obtener álbumes:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los álbumes',
      },
      { status: 500 }
    );
  }
}
