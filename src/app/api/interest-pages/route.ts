import { NextResponse } from 'next/server';
import { query, handleDbError } from '@/lib/db/postgres';
import type { InterestPage } from '@/lib/db/types';

/**
 * GET /api/interest-pages
 * Obtiene las páginas de interés para la sección inferior del home
 */
export async function GET() {
  try {
    const result = await query<InterestPage>(
      `SELECT 
        id,
        title,
        description,
        image_url,
        link_url,
        display_order,
        is_active
      FROM interest_pages
      WHERE is_active = true
      ORDER BY display_order ASC`
    );

    // Transformar para compatibilidad con componentes
    const pages = result.rows.map(page => ({
      id: page.id,
      title: page.title,
      description: page.description || '',
      image: page.image_url || '',
      link: page.link_url || '#',
    }));

    return NextResponse.json({
      success: true,
      data: result.rows,
      pages: pages,
    });

  } catch (error) {
    console.error('Error al obtener páginas de interés:', error);
    const errorResult = handleDbError(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorResult.error || 'Error al obtener las páginas de interés',
      },
      { status: 500 }
    );
  }
}
