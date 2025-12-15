import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { HomeBanner } from '@/lib/db/types';

/**
 * GET /api/banners
 * Obtiene los banners activos para el slider principal
 */
export async function GET() {
  try {
    const result = await query<HomeBanner>(
      `SELECT 
        id,
        title,
        subtitle,
        description,
        image_url,
        link_url,
        link_text,
        display_order,
        is_active
      FROM banners
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Transformar para compatibilidad con el componente HeroSlider
    const slides = result.rows.map(banner => ({
      id: banner.id,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image_url,
      link: banner.link_url || '#',
      linkText: banner.link_text || 'Más información',
    }));

    return NextResponse.json({
      success: true,
      data: result.rows,
      slides: slides,
    });

  } catch (error) {
    console.error('Error al obtener banners:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener los banners',
      },
      { status: 500 }
    );
  }
}
